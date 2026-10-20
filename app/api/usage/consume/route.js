import crypto from "node:crypto";
import { cookies } from "next/headers";
import { updateStore } from "../../../../lib/store";
import { rateLimit, rateLimitResponse, requestBodyTooLarge } from "../../../../lib/security";
export const runtime = "nodejs";
const COOKIE="tn_usage_id", DAILY_LIMIT=3;
function signingKey(){return process.env.USAGE_SIGNING_SECRET||"";}
function makeToken(id){const key=signingKey();if(!key)throw new Error("Usage signing secret is not configured.");return `${id}.${crypto.createHmac("sha256",key).update(id).digest("base64url")}`;}
function readToken(token){const key=signingKey();if(!key||!token)return null;const [id,sig]=token.split(".");if(!id||!sig||!/^[a-f0-9-]{20,80}$/i.test(id))return null;const expected=crypto.createHmac("sha256",key).update(id).digest();let actual;try{actual=Buffer.from(sig,"base64url");}catch{return null;}return actual.length===expected.length&&crypto.timingSafeEqual(actual,expected)?id:null;}
export async function POST(request){
 const rate=await rateLimit(request,{limit:30,windowMs:60000,scope:"usage"});if(!rate.allowed)return rateLimitResponse(rate.retryAfter);
 if(requestBodyTooLarge(request,2048))return Response.json({error:"Request too large."},{status:413});
 const key=signingKey();if(key.length<32)return Response.json({error:"Usage security is not configured. Set USAGE_SIGNING_SECRET to a random secret of at least 32 characters."},{status:503,headers:{"Cache-Control":"no-store"}});
 let body;try{body=await request.json();}catch{return Response.json({error:"Invalid request."},{status:400});}
 const slug=String(body.slug||"").replace(/[^a-z0-9-]/g,"").slice(0,100);const action=["reserve","commit","release"].includes(body.action)?body.action:"invalid";if(!slug)return Response.json({error:"Invalid tool."},{status:400});
 const jar=await cookies();let id=readToken(jar.get(COOKIE)?.value);const newIdentity=!id;if(!id)id=crypto.randomUUID();const day=new Date().toISOString().slice(0,10);const identityHash=crypto.createHmac("sha256",key).update(id).digest("hex");
 const reservationId = typeof body.reservationId === "string" && /^[a-f0-9-]{20,80}$/i.test(body.reservationId) ? body.reservationId : null;
 let outcome;
 if(action==="reserve") outcome=await updateStore(store=>{let row=store.usage.find(x=>x.identityHash===identityHash&&x.day===day);if(!row){row={identityHash,day,count:0,reservations:[],lastUsedAt:new Date().toISOString(),tools:[]};store.usage.unshift(row);}row.reservations=Array.isArray(row.reservations)?row.reservations:[];if(row.count+row.reservations.length>=DAILY_LIMIT)return{allowed:false,used:row.count,remaining:0,resetDay:day,error:"You have used or started all 3 free tool runs for today. Please come back tomorrow."};const newReservation=crypto.randomUUID();row.reservations.push(newReservation);row.lastUsedAt=new Date().toISOString();return{allowed:true,used:row.count,remaining:DAILY_LIMIT-row.count-row.reservations.length,resetDay:day,reservationId:newReservation};});
 else if(action==="commit" || action==="release") { if(!reservationId)return Response.json({error:"Missing usage reservation."},{status:400,headers:{"Cache-Control":"no-store"}}); outcome=await updateStore(store=>{const row=store.usage.find(x=>x.identityHash===identityHash&&x.day===day);if(!row)return{allowed:false,error:"Usage reservation expired. Please refresh and try again."};row.reservations=Array.isArray(row.reservations)?row.reservations:[];const idx=row.reservations.indexOf(reservationId);if(idx<0)return{allowed:action==="release",used:row.count,remaining:Math.max(0,DAILY_LIMIT-row.count-row.reservations.length),resetDay:day};row.reservations.splice(idx,1);if(action==="commit"){row.count+=1;row.tools=[...(row.tools||[]).slice(-19),slug];}row.lastUsedAt=new Date().toISOString();return{allowed:true,used:row.count,remaining:Math.max(0,DAILY_LIMIT-row.count-row.reservations.length),resetDay:day};}); }
 else return Response.json({error:"Invalid action."},{status:400});
 const response=Response.json(outcome.allowed?outcome:{...outcome,error:"You have used or started all 3 free tool runs for today. Please come back tomorrow."},{status:outcome.allowed?200:429,headers:{"Cache-Control":"no-store"}});
 if(newIdentity)response.headers.append("Set-Cookie",`${COOKIE}=${makeToken(id)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000${process.env.NODE_ENV==="production"?"; Secure":""}`);return response;
}
