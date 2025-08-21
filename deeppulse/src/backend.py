from fastapi import FastAPI, HTTPException
from fastapi_mcp import FastApiMCP
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import requests  # we'll use this to call Gemini API
import google.generativeai as genai
from dotenv import load_dotenv
import os
from supabase import create_client, Client




load_dotenv("sC:\\Users\\mahes\\OneDrive\\Desktop\\test\\deeppulse\\src\\.env")

# Supabase setup
SUPABASE_URL="https://dvadfkbnzwgaktrwbzcy.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2YWRma2JuendnYWt0cndiemN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjMxMTgsImV4cCI6MjA3MDAzOTExOH0.nVuyxZ4c3CNKRTpE0MaEIf35OGWnldKkxC2MCfymwB4"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

#Gemini config
 
API_KEY = "AIzaSyBiZn8hHDEX-LldSzoiy6dByiQXghTYssQ"
genai.configure(api_key=API_KEY)
def ask_gemini(prompt: str) -> str:
  model = genai.GenerativeModel("gemini-2.5-flash")
  response = model.generate_content(prompt)

  return response.text



app = FastAPI()



# Enable CORS for your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


mcp = FastApiMCP(app, 
                 name="Feedback Form Tool",
                 )


mcp.mount()
class QueryRequest(BaseModel):
    query: str

# Load your feedback responses
with open("responses.json", "r", encoding="utf-8") as f:
    responses_data = json.load(f)


@app.post("/query")


def query_gemini(request: QueryRequest):
    user_query = request.query

    # Combine user query + JSON data as context
    context = {
        "user_query": user_query,
        "responses_json": responses_data
    }


    
    prompt = f"""You are an AI agent with access to Supabase:\n 
                1. You can query the Supabase database to retrieve information.\n
                2. You can only access responses table in the Supabase database.\n
                3. You can use supabase.table("responses").select("*") to get all responses.\n
                4. You can use supabase.table("responses").select("*").eq("column_name", "value") to filter responses.\n
                5. YOu can also use other operations on the responses table but not the update and delete operation.\n
                6. Only use the responses data to answer user queries.\n
                7. Don't tell user to query the database directly.\n
                8. Try to query yourself and answer the user query.\n
                9. Only provide answers to users, don't tell them how you are querying the database.\n
                .\nQuestion: {user_query}"""
    

    try:
        resp = ask_gemini(prompt)
        return {"response": resp}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini API: {e}")


mcp.setup_server()