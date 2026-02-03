# AI Resume Checker

🚀 A modern, AI-powered resume analysis tool with a beautiful, responsive frontend built with HTML, CSS, and JavaScript.

## ✨ Features

- **Modern UI** - Glassmorphism design with smooth animations and transitions
- **Dark Mode** - Toggle between light and dark themes with preference persistence
- **Resume Analysis** - Upload PDFs, Word docs, or paste text for analysis
- **Job Description Matching** - Get skills match percentage and missing keywords
- **Smart Insights** - Receive improvement suggestions and ATS compatibility tips
- **Google Vision OCR** - Support for image-based resume scanning
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Backend API** - Express.js server with file parsing and analysis endpoints

## 📋 Project Structure

```
Ai_Resume_Checker/
├── index.html           # Main HTML
├── style.css            # Styling with light/dark modes
├── script.js            # Frontend logic
├── README.md            # This file
├── .gitignore           # Git ignore rules
└── server/
    ├── server.js        # Express API
    ├── package.json     # Dependencies
    └── .env             # Environment variables (not committed)
```

## 🔧 API Endpoints

### POST /api/analyze
Analyze resume against job description
```json
{
  "resume": "string",
  "jobDescription": "string"
}
```

### POST /api/parse-file
Parse uploaded file (supports .txt, .pdf, .docx, .jpg, .png)
```
multipart/form-data with file field
```

## 📦 Dependencies

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- No external libraries required

**Backend:**
- Express.js
- CORS
- Multer (file uploads)
- pdf-parse (PDF extraction)
- mammoth (DOCX extraction)
- dotenv (environment variables)
- Google Vision API (OCR - optional)


## 📱 Responsive Breakpoints

- **Desktop**: 1400px (full width)
- **Tablet**: 1024px, 768px (optimized layout)
- **Mobile**: 480px (compact, touch-friendly)

## 🎨 UI Features

- Smooth color transitions between light/dark modes
- Gradient backgrounds and text effects
- Hover animations on interactive elements
- Progress bars with glow effects
- Loading spinner with animation
- Professional footer with links

**Built with ❤️ | Made with HTML, CSS, JavaScript & Express.js**
