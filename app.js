// Saath: a voice-first helper for paperwork after a family member's death.
// Runs fully in the browser (Web Speech API), so it needs no secret keys.

const $ = (id) => document.getElementById(id);
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const QUESTIONS = ["bank", "insurance", "pension"];

const state = freshState();
let recognizer = null;
let speechId = 0;

function freshState() {
  return {
    lang: "en", phase: "language", qIndex: 0, answers: {},
    steps: [], stepIndex: 0, fails: 0, slow: false,
  };
}

const t = () => TEXT[state.lang];
const setHint = (text) => { $("hint").textContent = text; };

// Whole-word match, so "haan ji" or "bank ho gaya" still work in mixed speech.
function matches(transcript, list) {
  const clean = transcript.toLowerCase().replace(/[.,!?।]/g, " ").replace(/\s+/g, " ").trim();
  const padded = " " + clean + " ";
  return list.some((w) => padded.includes(" " + w + " "));
}

// ---------- Speaking ----------

function say(text, thenListen = false) {
  const id = ++speechId;
  $("said").textContent = text;
  const done = () => { if (id === speechId && thenListen) listen(); };
  if (!("speechSynthesis" in window)) return done();
  speechSynthesis.cancel();
  // Some PCs have no voice for a language (often Bengali): say so, the text stays on screen.
  const wanted = LANGS[state.lang].voice.slice(0, 2);
  const voices = speechSynthesis.getVoices();
  if (voices.length && !voices.some((v) => v.lang.toLowerCase().startsWith(wanted))) {
    setHint(t().noVoice);
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANGS[state.lang].voice;
  u.rate = state.slow ? 0.65 : 0.9;
  u.onend = done;
  u.onerror = done;
  speechSynthesis.speak(u);
}

// Stops talking and listening, for example when a button is tapped.
function interrupt() {
  speechId++;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  stopListening();
}

// ---------- Listening ----------

function setListening(on) {
  $("mic").classList.toggle("on", on);
}

function stopListening() {
  if (!recognizer) return;
  recognizer.onend = recognizer.onerror = recognizer.onresult = null;
  try { recognizer.abort(); } catch (e) { /* already stopped */ }
  recognizer = null;
  setListening(false);
}

function listen() {
  stopListening();
  if (!SR) { setHint(t().micIssue); return; }
  const rec = new SR();
  rec.lang = LANGS[state.lang].voice;
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  let handled = false;

  rec.onstart = () => setListening(true);
  rec.onresult = (e) => {
    handled = true;
    // Try every alternative the recognizer offers; act only on a clear keyword match.
    const heard = Array.from(e.results[0]).map((a) => a.transcript);
    $("heard").textContent = `${t().heard} ${heard[0]}`;
    for (const text of heard) {
      const action = interpret(text);
      if (action) return action();
    }
    unclear();
  };
  rec.onerror = (e) => {
    handled = true;
    if (e.error === "aborted") return;
    if (e.error === "not-allowed" || e.error === "service-not-allowed") return setHint(t().micIssue);
    if (e.error === "no-speech") return silence();
    noisy();
  };
  rec.onend = () => {
    setListening(false);
    if (!handled) silence();
  };
  recognizer = rec;
  try { rec.start(); } catch (e) { setHint(t().micIssue); }
}

// ---------- When things go wrong ----------

function silence() {
  state.fails++;
  if (state.fails >= 3) return setHint(t().hint);
  say(t().still, true);
}

function noisy() {
  state.fails++;
  setHint(t().noisy);
  say(t().noisy, state.fails < 3);
}

function unclear() {
  state.fails++;
  const x = t();
  const lines = {
    language: x.retryLang || TEXT.en.retryLang,
    questions: x.retry,
    steps: x.retryCmd,
  };
  setHint(state.fails >= 2 ? x.hint : "");
  say(lines[state.phase], state.fails < 3);
}

// ---------- Conversation flow ----------

// Returns the action for what was said, or null when nothing matches (never guess).
function interpret(text) {
  const p = state.phase;
  if (p === "language") {
    const code = Object.keys(LANG_WORDS).find((c) => matches(text, LANG_WORDS[c]));
    return code ? () => chooseLanguage(code) : null;
  }
  if (p === "questions") {
    if (matches(text, WORDS.yes)) return () => answer(true);
    if (matches(text, WORDS.no)) return () => answer(false);
  }
  if (p === "steps") {
    if (matches(text, WORDS.slow)) return () => { state.slow = !state.slow; go(0); };
    if (matches(text, WORDS.back)) return () => go(-1);
    if (matches(text, WORDS.repeat)) return () => go(0);
    if (matches(text, WORDS.next)) return () => go(1);
  }
  return null;
}

function chooseLanguage(code) {
  state.lang = code;
  state.phase = "questions";
  state.qIndex = 0;
  state.answers = {};
  state.fails = 0;
  setHint(t().hint);
  render();
  say(`${t().greet} ${t().ask[QUESTIONS[0]]}`, true);
}

function answer(value) {
  state.fails = 0;
  state.answers[QUESTIONS[state.qIndex]] = value;
  state.qIndex++;
  if (state.qIndex < QUESTIONS.length) {
    render();
    return say(t().ask[QUESTIONS[state.qIndex]], true);
  }
  // The death certificate always comes first, then only what applies.
  state.steps = ["cert", ...QUESTIONS.filter((q) => state.answers[q])];
  state.stepIndex = 0;
  state.phase = "steps";
  readStep(t().plan(state.steps.length));
}

function readStep(prefix = "") {
  const step = STEPS[state.steps[state.stepIndex]];
  const n = state.stepIndex + 1;
  render();
  say(`${prefix} ${t().step} ${n}. ${step.title[state.lang]}. ${step.text[state.lang]}`.trim(), true);
}

// delta: 1 = next, -1 = back, 0 = repeat
function go(delta) {
  state.fails = 0;
  const target = state.stepIndex + delta;
  if (target < 0) return readStep();
  if (target >= state.steps.length) {
    state.phase = "finished";
    render();
    return say(t().done);
  }
  state.stepIndex = target;
  readStep();
}

function restart() {
  interrupt();
  Object.assign(state, freshState());
  setHint("");
  $("heard").textContent = "";
  render();
  $("said").textContent = "Choose a language, or tap the microphone.";
}

// ---------- Screen ----------

function render() {
  const p = state.phase;
  const x = t();
  $("langs").hidden = p !== "language";
  $("card").hidden = p !== "steps";
  $("questionBtns").hidden = p !== "questions";
  $("stepBtns").hidden = p !== "steps";
  $("restart").hidden = p !== "finished";

  for (const id of ["yes", "no", "next", "repeat", "back", "restart"]) {
    $(id).textContent = x[id];
  }
  $("slowbtn").textContent = x.slow;
  $("slowbtn").setAttribute("aria-pressed", String(state.slow));
  $("disclaimer").textContent = x.disclaimer;

  if (p === "steps") {
    const step = STEPS[state.steps[state.stepIndex]];
    const total = state.steps.length;
    $("progress").textContent = `${x.step} ${state.stepIndex + 1} / ${total}`;
    $("barfill").style.width = `${((state.stepIndex + 1) / total) * 100}%`;
    $("title").textContent = step.title[state.lang];
    $("body").textContent = step.text[state.lang];
  }
}

// ---------- Wiring ----------

document.querySelectorAll("[data-lang]").forEach((b) => {
  b.onclick = () => { interrupt(); chooseLanguage(b.dataset.lang); };
});
$("yes").onclick = () => { interrupt(); answer(true); };
$("no").onclick = () => { interrupt(); answer(false); };
$("next").onclick = () => { interrupt(); go(1); };
$("back").onclick = () => { interrupt(); go(-1); };
$("repeat").onclick = () => { interrupt(); go(0); };
$("restart").onclick = restart;
$("slowbtn").onclick = () => {
  state.slow = !state.slow;
  render();
  if (state.phase === "steps") { interrupt(); go(0); }
};
// Tapping the microphone also stops the voice, so users can talk over it.
$("mic").onclick = () => {
  interrupt();
  state.fails = 0;
  if (state.phase === "language") say(TEXT.en.chooseLang, true);
  else listen();
};

render();
if (!SR) setHint(t().micIssue);
