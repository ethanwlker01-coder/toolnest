 "use client";

import { useMemo, useState } from "react";
import InteractiveTools from "./InteractiveTools";

const fieldSets = {
  "emi-calculator": [["principal","Loan amount (₹)", "number", "100000"],["rate","Annual interest rate (%)","number","12"],["months","Loan tenure (months)","number","24"]],
  "mortgage-calculator": [["principal","Loan amount","number","250000"],["rate","Annual interest rate (%)","number","6.5"],["years","Loan tenure (years)","number","30"]],
  "compound-interest-calculator": [["principal","Initial amount","number","10000"],["monthly","Monthly contribution","number","1000"],["rate","Annual return (%)","number","8"],["years","Years","number","10"]],
  "percentage-calculator": [["base","Base number","number","85"],["percent","Percentage (%)","number","15"]],
  "bmi-calculator": [["weight","Weight (kg)","number","46"],["height","Height (cm)","number","165"]],
  "age-calculator": [["date","Date of birth","date","2006-12-25"]],
  "gst-calculator": [["amount","Amount (₹)","number","1000"],["rate","GST rate (%)","number","18"],["mode","Mode (type add or remove)","text","add"]],
  "bill-splitter": [["amount","Bill total","number","2500"],["people","Number of people","number","4"],["tip","Tip (%)","number","10"]],
   "scientific-calculator": [["expression","Math expression (e.g. sqrt(81)+sin(pi/2))","text","sqrt(81)+sin(pi/2)"]],
  "css-gradient-generator": [["from","Start HEX color","text","#155e75"],["to","End HEX color","text","#67e8f9"],["angle","Angle (degrees)","number","135"]],
  "unit-converter": [["value","Value to convert","number","10"],["fromUnit","From unit (m, km, cm, kg, g, lb, C, F)","text","km"],["toUnit","To unit","text","m"]],
  "currency-converter": [["amount","Amount","number","100"],["fromCurrency","From currency (USD/EUR/INR/GBP)","text","USD"],["toCurrency","To currency","text","INR"]],
  "break-even-calculator": [["fixed","Fixed costs","number","50000"],["price","Selling price per unit","number","500"],["variable","Variable cost per unit","number","250"]],
  "roi-calculator": [["invested","Initial investment","number","10000"],["final","Final value","number","13500"],["years","Holding period (years)","number","2"]],
  "fuel-cost-calculator": [["distance","Trip distance (km)","number","250"],["mileage","Vehicle mileage (km/l)","number","15"],["fuelPrice","Fuel price per litre (₹)","number","105"]],
  "electricity-bill-calculator": [["units","Electricity units (kWh)","number","250"],["rate","Rate per unit (₹)","number","7.5"],["fixed","Fixed charges (₹)","number","50"]],
  "age-difference-calculator": [["date1","First date","date","2000-01-01"],["date2","Second date","date","2026-10-20"]],
  "date-calculator": [["date","Start date","date","2026-10-20"],["days","Days to add (negative subtracts)","number","30"]],
  "child-bmi-calculator": [["weight","Weight (kg)","number","25"],["height","Height (cm)","number","125"],["age","Age in years","number","8"],["sex","Sex for growth reference (m/f)","text","f"]],
  "unlock-pdf": [["password","PDF open password","text",""]],
  "social-media-downloader": [["url","Public media URL","text","https://example.com/video"],["format","Output format (video/audio)","text","video"]],
  "pregnancy-due-date-calculator": [["date","First day of last menstrual period","date","2026-08-01"]],
  "calorie-calculator": [["weight","Weight (kg)","number","60"],["height","Height (cm)","number","165"],["age","Age in years","number","25"],["sex","Sex for formula (m/f)","text","f"],["activity","Activity multiplier (1.2–1.9)","number","1.45"]],
  "water-intake-calculator": [["weight","Weight (kg)","number","60"]],
  "sleep-calculator": [["time","Time to fall asleep (HH:MM)","text","22:30"],["cycles","Sleep cycles (3–6)","number","5"]],
   "cgpa-to-percentage": [["cgpa","CGPA","number","8.2"],["multiplier","CGPA multiplier (check your university)","number","9.5"]],
  "hindi-typing-test": [["minutes","Time spent typing (minutes)","number","1"]],
  "reading-speed-test": [["words","Words read (or paste the text below)","number","500"],["minutes","Reading time (minutes)","number","5"]],
  "typing-speed-test": [["minutes","Test duration (minutes)","number","1"]],
  "reaction-time-test": [["tries","Number of trials (1–10)","number","5"]],
  "fuel-cost-calculator": [["distance","Trip distance (km)","number","250"],["mileage","Vehicle mileage (km/l)","number","15"],["fuelPrice","Fuel price per litre (₹)","number","105"]],
  "number-base-converter": [["value","Number to convert","text","255"],["fromBase","From base (2/8/10/16)","number","10"],["toBase","To base (2/8/10/16)","number","16"]],
  "ip-subnet-calculator": [["ip","IPv4 address","text","192.168.1.10"],["cidr","CIDR prefix (0–32)","number","24"]],
  "number-to-words": [["value","Number","number","12345"]],
  "random-number-generator": [["min","Minimum","number","1"],["max","Maximum","number","100"],["count","How many numbers (1–100)","number","1"]],
  "stopwatch-timer": [["time","Countdown duration (seconds)","number","60"]],
  "countdown-timer": [["time","Countdown duration (seconds)","number","60"]],
  "pomodoro-timer": [["focus","Focus minutes","number","25"],["break","Break minutes","number","5"]],
  "coin-flip": [["count","Number of flips (1–100)","number","1"]],
  "dice-roller": [["count","Number of dice","number","2"],["sides","Sides per die","number","6"]],
  "anagram-solver": [["word","Word or phrase","text","listen"],["candidate","Candidate word/phrase to check","text","silent"]],
  "word-guessing-game": [["guess","Enter a five-letter guess","text","crane"]],
  "social-media-caption-generator": [["topic","Post topic","text","new cafe launch"],["platform","Platform","text","Instagram"],["tone","Tone","text","friendly"]],
  "content-calendar": [["topic","Business or content topic","text","local bakery"],["days","Number of days (7–30)","number","14"]],
  "email-signature-generator": [["name","Name","text","Your Name"],["role","Role / title","text","Freelancer"],["email","Email address","text","you@example.com"],["phone","Phone (optional)","text",""]],
  "invoice-generator": [["name","Seller / business name","text","Your Business"],["client","Client name","text","Client Name"],["invoice","Invoice number","text","INV-001"],["amount","Subtotal (₹)","number","10000"],["rate","GST rate (%)","number","18"]],
  "whatsapp-link-generator": [["phone","Phone with country code, digits only","text","919876543210"],["message","Prefilled message","text","Hello, I would like to know more."]],
  "utm-builder": [["url","Landing page URL","text","https://example.com/"],["source","utm_source","text","google"],["medium","utm_medium","text","cpc"],["campaign","utm_campaign","text","launch"],["term","utm_term (optional)","text",""],["content","utm_content (optional)","text",""]],
  "serp-preview": [["title","Page title","text","Your Page Title"],["description","Meta description","text","Describe what the page does and why it helps."],["url","URL","text","https://example.com/page"]],
  "meta-tag-generator": [["title","Page title","text","Page Title"],["description","Meta description","text","Helpful description of the page."],["url","Canonical URL","text","https://example.com/page"],["image","Social image URL (optional)","text",""]],
  "schema-markup-generator": [["name","Business/site name","text","Example Business"],["url","Website URL","text","https://example.com"],["type","Schema type (Organization/LocalBusiness/WebSite)","text","Organization"]],
  "robots-txt-generator": [["allow","Allow path","text","/"],["disallow","Disallow path","text","/admin/"],["sitemap","Sitemap URL","text","https://example.com/sitemap.xml"]],
  "hreflang-generator": [["pages","Language=URL pairs, comma-separated (e.g. en=https://example.com/en/, hi=https://example.com/hi/)","text","en=https://example.com/en/, hi=https://example.com/hi/"]],
  "ads-txt-generator": [["domain","Advertising system domain","text","example.com"],["publisher","Publisher ID","text","pub-0000000000000000"],["relationship","Relationship (DIRECT/RESELLER)","text","DIRECT"],["cert","Certification ID (optional)","text",""]],
  "keyword-density-checker": [["keyword","Target keyword (optional)","text","online tool"]],
  "remove-duplicate-lines": [["caseSensitive","Case-sensitive? enter yes/no","text","no"]],
  "regex-find-replace": [["pattern","Regex pattern","text","foo"],["replacement","Replacement text","text","bar"],["flags","Regex flags","text","g"]],
  "regex-tester": [["pattern","Regular expression","text","\\bcat\\b"],["flags","Flags","text","gi"]],
  "favicon-generator": [["size","Icon size (px)","number","256"]],
  "image-resizer": [["width","Output width (px)","number","800"],["height","Output height (px)","number","600"]],
  "image-compressor": [["quality","Quality (0.1–1.0)","number","0.8"]],
  "crop-image": [["x","Left offset (px)","number","0"],["y","Top offset (px)","number","0"],["width","Crop width (px)","number","400"],["height","Crop height (px)","number","400"]],
  "color-converter": [["color","Color value (#hex, rgb or hsl)","text","#155e75"]],
  "color-palette-generator": [["color","Base HEX color","text","#155e75"]],
  "barcode-generator": [["value","Barcode text/numbers","text","123456789012"],["format","Format (CODE128/EAN13/UPC)","text","CODE128"]],
  "qr-code-generator": [["value","Text or URL for QR code","text","https://example.com"]],
  "password-generator": [["length","Password length (8–128)","number","20"],["symbols","Include symbols? yes/no","text","yes"]],
  "lorem-ipsum-generator": [["paragraphs","Paragraphs (1–20)","number","3"],["words","Approx words per paragraph","number","50"]],
  "meme-generator": [["top","Top text","text","WHEN THE TOOL WORKS"],["bottom","Bottom text","text","NO BACKEND NEEDED"]],
  "pomodoro-timer": [["focus","Focus minutes","number","25"],["break","Break minutes","number","5"]]
};

const textTools = new Set([
  "word-counter","character-counter","case-converter","lorem-ipsum-generator","regex-find-replace",
  "text-diff-checker","remove-duplicate-lines","markdown-to-text","markdown-table-generator",
  "json-to-markdown-table","email-signature-generator","number-to-words","emoji-picker","anagram-solver",
  "json-formatter","base64-encode-decode","url-encoder-decoder","regex-tester","unix-timestamp-converter",
  "hash-generator","jwt-decoder","number-base-converter","code-minifier","css-gradient-generator",
  "sql-formatter","meta-tag-generator","schema-markup-generator","robots-txt-generator","serp-preview",
  "keyword-density-checker","hreflang-generator","utm-builder","ads-txt-generator","whatsapp-link-generator",
  "content-calendar","social-media-caption-generator","favicon-generator","color-converter",
  "color-palette-generator","password-generator","random-number-generator","dice-roller","coin-flip",
  "stopwatch-timer","countdown-timer","age-calculator","age-difference-calculator","date-calculator",
  "break-even-calculator","roi-calculator","percentage-calculator","gst-calculator","cgpa-to-percentage",
  "invoice-generator","sleep-calculator","water-intake-calculator","calorie-calculator","bmi-calculator",
  "child-bmi-calculator","pregnancy-due-date-calculator","fuel-cost-calculator","electricity-bill-calculator",
  "unit-converter","currency-converter","emi-calculator","mortgage-calculator","compound-interest-calculator",
  "bill-splitter","scientific-calculator","reading-speed-test","typing-speed-test","ip-subnet-calculator",
  "reaction-time-test","pomodoro-timer","anagram-solver","break-even-calculator","age-difference-calculator"
]);
const integrationRequired = new Set(["background-remover","image-upscaler","ai-content-detector","ai-paraphraser-summarizer","social-media-downloader"]);

const fileTools = new Set([
  "pdf-to-images","merge-pdf","split-pdf","compress-pdf","images-to-pdf","word-to-pdf",
  "organize-pdf-pages","watermark-pdf","unlock-pdf","ocr-pdf","pdf-to-text",
  "image-format-converter","webp-to-png","heic-to-jpg","image-compressor","image-resizer",
  "crop-image","svg-to-png","favicon-generator","background-remover","image-upscaler","meme-generator",
  "photo-collage-maker","exif-remover","bulk-image-converter","video-to-audio-converter"
]);

const fieldLabelOverrides = {
  "text-diff-checker":"Paste the first text in the main box and the second text below.",
  "markdown-table-generator":"Paste CSV/TSV rows in the main box. The first row becomes the table header.",
  "json-to-markdown-table":"Paste a JSON array of objects.",
  "json-formatter":"Paste JSON in the main box.",
  "base64-encode-decode":"Paste text or Base64 in the main box. Add encode or decode in the option below.",
  "url-encoder-decoder":"Paste text or URL component in the main box.",
  "hash-generator":"Paste text to hash in the main box.",
  "jwt-decoder":"Paste a JWT in the main box.",
  "code-minifier":"Paste HTML, CSS or JavaScript in the main box.",
  "sql-formatter":"Paste SQL in the main box.",
  "markdown-to-text":"Paste Markdown in the main box.",
  "text-diff-checker":"Text A"
};

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function saveText(text, filename="result.txt", type="text/plain;charset=utf-8") {
  saveBlob(new Blob([text], { type }), filename);
}
function escHtml(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function slugify(v) { return String(v).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
function countWords(s) { return (s.trim().match(/\b[\p{L}\p{N}'’-]+\b/gu) || []).length; }
function csvEscape(v) { return '"' + String(v ?? "").replace(/"/g,'""') + '"'; }
function indianWords(n) {
  if (!Number.isFinite(n)) return "Enter a valid number";
  if (Math.abs(n) > 999999999999) return "Number too large for this converter";
  if (n === 0) return "Zero";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function two(x) { if(x<20) return ones[x]; return tens[Math.floor(x/10)] + (x%10 ? " " + ones[x%10] : ""); }
  function three(x) { const h=Math.floor(x/100), r=x%100; return (h?ones[h]+" Hundred"+(r?" ":""):"")+(r?two(r):""); }
  const parts = [];
  let x=Math.floor(Math.abs(n));
  const groups = [[10000000,"Crore"],[100000,"Lakh"],[1000,"Thousand"],[1,""]];
  for (const [unit,label] of groups) { const q=Math.floor(x/unit); if(q){ parts.push((unit===1?three(q):two(q))+(label?" "+label:"")); x%=unit; } }
  return (n<0?"Minus ":"")+parts.join(" ").trim();
}
function formFields(slug) {
  return fieldSets[slug] || [];
}

export default function ToolClient({ tool }) {
  const slug = tool.slug;
  const fields = useMemo(() => formFields(slug), [slug]);
  const [values, setValues] = useState(() => Object.fromEntries(fields.map(([key,,type,def]) => [key, def])));
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [mode, setMode] = useState(["base64-encode-decode","url-encoder-decoder"].includes(slug) ? "encode" : slug === "hash-generator" ? "SHA-256" : "default");
  const [fileList, setFileList] = useState([]);
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showExtra, setShowExtra] = useState(false);

  const isFileTool = fileTools.has(slug);
  const expectsText = !isFileTool && !fields.length;
  const setField = (key, value) => setValues(prev => ({...prev, [key]: value}));
  const result = (content) => { setOutput(typeof content === "string" ? content : JSON.stringify(content, null, 2)); setError(""); };
  if (["stopwatch-timer","countdown-timer","pomodoro-timer","reaction-time-test","typing-speed-test","hindi-typing-test","word-guessing-game","2048-game","minesweeper","sudoku","memory-game"].includes(slug)) return <InteractiveTools slug={slug} />;

  async function processSocialMediaUrl() {
    const url = String(values.url || "").trim();
    const format = String(values.format || "video").trim().toLowerCase();
    if (!/^https?:\/\//i.test(url)) throw new Error("Enter a valid public http(s) URL.");
    if (!["video","audio"].includes(format)) throw new Error("Choose video or audio output.");
    const response = await fetch("/api/media-download", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, format })
    });
    if (!response.ok) {
      let message = "Download failed. This URL may be unsupported or the host may lack media-processing tools.";
      try { const body = await response.json(); if (body.error) message = body.error; } catch {}
      throw new Error(message);
    }
    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="([^"]+)"/i);
    saveBlob(blob, match?.[1] || (format === "audio" ? "media-audio.mp3" : "media-video.mp4"));
    result("Download prepared. Use only public media you own or are authorized to download. Server requires yt-dlp and ffmpeg; platform rules still apply.");
  }

  async function processFiles() {
    if (!fileList.length) throw new Error("Choose one or more files first.");
    const file = fileList[0];
    const imageSlugs = ["image-format-converter","webp-to-png","heic-to-jpg","image-compressor","image-resizer","crop-image","svg-to-png","favicon-generator","exif-remover","meme-generator","photo-collage-maker","bulk-image-converter"];
    if (slug === "photo-collage-maker") {
      if (fileList.length < 2) throw new Error("Choose at least two photos to make a collage.");
      const loaded = await Promise.all(fileList.slice(0, 12).map(f => new Promise((resolve,reject) => {
        const image = new Image(); const url = URL.createObjectURL(f);
        image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Could not open ${f.name}.`)); };
        image.src = url;
      })));
      const cols = Math.min(3, Math.ceil(Math.sqrt(loaded.length))), rows = Math.ceil(loaded.length / cols), cell = 480, gap = 12;
      const canvas = document.createElement("canvas"); canvas.width = cols * cell + (cols + 1) * gap; canvas.height = rows * cell + (rows + 1) * gap;
      const ctx = canvas.getContext("2d"); ctx.fillStyle = "#f1f5f9"; ctx.fillRect(0,0,canvas.width,canvas.height);
      loaded.forEach((img,i) => { const x=gap+(i%cols)*(cell+gap), y=gap+Math.floor(i/cols)*(cell+gap), scale=Math.min(cell/img.naturalWidth,cell/img.naturalHeight), w=img.naturalWidth*scale,h=img.naturalHeight*scale; ctx.drawImage(img,x+(cell-w)/2,y+(cell-h)/2,w,h); });
      const blob = await new Promise(resolve => canvas.toBlob(resolve,"image/png")); if(!blob) throw new Error("Could not export collage.");
      saveBlob(blob,"photo-collage.png"); result(`Created a ${loaded.length}-photo collage and downloaded photo-collage.png.`); return;
    }
    if (imageSlugs.includes(slug)) {
      const outputs = [];
      const downloads = [];
      for (const f of fileList) {
        let source = f;
        if (slug === "heic-to-jpg" && /\.heic$/i.test(f.name)) {
          const heic2any = (await import("heic2any")).default;
          const converted = await heic2any({ blob:f, toType:"image/jpeg", quality:0.92 });
          source = Array.isArray(converted) ? converted[0] : converted;
        }
        const image = new Image();
        const objectUrl = URL.createObjectURL(source);
        await new Promise((resolve,reject)=>{ image.onload=resolve; image.onerror=()=>reject(new Error("This image could not be opened by the browser.")); image.src=objectUrl; });
        const canvas = document.createElement("canvas");
        let width = image.naturalWidth, height = image.naturalHeight;
        if (slug === "image-resizer") {
          width = Math.max(1, Number(values.width) || width); height = Math.max(1, Number(values.height) || height);
        }
        if (slug === "favicon-generator") {
          width = Math.max(16, Math.min(1024, Number(values.size) || 256)); height = width;
        }
        if (slug === "crop-image") {
          const x=Math.max(0,Number(values.x)||0), y=Math.max(0,Number(values.y)||0);
          width=Math.min(Math.max(1,Number(values.width)||400),Math.max(1,image.naturalWidth-x));
          height=Math.min(Math.max(1,Number(values.height)||400),Math.max(1,image.naturalHeight-y));
          canvas.width=width; canvas.height=height;
          canvas.getContext("2d").drawImage(image,x,y,width,height,0,0,width,height);
        } else {
          canvas.width=width; canvas.height=height;
          if (slug === "meme-generator") {
            canvas.getContext("2d").drawImage(image,0,0,width,height);
            const ctx=canvas.getContext("2d");
            ctx.font=`bold ${Math.max(18, Math.floor(width/14))}px Impact, sans-serif`;
            ctx.textAlign="center"; ctx.lineWidth=Math.max(2,width/180); ctx.strokeStyle="black"; ctx.fillStyle="white";
            const wrap=(str,y)=>{ctx.strokeText(str.toUpperCase(),width/2,y,width*.92);ctx.fillText(str.toUpperCase(),width/2,y,width*.92);};
            wrap(values.top||"",(Math.max(30,height*.1))); wrap(values.bottom||"",height-Math.max(12,height*.04));
          } else {
            canvas.getContext("2d").drawImage(image,0,0,width,height);
          }
        }
        let type="image/png", ext="png";
        if (slug==="image-format-converter") { type=mode==="jpg"?"image/jpeg":mode==="webp"?"image/webp":"image/png"; ext=mode==="jpg"?"jpg":mode==="webp"?"webp":"png"; }
        if (slug==="webp-to-png" || slug==="svg-to-png" || slug==="favicon-generator" || slug==="crop-image") { type="image/png"; ext="png"; }
        if (slug==="heic-to-jpg") { type="image/jpeg"; ext="jpg"; }
        if (slug==="image-compressor") { type="image/jpeg"; ext="jpg"; }
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,type,Math.min(.99,Math.max(.1,Number(values.quality)||.8))));
        if (!blob) throw new Error("The browser could not create the output image.");
        const outName=f.name.replace(/\.[^.]+$/,"")+`-converted.${ext}`;
        downloads.push({ name: outName, blob });
        outputs.push(`${outName}: ${Math.round(blob.size/1024)} KB`);
        URL.revokeObjectURL(objectUrl);
      }
      if (downloads.length === 1) saveBlob(downloads[0].blob, downloads[0].name);
      else if (downloads.length > 1) {
        const JSZip=(await import("jszip")).default; const zip=new JSZip();
        downloads.forEach(item=>zip.file(item.name,item.blob));
        saveBlob(await zip.generateAsync({type:"blob"}),"converted-images.zip");
      }
      result((downloads.length>1?`Created converted-images.zip with ${downloads.length} files.\n`:"Downloaded output file.\n")+outputs.join("\n"));
      return;
    }
    if (slug === "video-to-audio-converter") {
      const form = new FormData();
      form.append("file", file);
      form.append("format", "audio");
      const response = await fetch("/api/media-download", { method:"POST", body:form });
      if (!response.ok) {
        let message="Audio conversion failed. The server must have ffmpeg installed.";
        try { const body=await response.json(); if(body.error) message=body.error; } catch {}
        throw new Error(message);
      }
      saveBlob(await response.blob(), file.name.replace(/\\.[^.]+$/,"") + ".mp3");
      result("Audio conversion completed by the configured server. Use only media you own or are authorized to convert.");
      return;
    }
    if (["pdf-to-images","pdf-to-text","ocr-pdf"].includes(slug)) {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      if (slug === "pdf-to-text") {
        const pages = [];
        for (let pageNo=1; pageNo<=doc.numPages; pageNo++) {
          const page = await doc.getPage(pageNo); const content = await page.getTextContent();
          pages.push(`--- Page ${pageNo} ---\n` + content.items.map(item => item.str || "").join(" "));
        }
        const extracted = pages.join("\n\n").trim();
        if (!extracted) throw new Error("No selectable text was found. This PDF may be scanned; try OCR PDF.");
        saveText(extracted,"pdf-text.txt"); result(`Extracted text from ${doc.numPages} page(s) and downloaded pdf-text.txt.`); return;
      }
      if (slug === "pdf-to-images") {
        const pages = Math.min(doc.numPages, 20); const JSZip=(await import("jszip")).default; const zip=new JSZip();
        for (let pageNo=1; pageNo<=pages; pageNo++) {
          const page=await doc.getPage(pageNo), viewport=page.getViewport({scale:1.5}), canvas=document.createElement("canvas");
          canvas.width=Math.ceil(viewport.width); canvas.height=Math.ceil(viewport.height);
          await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
          const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png")); if(!blob) throw new Error(`Could not render page ${pageNo}.`);
          zip.file(`pdf-page-${pageNo}.png`,blob);
        }
        saveBlob(await zip.generateAsync({type:"blob"}),"pdf-pages.zip");
        result(`Rendered ${pages} page(s) as PNG files inside pdf-pages.zip. A maximum of 20 pages is exported per run to limit browser memory.`); return;
      }
      if (slug === "ocr-pdf") {
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("eng");
        try {
          const pages=[]; const total=Math.min(doc.numPages,10);
          for(let pageNo=1;pageNo<=total;pageNo++) {
            const page=await doc.getPage(pageNo), viewport=page.getViewport({scale:1.5}), canvas=document.createElement("canvas");
            canvas.width=Math.ceil(viewport.width); canvas.height=Math.ceil(viewport.height);
            await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
            const {data}=await worker.recognize(canvas); pages.push(`--- Page ${pageNo} ---\n${data.text}`);
          }
          saveText(pages.join("\n\n"),"ocr-text.txt"); result(`OCR finished for ${total} page(s) in English. Downloaded ocr-text.txt. Scan quality affects accuracy.`);
        } finally { await worker.terminate(); }
        return;
      }
    }
    if (["merge-pdf","split-pdf","compress-pdf","images-to-pdf","organize-pdf-pages","watermark-pdf"].includes(slug)) {
      const { PDFDocument, StandardFonts, rgb, degrees } = await import("pdf-lib");
      if (slug==="merge-pdf") {
        const merged=await PDFDocument.create();
        for (const f of fileList) { const doc=await PDFDocument.load(await f.arrayBuffer()); const pages=await merged.copyPages(doc,doc.getPageIndices()); pages.forEach(p=>merged.addPage(p)); }
        saveBlob(new Blob([await merged.save()],{type:"application/pdf"}),"merged.pdf"); result(`Merged ${fileList.length} PDF files and downloaded merged.pdf.`); return;
      }
      if (slug==="images-to-pdf") {
        const doc=await PDFDocument.create();
        for (const f of fileList) {
          const bytes=await f.arrayBuffer();
          let img;
          if (/\.png$/i.test(f.name)||f.type==="image/png") img=await doc.embedPng(bytes);
          else if (/jpe?g$/i.test(f.name)||f.type==="image/jpeg") img=await doc.embedJpg(bytes);
          else continue;
          const page=doc.addPage([img.width,img.height]); page.drawImage(img,{x:0,y:0,width:img.width,height:img.height});
        }
        saveBlob(new Blob([await doc.save()],{type:"application/pdf"}),"images.pdf"); result("Created and downloaded images.pdf. PNG/JPG files were used; other formats were skipped."); return;
      }
      const doc=await PDFDocument.load(await file.arrayBuffer(), {ignoreEncryption:false});
      if (slug==="split-pdf") {
        const first=Math.max(1,Number(values.first)||1), last=Math.min(doc.getPageCount(),Number(values.last)||first);
        if(first>last||first>doc.getPageCount()) throw new Error(`Choose a valid page range from 1 to ${doc.getPageCount()}.`);
        const out=await PDFDocument.create(); const indexes=[];
        for(let i=first-1;i<last;i++) indexes.push(i);
        (await out.copyPages(doc,indexes)).forEach(p=>out.addPage(p));
        saveBlob(new Blob([await out.save()],{type:"application/pdf"}),`pages-${first}-${last}.pdf`); result(`Downloaded pages ${first}–${last}.`); return;
      }
      if (slug==="organize-pdf-pages") {
        const total=doc.getPageCount();
        const raw=(values.pageOrder||"").trim();
        let indexes=raw ? raw.split(",").map(x=>Number(x.trim())-1) : Array.from({length:total},(_,i)=>i);
        if(indexes.some(i=>!Number.isInteger(i)||i<0||i>=total)) throw new Error(`Page order must contain page numbers from 1 to ${total}.`);
        if(new Set(indexes).size!==indexes.length) throw new Error("Each page number can appear only once. Omit page numbers to remove pages from the output.");
        if(!indexes.length) throw new Error("Enter at least one page number.");
        const out=await PDFDocument.create();
        const pages=await out.copyPages(doc,indexes); pages.forEach(page=>out.addPage(page));
        const rotation=Number(values.rotation)||0;
        if(![0,90,180,270].includes(rotation)) throw new Error("Rotation must be 0, 90, 180 or 270 degrees.");
        out.getPages().forEach(page=>page.setRotation(degrees((page.getRotation().angle+rotation)%360)));
        saveBlob(new Blob([await out.save()],{type:"application/pdf"}),"organized.pdf");
        result(`Downloaded organized.pdf with ${indexes.length} page(s). Order: ${indexes.map(i=>i+1).join(", ")}. Rotation applied: ${rotation}°.`); return;
      }
      if (slug==="watermark-pdf") {
        const font=await doc.embedFont(StandardFonts.Helvetica);
        for(const p of doc.getPages()) { const s=p.getSize(); p.drawText(values.watermark||"CONFIDENTIAL",{x:40,y:s.height/2,size:28,font,color:rgb(.7,.1,.1),opacity:.3,rotate:degrees(-35)}); }
        saveBlob(new Blob([await doc.save()],{type:"application/pdf"}),"watermarked.pdf"); result("Applied a basic text watermark to each page."); return;
      }
      if (slug==="compress-pdf") {
        const originalSize=file.size;
        const bytes=await doc.save({useObjectStreams:true,addDefaultPage:false});
        const blob=new Blob([bytes],{type:"application/pdf"});
        saveBlob(blob,"optimized.pdf");
        const delta=originalSize ? ((originalSize-blob.size)/originalSize*100) : 0;
        result(`Original: ${(originalSize/1024).toFixed(1)} KB\nOutput: ${(blob.size/1024).toFixed(1)} KB\nSize change: ${delta>=0?"reduced by ":"increased by "}${Math.abs(delta).toFixed(1)}%. This rewrites the PDF structure; it does not recompress embedded images, so it may not reduce file size.`); return;
      }
    }
    if (slug==="word-to-pdf") {
      const mammoth = await import("mammoth");
      const pdfLib = await import("pdf-lib");
      const converted = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      const cleanedText = String(converted.value || "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\u00A0/g, " ");
      const lines = cleanedText.replace(/\r/g, "").split("\n");
      const pdf = await pdfLib.PDFDocument.create();
      const fontkit = (await import("@pdf-lib/fontkit")).default;
      pdf.registerFontkit(fontkit);
      const latinFont = await pdf.embedFont(pdfLib.StandardFonts.Helvetica);
      const devanagariBytes = await fetch("/fonts/Lohit-Devanagari.ttf").then(async response => {
        if (!response.ok) throw new Error("Hindi font could not be loaded. Refresh the page and try again.");
        return response.arrayBuffer();
      });
      const devanagariFont = await pdf.embedFont(devanagariBytes, { subset: true });
      const pageWidth=595.28, pageHeight=841.89, margin=48, fontSize=11, lineHeight=15, maxWidth=pageWidth-margin*2;
      let page=pdf.addPage([pageWidth,pageHeight]), y=pageHeight-margin;
      const segmenter = new Intl.Segmenter("hi", { granularity: "grapheme" });
      for (const rawLine of lines) {
        const clusters = Array.from(segmenter.segment(rawLine || " "), item => item.segment);
        let runs = [], current = "", currentHindi = null;
        for (const cluster of clusters) {
          const isHindi = /[\u0900-\u097F]/.test(cluster);
          if (currentHindi !== null && currentHindi !== isHindi) { runs.push({ text: current, hindi: currentHindi }); current = ""; }
          currentHindi = isHindi; current += cluster;
        }
        if (current) runs.push({ text: current, hindi: currentHindi });
        let wrapped = [], lineRuns = [], lineWidth = 0;
        for (const run of runs) {
          const font = run.hindi ? devanagariFont : latinFont;
          const parts = run.text.split(/(\s+)/).filter(Boolean);
          for (const part of parts) {
            const width = font.widthOfTextAtSize(part, fontSize);
            if (lineWidth + width > maxWidth && lineWidth > 0 && !/^\s+$/.test(part)) { wrapped.push(lineRuns); lineRuns = []; lineWidth = 0; }
            lineRuns.push({ text: part, font }); lineWidth += width;
          }
        }
        if (lineRuns.length) wrapped.push(lineRuns);
        if (!wrapped.length) wrapped = [[{ text: " ", font: latinFont }]];
        for (const parts of wrapped) {
          if (y < margin) { page=pdf.addPage([pageWidth,pageHeight]); y=pageHeight-margin; }
          let x=margin;
          for (const part of parts) { page.drawText(part.text,{x,y,size:fontSize,font:part.font}); x += part.font.widthOfTextAtSize(part.text,fontSize); }
          y-=lineHeight;
        }
      }
      const bytes=await pdf.save();
      saveBlob(new Blob([bytes],{type:"application/pdf"}),file.name.replace(/\\.docx?$/i,"")+".pdf");
      result("Created a text-based PDF. This lightweight conversion extracts text only; Word layout, tables, images and exact styling may not be preserved.");
      return;
    }
    if (slug==="unlock-pdf") {
      const password=String(values.password||"");
      if(!password) throw new Error("Enter the PDF open password. Use only documents you are authorized to access.");
      const pdfjs=await import("pdfjs-dist/legacy/build/pdf.mjs");
      const pdfLib=await import("pdf-lib");
      pdfjs.GlobalWorkerOptions.workerSrc="/pdf.worker.min.mjs";
      const doc=await pdfjs.getDocument({data:await file.arrayBuffer(),password}).promise;
      const out=await pdfLib.PDFDocument.create();
      for(let pageNo=1;pageNo<=doc.numPages;pageNo++) {
        const sourcePage=await doc.getPage(pageNo), viewport=sourcePage.getViewport({scale:1.5});
        const canvas=document.createElement("canvas");
        canvas.width=Math.ceil(viewport.width); canvas.height=Math.ceil(viewport.height);
        await sourcePage.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
        const png=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Could not render PDF page.")),"image/png"));
        const embedded=await out.embedPng(await png.arrayBuffer());
        const page=out.addPage([embedded.width,embedded.height]);
        page.drawImage(embedded,{x:0,y:0,width:embedded.width,height:embedded.height});
        canvas.width=0; canvas.height=0;
      }
      const bytes=await out.save();
      saveBlob(new Blob([bytes],{type:"application/pdf"}),"unlocked-authorized-copy.pdf");
      result("Created a rasterized, unencrypted copy using the supplied password. Text will not be selectable and output quality/size may differ.");
      return;
    }
    if (slug==="background-remover" || slug==="image-upscaler") {
      throw new Error("This feature needs a high-quality on-device AI model or a configured API, plus quality and privacy testing. It is intentionally not presented as a fake one-click AI result.");
    }
    if (slug==="video-to-audio-converter") {
      throw new Error("Use a local media-processing workflow only for files you own or are licensed to convert. This starter does not download from YouTube or bypass platform restrictions.");
    }
    if (slug==="bulk-image-converter") {
      // handled by image branch
      return;
    }
    throw new Error("This file operation needs a dedicated processor that is not enabled in this starter. The page is present and explains the limitation.");
  }

  async function runTool() {
    setBusy(true); setError(""); setOutput("");
    let succeeded = false;
    let reservationId = null;
    try {
      const quotaResponse = await fetch("/api/usage/consume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, action: "reserve" }) });
      const quota = await quotaResponse.json().catch(() => ({}));
      if (!quotaResponse.ok) throw new Error(quota.error || "Could not verify today's free-use limit. Please try again.");
      reservationId = quota.reservationId || null;
      if (!reservationId) throw new Error("Could not reserve today's free-use allowance. Please try again.");
      if (slug === "social-media-downloader") { await processSocialMediaUrl(); succeeded = true; return; }
      if (isFileTool && fileList.length) { await processFiles(); succeeded = true; return; }
      const v = Object.fromEntries(Object.entries(values).map(([k,val])=>[k, String(val ?? "").trim()]));
      const n = k => Number(v[k] || 0);
      const s = text;
      switch (slug) {
        case "word-counter": case "character-counter": {
          const words=countWords(s), chars=s.length, charsNoSpace=s.replace(/\s/g,"").length;
          const sentences=(s.match(/[.!?]+(?=\s|$)/g)||[]).length, paragraphs=s.trim()?s.trim().split(/\n\s*\n/).length:0;
          result(`Words: ${words}\nCharacters (with spaces): ${chars}\nCharacters (without spaces): ${charsNoSpace}\nSentences (approx.): ${sentences}\nParagraphs: ${paragraphs}\nReading time: ${Math.max(1,Math.ceil(words/200))} min`); break;
        }
        case "case-converter": {
          const opt=mode;
          const output=opt==="upper"?s.toUpperCase():opt==="lower"?s.toLowerCase():opt==="title"?s.toLowerCase().replace(/\b\p{L}/gu,c=>c.toUpperCase()):opt==="sentence"?s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu,c=>c.toUpperCase()):opt==="camel"?s.toLowerCase().replace(/[^a-z0-9]+(.)/g,(_,c)=>c.toUpperCase()).replace(/^[A-Z]/,c=>c.toLowerCase()):opt==="snake"?slugify(s).replace(/-/g,"_"):opt==="kebab"?slugify(s):s;
          result(output); break;
        }
        case "lorem-ipsum-generator": {
          const p=Math.min(20,Math.max(1,n("paragraphs")||3)), w=Math.min(200,Math.max(10,n("words")||50));
          const vocab="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
          const paras=Array.from({length:p},(_,pi)=>Array.from({length:w},(_,j)=>vocab[(j+pi*3)%vocab.length]).join(" ")+".");
          result(paras.join("\n\n")); break;
        }
        case "regex-find-replace": case "regex-tester": {
          const pattern=v.pattern||"a", flags=(v.flags||"g").replace(/[^dgimsuvy]/g,"");
          const re=new RegExp(pattern,flags);
          if (slug==="regex-find-replace") result(s.replace(re,v.replacement||""));
          else { const matches=[...s.matchAll(new RegExp(pattern,flags.includes("g")?flags:flags+"g"))].slice(0,100); result(matches.length ? matches.map(m=>`${m[0]} @ ${m.index}${m.length>1?`\nGroups: ${m.slice(1).join(", ")}`:""}`).join("\n\n") : "No matches (or no input text)."); }
          break;
        }
        case "text-diff-checker": {
          const a=s.split("\n"), b=text2.split("\n"), max=Math.max(a.length,b.length), out=[];
          for(let i=0;i<max;i++) if(a[i]!==b[i]) out.push(`Line ${i+1}\n- ${a[i]??"(missing)"}\n+ ${b[i]??"(missing)"}`);
          result(out.length?out.join("\n\n"):"No line differences found."); break;
        }
        case "remove-duplicate-lines": {
          const seen=new Set(), out=[];
          for(const line of s.split(/\r?\n/)){ const key=v.caseSensitive==="yes"?line:line.toLocaleLowerCase(); if(!seen.has(key)){seen.add(key);out.push(line);} }
          result(out.join("\n")); break;
        }
        case "markdown-to-text": result(s.replace(/```[\s\S]*?```/g,m=>m.replace(/```[^\n]*\n?/,"").replace(/```/g,"")).replace(/!\[([^\]]*)\]\([^)]+\)/g,"$1").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/^\s{0,3}#{1,6}\s+/gm,"").replace(/[*_~`>]/g,"").replace(/^\s*[-+*]\s+/gm,"").trim()); break;
        case "markdown-table-generator": {
          const rows=s.trim().split(/\r?\n/).map(line=>line.split(/\t|,/).map(x=>x.trim()));
          if(!rows.length||!rows[0].length) throw new Error("Paste at least one row.");
          const fmt=r=>"| "+r.map(x=>x.replace(/\|/g,"\\|")).join(" | ")+" |";
          result([fmt(rows[0]),fmt(rows[0].map(()=> "---")), ...rows.slice(1).map(fmt)].join("\n")); break;
        }
        case "json-to-markdown-table": {
          const data=JSON.parse(s); if(!Array.isArray(data)||!data.length||typeof data[0]!=="object") throw new Error("Enter a non-empty JSON array of objects.");
          const cols=[...new Set(data.flatMap(x=>Object.keys(x)))], fmt=r=>"| "+r.map(x=>String(x??"").replace(/\|/g,"\\|")).join(" | ")+" |";
          result([fmt(cols),fmt(cols.map(()=> "---")),...data.map(row=>fmt(cols.map(c=>JSON.stringify(row[c]??""))))].join("\n")); break;
        }
        case "number-to-words": result(indianWords(n("value"))); break;
        case "anagram-solver": {
          const norm=x=>x.toLowerCase().replace(/[^a-z0-9]/g,"").split("").sort().join("");
          result(v.candidate ? (norm(v.word)===norm(v.candidate) && norm(v.word) ? "These are anagrams." : "These are not anagrams.") : "Enter both a word and a candidate to check."); break;
        }
        case "json-formatter": {
          const obj=JSON.parse(s); result(mode==="minify"?JSON.stringify(obj):JSON.stringify(obj,null,2)); break;
        }
        case "base64-encode-decode": result(mode==="decode"?decodeURIComponent(escape(atob(s.trim()))):btoa(unescape(encodeURIComponent(s)))); break;
        case "url-encoder-decoder": result(mode==="decode"?decodeURIComponent(s):encodeURIComponent(s)); break;
        case "unix-timestamp-converter": {
          const nVal=Number(s.trim()||v.timestamp||Date.now());
          const ms=nVal<1e12?nVal*1000:nVal; const d=new Date(ms);
          if(Number.isNaN(d.getTime())) throw new Error("Enter a valid Unix timestamp (seconds or milliseconds).");
          result(`Local: ${d.toString()}\nUTC: ${d.toISOString()}\nUnix seconds: ${Math.floor(ms/1000)}\nUnix milliseconds: ${ms}`); break;
        }
        case "hash-generator": {
          const algorithm=["SHA-1","SHA-256","SHA-384","SHA-512"].includes(mode)?mode:"SHA-256";
          const digest=await crypto.subtle.digest(algorithm,new TextEncoder().encode(s));
          result(`${algorithm}\n${[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("")}`); break;
        }
        case "jwt-decoder": {
          const parts=s.trim().split("."); if(parts.length<2) throw new Error("This does not look like a JWT.");
          const decodePart=p=>JSON.stringify(JSON.parse(atob(p.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(p.length/4)*4,"="))),null,2);
          result("Header:\n"+decodePart(parts[0])+"\n\nPayload:\n"+decodePart(parts[1])+"\n\nNote: decoding does not verify the signature."); break;
        }
        case "number-base-converter": {
          const from=Math.min(36,Math.max(2,n("fromBase")||10)), to=Math.min(36,Math.max(2,n("toBase")||16));
          const num=parseInt(v.value||s,from); if(Number.isNaN(num)) throw new Error("The value is not valid in the selected source base.");
          result(`${num.toString(to).toUpperCase()} (base ${to})`); break;
        }
        case "code-minifier": {
          if(!s.trim()) throw new Error("Paste HTML, CSS or JavaScript to minify.");
          let minified=s;
          if(mode==="js") {
            const terser=await import("terser");
            const out=await terser.minify(s,{compress:true,mangle:true,format:{comments:false}});
            if(out.error) throw out.error;
            minified=out.code||"";
          } else if(mode==="css") {
            minified=s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s+/g," ").replace(/\s*([{}:;,>+~])\s*/g,"$1").replace(/;}/g,"}").trim();
          } else minified=s.replace(/<!--[\s\S]*?-->/g,"").replace(/>\s+</g,"><").replace(/\s{2,}/g," ").trim();
          result(minified); break;
        }
        case "sql-formatter": result(s.replace(/\s+/g," ").replace(/\b(select|from|where|and|or|group by|order by|having|limit|join|left join|inner join|on|insert into|values|update|set|delete from)\b/gi,"\n$1").trim().replace(/^\n/,"").replace(/\b(select|from|where|and|or|group by|order by|having|limit|join|left join|inner join|on|insert into|values|update|set|delete from)\b/gi,m=>m.toUpperCase())); break;
        case "css-gradient-generator": result(`background: linear-gradient(${Math.max(0,Math.min(360,n("angle")||135))}deg, ${v.from||"#155e75"}, ${v.to||"#67e8f9"});`); break;
        case "meta-tag-generator": result(`<title>${escHtml(v.title)}</title>\n<meta name="description" content="${escHtml(v.description)}">\n<link rel="canonical" href="${escHtml(v.url)}">\n<meta property="og:title" content="${escHtml(v.title)}">\n<meta property="og:description" content="${escHtml(v.description)}">\n<meta property="og:url" content="${escHtml(v.url)}">\n<meta property="og:image" content="${escHtml(v.image)}">`); break;
        case "schema-markup-generator": result(JSON.stringify({"@context":"https://schema.org","@type":v.type||"Organization","name":v.name,"url":v.url},null,2)); break;
        case "robots-txt-generator": result(`User-agent: *\nAllow: ${v.allow||"/"}\nDisallow: ${v.disallow||""}\n\nSitemap: ${v.sitemap||"https://example.com/sitemap.xml"}`); break;
        case "serp-preview": result(`${v.title||"Page title"}\n${v.url||"https://example.com/"}\n${v.description||""}\n\nNote: search engines may rewrite displayed titles and snippets.`); break;
        case "keyword-density-checker": {
          const tokens=(s.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]), freq={};
          for(const t of tokens) freq[t]=(freq[t]||0)+1;
          const entries=Object.entries(freq).filter(([word])=>word.length>2).sort((a,b)=>b[1]-a[1]).slice(0,30);
          const total=tokens.length||1;
          result(`Words counted: ${tokens.length}\n`+entries.map(([word,count])=>`${word}: ${count} (${(count/total*100).toFixed(2)}%)`).join("\n")+"\n\nNote: there is no universal keyword-density percentage that guarantees ranking."); break;
        }
        case "ads-txt-generator": result(`${v.domain||"example.com"}, ${v.publisher||"pub-0000000000000000"}, ${v.relationship||"DIRECT"}${v.cert?", "+v.cert:""}`); break;
        case "utm-builder": {
          const u=new URL(v.url||"https://example.com/");
          [["utm_source","source"],["utm_medium","medium"],["utm_campaign","campaign"],["utm_term","term"],["utm_content","content"]].forEach(([param,key])=>{ if(v[key]) u.searchParams.set(param,v[key]); });
          result(u.toString()); break;
        }
        case "whatsapp-link-generator": {
          const phone=(v.phone||"").replace(/\D/g,""); if(phone.length<8) throw new Error("Enter a phone number with country code, digits only.");
          result(`https://wa.me/${phone}${v.message?`?text=${encodeURIComponent(v.message)}`:""}`); break;
        }
        case "cgpa-to-percentage": result(`${(n("cgpa")*n("multiplier")).toFixed(2)}% using multiplier ${n("multiplier")}. Check your university's official conversion rule.`); break;
        case "emi-calculator": case "mortgage-calculator": {
          const principal=n("principal"), monthly=n("rate")/1200, months=slug==="mortgage-calculator"?n("years")*12:n("months");
          if(principal<=0||months<=0) throw new Error("Enter positive loan amount and tenure.");
          const emi=monthly===0?principal/months:principal*monthly*Math.pow(1+monthly,months)/(Math.pow(1+monthly,months)-1);
          result(`Estimated monthly payment: ${emi.toFixed(2)}\nTotal paid: ${(emi*months).toFixed(2)}\nTotal interest: ${(emi*months-principal).toFixed(2)}\nAssumes a fixed rate and monthly payments; fees/taxes are excluded.`); break;
        }
        case "compound-interest-calculator": {
          const p=n("principal"), m=n("monthly"), r=n("rate")/100, years=n("years"), months=years*12;
          const initial=p*Math.pow(1+r/12,months);
          const contributions=r===0?m*months:m*((Math.pow(1+r/12,months)-1)/(r/12));
          result(`Projected value: ${(initial+contributions).toFixed(2)}\nInitial amount growth: ${initial.toFixed(2)}\nContribution growth (approx.): ${contributions.toFixed(2)}\nAssumes steady contributions and returns; excludes taxes, fees and inflation.`); break;
        }
        case "percentage-calculator": result(`${n("percent")}% of ${n("base")} = ${(n("base")*n("percent")/100).toFixed(4)}\nIncrease amount = ${(n("base")*n("percent")/100).toFixed(4)}\nValue after increase = ${(n("base")*(1+n("percent")/100)).toFixed(4)}`); break;
        case "bmi-calculator": case "child-bmi-calculator": {
          const h=n("height")/100, weight=n("weight"), age=n("age"), sex=String(v.sex||"").toLowerCase();
          if(!(h>0) || !(weight>0)) throw new Error("Enter a valid positive height and weight.");
          const bmi=weight/(h*h);
          if(slug==="child-bmi-calculator") {
            if(!(age>=2 && age<=19) || !["m","f","male","female"].includes(sex)) throw new Error("Enter age from 2 to 19 years and sex as m or f.");
            result(`BMI: ${bmi.toFixed(1)} kg/m²\\n\\nThis is BMI only, not a BMI-for-age percentile. Pediatric interpretation requires a validated age-in-months and sex-specific growth reference. Do not use adult BMI cutoffs for children; consult a pediatric clinician for interpretation.`);
          } else result(`BMI: ${bmi.toFixed(1)}\\nAdult BMI is a screening measure, not a diagnosis. Interpretation depends on context and should be discussed with a clinician when relevant.`);
          break;
        }
        case "age-calculator": case "age-difference-calculator": {
          const d1=new Date(v.date||v.date1), d2=new Date(v.date2||new Date().toISOString().slice(0,10));
          if(Number.isNaN(d1.getTime())||Number.isNaN(d2.getTime())) throw new Error("Enter valid dates.");
          const days=Math.abs(Math.floor((d2-d1)/86400000));
          if(slug==="age-difference-calculator") result(`Difference: ${days} days (approximately ${(days/365.2425).toFixed(2)} years).`);
          else { let y=d2.getFullYear()-d1.getFullYear(), m=d2.getMonth()-d1.getMonth(), d=d2.getDate()-d1.getDate(); if(d<0){m--;d+=new Date(d2.getFullYear(),d2.getMonth(),0).getDate();} if(m<0){y--;m+=12;} result(`Age: ${Math.max(0,y)} years, ${Math.max(0,m)} months, ${Math.max(0,d)} days.`); }
          break;
        }
        case "gst-calculator": {
          const amount=n("amount"), rate=n("rate")/100, mode=(v.mode||"add").toLowerCase();
          if(mode==="remove") result(`Base amount: ${(amount/(1+rate)).toFixed(2)}\nGST included: ${(amount-amount/(1+rate)).toFixed(2)}\nAmount entered included GST.`);
          else result(`Base amount: ${amount.toFixed(2)}\nGST: ${(amount*rate).toFixed(2)}\nTotal: ${(amount*(1+rate)).toFixed(2)}`);
          break;
        }
        case "bill-splitter": {
          const total=n("amount")*(1+n("tip")/100), ppl=Math.max(1,n("people")); result(`Total including tip: ${total.toFixed(2)}\nPer person: ${(total/ppl).toFixed(2)}`); break;
        }
        case "scientific-calculator": {
          const math=await import("mathjs"); result(String(math.evaluate(v.expression||s))); break;
        }
        case "unit-converter": {
          const val=n("value"), a=(v.fromUnit||"km").toLowerCase(), b=(v.toUnit||"m").toLowerCase();
          const factors={m:1,km:1000,cm:.01,mm:.001,mi:1609.344,ft:.3048,in:.0254,kg:1,g:.001,lb:.45359237,oz:.0283495};
          let out;
          if(a==="c"&&b==="f") out=val*9/5+32; else if(a==="f"&&b==="c") out=(val-32)*5/9; else if(factors[a]&&factors[b]) out=val*factors[a]/factors[b]; else throw new Error("Supported unit tokens: m, km, cm, mm, mi, ft, in, kg, g, lb, oz, C, F.");
          result(`${val} ${a} = ${out} ${b}`); break;
        }
        case "currency-converter": {
          const from=(v.fromCurrency||"USD").toUpperCase(), to=(v.toCurrency||"INR").toUpperCase();
          const response=await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`);
          if(!response.ok) throw new Error("The live exchange-rate service could not respond. Try again later.");
          const data=await response.json(); const rate=data?.rates?.[to];
          if(!rate) throw new Error("This currency pair is not available from the current rate source.");
          result(`${n("amount")} ${from} ≈ ${(n("amount")*rate).toFixed(4)} ${to}\nLast updated: ${data.time_last_update_utc || "as returned by source"}\nRates are indicative and exclude bank fees/spreads.`); break;
        }
        case "break-even-calculator": {
          const margin=n("price")-n("variable"); if(margin<=0) throw new Error("Selling price must exceed variable cost.");
          const units=n("fixed")/margin; result(`Break-even quantity: ${Math.ceil(units)} units\nBreak-even sales: ${(Math.ceil(units)*n("price")).toFixed(2)}\nContribution per unit: ${margin.toFixed(2)}`); break;
        }
        case "roi-calculator": {
          const r=(n("final")-n("invested"))/Math.max(1e-9,n("invested"))*100;
          result(`Total ROI: ${r.toFixed(2)}%\nGain/loss: ${(n("final")-n("invested")).toFixed(2)}\nSimple annualized approximation: ${(n("years")>0?((Math.pow(Math.max(.000001,n("final")/n("invested")),1/n("years"))-1)*100):r).toFixed(2)}% per year\nExcludes taxes, fees and risk.`); break;
        }
        case "fuel-cost-calculator": {
          const litres=n("distance")/n("mileage"); if(n("mileage")<=0) throw new Error("Mileage must be greater than zero.");
          result(`Estimated fuel used: ${litres.toFixed(2)} litres\nEstimated fuel cost: ₹${(litres*n("fuelPrice")).toFixed(2)}\nCost per km: ₹${(litres*n("fuelPrice")/Math.max(1,n("distance"))).toFixed(2)}\nFuel price is user-entered, not a live quote.`); break;
        }
        case "electricity-bill-calculator": result(`Estimated bill: ₹${(n("units")*n("rate")+n("fixed")).toFixed(2)}\nUses a flat rate. Taxes, slabs, surcharges and local tariff rules may change the actual bill.`); break;
        case "date-calculator": {
          const d=new Date(v.date); d.setDate(d.getDate()+n("days")); result(d.toISOString().slice(0,10)); break;
        }
        case "pregnancy-due-date-calculator": {
          const d=new Date(v.date); d.setDate(d.getDate()+280); result(`Estimated due date: ${d.toISOString().slice(0,10)}\nThis is an estimate based on 280 days from the entered date. A clinician can confirm dating.`); break;
        }
        case "calorie-calculator": {
          const w=n("weight"), h=n("height"), age=n("age"), sex=(v.sex||"f").toLowerCase(), activity=Math.min(2.5,Math.max(1,n("activity")||1.2));
          const bmr=10*w+6.25*h-5*age+(sex==="m"?5:-161);
          result(`Estimated maintenance energy: ${Math.round(bmr*activity)} kcal/day\nBMR estimate: ${Math.round(bmr)} kcal/day\nThis formula is an estimate, not a prescription. Individual needs can differ.`); break;
        }
        case "water-intake-calculator": result(`Simple estimate: ${(n("weight")*35).toFixed(0)} mL/day (${(n("weight")*0.035).toFixed(2)} L/day) using 35 mL/kg as a rough heuristic. Needs vary with climate, activity, pregnancy and medical conditions; this is not a medical rule.`); break;
        case "sleep-calculator": {
          const [hh,mm]=(v.time||"22:30").split(":").map(Number); const base=new Date(); base.setHours(hh||0,mm||0,0,0);
          const mins=Math.max(3,Math.min(6,n("cycles")||5))*90+15;
          base.setMinutes(base.getMinutes()+mins); result(`Suggested wake time after about 15 minutes to fall asleep plus ${n("cycles")||5} × 90-minute cycles: ${base.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}\nSleep cycles vary; this is only an approximate planning aid.`); break;
        }
        case "cgpa-to-percentage": result(`${(n("cgpa")*n("multiplier")).toFixed(2)}% using multiplier ${n("multiplier")}. Confirm the rule from your university.`); break;
        case "hindi-typing-test": {
          const sample="मेरा भारत एक सुंदर देश है। यहाँ अनेक भाषाएँ, संस्कृतियाँ और परंपराएँ हैं। हमें अपने ज्ञान और कौशल को लगातार बेहतर बनाना चाहिए।";
          const typed=s.replace(/\s+/g," ").trim(), target=sample.replace(/\s+/g," ").trim();
          const words=countWords(typed), minutes=Math.max(.01,n("minutes")||1); let matches=0;
          for(let i=0;i<Math.min(typed.length,target.length);i++) if(typed[i]===target[i]) matches++;
          const accuracy=100*matches/Math.max(1,Math.max(typed.length,target.length));
          result(`Typed words: ${words}\\nEstimated speed: ${(words/minutes).toFixed(0)} words per minute\\nCharacter-match accuracy: ${accuracy.toFixed(1)}%\\nCompare against the sample shown on screen. This estimate uses the duration you entered, not an automatic timer.`); break;
        }
        case "reading-speed-test": result(`Approximate reading speed: ${(n("words")/Math.max(.01,n("minutes"))).toFixed(0)} words per minute. Use the same word-count method each time for comparison.`); break;
        case "ip-subnet-calculator": {
          const parts=(v.ip||"").split(".").map(Number), cidr=Math.max(0,Math.min(32,n("cidr")));
          if(parts.length!==4||parts.some(x=>x<0||x>255||!Number.isInteger(x))) throw new Error("Enter a valid IPv4 address.");
          const ip=parts.reduce((a,x)=>(a*256+x)>>>0,0)>>>0, mask=cidr===0?0:(0xffffffff<<(32-cidr))>>>0, network=(ip&mask)>>>0, broadcast=(network|(~mask>>>0))>>>0;
          const ipstr=x=>[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255].join(".");
          result(`Network: ${ipstr(network)}\nBroadcast: ${ipstr(broadcast)}\nSubnet mask: ${ipstr(mask)}\nTotal addresses: ${2**(32-cidr)}\nCIDR: /${cidr}`); break;
        }
        case "password-generator": {
          const length=Math.max(8,Math.min(128,n("length")||20)), symbols=(v.symbols||"yes").toLowerCase()!=="no";
          const chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"+(symbols?"!@#$%^&*()-_=+[]{};:,.?":"");
          const random=new Uint32Array(length); crypto.getRandomValues(random);
          result(Array.from(random,x=>chars[x%chars.length]).join("")); break;
        }
        case "random-number-generator": {
          const min=Math.ceil(n("min")), max=Math.floor(n("max")), count=Math.max(1,Math.min(100,n("count")||1));
          if(max<min) throw new Error("Maximum must be greater than or equal to minimum.");
          const vals=[]; for(let i=0;i<count;i++){const r=new Uint32Array(1);crypto.getRandomValues(r);vals.push(min+(r[0]%(max-min+1)));} result(vals.join("\n")); break;
        }
        case "dice-roller": {
          const count=Math.max(1,Math.min(50,n("count")||1)), sides=Math.max(2,Math.min(100,n("sides")||6));
          const vals=[]; for(let i=0;i<count;i++){const r=new Uint32Array(1);crypto.getRandomValues(r);vals.push(r[0]%sides+1);} result(`Rolls: ${vals.join(", ")}\nTotal: ${vals.reduce((a,b)=>a+b,0)}`); break;
        }
        case "coin-flip": {
          const count=Math.max(1,Math.min(100,n("count")||1)), a=[]; for(let i=0;i<count;i++){const r=new Uint8Array(1);crypto.getRandomValues(r);a.push(r[0]%2?"Heads":"Tails");} result(a.join("\n")); break;
        }
        case "number-to-words": result(indianWords(n("value"))); break;
        case "age-difference-calculator": {
          const a=new Date(v.date1), b=new Date(v.date2); result(`${Math.abs(Math.round((b-a)/86400000))} days between dates (approximately ${(Math.abs((b-a)/86400000)/365.2425).toFixed(2)} years).`); break;
        }
        case "color-converter": {
          const hex=(v.color||s).trim();
          const m=hex.match(/^#?([0-9a-f]{6})$/i); if(!m) throw new Error("Enter a six-digit HEX color such as #155e75.");
          const h=m[1], r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
          const rn=r/255, gn=g/255, bn=b/255, max=Math.max(rn,gn,bn), min=Math.min(rn,gn,bn), delta=max-min;
          let hue=0, sat=0, light=(max+min)/2;
          if(delta!==0){ sat=delta/(1-Math.abs(2*light-1)); if(max===rn) hue=60*(((gn-bn)/delta)%6); else if(max===gn) hue=60*((bn-rn)/delta+2); else hue=60*((rn-gn)/delta+4); }
          if(hue<0) hue+=360;
          result(`HEX: #${h.toLowerCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(hue)}, ${Math.round(sat*100)}%, ${Math.round(light*100)}%)`); break;
        }
        case "color-palette-generator": {
          const hex=(v.color||"#155e75").replace("#",""); if(!/^[0-9a-f]{6}$/i.test(hex)) throw new Error("Enter a six-digit HEX color such as #155e75.");
          const base=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));
          const shade=(factor)=>"#"+base.map(c=>Math.round(factor<1?c*factor:c+(255-c)*(factor-1)).toString(16).padStart(2,"0")).join("");
          result([1.4,1.2,1.0,.8,.6].map(f=>shade(f)).join("\\n")); break;
        }
        case "emoji-picker": result("Common emojis:\n😀 😁 😂 🙂 🙌 👋 ❤️ 🔥 🎉 ✅ ⭐ 🚀 💻 📚 ☕ 🎯 💡 🌈 🤝 🥳"); break;
        case "email-signature-generator": {
          result(`${v.name}\n${v.role}\n${v.email}${v.phone?`\n${v.phone}`:""}\n\nHTML version:\n<div><strong>${escHtml(v.name)}</strong><br>${escHtml(v.role)}<br><a href="mailto:${escHtml(v.email)}">${escHtml(v.email)}</a>${v.phone?`<br>${escHtml(v.phone)}`:""}</div>`); break;
        }
        case "invoice-generator": {
          const subtotal=n("amount"), tax=subtotal*n("rate")/100;
          const html=`<h1>INVOICE</h1><p>Invoice: ${escHtml(v.invoice)}</p><p>From: ${escHtml(v.name)}</p><p>Bill to: ${escHtml(v.client)}</p><hr><p>Subtotal: ₹${subtotal.toFixed(2)}</p><p>GST (${n("rate")}%): ₹${tax.toFixed(2)}</p><h2>Total: ₹${(subtotal+tax).toFixed(2)}</h2><p>Check applicable tax and invoice requirements before issuing.</p>`;
          saveText(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${escHtml(v.invoice)}</title><style>body{font:16px Arial,sans-serif;max-width:800px;margin:40px auto;padding:24px;color:#111}h1{letter-spacing:.1em}table{width:100%;border-collapse:collapse}td{padding:12px;border-bottom:1px solid #ddd}.total{font-size:1.4rem;font-weight:bold}@media print{button{display:none}body{margin:0}}</style></head><body>${html}<button onclick="window.print()">Print / Save as PDF</button></body></html>`,`invoice-${slugify(v.invoice||"draft")}.html`,"text/html;charset=utf-8");
          result(`Created a printable invoice HTML file for ${v.invoice||"your invoice"}. Open it in a browser and choose Print → Save as PDF. Review tax and legal fields before issuing.`); break;
        }
        case "content-calendar": {
          const days=Math.min(30,Math.max(7,n("days")||14)), ideas=["How-to guide","Common mistake","Customer question","Behind the scenes","Checklist","Case study","FAQ","Myth vs fact","Quick tip","Product/service explainer","Before/after","Weekly roundup","Tool recommendation","Customer story"];
          const rows=[["Day","Topic","Format","Idea"],...Array.from({length:days},(_,i)=>[i+1,v.topic,["Reel","Carousel","Story","Post"][i%4],ideas[i%ideas.length]])];
          saveText(rows.map(r=>r.map(csvEscape).join(",")).join("\n"),"content-calendar.csv","text/csv;charset=utf-8");
          result(`Downloaded a ${days}-day CSV content calendar for ${v.topic}.`); break;
        }
        case "social-media-caption-generator": {
          const topic=v.topic||"your update", platform=v.platform||"social media", tone=v.tone||"friendly";
          result(`${topic}: ${tone==="professional"?"Here is what you need to know about":tone==="funny"?"A little update about":"We’re excited to share"} ${topic}. Save this post for later and tell us what you think.\n\n#${slugify(topic).replace(/-/g,"")} #${slugify(platform).replace(/-/g,"")} #Update`); break;
        }
        case "hreflang-generator": {
          const pairs=(v.pages||"en=https://example.com/en/, hi=https://example.com/hi/").split(",").map(x=>x.trim()).filter(Boolean).map(pair=>{ const i=pair.indexOf("="); if(i<1) throw new Error("Use language=URL pairs, for example en=https://example.com/en/."); return [pair.slice(0,i).trim(),pair.slice(i+1).trim()]; });
          if(pairs.some(([lang,url])=>!lang||!/^https?:\/\//i.test(url))) throw new Error("Each language needs a valid absolute http(s) URL.");
          result(pairs.map(([lang,url])=>`<link rel="alternate" hreflang="${lang}" href="${url}" />`).join("\n")+"\n<!-- Add the same alternate set to every localized page. -->"); break;
        }
        case "barcode-generator": {
          const { default: JsBarcode } = await import("jsbarcode");
          const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
          JsBarcode(svg,v.value||s||"123456789012",{format:(v.format||"CODE128").toUpperCase(),displayValue:true});
          const source=new XMLSerializer().serializeToString(svg);
          saveText(source,"barcode.svg","image/svg+xml"); result("Downloaded barcode.svg. Verify that your scanner and chosen barcode standard accept the data."); break;
        }
        case "qr-code-generator": {
          const QRCode=(await import("qrcode")).default;
          const data=await QRCode.toDataURL(v.value||s||"https://example.com",{width:512,margin:2,errorCorrectionLevel:"M"});
          const a=document.createElement("a"); a.href=data; a.download="qr-code.png"; a.click(); result("Downloaded qr-code.png. This is a static QR code; it does not provide scan analytics."); break;
        }
        case "ads-txt-generator": result(`${v.domain}, ${v.publisher}, ${v.relationship}${v.cert?`, ${v.cert}`:""}`); break;
        case "favicon-generator": case "image-format-converter": case "webp-to-png": case "heic-to-jpg": case "image-compressor": case "image-resizer": case "crop-image": case "svg-to-png": case "exif-remover": case "meme-generator": case "photo-collage-maker": case "bulk-image-converter": {
          throw new Error("Choose file(s) above and run the tool.");
        }
        case "background-remover": case "image-upscaler": case "compress-pdf": case "word-to-pdf": case "pdf-to-images": case "pdf-to-text": case "ocr-pdf": case "unlock-pdf": case "video-to-audio-converter": {
          throw new Error("This feature requires a tested engine or trusted API. Read the on-page limitation before production use.");
        }
        case "ai-content-detector": result("AI writing detectors can produce false positives and false negatives. This project does not present a detector score as proof of authorship. A reliable product requires a transparent evaluation dataset and careful caveats."); break;
        case "ai-paraphraser-summarizer": result("AI rewrite/summarization needs a configured provider API, protected server-side keys, rate limiting and a clear retention policy. Do not put API secrets in client code."); break;
        case "social-media-downloader": result("Platform downloading and DRM/authentication bypass are intentionally not offered. Use a local file-processing workflow for content you own or are authorized to use."); break;
        default:
          if (slug==="scientific-calculator") result("Enter a math expression to calculate.");
          else if (s.trim()) result(s);
          else result("Enter an input above and try again.");
      }
      succeeded = true;
    } catch (e) {
      succeeded = false;
      setError(e?.message || "Something went wrong. Check the input and try again.");
    } finally {
      if (reservationId) {
        try {
          const charge = await fetch("/api/usage/consume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, action: succeeded ? "commit" : "release", reservationId }) });
          if (succeeded && !charge.ok) { const data = await charge.json().catch(() => ({})); setError(data.error || "Your result was created, but today's usage could not be recorded. Please check the output before retrying."); }
        } catch { if (succeeded) setError("Your result was created, but usage could not be recorded. Please check the output before retrying."); }
      }
      setBusy(false);
    }
  }

  async function copyOutput() {
    try { await navigator.clipboard.writeText(output); setError(""); }
    catch { setError("Clipboard access is unavailable. Select and copy the output manually."); }
  }

  if (integrationRequired.has(slug)) {
    const messages = {
      "word-to-pdf": "Faithful Word-to-PDF conversion needs a document rendering engine. This browser-only build does not claim to preserve Word layout.",
      "unlock-pdf": "PDF encryption bypass is not offered. Use the password provided by the document owner and an authorized editor.",
      "background-remover": "A real background remover needs a licensed on-device AI model or configured image API. No model/API is configured in this free starter.",
      "image-upscaler": "AI upscaling needs a tested model or configured image API. No model/API is configured in this free starter.",
      "ai-content-detector": "No detector score is shown because AI text detectors can produce false positives and false negatives; a score should not be presented as proof of authorship.",
      "ai-paraphraser-summarizer": "A live AI feature requires a provider choice, protected server-side API key, rate limits, cost controls and a privacy/retention policy.",
      "social-media-downloader": "Downloading protected media or bypassing platform controls is not offered. Use local file tools for media you own or are authorized to process.",
      "video-to-audio-converter": "This route does not download from YouTube or other platforms. Local video-to-audio conversion needs a tested media engine such as FFmpeg.wasm and browser-memory limits.",
      "code-minifier": "Safe HTML/CSS/JavaScript minification needs format-aware parsers. A regex-only minifier can corrupt code, so this page remains disabled until a proper parser is integrated.",
      "child-bmi-calculator": "A child BMI result must be interpreted with age- and sex-specific growth charts. This page stays disabled until its clinical references and calculation flow are reviewed."
    };
    return <div className="notice" role="status"><strong>Not available in this build.</strong><p>{messages[slug]}</p><p className="small muted">This route is kept out of the XML sitemap and marked noindex until the required implementation and review are complete.</p></div>;
  }

  return (
    <div>
      {isFileTool && (
        <div className="field">
          <label htmlFor="files">Select file(s)</label>
          <input id="files" type="file" multiple={["merge-pdf","images-to-pdf","bulk-image-converter","image-format-converter","photo-collage-maker"].includes(slug)} accept={slug==="word-to-pdf"?".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document":(slug.includes("pdf")||["merge-pdf","split-pdf","compress-pdf","images-to-pdf","organize-pdf-pages","watermark-pdf","unlock-pdf","ocr-pdf"].includes(slug)?".pdf,application/pdf":"image/*,.heic,.svg")} onChange={(e)=>setFileList(Array.from(e.target.files||[]))} />
          <p className="small muted">{fileList.length ? `${fileList.length} file(s) selected.` : "Files are processed by the browser only for operations that have a local processor enabled. Unsupported operations will show a limitation instead of a fake result."}</p>
        </div>
      )}
      {fields.length>0 && (
        <div className="form-grid">
          {fields.map(([key,label,type,def])=>(
            <div className="field" key={key}>
              <label htmlFor={`field-${key}`}>{label}</label>
              {type==="select" ? <select id={`field-${key}`} value={values[key]??def} onChange={e=>setField(key,e.target.value)}><option value="add">Add</option><option value="remove">Remove</option></select> :
                <input id={`field-${key}`} type={type==="date"?"date":type==="number"?"number":"text"} value={values[key]??def} onChange={e=>setField(key,e.target.value)} />}
            </div>
          ))}
        </div>
      )}
      {slug==="hindi-typing-test" && <div className="result" style={{marginBottom:12}}><strong>Typing passage</strong><p lang="hi">मेरा भारत एक सुंदर देश है। यहाँ अनेक भाषाएँ, संस्कृतियाँ और परंपराएँ हैं। हमें अपने ज्ञान और कौशल को लगातार बेहतर बनाना चाहिए।</p></div>}
      {!isFileTool && (
        <div className="field" style={{marginTop: fields.length ? 4 : 0}}>
          <label htmlFor="main-input">{fieldLabelOverrides[slug] || (fields.length ? "Optional text / input" : "Input")}</label>
          <textarea id="main-input" value={text} onChange={e=>setText(e.target.value)} placeholder={["word-counter","character-counter","case-converter","markdown-to-text","remove-duplicate-lines","text-diff-checker","json-formatter","base64-encode-decode","url-encoder-decoder","regex-tester","regex-find-replace","hash-generator","jwt-decoder","code-minifier","sql-formatter","keyword-density-checker","markdown-table-generator","json-to-markdown-table"].includes(slug) ? "Paste or type your content here…" : "Enter text here if needed…"} />
          {slug==="text-diff-checker" && <><label htmlFor="second-input" style={{marginTop:12}}>Text B</label><textarea id="second-input" value={text2} onChange={e=>setText2(e.target.value)} placeholder="Paste the second text here…" /></>}
        </div>
      )}
      {["case-converter","json-formatter","base64-encode-decode","url-encoder-decoder","hash-generator","code-minifier"].includes(slug) && (
        <div className="field" style={{marginTop:12}}>
          <label htmlFor="mode">Operation</label>
          <select id="mode" value={mode} onChange={e=>setMode(e.target.value)}>
            {slug==="case-converter" ? <><option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="title">Title Case</option><option value="sentence">Sentence case</option><option value="camel">camelCase</option><option value="snake">snake_case</option><option value="kebab">kebab-case</option></> :
              slug==="json-formatter" ? <><option value="format">Format / validate</option><option value="minify">Minify JSON</option></> : slug==="code-minifier" ? <><option value="js">JavaScript</option><option value="css">CSS</option><option value="html">HTML</option></> : slug==="hash-generator" ? <><option value="SHA-1">SHA-1</option><option value="SHA-256">SHA-256</option><option value="SHA-384">SHA-384</option><option value="SHA-512">SHA-512</option></> :
                <><option value="encode">Encode</option><option value="decode">Decode</option></>}
          </select>
        </div>
      )}
      {slug==="watermark-pdf" && <div className="field"><label>Watermark text</label><input value={values.watermark||"CONFIDENTIAL"} onChange={e=>setField("watermark",e.target.value)} /></div>}
      {slug==="split-pdf" && <div className="form-grid"><div className="field"><label>First page</label><input type="number" min="1" value={values.first||1} onChange={e=>setField("first",e.target.value)} /></div><div className="field"><label>Last page</label><input type="number" min="1" value={values.last||1} onChange={e=>setField("last",e.target.value)} /></div></div>}
      {["image-format-converter"].includes(slug) && <div className="field"><label>Output format</label><select value={mode} onChange={e=>setMode(e.target.value)}><option value="png">PNG</option><option value="jpg">JPG</option><option value="webp">WebP</option></select></div>}
      {["image-compressor","image-resizer","crop-image","favicon-generator","meme-generator","heic-to-jpg"].includes(slug) && fields.length>0 && <p className="small muted">Image export uses the browser canvas. Some source formats, metadata, color profiles and advanced edits may not be preserved.</p>}
      <div className="actions">
        <button type="button" onClick={runTool} disabled={busy}>{busy ? "Working…" : "Run tool"}</button>
        <button type="button" className="secondary" onClick={()=>{setText("");setText2("");setOutput("");setError("");setFileList([]);}}>Clear</button>
        {output && <button type="button" className="secondary" onClick={copyOutput}>Copy result</button>}
        {output && <button type="button" className="secondary" onClick={()=>saveText(output,`${slug}-result.txt`)}>Download text</button>}
      </div>
      {error && <div className="notice" role="alert" style={{marginTop:16}}>{error}</div>}
      {output && <div className="result" aria-live="polite"><h3>Result</h3><pre>{output}</pre></div>}
      <p className="small muted" style={{marginTop:8}}>Free allowance: 3 tool runs per day per browser. Usage is checked by the server; clearing cookies or using another browser/device may reset the anonymous allowance.</p>
      <p className="small muted" style={{marginTop:16}}>This is an MVP build. A feature that requires a backend, live data, AI model or specialist parser is clearly marked and should be completed and tested before launch or indexing.</p>
    </div>
  );
}
