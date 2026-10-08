# StyleLens Prompt Log

## Project information

- Project: StyleLens
- Started: October 6, 2026
- Completed: October 8, 2026
- Total time: 11 hours
- Student: Michael Jung

## Which tool for which job

I used **OpenAI Codex** for initial project scaffolding, React/FastAPI implementation, debugging, command-line verification, and documentation drafting. I used the **OpenAI developer documentation** to verify Base64 image input and Pydantic structured-output patterns. The finished backend uses an OpenAI vision-capable model to perform the clothing analysis.

The running web interface was my primary design-feedback tool. I uploaded portrait images, checked classifications, and repeatedly corrected results that did not match my intended UX.

## Development process

1. Defined a deliberately small React + FastAPI + OpenAI application and excluded authentication, databases, and unrelated features.
2. Generated the initial component structure, upload flow, Pydantic schema, error handling, CORS settings, and deployment configuration.
3. Created a Python 3.9 virtual environment and installed backend dependencies. Installed Node.js v24 LTS from its official binary after Homebrew attempted a large source build.
4. Verified frontend builds and backend rejection/success paths.
5. Ran Vite on port 5173 and FastAPI on port 8000, then completed a real public-image OpenAI request.
6. Diagnosed a browser-only connection failure as a `localhost` versus `127.0.0.1` CORS mismatch and verified the corrected preflight request.
7. Revised the AI prompt so coordinated shirts and tailored trousers can be classified as smart casual instead of generic casual.
8. Iterated several times on portrait-image display until a fixed box with `background-size: contain` showed the full outfit correctly.
9. Adjusted the final desktop preview height to 470 pixels.
10. Drafted README and prompt-log documents, leaving only facts that require student confirmation as placeholders.

## Important prompts, verbatim

### 1. Initial project specification

```text
Build a simple, polished, portfolio-ready web application called **StyleLens** that classifies clothing from an uploaded image.

The main goal is to keep the project small enough that I can fully understand and explain the code, while still making it look like a complete product.

Tech stack:

- Frontend: React + Vite
- Backend: FastAPI
- AI: OpenAI vision-capable model
- Deployment target: Vercel for frontend and Render for backend
- Do not add unnecessary libraries or complex architecture.

Core user flow:

1. User opens the website.
2. User uploads or drags in one clothing image.
3. Show a preview of the uploaded image.
4. User clicks an "Analyze Clothing" button.
5. Frontend sends the image to the FastAPI backend.
6. Backend sends the image to the OpenAI vision model.
7. The model returns structured clothing information.
8. Display the result in clean cards next to or below the image.

The AI should return structured JSON in approximately this format:

{\
"category": "hoodie",\
"primary_color": "black",\
"pattern": "solid",\
"style": "streetwear",\
"season": ["fall", "winter"],\
"description": "A black oversized pullover hoodie."\
}

The exact allowed values do not need to be overly restrictive, but make the response consistent enough for the frontend to render reliably.

Frontend requirements:

- Clean modern landing page
- App title and short explanation
- Drag-and-drop image upload area
- Standard file upload also works
- Image preview before analysis
- Analyze button
- Disable the analyze button while loading
- Loading state while waiting for the backend
- Friendly error message if analysis fails
- Result section showing:
  - Category
  - Primary color
  - Pattern
  - Style
  - Recommended season
  - Short description
- Add a "Try another image" or reset button
- Responsive layout that works well on both desktop and phone
- Keep styling simple but professional
- Do not add authentication, database, accounts, closet storage, recommendations, or other extra features.

Backend requirements:

- FastAPI server
- One main POST endpoint such as `/analyze`
- Accept one image file
- Validate that a file was provided and that it is an image
- Convert the image into a format that can be sent to the OpenAI API
- Send a concise prompt asking the model to analyze only the visible clothing item
- Ask the model for structured JSON output
- Parse and validate the model response before sending it back to the frontend
- Return useful HTTP error responses if something fails
- Add CORS configuration so the Vercel frontend can call the Render backend
- Read `OPENAI_API_KEY` only from an environment variable
- Never expose the API key in frontend code
- Include `.env.example`
- Make sure `.env` is ignored by git

Important implementation constraints:

- Keep the code easy for a student to understand.
- Avoid abstractions unless they are genuinely useful.
- Do not create unnecessary services, classes, state-management libraries, or design systems.
- Prefer normal React state with `useState`.
- Keep the frontend component structure small.
- Add short comments only where the logic may not be obvious.
- Do not over-engineer the project.
- Do not add features that I did not ask for.

Suggested structure:

frontend/\
src/\
App.jsx\
components/\
ImageUploader.jsx\
ResultCard.jsx\
App.css

backend/\
main.py\
requirements.txt\
.env.example

Also create:

- a root `.gitignore`
- a short `README.md` skeleton that I can rewrite myself later
- clear local setup instructions
- clear deployment notes for Vercel and Render

Before writing code, briefly state the architecture in no more than 8-10 lines. Then implement the project directly. Do not spend a large amount of output on planning.

After implementation, explain:

1. How the image travels from the browser to the AI model.
2. Where the API key is stored and why it is secure.
3. How the structured JSON response is used by React.
4. Which files I should understand especially well before presenting this project.

Keep the project intentionally small, readable, and functional.
```

### 2. Create the environment files

```text
만들어
```

### 3. Confirm that the API key was added

```text
올려놨어.
```

### 4. Install Node.js

```text
설치해
```

### 5. Start the application

```text
바로 돌려
```

### 6. Test the complete flow

```text
돌려봐
```

### 7. Report the browser connection failure

```text
이러는데?
```

Screenshot message: `We couldn't reach the analysis server. Please try again shortly.`

### 8. Question the style classification

```text
셔츠 들어가면 semi formal 아닌가? 이거를 casual이라는데
```

### 9. Request a complete preview

```text
사진 올리면 올린 스크린샷처럼 사진이 crop 되있는데 전체 사진이 보이게 하고 싶어. 어쩔까?
```

### 10. Restart the servers

```text
서버 껐다가 다시 켜
```

### 11. Report that cropping remains

```text
아직도 이렇게 보이는디
```

### 12. Clarify the box behavior

```text
이렇게 말고, 그 사진을 그냥 박스에 채워 그냥. 완전 박스채 대신에 박스를 덜 채워도 되니까
```

### 13. Clarify aspect-ratio behavior

```text
아니 원본 비욜 유지하고, 박스 크기 고정, 그리고 사진이 박스가로 세로 비율 안따라가도 돼
```

### 14. Point out the unresolved issue

```text
아직도 다리가 안보이잖아.
```

### 15. Request a taller box

```text
좋다 완벽해. 이제 그냥 박스만 살짝 세로를 조금만 더 길게하자
```

### 16. Set the exact desktop height

```text
데스크톱 470
```

### 17. Request documentation drafts

```text
너가 일단 다 적어봐. 내가 그걸 보고 수정할게 있으면 수정할게
```

### 18. Request public GitHub publication and README cleanup

```text
그 requirement에 맞게 github에 올려줘. 그리고 readme에 직접 입력들 다 바꿔줘
```

Codex prepared a standalone repository with README and prompt log at the root, removed README placeholders, corrected the documented Node.js requirement, and checked that secrets and local dependencies were excluded. The app uses `gpt-4.1-mini` for runtime clothing analysis. Documentation and implementation were assisted by Codex; an exact underlying model version was not independently recorded for each development session.

### 19. Switch frontend hosting to GitHub Pages

```text
그럼 readme도 바꾸고 github pages로 해
```

Codex added a GitHub Actions Pages workflow, configured Vite's repository base path and home link, and updated the README from Vercel to GitHub Pages. The public backend URL is a repository Actions variable; the OpenAI key stays on Render. A missing production API URL now produces a friendly message instead of requesting localhost. The original specification above is preserved verbatim, including the earlier Vercel plan.

## One place AI got it wrong

The clearest failure was the portrait preview. Codex first said that replacing `object-fit: cover` with `object-fit: contain` had solved the crop, but the live interface still hid the person's legs. It then tried an auto-height preview, which showed the photo but made the layout much too tall. I had to clarify three independent requirements—fixed box, preserved source ratio, and acceptable empty space—and continue testing the actual UI. The final solution used a background image with `background-size: contain`. This taught me not to accept a plausible CSS explanation without verifying the rendered result.

A second mistake involved CORS. A direct API call worked, so the app was initially reported as working, but the browser still failed because `localhost` and `127.0.0.1` were treated as different origins. Inspecting the exact environment values and testing a real preflight request exposed the mismatch.

## Code authorship and my contributions

Codex generated most of the initial code and applied patches during the recorded session. My contributions so far include defining the scope, reviewing the running app, rejecting incorrect behavior, choosing the style taxonomy, specifying the preview interaction, and choosing the final dimensions.


## Work-session record

| Date | Time | Work completed |
|---|---:|---|
| 2026-10-06 |18:00 - 23:00| Initial implementation, setup, verification, CORS debugging, prompt revision, and preview iteration |
| 2026-10-07 |20:00 - 22:00 | Personal code changes and README revision |
| 2026-10-08 |00:00 - 04:00 | GitHub and deployment, demo recording, final polish |
| Total | 11 hours |

Publication status clarification: the work-session table above is the student's supplied record. At the time of this GitHub preparation, public web deployment, a published demo video, and physical-phone testing have not been verified. GitHub source publication alone does not complete those submission requirements. Specific direct student-authored code changes still need to be documented if performed.
