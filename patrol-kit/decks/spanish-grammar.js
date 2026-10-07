// SPANISH GRAMMAR — sub-mode (lessons + quizzes). Migrated verbatim from Patrol Español v1.
// Condensed from the 28 lessons of Friar & Kelly (INS, 1943). Quiz "a" = index of the correct option.
export default [
{ id:"g1", title:"Pronunciation Essentials", tag:"Lesson I of the manual",
  body:`
<h4>Vowels are pure</h4>
<p>Five vowels, one sound each, always: <b>a</b> (father), <b>e</b> (they, clipped), <b>i</b> (machine), <b>o</b> (note, clipped), <b>u</b> (rule). No English-style gliding.</p>
<h4>The consonants that trip people up</h4>
<p><b>J</b> sounds like a hard English H (Juárez = HWAH-res). <b>H</b> is always silent (hombre = OM-bre). <b>Ñ</b> = "ny" (año = AH-nyo). <b>LL</b> and <b>Y</b> sound like English Y (calle = KAH-yeh). <b>RR</b> is trilled; a single R between vowels is a quick tap. <b>B</b> and <b>V</b> are pronounced identically. <b>Z</b> and soft <b>C</b> (before e/i) = S in Latin American Spanish.</p>
<div class="ex"><span class="s">mucho, muchacho, chico</span><br><span class="e">CH is like English "church" — the manual's first examples.</span></div>
<h4>Stress rules</h4>
<p>Words ending in a vowel, N, or S stress the next-to-last syllable (ha-BLA-mos). Words ending in other consonants stress the last (ha-BLAR). A written accent overrides everything (está, rápido).</p>`,
  quiz:[
    {q:"How is the J in 'trabajo' pronounced?", opts:["Like English J in 'jump'","Like a hard English H","Silent","Like Y in 'yes'"], a:1, why:"J = strong H sound: tra-BAH-ho."},
    {q:"The H in 'herido' is...", opts:["Pronounced like English H","Pronounced like J","Always silent","Only pronounced at the start of sentences"], a:2, why:"Spanish H is always silent: eh-REE-do."},
    {q:"'Calle' (street) sounds closest to...", opts:["KAL-leh","KAH-yeh","KAH-cheh","SAH-yeh"], a:1, why:"LL sounds like English Y in Mexican Spanish."},
    {q:"Where is the stress in 'hablan'? (ends in N)", opts:["ha-BLAN","HA-blan","Equal stress","Depends on region"], a:1, why:"Ends in N → stress the next-to-last syllable: HA-blan."},
    {q:"B and V in Spanish are...", opts:["Always distinct sounds","Pronounced the same","Both silent","Swapped compared to English"], a:1, why:"The manual is blunt about it: 'B and V are pronounced exactly alike.'"},
  ]},
{ id:"g2", title:"Gender, Articles & Plurals", tag:"Lesson II & IV",
  body:`
<h4>Every noun has a gender</h4>
<p>Nouns in <b>-o</b> are usually masculine (el río), nouns in <b>-a</b> usually feminine (la frontera). Memorize the exceptions you'll actually use: <b>la mano</b> (hand), <b>el día</b> (day), <b>el mapa</b>, <b>el problema</b>.</p>
<h4>Articles</h4>
<table><tr><th></th><th>the</th><th>a / an</th></tr>
<tr><td>masc.</td><td>el / los</td><td>un / unos</td></tr>
<tr><td>fem.</td><td>la / las</td><td>una / unas</td></tr></table>
<p>Feminine nouns beginning with a stressed A take <b>el</b> in the singular: <b>el agua</b>, <b>el arma</b> — but they stay feminine: las armas.</p>
<h4>Plurals</h4>
<p>Vowel ending → add <b>-s</b> (documento → documentos). Consonant ending → add <b>-es</b> (papel → papeles). Z → CES (cicatriz → cicatrices — "scar," a word the 1943 manual taught for descriptions).</p>
<h4>The only two contractions in Spanish</h4>
<div class="ex"><span class="s">a + el = al &nbsp;&nbsp;•&nbsp;&nbsp; de + el = del</span><br><span class="e">Vamos al puente. Viene del sur.</span></div>`,
  quiz:[
    {q:"Which is correct?", opts:["la problema","el problema","los problema","una problema"], a:1, why:"Problema is masculine despite ending in -a."},
    {q:"'The weapon' is...", opts:["la arma","el arma","lo arma","las arma"], a:1, why:"Arma is feminine but takes EL because it starts with stressed A. Plural: las armas."},
    {q:"Plural of 'el papel' (paper):", opts:["los papels","los papeles","las papeles","los papelos"], a:1, why:"Consonant ending → add -es."},
    {q:"'We're going to the river' =", opts:["Vamos a el río","Vamos al río","Vamos del río","Vamos el río"], a:1, why:"a + el always contracts to al."},
    {q:"'The hand' is...", opts:["el mano","la mano","lo mano","un mano"], a:1, why:"Mano is feminine despite the -o. La mano, las manos."},
  ]},
{ id:"g3", title:"Subject Pronouns & Present Tense", tag:"Lesson II & III",
  body:`
<h4>The pronouns you'll use</h4>
<table><tr><th>Spanish</th><th>English</th></tr>
<tr><td>yo</td><td>I</td></tr>
<tr><td>tú</td><td>you (informal — kids, friends)</td></tr>
<tr><td><b>usted</b></td><td><b>you (formal — your default on duty)</b></td></tr>
<tr><td>él / ella</td><td>he / she</td></tr>
<tr><td>nosotros</td><td>we</td></tr>
<tr><td>ustedes</td><td>you all</td></tr>
<tr><td>ellos / ellas</td><td>they</td></tr></table>
<p>Usted takes the same verb form as él/ella. Subject pronouns are usually dropped — the ending tells you who: <b>Hablo</b> = I speak.</p>
<h4>Regular present tense</h4>
<table><tr><th></th><th>hablAR</th><th>comER</th><th>vivIR</th></tr>
<tr><td>yo</td><td>hablo</td><td>como</td><td>vivo</td></tr>
<tr><td>tú</td><td>hablas</td><td>comes</td><td>vives</td></tr>
<tr><td>usted/él</td><td>habla</td><td>come</td><td>vive</td></tr>
<tr><td>nosotros</td><td>hablamos</td><td>comemos</td><td>vivimos</td></tr>
<tr><td>ustedes/ellos</td><td>hablan</td><td>comen</td><td>viven</td></tr></table>
<div class="ex"><span class="s">¿Dónde vive usted? — Vivo en Montreal.</span><br><span class="e">Where do you live? — I live in Montreal.</span></div>`,
  quiz:[
    {q:"On duty, questioning an adult, you should use...", opts:["tú","usted","vos","ellos"], a:1, why:"Usted is the formal, professional 'you' — the manual drills it exclusively."},
    {q:"'You (usted) work' =", opts:["trabajo","trabajas","trabaja","trabajan"], a:2, why:"Usted takes the él/ella form: trabaja."},
    {q:"'We live' =", opts:["vivemos","vivimos","viven","vivamos"], a:1, why:"-IR verbs: nosotros ending is -imos."},
    {q:"'Hablan' by itself means...", opts:["I speak","You (formal) speak","They speak / You all speak","We speak"], a:2, why:"-an ending = ustedes/ellos. Pronoun optional."},
    {q:"'¿Comen los niños?' means...", opts:["Do the children eat?","Did the children eat?","Will the children eat?","The children must eat"], a:0, why:"Present tense; Spanish questions just invert or add ¿? marks."},
  ]},
{ id:"g4", title:"Ser vs. Estar", tag:"Lesson VI — the big one",
  body:`
<h4>Two verbs for 'to be'</h4>
<table><tr><th></th><th>SER</th><th>ESTAR</th></tr>
<tr><td>yo</td><td>soy</td><td>estoy</td></tr>
<tr><td>tú</td><td>eres</td><td>estás</td></tr>
<tr><td>usted/él</td><td>es</td><td>está</td></tr>
<tr><td>nosotros</td><td>somos</td><td>estamos</td></tr>
<tr><td>ustedes/ellos</td><td>son</td><td>están</td></tr></table>
<h4>SER — what something IS</h4>
<p>Identity, origin, nationality, occupation, time, permanent traits.</p>
<div class="ex"><span class="s">Soy agente. ¿De dónde es usted? Es mexicano. Son las tres.</span></div>
<h4>ESTAR — where or how something is</h4>
<p>Location, temporary conditions, results of change.</p>
<div class="ex"><span class="s">¿Dónde está su familia? Está herido. Estamos cerca del río. Usted está detenido.</span></div>
<p>Memory hook: for <b>how you feel</b> and <b>where you are</b>, always use estar.</p>`,
  quiz:[
    {q:"'Where is the bridge?' =", opts:["¿Dónde es el puente?","¿Dónde está el puente?","¿Dónde son el puente?","¿Adónde es el puente?"], a:1, why:"Location = ESTAR, even for permanent things like bridges."},
    {q:"'He is a Canadian citizen' =", opts:["Está ciudadano canadiense","Es ciudadano canadiense","Están canadiense","Ser canadiense"], a:1, why:"Nationality and identity = SER."},
    {q:"'Are you hurt?' =", opts:["¿Es usted herido?","¿Está usted herido?","¿Son ustedes herido?","¿Eres herido?"], a:1, why:"Condition/state = ESTAR."},
    {q:"'It's 3 o'clock' =", opts:["Están las tres","Es las tres","Son las tres","Hay las tres"], a:2, why:"Time uses SER; plural 'son' for hours after one."},
    {q:"'You are detained' =", opts:["Usted es detenido","Usted está detenido","Usted son detenido","Usted hay detenido"], a:1, why:"Result of an action = ESTAR + past participle."},
  ]},
{ id:"g5", title:"Tener & Its Idioms", tag:"Lesson V + Idioms section",
  body:`
<h4>Tener — to have</h4>
<table><tr><th>yo</th><th>tú</th><th>usted/él</th><th>nosotros</th><th>ustedes/ellos</th></tr>
<tr><td>tengo</td><td>tienes</td><td>tiene</td><td>tenemos</td><td>tienen</td></tr></table>
<h4>Spanish 'has' what English 'is'</h4>
<p>The manual's idiom list is gold — these use tener, not ser/estar:</p>
<table><tr><th>Idiom</th><th>Meaning</th></tr>
<tr><td>tener ... años</td><td>to be ... years old</td></tr>
<tr><td>tener frío / calor</td><td>to be cold / hot</td></tr>
<tr><td>tener hambre / sed</td><td>to be hungry / thirsty</td></tr>
<tr><td>tener miedo</td><td>to be afraid</td></tr>
<tr><td>tener sueño</td><td>to be sleepy</td></tr>
<tr><td>tener prisa</td><td>to be in a hurry</td></tr>
<tr><td>tener razón</td><td>to be right</td></tr>
<tr><td>tener la culpa</td><td>to be to blame</td></tr>
<tr><td>tener cuidado</td><td>to be careful</td></tr></table>
<h4>Obligation</h4>
<div class="ex"><span class="s">tener que + infinitive</span> — <span class="e">Tengo que revisar su mochila. (I have to search your backpack.)</span></div>
<div class="ex"><span class="s">hay que + infinitive</span> — <span class="e">Hay que esperar. (One must wait — impersonal.)</span></div>`,
  quiz:[
    {q:"'How old are you?' =", opts:["¿Cuántos años es usted?","¿Cuántos años tiene usted?","¿Qué años está usted?","¿Cómo años tiene?"], a:1, why:"Age = tener años. Literally 'how many years do you have?'"},
    {q:"'I am cold' =", opts:["Soy frío","Estoy frío","Tengo frío","Hago frío"], a:2, why:"Personal cold = tener frío. (Hace frío = the weather is cold.)"},
    {q:"'They are afraid' =", opts:["Son miedo","Están miedo","Tienen miedo","Hay miedo"], a:2, why:"Tener miedo = to be afraid."},
    {q:"'You have to sign' =", opts:["Tiene que firmar","Tiene firmar","Hay firmar","Es que firmar"], a:0, why:"Tener que + infinitive = obligation."},
    {q:"'Hay que decir la verdad' means...", opts:["He has to tell the truth","There is truth","One must tell the truth","Say the truth loudly"], a:2, why:"Hay que = impersonal necessity: one must / it's necessary to."},
  ]},
{ id:"g6", title:"Polite Commands — Your Workhorse", tag:"Lessons VII & XVIII",
  body:`
<h4>How to build an usted command</h4>
<p>1. Take the <b>yo</b> form of the present. 2. Drop the -o. 3. Flip the vowel: -AR verbs → <b>-e</b>, -ER/-IR verbs → <b>-a</b>.</p>
<table><tr><th>Verb</th><th>yo form</th><th>Command</th></tr>
<tr><td>hablar</td><td>hablo</td><td>hable (speak)</td></tr>
<tr><td>correr</td><td>corro</td><td>corra (run)</td></tr>
<tr><td>subir</td><td>subo</td><td>suba (get in)</td></tr>
<tr><td>poner</td><td>pongo</td><td>ponga (put)</td></tr>
<tr><td>venir</td><td>vengo</td><td>venga (come)</td></tr>
<tr><td>decir</td><td>digo</td><td>diga (say)</td></tr></table>
<p>True irregulars: <b>vaya</b> (go), <b>sea</b> (be), <b>esté</b> (be), <b>dé</b> (give), <b>sepa</b> (know).</p>
<h4>Pronoun placement — the detail that marks fluency</h4>
<p>Affirmative: pronoun attaches to the end. Negative: pronoun goes before.</p>
<div class="ex"><span class="s">Siéntese.</span> <span class="e">Sit down.</span> &nbsp;•&nbsp; <span class="s">No se mueva.</span> <span class="e">Don't move.</span></div>
<div class="ex"><span class="s">Dígame la verdad.</span> <span class="e">Tell me the truth.</span> &nbsp;•&nbsp; <span class="s">No me mienta.</span> <span class="e">Don't lie to me.</span></div>`,
  quiz:[
    {q:"Command of 'esperar' (to wait):", opts:["espera","espere","esperar","espero"], a:1, why:"-AR verb → -e ending: Espere aquí."},
    {q:"'Come here' (formal) =", opts:["Viene acá","Ven acá","Venga acá","Vengo acá"], a:2, why:"Venir → yo vengo → venga."},
    {q:"'Don't move' =", opts:["No muévase","No se mueva","No mueva se","Muévase no"], a:1, why:"Negative command: pronoun BEFORE the verb."},
    {q:"'Sit down' =", opts:["Se siente","Siéntese","Sientese usted no","Sentar"], a:1, why:"Affirmative: pronoun attaches to the end (with a written accent)."},
    {q:"Command of 'ir' (to go):", opts:["vaya","va","iga","vea"], a:0, why:"Ir is truly irregular: vaya. (Vea is from ver.)"},
  ]},
{ id:"g7", title:"Question Words", tag:"Lesson VII",
  body:`
<h4>The interrogatives</h4>
<table><tr><th>Word</th><th>Meaning</th></tr>
<tr><td>¿Qué?</td><td>What?</td></tr>
<tr><td>¿Cuál? / ¿Cuáles?</td><td>Which? / What? (before ser)</td></tr>
<tr><td>¿Quién? / ¿Quiénes?</td><td>Who?</td></tr>
<tr><td>¿Dónde?</td><td>Where?</td></tr>
<tr><td>¿Adónde?</td><td>Where to?</td></tr>
<tr><td>¿De dónde?</td><td>Where from?</td></tr>
<tr><td>¿Cuándo?</td><td>When?</td></tr>
<tr><td>¿Cuánto/a/os/as?</td><td>How much / how many?</td></tr>
<tr><td>¿Cómo?</td><td>How?</td></tr>
<tr><td>¿Por qué?</td><td>Why?</td></tr></table>
<p>All carry a written accent. Prepositions come FIRST: ¿<b>Con</b> quién viaja? ¿<b>De</b> qué país es?</p>
<h4>Qué vs. Cuál before 'es'</h4>
<p>¿<b>Qué</b> es? asks for a definition. ¿<b>Cuál</b> es su nombre? asks which one out of the possibilities — that's why name, nationality, and address questions use cuál.</p>`,
  quiz:[
    {q:"'What is your name?' =", opts:["¿Qué es su nombre?","¿Cuál es su nombre?","¿Quién es su nombre?","¿Cómo es su nombre?"], a:1, why:"Selecting from possibilities before 'es' → cuál."},
    {q:"'Where are you going?' =", opts:["¿Dónde va?","¿Adónde va?","¿De dónde va?","¿Cuándo va?"], a:1, why:"Motion toward → adónde."},
    {q:"'Who are you traveling with?' =", opts:["¿Quién viaja con?","¿Con quién viaja?","¿Quién con viaja?","¿Cuál viaja?"], a:1, why:"The preposition must lead: con quién."},
    {q:"'How many children?' =", opts:["¿Cuánto niños?","¿Cuántos niños?","¿Cuántas niños?","¿Qué niños?"], a:1, why:"Cuántos agrees: masculine plural."},
    {q:"'¿Por qué corrió?' means...", opts:["Where did he run?","Why did he run?","How did he run?","When did he run?"], a:1, why:"Por qué = why. (Porque, one word, = because.)"},
  ]},
{ id:"g8", title:"Object Pronouns", tag:"Lesson XV",
  body:`
<h4>Direct object (whom/what)</h4>
<table><tr><th>me</th><th>te</th><th>lo / la</th><th>nos</th><th>los / las</th></tr>
<tr><td>me</td><td>you (inf.)</td><td>him, it, you-formal / her, it, you-formal-fem</td><td>us</td><td>them, you all</td></tr></table>
<h4>Indirect object (to/for whom)</h4>
<p><b>le</b> = to him/her/you &nbsp;•&nbsp; <b>les</b> = to them/you all</p>
<h4>Placement</h4>
<p>Before a conjugated verb; attached to infinitives and affirmative commands.</p>
<div class="ex"><span class="s">Lo veo.</span> <span class="e">I see him/it.</span> &nbsp;•&nbsp; <span class="s">Voy a esposarlo.</span> <span class="e">I'm going to cuff him.</span></div>
<div class="ex"><span class="s">¿Quién lo ayudó?</span> <span class="e">Who helped you?</span> &nbsp;•&nbsp; <span class="s">Déme su pasaporte.</span> <span class="e">Give me your passport.</span></div>
<p>Field tip: when addressing a man formally, "you" as a direct object is <b>lo</b>; a woman, <b>la</b>. 'Le' for indirect: Le voy a hacer unas preguntas — I'm going to ask you some questions.</p>`,
  quiz:[
    {q:"'I see them (the men)' =", opts:["Veo los","Los veo","Les veo los","Veo ellos"], a:1, why:"Direct object pronoun goes before the conjugated verb: Los veo."},
    {q:"'Give me your license' =", opts:["Dé me su licencia","Déme su licencia","Me dé su licencia","Su licencia déme"], a:1, why:"Pronoun attaches to affirmative commands: Déme."},
    {q:"'I'm going to search it (the bag, la bolsa)' =", opts:["Voy a revisarlo","Voy a revisarla","La voy a revisarla","Voy a lo revisar"], a:1, why:"Bolsa is feminine → la, attached to the infinitive."},
    {q:"'Who helped you (a man)?' =", opts:["¿Quién le ayudó a cruzar?","¿Quién lo ayudó?","¿Quién los ayudó a él?","Both A and B are heard"], a:3, why:"Lo is the textbook direct object; le is widespread too (leísmo). You'll hear both — use lo."},
    {q:"'I'm going to ask you some questions' =", opts:["Voy a hacerle unas preguntas","Voy a hacer usted preguntas","Le voy a hacerle preguntas","Hago le preguntas"], a:0, why:"Indirect le attaches to the infinitive: hacerle."},
  ]},
{ id:"g9", title:"Preterite — The Interview Tense", tag:"Lesson XI",
  body:`
<h4>Completed past actions</h4>
<p>When did you cross? Who brought you? How much did you pay? — every one of these is preterite. It's the single most useful past tense for field questioning.</p>
<table><tr><th></th><th>cruzAR</th><th>comER/vivIR</th></tr>
<tr><td>yo</td><td>crucé</td><td>comí</td></tr>
<tr><td>tú</td><td>cruzaste</td><td>comiste</td></tr>
<tr><td>usted/él</td><td><b>cruzó</b></td><td><b>comió</b></td></tr>
<tr><td>nosotros</td><td>cruzamos</td><td>comimos</td></tr>
<tr><td>ustedes/ellos</td><td>cruzaron</td><td>comieron</td></tr></table>
<h4>The irregular stems worth memorizing</h4>
<table><tr><th>Verb</th><th>usted form</th></tr>
<tr><td>tener</td><td>tuvo</td></tr>
<tr><td>estar</td><td>estuvo</td></tr>
<tr><td>hacer</td><td>hizo</td></tr>
<tr><td>decir</td><td>dijo</td></tr>
<tr><td>venir</td><td>vino</td></tr>
<tr><td>ir / ser</td><td>fue (identical!)</td></tr>
<tr><td>dar</td><td>dio</td></tr></table>
<div class="ex"><span class="s">¿Cuándo cruzó? ¿Quién vino con usted? ¿Qué dijo el guía?</span><br><span class="e">When did you cross? Who came with you? What did the guide say?</span></div>`,
  quiz:[
    {q:"'When did you cross?' =", opts:["¿Cuándo cruza?","¿Cuándo cruzó?","¿Cuándo cruzaba?","¿Cuándo cruzar?"], a:1, why:"Completed past event → preterite usted form: cruzó."},
    {q:"'He came alone' =", opts:["Vino solo","Venía solo","Viene solo","Vengo solo"], a:0, why:"Venir → vino in the preterite."},
    {q:"'They paid $5,000' =", opts:["Pagan cinco mil","Pagaron cinco mil dólares","Pagaban cinco mil","Pagar cinco mil"], a:1, why:"-aron = ustedes/ellos preterite of -AR verbs."},
    {q:"'Fue' can mean...", opts:["Only 'he went'","Only 'he was'","Either 'he went' or 'he was'","He will go"], a:2, why:"Ir and ser share identical preterite forms — context decides."},
    {q:"'What did he say?' =", opts:["¿Qué dice?","¿Qué dijo?","¿Qué decía?","¿Qué diga?"], a:1, why:"Decir → dijo. One of the must-know irregulars."},
  ]},
{ id:"g10", title:"Imperfect — Setting the Scene", tag:"Lesson XI & XIII",
  body:`
<h4>The other past tense</h4>
<p>The imperfect describes ongoing, habitual, or background past — what <i>was happening</i>, what things <i>used to be</i>.</p>
<table><tr><th></th><th>-AR (caminar)</th><th>-ER/-IR (vivir)</th></tr>
<tr><td>yo</td><td>caminaba</td><td>vivía</td></tr>
<tr><td>usted/él</td><td>caminaba</td><td>vivía</td></tr>
<tr><td>nosotros</td><td>caminábamos</td><td>vivíamos</td></tr>
<tr><td>ustedes/ellos</td><td>caminaban</td><td>vivían</td></tr></table>
<p>Only three irregulars in the whole language: <b>ser → era</b>, <b>ir → iba</b>, <b>ver → veía</b>.</p>
<h4>Preterite vs. imperfect in an interview</h4>
<div class="ex"><span class="s">Caminábamos por el bosque cuando vimos la luz.</span><br><span class="e">We were walking through the woods (background–imperfect) when we saw the light (event–preterite).</span></div>
<div class="ex"><span class="s">¿Dónde vivía usted en Canadá?</span><br><span class="e">Where were you living in Canada? (ongoing state)</span></div>`,
  quiz:[
    {q:"'We were walking' (background action) =", opts:["Caminamos","Caminábamos","Caminaron","Caminemos"], a:1, why:"Ongoing past action → imperfect."},
    {q:"'Where were you living?' =", opts:["¿Dónde vivió?","¿Dónde vivía?","¿Dónde vive?","¿Dónde vivirá?"], a:1, why:"Ongoing residence → imperfect vivía."},
    {q:"The imperfect of 'ir' is...", opts:["fue","iba","vaya","irá"], a:1, why:"One of only three irregular imperfects: iba."},
    {q:"'Había tres personas' means...", opts:["There will be three people","There were three people (scene)","Three people arrived","There are three people"], a:1, why:"Había = imperfect of hay: there was/were, describing a scene."},
    {q:"Pick the correct combo: 'They were sleeping when we arrived' =", opts:["Durmieron cuando llegábamos","Dormían cuando llegamos","Duermen cuando llegaron","Dormían cuando llegábamos"], a:1, why:"Background = imperfect (dormían); interrupting event = preterite (llegamos)."},
  ]},
{ id:"g11", title:"Talking About the Future", tag:"Lesson XXI",
  body:`
<h4>The easy way: ir a + infinitive</h4>
<p>Conjugate ir (voy, va, vamos, van) + a + any infinitive. This covers 90% of field needs.</p>
<div class="ex"><span class="s">Voy a revisar su mochila. Vamos a la estación. ¿Quién lo va a recoger?</span></div>
<h4>The true future tense</h4>
<p>Add endings straight onto the infinitive: <b>-é, -ás, -á, -emos, -án</b>. Hablaré = I will speak. Irregular stems: tendr- (tener), har- (hacer), dir- (decir), podr- (poder), sabr- (saber), vendr- (venir), saldr- (salir), pondr- (poner).</p>
<div class="ex"><span class="s">Un agente hablará con usted pronto.</span><br><span class="e">An agent will speak with you soon.</span></div>
<p>Bonus use — the future of probability: <b>¿Dónde estarán los demás?</b> = I wonder where the others are.</p>`,
  quiz:[
    {q:"'I am going to help you' =", opts:["Voy ayudar","Voy a ayudarle","Iré a ayudo","Vaya ayudar"], a:1, why:"ir a + infinitive; the 'a' is required."},
    {q:"'You will have an appointment' =", opts:["Tener una cita","Tendrá una cita","Tenerá una cita","Tiene que cita"], a:1, why:"Future of tener uses the irregular stem tendr-: tendrá."},
    {q:"'We will return tomorrow' =", opts:["Regresamos ayer","Regresaremos mañana","Regresábamos mañana","Regresen mañana"], a:1, why:"Future -emos on the infinitive: regresaremos."},
    {q:"'¿Serán las cinco?' most likely expresses...", opts:["A command","Probability: 'I wonder if it's five'","Past time","A negative"], a:1, why:"Future tense can express present probability or wondering."},
    {q:"'He will say' =", opts:["decirá","dirá","dijá","dice"], a:1, why:"Decir → dir- + á."},
  ]},
{ id:"g12", title:"Reflexive Verbs", tag:"Lesson XXIII",
  body:`
<h4>Actions done to oneself</h4>
<p>Reflexive pronouns: <b>me, te, se, nos, se</b>. The infinitive carries -se: llamarse, sentarse, pararse, quedarse, ponerse.</p>
<table><tr><th>Verb</th><th>Field use</th></tr>
<tr><td>llamarse</td><td>¿Cómo se llama? — What's your name?</td></tr>
<tr><td>pararse</td><td>¡Párese! — Stop/stand!</td></tr>
<tr><td>sentarse</td><td>Siéntese. — Sit down.</td></tr>
<tr><td>quedarse</td><td>Quédese aquí. — Stay here.</td></tr>
<tr><td>calmarse</td><td>Cálmese. — Calm down.</td></tr>
<tr><td>quitarse</td><td>Quítese la mochila. — Take off the backpack.</td></tr>
<tr><td>esconderse</td><td>¿Dónde se escondieron? — Where did they hide?</td></tr></table>
<h4>The reflexive passive</h4>
<p>Spanish prefers <b>se</b> + verb where English uses the passive — straight from Lesson XXIII:</p>
<div class="ex"><span class="s">Se prohíbe estacionarse aquí.</span> <span class="e">Parking is prohibited here.</span></div>
<div class="ex"><span class="s">Aquí se habla español.</span> <span class="e">Spanish is spoken here.</span></div>`,
  quiz:[
    {q:"'What is your name?' literally asks...", opts:["What are you named by others?","How do you call yourself?","Which name is yours?","Who calls you?"], a:1, why:"¿Cómo se llama? = reflexive llamarse."},
    {q:"'Stay here' =", opts:["Queda aquí","Quédese aquí","Se quede aquí","Quedarse aquí"], a:1, why:"Affirmative command with attached pronoun: Quédese."},
    {q:"'Where did they hide?' =", opts:["¿Dónde escondieron?","¿Dónde se escondieron?","¿Dónde se esconden ayer?","¿Dónde escondían?"], a:1, why:"Esconderse is reflexive when hiding oneself."},
    {q:"'Se venden carros' means...", opts:["They sell themselves cars","Cars are sold / for sale","Sell the cars!","The cars sold out"], a:1, why:"Se + verb = passive substitute."},
    {q:"'Take off your jacket' =", opts:["Quite la chamarra","Quítese la chamarra","Se quite la chamarra","Quitarse chamarra"], a:1, why:"Quitarse = to take off (clothing); command form Quítese + article (not 'su')."},
  ]},
{ id:"g13", title:"Por vs. Para", tag:"Lesson XIV",
  body:`
<h4>PARA — destination & purpose</h4>
<p>Toward a goal: destination, purpose, deadline, recipient.</p>
<div class="ex"><span class="s">Salieron para Boston.</span> <span class="e">They left FOR Boston (destination).</span></div>
<div class="ex"><span class="s">Documentos para trabajar.</span> <span class="e">Documents (in order) to work.</span></div>
<h4>POR — through, along, exchange, cause</h4>
<div class="ex"><span class="s">Cruzaron por el río.</span> <span class="e">They crossed BY WAY OF the river.</span></div>
<div class="ex"><span class="s">Caminaron por el bosque por tres horas.</span> <span class="e">Through the woods, for three hours (route + duration).</span></div>
<div class="ex"><span class="s">Pagó dos mil por el viaje.</span> <span class="e">He paid two thousand FOR (in exchange for) the trip.</span></div>
<div class="ex"><span class="s">Por su seguridad.</span> <span class="e">For (the sake of) your safety.</span></div>
<p>Interview shortcut: route and payment questions take <b>por</b>; destination and purpose take <b>para</b>.</p>`,
  quiz:[
    {q:"'They crossed through the woods' =", opts:["Cruzaron para el bosque","Cruzaron por el bosque","Cruzaron en para bosque","Cruzaron al bosque por"], a:1, why:"Route/through = por."},
    {q:"'How much did you pay for the trip?' =", opts:["¿Cuánto pagó para el viaje?","¿Cuánto pagó por el viaje?","¿Cuánto para pagó?","¿Qué pagó a viaje?"], a:1, why:"Exchange = por."},
    {q:"'They're heading for Montreal' =", opts:["Van por Montreal","Van para Montreal","Van en Montreal","Van de Montreal"], a:1, why:"Destination = para."},
    {q:"'For your safety and mine' =", opts:["Para su seguridad","Por su seguridad y la mía","De su seguridad","En su seguridad"], a:1, why:"For the sake of = por."},
    {q:"'He walked for two hours' =", opts:["Caminó para dos horas","Caminó por dos horas","Caminó a dos horas","Caminó en dos horas para"], a:1, why:"Duration = por."},
  ]},
{ id:"g14", title:"Numbers, Time & Dates", tag:"Lessons XII & XX",
  body:`
<h4>Numbers you'll actually say</h4>
<p>1 uno · 2 dos · 3 tres · 4 cuatro · 5 cinco · 6 seis · 7 siete · 8 ocho · 9 nueve · 10 diez · 11 once · 12 doce · 13 trece · 14 catorce · 15 quince · 16 dieciséis · 20 veinte · 21 veintiuno · 30 treinta · 31 treinta y uno · 40 cuarenta · 50 cincuenta · 60 sesenta · 70 setenta · 80 ochenta · 90 noventa · 100 cien(to) · 500 quinientos · 1000 mil</p>
<p>Only 16–29 are written as one word; 31+ use <b>y</b>: cuarenta y cinco.</p>
<h4>Telling time</h4>
<div class="ex"><span class="s">¿Qué hora es? — Es la una. / Son las tres y media. / Son las diez menos cuarto.</span><br><span class="e">It's one. / It's 3:30. / It's 9:45.</span></div>
<h4>Dates & days</h4>
<p>Days: lunes, martes, miércoles, jueves, viernes, sábado, domingo (not capitalized). Months: enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre.</p>
<div class="ex"><span class="s">¿Cuál es su fecha de nacimiento? — El quince de marzo de mil novecientos noventa.</span><br><span class="e">March 15, 1990. Day first, then month.</span></div>`,
  quiz:[
    {q:"45 =", opts:["cuarenta cinco","cuarenta y cinco","cuatro y cinco","cuarenticinco"], a:1, why:"31 and up: tens + y + units."},
    {q:"'It's 3:30' =", opts:["Es las tres y media","Son las tres y media","Son tres treinta hora","Está las tres y media"], a:1, why:"Plural hours take son; y media = half past."},
    {q:"15 =", opts:["diez y cinco","quince","cincuenta","doce"], a:1, why:"Quince. (Cincuenta = 50.)"},
    {q:"In Spanish dates, which comes first?", opts:["Month","Day","Year","Weekday is required"], a:1, why:"Day first: el quince de marzo. A DOB given as 3/15 vs 15/3 matters on paperwork."},
    {q:"500 =", opts:["cinco cientos","quinientos","cincocientos","quincecientos"], a:1, why:"Irregular hundred: quinientos."},
  ]},
{ id:"g15", title:"Subjunctive Starter Kit", tag:"Lesson XXV — simplified",
  body:`
<h4>Don't fear it — you already know it</h4>
<p>The usted command IS the subjunctive. Hable, venga, diga, se siente — same forms. The subjunctive appears after expressions of wanting, requesting, and necessity aimed at another person.</p>
<h4>The three triggers to start with</h4>
<table><tr><th>Trigger</th><th>Example</th></tr>
<tr><td>querer que</td><td>Quiero que se siente. — I want you to sit down.</td></tr>
<tr><td>es necesario que</td><td>Es necesario que diga la verdad. — It's necessary that you tell the truth.</td></tr>
<tr><td>para que</td><td>Hable despacio para que yo entienda. — Speak slowly so that I understand.</td></tr></table>
<h4>Why English speakers miss it</h4>
<p>English says 'I want you TO SIT'; Spanish can't use the infinitive when the subject changes — it must switch to que + subjunctive.</p>
<div class="ex"><span class="s">Necesito que espere aquí.</span> <span class="e">I need you to wait here.</span></div>
<div class="ex"><span class="s">Dígale a su amigo que venga.</span> <span class="e">Tell your friend to come.</span></div>`,
  quiz:[
    {q:"'I want you to sit down' =", opts:["Quiero usted sentarse","Quiero que se siente","Quiero que se sienta usted bien","Quiero sentarse"], a:1, why:"Change of subject → que + subjunctive: que se siente."},
    {q:"'It's necessary that you sign' =", opts:["Es necesario que firma","Es necesario que firme","Es necesario firmar que","Necesario usted firma"], a:1, why:"Es necesario que + subjunctive: firme."},
    {q:"The usted command and the usted subjunctive are...", opts:["Totally different forms","The same form","Only the same for -AR verbs","Only the same for irregulars"], a:1, why:"Master commands and you've already got the present subjunctive."},
    {q:"'Tell him to come' =", opts:["Dígale que viene","Dígale que venga","Diga él venir","Dile que vino"], a:1, why:"Indirect command → que + subjunctive: venga."},
    {q:"'Speak slowly so that I understand' =", opts:["...para que yo entiendo","...para que yo entienda","...por que entiendo","...para entiendo"], a:1, why:"Para que always triggers the subjunctive: entienda."},
  ]},
];
