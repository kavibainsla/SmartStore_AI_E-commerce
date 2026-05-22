# Gemini API Setup for SmartStore AI

## 1. Get your free API key

1. Go to https://aistudio.google.com/apikey  
2. Sign in with Google  
3. Click **Create API key**  
4. Copy the key

## 2. Add to backend `.env`

Open `e:\pep_project\backend\.env` and add:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy...your-key-here
GEMINI_MODEL=gemini-2.0-flash
```

Keep your existing MongoDB and JWT settings.

## 3. Restart backend

```powershell
cd e:\pep_project\backend
npm run dev
```

## 4. Test in the app

1. Open http://localhost:5173  
2. Login → **Products** → **Add Product**  
3. Enter product name + category + price  
4. Click **Generate All Info** at the top of the form  
5. You should see full AI content (description, tags, SEO, marketing, etc.)

## 5. Verify provider

While logged in, check:

```
GET http://localhost:5001/api/ai/status
```

(Use your JWT token in Authorization header, or test from the app UI.)

Expected:

```json
{
  "provider": "gemini",
  "geminiConfigured": true,
  "model": "gemini-2.0-flash"
}
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| Demo mode / mock text | `GEMINI_API_KEY` missing or wrong in `.env` |
| API key invalid | Create new key in AI Studio |
| Model not found | Use `gemini-2.0-flash` or `gemini-1.5-flash` |
| Rate limit | Wait and retry; free tier has limits |

## Alternative: OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key
```
