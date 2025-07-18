import Papa from "papaparse";


export async function loadCharacters() {
    const res = await fetch(process.env.PUBLIC_URL + "/characters.json");
    if (!res.ok) throw new Error("Failed to load characters");
    return res.json();
  }
  
  export async function loadAnswersForCharacter(characterName) {
    const res = await fetch(process.env.PUBLIC_URL + "/social_link_answers.csv");
    if (!res.ok) throw new Error("Failed to load answers CSV");
  
    const text = await res.text();
    const parsed = Papa.parse(text, { header: true }).data;
  
    const lowerChar = characterName.toLowerCase();
    const filtered = parsed.filter((row) =>
      row["Social Link"]?.toLowerCase().includes(lowerChar)
    );
  
    if (!filtered.length) throw new Error("No answers found.");
    return filtered;
  }
  