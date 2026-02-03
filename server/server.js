const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve frontend static files from parent folder
app.use(express.static(path.join(__dirname, '..')));

// Multer memory storage for simple file uploads
const upload = multer({ storage: multer.memoryStorage() });

const STOPWORDS = new Set(['and','the','a','an','to','of','for','with','in','on','or','by','is','are','as','be','at','from']);

function sanitizeText(s){ return (s||'').replace(/[\n\r]+/g,' ').replace(/[^\w\s]/g,' ').toLowerCase(); }
function extractKeywords(text){
  const words = sanitizeText(text).split(/\s+/).filter(Boolean);
  const freqs = {};
  for(const w of words){
    if(w.length<3) continue;
    if(STOPWORDS.has(w)) continue;
    freqs[w] = (freqs[w]||0)+1;
  }
  return Object.keys(freqs).sort((a,b)=>freqs[b]-freqs[a]).slice(0,30);
}

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

  let completeness = 0;
  if(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(resumeText)) completeness += 0.4;
  if(/\b(\d{1,2}\+?\s*years|\d+\s+years|experienced|senior)\b/i.test(resumeText)) completeness += 0.3;
  if(/\b(responsible|led|managed|developed|designed|implemented)\b/i.test(resumeText)) completeness += 0.3;

  const resumeScore = Math.min(100, Math.round(skillsMatch*0.7 + completeness*100*0.3));

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

  return { score: resumeScore, skillsMatch, missing, suggestions, atsTips };
}

app.post('/api/analyze', (req, res) => {
  const { resume = '', jobDescription = '' } = req.body || {};
  const result = evaluateResume(resume, jobDescription);
  res.json(result);
});

// Parse uploaded file and return extracted text (supports .txt, .pdf, .docx and images)
app.post('/api/parse-file', upload.single('file'), async (req, res) => {
  try{
    const file = req.file;
    if(!file) return res.status(400).json({ error: 'No file uploaded' });
    const name = (file.originalname || '').toLowerCase();
    let text = '';

    if(name.endsWith('.txt')){
      text = file.buffer.toString('utf8');

    } else if(name.match(/\.(png|jpg|jpeg)$/)){
      // Image file: attempt Google Vision OCR if API key configured
      const apiKey = process.env.GOOGLE_API_KEY || '';
      if(!apiKey){
        return res.status(400).json({ error: 'GOOGLE_API_KEY not configured on server. Set in .env to enable OCR for images.' });
      }
      try{
        const base64 = file.buffer.toString('base64');
        const requestBody = {
          requests: [
            {
              image: { content: base64 },
              features: [{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }]
            }
          ]
        };
        const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        const j = await resp.json();
        if(j.responses && j.responses[0]){
          const r = j.responses[0];
          if(r.fullTextAnnotation && r.fullTextAnnotation.text) text = r.fullTextAnnotation.text;
          else if(r.textAnnotations && r.textAnnotations[0] && r.textAnnotations[0].description) text = r.textAnnotations[0].description;
        }
      }catch(err){
        console.error('Vision OCR error', err);
        return res.status(500).json({ error: 'Vision OCR failed' });
      }

    } else if(name.endsWith('.pdf')){
      const data = await pdfParse(file.buffer);
      text = data && data.text ? data.text : '';
      if(!text || text.trim().length < 30){
        // likely scanned PDF — advise user
        return res.json({ text: '', scanned: true, message: 'PDF appears to be scanned (contains images). For OCR, upload PDF pages as images (jpg/png) or enable a PDF-to-image step on the server.' });
      }

    } else if(name.endsWith('.docx')){
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result && result.value ? result.value : '';

    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    res.json({ text });
  }catch(err){
    console.error('Parse error', err);
    res.status(500).json({ error: 'Failed to parse file' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AI Resume Checker API running on http://localhost:${port}`));
