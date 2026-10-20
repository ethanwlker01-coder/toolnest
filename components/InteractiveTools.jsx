"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const WORDS = ["crane","slate","trace","sound","plant","brick","flame","grape","smile","proud","light","world","train","crown","water","charm","stone","beach","cloud","dream","quick","spare","blend","fresh","chair","green","heart","money","quiet","space"];
const PUZZLE = [0,0,3,0,2,0,6,0,0, 9,0,0,3,0,5,0,0,1, 0,0,1,8,0,6,4,0,0, 0,0,8,1,0,2,9,0,0, 7,0,0,0,0,0,0,0,8, 0,0,6,7,0,8,2,0,0, 0,0,2,6,0,9,5,0,0, 8,0,0,2,0,3,0,0,9, 0,0,5,0,1,0,3,0,0 ];
const SOLUTION = [4,8,3,9,2,1,6,5,7, 9,6,7,3,4,5,8,2,1, 2,5,1,8,7,6,4,9,3, 5,4,8,1,3,2,9,7,6, 7,2,9,5,6,4,1,3,8, 1,3,6,7,9,8,2,4,5, 3,7,2,6,8,9,5,1,4, 8,1,4,2,5,3,7,6,9, 6,9,5,4,1,7,3,8,2 ];
const EMOJIS = ["🍋","🚀","🌈","🐼","🍉","🎸","🌻","🦊"];
const rand = n => Math.floor(Math.random() * n);

function Button({ children, ...props }) { return <button type="button" {...props}>{children}</button>; }
function TimerTool({ slug }) {
  const [duration, setDuration] = useState(slug === "pomodoro-timer" ? 25 * 60 : 60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState("focus");
  const [focusMins, setFocusMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (slug === "stopwatch-timer") setElapsed(v => v + 1);
      else setRemaining(v => {
        if (v <= 1) { setRunning(false); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, slug]);
  const format = s => `${Math.floor(s / 3600).toString().padStart(2,"0")}:${Math.floor((s % 3600) / 60).toString().padStart(2,"0")}:${(s % 60).toString().padStart(2,"0")}`;
  const start = () => { if (slug === "stopwatch-timer") setRunning(true); else { if (remaining <= 0) setRemaining(duration); setRunning(true); } };
  const reset = () => { setRunning(false); setElapsed(0); setRemaining(duration); };
  if (slug === "pomodoro-timer") return <div className="interactive-tool"><p>Choose your focus and break intervals. Keep this tab open while the timer runs.</p><div className="form-grid"><label>Focus minutes<input type="number" min="1" max="180" value={focusMins} onChange={e=>setFocusMins(Math.max(1,Number(e.target.value)||1))}/></label><label>Break minutes<input type="number" min="1" max="60" value={breakMins} onChange={e=>setBreakMins(Math.max(1,Number(e.target.value)||1))}/></label></div><h2>{phase === "focus" ? "Focus session" : "Break time"}</h2><div className="timer-display">{format(remaining)}</div><div className="actions"><Button onClick={()=>setRunning(v=>!v)}>{running?"Pause":"Start"}</Button><Button className="secondary" onClick={()=>{setRunning(false);setPhase("focus");setRemaining(focusMins*60);}}>Reset focus</Button><Button className="secondary" onClick={()=>{setRunning(false);setPhase("break");setRemaining(breakMins*60);}}>Start break</Button></div><p className="small muted">The browser cannot guarantee an alert after the tab is closed.</p></div>;
  if (slug === "stopwatch-timer") return <div className="interactive-tool"><div className="timer-display">{format(elapsed)}</div><div className="actions"><Button onClick={()=>setRunning(v=>!v)}>{running?"Pause":"Start"}</Button><Button className="secondary" onClick={reset}>Reset</Button></div></div>;
  return <div className="interactive-tool"><label>Countdown seconds<input type="number" min="1" max="86400" value={duration} onChange={e=>{const x=Math.max(1,Math.min(86400,Number(e.target.value)||1));setDuration(x);if(!running)setRemaining(x);}}/></label><div className="timer-display">{format(remaining)}</div><div className="actions"><Button onClick={start}>{running?"Running…":"Start / Resume"}</Button><Button className="secondary" onClick={reset}>Reset</Button></div><p className="small muted">Keep this page open. Background throttling may affect timer precision.</p></div>;
}
function ReactionTest() {
  const [phase,setPhase]=useState("idle"); const [startAt,setStartAt]=useState(0); const [message,setMessage]=useState("Tap start, then wait for the screen to turn green."); const [times,setTimes]=useState([]); const [timerId,setTimerId]=useState(null);
  useEffect(()=>()=>{if(timerId)clearTimeout(timerId);},[timerId]);
  const start=()=>{if(timerId)clearTimeout(timerId);setPhase("wait");setMessage("Wait for green…");const id=setTimeout(()=>{setStartAt(performance.now());setPhase("go");setMessage("NOW! Tap as fast as you can.");},1000+rand(3000));setTimerId(id);};
  const tap=()=>{if(phase==="wait"){if(timerId)clearTimeout(timerId);setPhase("idle");setMessage("Too early! Start again and wait for green.");}else if(phase==="go"){const ms=Math.round(performance.now()-startAt);setTimes(a=>[...a,ms].slice(-5));setPhase("idle");setMessage(`Reaction time: ${ms} ms`);}};
  return <div className="interactive-tool"><Button onClick={start}>Start test</Button><button type="button" className={`reaction-pad ${phase}`} onClick={tap}>{message}</button>{times.length>0&&<p>Last 5 results: {times.join(" ms · ")} ms<br/>Best: {Math.min(...times)} ms · Average: {Math.round(times.reduce((a,b)=>a+b,0)/times.length)} ms</p>}</div>;
}
function WordGame() {
  const [answer,setAnswer]=useState(()=>WORDS[rand(WORDS.length)]); const [guess,setGuess]=useState(""); const [guesses,setGuesses]=useState([]); const [message,setMessage]=useState("");
  const submit=()=>{const g=guess.toLowerCase().trim();if(!/^[a-z]{5}$/.test(g)){setMessage("Enter exactly five letters.");return;}if(!WORDS.includes(g)){setMessage("For this lightweight version, use one of the listed built-in words: crane, slate, trace, sound, plant, brick, flame, grape, smile, proud.");return;}const next=[...guesses,g];setGuesses(next);setGuess("");setMessage(g===answer?"Correct! You solved it.":next.length>=6?`Game over. The word was ${answer.toUpperCase()}.`:"Guess recorded.");};
  const reset=()=>{setAnswer(WORDS[rand(WORDS.length)]);setGuess("");setGuesses([]);setMessage("");};
  return <div className="interactive-tool"><p>Guess the five-letter word in six tries. This mini version accepts its built-in word list only.</p><div className="word-grid">{Array.from({length:6},(_,i)=><div className="word-row" key={i}>{Array.from({length:5},(_,j)=>{const ch=guesses[i]?.[j];const cls=ch?(ch===answer[j]?"correct":answer.includes(ch)?"present":"absent"):"";return <span className={cls} key={j}>{ch?.toUpperCase()||""}</span>;})}</div>)}</div><div className="actions"><input maxLength={5} value={guess} onChange={e=>setGuess(e.target.value.replace(/[^a-z]/gi,"").slice(0,5))} aria-label="Five-letter guess"/><Button onClick={submit}>Submit guess</Button><Button className="secondary" onClick={reset}>New game</Button></div><p aria-live="polite">{message}</p></div>;
}
function Game2048() {
  const newGrid=()=>{const g=Array(16).fill(0);for(let i=0;i<2;i++){let p=rand(16);while(g[p])p=rand(16);g[p]=Math.random()<.9?2:4;}return g;};
  const [grid,setGrid]=useState(newGrid); const [score,setScore]=useState(0); const [over,setOver]=useState(false);
  const move=useCallback(dir=>setGrid(old=>{const g=[...old];let gain=0;for(let line=0;line<4;line++){let ids=Array.from({length:4},(_,k)=>dir==="left"?line*4+k:dir==="right"?line*4+3-k:dir==="up"?k*4+line:(3-k)*4+line);let vals=ids.map(i=>g[i]).filter(Boolean);for(let k=0;k<vals.length-1;k++)if(vals[k]===vals[k+1]){vals[k]*=2;gain+=vals[k];vals.splice(k+1,1);}vals=[...vals,...Array(4-vals.length).fill(0)];ids.forEach((id,k)=>g[id]=vals[k]);}if(g.every((v,i)=>v===old[i]))return old;setScore(s=>s+gain);const empty=g.map((v,i)=>v===0?i:-1).filter(i=>i>=0);if(empty.length){const i=empty[rand(empty.length)];g[i]=Math.random()<.9?2:4;}else if(!g.some((v,i)=>i%4<3&&v===g[i+1]||i<12&&v===g[i+4]))setOver(true);return g;}),[]);
  useEffect(()=>{const handler=e=>{const key={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"}[e.key];if(key){e.preventDefault();move(key);}};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[move]);
  return <div className="interactive-tool"><p>Use arrow keys or buttons to combine matching tiles. Score: <strong>{score}</strong></p><div className="grid-2048">{grid.map((v,i)=><div className={`tile tile-${v}`} key={i}>{v||""}</div>)}</div><div className="actions"><Button onClick={()=>move("left")}>←</Button><Button onClick={()=>move("up")}>↑</Button><Button onClick={()=>move("down")}>↓</Button><Button onClick={()=>move("right")}>→</Button><Button className="secondary" onClick={()=>{setGrid(newGrid());setScore(0);setOver(false);}}>Restart</Button></div>{over&&<p>Game over — restart to play again.</p>}</div>;
}
function MemoryGame() {
  const make=()=>[...EMOJIS,...EMOJIS].sort(()=>Math.random()-.5).map((emoji,id)=>({id,emoji}));
  const [cards,setCards]=useState(make);const [open,setOpen]=useState([]);const [matched,setMatched]=useState([]);const [moves,setMoves]=useState(0);
  useEffect(()=>{if(open.length!==2)return;const [a,b]=open;if(cards[a].emoji===cards[b].emoji){setMatched(m=>[...m,a,b]);setOpen([]);}else{const id=setTimeout(()=>setOpen([]),750);return()=>clearTimeout(id);}},[open,cards]);
  const flip=i=>{if(open.length===2||open.includes(i)||matched.includes(i))return;setMoves(m=>m+1);setOpen(o=>[...o,i]);};
  return <div className="interactive-tool"><p>Moves: {moves} · Matches: {matched.length/2} / 8</p><div className="memory-grid">{cards.map((c,i)=><button type="button" key={c.id} className={`memory-card ${open.includes(i)||matched.includes(i)?"revealed":""}`} onClick={()=>flip(i)} aria-label={open.includes(i)||matched.includes(i)?c.emoji:"Reveal card"}>{open.includes(i)||matched.includes(i)?c.emoji:"?"}</button>)}</div><Button className="secondary" onClick={()=>{setCards(make());setOpen([]);setMatched([]);setMoves(0);}}>Restart</Button></div>;
}
function Minesweeper() {
  const make=()=>{const mines=new Set();while(mines.size<10)mines.add(rand(81));return Array.from({length:81},(_,i)=>({mine:mines.has(i),revealed:false,flag:false,count:Array.from({length:81},(_,j)=>j).filter(j=>mines.has(j)&&Math.abs(Math.floor(i/9)-Math.floor(j/9))<=1&&Math.abs(i%9-j%9)<=1).length}));};
  const [cells,setCells]=useState(make);const [ended,setEnded]=useState(false);const [won,setWon]=useState(false);
  const reveal=i=>{if(ended||cells[i].revealed||cells[i].flag)return;const next=cells.map((c,j)=>j===i?{...c,revealed:true}:c);setCells(next);if(cells[i].mine){setEnded(true);return;}if(next.filter(c=>c.revealed).length===71){setWon(true);setEnded(true);}};
  return <div className="interactive-tool"><p>9×9 board · 10 mines. Left click to reveal; right click to flag.</p><div className="mine-grid">{cells.map((c,i)=><button type="button" key={i} className={`mine-cell ${c.revealed?"revealed":""}`} onClick={()=>reveal(i)} onContextMenu={e=>{e.preventDefault();if(!ended)setCells(old=>old.map((x,j)=>j===i&&!x.revealed?{...x,flag:!x.flag}:x));}}>{c.revealed?(c.mine?"💣":c.count||""):c.flag?"🚩":""}</button>)}</div>{ended&&<p>{won?"You cleared the board!":"Mine hit — game over."}</p>}<Button className="secondary" onClick={()=>{setCells(make());setEnded(false);setWon(false);}}>New board</Button></div>;
}
function Sudoku() {
  const [vals,setVals]=useState(PUZZLE.map(v=>v||""));const [message,setMessage]=useState("");
  return <div className="interactive-tool"><p>Complete the fixed Sudoku puzzle. Given numbers are locked. Check your answers when finished.</p><div className="sudoku-grid">{vals.map((v,i)=><input key={i} aria-label={`Row ${Math.floor(i/9)+1}, column ${i%9+1}`} className={`${PUZZLE[i]?"given":""} ${Math.floor(i/27)%2===0?"":"band"}`} value={v} disabled={!!PUZZLE[i]} maxLength={1} inputMode="numeric" onChange={e=>setVals(old=>old.map((x,j)=>j===i?(e.target.value.replace(/[^1-9]/g,"").slice(0,1)):x))}/>)}</div><div className="actions"><Button onClick={()=>setMessage(vals.every((v,i)=>Number(v)===SOLUTION[i])?"Correct! Puzzle solved.":"Not solved yet. Check rows, columns and 3×3 boxes.")}>Check solution</Button><Button className="secondary" onClick={()=>{setVals(PUZZLE.map(v=>v||""));setMessage("");}}>Reset</Button></div><p aria-live="polite">{message}</p></div>;
}

function TypingTest({ hindi = false }) {
  const passage = hindi
    ? "मेरा भारत एक सुंदर देश है। यहाँ अनेक भाषाएँ, संस्कृतियाँ और परंपराएँ हैं। हमें अपने ज्ञान और कौशल को लगातार बेहतर बनाना चाहिए।"
    : "Clear writing helps people understand ideas quickly. Practice typing with steady accuracy before trying to increase your speed. A reliable result depends on correct characters, not just fast keystrokes.";
  const [started,setStarted]=useState(false); const [seconds,setSeconds]=useState(60); const [value,setValue]=useState(""); const [finished,setFinished]=useState(false);
  useEffect(()=>{if(!started||finished)return;const id=setInterval(()=>setSeconds(s=>{if(s<=1){setFinished(true);return 0;}return s-1;}),1000);return()=>clearInterval(id);},[started,finished]);
  const correct=value.split("").filter((ch,i)=>ch===passage[i]).length;
  const accuracy=value.length?Math.round(correct/value.length*100):0;
  const wpm=Math.round((value.trim()?value.trim().split(/\s+/).length:0)/Math.max(1,(60-seconds)/60));
  const reset=()=>{setStarted(false);setFinished(false);setSeconds(60);setValue("");};
  return <div className="interactive-tool"><p>Type the passage below as accurately as you can. The 60-second timer starts when you begin typing.</p><div className="result"><p lang={hindi?"hi":"en"}>{passage}</p></div><label htmlFor="typing-entry">Your typing</label><textarea id="typing-entry" value={value} disabled={finished} onChange={e=>{if(!started)setStarted(true);setValue(e.target.value.slice(0,passage.length));}} placeholder="Start typing the passage here…"/><div className="actions"><Button onClick={reset}>Restart test</Button><span className="small">Time: {seconds}s · WPM: {wpm} · Accuracy: {accuracy}%</span></div>{finished&&<p aria-live="polite">Test complete. Final speed: {wpm} WPM; character accuracy: {accuracy}%.</p>}</div>;
}

export default function InteractiveTools({ slug }) {
  if (["stopwatch-timer","countdown-timer","pomodoro-timer"].includes(slug)) return <TimerTool slug={slug}/>;
  if (slug === "typing-speed-test") return <TypingTest />;
  if (slug === "hindi-typing-test") return <TypingTest hindi />;
  if (slug === "reaction-time-test") return <ReactionTest/>;
  if (slug === "word-guessing-game") return <WordGame/>;
  if (slug === "2048-game") return <Game2048/>;
  if (slug === "memory-game") return <MemoryGame/>;
  if (slug === "minesweeper") return <Minesweeper/>;
  if (slug === "sudoku") return <Sudoku/>;
  return null;
}
