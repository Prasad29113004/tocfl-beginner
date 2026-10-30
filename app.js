const DATA = window.TOCFL;
const LESSONS = DATA.lessons;
const VOCAB = [];
let OFFICIAL_VOCAB = [];
let OFFICIAL_KNOWN = new Set();
try {
  OFFICIAL_VOCAB = JSON.parse(localStorage.getItem('tocflOfficialWords') || '[]');
  OFFICIAL_KNOWN = new Set(JSON.parse(localStorage.getItem('tocflOfficialKnown') || '[]'));
} catch (_) { OFFICIAL_VOCAB = []; OFFICIAL_KNOWN = new Set(); }
const vocabSeen = new Set();
LESSONS.forEach((lesson, lessonIndex) => lesson.words.split(';').forEach((entry) => {
  const [h, p, m, c] = entry.split('|');
  if (!vocabSeen.has(h)) {
    vocabSeen.add(h);
    VOCAB.push({ id: VOCAB.length, h, p, m, c: c || 'Core', lesson: lessonIndex });
  }
}));
const QUESTIONS = DATA.questions;
const TONES = [{hanzi:'媽',pinyin:'mā',meaning:'mother',tone:1,label:'1st · high and level',guide:'Keep your voice high and steady.'},{hanzi:'麻',pinyin:'má',meaning:'hemp; numb',tone:2,label:'2nd · rising',guide:'Raise your voice from lower to higher.'},{hanzi:'馬',pinyin:'mǎ',meaning:'horse',tone:3,label:'3rd · low',guide:'Keep it low before most tones; the full dip is clearest at the end of a phrase.'},{hanzi:'罵',pinyin:'mà',meaning:'to scold',tone:4,label:'4th · falling',guide:'Drop your voice quickly from high to low.'},{hanzi:'嗎',pinyin:'ma',meaning:'yes/no question particle',tone:5,label:'Neutral · light',guide:'Say it briefly and lightly; it has no tone mark.'}];
const TONE_OPTIONS = ['1st · high and level','2nd · rising','3rd · low','4th · falling','Neutral · light'];
const INITIALS = [
  {sound:'b',hanzi:'波',pinyin:'bō',meaning:'wave'},{sound:'p',hanzi:'破',pinyin:'pò',meaning:'broken'},{sound:'m',hanzi:'媽',pinyin:'mā',meaning:'mother'},{sound:'f',hanzi:'飛',pinyin:'fēi',meaning:'fly'},
  {sound:'d',hanzi:'多',pinyin:'duō',meaning:'many'},{sound:'t',hanzi:'天',pinyin:'tiān',meaning:'sky'},{sound:'n',hanzi:'你',pinyin:'nǐ',meaning:'you'},{sound:'l',hanzi:'來',pinyin:'lái',meaning:'come'},
  {sound:'g',hanzi:'哥',pinyin:'gē',meaning:'older brother'},{sound:'k',hanzi:'可',pinyin:'kě',meaning:'can'},{sound:'h',hanzi:'好',pinyin:'hǎo',meaning:'good'},
  {sound:'j',hanzi:'家',pinyin:'jiā',meaning:'home'},{sound:'q',hanzi:'去',pinyin:'qù',meaning:'go'},{sound:'x',hanzi:'謝',pinyin:'xiè',meaning:'thank'},
  {sound:'zh',hanzi:'中',pinyin:'zhōng',meaning:'middle'},{sound:'ch',hanzi:'茶',pinyin:'chá',meaning:'tea'},{sound:'sh',hanzi:'是',pinyin:'shì',meaning:'is'},{sound:'r',hanzi:'人',pinyin:'rén',meaning:'person'},
  {sound:'z',hanzi:'在',pinyin:'zài',meaning:'at'},{sound:'c',hanzi:'菜',pinyin:'cài',meaning:'vegetable'},{sound:'s',hanzi:'三',pinyin:'sān',meaning:'three'}
];
const FINALS = [
  {sound:'a',hanzi:'阿',pinyin:'ā',meaning:'ah'},{sound:'o',hanzi:'喔',pinyin:'ō',meaning:'oh'},{sound:'e',hanzi:'餓',pinyin:'è',meaning:'hungry'},{sound:'i',hanzi:'衣',pinyin:'yī',meaning:'clothes'},{sound:'u',hanzi:'五',pinyin:'wǔ',meaning:'five'},{sound:'ü',hanzi:'女',pinyin:'nǚ',meaning:'woman'},{sound:'er',hanzi:'二',pinyin:'èr',meaning:'two'},
  {sound:'ai',hanzi:'愛',pinyin:'ài',meaning:'love'},{sound:'ei',hanzi:'杯',pinyin:'bēi',meaning:'cup'},{sound:'ao',hanzi:'好',pinyin:'hǎo',meaning:'good'},{sound:'ou',hanzi:'口',pinyin:'kǒu',meaning:'mouth'},
  {sound:'an',hanzi:'安',pinyin:'ān',meaning:'peaceful'},{sound:'en',hanzi:'恩',pinyin:'ēn',meaning:'kindness'},{sound:'ang',hanzi:'昂',pinyin:'áng',meaning:'rise'},{sound:'eng',hanzi:'冷',pinyin:'lěng',meaning:'cold'},{sound:'ong',hanzi:'中',pinyin:'zhōng',meaning:'middle'},
  {sound:'ia',hanzi:'家',pinyin:'jiā',meaning:'home'},{sound:'ie',hanzi:'謝',pinyin:'xiè',meaning:'thank'},{sound:'iao',hanzi:'小',pinyin:'xiǎo',meaning:'small'},{sound:'iu',hanzi:'六',pinyin:'liù',meaning:'six'},{sound:'ian',hanzi:'天',pinyin:'tiān',meaning:'sky'},{sound:'in',hanzi:'心',pinyin:'xīn',meaning:'heart'},{sound:'iang',hanzi:'想',pinyin:'xiǎng',meaning:'want; think'},{sound:'ing',hanzi:'聽',pinyin:'tīng',meaning:'listen'},{sound:'iong',hanzi:'窮',pinyin:'qióng',meaning:'poor'},
  {sound:'ua',hanzi:'花',pinyin:'huā',meaning:'flower'},{sound:'uo',hanzi:'多',pinyin:'duō',meaning:'many'},{sound:'uai',hanzi:'快',pinyin:'kuài',meaning:'fast'},{sound:'ui',hanzi:'水',pinyin:'shuǐ',meaning:'water'},{sound:'uan',hanzi:'關',pinyin:'guān',meaning:'close'},{sound:'un',hanzi:'春',pinyin:'chūn',meaning:'spring'},{sound:'uang',hanzi:'黃',pinyin:'huáng',meaning:'yellow'},{sound:'ueng',hanzi:'嗡',pinyin:'wēng',meaning:'buzz'},
  {sound:'üe',hanzi:'月',pinyin:'yuè',meaning:'moon; month'},{sound:'üan',hanzi:'遠',pinyin:'yuǎn',meaning:'far'},{sound:'ün',hanzi:'雲',pinyin:'yún',meaning:'cloud'}
];
const GRAMMAR = [
  {level:'A1',title:'Basic sentence order',shape:'Subject + time/place + verb + object',meaning:'Put the person first. Time and place usually come before the main verb.',example:'我今天在家看書。',pinyin:'Wǒ jīntiān zài jiā kàn shū.',translation:'I am reading at home today.'},
  {level:'A1',title:'是 · identify or name',shape:'A + 是 + B',meaning:'Use 是 to say who or what someone or something is. Do not use it before ordinary adjectives.',example:'她是我的老師。',pinyin:'Tā shì wǒ de lǎoshī.',translation:'She is my teacher.'},
  {level:'A1',title:'不 and 沒(有) · two kinds of no',shape:'不 + habit / present / future; 沒(有) + possession or completed action',meaning:'不 often negates a choice, habit or future action. 沒有 means do not have, or did not do.',example:'我今天不喝咖啡，昨天也沒有喝。',pinyin:'Wǒ jīntiān bù hē kāfēi, zuótiān yě méiyǒu hē.',translation:'I will not drink coffee today, and I did not drink it yesterday either.'},
  {level:'A1',title:'嗎 and question words',shape:'Yes/no: statement + 嗎？ · open question: question word stays in place',meaning:'嗎 makes a yes/no question. Questions with 誰, 什麼, 哪裡 or 幾 keep the question word where the answer belongs.',example:'你住在哪裡？你是學生嗎？',pinyin:'Nǐ zhù zài nǎlǐ? Nǐ shì xuéshēng ma?',translation:'Where do you live? Are you a student?'},
  {level:'A1',title:'有 · have / there is',shape:'Person + 有 + noun · Place + 有 + noun',meaning:'有 shows possession or says something exists in a place. Its negative is 沒有.',example:'我家附近有一間超市。',pinyin:'Wǒ jiā fùjìn yǒu yì jiān chāoshì.',translation:'There is a supermarket near my home.'},
  {level:'A1',title:'在 · location and action in progress',shape:'Person + 在 + place + verb',meaning:'Put 在 before a location to say where an action happens. Place usually comes before the verb.',example:'他在圖書館看書。',pinyin:'Tā zài túshūguǎn kàn shū.',translation:'He is reading at the library.'},
  {level:'A1',title:'的 · possession and description',shape:'owner / description + 的 + noun',meaning:'的 links a possessor or description to a noun. It is often omitted with close family relationships.',example:'這是我朋友的手機。',pinyin:'Zhè shì wǒ péngyou de shǒujī.',translation:'This is my friend’s phone.'},
  {level:'A1',title:'Measure words',shape:'number / 這 / 那 + measure word + noun',meaning:'Place a measure word between a number or demonstrative and the noun. 個 is common; learn the usual word with each noun.',example:'我有兩本書和一杯茶。',pinyin:'Wǒ yǒu liǎng běn shū hé yì bēi chá.',translation:'I have two books and a cup of tea.'},
  {level:'A1',title:'Adjectives with 很',shape:'Subject + 很 + adjective',meaning:'Adjectives can be predicates without 是. 很 often makes the sentence sound natural and does not always mean “very.”',example:'今天很冷。',pinyin:'Jīntiān hěn lěng.',translation:'It is cold today.'},
  {level:'A1',title:'Time words',shape:'Subject + time + verb',meaning:'Time words usually go before the verb. Use 年, 月, 日 / 號, 星期, and 點 for common dates and times.',example:'我明天早上八點上課。',pinyin:'Wǒ míngtiān zǎoshang bā diǎn shàngkè.',translation:'I have class at eight tomorrow morning.'},
  {level:'A1',title:'想, 要, 會 and 可以',shape:'modal word + verb',meaning:'想 = want to; 要 = want / will; 會 = know how / likely will; 可以 = may / be allowed to.',example:'我想坐捷運，可以嗎？',pinyin:'Wǒ xiǎng zuò jiéyùn, kěyǐ ma?',translation:'I want to take the MRT. Is that okay?'},
  {level:'A1',title:'也 and 都',shape:'Subject + 也 / 都 + verb or adjective',meaning:'也 means also. 都 means all or both; place it before the verb or adjective.',example:'我們都喜歡台灣，我妹妹也喜歡。',pinyin:'Wǒmen dōu xǐhuan Táiwān, wǒ mèimei yě xǐhuan.',translation:'We all like Taiwan; my younger sister likes it too.'},
  {level:'A2',title:'了 · completed event',shape:'verb + 了',meaning:'了 can mark a completed event. A past time word often makes the time clear. Negate a past event with 沒(有) + verb, without 了.',example:'昨天我買了水果，沒有買牛奶。',pinyin:'Zuótiān wǒ mǎi le shuǐguǒ, méiyǒu mǎi niúnǎi.',translation:'Yesterday I bought fruit and did not buy milk.'},
  {level:'A2',title:'正在…呢 · in progress',shape:'正在 + verb + (呢)',meaning:'Use this to show that an action is happening right now.',example:'媽媽正在做飯呢。',pinyin:'Māma zhèngzài zuò fàn ne.',translation:'Mom is cooking right now.'},
  {level:'A2',title:'比 · comparisons',shape:'A + 比 + B + adjective',meaning:'Place 比 between the two things being compared. Add 一點 for a small difference.',example:'今天比昨天暖和一點。',pinyin:'Jīntiān bǐ zuótiān nuǎnhuo yìdiǎn.',translation:'Today is a little warmer than yesterday.'},
  {level:'A2',title:'太…了 · too / very',shape:'太 + adjective + 了',meaning:'This pattern often means “too …” and can also express a strong reaction.',example:'這杯咖啡太熱了。',pinyin:'Zhè bēi kāfēi tài rè le.',translation:'This coffee is too hot.'},
  {level:'A2',title:'先…再… · order of actions',shape:'先 + action 1，再 + action 2',meaning:'Use 先 and 再 to show what happens first and what follows.',example:'我先吃飯，再去上課。',pinyin:'Wǒ xiān chī fàn, zài qù shàngkè.',translation:'I will eat first, then go to class.'},
  {level:'A2',title:'因為…所以… · reason and result',shape:'因為 + reason，所以 + result',meaning:'Connect a reason with its result. In conversation, one connector is sometimes left out.',example:'因為下雨，所以我們坐公車。',pinyin:'Yīnwèi xiàyǔ, suǒyǐ wǒmen zuò gōngchē.',translation:'Because it is raining, we are taking the bus.'},
  {level:'A2',title:'雖然…但是… · contrast',shape:'雖然 + situation，但是 + contrast',meaning:'Use this pair to show that the second fact contrasts with what the listener expects.',example:'雖然有點遠，但是走路很方便。',pinyin:'Suīrán yǒudiǎn yuǎn, dànshì zǒulù hěn fāngbiàn.',translation:'Although it is a little far, walking is convenient.'},
  {level:'A2',title:'如果…就… · condition',shape:'如果 + condition，就 + result',meaning:'Use 如果 to introduce a condition and 就 to introduce what follows from it.',example:'如果你有空，我們就一起去。',pinyin:'Rúguǒ nǐ yǒu kòng, wǒmen jiù yìqǐ qù.',translation:'If you are free, we will go together.'},
  {level:'A2',title:'還是 and 或者 · “or”',shape:'Question / choice: 還是 · statement: 或者',meaning:'Use 還是 when asking someone to choose. Use 或者 when listing alternatives in a statement.',example:'你要喝茶還是咖啡？我都可以，或者喝水也行。',pinyin:'Nǐ yào hē chá háishi kāfēi? Wǒ dōu kěyǐ, huòzhě hē shuǐ yě xíng.',translation:'Would you like tea or coffee? Either is fine; water works too.'},
  {level:'A2',title:'再 and 又 · again',shape:'再 + future action · 又 + repeated past / current event',meaning:'再 usually points to an action that will happen again. 又 often says that something happened again or is happening again.',example:'明天再來一次，今天又下雨了。',pinyin:'Míngtiān zài lái yí cì, jīntiān yòu xiàyǔ le.',translation:'Come again tomorrow; it has rained again today.'}
];
const GRAMMAR_QUIZ = [
  {level:'A1',text:'Choose the natural sentence: “I read at home today.”',options:['我今天在家看書。','我看書在今天家。','我是今天在家看書。'],answer:0,why:'Time and place normally come before the main verb.'},
  {level:'A1',text:'Choose the question: “Are you a student?”',options:['你是學生嗎？','你嗎是學生？','你有學生嗎？'],answer:0,why:'Put 嗎 at the end of a yes/no question.'},
  {level:'A1',text:'Choose the negative: “I did not go yesterday.”',options:['我昨天沒去。','我昨天不去了。','我昨天沒有去嗎。'],answer:0,why:'Use 沒(有) to negate a completed past action.'},
  {level:'A1',text:'Choose the natural quantity: “three books.”',options:['三本書','三書本','三個本書'],answer:0,why:'Use the measure word 本 with books.'},
  {level:'A1',text:'Choose “There is a shop near my home.”',options:['我家附近有一間店。','我家附近是店一間。','我家有在附近一間店。'],answer:0,why:'Place + 有 + noun says something exists there.'},
  {level:'A2',text:'Choose “Yesterday I bought fruit.”',options:['昨天我買了水果。','昨天我沒有買了水果。','昨天我了買水果。'],answer:0,why:'Put 了 after the verb to mark the completed event.'},
  {level:'A2',text:'Complete: “Today is warmer than yesterday.” 今天 ___ 昨天暖和。',options:['比','因為','還是'],answer:0,why:'A 比 B + adjective makes a comparison.'},
  {level:'A2',text:'Complete: “Because it is raining, we are taking the bus.” ___ 下雨，___ 我們坐公車。',options:['因為 / 所以','雖然 / 如果','再 / 又'],answer:0,why:'因為…所以… links a reason with its result.'},
  {level:'A2',text:'Choose “If you are free, we will go together.”',options:['如果你有空，我們就一起去。','雖然你有空，我們再一起去。','你有空因為我們就去。'],answer:0,why:'如果…就… expresses a condition and result.'},
  {level:'A2',text:'Which sentence asks someone to choose?',options:['你要喝茶還是咖啡？','你要喝茶或者咖啡。','你又喝茶再咖啡？'],answer:0,why:'Use 還是 between alternatives in a question.'}
];
const SECTIONS = ['Listening', 'Reading'];
const LABELS = { home:'OVERVIEW', lessons:'LEARNING PATH', grammar:'GRAMMAR GUIDE', words:'WORD CARDS', practice:'PINYIN & SOUNDS', exam:'EXAM PRACTICE', progress:'MY PROGRESS' };
const defaultState = { version:3, done:[], known:[], days:[], bestFull:0, bestA1:0, bestA2:0, lastScore:null, view:'home' };
let state = defaultState;
try {
  const saved = JSON.parse(localStorage.getItem('islandStudyProgress') || 'null');
  if (saved && saved.version === 3) state = Object.assign({}, defaultState, saved);
  else if (saved && saved.version === 2) state = Object.assign({}, defaultState, saved, { version:3, bestFull:0, lastScore:null });
  else if (saved && Array.isArray(saved.days)) state.days = saved.days;
} catch (_) {}
let flashIndex = 0;
let quiz = null;
let toneQuiz = null;
let soundQuiz = null;
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
  if (count) count.textContent = state.done.length + '/25';
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
  toneQuiz = null;
  soundQuiz = null;
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
  return '<section class="hero"><div class="hero-copy"><div class="eyebrow">FROM YOUR FIRST WORD TO BAND A</div><h1>Start at zero.<br><em>Build a Taiwan-ready ear.</em></h1><p>A calm, step-by-step Traditional Chinese course. Learn the foundations first, then move through A1 and A2 with sentence audio, grammar, recall practice and original exam-style questions.</p><div class="actions"><button class="button primary" data-go="lessons">Start the A1 path →</button><a class="text-link" href="#exam" data-go="exam">Explore the exam plan <span aria-hidden="true">→</span></a></div></div></section><div class="stats"><div class="stat"><i>▤</i><div><strong>'+state.done.length+' / 25</strong><small>lessons finished</small></div></div><div class="stat"><i>◫</i><div><strong>'+remembered+' / '+VOCAB.length+'</strong><small>course words marked known</small></div></div><div class="stat"><i>◷</i><div><strong>'+state.days.length+'</strong><small>study days logged</small></div></div></div><div class="section-head"><div><h2>Your route through Band A</h2><p>12 A1 units, then 13 A2 units. Take the lessons in order.</p></div><button class="link-button" data-go="lessons">All 25 lessons →</button></div><div class="grid-path">'+LESSONS.slice(0,4).map((lesson,index) => '<button class="path" data-open="'+index+'"><span class="numb">0'+(index+1)+'</span><span><strong>'+esc(lesson.title)+'</strong><small>'+lesson.level+' · '+esc(lesson.goal)+'</small></span><span class="arrow">↗</span></button>').join('')+'</div><div class="daily"><div><strong>Next lesson: '+esc(next.title)+'</strong><div class="track"><i style="width:'+progressPercent()+'%"></i></div><p>'+esc(next.goal)+'</p></div><div class="tip"><small>HOW TO USE THIS COURSE</small><blockquote>Listen · read · recall · repeat</blockquote><small>Play every sentence aloud, then shadow it slowly.</small></div></div><section class="card readiness"><div class="kicker">A COMPLETE STUDY ROUTE NEEDS MORE THAN AN APP</div><h3>Use these three parts together</h3><div class="readiness-grid"><p><b>1. Learn the foundations</b><br>Complete the A1 units, then A2. Review grammar and use the word cards and sentence shelf every day.</p><p><b>2. Practise exam timing</b><br>Try the 35-question-per-section timed practice set and review every missed answer.</p><p><b>3. Check official materials</b><br>Study the official vocabulary list and sample tests. They are linked on the Exam page.</p></div></section>';
}
function pageLessons() {
  let html = '<div class="page-head"><div><div class="kicker">25 UNITS · A1 FOUNDATION → A2</div><h1>Learn it in layers.</h1><p>Open a unit, study the pattern, play the example and mark it complete when you can use it without looking.</p></div><span class="pill">'+state.done.length+' / 25 complete</span></div><div class="level-summary"><div><span class="level-tag a1">A1</span><b>'+levelDone('A1')+' / 12</b><small>Basic familiar phrases and everyday needs</small></div><div><span class="level-tag a2">A2</span><b>'+levelDone('A2')+' / 13</b><small>Short conversations, messages and connected ideas</small></div></div>';
  ['A1','A2'].forEach(level => {
    html += '<div class="section-head level-heading"><div><h2>'+level+' '+(level==='A1'?'· Build the basics':'· Understand more')+'</h2><p>'+(level==='A1'?'Start here if you are a complete beginner.':'Continue after A1: add past events, plans, comparisons and short texts.')+'</p></div><span class="pill">'+levelDone(level)+' / '+(level==='A1'?12:13)+' complete</span></div><div class="unit-list">';
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
  const official = word.source === 'official';
  const known = official ? OFFICIAL_KNOWN.has(word.key) : state.known.includes(word.id);
  const label = official ? 'Official '+word.level : word.c+' · '+LESSONS[word.lesson].level;
  const lookup = official ? '<a class="word-lookup" href="https://translate.google.com/?sl=zh-TW&amp;tl=en&amp;text='+encodeURIComponent(word.h)+'&amp;op=translate" target="_blank" rel="noreferrer">Look up English meaning ↗</a>' : '';
  const detail = official ? ([word.pos,word.context].filter(Boolean).join(' · ')||'Official TOCFL vocabulary') : word.m;
  return '<article class="word '+(known?'learned':'')+'"><div class="category">'+esc(label)+'</div><div class="hanzi">'+esc(word.h)+'</div><div class="pinyin">'+esc(word.p)+'</div><div class="meaning">'+esc(detail)+'</div>'+lookup+'<div class="word-actions"><button class="icon" data-say="'+esc(word.h)+'" aria-label="Play word">♫</button>'+(official?'<button class="icon" data-official-known="'+esc(word.key)+'" aria-label="Toggle known">'+(known?'✓':'＋')+'</button>':'<button class="icon" data-known="'+word.id+'" aria-label="Toggle known">'+(known?'✓':'＋')+'</button>')+'</div></article>';
}
function currentWordScope() { return document.querySelector('[data-word-scope].active')?.dataset.wordScope || 'course'; }
function filteredWords() {
  const scope=currentWordScope();
  const category=document.querySelector('.filter.active[data-cat]')?.dataset.cat||'All';
  const query=(document.getElementById('wordSearch')?.value||'').toLowerCase().trim();
  const source=scope==='course'?VOCAB:OFFICIAL_VOCAB.filter(word=>word.level===scope);
  return source.filter(word=>(scope!=='course'||category==='All'||word.c===category)&&(word.h+word.p+word.m+word.c+(word.context||'')+(word.pos||'')).toLowerCase().includes(query));
}
function pageWords() {
  const categories = ['All', ...new Set(VOCAB.map(word=>word.c))];
  const count = level => OFFICIAL_VOCAB.filter(word=>word.level===level).length;
  const knownCount = OFFICIAL_VOCAB.filter(word=>OFFICIAL_KNOWN.has(word.key)).length;
  const scopes = [['course','Course deck ('+VOCAB.length+')'],['Novice 1','Novice 1 ('+count('Novice 1')+')'],['Novice 2','Novice 2 ('+count('Novice 2')+')'],['A1','A1 / Level 1 ('+count('A1')+')'],['A2','A2 / Level 2 ('+count('A2')+')']];
  const status = OFFICIAL_VOCAB.length ? 'Loaded '+OFFICIAL_VOCAB.length+' official words in this browser · '+knownCount+' marked known.' : 'Import the official workbook to add its Novice 1, Novice 2, Level 1 (A1) and Level 2 (A2) vocabulary here.';
  return '<div class="page-head"><div><div class="kicker">'+VOCAB.length+' COURSE WORDS · OFFICIAL LIST IMPORT</div><h1>Make the words familiar.</h1><p>Study the lesson deck or import the official TOCFL workbook for level-tagged vocabulary and local recall tracking.</p></div><input class="search" id="wordSearch" placeholder="Search words…"></div><section class="card official-import"><div class="kicker">FULL BAND A VOCABULARY</div><h3>Import the official word list</h3><p>Download the official ZIP, extract it, then select the included Excel workbook. Import needs an internet connection to load the spreadsheet reader. Your file is read in this browser and is never sent to the site. The workbook gives traditional characters, pinyin, topic and part of speech where listed; each imported card links to an English lookup.</p><div class="official-import-actions"><a class="button secondary" href="https://tocfl.edu.tw/tocfl/assets/files/vocabulary/8000zhuyin_202409.zip" target="_blank" rel="noreferrer">Download official workbook ZIP ↗</a><input id="officialVocabFile" type="file" accept=".xlsx,.xls" aria-label="Choose the official TOCFL workbook"><button class="button primary" id="importOfficialVocab">Import levels</button>'+(OFFICIAL_VOCAB.length?'<button class="smallbtn" id="clearOfficialVocab">Remove imported list</button>':'')+'</div><p class="status" id="officialImportStatus">'+esc(status)+'</p></section><div class="word-scope-row">'+scopes.map((item,index)=>'<button class="filter '+(!index?'active':'')+'" data-word-scope="'+esc(item[0])+'">'+esc(item[1])+'</button>').join('')+'</div><div class="filter-row" id="topicFilters">'+categories.map((category,index)=>'<button class="filter '+(!index?'active':'')+'" data-cat="'+esc(category)+'">'+esc(category)+'</button>').join('')+'</div><div class="flash"><div class="flash-copy"><div class="eyebrow">QUICK RECALL</div><h3>One word at a time</h3><p>Say the meaning or topic before you reveal it.</p></div><div class="flash-word" id="flashWord">'+esc(VOCAB[flashIndex]?.h||'你好')+'</div><button class="smallbtn" id="reveal">Reveal</button><button class="smallbtn" id="nextWord">Next →</button></div><div class="word-count" id="wordCount">Showing '+VOCAB.length+' words</div><div class="words" id="wordGrid">'+VOCAB.map(wordCard).join('')+'</div>';
}
function pinyinSoundCard(item) {
  return '<button class="sound-card" data-say="'+esc(item.hanzi)+'"><span>'+esc(item.sound)+'</span><b>'+esc(item.hanzi)+'</b><small>'+esc(item.pinyin)+' · '+esc(item.meaning)+'</small></button>';
}
function pagePinyinExtras() {
  return '<section class="card pinyin-notes"><div class="kicker">HOW TO READ THE CHART</div><h3>Vowels, initials and spelling rules</h3><div class="note-grid"><p><b>Vowel shapes</b><br>a is open; i is a high front vowel; u is high and rounded; ü keeps the tongue position of i while rounding the lips. Tap each final card to hear it in a real word.</p><p><b>Air matters</b><br>b/d/g are unaspirated sounds; p/t/k release a stronger puff of air. Hold your hand near your mouth to feel the difference.</p><p><b>ü spelling</b><br>After j, q and x, the two dots are omitted: ju, qu, xu are pronounced with ü. After n and l, keep them: nǚ, lǜ.</p><p><b>Tone marks</b><br>Mark a or e when present; in ou the mark goes above o. Otherwise mark the last vowel: hǎo, liú, guì. Neutral syllables have no mark.</p><p><b>Changing tones in speech</b><br>Two third tones together usually make the first rise: nǐ hǎo sounds like ní hǎo. 不 is commonly bú before a fourth tone, as in bú shì. 一 often changes tone before another syllable, as in yí ge and yì tiān.</p><p><b>The written i has two sounds</b><br>After zh, ch, sh, r, z, c and s, i is a special vowel sound. Compare shì (是) with yī (衣).</p></div><p class="note">Pinyin uses y and w to spell some syllables with no consonant initial, for example yī (衣), wǔ (五), and yuè (月). The sound and spelling charts are learning guides, not a complete list of every possible syllable.</p></section><section class="card sound-practice"><div><div class="kicker">SOUND RECOGNITION</div><h3>Hear an initial or a final</h3><p>Listen to a sample word, then identify its starting sound or vowel ending. The answer appears after you choose.</p></div><div class="sound-drill-buttons"><button class="button secondary" data-sound-start="initial">Practise initials →</button><button class="button secondary" data-sound-start="final">Practise finals →</button></div><div id="soundQuizArea"></div></section>';
}
function startSoundQuiz(group) {
  const source=group==='initial'?INITIALS:FINALS;
  soundQuiz={group,items:shuffle(source).slice(0,6),index:0,score:0,answered:false};
  logDay();
  renderSoundQuestion();
}
function renderSoundQuestion() {
  const area=document.getElementById('soundQuizArea');
  if(!area||!soundQuiz)return;
  if(soundQuiz.index>=soundQuiz.items.length) {
    area.innerHTML='<div class="tone-result"><b>'+soundQuiz.score+' / '+soundQuiz.items.length+'</b><span>'+ (soundQuiz.group==='initial'?'initials':'finals') +' recognized</span><button class="smallbtn" data-sound-again>Try again</button></div>';
    return;
  }
  const item=soundQuiz.items[soundQuiz.index];
  const source=soundQuiz.group==='initial'?INITIALS:FINALS;
  const options=shuffle([item,...shuffle(source.filter(option=>option.sound!==item.sound)).slice(0,3)]);
  soundQuiz.options=options;
  soundQuiz.answered=false;
  area.innerHTML='<div class="tone-question"><div class="quiz-head"><span>SOUND '+(soundQuiz.index+1)+' OF '+soundQuiz.items.length+'</span><span>Identify the '+(soundQuiz.group==='initial'?'starting sound':'final')+'</span></div><button class="quiz-audio tone-audio" data-sound-play>♫ Play sample word</button><div class="tone-options">'+options.map(option=>'<button class="answer" data-sound-guess="'+esc(option.sound)+'">'+esc(option.sound)+'</button>').join('')+'</div><div class="feedback" id="soundFeedback"></div><div class="quiz-actions"><button id="soundNext" class="button secondary" disabled>Next sound →</button></div></div>';
}
function answerSound(guess) {
  if(!soundQuiz||soundQuiz.answered)return;
  const item=soundQuiz.items[soundQuiz.index];
  soundQuiz.answered=true;
  if(guess===item.sound)soundQuiz.score++;
  document.querySelectorAll('[data-sound-guess]').forEach(button=>{
    button.disabled=true;
    if(button.dataset.soundGuess===item.sound)button.classList.add('correct');
    else if(button.dataset.soundGuess===guess)button.classList.add('incorrect');
  });
  document.getElementById('soundFeedback').textContent=(guess===item.sound?'Correct! ':'Listen again: ')+item.sound+' is heard in '+item.pinyin+' · '+item.hanzi+' (“'+item.meaning+'”).';
  document.getElementById('soundNext').disabled=false;
  document.getElementById('soundNext').textContent=soundQuiz.index===soundQuiz.items.length-1?'See result':'Next sound →';
}
function grammarCard(rule,index) {
  return '<article class="grammar-card"><div class="grammar-card-top"><span class="level-tag '+rule.level.toLowerCase()+'">'+rule.level+'</span><small>'+String(index+1).padStart(2,'0')+'</small></div><h3>'+esc(rule.title)+'</h3><div class="grammar-shape">'+esc(rule.shape)+'</div><p>'+esc(rule.meaning)+'</p><div class="grammar-example"><div><b>'+esc(rule.example)+'</b><small>'+esc(rule.pinyin)+'</small><em>'+esc(rule.translation)+'</em></div><button class="play" data-say="'+esc(rule.example)+'" aria-label="Play grammar example">▶</button></div></article>';
}
function pageGrammar() {
  return '<div class="page-head"><div><div class="kicker">CORE A1–A2 PATTERNS · TRADITIONAL CHINESE</div><h1>Grammar you can use.</h1><p>Learn one pattern, hear its example, then answer the quick checks. The A1 lessons introduce these structures before the A2 patterns build on them.</p></div><span class="pill">'+GRAMMAR.length+' core patterns</span></div><div class="grammar-level-note"><b>A1 → A2</b><span>Start with word order, questions and everyday sentence patterns. Then add past events, comparisons and connectors.</span></div><div class="grammar-grid">'+GRAMMAR.map(grammarCard).join('')+'</div><div class="section-head"><div><div class="kicker">QUICK CHECK</div><h2>Choose the sentence that fits.</h2><p>Each question shows an explanation after you answer.</p></div></div><div class="grammar-quiz-grid">'+GRAMMAR_QUIZ.map((question,index)=>'<article class="grammar-question" data-correct="'+question.answer+'"><div class="quiz-type">'+question.level+' · '+String(index+1).padStart(2,'0')+'</div><h3>'+esc(question.text)+'</h3><div class="answers">'+question.options.map((option,optionIndex)=>'<button class="answer" data-grammar-answer="'+optionIndex+'">'+esc(option)+'</button>').join('')+'</div><div class="feedback" data-grammar-feedback></div></article>').join('')+'</div><p class="note">This is a beginner core grammar guide. TOCFL questions are not based on one fixed grammar list; keep reading and listening widely, and check the official sample tests.</p>';
}
function pagePractice() {
  const toneCards=TONES.map((tone,index)=>'<button class="tone-card" data-say="'+esc(tone.hanzi)+'"><span class="tone-number">'+(index===4?'·':index+1)+'</span><b>'+esc(tone.pinyin)+'</b><strong>'+esc(tone.hanzi)+'</strong><small>'+esc(tone.label)+'</small></button>').join('');
  return '<div class="page-head"><div><div class="kicker">PINYIN · TONES · TAIWAN MANDARIN AUDIO</div><h1>Learn the sounds.<br>Build your ear.</h1><p>Pinyin shows how to pronounce a Chinese syllable. Learn the tone marks, hear examples, then try a short listening drill.</p></div><span class="pill">Hear · repeat · remember</span></div><section class="card pinyin-studio"><div class="pinyin-intro"><div><div class="kicker">THE BUILDING BLOCKS</div><h2>Initial + final + tone</h2><p>A syllable can start with an initial consonant, then a final (the vowel sound), and always carries a tone.</p></div><div class="syllable-model"><b>mā</b><span>m + a + 1st tone</span><small>媽 · mother</small></div></div><div class="tone-explainer"><h3>Five tone patterns</h3><p>The same sound can mean something different with another tone. Tap each card to hear its Chinese example.</p><div class="tone-cards">'+toneCards+'</div></div><div class="pinyin-charts"><details class="chart-details"><summary>Explore the 21 initials (starting sounds)</summary><p>Listen to each sample word and notice its first sound. zh, ch and sh curl the tongue back; z, c and s are made closer to the teeth.</p><div class="sound-grid">'+INITIALS.map(pinyinSoundCard).join('')+'</div></details><details class="chart-details"><summary>Explore common finals (vowel sounds)</summary><p>Tap a sample word to hear the final inside a real syllable. ü is a rounded vowel; after j, q and x it is written u, as in 去 qù.</p><div class="sound-grid">'+FINALS.map(pinyinSoundCard).join('')+'</div></details></div><div class="sandhi-note"><b>Connected speech tip</b><span>Two third tones often change the first sound in speech: 你好 is written nǐ hǎo and commonly sounds like ní hǎo. 不 is written bù, but becomes bú before a fourth tone, as in 不是 bú shì.</span></div><div class="tone-practice"><div><div class="kicker">LISTENING PRACTICE</div><h3>Can you hear the tone?</h3><p>Listen without looking at the character, then choose the tone you heard.</p></div><button class="button secondary" data-tone-start>Start 5-sound tone drill →</button></div><div id="toneQuizArea"></div></section><div class="section-head pinyin-section-head"><div><div class="kicker">SENTENCE SHADOWING</div><h2>Now hear it in a sentence.</h2><p>Listen, read the pinyin, then say the line aloud.</p></div><span class="pill">'+LESSONS.length+' sentence models</span></div><div class="practice-controls"><button class="filter active" data-phrase-level="All">All</button><button class="filter" data-phrase-level="A1">A1</button><button class="filter" data-phrase-level="A2">A2</button></div><div class="two-col"><section class="card"><h3>Sentence shelf</h3><p>Play a line, then repeat it out loud.</p><div class="sentence-list" id="phraseList">'+renderPhrases('All')+'</div></section><section class="card speaking"><h3>Your speaking corner</h3><p>Recording is optional. Press Record only when you are ready.</p><div class="rate"><label>Speech speed</label><input id="rate" type="range" min=".55" max="1" step=".05" value=".78"><span id="rateText">0.78×</span></div><div class="recordbox"><div class="orb" id="orb">◉</div><strong>Listen and shadow</strong><p>Microphone permission is requested only when you press Record.</p><div class="record-actions"><button class="button secondary" id="listenFirst">♫ Listen to first sentence shown</button><button class="smallbtn" id="recordStart">● Record</button><button class="smallbtn" id="recordStop" disabled>Stop</button><button class="smallbtn" id="recordPlay" disabled>▶ Replay</button></div><div class="status" id="audioStatus">Your recording stays in this browser tab.</div></div><p class="note">Audio uses a Chinese (Taiwan) speech voice from your browser or device when available. Voice quality varies. This tool plays speech; it does not grade pronunciation.</p></section></div>';
}
function startToneQuiz() {
  toneQuiz={items:shuffle(TONES),index:0,score:0,answered:false};
  logDay();
  renderToneQuestion();
}
function renderToneQuestion() {
  const area=document.getElementById('toneQuizArea');
  if(!area||!toneQuiz)return;
  if(toneQuiz.index>=toneQuiz.items.length) {
    area.innerHTML='<div class="tone-result"><b>'+toneQuiz.score+' / '+toneQuiz.items.length+'</b><span>tone sounds recognized</span><button class="smallbtn" data-tone-again>Try again</button></div>';
    return;
  }
  toneQuiz.answered=false;
  area.innerHTML='<div class="tone-question"><div class="quiz-head"><span>SOUND '+(toneQuiz.index+1)+' OF '+toneQuiz.items.length+'</span><span>Listen first, then choose</span></div><button class="quiz-audio tone-audio" data-tone-play>♫ Play the sound</button><div class="tone-options">'+TONE_OPTIONS.map((label,index)=>'<button class="answer" data-tone-guess="'+(index+1)+'">'+esc(label)+'</button>').join('')+'</div><div class="feedback" id="toneFeedback"></div><div class="quiz-actions"><button id="toneNext" class="button secondary" disabled>Next sound →</button></div></div>';
}
function answerTone(guess) {
  if(!toneQuiz||toneQuiz.answered)return;
  const item=toneQuiz.items[toneQuiz.index];
  toneQuiz.answered=true;
  if(guess===item.tone)toneQuiz.score++;
  document.querySelectorAll('[data-tone-guess]').forEach(button=>{
    button.disabled=true;
    const value=Number(button.dataset.toneGuess);
    if(value===item.tone)button.classList.add('correct');
    else if(value===guess)button.classList.add('incorrect');
  });
  document.getElementById('toneFeedback').textContent=(guess===item.tone?'Correct! ':'Listen again: ')+item.pinyin+' · '+item.hanzi+' means “'+item.meaning+'.” '+item.guide;
  document.getElementById('toneNext').disabled=false;
  document.getElementById('toneNext').textContent=toneQuiz.index===toneQuiz.items.length-1?'See result':'Next sound →';
}
function renderPhrases(level) {
  return LESSONS.map((lesson,index) => ({lesson,index})).filter(item=>level==='All'||item.lesson.level===level).map(({lesson,index})=>'<div class="sentence"><div><span class="level-tag '+lesson.level.toLowerCase()+'">'+lesson.level+'</span><strong>'+esc(lesson.example)+'</strong><small>'+esc(lesson.pinyin)+'</small><em>'+esc(lesson.meaning)+'</em></div><button class="play" data-say="'+esc(lesson.example)+'" aria-label="Play sentence">▶</button></div>').join('');
}
function pageExam() {
  return `<div class="page-head"><div><div class="kicker">EXAM FORMAT · OFFICIAL MATERIALS · PRACTICE</div><h1>Prepare for both<br>A1 and A2.</h1><p>This course labels its two beginner stages A1 and A2. TOCFL reports these outcomes as Level 1 (入門級) and Level 2 (基礎級). The current computer adaptive test can present questions from across levels and estimates your ability as you answer.</p></div><span class="pill">Original practice · not official items</span></div>
  <section class="card exam-format"><div><h3>Know the current test format</h3><p>TOCFL's computer adaptive Listening and Reading test is not restricted to one band. It selects items based on your answers, so the question difficulty can change during the test.</p><table class="table"><tr><th>CAT SECTION</th><th>APPROX. QUESTIONS</th><th>TIME</th></tr><tr><td>Listening 聽力</td><td>35</td><td>50 minutes</td></tr><tr><td>Reading 閱讀</td><td>35</td><td>60 minutes</td></tr></table><div class="callout"><b>Listening:</b> the CAT gives about 10 seconds to answer each item. <b>Reading:</b> pace yourself and answer at least 25 items; too few answered can trigger a score adjustment. Check official guidance for the test type and location you book.</div><div class="score-guidance"><h4>Official CAT certificate thresholds</h4><table class="table"><tr><th>OUTCOME</th><th>TOTAL</th><th>LISTENING MIN.</th><th>READING MIN.</th></tr><tr><td>Level 1</td><td>710</td><td>335</td><td>340</td></tr><tr><td>Level 2</td><td>885</td><td>395</td><td>415</td></tr></table><p>These are official scaled CAT certificate scores. The site’s quiz counts correct answers and cannot convert them to TOCFL scores or predict a result. Check official single-section cutoffs separately.</p></div></div><div class="official-links"><h3>Official preparation</h3><a href="https://tocfl.edu.tw/tocfl/index.php/teach/test/page/1" target="_blank" rel="noreferrer">Free sample tests and audio ↗</a><a href="https://tocfl.edu.tw/tocfl/index.php/teach/download" target="_blank" rel="noreferrer">Official vocabulary list and downloads ↗</a><a href="https://tocfl.edu.tw/tocfl/index.php/test/cat/list/2" target="_blank" rel="noreferrer">Current CAT format and question types ↗</a><a href="https://tocfl.edu.tw/tocfl/index.php/sign_up/rule/list/1" target="_blank" rel="noreferrer">Current scoring and certificate rules ↗</a></div></section>
  <section class="card study-guidance"><h3>What this study room covers</h3><div class="coverage-grid"><p><b>Listening</b><br>Single utterances, questions and replies, short conversations, announcements, and mini passages with browser audio.</p><p><b>Reading</b><br>Sentence meaning, notices, messages, menus, timetables, paragraph comprehension, cloze, and word choice in context.</p><p><b>Language foundations</b><br>Traditional characters, official level vocabulary import, 22 grammar patterns, pinyin initials and finals, tones, and sentence shadowing.</p></div><p>The included set has 35 original listening and 35 original reading items with 50 and 60 minute timers. It is fixed practice, not the adaptive CAT; use the official sample tests as well.</p></section>
  <div class="section-head"><div><h2>Choose your practice</h2><p>Short drills give explanations right away. The timed set saves feedback until the end.</p></div></div><div class="practice-modes"><article class="mode-card"><span class="level-tag a1">A1</span><h3>A1 skills drill</h3><p>10 mixed listening and reading questions with immediate explanations.</p><button class="button secondary" data-mode="A1">Start A1 drill →</button></article><article class="mode-card"><span class="level-tag a2">A2</span><h3>A2 skills drill</h3><p>10 mixed questions on plans, past events, comparisons, messages and more.</p><button class="button secondary" data-mode="A2">Start A2 drill →</button></article><article class="mode-card featured-mode"><span class="level-tag">35 + 35</span><h3>Timed practice set</h3><p>35 listening + 35 reading questions. 50 and 60 minutes for this fixed practice set.</p><button class="button primary" data-mode="full">Start timed practice →</button></article></div><section class="card study-guidance"><h3>Use a readiness checklist</h3><ul><li>Finish the A1 units, then the A2 units, and use the Grammar guide and Pinyin &amp; sounds sections.</li><li>Import the official vocabulary workbook in Word Cards, then mark words known as you learn them.</li><li>Take the official sample tests with their audio, then practise under timed conditions.</li><li>Review wrong answers and replay audio until you understand the key detail.</li></ul><p>Practice scores here are raw results on original questions. They are not official scaled scores, certificate thresholds or a guarantee of passing.</p></section><div id="quizArea"></div>`;
}
function pageProgress() {
  const fullScore = state.bestFull ? state.bestFull+'/70' : '—';
  return '<div class="page-head"><div><div class="kicker">YOUR JOURNEY, SAVED ON THIS DEVICE</div><h1>Small steps add up.</h1><p>Lesson progress, known words and practice records stay in this browser.</p></div><button class="button secondary" data-go="lessons">Continue learning →</button></div><div class="two-col"><section class="card"><h3>Course progress</h3><div class="result-score">'+progressPercent()+'%</div><div class="track"><i style="width:'+progressPercent()+'%"></i></div><div class="progress-level"><b>A1 · '+levelDone('A1')+'/12</b><div class="track"><i style="width:'+(levelDone('A1')/12*100)+'%"></i></div></div><div class="progress-level"><b>A2 · '+levelDone('A2')+'/13</b><div class="track"><i style="width:'+(levelDone('A2')/13*100)+'%"></i></div></div>'+LESSONS.map((lesson,index)=>'<p class="progress-row">'+(state.done.includes(index)?'✓':'○')+'　<span>'+lesson.level+' · '+esc(lesson.title)+'</span></p>').join('')+'</section><section class="card"><h3>Study snapshot</h3><p>'+state.known.length+' core words marked known · '+state.days.length+' study days</p><div class="score-grid"><div><b>A1 drill</b><strong>'+(state.bestA1||'—')+'/10</strong></div><div><b>A2 drill</b><strong>'+(state.bestA2||'—')+'/10</strong></div><div><b>Timed practice set</b><strong>'+fullScore+'</strong></div></div><p>These are practice results, not official scaled scores.</p><button class="clear" id="clearProgress">Reset saved progress</button></section></div>';
}
function draw() {
  const view = state.view || 'home';
  const pages = {home:pageHome,lessons:pageLessons,grammar:pageGrammar,words:pageWords,practice:pagePractice,exam:pageExam,progress:pageProgress};
  document.getElementById('appMain').innerHTML = (pages[view] || pageHome)();
  if(view==='practice') {
    const summary=document.querySelector('.pinyin-charts .chart-details:nth-child(2) summary');
    if(summary)summary.textContent='Explore all 36 core finals (vowel sounds)';
    const chart=document.querySelector('.pinyin-charts');
    if(chart)chart.insertAdjacentHTML('afterend',pagePinyinExtras());
  }
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
  quiz = {mode,questions:selected,index:0,answers:[],answered:false,deadline:mode==='full'?Date.now()+50*60*1000:null,phase:'Listening'};
  logDay();
  renderQuestion();
  if (mode==='full') quizClock=setInterval(tickClock,1000);
}
function tickClock() {
  if (!quiz || quiz.mode!=='full') return;
  const item = quiz.questions[quiz.index];
  if (!item) return;
  const desired = item.section;
  if (desired !== quiz.phase) { quiz.phase=desired; quiz.deadline=Date.now()+(desired==='Listening'?50:60)*60*1000; }
  const remaining = Math.max(0,Math.ceil((quiz.deadline-Date.now())/1000));
  const timer = document.getElementById('examTimer');
  if (timer) timer.textContent = String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
  if (remaining === 0) {
    if (quiz.phase==='Listening') {
      while (quiz.index < quiz.questions.length && quiz.questions[quiz.index].section==='Listening') { if (!(quiz.index in quiz.answers)) quiz.answers[quiz.index]=null; quiz.index++; }
      if (quiz.index < quiz.questions.length) { quiz.phase='Reading'; quiz.deadline=Date.now()+60*60*1000; renderQuestion(); }
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
  const title = timed ? 'TIMED PRACTICE SET' : question.level+' DRILL';
  area.innerHTML = '<div class="quiz"><div class="quiz-head"><span>QUESTION '+(quiz.index+1)+' OF '+quiz.questions.length+'</span><span>'+title+(timed?' · '+question.section.toUpperCase()+' <b id="examTimer">'+(question.section==='Listening'?'50:00':'60:00')+'</b>':'')+'</span></div><div class="quiz-card">'+questionMeta(question)+'<div class="answers">'+question.options.map((option,index)=>'<button class="answer" data-answer="'+index+'" '+(quiz.answered?'disabled':'')+'>'+esc(option)+'</button>').join('')+'</div><div class="feedback" id="feedback"></div><div class="quiz-actions">'+(timed?'<button class="smallbtn" id="skipQuestion">Skip</button>':'')+'<button id="quizNext" class="button secondary" '+(quiz.answered?'':'disabled')+'>'+(quiz.index===quiz.questions.length-1?'Finish':'Next →')+'</button></div></div></div>';
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
    quiz.deadline=Date.now()+(quiz.questions[quiz.index].section==='Listening'?50:60)*60*1000;
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
    ? '<div class="result-breakdown"><div><b>Listening</b><strong>'+result.bySection.Listening.right+'/'+result.bySection.Listening.total+'</strong></div><div><b>Reading</b><strong>'+result.bySection.Reading.right+'/'+result.bySection.Reading.total+'</strong></div><div><b>A1 items</b><strong>'+result.A1+'/'+quiz.questions.filter(q=>q.level==='A1').length+'</strong></div><div><b>A2 items</b><strong>'+result.A2+'/'+quiz.questions.filter(q=>q.level==='A2').length+'</strong></div></div>'
    : '<p>'+quiz.mode+' mixed drill · '+result.correct+' correct out of '+quiz.questions.length+'.</p>';
  const review=missed.length?'<details class="review-list"><summary>Review '+missed.length+' missed or skipped question'+(missed.length===1?'':'s')+'</summary>'+missed.map(({question,index})=>'<article><b>'+question.level+' · '+question.section+' · '+esc(question.type)+'</b><p>'+esc(question.ask)+'</p><p><strong>Answer: '+esc(question.options[question.answer])+'</strong><br>'+esc(question.why)+'</p></article>').join('')+'</details>':'<p>Excellent recall on this set. Continue with the official sample materials for another check.</p>';
  const modeLabel=quiz.mode==='full'?'TIMED PRACTICE SET COMPLETE':quiz.mode+' DRILL COMPLETE';
  document.getElementById('quizArea').innerHTML='<div class="quiz"><div class="quiz-card result"><div class="kicker">'+modeLabel+'</div><div class="result-score">'+result.correct+' / '+quiz.questions.length+'</div>'+summary+'<p>Raw practice result only. This is not an official scaled score or pass prediction.</p>'+review+'<div class="quiz-actions"><button class="button secondary" data-mode="'+esc(quiz.mode)+'">Try this set again</button><button class="smallbtn" data-restart>Choose another practice</button></div></div></div>';
  quiz.completed=true;
  save();
}
function filterWords() {
  const scope=currentWordScope();
  const category=document.querySelector('.filter.active[data-cat]')?.dataset.cat||'All';
  const filtered=filteredWords();
  const topicFilters=document.getElementById('topicFilters');
  if(topicFilters)topicFilters.hidden=scope!=='course';
  const grid=document.getElementById('wordGrid');
  if (grid) grid.innerHTML=filtered.map(wordCard).join('')||'<p class="empty-state">No matching words. Try another search.</p>';
  const count=document.getElementById('wordCount');
  if(count)count.textContent='Showing '+filtered.length+' words'+(scope==='course'&&category!=='All'?' in '+category:'');
  const flash=document.getElementById('flashWord');
  if(flash)flash.textContent=filtered[flashIndex]?.h||'No matching words';
}
async function importOfficialVocabulary() {
  const file=document.getElementById('officialVocabFile')?.files?.[0];
  const status=document.getElementById('officialImportStatus');
  if(!file){if(status)status.textContent='Choose the extracted Excel workbook first.';return;}
  if(status)status.textContent='Reading the workbook in this browser…';
  try {
    const XLSX=await import('https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs');
    const workbook=XLSX.read(await file.arrayBuffer());
    const specs=[{match:/novice\s*1/i,level:'Novice 1'},{match:/novice\s*2/i,level:'Novice 2'},{match:/level\s*1/i,level:'A1'},{match:/level\s*2/i,level:'A2'}];
    const imported=new Map();
    const foundLevels=new Set();
    for(const name of workbook.SheetNames){
      const spec=specs.find(item=>item.match.test(name));
      if(!spec)continue;
      foundLevels.add(spec.level);
      const rows=XLSX.utils.sheet_to_json(workbook.Sheets[name],{header:1,raw:false,defval:''});
      rows.slice(1).forEach((row,index)=>{
        const context=String(row[0]||'').trim(),h=String(row[1]||'').trim();
        const p=String(row[2]||'').trim().replace(/ă/g,'ǎ').replace(/ĕ/g,'ě').replace(/ĭ/g,'ǐ').replace(/ŏ/g,'ǒ').replace(/ŭ/g,'ǔ');
        const pos=String(row[3]||'').trim();
        if(h&&p){const key=spec.level+'|'+h;if(!imported.has(key))imported.set(key,{source:'official',key,level:spec.level,h,p,context,pos,c:spec.level,m:''});else{const prior=imported.get(key);prior.context=[...new Set([prior.context,context].filter(Boolean))].join(' · ');prior.pos=[...new Set([prior.pos,pos].filter(Boolean))].join(' / ');if(prior.p!==p)prior.p=[...new Set([prior.p,p])].join(' · ');}}
      });
    }
    if(!['Novice 1','Novice 2','A1','A2'].every(level=>foundLevels.has(level))||imported.size<100)throw new Error('The selected workbook is missing a required level sheet. Extract the ZIP and choose the 20240923 Excel workbook.');
    OFFICIAL_VOCAB=[...imported.values()];
    localStorage.setItem('tocflOfficialWords',JSON.stringify(OFFICIAL_VOCAB));
    const totals=['Novice 1','Novice 2','A1','A2'].map(level=>level+': '+OFFICIAL_VOCAB.filter(word=>word.level===level).length).join(' · ');
    if(status)status.textContent='Imported '+OFFICIAL_VOCAB.length+' words. '+totals+' · Stored on this device.';
    document.querySelectorAll('[data-word-scope]').forEach(button=>button.classList.toggle('active',button.dataset.wordScope==='A1'));
    flashIndex=0;
    filterWords();
    logDay();
  } catch(error) {
    if(status)status.textContent=error.message||'The workbook could not be read. Check your internet connection and try again.';
  }
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
  let target=event.target.closest('[data-sound-start]');
  if(target){startSoundQuiz(target.dataset.soundStart);return;}
  target=event.target.closest('[data-sound-play]');
  if(target&&soundQuiz){speak(soundQuiz.items[soundQuiz.index].hanzi);return;}
  target=event.target.closest('[data-sound-guess]');
  if(target){answerSound(target.dataset.soundGuess);return;}
  target=event.target.closest('#soundNext');
  if(target&&soundQuiz){soundQuiz.index++;renderSoundQuestion();return;}
  target=event.target.closest('[data-sound-again]');
  if(target&&soundQuiz){startSoundQuiz(soundQuiz.group);return;}
  target=event.target.closest('[data-grammar-answer]');
  if(target){
    const card=target.closest('.grammar-question');
    const correct=Number(card.dataset.correct);
    const selected=Number(target.dataset.grammarAnswer);
    card.querySelectorAll('[data-grammar-answer]').forEach(button=>{
      button.disabled=true;
      const value=Number(button.dataset.grammarAnswer);
      if(value===correct)button.classList.add('correct');
      else if(value===selected)button.classList.add('incorrect');
    });
    const questionIndex=Number(card.querySelector('.quiz-type').textContent.match(/\d+$/)?.[0])-1;
    card.querySelector('[data-grammar-feedback]').textContent=(selected===correct?'Correct! ':'Review this pattern. ')+GRAMMAR_QUIZ[questionIndex].why;
    logDay();
    return;
  }
  target=event.target.closest('[data-tone-start]');
  if(target){startToneQuiz();return;}
  target=event.target.closest('[data-tone-play]');
  if(target){if(toneQuiz)speak(toneQuiz.items[toneQuiz.index].hanzi);return;}
  target=event.target.closest('[data-tone-guess]');
  if(target){answerTone(Number(target.dataset.toneGuess));return;}
  target=event.target.closest('#toneNext');
  if(target&&toneQuiz){toneQuiz.index++;renderToneQuestion();return;}
  target=event.target.closest('[data-tone-again]');
  if(target){startToneQuiz();return;}
  target=event.target.closest('[data-view]');
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
  target=event.target.closest('[data-official-known]');
  if(target){const key=target.dataset.officialKnown;if(OFFICIAL_KNOWN.has(key))OFFICIAL_KNOWN.delete(key);else OFFICIAL_KNOWN.add(key);localStorage.setItem('tocflOfficialKnown',JSON.stringify([...OFFICIAL_KNOWN]));logDay();filterWords();return;}
  target=event.target.closest('#importOfficialVocab');
  if(target){await importOfficialVocabulary();return;}
  target=event.target.closest('#clearOfficialVocab');
  if(target&&confirm('Remove the imported official word list and its recall marks from this browser?')){OFFICIAL_VOCAB=[];OFFICIAL_KNOWN.clear();localStorage.removeItem('tocflOfficialWords');localStorage.removeItem('tocflOfficialKnown');draw();return;}
  target=event.target.closest('[data-word-scope]');
  if(target){document.querySelectorAll('[data-word-scope]').forEach(button=>button.classList.toggle('active',button===target));document.querySelectorAll('[data-cat]').forEach((button,index)=>button.classList.toggle('active',index===0));flashIndex=0;filterWords();return;}
  target=event.target.closest('[data-cat]');
  if(target){document.querySelectorAll('[data-cat]').forEach(button=>button.classList.toggle('active',button===target));filterWords();return;}
  target=event.target.closest('[data-phrase-level]');
  if(target){document.querySelectorAll('[data-phrase-level]').forEach(button=>button.classList.toggle('active',button===target));const list=document.getElementById('phraseList');if(list)list.innerHTML=renderPhrases(target.dataset.phraseLevel);return;}
  target=event.target.closest('[data-mode]');
  if(target){startQuiz(target.dataset.mode);return;}
  if(event.target.closest('[data-answer]')){chooseAnswer(Number(event.target.closest('[data-answer]').dataset.answer));return;}
  if(event.target.closest('#quizNext')){nextQuestion();return;}
  if(event.target.closest('#skipQuestion')){if(quiz){if (!(quiz.index in quiz.answers)) quiz.answers[quiz.index]=null;nextQuestion();}return;}
  if(event.target.closest('#reveal')){const word=filteredWords()[flashIndex];if(word)document.getElementById('flashWord').innerHTML=esc(word.h)+'<small>'+esc(word.p)+' · '+esc(word.source==='official'?([word.pos,word.context].filter(Boolean).join(' · ')||'Official TOCFL vocabulary'):word.m)+'</small>';return;}
  if(event.target.closest('#nextWord')){const deck=filteredWords();if(deck.length){flashIndex=(flashIndex+1)%deck.length;document.getElementById('flashWord').textContent=deck[flashIndex].h;}return;}
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

