import json
from openai import OpenAI
from datetime import date
import os

def get_ai_client_and_model():
    """
    Returns (client, model) supporting both Google Gemini and OpenAI.
    Allows explicit selection via AI_PROVIDER ('gemini' or 'openai'),
    or automatically picks based on configured API keys.
    """
    provider = os.getenv("AI_PROVIDER", "").strip().lower()
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API")
    openai_key = os.getenv("OPENAI_API_KEY")

    if provider == "openai":
        return OpenAI(api_key=openai_key), os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    elif provider == "gemini":
        return OpenAI(
            api_key=gemini_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        ), os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

    # Auto-detection: prioritize Gemini if provided
    if gemini_key:
        return OpenAI(
            api_key=gemini_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        ), os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    elif openai_key:
        return OpenAI(api_key=openai_key), os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    else:
        return None, None


def parse_user_message(message, categories):
    today_str = date.today().isoformat()  # injected at call time so relative dates are always correct

    prompt = f"""
You are a structured data extractor for a personal expense tracker.
Today's date is {today_str}. All relative dates must be resolved relative to this date.
Return ONLY valid JSON. No explanation, no markdown, no extra keys.

========================
ACTIONS
========================
create_expense   — user is logging a new expense
list_expenses    — user wants to see a list of expenses
analytics        — user wants totals, summaries, or category breakdowns
unknown          — anything unrelated to expenses

========================
OUTPUT SCHEMA
========================
For analytics / list_expenses:
{{
  "action": "analytics" | "list_expenses",
  "filters": {{
    "category": "<category name> | null",
    "title": "<keyword> | null",
    "date_from": "<token> | null",
    "date_to": "<token> | null"
  }},
  "aggregation": "sum" | "none",
  "group_by": "category" | "none",
  "limit": <number> | null,
  "sort": "desc" | "asc" | null
}}

For create_expense:
{{
  "action": "create_expense",
  "title": "<short title>",
  "amount": <number>,
  "category": "<category name>",
  "date": "<token>",
  "note": ""
}}

For unknown:
{{
  "action": "unknown"
}}

========================
DATE TOKENS — use ONLY these, never invent raw dates
========================
Use these tokens for date_from, date_to, and the "date" field in create_expense:

  "today"         — current date
  "yesterday"     — one day before today
  "this_month"    — start of the current calendar month
  "last_month"    — start of the previous calendar month
  "N_months_ago"  — e.g. "3_months_ago" means 3 months before today
  "N_days_ago"    — e.g. "2_days_ago" means 2 days before today
  "YYYY-MM-DD"    — only for create_expense when the user gives an explicit calendar date
  null            — no date constraint

CRITICAL RULES:
1. last_month: When date_from is "last_month", always set date_to to null.
   The backend computes the correct month-end automatically.
   Never set date_to to "today" for last_month — that wrongly includes the current month.

2. Single-day relative queries (e.g. "2 days ago", "yesterday"):
   Set both date_from AND date_to to the same token so only that day is queried.
   Example: "what did I spend 2 days ago" → date_from: "2_days_ago", date_to: "2_days_ago"

3. Never invent raw date strings for relative phrases.
   "2 days ago" → "2_days_ago", NOT "2025-04-21" or any hardcoded date.

========================
AVAILABLE CATEGORIES
========================
{", ".join(categories)}
Check user's query and match the item with existing categories. Example: Petrol Expense = Travel Category, Cold Coffee = Food/Snacks category etc.
If the user's category doesn't match any of the above, use "Other".

========================
EXAMPLES
========================

User: spent 350 on pizza yesterday
{{
  "action": "create_expense",
  "title": "Pizza",
  "amount": 350,
  "category": "Food",
  "date": "yesterday",
  "note": ""
}}

User: paid 1200 for electricity bill on 2024-06-15
{{
  "action": "create_expense",
  "title": "Electricity Bill",
  "amount": 1200,
  "category": "Utilities",
  "date": "2024-06-15",
  "note": ""
}}

User: how much did I spend on food last 3 months
{{
  "action": "analytics",
  "filters": {{
    "category": "Food",
    "title": null,
    "date_from": "3_months_ago",
    "date_to": "today"
  }},
  "aggregation": "sum",
  "group_by": "none",
  "limit": null,
  "sort": null
}}

User: how much did I spend on food last month
{{
  "action": "analytics",
  "filters": {{
    "category": "Food",
    "title": null,
    "date_from": "last_month",
    "date_to": null
  }},
  "aggregation": "sum",
  "group_by": "none",
  "limit": null,
  "sort": null
}}

User: what did I spend 2 days ago
{{
  "action": "analytics",
  "filters": {{
    "category": null,
    "title": null,
    "date_from": "2_days_ago",
    "date_to": "2_days_ago"
  }},
  "aggregation": "sum",
  "group_by": "none",
  "limit": null,
  "sort": null
}}

User: how much did I spend on pizza last month
{{
  "action": "analytics",
  "filters": {{
    "category": null,
    "title": "Pizza",
    "date_from": "last_month",
    "date_to": null
  }},
  "aggregation": "sum",
  "group_by": "none",
  "limit": null,
  "sort": null
}}

User: how much did I spend this month
{{
  "action": "analytics",
  "filters": {{
    "category": null,
    "title": null,
    "date_from": "this_month",
    "date_to": "today"
  }},
  "aggregation": "sum",
  "group_by": "none",
  "limit": null,
  "sort": null
}}

User: how much did I spend on food this month
{{
  "action": "analytics",
  "filters": {{
    "category": "Food",
    "title": null,
    "date_from": "this_month",
    "date_to": "today"
  }},
  "aggregation": "sum",
  "group_by": "none",
  "limit": null,
  "sort": null
}}

User: what category have I spent on most
{{
  "action": "analytics",
  "filters": {{
    "category": null,
    "title": null,
    "date_from": null,
    "date_to": null
  }},
  "aggregation": "sum",
  "group_by": "category",
  "limit": 1,
  "sort": "desc"
}}

User: top 3 spending categories this month
{{
  "action": "analytics",
  "filters": {{
    "category": null,
    "title": null,
    "date_from": "this_month",
    "date_to": "today"
  }},
  "aggregation": "sum",
  "group_by": "category",
  "limit": 3,
  "sort": "desc"
}}

User: top 3 spent categories
{{
  "action": "analytics",
  "filters": {{
    "category": null,
    "title": null,
    "date_from": null,
    "date_to": null
  }},
  "aggregation": "sum",
  "group_by": "category",
  "limit": 3,
  "sort": "desc"
}}

User: list food expenses from last 2 months
{{
  "action": "list_expenses",
  "filters": {{
    "category": "Food",
    "title": null,
    "date_from": "2_months_ago",
    "date_to": "today"
  }},
  "aggregation": "none",
  "group_by": "none",
  "limit": 10,
  "sort": "desc"
}}

User: show my expenses yesterday
{{
  "action": "list_expenses",
  "filters": {{
    "category": null,
    "title": null,
    "date_from": "yesterday",
    "date_to": "yesterday"
  }},
  "aggregation": "none",
  "group_by": "none",
  "limit": null,
  "sort": "desc"
}}

User: asdfghjkl
{{"action": "unknown"}}

User: hello there
{{"action": "unknown"}}

User: what is the capital of France?
{{"action": "unknown"}}

User: 12345
{{"action": "unknown"}}

========================
Now extract from:
User: {message}
"""

    client, model = get_ai_client_and_model()
    if not client or not model:
        print("AI parsing skipped: neither GEMINI_API_KEY nor OPENAI_API_KEY is configured.")
        return {"action": "unknown"}

    try:
        response = client.chat.completions.create(
            model=model,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are an expense tracking assistant. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ]
        )

        content = response.choices[0].message.content
        print(f"AI RESPONSE ({model}):", content)
        return json.loads(content)
    except Exception as e:
        print(f"AI parsing error ({model}):", e)
        return {"action": "unknown"}
