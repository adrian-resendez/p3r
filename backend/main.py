from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import csv

app = FastAPI()

# CORS middleware setup - allow localhost:3000 for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust as needed for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load characters once at startup
with open("characters.json", encoding="utf-8") as f:
    characters = json.load(f)

# Load social link answers once at startup
answers = []
with open("social_link_answers.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    answers = list(reader)  # list() for slightly cleaner syntax

@app.get("/characters")
def get_characters():
    return characters

@app.get("/answers")
def get_answers(character: str = Query(..., description="Character name to search")):
    # Case-insensitive substring search on the "Social Link" field
    lower_char = character.lower().strip()
    filtered = [a for a in answers if lower_char in a["Social Link"].lower()]
    
    if not filtered:
        raise HTTPException(status_code=404, detail=f"No answers found for '{character}'")
    return filtered
