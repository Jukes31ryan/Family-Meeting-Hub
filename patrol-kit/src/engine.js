/* ============================================================
   PATROL KIT — unified study-card engine
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
    const card={...c,deck:d.meta.id,group:c.group||cat.group||"",why:c.why||cat.why||d.meta.why||"",source:c.source||cat.source||d.meta.source||"",flag:c.flag||cat.flag||""};
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
    grammar:renderGrammarList,lesson:renderLesson,verbs:renderVerbSetup,verbdrill:renderVerbDrill,settings:renderSettings,field:renderFieldList}[view.name]||renderHome;
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
  <div class="brand"><h1>PATROL <span>KIT</span></h1><div class="sub">Study Cards</div></div>
  ${startBlock(null,`Shuffle all · ${pool.length} cards`)}
  <div class="sectionlabel">Decks</div>
  <div class="decklist">
    ${decks.map(d=>{const id=d.meta.id;const on=act.includes(id);const all=deckCards(id);
      return `<div class="deckrow ${on?"":"off"}" style="${deckVar(id)}">
        <button class="open" onclick="go(${A({name:"deck",id})})"><span class="t">${esc(d.meta.name)}</span><br><span class="c">${all.length} cards</span></button>
        <button class="toggle" role="switch" aria-checked="${on}" aria-label="Include ${esc(d.meta.name)} in Shuffle All" onclick="toggleDeck(${A(id)})"><span class="sw"></span></button>
      </div>`}).join("")}
  </div>
  ${FIELD.length?`<div class="sectionlabel">Test yourself</div><div class="shuffle"><button class="btn ghost" onclick="go({name:'field'})">Field Problems<span class="sub">${Object.keys(LS.get("field",{})).length} / ${FIELD.length} run · one situation, questions from every deck</span></button></div>`:""}
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
  return{...step,id:S.ids[i],deck:step.deck||(fed[0]&&fed[0].deck),group:"",cat:"Field Problem",
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
  const title=S.kind==="field"?"FIELD PROBLEM":S.kind==="review"?"REVIEW MISSED":S.deckId?DECK[S.deckId].meta.name.toUpperCase():"SHUFFLE ALL";
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
      <span class="big ${c.deck==="spanish"?"es":""}">${esc(c.front)}</span>
      ${st.flipped?`<span class="trans">${esc(c.back)}</span>${c.rule?`<span class="rule"><b>Rule</b>${esc(c.rule)}</span>`:""}${c.field?`<span class="rule"><b>Field</b>${esc(c.field)}</span>`:""}${c.note?`<span class="note">${esc(c.note)}</span>`:""}${metaBack(c)}`:`<span class="hint">Tap to reveal</span>`}
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

/* ---------------- FIELD PROBLEMS ---------------- */
function renderFieldList(){
  const rec=LS.get("field",{});
  app.innerHTML=topbar("FIELD PROBLEMS",{name:"home"})+`<p class="smallprint">Chained scenarios. Each step is graded, and a miss sends the related cards back into review in their own decks.</p>`+
    FIELD.map(f=>{const r=rec[f.id];const decks=[...new Set(f.steps.map(st=>(st.ref?BYID[st.ref].deck:st.deck)))];
      return `<button class="lesson-item" onclick="startField(${A(f.id)})">
      <span class="t"><span class="name">${esc(f.title)}</span><br><span class="tag">${f.steps.length} steps · ${decks.map(d=>esc(DECK[d].meta.short||d)).join(" · ")}</span></span>
      ${r?`<span class="check">${r.best}/${f.steps.length}</span>`:""}</button>`}).join("");
}
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
    <button class="btn ghost" onclick="go({name:'field'})">All problems</button>
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
    <p class="smallprint">Paste an export from Patrol Kit or Patrol Español v1. Card history and lesson progress are merged.</p>
    <textarea class="io" id="imp" placeholder='{"pk_srs":"…"}'></textarea>
    <button class="btn small" onclick="importProgress()">Import</button>
  </div>
  <div class="panel">
    <div class="head"><h3>Reset</h3></div>
    <p class="smallprint">${m?`v1 progress imported on ${esc(m.on)} (${m.cards} cards). `:""}Reset erases Patrol Kit card history and lesson progress on this device. Old Patrol Español data is not touched and will not be re-imported.</p>
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
  ["srs","lessons","vopt","active","field","lastFirst","session"].forEach(k=>localStorage.removeItem("pk_"+k));
  VOPT={tenses:["pres","pret","cmd"]};
  go({name:"home"});toast("Progress reset");
}

/* ---------------- BOOT ---------------- */
migrateV1(false);
VOPT=LS.get("vopt",{tenses:["pres","pret","cmd"]});
render();
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
