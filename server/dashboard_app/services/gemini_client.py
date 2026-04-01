from google import genai
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import os
import json

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found. Please set it in the .env file.")

client = genai.Client(api_key=api_key)
MODEL_NAME = "gemini-2.5-flash"

data = json.load(open("townie_data.json", "r"))

SYSTEM_PROMPT = """
You are a helpful assistant for users of the GGTown Tracker app. 

Your Role:
- Provide information about townies, their quest types, and any other relevant details based on the data provided.
- Answer user questions accurately.

Your Constraints:
- Only use the townie data provided below to answer questions. Do not use any external information.
- If a question cannot be answered with the provided data, respond with "I don't know."
- Do not make up information or provide answers that are not supported by the data.
- Be concise and clear in your responses.

Your Tone:
- Friendly and helpful, but also professional.
- Use simple language that is easy to understand.
-Do not add any unnecessary information or explanations.
"""

class TownieChat(BaseModel):
    questions: str = Field(description="A concise explanation of the question that was asked")
    answer: str = Field(description="answer to question in plain English")
    
chat = client.chats.create(
    model=MODEL_NAME,
    config=genai.types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        response_mime_type="application/json",
        response_schema=TownieChat,
    )
)

