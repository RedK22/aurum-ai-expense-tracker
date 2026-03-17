import json
from openai import OpenAI
from django.conf import settings
import os 

OPEN_AI_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPEN_AI_KEY)

def parse_user_message(message,categories):
  prompt = f"""
  You are an assistant that converts natural language into structured expense data.

  Your job is to extract information from the user message and return ONLY valid JSON.

  Rules:
  - Extract the numeric amount as a number.
  - The amount MUST be a number (no currency symbols).
  - If the user says "spent 350", the amount is 350.
  - Always detect the amount if present.
  - If no amount is found, return amount as null.

  Allowed actions:
  create_expense
  list_expenses
  analytics
  unknown

  Return JSON with this exact structure:

  {{
  "action": "create_expense",
  "title": "short description of the expense(1-3 words only)",
  "amount": number or null,
  "category": "category name",
  "date": "today | yesterday | YYYY-MM-DD",
  "note": "extra content and details about the expense"
  }}

  Available categories:
  {", ".join(categories)}

  Examples:

  User: spent 350 on pizza yesterday
  Output:
  {{
  "action":"create_expense",
  "title":"Pizza",
  "amount":350,
  "category":"Food",
  "date":"yesterday",
  "note":""
  }}

  User: paid 120 for coffee
  Output:
  {{
  "action":"create_expense",
  "title":"Coffee",
  "amount":120,
  "category":"Food",
  "date":"today",
  "note":""
  }}

  User: paid 400 for coffee with friends at Starbucks
  Output:
  {{
  "action":"create_expense",
  "title":"Coffee",
  "amount":400,
  "category":"Food",
  "date":"today",
  "note":"with friends at Starbucks"
  }}

  User: how much did I spend on food this month
  Output:
  {{
  "action":"analytics",
  "category":"Food",
  "period":"month"
  }}

  User: show my spending this month
  Output:
  {{
  "action":"analytics",
  "category":null,
  "period":"month"
  }}

  
  User: show expenses this week
  Output:
  {{
  "action":"list_expenses",
  "category":null,
  "period":"week"
  }}

  
  User: show my food expenses this month
  Output:
  {{
  "action":"list_expenses",
  "category":"Food",
  "period":"month"
  }}



  Now extract data from this message:

  User message:
  {message}
  """

  response = client.chat.completions.create(
    model='gpt-4o-mini',
    messages=[{
      'role':'system',
      'content':'You are an expense tracking assistant.'
    },{
      'role':'user','content':prompt
    }
    ]
  )

  content = response.choices[0].message.content

  print("AI RESPONSE")
  print(content)

  return json.loads(content)