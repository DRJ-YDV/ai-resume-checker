// AI Resume Checker - client-side demo logic
// Clean, commented, beginner-friendly JavaScript

// DOM elements
const fileInput = document.getElementById('fileInput');
const resumeTextEl = document.getElementById('resumeText');
const jobDescEl = document.getElementById('jobDesc');
const analyzeBtn = document.getElementById('analyzeBtn');
const ctaAnalyze = document.getElementById('ctaAnalyze');
const sampleBtn = document.getElementById('sampleBtn');
const darkToggle = document.getElementById('darkToggle');

const scoreValue = document.getElementById('scoreValue');
const skillValue = document.getElementById('skillValue');
const scoreBar = document.getElementById('scoreBar');
const skillBar = document.getElementById('skillBar');
const missingKeywordsEl = document.getElementById('missingKeywords');
const suggestionsEl = document.getElementById('suggestions');
const atsTipsEl = document.getElementById('atsTips');
const loader = document.getElementById('loader');

// Sample resume text for demo
const SAMPLE_RESUME = `John Doe\nEmail: john.doe@example.com | (555) 555-5555\n\nExperienced Software Engineer with 6+ years building web applications using JavaScript, React, Node.js, and REST APIs. Skilled in cloud platforms (AWS), CI/CD, automated testing, and team leadership. Delivered scalable services and improved performance by 30% through optimization and monitoring.`;

// Basic stopwords list to filter common words from job description
const STOPWORDS = new Set(['and','the','a','an','to','of','for','with','in','on','or','by','is','are','as','be','at','from']);

// Helpers
function showLoader(show=true){ loader.classList.toggle('hidden', !show); }

function sanitizeText(s){ return (s||'').replace(/[\n\r]+/g,' ').replace(/[^\w\s]/g,' ').toLowerCase(); }

function extractKeywords(text){
  const words = sanitizeText(text).split(/\s+/).filter(Boolean);
  const freqs = {};
  for(const w of words){
    if(w.length<3) continue;
    if(STOPWORDS.has(w)) continue;
    freqs[w] = (freqs[w]||0)+1;
  }
  // return top N frequent words as keywords
  return Object.keys(freqs).sort((a,b)=>freqs[b]-freqs[a]).slice(0,30);
}

// Fake AI evaluation function — replace with real API integration later
function evaluateResume(resumeText, jobDesc){
  const jdKeywords = extractKeywords(jobDesc);
  const resumeSan = sanitizeText(resumeText);

  const matched = [];
  const missing = [];
  for(const k of jdKeywords){
    if(resumeSan.includes(k)) matched.push(k);
    else missing.push(k);
  }

  const skillsMatch = jdKeywords.length? Math.round(100 * matched.length / jdKeywords.length) : 0;

  // Simple heuristics for resume quality
  let completeness = 0;
  if(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(resumeText)) completeness += 0.4; // has email
  if(/\b(\d{1,2}\+?\s*years|\d+\s+years|experienced|senior)\b/i.test(resumeText)) completeness += 0.3; // experience indicator
  if(/\b(responsible|led|managed|developed|designed|implemented)\b/i.test(resumeText)) completeness += 0.3; // action verbs

  const resumeScore = Math.min(100, Math.round(skillsMatch*0.7 + completeness*100*0.3));

  // Suggestions and ATS tips (simple, friendly messages)
  const suggestions = [];
  if(missing.length>0) suggestions.push('Tailor your resume by including keywords from the job description.');
  if(!/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText) && !/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(resumeText)) suggestions.push('Add contact information (email, phone).');
  if(!/\b(\d+%|\bimproved\b|\breduced\b|\bincreased\b)\b/i.test(resumeText)) suggestions.push('Add measurable achievements (metrics, % improvements).');
  if(suggestions.length===0) suggestions.push('Looks good — consider quantifying achievements for stronger impact.');

  const atsTips = [
    'Use standard headings (Experience, Education, Skills).',
    'Avoid images and complex tables — prefer plain text or simple layouts.',
    'Include important keywords from the job description.',
  ];

  return {
    score: resumeScore,
    skillsMatch,
    missing,
    suggestions,
    atsTips,
  };
}

// Render results into DOM
function renderResults(res){
  scoreValue.textContent = res.score;
  skillValue.textContent = res.skillsMatch + '%';
  scoreBar.style.width = res.score + '%';
  skillBar.style.width = res.skillsMatch + '%';

  missingKeywordsEl.innerHTML = '';
  if(res.missing.length===0){
    const li = document.createElement('li'); li.textContent = 'No missing keywords — great match!'; missingKeywordsEl.appendChild(li);
  } else {
    for(const k of res.missing){ const li=document.createElement('li'); li.textContent = k; missingKeywordsEl.appendChild(li);} 
  }

  suggestionsEl.innerHTML = '';
  for(const s of res.suggestions){ const li=document.createElement('li'); li.textContent = s; suggestionsEl.appendChild(li); }

  atsTipsEl.innerHTML = '';
  for(const t of res.atsTips){ const li=document.createElement('li'); li.textContent = t; atsTipsEl.appendChild(li); }
}

// Input validation and analyze flow
async function analyze(){
  const resumeText = resumeTextEl.value.trim();
  const jobDesc = jobDescEl.value.trim();

  if(!resumeText && !fileInput.files.length){
    alert('Please upload a resume PDF or paste your resume text.');
    return;
  }
  if(!jobDesc){ if(!confirm('No job description provided — continue with generic analysis?')) return; }

  // Show loader, simulate network/AI processing
  showLoader(true);
  await new Promise(r=>setTimeout(r,300));

  // For this demo, if a file was uploaded but no text pasted, we simulate parsing
  let textContent = resumeText;
  if(!textContent && fileInput.files.length){
    const f = fileInput.files[0];
    if(f.name.toLowerCase().endsWith('.txt')){
      textContent = await f.text();
    } else {
      // Try server-side parsing endpoint; fallback to simulation when unavailable
      try{
        const fd = new FormData(); fd.append('file', f);
        const controller = new AbortController();
        const timeout = setTimeout(()=>controller.abort(), 6000);
        const resp = await fetch('/api/parse-file', { method: 'POST', body: fd, signal: controller.signal });
        clearTimeout(timeout);
        if(resp.ok){ const json = await resp.json(); textContent = json.text || (SAMPLE_RESUME); }
        else { textContent = `${f.name} (parsed fallback)\n` + SAMPLE_RESUME; }
      }catch(e){
        textContent = `${f.name} (parsed fallback)\n` + SAMPLE_RESUME;
      }
    }
  }

  // Try calling backend API first; fall back to client-side evaluation if unavailable
  let res = null;
  try{
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 2500);
    const resp = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: textContent||SAMPLE_RESUME, jobDescription: jobDesc||'' }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if(resp.ok){ res = await resp.json(); }
  }catch(e){ /* ignore and fallback */ }

  if(!res) {
    // fallback local evaluation
    res = evaluateResume(textContent||SAMPLE_RESUME, jobDesc||'');
  }

  // small delay for polish
  await new Promise(r=>setTimeout(r,400));
  showLoader(false);
  renderResults(res);
}

// Event bindings
analyzeBtn.addEventListener('click', analyze);
ctaAnalyze.addEventListener('click', ()=>{ window.scrollTo({top:200, behavior:'smooth'}); document.getElementById('jobDesc').focus(); });
sampleBtn.addEventListener('click', ()=>{ resumeTextEl.value = SAMPLE_RESUME; jobDescEl.value = 'Looking for a Software Engineer with JavaScript, React, Node.js, AWS, REST APIs, testing, and CI/CD.'; });

function updateDarkToggleUI(isDark){
  try{
    darkToggle.setAttribute('aria-pressed', !!isDark);
    const icon = document.getElementById('darkIcon');
    const label = document.getElementById('darkLabel');
    if(icon) icon.textContent = isDark ? '🌞' : '🌙';
    if(label) label.textContent = isDark ? 'Light' : 'Dark';
  }catch(e){}
}

darkToggle.addEventListener('click', ()=>{
  const isDark = document.body.classList.toggle('dark');
  try{ localStorage.setItem('prefersDark', isDark ? '1' : '0'); }catch(e){}
  updateDarkToggleUI(isDark);
});

// Basic input validation feedback
resumeTextEl.addEventListener('input', ()=>{
  if(resumeTextEl.value.length>10000) alert('Resume text looks quite long — consider trimming to the most relevant content.');
});

// Accessibility: trigger analyze on Ctrl+Enter inside job description
jobDescEl.addEventListener('keydown', (e)=>{ if(e.ctrlKey && e.key === 'Enter') analyze(); });

// Initialize with sample content for demo friendliness
document.addEventListener('DOMContentLoaded', ()=>{
  resumeTextEl.value = '';
  jobDescEl.value = '';
  try{
    const saved = localStorage.getItem('prefersDark');
    if(saved === '1') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }catch(e){}
  // Reflect current state in the toggle UI
  updateDarkToggleUI(document.body.classList.contains('dark'));
});
