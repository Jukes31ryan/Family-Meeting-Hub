/* ============================================================
   KEEPERS — unified study-card engine (formerly Patrol Kit)
   Built on Patrol Español v1 (same Leitner boxes and intervals).
   Data is injected above by tools/build.mjs as:
     DECKS  [{meta, categories, cards}]   GRAMMAR  VERBS  PERSONS  FIELD
   ============================================================ */

/* ---------------- STATE & STORAGE ---------------- */
const LS={
  get(k,d){try{const v=localStorage.getItem("pk_"+k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem("pk_"+k,JSON.stringify(v))}catch(e){}}
};
const INTERVALS=[0,1,2,4,7,15]; // days per SRS box — unchanged from v1

/* flatten decks; resolve category / deck defaults onto each card */
const DECK={};const CARDS=[];const BYID={};
DECKS.sort((a,b)=>a.meta.order-b.meta.order).forEach(d=>{
  DECK[d.meta.id]=d;
  d.cards.forEach(c=>{
    const cat=(d.categories||{})[c.cat]||{};
    /* reverseFlip decks (Statutes): show what the law says, ask which statute it is */
    if(d.meta.reverseFlip&&c.type==="flip"&&(!d.meta.reverseMatch||new RegExp(d.meta.reverseMatch).test(c.front)))c={...c,rev:true,front:c.back,back:c.front,ask:c.ask||d.meta.reverseAsk||"Which statute is this?"};
    const card={...c,deck:d.meta.id,group:c.group||cat.group||"",why:c.why||cat.why||d.meta.why||"",source:c.source||cat.source||d.meta.source||"",flag:c.flag||cat.flag||"",ask:c.ask||cat.ask||""};
    CARDS.push(card);BYID[card.id]=card;
  });
});
const deckCards=id=>CARDS.filter(c=>c.deck===id);

function todayStr(){return dstr(new Date())}
function dstr(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dayDiff(a,b){return Math.round((new Date(b)-new Date(a))/86400000)}

/* ---------------- v1 MIGRATION ---------------- */
/* Copies Patrol Español (pe_*) progress into pk_* once. pe_* keys are left untouched. */
function readPe(k){try{const v=localStorage.getItem("pe_"+k);return v?JSON.parse(v):null}catch(e){return null}}
function migrateV1(force){
  if(!force&&localStorage.getItem("pk_migrated"))return 0;
  let n=0;
  const old=readPe("srs");
  if(old){const cur=LS.get("srs",{});
    for(const[k,r]of Object.entries(old)){const id="es-"+k;if(BYID[id]&&!cur[id]){cur[id]=r;n++}}
    LS.set("srs",cur)}
  const les=readPe("lessons");if(les)LS.set("lessons",{...les,...LS.get("lessons",{})});
  const vo=readPe("vopt");if(vo&&!LS.get("vopt",null))LS.set("vopt",vo);
  try{localStorage.setItem("pk_migrated",JSON.stringify({on:todayStr(),cards:n}))}catch(e){}
  return n;
}

/* ---------------- SRS ---------------- */
function srs(){return LS.get("srs",{})}
function gradeItem(id,ok){
  const s=srs();const rec=s[id]||{box:0,seen:0};
  rec.seen++;
  rec.box=ok?Math.min(rec.box+1,5):Math.max(rec.box-1,0);
  rec.miss=!ok;
  const d=new Date();d.setDate(d.getDate()+INTERVALS[rec.box]);
  rec.due=dstr(d);
  s[id]=rec;LS.set("srs",s);
}
function activeDecks(){
  const saved=LS.get("active",null);
  const all=DECKS.filter(d=>d.cards.length).map(d=>d.meta.id);
  return saved?all.filter(id=>saved.includes(id)):all;
}
function activeCards(){const a=new Set(activeDecks());return CARDS.filter(c=>a.has(c.deck))}
/* cards whose most recent answer was a miss (older records: box 0 after being seen) */
function isMissed(r){return !!r&&(r.miss!==undefined?r.miss:r.box===0&&r.seen>0)}
function missedCards(deckId){const s=srs();return (deckId?deckCards(deckId):activeCards()).filter(c=>isMissed(s[c.id]))}

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}

/* ---------------- SPEECH (es-MX, fr-CA) ---------------- */
const VOICE_PREFS={"es-MX":[/es[-_]MX/i,/es[-_]US/i,/^es/i],"fr-CA":[/fr[-_]CA/i,/^fr/i]};
let VOICES=[];
function loadVoices(){VOICES=speechSynthesis.getVoices()}
if("speechSynthesis" in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}
function voiceFor(lang){for(const re of VOICE_PREFS[lang]||[]){const v=VOICES.find(v=>re.test(v.lang));if(v)return v}return null}
function speak(text,lang){
  lang=lang||"es-MX";
  if(!("speechSynthesis" in window))return toast("Audio not supported on this device");
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g,". ").replace(/\(.*?\)/g,""));
  const v=voiceFor(lang);u.lang=v?v.lang:lang;if(v)u.voice=v;u.rate=0.88;
  speechSynthesis.speak(u);
}

function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(t._tm);t._tm=setTimeout(()=>t.classList.remove("show"),1800)}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
const A=v=>esc(JSON.stringify(v)); // safe inline-handler argument

/* ---------------- ROUTER ---------------- */
const app=document.getElementById("app");
let view={name:"home"};
function go(v){view=v;render();window.scrollTo(0,0)}
function render(){
  const r={home:renderHome,deck:renderDeck,drill:renderDrill,browse:renderBrowseCats,browselist:renderBrowseList,
    grammar:renderGrammarList,lesson:renderLesson,verbs:renderVerbSetup,verbdrill:renderVerbDrill,settings:renderSettings,field:renderFieldList,spin:renderSpin}[view.name]||renderHome;
  r();
}
function topbar(title,backTo){
  return `<div class="topbar"><button class="back" onclick="go(${A(backTo)})">&#8249; BACK</button><h2>${esc(title)}</h2><div class="spacer"></div></div>`;
}
const deckVar=id=>`--deck:${DECK[id].meta.color}`;

/* ---------------- HOME ---------------- */
function renderHome(){
  const s=srs();
  const act=activeDecks();
  const pool=activeCards();
  const seen=CARDS.filter(c=>s[c.id]).length;
  const mastered=CARDS.filter(c=>s[c.id]&&s[c.id].box>=4).length;
  const decks=DECKS.filter(d=>d.cards.length);
  app.innerHTML=`
  <div class="brand"><h1>KEEP<span>ERS</span></h1><div class="sub">Little things that matter</div></div>
  <div class="startrow">${startBlock(null,`Shuffle all · ${pool.length} cards`)}<button class="spinicon" onclick="go({name:'spin'})" aria-label="Spin for one card">${SPIN_ICON}<span>Spin</span></button></div>
  <div class="sectionlabel">Decks</div>
  <div class="decklist">
    ${decks.map(d=>{const id=d.meta.id;const on=act.includes(id);const all=deckCards(id);
      return `<div class="deckrow ${on?"":"off"}" style="${deckVar(id)}">
        <button class="open" onclick="go(${A({name:"deck",id})})"><span class="t">${esc(d.meta.name)}</span><br><span class="c">${all.length} cards</span></button>
        <button class="toggle" role="switch" aria-checked="${on}" aria-label="Include ${esc(d.meta.name)} in Shuffle All" onclick="toggleDeck(${A(id)})"><span class="sw"></span></button>
      </div>`}).join("")}
  </div>
  ${FIELD.length?`<div class="sectionlabel">Test yourself</div><div class="shuffle"><button class="btn ghost" onclick="go({name:'field'})">Field Scenarios<span class="sub">${Object.keys(LS.get("field",{})).length} / ${FIELD.length} run · one situation, questions from every deck</span></button></div>`:""}
  <div class="stats">
    <div class="stat"><div class="n">${seen}</div><div class="l">cards seen</div></div>
    <div class="stat"><div class="n">${mastered}</div><div class="l">mastered</div></div>
    <div class="stat"><div class="n">${CARDS.length}</div><div class="l">total cards</div></div>
  </div>
  <div class="footer">
    ${DECKS.some(d=>d.meta.lang==="es-MX")?`<button onclick="speak('Bienvenido, agente. Listo para practicar.','es-MX')">🔊 Test Spanish audio</button>`:""}
    ${DECKS.some(d=>d.meta.lang==="fr-CA")?`<button onclick="speak('Bonjour, agent. Prêt à pratiquer.','fr-CA')">🔊 Test French audio</button>`:""}
    <button onclick="go({name:'settings'})">Backup &amp; reset</button>
    <div class="src">Public-source study aid. Not official CBP training material. Every card lists its source — verify against it.</div>
  </div>`;
}
function toggleDeck(id){
  const all=DECKS.filter(d=>d.cards.length).map(d=>d.meta.id);
  let a=activeDecks();
  if(a.includes(id)){if(a.length===1)return toast("Keep at least one deck on");a=a.filter(x=>x!==id)}else a=all.filter(x=>x===id||a.includes(x));
  LS.set("active",a);render();
}

/* ---------------- DECK PAGE ---------------- */
function renderDeck(){
  const d=DECK[view.id];if(!d)return go({name:"home"});
  const id=d.meta.id;const all=deckCards(id);const sub=d.meta.subModes||["browse"];
  const lp=LS.get("lessons",{});
  const tiles={
    browse:`<button class="mode" onclick="go(${A({name:"browse",deck:id})})"><span class="t">${id==="spanish"?"Field Phrases":"Browse"}</span><span class="d">${id==="spanish"?"Commands, questioning, medical, processing — by situation.":"Every card by category, with sources."}</span><span class="tag">${[...new Set(all.map(c=>c.cat))].length} CATEGORIES</span></button>`,
    grammar:`<button class="mode" onclick="go({name:'grammar'})"><span class="t">Grammar Bites</span><span class="d">The 1943 manual's 28 lessons, condensed to 15 + quizzes.</span><span class="tag">${GRAMMAR.filter(g=>lp[g.id]).length}/${GRAMMAR.length} DONE</span></button>`,
    verbs:`<button class="mode" onclick="go({name:'verbs'})"><span class="t">Verb Trainer</span><span class="d">Present, preterite & command drills on the ${VERBS.length} verbs that matter.</span><span class="tag">${VERBS.length} VERBS</span></button>`
  };
  app.innerHTML=topbar(d.meta.name.toUpperCase(),{name:"home"})+`
  <div style="${deckVar(id)}">
  <div class="deckhead"><p>${esc(d.meta.blurb||"")}</p></div>
  ${startBlock(id,`Shuffle this deck · ${all.length} cards`)}
  <div class="modes">${sub.map(m=>tiles[m]||"").join("")}</div>
  <div class="footer"><div class="src">Source: ${esc(d.meta.source||"see each card")}</div></div>
  </div>`;
}

/* ---------------- CARD SESSIONS ---------------- */
let SESSION=null;
/* Start (or Resume) plus Review-missed buttons, for Home (deckId null) or one deck */
function startBlock(deckId,sub){
  const sv=savedSession(deckId);const nm=missedCards(deckId).length;
  const main=sv
    ?`<button class="btn" onclick="resumeDrill(${A(deckId)})">▶ Resume<span class="sub">Card ${sv.idx+1} of ${sv.ids.length}</span></button>
      <button class="linkbtn" onclick="startDrill(${A(deckId)})">Start over with a fresh shuffle</button>`
    :`<button class="btn" onclick="startDrill(${A(deckId)})">▶ Start<span class="sub">${sub}</span></button>`;
  return `<div class="shuffle">${main}${nm?`<button class="btn ghost missedbtn" onclick="startMissed(${A(deckId)})">Review missed<span class="sub">${nm} card${nm===1?"":"s"} you got wrong last time</span></button>`:""}</div>`;
}
/* a shuffle in progress survives leaving the page; one saved run per scope (all, or a deck) */
function savedSession(deckId){
  const sv=LS.get("session",{})[deckId||"_all"];if(!sv)return null;
  const ids=sv.ids.filter(id=>BYID[id]);if(!ids.length||sv.idx>=ids.length)return null;
  return{...sv,ids};
}
function saveSession(){
  const S=SESSION;if(!S||S.kind!=="drill")return;
  const all=LS.get("session",{});const k=S.deckId||"_all";
  if(S.idx>=S.ids.length||S.ended)delete all[k];else all[k]={ids:S.ids,idx:S.idx,results:S.results};
  LS.set("session",all);
}
function resumeDrill(deckId){
  const sv=savedSession(deckId);if(!sv)return startDrill(deckId);
  SESSION={...newSession(sv.ids,"drill",deckId),idx:sv.idx,results:sv.results||[]};
  SESSION.st=freshCardState(BYID[SESSION.ids[SESSION.idx]]);
  go({name:"drill"});
}
function startMissed(deckId,ids){
  ids=shuffle(ids||missedCards(deckId).map(c=>c.id));if(!ids.length)return toast("No missed cards");
  SESSION=newSession(ids,"review",deckId);go({name:"drill"});
}
function startDrill(deckId){
  // every card in the active decks (or one deck), in random order
  const order=shuffle((deckId?deckCards(deckId):activeCards()).map(c=>c.id));
  const last=LS.get("lastFirst",null);
  if(order.length>1&&order[0]===last)order.push(order.shift());
  LS.set("lastFirst",order[0]);
  SESSION=newSession(order,"drill",deckId);saveSession();
  go({name:"drill"});
}
function newSession(ids,kind,deckId){return{ids,idx:0,results:[],kind,deckId:deckId||null,st:freshCardState(BYID[ids[0]])}}
/* the card shown at step i: a deck card, or a Field Problem step (deck card by ref, or inline) */
function sessionCard(S,i){
  if(S.kind!=="field")return BYID[S.ids[i]];
  const step=S.problem.steps[i];if(!step)return null;
  if(step.ref)return BYID[step.ref];
  const fed=(step.feeds||[]).map(id=>BYID[id]).filter(Boolean);
  return{...step,id:S.ids[i],deck:step.deck||(fed[0]&&fed[0].deck),group:"",cat:"Field Scenario",
    why:step.why||(fed[0]&&fed[0].why)||"",source:step.source||(fed[0]&&fed[0].source)||""};
}
function freshCardState(c){
  if(!c)return{};
  if(c.type==="mc"||c.type==="scenario")return{answered:null,order:shuffle(c.choices.map((_,i)=>i))};
  if(c.type==="order")return{pool:shuffle(c.steps.map((_,i)=>i)),picked:[],checked:false};
  return{flipped:false};
}

function kindLabel(c){const d=DECK[c.deck].meta;return [d.short||d.name,c.group,c.cat].filter(Boolean).join(" · ")}
function speakBtn(c){
  const lang=c.lang||DECK[c.deck].meta.lang;if(!lang)return"";
  const text=c.speak||c.front;if(!text)return"";
  return `<div style="text-align:center;margin-bottom:14px"><button class="speak" onclick="event.stopPropagation();speak(${A(text)},${A(lang)})">🔊 Listen</button></div>`;
}
function metaBack(c){
  return `<span class="meta-back">
    ${c.flag?`<span class="flagchip"><b>⚠ NOTE</b>${esc(c.flag)}</span>`:""}
    ${c.why?`<span class="why" style="display:block"><b>Why it matters</b>${esc(c.why)}</span>`:""}
    <span class="src" style="display:block"><b>Source</b>${esc(c.source)}${c.binding?` <span class="bindtag ${/^(SCOTUS|2d Cir)/.test(c.binding)?"binding":""}">${esc(c.binding)}</span>`:""}</span>
  </span>`;
}

function renderDrill(){
  const S=SESSION;
  if(!S){go({name:"home"});return}
  if(S.idx>=S.ids.length){return renderDrillDone()}
  const c=sessionCard(S,S.idx);
  const dots=S.ids.length>20?`<div class="counter">${S.idx+1} / ${S.ids.length}</div>`:S.ids.map((_,i)=>`<div class="pdot ${i<S.idx?(S.results[i]===true?"done":S.results[i]===false?"miss":""):""} ${i===S.idx?"cur":""}"></div>`).join("");
  const title=S.kind==="field"?"FIELD SCENARIO":S.kind==="review"?"REVIEW MISSED":S.deckId?DECK[S.deckId].meta.name.toUpperCase():"SHUFFLE ALL";
  const step=S.kind==="field"?S.problem.steps[S.idx]:null;
  const lead=S.kind!=="field"?"":`<div class="situation">${S.idx===0?`<h3>${esc(S.problem.title)}</h3><p>${esc(S.problem.situation)}</p>`:""}${step.narrative?`<p>${esc(step.narrative)}</p>`:""}</div>`;
  const body={flip:flipHTML,mc:choiceHTML,scenario:choiceHTML,order:orderHTML}[c.type](c,S.st);
  const answered=S.st.answered!=null||S.st.checked;
  const ctl=`<div class="skiprow"><button class="linkbtn" onclick="endSession()">Finish here</button>${answered?"":`<button class="linkbtn" onclick="skipCard()">Skip ›</button>`}</div>`;
  app.innerHTML=`${topbar(title,sessionHome(S))}<div class="progress">${dots}</div>${lead}<div style="${deckVar(c.deck)}">${body}</div>${ctl}`;
}

/* flip */
function flipHTML(c,st){
  return `<div class="cardwrap">
    <button class="fcard" onclick="flipCard()" aria-label="Tap to reveal answer">
      <span class="kind">${esc(kindLabel(c))}</span>
      ${c.ask?`<span class="ask">${esc(c.ask)}</span>`:""}<span class="big ${c.deck==="spanish"?"es":""} ${String(c.front).length>70?"long":""}">${esc(c.front)}</span>
      ${st.flipped?`<span class="trans ${c.rev?"cite":""}">${esc(c.back)}</span>${c.rule?`<span class="rule"><b>Rule</b>${esc(c.rule)}</span>`:""}${c.field?`<span class="rule"><b>Field</b>${esc(c.field)}</span>`:""}${c.note?`<span class="note">${esc(c.note)}</span>`:""}${metaBack(c)}`:`<span class="hint">Tap to reveal</span>`}
    </button>
  </div>
  ${speakBtn(c)}
  ${st.flipped
    ?`<div class="gradebtns"><button class="btn missed" onclick="gradeCard(false)">Missed it</button><button class="btn got" onclick="gradeCard(true)">Got it</button></div>`
    :`<button class="btn ghost" onclick="flipCard()">Show answer</button>`}`;
}
function flipCard(){SESSION.st.flipped=true;render()}

/* multiple choice + scenario */
function choiceHTML(c,st){
  const done=st.answered!==null;
  return `<div class="quiz card">
    <span class="kind">${esc(kindLabel(c))}${c.type==="scenario"?" · Scenario":""}</span>
    ${c.setup?`<div class="setup">${esc(c.setup)}</div>`:""}
    <div class="q">${esc(c.q)}</div>
    ${st.order.map(i=>{let cls="opt";if(done){if(i===c.answer)cls+=" correct";else if(i===st.answered)cls+=" wrong"}
      return `<button class="${cls}" ${done?"disabled":""} onclick="answerChoice(${i})">${esc(c.choices[i])}</button>`}).join("")}
    ${done?`<div class="why"><b>${st.answered===c.answer?"Correct.":"Not quite."}</b> ${esc(c.explain||"")}</div>${metaBack(c)}`:""}
  </div>
  ${speakBtn(c)}
  ${done?`<button class="btn" onclick="gradeCard(${st.answered===c.answer})">Next</button>`:""}`;
}
function answerChoice(i){SESSION.st.answered=i;render();
  setTimeout(()=>{const w=document.querySelector(".quiz .why");if(w)w.scrollIntoView({behavior:"smooth",block:"center"})},50)}

/* step ordering: tap steps in sequence */
function orderHTML(c,st){
  const rows=st.picked.map((si,pos)=>{
    let cls="ostep placed",fix="";
    if(st.checked){if(si===pos)cls="ostep correct";else{cls="ostep wrong";fix=`<span class="fix">Step ${si+1} in the correct order</span>`}}
    return `<button class="${cls}" ${st.checked?"disabled":""} onclick="unpickStep(${pos})"><span class="n">${pos+1}</span><span>${esc(c.steps[si])}${fix}</span></button>`}).join("");
  const ok=st.checked&&st.picked.every((si,pos)=>si===pos);
  return `<div class="quiz card">
    <span class="kind">${esc(kindLabel(c))} · Put in order</span>
    <div class="q">${esc(c.q)}</div>
    ${st.picked.length?`<div class="olabel">Your order — tap to remove</div><div class="olist">${rows}</div>`:""}
    ${st.pool.length?`<div class="olabel">Tap the ${st.picked.length?"next":"first"} step</div>`+st.pool.map(si=>`<button class="ostep" onclick="pickStep(${si})"><span class="n">·</span><span>${esc(c.steps[si])}</span></button>`).join(""):""}
    ${st.checked?`<div class="why"><b>${ok?"Correct sequence.":"Sequence off."}</b> ${esc(c.explain||"")}</div>${metaBack(c)}`:""}
  </div>
  ${!st.checked&&!st.pool.length?`<button class="btn" onclick="checkOrder()">Check order</button>`:""}
  ${st.checked?`<button class="btn" onclick="gradeCard(${ok})">Next</button>`:""}`;
}
function pickStep(si){const st=SESSION.st;st.pool=st.pool.filter(x=>x!==si);st.picked.push(si);render()}
function unpickStep(pos){const st=SESSION.st;const si=st.picked.splice(pos,1)[0];st.pool.push(si);render()}
function checkOrder(){SESSION.st.checked=true;render()}

function gradeCard(ok){
  const S=SESSION;
  if(S.kind==="field"){
    // a deck card grades normally; an inline step's miss demotes the cards it tests in their own decks
    const step=S.problem.steps[S.idx];
    if(step.ref)gradeItem(step.ref,ok);else if(!ok)(step.feeds||[]).forEach(id=>gradeItem(id,false));
  }else gradeItem(S.ids[S.idx],ok);
  advance(ok);
}
/* move on; ok is true / false, or null for a skip (nothing graded) */
function advance(ok){
  const S=SESSION;S.results.push(ok);S.idx++;S.st=freshCardState(sessionCard(S,S.idx));saveSession();render();window.scrollTo(0,0);
}
function skipCard(){advance(null)}
const sessionHome=S=>S.kind==="field"?{name:"field"}:S.deckId?{name:"deck",id:S.deckId}:{name:"home"};
function endSession(){
  const S=SESSION;if(!S)return;
  S.ended=true;saveSession();
  if(!S.results.some(r=>r!==null)){SESSION=null;return go(sessionHome(S))}
  renderDrillDone();window.scrollTo(0,0);
}
let LASTMISSED=[];
function renderDrillDone(){
  const S=SESSION;
  if(S.kind==="field")return renderFieldDone();
  const got=S.results.filter(r=>r===true).length,miss=S.results.filter(r=>r===false).length,skip=S.results.filter(r=>r===null).length;
  LASTMISSED=S.ids.filter((_,i)=>S.results[i]===false);
  app.innerHTML=`
  ${topbar("COMPLETE",sessionHome(S))}
  <div class="panel" style="text-align:center">
    <div class="scoreline">${got} / ${got+miss} ON TARGET</div>
    <p>${miss?`${miss} missed.`:got?"Clean sweep.":"Nothing graded."}${skip?` ${skip} skipped.`:""}</p>
  </div>
  ${miss?`<div class="shuffle"><button class="btn" onclick="startMissed(${A(S.deckId)},LASTMISSED)">Go over the ${miss} missed<span class="sub">Right now, while it's fresh</span></button></div>`:""}
  <div class="btnrow">
    <button class="btn ghost" onclick="go(${A(sessionHome(S))})">${S.deckId?"Deck":"Home"}</button>
    <button class="btn ${miss?"ghost":""}" onclick="startDrill(${A(S.deckId)})">New shuffle</button>
  </div>`;
  SESSION=null;
}

/* ---------------- FIELD SCENARIOS (data file: decks/field.js) ---------------- */
function renderFieldList(){
  const rec=LS.get("field",{});
  const fresh=FIELD.filter(f=>!rec[f.id]).length;
  app.innerHTML=topbar("FIELD SCENARIOS",{name:"home"})+`<p class="smallprint">Real situations, step by step. Each step pulls from a different deck, and a miss sends those cards back into review.</p>
  <div class="shuffle"><button class="btn" onclick="startField(randomField())">▶ Random scenario<span class="sub">${fresh?`${fresh} you haven't run yet`:`All ${FIELD.length} run · picks your weakest`}</span></button></div>`+
    FIELD.map(f=>{const r=rec[f.id];const decks=[...new Set(f.steps.map(st=>(st.ref?BYID[st.ref].deck:st.deck)))];
      return `<button class="lesson-item" onclick="startField(${A(f.id)})">
      <span class="t"><span class="name">${esc(f.title)}</span><br><span class="tag">${f.steps.length} steps · ${decks.map(d=>esc(DECK[d].meta.short||d)).join(" · ")}</span></span>
      ${r?`<span class="check">${r.best}/${f.steps.length}</span>`:""}</button>`}).join("");
}
/* unrun problems first; once all are run, the lowest best score */
function randomField(){const rec=LS.get("field",{});const unrun=FIELD.filter(f=>!rec[f.id]);
  if(unrun.length)return unrun[Math.floor(Math.random()*unrun.length)].id;
  const ratio=f=>rec[f.id].best/f.steps.length;const low=Math.min(...FIELD.map(ratio));
  const weak=FIELD.filter(f=>ratio(f)===low);return weak[Math.floor(Math.random()*weak.length)].id}
function startField(id){
  const f=FIELD.find(x=>x.id===id);
  SESSION={ids:f.steps.map((st,i)=>st.ref||`${f.id}-s${i+1}`),idx:0,results:[],kind:"field",problem:f,deckId:null};
  SESSION.st=freshCardState(sessionCard(SESSION,0));
  go({name:"drill"});
}
function renderFieldDone(){
  const S=SESSION;const f=S.problem;const got=S.results.filter(r=>r===true).length;
  const rec=LS.get("field",{});const prev=rec[f.id];
  rec[f.id]={best:Math.max(got,prev?prev.best:0),last:got,on:todayStr()};LS.set("field",rec);
  const missed=f.steps.map((st,i)=>({st,i})).filter(x=>S.results[x.i]===false);
  const fed=[...new Set(missed.flatMap(x=>x.st.ref?[x.st.ref]:(x.st.feeds||[])))].map(id=>BYID[id]).filter(Boolean);
  app.innerHTML=`
  ${topbar("DEBRIEF",{name:"field"})}
  <div class="panel" style="text-align:center">
    <div class="scoreline">${got} / ${f.steps.length} STEPS</div>
    <p>${missed.length?"These cards are back in review in their decks:":"Clean run. Nothing fed back."}</p>
  </div>
  ${fed.length?`<div class="card-list">${fed.map(c=>{const sm=cardSummary(c);return `<div class="phrase" style="${deckVar(c.deck)}"><div class="es">${esc(DECK[c.deck].meta.name)} · ${esc(c.front||c.q)}</div><div class="en">${esc(sm.b)}</div></div>`}).join("")}</div>`:""}
  <div class="btnrow" style="margin-top:12px">
    <button class="btn ghost" onclick="go({name:'field'})">All scenarios</button>
    <button class="btn" onclick="startField(${A(f.id)})">Run it again</button>
  </div>`;
  SESSION=null;
}

/* ---------------- BROWSE (any deck, by category) ---------------- */
function renderBrowseCats(){
  const d=DECK[view.deck];const all=deckCards(view.deck);
  // Spanish keeps v1's "Field Phrases" view: phrase categories only
  const list=view.deck==="spanish"?all.filter(c=>c.group==="Phrases"):all;
  const cats=[...new Set(list.map(c=>c.cat))];
  app.innerHTML=topbar(view.deck==="spanish"?"FIELD PHRASES":d.meta.name.toUpperCase(),{name:"deck",id:view.deck})+`<div class="catlist">`+
    cats.map(cat=>{const n=list.filter(c=>c.cat===cat).length;
      return `<button class="cat" onclick="go(${A({name:"browselist",deck:view.deck,cat})})"><span><span class="t">${esc(cat)}</span><br><span class="c">${n} card${n===1?"":"s"}</span></span><span class="arrow">›</span></button>`}).join("")+`</div>`;
}
function cardSummary(c){
  if(c.type==="flip")return{a:c.front,b:c.back};
  if(c.type==="order")return{a:c.q,b:c.steps.map((s,i)=>(i+1)+". "+s).join("  ")};
  return{a:(c.setup?c.setup+" ":"")+c.q,b:c.choices[c.answer]};
}
function renderBrowseList(){
  const list=deckCards(view.deck).filter(c=>c.cat===view.cat);
  const lang=DECK[view.deck].meta.lang;
  app.innerHTML=topbar(view.cat.toUpperCase(),{name:"browse",deck:view.deck})+`<div class="card-list" style="${deckVar(view.deck)}">`+
    list.map(c=>{const s=cardSummary(c);return `<div class="phrase"><div class="row"><div style="flex:1">
      <div class="es">${esc(s.a)}</div><div class="en">${esc(s.b)}</div>${c.rule?`<div class="en"><b>Rule:</b> ${esc(c.rule)}</div>`:""}${c.field?`<div class="en"><b>Field:</b> ${esc(c.field)}</div>`:""}${c.note?`<div class="note">${esc(c.note)}</div>`:""}
      ${view.deck==="spanish"?"":metaBack(c)}</div>
      ${lang&&c.type==="flip"?`<button class="sp" onclick="speak(${A(c.speak||c.front)},${A(lang)})" aria-label="Listen">🔊</button>`:""}</div></div>`}).join("")+`</div>`;
}

/* ---------------- GRAMMAR (Spanish sub-mode, from v1) ---------------- */
function renderGrammarList(){
  const lp=LS.get("lessons",{});
  app.innerHTML=topbar("GRAMMAR BITES",{name:"deck",id:"spanish"})+
    GRAMMAR.map((g,i)=>`<button class="lesson-item" onclick="go({name:'lesson',i:${i}})">
      <span class="num">${String(i+1).padStart(2,"0")}</span>
      <span class="t"><span class="name">${esc(g.title)}</span><br><span class="tag">${esc(g.tag)}</span></span>
      ${lp[g.id]?`<span class="check">✓</span>`:""}
    </button>`).join("");
}
let QUIZ=null;
function renderLesson(){
  const g=GRAMMAR[view.i];
  if(!QUIZ||QUIZ.gid!==g.id)QUIZ=null;
  app.innerHTML=topbar("LESSON "+String(view.i+1).padStart(2,"0"),{name:"grammar"})+
    `<div class="lessonbody"><h4 style="font-size:1.25rem">${esc(g.title)}</h4>${g.body}</div>`+
    (QUIZ?quizHTML(g):`<button class="btn" onclick="startQuiz(${view.i})">Take the ${g.quiz.length}-question quiz</button>`);
}
function startQuiz(i){const g=GRAMMAR[i];QUIZ={gid:g.id,idx:0,answered:null,score:0,order:shuffle(g.quiz.map((_,k)=>k))};render();
  setTimeout(()=>{const q=document.querySelector(".quiz");if(q)q.scrollIntoView({behavior:"smooth"})},50)}
function quizHTML(g){
  const Q=QUIZ;
  if(Q.idx>=g.quiz.length){
    const pass=Q.score>=Math.ceil(g.quiz.length*0.8);
    if(pass){const lp=LS.get("lessons",{});lp[g.id]=true;LS.set("lessons",lp)}
    return `<div class="quiz" style="text-align:center"><div class="scoreline">${Q.score} / ${g.quiz.length}</div>
      <p style="margin-bottom:12px">${pass?"✓ Lesson marked complete.":"80% marks it complete — run it back."}</p>
      <div class="btnrow"><button class="btn ghost" onclick="QUIZ=null;go({name:'grammar'})">Lessons</button><button class="btn" onclick="startQuiz(${view.i})">Retry quiz</button></div></div>`;
  }
  const q=g.quiz[Q.order[Q.idx]];
  return `<div class="quiz">
    <div class="q">${Q.idx+1}/${g.quiz.length} — ${esc(q.q)}</div>
    ${q.opts.map((o,i)=>{
      let cls="opt";
      if(Q.answered!==null){if(i===q.a)cls+=" correct";else if(i===Q.answered)cls+=" wrong"}
      return `<button class="${cls}" ${Q.answered!==null?"disabled":""} onclick="answerQuiz(${i})">${esc(o)}</button>`}).join("")}
    ${Q.answered!==null?`<div class="why"><b>${Q.answered===q.a?"Correct.":"Not quite."}</b> ${esc(q.why)}</div><button class="btn small" style="margin-top:12px" onclick="nextQuiz()">${Q.idx+1<g.quiz.length?"Next question":"See score"}</button>`:""}
  </div>`;
}
function answerQuiz(i){const g=GRAMMAR[view.i];const q=g.quiz[QUIZ.order[QUIZ.idx]];QUIZ.answered=i;if(i===q.a)QUIZ.score++;render();
  setTimeout(()=>{const w=document.querySelector(".why");if(w)w.scrollIntoView({behavior:"smooth",block:"center"})},50)}
function nextQuiz(){QUIZ.idx++;QUIZ.answered=null;render();
  setTimeout(()=>{const q=document.querySelector(".quiz");if(q)q.scrollIntoView({behavior:"smooth"})},50)}

/* ---------------- VERB TRAINER (Spanish sub-mode, from v1) ---------------- */
let VOPT=null;
let VDRILL=null;
const TENSE_LABEL={pres:"Present",pret:"Preterite (past)",cmd:"Usted command"};
function renderVerbSetup(){
  app.innerHTML=topbar("VERB TRAINER",{name:"deck",id:"spanish"})+`
  <div class="sectionlabel">Tenses to drill</div>
  <div class="chiprow">
    ${["pres","pret","cmd"].map(t=>`<button class="chip ${VOPT.tenses.includes(t)?"on":""}" onclick="toggleTense('${t}')">${TENSE_LABEL[t]}</button>`).join("")}
  </div>
  <div class="panel"><p>10 rounds. You'll see a verb, a person, and a tense — pick the right form. Distractors are real forms of the same verb, so it trains the endings, not luck.</p>
  <button class="btn" onclick="startVerbDrill()">Start 10-round drill</button></div>
  <div class="sectionlabel">The deck — ${VERBS.length} verbs</div>
  <div class="chiprow">${VERBS.map(v=>`<span class="chip">${esc(v.inf)}</span>`).join("")}</div>`;
}
function toggleTense(t){
  const i=VOPT.tenses.indexOf(t);
  if(i>=0){if(VOPT.tenses.length>1)VOPT.tenses.splice(i,1)}else VOPT.tenses.push(t);
  LS.set("vopt",VOPT);render();
}
function makeVerbQ(){
  const v=VERBS[Math.floor(Math.random()*VERBS.length)];
  const tense=VOPT.tenses[Math.floor(Math.random()*VOPT.tenses.length)];
  let correct,personLabel;
  if(tense==="cmd"){correct=v.cmd;personLabel="usted →"}
  else{const pi=Math.floor(Math.random()*5);correct=v[tense][pi];personLabel=PERSONS[pi]}
  const pool=new Set();
  ["pres","pret"].forEach(t=>v[t].forEach(f=>{if(f!==correct)pool.add(f)}));
  if(v.cmd!==correct)pool.add(v.cmd);
  const distract=shuffle([...pool]).slice(0,3);
  const opts=shuffle([correct,...distract]);
  return {v,tense,personLabel,correct,opts};
}
function startVerbDrill(){VDRILL={round:0,score:0,q:makeVerbQ(),answered:null};go({name:"verbdrill"})}
function renderVerbDrill(){
  const D=VDRILL;
  if(!D){go({name:"verbs"});return}
  if(D.round>=10){
    app.innerHTML=topbar("COMPLETE",{name:"verbs"})+
    `<div class="panel" style="text-align:center"><div class="scoreline">${D.score} / 10</div>
    <p>${D.score>=8?"Sharp. Add another tense to raise the difficulty.":"The endings come with reps. Run it again."}</p></div>
    <div class="btnrow"><button class="btn ghost" onclick="go({name:'verbs'})">Setup</button><button class="btn" onclick="startVerbDrill()">Again</button></div>`;
    return;
  }
  const q=D.q;
  app.innerHTML=topbar("VERB DRILL "+(D.round+1)+"/10",{name:"verbs"})+`
  <div class="panel">
    <div class="vprompt">
      <div class="inf">${esc(q.v.inf)}</div>
      <div class="en">${esc(q.v.en)}</div>
      <div class="meta">${TENSE_LABEL[q.tense]} · ${esc(q.personLabel)}</div>
    </div>
  </div>
  <div class="quiz">
    ${q.opts.map((o,i)=>{
      let cls="opt";
      if(D.answered!==null){if(o===q.correct)cls+=" correct";else if(i===D.answered)cls+=" wrong"}
      return `<button class="${cls}" ${D.answered!==null?"disabled":""} onclick="answerVerb(${i})">${esc(o)}</button>`}).join("")}
    ${D.answered!==null?`<div class="why"><b>${q.opts[D.answered]===q.correct?"Correct.":"It's "+esc(q.correct)+"."}</b> <button class="speak" style="margin-top:8px" onclick="speak(${A(q.correct)},'es-MX')">🔊 Hear it</button></div><button class="btn small" style="margin-top:12px" onclick="nextVerb()">Next</button>`:""}
  </div>`;
}
function answerVerb(i){const D=VDRILL;D.answered=i;if(D.q.opts[i]===D.q.correct)D.score++;render()}
function nextVerb(){const D=VDRILL;D.round++;D.answered=null;D.q=makeVerbQ();render()}

/* ---------------- SPIN ----------------
   Fidget-spinner card picker, after the "Didja Spin" concept: flick the spinner, it lands on a
   deck on the ring, and the tray hands you one card from that deck. Tap a deck on the ring to
   stick with it. Grades feed the same card history as every other mode. */
let SPIN=null;
/* small three-lobe spinner for the Home button */
const SPIN_ICON=`<svg viewBox="-100 -100 200 200" aria-hidden="true"><g class="si-rot">${[-90,30,150].map(a=>{const x=(52*Math.cos(a*Math.PI/180)).toFixed(1),y=(52*Math.sin(a*Math.PI/180)).toFixed(1);return `<line x1="0" y1="0" x2="${x}" y2="${y}"/><circle class="si-lobe" cx="${x}" cy="${y}" r="26"/><circle class="si-ball" cx="${x}" cy="${y}" r="9"/>`}).join("")}<circle class="si-hub" r="20"/></g></svg>`;
const SPIN_NS="http://www.w3.org/2000/svg";
const spinRad=d=>d*Math.PI/180;
const spinPt=(r,d)=>(r*Math.cos(spinRad(d))).toFixed(2)+" "+(r*Math.sin(spinRad(d))).toFixed(2);
function spinSvg(name,attrs,parent){const e=document.createElementNS(SPIN_NS,name);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function spinDecks(){const a=activeDecks();return DECKS.filter(d=>d.cards.length&&a.includes(d.meta.id)).slice(0,8)}
const spinLabel=d=>d.meta.spin||d.meta.name.split(" & ")[0];
/* weighted pick: last-answer-wrong cards come back most, unseen next, mastered rarely */
function spinPick(deckId){
  const s=srs();const pool=deckCards(deckId).filter(c=>c.type!=="order");
  let total=0;const w=pool.map(c=>{if(SPIN&&c.id===SPIN.lastId&&pool.length>1)return 0;const r=s[c.id];
    const x=!r?6:isMissed(r)?9:r.box>=4?0.5:2;total+=x;return x});
  let r=Math.random()*total;for(let i=0;i<pool.length;i++){r-=w[i];if(r<=0&&w[i]>0)return pool[i]}
  return pool[pool.length-1];
}
function spinCount(add){const k=todayStr();const all=LS.get("spins",{});if(add){all[k]=(all[k]||0)+1;
  const ks=Object.keys(all).sort();while(ks.length>60)delete all[ks.shift()];LS.set("spins",all)}return all[k]||0}

function renderSpin(){
  const decks=spinDecks();
  if(decks.length<2){app.innerHTML=topbar("SPIN",{name:"home"})+`<div class="panel"><p>Turn on at least two decks on Home to spin.</p></div>`;return}
  app.innerHTML=topbar("SPIN",{name:"home"})+`
  <div class="spinstage"><div id="wheelBox" class="wheel-box">
    <svg id="wheel" class="wheel" viewBox="-205 -205 410 410" aria-label="Spinner with a ring of decks">
      <defs id="wheelDefs"></defs><g id="ring"></g>
      <g class="shadow-wrap"><g id="shadowRot"></g></g>
      <g class="press-wrap"><g id="spinner"><g id="spinBody"></g></g></g>
    </svg>
    <button id="hub" class="hub" type="button">Spin</button>
  </div></div>
  <section id="tray" class="tray" aria-live="polite"></section>`;
  spinInit(decks);
}

function spinInit(decks){
  const prev=SPIN;
  const S=SPIN={decks,angle:prev?prev.angle:0,vel:0,mode:"idle",notchAt:0,deal:false,raf:0,last:0,drag:null,tickSlot:0,
    lastId:prev?prev.lastId:null,lock:LS.get("spinlock",null),sound:LS.get("spinsound",true),card:null,st:null,spun:false,ac:null,lastTick:0};
  if(S.lock&&!decks.some(d=>d.meta.id===S.lock))S.lock=null;
  const $=id=>document.getElementById(id);
  const box=$("wheelBox"),wheel=$("wheel"),ring=$("ring"),defs=$("wheelDefs"),spinnerG=$("spinner"),body=$("spinBody"),shadowRot=$("shadowRot");
  const n=decks.length,step=360/n,R_OUT=200,R_IN=152,GAP=1.3;
  let wedges=[],labels=[];
  const colorOf=id=>DECK[id].meta.color;

  function buildRing(){
    ring.textContent="";defs.textContent="";wedges=[];labels=[];
    decks.forEach((d,i)=>{
      const shown=S.lock?DECK[S.lock]:d,mid=-90+step*i,a0=mid-step/2+GAP,a1=mid+step/2-GAP;
      const w=spinSvg("path",{class:"wedge",d:"M"+spinPt(R_OUT,a0)+" A"+R_OUT+" "+R_OUT+" 0 0 1 "+spinPt(R_OUT,a1)+" L"+spinPt(R_IN,a1)+" A"+R_IN+" "+R_IN+" 0 0 0 "+spinPt(R_IN,a0)+" Z",
        role:"button",tabindex:"0","data-deck":d.meta.id,"aria-label":S.lock?"Bring the other decks back":"Only "+spinLabel(d),"aria-pressed":S.lock?"true":"false"},ring);
      w.style.fill=colorOf(shown.meta.id);wedges.push(w);
      const upper=Math.sin(spinRad(mid))<=0.01,r=upper?169:183,half=Math.min(step/2-3,80);
      spinSvg("path",{id:"spinArc"+i,d:"M"+spinPt(r,upper?mid-half:mid+half)+" A"+r+" "+r+" 0 0 "+(upper?1:0)+" "+spinPt(r,upper?mid+half:mid-half)},defs);
      const label=spinLabel(shown),room=spinRad(half*2)*169;
      const t=spinSvg("text",{class:"wedge-label"+(label.length*11.5>room*0.94?" small":""),"aria-hidden":"true"},ring);
      const tp=spinSvg("textPath",{href:"#spinArc"+i,startOffset:"50%","text-anchor":"middle"},t);tp.textContent=label;labels.push(t);
    });
  }
  /* three lobes on a hub; the lobe under the pointer is the one that counts */
  const LOBES=[-90,30,150],LOBE_D=92,LOBE_R=44,ARM_W=60,HUB_R=50;
  function bodyLayer(cls,grow,parent){const g=spinSvg("g",{class:cls},parent);
    LOBES.forEach(a=>{const x=LOBE_D*Math.cos(spinRad(a)),y=LOBE_D*Math.sin(spinRad(a));
      spinSvg("line",{x1:0,y1:0,x2:x.toFixed(2),y2:y.toFixed(2),"stroke-width":ARM_W+grow*2,"stroke-linecap":"round"},g);
      spinSvg("circle",{cx:x.toFixed(2),cy:y.toFixed(2),r:LOBE_R+grow},g)});
    spinSvg("circle",{cx:0,cy:0,r:HUB_R+grow},g)}
  bodyLayer("body-shadow",3,shadowRot);bodyLayer("body-edge",3,body);bodyLayer("body-fill",0,body);
  spinSvg("polygon",{class:"pointer",points:"0,-150 -11,-131 11,-131"},body);
  LOBES.forEach((a,i)=>{const cx=LOBE_D*Math.cos(spinRad(a)),cy=LOBE_D*Math.sin(spinRad(a)),m=i===0?" marked":"";
    spinSvg("circle",{class:"race"+m,cx:cx.toFixed(2),cy:cy.toFixed(2),r:25},body);
    spinSvg("circle",{class:"ball"+m,cx:cx.toFixed(2),cy:cy.toFixed(2),r:9},body)});

  /* sound and buzz */
  function audio(){if(!S.sound)return null;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;S.ac=S.ac||new C();if(S.ac.state==="suspended")S.ac.resume();return S.ac}catch(e){return null}}
  function blip(f,at,len,peak,type){const ac=S.ac,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;
    g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(peak,at+0.004);g.gain.exponentialRampToValueAtTime(0.0001,at+len);
    o.connect(g);g.connect(ac.destination);o.start(at);o.stop(at+len+0.02)}
  function tick(speed){const now=performance.now();if(now-S.lastTick<30)return;S.lastTick=now;if(!audio()||S.ac.state!=="running")return;
    const k=Math.min(1,speed/2400);blip(950+800*k+Math.random()*120,S.ac.currentTime,0.04-0.012*k,0.1-0.03*k,"triangle")}
  function chime(){if(audio()&&S.ac.state==="running"){blip(660,S.ac.currentTime,0.22,0.12,"sine");blip(990,S.ac.currentTime+0.09,0.3,0.1,"sine")}
    try{if(navigator.vibrate)navigator.vibrate(12)}catch(e){}}

  /* physics: coast with drag and friction, then drop into the nearest wedge with a small bounce */
  const DRAG=1.0,RUB=90,NOTCH=140,SPRING=220,DAMP=16.3;
  function paint(){const rot="rotate("+S.angle.toFixed(2)+")";spinnerG.setAttribute("transform",rot);shadowRot.setAttribute("transform",rot);
    const slot=Math.floor((S.angle+step/2)/step);if(slot!==S.tickSlot){S.tickSlot=slot;tick(Math.abs(S.vel))}}
  function frame(now){
    if(view.name!=="spin"||SPIN!==S){S.raf=0;return}
    const dt=Math.min(Math.max((now-S.last)/1000,0),0.05);S.last=now;
    const parts=Math.max(1,Math.ceil(dt/0.006)),h=dt/parts;
    for(let i=0;i<parts&&S.mode!=="idle";i++){
      if(S.mode==="free"){const sg=S.vel<0?-1:1;S.vel-=(DRAG*S.vel+RUB*sg)*h;if((S.vel<0?-1:1)!==sg)S.vel=0;S.angle+=S.vel*h;
        if(Math.abs(S.vel)<NOTCH){S.notchAt=Math.round((S.angle+S.vel*0.22)/step)*step;S.mode="notch"}}
      else if(S.mode==="notch"){S.vel+=(-SPRING*(S.angle-S.notchAt)-DAMP*S.vel)*h;S.angle+=S.vel*h;
        if(Math.abs(S.vel)<4&&Math.abs(S.angle-S.notchAt)<0.3){S.angle=S.notchAt;S.vel=0;S.mode="idle"}}
    }
    paint();
    if(S.mode==="idle"){S.raf=0;if(S.deal){S.deal=false;land()}}else S.raf=requestAnimationFrame(frame);
  }
  function run(){if(S.raf)return;S.last=performance.now();S.raf=requestAnimationFrame(frame)}
  function clearLanding(){wheel.classList.remove("landed");wedges.forEach(w=>w.classList.remove("lit"));labels.forEach(l=>l.classList.remove("lit"))}
  function launch(v){clearLanding();S.card=null;trayRest();S.deal=true;const dir=v<0?-1:1;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){S.angle=(Math.round(S.angle/step)+dir*(1+Math.floor(Math.random()*n)))*step;S.vel=0;S.mode="idle";paint();S.deal=false;land();return}
    S.vel=dir*Math.min(2800,Math.max(380,Math.abs(v)*(0.86+Math.random()*0.28)));S.mode="free";run()}
  const spinDefault=()=>launch(1450+Math.random()*750);
  function land(){
    const idx=((Math.round(S.angle/step)%n)+n)%n,deckId=S.lock||decks[idx].meta.id;
    wheel.classList.add("landed");wedges[idx].classList.add("lit");labels[idx].classList.add("lit");
    const c=spinPick(deckId);S.lastId=c.id;S.card=c;S.st=freshCardState(c);S.spun=true;spinCount(true);trayCard();chime();
  }
  /* flick: the spinner follows the finger, then keeps going */
  function pAngle(e){const r=box.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI}
  box.addEventListener("pointerdown",e=>{
    if(e.button||e.target.closest("#hub"))return;
    const wedge=e.target.closest?e.target.closest("[data-deck]"):null,was=S.mode!=="idle";
    if(S.raf){cancelAnimationFrame(S.raf);S.raf=0}
    S.mode="drag";S.vel=0;S.deal=false;paint();
    S.drag={id:e.pointerId,wedge:wedge?wedge.getAttribute("data-deck"):null,caught:was,x:e.clientX,y:e.clientY,last:pAngle(e),live:false,samples:[{t:performance.now(),a:S.angle}]};
    if(!wedge)box.classList.add("pressed");try{box.setPointerCapture(e.pointerId)}catch(err){}
  });
  box.addEventListener("pointermove",e=>{const d=S.drag;if(!d||e.pointerId!==d.id)return;
    const a=pAngle(e);let dd=a-d.last;if(dd>180)dd-=360;if(dd<-180)dd+=360;d.last=a;
    if(!d.live){if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<8)return;d.live=true;box.classList.add("pressed");clearLanding();dd=0}
    S.angle+=dd;paint();d.samples.push({t:performance.now(),a:S.angle});if(d.samples.length>12)d.samples.shift()});
  function endDrag(e,cancelled){const d=S.drag;if(!d||e.pointerId!==d.id)return;S.drag=null;S.mode="idle";box.classList.remove("pressed");audio();
    if(!d.live){if(d.wedge&&!d.caught&&!cancelled)toggleLock(d.wedge);else spinDefault();return}
    const now=performance.now(),ref=d.samples.find(s=>now-s.t<=110)||d.samples[d.samples.length-1],dt=(now-ref.t)/1000;
    let v=dt>0.012?(S.angle-ref.a)/dt:0;if(Math.abs(v)<60)v=(S.angle-d.samples[0].a)>=0?450:-450;launch(v)}
  box.addEventListener("pointerup",e=>endDrag(e,false));
  box.addEventListener("pointercancel",e=>endDrag(e,true));
  $("hub").addEventListener("click",()=>{audio();spinDefault()});
  ring.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const id=e.target.getAttribute&&e.target.getAttribute("data-deck");if(!id)return;e.preventDefault();toggleLock(id)});
  function toggleLock(id){if(S.raf){cancelAnimationFrame(S.raf);S.raf=0}S.angle=Math.round(S.angle/step)*step;S.vel=0;S.mode="idle";S.deal=false;paint();
    S.lock=S.lock?null:id;LS.set("spinlock",S.lock);buildRing();clearLanding();S.card=null;trayRest()}

  /* tray */
  const tray=$("tray");
  function trayRest(){
    const t=spinCount(false);
    tray.innerHTML=`<div class="rest">
      <h2 class="rest-title">${S.spun?"Spin again.":"Spin."}</h2>
      <p class="rest-text">${S.lock?`Only ${esc(spinLabel(DECK[S.lock]))} for now. Tap the ring to bring the other decks back.`:S.spun?"Tap a deck on the ring to stick with it.":"It stops on a deck and hands you one card. Tap a deck on the ring to stick with it."}</p>
      <div class="spinfoot"><span>${t} spin${t===1?"":"s"} today</span><button class="linkbtn" id="spinSound" type="button">Sound: ${S.sound?"on":"off"}</button></div>
    </div>`;
    $("spinSound").onclick=()=>{S.sound=!S.sound;LS.set("spinsound",S.sound);trayRest()};
  }
  function trayCard(){
    const c=S.card,st=S.st,d=DECK[c.deck].meta,lang=c.lang||d.lang;
    const chip=`<div class="nugget-top"><span class="chip" style="--chip:${d.color}">${esc(spinLabel(DECK[c.deck]))}${c.cat?" · "+esc(c.cat):""}</span>${lang&&(c.speak||c.front)?`<button class="speak" id="spinSpeak" type="button">🔊</button>`:""}</div>`;
    let inner="";
    if(c.type==="flip"){
      inner=`${c.ask?`<p class="rest-text">${esc(c.ask)}</p>`:""}<h2 class="nugget-title ${String(c.front).length>28?"long":""}">${esc(c.front)}</h2>`+
        (st.flipped?`<p class="nugget-meaning">${esc(c.back)}</p>${c.rule?`<p class="nugget-extra"><b>Rule:</b> ${esc(c.rule)}</p>`:""}${c.field?`<p class="nugget-extra"><b>Field:</b> ${esc(c.field)}</p>`:""}${c.note?`<p class="nugget-extra">${esc(c.note)}</p>`:""}
          <div class="nugget-actions"><button class="act" id="spinMiss" type="button">Missed it</button><button class="act primary" id="spinGot" type="button">Got it</button></div>`
        :`<div class="nugget-actions one"><button class="act primary" id="spinFlip" type="button">Show answer</button></div>`);
    }else{
      const done=st.answered!==null;
      inner=`${c.setup?`<p class="nugget-extra">${esc(c.setup)}</p>`:""}<h2 class="nugget-q">${esc(c.q)}</h2>`+
        st.order.map(i=>{let cls="opt";if(done){if(i===c.answer)cls+=" correct";else if(i===st.answered)cls+=" wrong"}
          return `<button class="${cls}" ${done?"disabled":""} data-i="${i}" type="button">${esc(c.choices[i])}</button>`}).join("")+
        (done?`<p class="nugget-extra"><b>${st.answered===c.answer?"Correct.":"Not quite."}</b> ${esc(c.explain||"")}</p><div class="nugget-actions one"><button class="act primary" id="spinNext" type="button">Spin again</button></div>`:"");
    }
    tray.innerHTML=`<div class="nugget">${chip}${inner}<p class="nugget-src">${esc(c.source||"")}</p></div>`;
    tray.scrollTop=0;
    const sp=$("spinSpeak");if(sp)sp.onclick=()=>speak(c.speak||c.front,lang);
    const fl=$("spinFlip");if(fl)fl.onclick=()=>{st.flipped=true;trayCard()};
    const gm=(ok)=>{gradeItem(c.id,ok);S.card=null;clearLanding();trayRest()};
    const mi=$("spinMiss");if(mi)mi.onclick=()=>gm(false);
    const go_=$("spinGot");if(go_)go_.onclick=()=>gm(true);
    tray.querySelectorAll(".opt[data-i]").forEach(b=>b.onclick=()=>{st.answered=+b.dataset.i;gradeItem(c.id,st.answered===c.answer);trayCard()});
    const nx=$("spinNext");if(nx)nx.onclick=()=>{audio();spinDefault()};
  }

  buildRing();paint();
  if(prev&&prev.card&&prev.card.deck&&decks.some(d=>d.meta.id===prev.card.deck)){S.card=prev.card;S.st=prev.st;S.spun=true;trayCard()}else trayRest();
}

/* ---------------- BACKUP, RESTORE, RESET ---------------- */
/* iOS gives each home-screen app its own storage, so progress can't always be read across installs.
   Export/import moves it by hand. Accepts pk_* (v2) or pe_* (v1) keys. */
function progressKeys(){const out={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^(pk|pe)_/.test(k))out[k]=localStorage.getItem(k)}return out}
function renderSettings(){
  const m=LS.get("migrated",null);
  app.innerHTML=topbar("BACKUP & RESET",{name:"home"})+`
  <div class="panel">
    <div class="head"><h3>Export progress</h3></div>
    <p class="smallprint">Copy this text somewhere safe (Notes, email to yourself). Paste it into Import on another device or install.</p>
    <textarea class="io" id="exp" readonly>${esc(JSON.stringify(progressKeys()))}</textarea>
    <button class="btn small" onclick="copyExport()">Copy</button>
  </div>
  <div class="panel">
    <div class="head"><h3>Import progress</h3></div>
    <p class="smallprint">Paste an export from Keepers (Patrol Kit) or Patrol Español v1. Card history and lesson progress are merged.</p>
    <textarea class="io" id="imp" placeholder='{"pk_srs":"…"}'></textarea>
    <button class="btn small" onclick="importProgress()">Import</button>
  </div>
  <div class="panel">
    <div class="head"><h3>Reset</h3></div>
    <p class="smallprint">${m?`v1 progress imported on ${esc(m.on)} (${m.cards} cards). `:""}Reset erases Keepers card history and lesson progress on this device. Old Patrol Español data is not touched and will not be re-imported.</p>
    <button class="btn ghost small" onclick="resetAll()">Reset all progress</button>
  </div>`;
}
function copyExport(){const t=document.getElementById("exp");t.select();
  (navigator.clipboard?navigator.clipboard.writeText(t.value):Promise.reject()).then(()=>toast("Copied"),()=>{document.execCommand("copy");toast("Copied")})}
function importProgress(){
  let data;try{data=JSON.parse(document.getElementById("imp").value)}catch(e){return toast("That isn't valid export text")}
  if(!data||typeof data!=="object")return toast("Nothing to import");
  const get=k=>{try{return typeof data[k]==="string"?JSON.parse(data[k]):data[k]}catch(e){return null}};
  let n=0;
  // v2 keys: merge SRS (keep the more-advanced record), union lessons
  const inSrs=get("pk_srs");
  if(inSrs){const cur=srs();for(const[id,r]of Object.entries(inSrs)){if(!BYID[id])continue;if(!cur[id]||(r.seen||0)>(cur[id].seen||0)){cur[id]=r;n++}}LS.set("srs",cur)}
  const inL=get("pk_lessons");if(inL)LS.set("lessons",{...inL,...LS.get("lessons",{})});
  // v1 keys: stage them as pe_* and run the migration again
  if(["pe_srs","pe_lessons"].some(k=>data[k])){
    ["pe_srs","pe_lessons","pe_vopt"].forEach(k=>{if(data[k])localStorage.setItem(k,typeof data[k]==="string"?data[k]:JSON.stringify(data[k]))});
    n+=migrateV1(true);
  }
  toast(`Imported — ${n} card record${n===1?"":"s"} updated`);go({name:"home"});
}
function resetAll(){
  if(!confirm("Erase card history and lesson progress?"))return;
  ["srs","lessons","vopt","active","field","lastFirst","session","spins","spinlock","spinsound"].forEach(k=>localStorage.removeItem("pk_"+k));
  VOPT={tenses:["pres","pret","cmd"]};
  go({name:"home"});toast("Progress reset");
}

/* ---------------- BOOT ---------------- */
migrateV1(false);
VOPT=LS.get("vopt",{tenses:["pres","pret","cmd"]});
render();
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
