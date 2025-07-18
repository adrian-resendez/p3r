import streamlit as st
import pandas as pd
import json

st.set_page_config(page_title="Persona 3 Social Links", layout="wide")

@st.cache_data
def load_answers():
    return pd.read_csv("social_link_answers.csv")

@st.cache_data
def load_characters():
    with open("data/characters.json", "r") as f:
        return json.load(f)

df = load_answers()
characters = load_characters()

if "selected_character" not in st.session_state:
    st.session_state.selected_character = None

def select_character(name):
    if st.session_state.selected_character == name:
        st.session_state.selected_character = None
    else:
        st.session_state.selected_character = name

show_arcana = st.checkbox("Show Arcana Names", value=False)

st.title("🎴 Persona 3 Reload: Social Link Answer Guide")
st.markdown("Click a character's button to reveal optimal answers for each rank.")

cols = st.columns(4)

for idx, char in enumerate(characters):
    col = cols[idx % 4]
    with col:
        image_data = char["image_url"]
        if isinstance(image_data, str):
            image_data = [image_data]

        for img_url in image_data:
            if img_url:
                st.image(img_url, width=100)

        st.markdown(f"**{char['name']}**")
        if show_arcana:
            st.caption(f"{char['arcana']} Arcana")

        if st.button(f"Select {char['name']}", key=f"btn_{char['name']}"):
            select_character(char["name"])

# Show answers for selected character
if st.session_state.selected_character:
    char_name = st.session_state.selected_character
    st.subheader(f"🗂️ {char_name} - Dialogue Answers")
    answers = df[df["Social Link"].str.contains(char_name, case=False, na=False)]
    if answers.empty:
        st.info("No answer data available.")
    else:
        for _, row in answers.iterrows():
            rank = row["Rank"]
            answer = row["Answer"]
            with st.expander(f"Rank {rank}"):
                if pd.isna(answer) or answer.strip() == "":
                    st.info("No specific response affects your relationship.")
                else:
                    st.markdown(answer)
