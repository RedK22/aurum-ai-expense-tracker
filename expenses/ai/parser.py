import json
from openai import OpenAI
import os 

OPEN_AI_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPEN_AI_KEY)


def parse_user_message(message, categories):

    prompt = f"""
You are an assistant that converts natural language into structured expense commands.

Return ONLY valid JSON.

Allowed actions:
create_expense
list_expenses
analytics
unknown

NEW JSON STRUCTURE:

{{
  "action": "...",
  "filters": {{
    "category": "string or null",
    "title": "string or null",
    "date_from": "today | yesterday | last_month | N_months_ago | null",
    "date_to": "today | null"
  }},
  "aggregation": "sum | none",
  "group_by": "category | none",
  "limit": number or null,
  "sort": "desc | asc | null",

  // ONLY for create_expense:
  "title": "short title",
  "amount": number,
  "category": "category name",
  "date": "today | yesterday | YYYY-MM-DD",
  "note": "extra note"
}}

Available categories:
{", ".join(categories)}

-------------------------
EXAMPLES
-------------------------

User: spent 350 on pizza yesterday
{{
  "action":"create_expense",
  "title":"Pizza",
  "amount":350,
  "category":"Food",
  "date":"yesterday",
  "note":""
}}

User: how much did I spend on food last 3 months
{{
  "action":"analytics",
  "filters": {{
    "category":"Food",
    "title":null,
    "date_from":"3_months_ago",
    "date_to":"today"
  }},
  "aggregation":"sum",
  "group_by":"none",
  "limit":null,
  "sort":null
}}

User: how much did I spend on pizza last month
{{
  "action":"analytics",
  "filters": {{
    "category":null,
    "title":"Pizza",
    "date_from":"last_month",
    "date_to":"today"
  }},
  "aggregation":"sum",
  "group_by":"none",
  "limit":null,
  "sort":null
}}

User: what category have I spent on most
{{
  "action":"analytics",
  "filters": {{
    "category":null,
    "title":null,
    "date_from":null,
    "date_to":null
  }},
  "aggregation":"sum",
  "group_by":"category",
  "limit":1,
  "sort":"desc"
}}

User: top 3 spent categories
{{
  "action":"analytics",
  "filters": {{
    "category":null,
    "title":null,
    "date_from":null,
    "date_to":null
  }},
  "aggregation":"sum",
  "group_by":"category",
  "limit":3,
  "sort":"desc"
}}

User: list expenses of food for last 2 months
{{
  "action":"list_expenses",
  "filters": {{
    "category":"Food",
    "title":null,
    "date_from":"2_months_ago",
    "date_to":"today"
  }},
  "aggregation":"none",
  "group_by":"none",
  "limit":10,
  "sort":"desc"
}}


User: asdfghjkl
{{
  "action": "unknown"
}}

User: hello there
{{
  "action": "unknown"
}}

User: what is the capital of France?
{{
  "action": "unknown"
}}

User: 12345
{{
  "action": "unknown"
}}
-------------------------

Now extract from:

User message:
{message}
"""

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are an expense tracking assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    content = response.choices[0].message.content

    print("AI RESPONSE:", content)

    try:
        return json.loads(content)
    except:
        return {"action": "unknown"}