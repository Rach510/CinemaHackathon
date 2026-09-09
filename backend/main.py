import json
from typing import List

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from parallel_service import research_movie
from agent import synthesize_evaluation


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8082",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_movie(
    title: str = Form(...),
    plot: str = Form(...),
    genre: str = Form(...),
    language: str = Form(...),
    actors: str = Form(...),
    director: str = Form(...),
    target_audience: str = Form(...),
    script: UploadFile = File(...),
):
    # Convert actors JSON string back into a Python list.
    try:
        actors_list = json.loads(actors)
    except json.JSONDecodeError:
        actors_list = [actors]

    # Validate the uploaded script.
    if not script.filename.lower().endswith(".pdf"):
        return {"error": "Only PDF scripts are supported."}

    # Build the same movie object expected by the existing services.
    class Movie:
        pass

    movie = Movie()
    movie.title = title
    movie.plot = plot
    movie.genre = genre
    movie.language = language
    movie.actors = actors_list
    movie.director = director
    movie.target_audience = target_audience

    # Existing pipeline:
    # Frontend → FastAPI → Parallel → Gemini
    research = research_movie(movie)

    evaluation = synthesize_evaluation(movie, research)

    return evaluation
