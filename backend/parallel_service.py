import os
from dotenv import load_dotenv
from parallel import Parallel

load_dotenv()

client = Parallel(api_key=os.getenv("PARALLEL_API_KEY"))


def research_movie(movie):

    actors = ", ".join(movie.actors)

    objective = f"""
    Research the following proposed movie for a movie-success prediction system.

    Movie title: {movie.title}
    Plot: {movie.plot}
    Genre: {movie.genre}
    Language: {movie.language}
    Actors: {actors}
    Director: {movie.director}
    Target audience: {movie.target_audience}

    Research current and recent information relevant to predicting
    the movie's potential success.

    Focus on:
    1. Current popularity and recent performance of the actors.
    2. Current trends for this genre.
    3. Audience interest in similar movies and concepts.
    4. Recent comparable movies and their performance.
    5. Box-office and commercial trends.
    6. Similar existing movies and originality of the concept.
    7. Current Indian cinema and regional/pan-India trends.

    Prefer recent information and reliable sources.
    """

    queries = [
        f"{actors} popularity 2026 India",
        f"{actors} recent movie performance 2025 2026",
        f"{movie.genre} movies India trends 2026",
        f"{movie.genre} audience interest India 2026",
        f"successful {movie.genre} movies India 2025 2026",
        f"Indian cinema box office trends 2026",
        f"Indian movie audience trends 2026",
        f"movies similar to {movie.plot}",
        f"{movie.language} cinema trends 2026",
        f"Indian cinema pan India trends 2026",
    ]

    response = client.search(
        objective=objective,
        search_queries=queries
    )

    results = []

    for result in response.results:
        results.append({
            "title": result.title,
            "url": result.url,
            "excerpts": result.excerpts
        })

    return results
