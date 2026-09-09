import os
import json
from datetime import datetime, timezone

from dotenv import load_dotenv
from google import genai

load_dotenv("/home/rachana_pachi/CinemaHackathon/CinemaHackathon/backend/.env")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is missing")

_client = genai.Client(api_key=GOOGLE_API_KEY)


def synthesize_evaluation(movie, research):
    research_text = json.dumps(research, ensure_ascii=False)

    prompt = f"""
You are a professional film development analyst.

Evaluate the following proposed movie using the provided research.

MOVIE:
Title: {movie.title}
Plot: {movie.plot}
Genre: {movie.genre}
Language: {movie.language}
Actors: {", ".join(movie.actors)}
Director: {movie.director}
Target audience: {movie.target_audience}

RESEARCH:
{research_text}

Return ONLY valid JSON.

Use exactly this structure:

{{
  "overallScore": 0,
  "greenlightSummary": "string",
  "scriptScore": 0,
  "actorFitScore": 0,
  "demographicsScore": 0,
  "scriptQuality": {{
    "structureScore": 0,
    "dialogueScore": 0,
    "originalityScore": 0,
    "pacingScore": 0,
    "summary": "string"
  }},
  "actorFit": {{
    "castChemistryScore": 0,
    "entries": [
      {{
        "name": "string",
        "role": "string",
        "fitScore": 0,
        "rationale": "string"
      }}
    ],
    "summary": "string"
  }},
  "demographics": {{
    "primaryAudience": "string",
    "bands": [
      {{
        "label": "18-24",
        "affinity": 0
      }},
      {{
        "label": "25-34",
        "affinity": 0
      }},
      {{
        "label": "35-54",
        "affinity": 0
      }}
    ],
    "summary": "string"
  }}
}}

All scores must be integers from 0 to 100.

Base the evaluation on the movie information and research.
Do not invent citations or URLs.
"""


    response = _client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    text = response.text.strip()

    # Remove markdown JSON fences if Gemini adds them.
    if text.startswith("```"):
        text = text.replace("```json", "", 1)
        text = text.replace("```", "", 1).strip()

    evaluation = json.loads(text)

    evaluation["id"] = "eval_" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
    evaluation["submittedTitle"] = movie.title
    evaluation["generatedAt"] = datetime.now(timezone.utc).isoformat()

    return evaluation
