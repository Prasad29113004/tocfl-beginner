const DATA = window.TOCFL;
const LESSONS = DATA.lessons;
const VOCAB = [];
const vocabSeen = new Set();
LESSONS.forEach((lesson, lessonIndex) => lesson.words.split(';').forEach((entry) => {
  const [h, p, m, c] = entry.split('|');
  if (!vocabSeen.has(h)) {
    vocabSeen.add(h);
    VOCAB.push({ id: VOCAB.length, h, p, m, c: c || 'Core', lesson: lessonIndex });
  }
}));
const QUESTIONS = DATA.questions;
const SECTIONS = ['Listening', 'Reading'];
const LABELS = { home:'OVERVIEW', lessons:'LEARNING PATH', words:'WORD CARDS', practice:'LISTEN & SPEAK', exam:'EXAM PRACTICE', progress:'MY PROGRESS' };
const defaultState = { version:2, done:[], known:[], days:[], bestFull:0, bestA1:0, bestA2:0, lastScore:null, view:'home' };
let state = defaultState;
try {
  const saved = JSON.parse(localStorage.getItem('islandStudyProgress') || 'null');
  if (saved && saved.version === 2) state = Object.assign({}, defaultState, saved);
  else if (saved && Array.isArray(saved.days)) state.days = saved.days;
} catch (_) {}
let flashIndex = 0;
let quiz = null;
let quizClock = null;
let recorder = null;
let recordedUrl = null;
let audioChunks = [];

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function save() {
  try { localStorage.setItem('islandStudyProgress', JSON.stringify(state)); } catch (_) {}
  const count = document.getElementById('lessonCount');
  if (count) count.textContent = state.done.length + '/24';
}
function logDay() {
  const day = new Date().toLocaleDateString('en-CA');
  if (!state.days.includes(day)) state.days.push(day);
  save();
}
function toast(message) {
  const node = document.getElementById('toast');
  node.textContent = message;
  node.classList.add('show');
  setTimeout(() => node.classList.remove('show'), 2300);
}
function speak(text) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(voice => /^zh-TW/i.test(voice.lang)) || voices.find(voice => /^zh/i.test(voice.lang)) || null;
  utterance.lang = utterance.voice ? utterance.voice.lang : 'zh-TW';
  utterance.rate = Number(document.getElementById('rate')?.value || .82);
  speechSynthesis.speak(utterance);
}
function go(view) {
  if (quizClock) clearInterval(quizClock);
  quizClock = null;
  quiz = null;
  state.view = view;
  draw();
}
function levelDone(level) {
  return state.done.filter(index => LESSONS[index]?.level === level).length;
}
function progressPercent() {
  return Math.round((state.done.length / LESSONS.length) * 100);
}
function pageHome() {
  const nextIndex = LESSONS.findIndex((_, index) => !state.done.includes(index));
  const next = LESSONS[nextIndex < 0 ? 0 : nextIndex];
  const remembered = state.known.length;
  return '<section class="hero"><div class="hero-copy"><div class="eyebrow">FROM YOUR FIRST WORD TO BAND A</div><h1>Start at zero.<br><em>Build a Taiwan-ready ear.</em></h1><p>A calm, step-by-step Traditional Chinese course. Learn the foundations first, then move through A1 and A2 with sentence audio, recall practice and original exam-style questions.</p><div class="actions"><button class="button primary" data-go="lessons">Start the A1 path →</button><button class="text-link" data-go="exam">Explore the exam plan ↗</button></div></div></section><div class="stats"><div class="stat"><i>▤</i><div><strong>'+state.done.length+' / 24</strong><small>lessons finished</small></div></div><div class="stat"><i>◫</i><div><strong>'+remembered+' / '+VOCAB.length+'</strong><small>core words marked known</small></div></div><div class="stat"><i>◷</i><div><strong>'+state.days.length}</strong><small>study days logged</small></div></div></div><div class="section-head"><div><h2>Your route through Band A</h2><p>12 A1 units, then 12 A2 units. Take the lessons in order.</p></div><button class="link-button" data-go="lessons">All 24 lessons →</button></div><div class="grid-path">'+LESSONS.slice(0,4).map((lesson,index) => '<button class="path" data-open="'+index+'"><span class="numb">0'+(index+1)+'</span><span><strong>'+esc(lesson.title)+'</strong><small>'+lesson.level+' · '+esc(lesson.goal)+'</small></span><span class="arrow">↗</span></button>').join('')+'</div><div class="daily"><div><strong>Next lesson: '+esc(next.title)+'</strong><div class="track"><i style="width:'+progressPercent()+'%"></i></div><p>'+esc(next.goal)+'</p></div><div class="tip"><small>HOW TO USE THIS COURSE</small><blockquote>Listen · read · recall · repeat</blockquote><small>Play every sentence aloud, then shadow it slowly.</small></div></div><section class="card readiness"><div class="kicker">A COMPLETE STUDY ROUTE NEEDS MORE THAN AN APP</div><h3>Use these three parts together</h3><div class="readiness-grid"><p><b>1. Learn the foundations</b><br>Complete the A1 units, then A2. Use the word cards and sentence shelf every day.</p><p><b>2. Practise exam timing</b><br>Try the full 25-listening + 25-reading simulation and review every missed answer.</p><p><b>3. Check official materials</b><br>Study the official vocabulary list and sample papers. They are linked on the Exam page.</p></div></section>';
}
function pageLessons() {
  let html = '<div class="page-head"><div><div class="kicker">24 UNITS · A1 FOUNDATION → A2</div><h1>Learn it in layers.</h1><p>Open a unit, study the pattern, play the example and mark it complete when you can use it without looking.</p></div><span class="pill">'+state.done.length+' / 24 complete</span></div><div class="level-summary"><div><span class="level-tag a1">A1</span><b>'+levelDone('A1')+' / 12</b><small>Basic familiar phrases and everyday needs</small></div><div><span class="level-tag a2">A2</span><b>'+levelDone('A2')+' / 12</b><small>Short conversations, messages and connected ideas</small></div></div>';
  ['A1','A2'].forEach(level => {
    html += '<div class="section-head level-heading"><div><h2>'+level+' '+(level==='A1'?'· Build the basics':'· Understand more')}</h2><p>'+(level==='A1'?'Start here if you are a complete beginner.':'Continue after A1: add past events, plans, comparisons and short texts.')+'</p></div><span class="pill">'+levelDone(level)+' / 12 complete</span></div><div class="unit-list">';
    LESSONS.forEach((lesson,index) => {
      if (lesson.level !== level) return;
      const complete = state.done.includes(index);
      const vocab = lesson.words.split(';').map(row => row.split('|')[0]);
      html += '<article class="unit '+(complete?'done':'')+'" id="unit-'+index+'"><button class="unit-head" data-toggle><span class="badge">'+(complete?'✓':String(index+1).padStart(2,'0'))+'</span><span class="unit-title"><strong>'+esc(lesson.title)+'</strong><small>'+esc(lesson.goal)+'</small></span><span class="duration">'+level+'</span><span>⌄</span></button><div class="body"><div class="lesson-pattern"><b>Pattern</b><p>'+esc(lesson.pattern)+'</p></div><div class="chips">'+vocab.map(word => '<span class="chipword"><b>'+esc(word)+'</b></span>').join('')+'</div><div class="sentbox"><div><div class="hanzi">'+esc(lesson.example)+'</div><div class="pinyin">'+esc(lesson.pinyin)+'</div><div class="translation">'+esc(lesson.meaning)+'</div></div><button class="play" data-say="'+esc(lesson.example)+'" aria-label="Play sentence audio">▶</button></div><div class="lesson-actions"><button class="smallbtn" data-say="'+esc(lesson.example)+'">♫ Listen</button><button class="smallbtn" data-done="'+index+'">'+(complete?'✓ Completed':'Mark lesson complete')+'</button></div></div></article>';
    });
    html += '</div>';
  });
  return html+'<section class="card note-card"><h3>Study at a steady pace</h3><p>One lesson at a time works well. Review older words in between new units. The test organization lists recommended study-hour ranges by level and learning environment; use its current guidance alongside your own pace.</p><button class="text-link" data-go="exam">See official study links →</button></section>';
}
function wordCard(word) {
  return '<article class="word '+(state.known.includes(word.id)?'learned':'')+'"><div class="category">'+esc(word.c)+' · '+LESSONS[word.lesson].level+'</div><div class="hanzi">'+esc(word.h)+'</div><div class="pinyin">'+esc(word.p)+'</div><div class="meaning">'+esc(word.m)+'</div><div class="word-actions"><button class="icon" data-say="'+esc(word.h)+'" aria-label="Play word">♫</button><button class="icon" data-known="'+word.id+'" aria-label="Toggle known">'+(state.known.includes(word.id)?'✓':'＋')+'</button></div></article>';
}
function pageWords() {
  const categories = ['All', ...new Set(VOCAB.map(word=>word.c))];
  return '<div class="page-head"><div><div class="kicker">CORE DECK · '+VOCAB.length+' UNIQUE WORDS</div><h1>Make the words familiar.</h1><p>Traditional characters, pinyin, meaning and Taiwan Mandarin audio. Mark a word known when you can recall it.</p></div><input class="search" id="wordSearch" placeholder="Search words…"></div><div class="source important-source"><b>For full exam preparation:</b> this is a curated course deck, not the complete official A1/A2 vocabulary list. Open the official list from the Exam page and learn every word on your target level.</div><div class="flash"><div class="flash-copy"><div class="eyebrow">QUICK RECALL</div><h3>One word at a time</h3><p>Say the meaning before you reveal it.</p></div><div class="flash-word" id="flashWord">'+esc(VOCAB[flashIndex]?.h||'你好')+'</div><button class="smallbtn" id="reveal">Reveal</button><button class="smallbtn" id="nextWord">Next →</button></div><div class="filter-row">'+categories.map((category,index)=>'<button class="filter '+(!index?'active':'')+'" data-cat="'+esc(category)+'">'+esc(category)+'</button>').join('')+'</div><div class="words" id="wordGrid">'+VOCAB.map(wordCard).join('')+'</div>';
}
function pagePractice() {
  return '<div class="page-head"><div><div class="kicker">HEAR IT · READ IT · SAY IT</div><h1>Let your ear lead.</h1><p>Every lesson has a Taiwan Mandarin sentence. Listen, read the pinyin, then shadow it aloud.</p></div><span class="pill">'+LESSONS.length+' sentence models</span></div><div class="practice-controls"><button class="filter active" data-phrase-level="All">All</button><button class="filter" data-phrase-level="A1">A1</button><button class="filter" data-phrase-level="A2">A2</button></div><div class="two-col"><section class="card"><h3>Sentence shelf</h3><p>Play a line, then repeat it out loud.</p><div class="sentence-list" id="phraseList">'+renderPhrases('All')+'</div></section><section class="card speaking"><h3>Your speaking corner</h3><p>Recording is optional. Press Record only when you are ready.</p><div class="rate"><label>Speech speed</label><input id="rate" type="range" min=".55" max="1" step=".05" value=".78"><span id="rateText">0.78×</span></div><div class="recordbox"><div class="orb" id="orb">◉</div><strong>Listen and shadow</strong><p>Microphone permission is requested only when you press Record.</p><div class="record-actions"><button class="button secondary" id="listenFirst">♫ Listen to first sentence shown</button><button class="smallbtn" id="recordStart">● Record</button><button class="smallbtn" id="recordStop" disabled>Stop</button><button class="smallbtn" id="recordPlay" disabled>▶ Replay</button></div><div class="status" id="audioStatus">Your recording stays in this browser tab.</div></div><p class="note">Audio uses a Chinese (Taiwan) speech voice from your browser or device when available. Voice quality varies. This tool plays speech; it does not grade pronunciation.</p></section></div>';
}
function renderPhrases(level) {
  return LESSONS.map((lesson,index) => ({lesson,index})).filter(item=>level==='All'||item.lesson.level===level).map(({lesson,index})=>'<div class="sentence"><div><span class="level-tag '+lesson.level.toLowerCase()+'">'+lesson.level+'</span><strong>'+esc(lesson.example)+'</strong><small>'+esc(lesson.pinyin)+'</small><em>'+esc(lesson.meaning)+'</em></div><button class="play" data-say="'+esc(lesson.example)+'" aria-label="Play sentence">▶</button></div>').join('');
}
function pageExam() {
  return '<div class="page-head"><div><div class="kicker">EXAM FORMAT · OFFICIAL MATERIALS · PRACTICE</div><h1>Prepare for both<br>A1 and A2.</h1><p>TOCFL Band A is the beginner band. Use the course to build skills, then use the official samples and vocabulary list to check your readiness.</p></div><span class="pill">Original practice · not official items</span></div><section class="card exam-format"><div><h3>Current Band A format</h3><p>The standard Listening and Reading test has two sections. This practice room includes an original 50-question simulation in the same question-count and time structure.</p><table class="table"><tr><th>SECTION</th><th>QUESTIONS</th><th>TIME</th></tr><tr><td>Listening 聽力</td><td>25</td><td>30 minutes</td></tr><tr><td>Reading 閱讀</td><td>25</td><td>30 minutes</td></tr></table><div class="callout"><b>A1:</b> simple familiar words, phrases and everyday needs. <b>A2:</b> short, clear conversations and messages with more detail. Band A covers both levels.</div></div><div class="official-links"><h3>Official preparation</h3><a href="https://tocfl.edu.tw/tocfl/index.php/teach/test/page/1" target="_blank" rel="noreferrer">Free sample tests and audio ↗</a><a href="https://tocfl.edu.tw/tocfl/index.php/teach/download" target="_blank" rel="noreferrer">Full official vocabulary resources ↗</a><a href="https://tocfl.edu.tw/tocfl/index.php/test/screening/list/4" target="_blank" rel="noreferrer">Test format and level descriptions ↗</a><a href="https://tocfl.edu.tw/tocfl/index.php/sign_up/rule/list/1" target="_blank" rel="noreferrer">Current scoring and certificate rules ↗</a></div></section><div class="section-head"><div><h2>Choose your practice</h2><p>Short drills give explanations right away. The simulation saves feedback until the end.</p></div></div><div class="practice-modes"><article class="mode-card"><span class="level-tag a1">A1</span><h3>A1 skills drill</h3><p>10 mixed listening and reading questions with immediate explanations.</p><button class="button secondary" data-mode="A1">Start A1 drill →</button></article><article class="mode-card"><span class="level-tag a2">A2</span><h3>A2 skills drill</h3><p>10 mixed questions on plans, past events, comparisons, messages and more.</p><button class="button secondary" data-mode="A2">Start A2 drill →</button></article><article class="mode-card featured-mode"><span class="level-tag">FULL BAND A</span><h3>Timed simulation</h3><p>25 listening + 25 reading questions. 30 minutes for each section.</p><button class="button primary" data-mode="full">Start 50-question simulation →</button></article></div><section class="card study-guidance"><h3>Use a readiness checklist</h3><ul><li>Finish the A1 units, then the A2 units.</li><li>Study the complete official vocabulary list for your target level; the in-app word deck is a supplement.</li><li>Take the official sample papers with their audio, then practise under timed conditions.</li><li>Review wrong answers and listen again until you understand the key detail.</li></ul><p>Practice scores here are raw results on original questions. They are not official scaled scores, certificate thresholds or a guarantee of passing. Check the current official rules for your test type.</p></section><div id="quizArea"></div>';
}
function pageProgress() {
  const fullScore = state.bestFull ? state.bestFull+'/50' : '—';
  return '<div class="page-head"><div><div class="kicker">YOUR JOURNEY, SAVED ON THIS DEVICE</div><h1>Small steps add up.</h1><p>Lesson progress, known words and practice records stay in this browser.</p></div><button class="button secondary" data-go="lessons">Continue learning →</button></div><div class="two-col"><section class="card"><h3>Course progress</h3><div class="result-score">'+progressPercent()+'%</div><div class="track"><i style="width:'+progressPercent()+'%"></i></div><div class="progress-level"><b>A1 · '+levelDone('A1')+'/12</b><div class="track"><i style="width:'+(levelDone('A1')/12*100)+'%"></i></div></div><div class="progress-level"><b>A2 · '+levelDone('A2')+'/12</b><div class="track"><i style="width:'+(levelDone('A2')/12*100)+'%"></i></div></div>'+LESSONS.map((lesson,index)=>'<p class="progress-row">'+(state.done.includes(index)?'✓':'○')+'　<span>'+lesson.level+' · '+esc(lesson.title)+'</span></p>').join('')+'</section><section class="card"><h3>Study snapshot</h3><p>'+state.known.length+' core words marked known · '+state.days.length+' study days</p><div class="score-grid"><div><b>A1 drill</b><strong>'+(state.bestA1||'—')+'/10</strong></div><div><b>A2 drill</b><strong>'+(state.bestA2||'—')+'/10</strong></div><div><b>Full simulation</b><strong>'+fullScore+'</strong></div></div><p>These are practice results, not official scaled scores.</p><button class="clear" id="clearProgress">Reset saved progress</button></section></div>';
}
function draw() {
  const view = state.view || 'home';
  const pages = {home:pageHome,lessons:pageLessons,words:pageWords,practice:pagePractice,exam:pageExam,progress:pageProgress};
  document.getElementById('appMain').innerHTML = (pages[view] || pageHome)();
  document.getElementById('crumb').textContent = LABELS[view] || LABELS.home;
  document.getElementById('today').textContent = new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}).toUpperCase();
  document.querySelectorAll('.nav').forEach(button=>button.classList.toggle('active',button.dataset.view===view));
  save();
}
function shuffle(items) {
  const list = items.slice();
  for (let i=list.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [list[i],list[j]]=[list[j],list[i]]; }
  return list;
}
function startQuiz(mode) {
  if (quizClock) clearInterval(quizClock);
  let selected;
  if (mode === 'full') selected = QUESTIONS.filter(q=>q.section==='Listening').concat(QUESTIONS.filter(q=>q.section==='Reading'));
  else {
    const levelPool = QUESTIONS.filter(q=>q.level===mode);
    selected = shuffle(levelPool.filter(q=>q.section==='Listening')).slice(0,5).concat(shuffle(levelPool.filter(q=>q.section==='Reading')).slice(0,5));
    selected = shuffle(selected);
  }
  quiz = {mode,questions:selected,index:0,answers:[],answered:false,deadline:mode==='full'?Date.now()+30*60*1000:null,phase:'Listening'};
  logDay();
  renderQuestion();
  if (mode==='full') quizClock=setInterval(tickClock,1000);
}
function tickClock() {
  if (!quiz || quiz.mode!=='full') return;
  const item = quiz.questions[quiz.index];
  if (!item) return;
  const desired = item.section;
  if (desired !== quiz.phase) { quiz.phase=desired; quiz.deadline=Date.now()+30*60*1000; }
  const remaining = Math.max(0,Math.ceil((quiz.deadline-Date.now())/1000));
  const timer = document.getElementById('examTimer');
  if (timer) timer.textContent = String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
  if (remaining === 0) {
    if (quiz.phase==='Listening') {
      while (quiz.index < quiz.questions.length && quiz.questions[quiz.index].section==='Listening') { if (!(quiz.index in quiz.answers)) quiz.answers[quiz.index]=null; quiz.index++; }
      if (quiz.index < quiz.questions.length) { quiz.phase='Reading'; quiz.deadline=Date.now()+30*60*1000; renderQuestion(); }
      else finishQuiz();
    } else {
      while (quiz.index < quiz.questions.length) { if (!(quiz.index in quiz.answers)) quiz.answers[quiz.index]=null; quiz.index++; }
      finishQuiz();
    }
  }
}
function questionMeta(question) {
  let prompt = '';
  if (question.section==='Listening') {
    prompt = '<button class="quiz-audio" data-say="'+esc(question.audio)+'">♫ Play listening prompt</button>';
    if (question.type==='Picture dialogue') prompt += '<div class="scene">'+esc(question.scene)+'</div>';
  } else prompt = '<div class="quiz-prompt">'+esc(question.text)+'</div>';
  return '<div class="quiz-type">'+esc(question.section)+' · '+esc(question.type)+' · '+question.level+'</div>'+prompt+'<h2 class="quiz-q">'+esc(question.ask)+'</h2>';
}
function renderQuestion() {
  const area = document.getElementById('quizArea');
  if (!area || !quiz) return;
  if (quiz.index >= quiz.questions.length) { finishQuiz(); return; }
  const question = quiz.questions[quiz.index];
  const timed = quiz.mode==='full';
  const title = timed ? 'FULL SIMULATION' : question.level+' DRILL';
  area.innerHTML = '<div class="quiz"><div class="quiz-head"><span>QUESTION '+(quiz.index+1)+' OF '+quiz.questions.length+'</span><span>'+title+(timed?' · '+question.section.toUpperCase()+' <b id="examTimer">30:00</b>':'')+'</span></div><div class="quiz-card">'+questionMeta(question)+'<div class="answers">'+question.options.map((option,index)=>'<button class="answer" data-answer="'+index+'" '+(quiz.answered?'disabled':'')+'>'+esc(option)+'</button>').join('')+'</div><div class="feedback" id="feedback"></div><div class="quiz-actions">'+(timed?'<button class="smallbtn" id="skipQuestion">Skip</button>':'')+'<button id="quizNext" class="button secondary" '+(quiz.answered?'':'disabled')+'>'+(quiz.index===quiz.questions.length-1?'Finish':'Next →')+'</button></div></div></div>';
  if (timed) tickClock();
}
function chooseAnswer(index) {
  if (!quiz || quiz.answered) return;
  const question = quiz.questions[quiz.index];
  quiz.answers[quiz.index]=index;
  quiz.answered=true;
  document.querySelectorAll('.answer').forEach(button=>{
    button.disabled=true;
    if (quiz.mode!=='full' && Number(button.dataset.answer)===question.answer) button.classList.add('correct');
    if (Number(button.dataset.answer)===index && index!==question.answer && quiz.mode!=='full') button.classList.add('incorrect');
    if (quiz.mode==='full' && Number(button.dataset.answer)===index) button.classList.add('selected');
  });
  if (quiz.mode!=='full') document.getElementById('feedback').textContent=(index===question.answer?'Correct! ':'Review this one. ')+question.why;
  document.getElementById('quizNext').disabled=false;
}
function nextQuestion() {
  if (!quiz) return;
  quiz.index++;
  quiz.answered=false;
  if (quiz.mode==='full' && quiz.index < quiz.questions.length && quiz.questions[quiz.index].section!==quiz.phase) {
    quiz.phase=quiz.questions[quiz.index].section;
    quiz.deadline=Date.now()+30*60*1000;
  }
  renderQuestion();
}
function finishQuiz() {
  if (!quiz) return;
  if (quizClock) clearInterval(quizClock);
  quizClock=null;
  const result={correct:0,Listening:0,Reading:0,A1:0,A2:0,bySection:{Listening:{right:0,total:0},Reading:{right:0,total:0}}};
  quiz.questions.forEach((question,index)=>{
    const right=quiz.answers[index]===question.answer;
    if (right) { result.correct++; result[question.level]++; result[question.section]++; }
    result.bySection[question.section].total++;
    if (right) result.bySection[question.section].right++;
  });
  state.lastScore={mode:quiz.mode,score:result.correct,total:quiz.questions.length,date:new Date().toISOString()};
  if (quiz.mode==='full') state.bestFull=Math.max(state.bestFull,result.correct);
  if (quiz.mode==='A1') state.bestA1=Math.max(state.bestA1,result.correct);
  if (quiz.mode==='A2') state.bestA2=Math.max(state.bestA2,result.correct);
  logDay();
  const missed=quiz.questions.map((question,index)=>({question,index})).filter(({question,index})=>quiz.answers[index]!==question.answer);
  const summary=quiz.mode==='full'
    ? '<div class="result-breakdown"><div><b>Listening</b><strong>'+result.bySection.Listening.right+'/25</strong></div><div><b>Reading</b><strong>'+result.bySection.Reading.right+'/25</strong></div><div><b>A1 items</b><strong>'+result.A1+'/'+quiz.questions.filter(q=>q.level==='A1').length+'</strong></div><div><b>A2 items</b><strong>'+result.A2+'/'+quiz.questions.filter(q=>q.level==='A2').length+'</strong></div></div>'
    : '<p>'+quiz.mode+' mixed drill · '+result.correct+' correct out of '+quiz.questions.length+'.</p>';
  const review=missed.length?'<details class="review-list"><summary>Review '+missed.length+' missed or skipped question'+(missed.length===1?'':'s')+'</summary>'+missed.map(({question,index})=>'<article><b>'+question.level+' · '+question.section+' · '+esc(question.type)+'</b><p>'+esc(question.ask)+'</p><p><strong>Answer: '+esc(question.options[question.answer])+'</strong><br>'+esc(question.why)+'</p></article>').join('')+'</details>':'<p>Excellent recall on this set. Continue with the official sample materials for another check.</p>';
  const modeLabel=quiz.mode==='full'?'SIMULATION COMPLETE':quiz.mode+' DRILL COMPLETE';
  document.getElementById('quizArea').innerHTML='<div class="quiz"><div class="quiz-card result"><div class="kicker">'+modeLabel+'</div><div class="result-score">'+result.correct+' / '+quiz.questions.length+'</div>'+summary+'<p>Raw practice result only. This is not an official scaled score or pass prediction.</p>'+review+'<div class="quiz-actions"><button class="button secondary" data-mode="'+esc(quiz.mode)+'">Try this set again</button><button class="smallbtn" data-restart>Choose another practice</button></div></div></div>';
  quiz.completed=true;
  save();
}
function filterWords() {
  const category=document.querySelector('.filter.active[data-cat]')?.dataset.cat||'All';
  const query=(document.getElementById('wordSearch')?.value||'').toLowerCase();
  const filtered=VOCAB.filter(word=>(category==='All'||word.c===category)&&(word.h+word.p+word.m+word.c).toLowerCase().includes(query));
  const grid=document.getElementById('wordGrid');
  if (grid) grid.innerHTML=filtered.map(wordCard).join('')||'<p class="empty-state">No matching words. Try another search.</p>';
}
async function startRecording() {
  const status=document.getElementById('audioStatus');
  try {
    if (!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder) throw new Error('unsupported');
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    audioChunks=[];
    recorder=new MediaRecorder(stream);
    recorder.ondataavailable=event=>{ if(event.data.size) audioChunks.push(event.data); };
    recorder.onstop=()=>{
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      recordedUrl=URL.createObjectURL(new Blob(audioChunks,{type:recorder.mimeType||'audio/webm'}));
      document.getElementById('recordPlay').disabled=false;
      stream.getTracks().forEach(track=>track.stop());
      status.textContent='Saved temporarily in this tab.';
    };
    recorder.start();
    document.getElementById('recordStart').disabled=true;
    document.getElementById('recordStop').disabled=false;
    document.getElementById('orb').classList.add('recording');
    status.textContent='Recording… speak at your own pace.';
  } catch(error) {
    status.textContent=error.name==='NotAllowedError'?'Microphone access is blocked. You can still listen and shadow.':'Recording is unavailable on this device. Listening and shadowing still work.';
  }
}
function stopRecording() {
  if (recorder&&recorder.state!=='inactive') {
    recorder.stop();
    document.getElementById('recordStart').disabled=false;
    document.getElementById('recordStop').disabled=true;
    document.getElementById('orb').classList.remove('recording');
  }
}
document.body.addEventListener('click',async event=>{
  let target=event.target.closest('[data-view]');
  if(target){go(target.dataset.view);return;}
  target=event.target.closest('[data-go]');
  if(target){event.preventDefault();go(target.dataset.go);return;}
  target=event.target.closest('[data-say]');
  if(target){logDay();speak(target.dataset.say);return;}
  target=event.target.closest('[data-toggle]');
  if(target){target.closest('.unit').classList.toggle('open');return;}
  target=event.target.closest('[data-open]');
  if(target){go('lessons');setTimeout(()=>{const unit=document.getElementById('unit-'+target.dataset.open);if(unit){unit.classList.add('open');unit.scrollIntoView({behavior:'smooth'});}},40);return;}
  target=event.target.closest('[data-done]');
  if(target){const index=Number(target.dataset.done);if(!state.done.includes(index))state.done.push(index);logDay();draw();toast('Lesson complete — 好棒！');return;}
  target=event.target.closest('[data-known]');
  if(target){const id=Number(target.dataset.known);state.known=state.known.includes(id)?state.known.filter(value=>value!==id):state.known.concat(id);logDay();draw();return;}
  target=event.target.closest('[data-cat]');
  if(target){document.querySelectorAll('[data-cat]').forEach(button=>button.classList.toggle('active',button===target));filterWords();return;}
  target=event.target.closest('[data-phrase-level]');
  if(target){document.querySelectorAll('[data-phrase-level]').forEach(button=>button.classList.toggle('active',button===target));const list=document.getElementById('phraseList');if(list)list.innerHTML=renderPhrases(target.dataset.phraseLevel);return;}
  target=event.target.closest('[data-mode]');
  if(target){startQuiz(target.dataset.mode);return;}
  if(event.target.closest('[data-answer]')){chooseAnswer(Number(event.target.closest('[data-answer]').dataset.answer));return;}
  if(event.target.closest('#quizNext')){nextQuestion();return;}
  if(event.target.closest('#skipQuestion')){if(quiz){if (!(quiz.index in quiz.answers)) quiz.answers[quiz.index]=null;nextQuestion();}return;}
  if(event.target.closest('#reveal')){const word=VOCAB[flashIndex];document.getElementById('flashWord').innerHTML=esc(word.h)+'<small>'+esc(word.p)+' · '+esc(word.m)+'</small>';return;}
  if(event.target.closest('#nextWord')){flashIndex=(flashIndex+1)%VOCAB.length;document.getElementById('flashWord').textContent=VOCAB[flashIndex].h;return;}
  if(event.target.closest('#listenFirst')){const phrase=document.querySelector('.sentence-list .sentence');if(phrase)speak(phrase.querySelector('strong').textContent);return;}
  if(event.target.closest('#recordStart')){await startRecording();return;}
  if(event.target.closest('#recordStop')){stopRecording();return;}
  if(event.target.closest('#recordPlay')){if(recordedUrl)new Audio(recordedUrl).play();return;}
  if(event.target.closest('[data-restart]')){quiz=null;draw();return;}
  if(event.target.closest('#clearProgress')&&confirm('Clear course and practice progress saved in this browser?')){if(quizClock)clearInterval(quizClock);localStorage.removeItem('islandStudyProgress');state=Object.assign({},defaultState);draw();}
});
document.body.addEventListener('input',event=>{
  if(event.target.id==='wordSearch')filterWords();
  if(event.target.id==='rate'){const label=document.getElementById('rateText');if(label)label.textContent=Number(event.target.value).toFixed(2)+'×';}
});
draw();

