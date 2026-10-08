import base64
import os
from typing import Annotated

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import APIConnectionError, APIError, AuthenticationError, OpenAI, RateLimitError
from pydantic import BaseModel, ConfigDict, Field

load_dotenv()

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def has_valid_image_signature(content_type: str, data: bytes) -> bool:
    """Check a few identifying bytes so a renamed text file is not accepted."""

    signatures = {
        "image/jpeg": data.startswith(b"\xff\xd8\xff"),
        "image/png": data.startswith(b"\x89PNG\r\n\x1a\n"),
        "image/gif": data.startswith((b"GIF87a", b"GIF89a")),
        "image/webp": data.startswith(b"RIFF") and data[8:12] == b"WEBP",
    }
    return signatures.get(content_type, False)


class ClothingAnalysis(BaseModel):
    """The exact response shape shared with the React frontend."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    category: str = Field(min_length=1, max_length=50)
    primary_color: str = Field(min_length=1, max_length=50)
    pattern: str = Field(min_length=1, max_length=50)
    style: str = Field(min_length=1, max_length=50)
    season: list[str] = Field(min_length=1, max_length=4)
    description: str = Field(min_length=1, max_length=240)


app = FastAPI(title="StyleLens API", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.post("/analyze", response_model=ClothingAnalysis)
async def analyze_clothing(
    file: Annotated[UploadFile, File(description="One clothing image")],
) -> ClothingAnalysis:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Please upload a JPG, PNG, WEBP, or GIF image.",
        )

    image_bytes = await file.read(MAX_FILE_SIZE + 1)
    await file.close()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="The image must be smaller than 10 MB.")
    if not has_valid_image_signature(file.content_type, image_bytes):
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Image analysis is not configured yet.")

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")
    image_data_url = f"data:{file.content_type};base64,{encoded_image}"

    try:
        client = OpenAI(api_key=api_key)
        response = client.responses.parse(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            input=[
                {
                    "role": "system",
                    "content": (
                        "You analyze clothing photos for a fashion catalog. "
                        "Identify and describe the main, clearly visible clothing item. "
                        "You may use the surrounding outfit only to judge its styling context. "
                        "Use short, lowercase labels for category, color, and pattern. "
                        "For style, choose the most specific common label: casual, smart casual, "
                        "business casual, semi-formal, formal, streetwear, athletic, or another "
                        "clearly better label. A collared shirt is not automatically semi-formal. "
                        "Prefer smart casual when a relaxed shirt is tucked into tailored trousers; "
                        "reserve semi-formal for dressier outfits such as a dress shirt with a blazer "
                        "or suit-level tailoring. Choose one or more practical seasons from "
                        "spring, summer, fall, and winter. Keep the description "
                        "to one concise sentence. Do not identify a person."
                    ),
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": "Analyze this clothing item."},
                        {"type": "input_image", "image_url": image_data_url, "detail": "auto"},
                    ],
                },
            ],
            text_format=ClothingAnalysis,
        )
    except AuthenticationError as error:
        raise HTTPException(status_code=503, detail="Image analysis is not configured correctly.") from error
    except RateLimitError as error:
        raise HTTPException(status_code=429, detail="The analyzer is busy. Please try again shortly.") from error
    except APIConnectionError as error:
        raise HTTPException(status_code=502, detail="The AI service could not be reached.") from error
    except APIError as error:
        raise HTTPException(status_code=502, detail="The AI service could not analyze this image.") from error

    if response.output_parsed is None:
        raise HTTPException(status_code=422, detail="No clothing item could be identified in this image.")

    return response.output_parsed
