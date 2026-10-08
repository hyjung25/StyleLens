# StyleLens

Author: Michael Jung. Built with AI assistance; see [prompt_log.md](./prompt_log.md) for the development record.

This documentation is an AI-assisted draft awaiting the author's final rewrite. The frontend uses GitHub Pages and the backend uses Render. The demo video and phone testing are pending.

StyleLens is a full-stack web application that analyzes a clothing photo and returns structured information about the main garment: category, primary color, pattern, style, recommended seasons, and a short description.

I kept the project deliberately focused so I could understand its complete flow. It does not include accounts, a database, saved closets, or recommendations. The main experience is uploading one image, analyzing it securely, and presenting a useful result clearly.

## Links

- Frontend: [StyleLens on GitHub Pages](https://hyjung25.github.io/StyleLens/)
- Backend API: [StyleLens on Render](https://stylelens-ssqa.onrender.com/docs)
- GitHub: [hyjung25/StyleLens](https://github.com/hyjung25/StyleLens)
- Demo video: Not published yet.

## How to use

1. Drag a JPG, PNG, WEBP, or GIF into the upload area, or click to browse.
2. Confirm that the complete image appears in the preview.
3. Click **Analyze clothing**.
4. Review the category, color, pattern, style, seasons, and description.
5. Click **Try another image** to reset the app.

Clear photos with one main outfit or clothing item produce the most reliable results.

## Features

- Drag-and-drop and standard file upload
- Fixed preview box that displays the complete image without changing its aspect ratio
- Client-side and server-side image validation
- Loading state and disabled analysis button
- Friendly API and connection errors
- Structured model output validated with Pydantic
- Responsive desktop and mobile layouts
- Reset flow for another image
- Backend-only API key handling

## What I am most proud of

### One complete, understandable flow

React accepts and previews the image, FastAPI validates it, the backend sends it to an OpenAI vision-capable model, and React renders a typed response. Keeping the project small made it possible to understand how every layer connects.

### Reliable structured output

The backend uses one `ClothingAnalysis` Pydantic model as both the requested model-output format and the API response validator. React can therefore depend on the same six fields instead of trying to clean up unpredictable text.

### Iterating from the real interface

The portrait-image preview required several revisions. A simple `object-fit` change did not behave as expected in the running interface, while an auto-height version made the page too tall. The final version uses a fixed box and `background-size: contain`, preserving the source ratio and showing the complete outfit with unused space when necessary.

I also revised the model instructions after a button-up shirt and tailored trousers were labeled only `casual`. The current prompt distinguishes casual, smart casual, business casual, semi-formal, and formal styling without assuming that every collared shirt is semi-formal.

## Architecture

```text
Browser selects an image
        ↓ multipart/form-data
React + Vite frontend
        ↓ POST /analyze
FastAPI validates and Base64-encodes the image
        ↓ image + Pydantic schema
OpenAI vision-capable model
        ↓ validated JSON
React result cards
```

The frontend has one main stateful component and two small UI components. The backend has one analysis endpoint and one response model. I intentionally avoided unnecessary services, classes, UI libraries, and state-management packages.

## Tech stack

- React and Vite
- FastAPI and Pydantic
- OpenAI Responses API
- Plain CSS
- GitHub Pages frontend deployment
- Render backend deployment

## Project structure

```text
StyleLens/
├── backend/
│   ├── .env.example
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/ImageUploader.jsx
│   │   ├── components/ResultCard.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── .gitignore
├── prompt_log.md
└── README.md
```

## How the image travels through the app

1. React stores the selected `File` and creates a temporary local preview URL.
2. The frontend sends the file in `FormData` to `POST /analyze`.
3. FastAPI checks its MIME type, size, and identifying signature bytes.
4. The backend converts the bytes to a Base64 data URL.
5. The image and `ClothingAnalysis` schema are sent to OpenAI.
6. The SDK parses the structured response into the Pydantic model.
7. FastAPI returns validated JSON, which `ResultCard.jsx` displays.

## Run locally

Requirements: Python 3.9+, Node.js 22.12+ (tested with Node.js 24 LTS), and an OpenAI API key.

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Add the secret to `backend/.env`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Then run:

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev
```

The local frontend environment should contain:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Open `http://127.0.0.1:5173`.

## Deployment

### Render backend

1. Create a Render Web Service connected to the GitHub repository.
2. Use `backend` as the root directory if StyleLens is the repository root.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `OPENAI_API_KEY`, `OPENAI_MODEL`, and `ALLOWED_ORIGINS` in Render.

The published frontend origin `https://hyjung25.github.io` is explicitly allowed by the backend. `ALLOWED_ORIGINS` adds other origins for local development or alternate frontends.

### GitHub Pages frontend

1. In repository Settings → Pages, choose **GitHub Actions** as the source.
2. In Settings → Secrets and variables → Actions → Variables, add `VITE_API_URL` with the HTTPS Render service URL.
3. Set Render's `ALLOWED_ORIGINS` to `https://hyjung25.github.io` (no repository path or trailing slash).
4. Push to `main`, or run **Deploy StyleLens to GitHub Pages** from the Actions tab. Changing a variable requires a new build.

The workflow builds `frontend/dist` using Node.js 24 and publishes it to `https://hyjung25.github.io/StyleLens/`. Vite uses `/StyleLens/` as its base path in GitHub Actions and `/` locally. GitHub Pages serves only the frontend; FastAPI still runs on Render. If the backend URL is missing, analysis displays an availability message rather than contacting the visitor's localhost.

## Security and privacy

The OpenAI key exists only in the FastAPI environment. It is never included in React or returned to the browser. `.env`, virtual-environment, build, and dependency folders are ignored by Git. Render should store the key as a secret environment variable. GitHub Actions receives only the public backend URL as `VITE_API_URL`; never put the OpenAI key into a `VITE_` variable.

Uploaded images are sent to OpenAI for analysis. StyleLens has no database or application feature that saves uploads; multipart parsing may temporarily spool larger uploads to disk. OpenAI's data handling is separate from local application storage. CORS controls browser access but does not authenticate callers or prevent direct requests to the public endpoint.

## Testing

- Frontend production build with `npm run build`
- Rejected MIME type, empty file, and spoofed image tests
- Mocked successful structured response
- Real public hoodie image sent through the OpenAI endpoint
- CORS preflight and POST from the frontend origin
- Multiple portrait-image preview revisions
- Responsive CSS is implemented; testing on a physical phone and the deployed application is still pending.

## Limitations

- Fashion labels are subjective.
- Lighting, framing, and occlusion affect accuracy.
- A photo with several prominent garments may return only the dominant one.
- Results are not saved because storage was intentionally outside the project scope.

## My role and learning

I made product decisions about scope, result fields, style taxonomy, responsive behavior, and the exact portrait-preview interaction. I tested the running interface and rejected results that did not match the intended behavior.

Codex applied the implementation patches in the recorded session. My documented contributions were the original specification, reviewing screenshots, identifying cropping and classification problems, and choosing the final preview behavior and dimensions. Direct student-authored code edits have not yet been documented in the prompt log.

## AI use and sources

I used OpenAI Codex to scaffold the React and FastAPI code, debug CORS and preview-layout problems, run verification commands, and draft documentation. I supplied the requirements, reviewed the running versions, found incorrect behavior, and directed the revisions. The full record is in [prompt_log.md](./prompt_log.md).

- [OpenAI images and vision guide](https://developers.openai.com/api/docs/guides/images-vision)
- [OpenAI structured outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs)
- [FastAPI file uploads](https://fastapi.tiangolo.com/tutorial/request-files/)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)
- [Vite GitHub Pages deployment guide](https://vite.dev/guide/static-deploy.html#github-pages)

## AI-generated documentation

Codex drafted this README, including the technical explanations, setup instructions, and development summary. The author has requested a draft to review and rewrite; it should not yet be treated as a student-written final submission. The video link will be added after publication.
