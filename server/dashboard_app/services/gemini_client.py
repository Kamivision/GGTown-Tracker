import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai


ENV_PATH = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(ENV_PATH)


def ask_townie_gemini(message, townies, tracked_quests):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)

    townie_context = [
        {
            "name": townie.name,
            "quest_type": townie.quest_type,
            "quest": townie.quest,
            "quest_amount": townie.quest_amount,
        }
        for townie in townies
    ]

    tracked_context = [
        {
            "townie_id": quest.townie_id,
            "townie_name": quest.townie.name,
            "current_amount": quest.current_amount,
            "is_pinned": quest.is_pinned,
            "is_complete": quest.is_complete,
        }
        for quest in tracked_quests
    ]

    prompt = f"""
You are a Go-Go Town helper.
Answer only from the data below.
If the data does not contain the answer, say "I don't know."

Available townies:
{townie_context}

User tracked quests:
{tracked_context}

User question:
{message}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text

# data = json.load(open("townie_data.json", "r"))

# SYSTEM_PROMPT = """
# You are a helpful assistant for users of the GGTown Tracker app. 

# Your Role:
# - Provide information about townies, their quest types, and any other relevant details based on the data provided.
# - Answer user questions accurately.

# Your Constraints:
# - Only use the townie data provided below to answer questions. Do not use any external information.
# - If a question cannot be answered with the provided data, respond with "I don't know."
# - Do not make up information or provide answers that are not supported by the data.
# - Be concise and clear in your responses.

# Your Tone:
# - Friendly and helpful, but also professional.
# - Use simple language that is easy to understand.
# -Do not add any unnecessary information or explanations.
# """

# class TownieChat(BaseModel):
#     questions: str = Field(description="A concise explanation of the question that was asked")
#     answer: str = Field(description="answer to question in plain English")
    
# chat = client.chats.create(
#     model=MODEL_NAME,
#     config=genai.types.GenerateContentConfig(
#         system_instruction=SYSTEM_PROMPT,
#         response_mime_type="application/json",
#         response_schema=TownieChat,
#     )
# )

