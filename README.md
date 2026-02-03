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

## 🚀 Quick Start

### Frontend Only (No Backend)
```bash
# Open index.html in your browser
start index.html
# Or use Live Server extension in VS Code
```

### With Backend (Full Features)
```bash
# Install server dependencies
cd server
npm install

# Set up environment variables
# Create .env file in server folder and add:
# GOOGLE_API_KEY=your_google_api_key_here

# Start server
npm start

# Open http://localhost:3000 in browser
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

## 🔐 Environment Variables

Create `server/.env`:
```
GOOGLE_API_KEY=your_google_cloud_api_key
PORT=3000
```

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

## 🚀 Deploying to GitHub

### 1. Initialize Git Repository
```bash
cd c:\Users\dheer\Desktop\Projects\Ai_Resume_Checker
git init
```

### 2. Add Files
```bash
git add .
```

### 3. Create First Commit
```bash
git commit -m "Initial commit: AI Resume Checker with frontend UI and backend API"
```

### 4. Create GitHub Repository
- Go to [github.com/new](https://github.com/new)
- Create a new public repository named `ai-resume-checker`
- **Do NOT initialize with README** (you already have one)
- Click "Create repository"

### 5. Add Remote and Push
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-checker.git
git branch -M main
git push -u origin main
```

### 6. Verify on GitHub
- Go to https://github.com/YOUR_USERNAME/ai-resume-checker
- Verify all files are uploaded correctly

## 💡 Alternative: Using GitHub Desktop

1. Open GitHub Desktop
2. Click "File" → "Add Local Repository"
3. Select the `Ai_Resume_Checker` folder
4. Click "Publish repository"
5. Name: `ai-resume-checker`
6. Choose your account and click "Publish"

## 🔍 Optional: Add to .gitignore Before Pushing
The `.gitignore` already excludes:
- `node_modules/` - Dependencies (users will run `npm install`)
- `.env` - Secrets (add your API keys locally only)
- `.DS_Store`, `Thumbs.db` - OS files
- IDE files (`.vscode/`, `.idea/`)

## 📝 After Pushing: Update GitHub Settings

### Add Description
1. Go to repository settings
2. Add description: "AI-powered resume analyzer with beautiful UI, dark mode, and Google Vision OCR"

### Add Topics (Keywords)
- ai
- resume-checker
- javascript
- express
- html-css
- responsive-design

## 🔄 Future Commits
```bash
# After making changes
git add .
git commit -m "Descriptive message about changes"
git push origin main
```

## ✅ Troubleshooting

**Error: fatal: not a git repository**
```bash
# You're not in the project directory
cd c:\Users\dheer\Desktop\Projects\Ai_Resume_Checker
```

**Error: Could not read Username**
```bash
# Configure Git with your GitHub credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**node_modules too large?**
- It's already in `.gitignore` ✓
- GitHub will not upload it
- Users run `npm install` to get dependencies

## 📄 License

MIT License - Feel free to use, modify, and distribute.

## 🎯 Next Steps

- [ ] Integrate real AI model (OpenAI, Vertex AI)
- [ ] Add database for storing analysis history
- [ ] Implement user authentication
- [ ] Add more file format support
- [ ] Create mobile app version
- [ ] Deploy to production (Heroku, Vercel, AWS)

---

**Built with ❤️ | Made with HTML, CSS, JavaScript & Express.js**
