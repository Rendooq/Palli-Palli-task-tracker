import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import datetime

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScheduleRequest(BaseModel):
    tasks: str
    korean_student_mode: bool
    language: str = "ru"
    start_time: str = "07:00"
    end_time: str = "23:00"

try:
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY") or "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")
except Exception as e:
    print(f"Ошибка инициализации Groq: {e}. Убедитесь, что GROQ_API_KEY установлен.")
    groq_client = None

@app.post("/api/optimize")
async def optimize_schedule(request: ScheduleRequest):
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq client не инициализирован. Проверьте API ключ.")

    today = datetime.date.today().strftime('%A')

    lang_map = {
        "ru": "Russian",
        "en": "English",
        "ko": "Korean"
    }
    target_lang = lang_map.get(request.language, "Russian")

    system_prompt = f"""
    You are a strict, high-performance Korean project manager AI.
    Your goal is to distribute the USER'S TASKS into a schedule from today ({today}) until Sunday.
    
    Configuration:
    - Mode: {'KOREAN STUDENT MODE (EXTREME PRODUCTIVITY)' if request.korean_student_mode else 'Normal Balanced Mode'}
    - Start: {request.start_time} | End: {request.end_time}
    
    Rules for "KOREAN STUDENT MODE":
    - Schedule strictly between {request.start_time} and {request.end_time}.
    - Fit ALL user tasks. Do NOT invent filler tasks like "Palli-Palli!". Use "Self Study" if user tasks run out.
    - Advice MUST be in {target_lang} but include Korean phrases like "Palli-Palli!", "Fighting!".
    - Be strict and demanding.

    Rules for "Normal Mode":
    - Healthy breaks included.
    - Standard advice in {target_lang}.

    Output Format:
    Return ONLY a valid JSON array. Do not include markdown formatting (like ```json). Do not include any conversational text.
    Structure:
    {{ "schedule": [ {{ "day": "Day Name", "activities": [{{ "time": "HH:MM", "task": "Real Task Name", "advice": "Advice" }}] }} ] }}

    IMPORTANT:
    - 'day' must be in {target_lang}.
    - 'task' MUST be from the user's list or a generic activity (e.g. "Review"). Do not put slogans in the 'task' field.
    - 'time' should be in HH:MM format.
    """

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the list of tasks to schedule: \n{request.tasks}"},
            ],
            model="llama-3.3-70b-versatile",
            temperature=0,
        )

        response_text = chat_completion.choices[0].message.content
        print(f"AI Response: {response_text}")

        if not response_text:
            raise ValueError("Пустой ответ от AI")

        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        json_start = clean_text.find('[')
        json_end = clean_text.rfind(']') + 1
        
        if json_start != -1 and json_end > json_start:
            json_string = clean_text[json_start:json_end]
        else:
            json_string = clean_text
        
        return json.loads(json_string)

    except Exception as e:
        print(f"Ошибка при обращении к Groq или парсинге JSON: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка обработки: {str(e)}")