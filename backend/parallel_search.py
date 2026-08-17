import os
from dotenv import load_dotenv
from parallel import Parallel

load_dotenv()

client = Parallel(api_key=os.getenv("PARALLEL_API_KEY"))

response = client.search(
    objective="Find current trends in Indian cinema, including popular movie genres, recent successful films, and audience interests.",
    search_queries=[
        "Indian cinema trends 2026",
        "popular movie genres India 2026",
        "recent successful Indian movies 2026"
    ]
)

for result in response.results:
    print("\nTITLE:", result.title)
    print("URL:", result.url)
    print("EXCERPT:", result.excerpts)
