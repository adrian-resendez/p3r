export async function loadCharacters() {
    const url = process.env.PUBLIC_URL + "/characters.json";
    console.log("Fetching characters from:", url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Failed to load characters:", res.status, res.statusText);
      throw new Error("Failed to load characters");
    }
    return res.json();
  }
  
  export async function loadAnswersForCharacter(characterName) {
    const url = process.env.PUBLIC_URL + "/social_link_answers.csv";
    console.log("Fetching answers CSV from:", url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Failed to load answers CSV:", res.status, res.statusText);
      throw new Error("Failed to load answers CSV");
    }
  
    const text = await res.text();
    const parsed = Papa.parse(text, { header: true }).data;
  
    const lowerChar = characterName.toLowerCase();
    const filtered = parsed.filter((row) =>
      row["Social Link"]?.toLowerCase().includes(lowerChar)
    );
  
    if (!filtered.length) throw new Error("No answers found.");
    return filtered;
  }
  