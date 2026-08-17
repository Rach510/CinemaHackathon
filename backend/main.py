from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from parallel_service import research_movie


app = FastAPI()


class MovieInput(BaseModel):
    title: str
    plot: str
    genre: str
    language: str
    actors: List[str]
    director: str
    target_audience: str


@app.post("/analyze")
def analyze_movie(movie: MovieInput):

    research = research_movie(movie)

    return {
        "movie": movie,
        "research": research
    }
