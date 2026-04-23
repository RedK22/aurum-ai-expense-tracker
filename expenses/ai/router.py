from django.utils import timezone
from expenses.models import Expense, Category, CategoryScope
from django.db.models import Q, Sum
import re

from dateutil.relativedelta import relativedelta
from datetime import date, timedelta


# ======================
# DATE RESOLVER
# ======================

def resolve_date_range(date_from, date_to):
    today = date.today()

    start = None
    end = None

    # --- date_from ---
    if date_from == "today":
        start = today

    elif date_from == "yesterday":
        start = today - timedelta(days=1)

    elif date_from == "this_month":
        start = today.replace(day=1)

    elif date_from == "last_month":
        # start = first day of last month
        # end   = last day of last month (set here, not overridden below)
        start = today.replace(day=1) - relativedelta(months=1)
        end = today.replace(day=1) - timedelta(days=1)

    elif date_from and "days_ago" in str(date_from):
        n = int(date_from.split("_")[0])
        start = today - timedelta(days=n)

    elif date_from and "months_ago" in str(date_from):
        n = int(date_from.split("_")[0])
        start = today - relativedelta(months=n)

    # --- date_to (only applied when date_from is NOT last_month) ---
    if date_from != "last_month":
        if date_to == "today":
            end = today

        elif date_to == "yesterday":
            end = today - timedelta(days=1)

        elif date_to and "days_ago" in str(date_to):
            n = int(date_to.split("_")[0])
            end = today - timedelta(days=n)

        elif date_to and "months_ago" in str(date_to):
            n = int(date_to.split("_")[0])
            end = today - relativedelta(months=n)

    return start, end


def resolve_expense_date(date_str):
    today = date.today()

    if date_str == "today":
        return today

    if date_str == "yesterday":
        return today - timedelta(days=1)

    if date_str and "days_ago" in str(date_str):
        n = int(date_str.split("_")[0])
        return today - timedelta(days=n)

    if date_str and re.match(r"\d{4}-\d{2}-\d{2}", date_str):
        return date.fromisoformat(date_str)

    return today  # default to today


# ======================
# (OLD FUNCTION - UNUSED BUT KEPT SAFE)
# ======================

def parse_period_to_start_date(period, today):
    start_date = None

    if period == "today":
        start_date = today

    elif period == "week":
        start_date = today - timedelta(days=7)

    elif period == "month":
        start_date = today.replace(day=1)

    elif period == "year":
        start_date = today.replace(month=1, day=1)

    else:
        match = re.search(r"(\d+)\s*(day|week|month|year)", str(period))

        if match:
            value = int(match.group(1))
            unit = match.group(2)

            if unit == "day":
                start_date = today - timedelta(days=value)

            elif unit == "week":
                start_date = today - timedelta(days=7 * value)

            elif unit == "month":
                start_date = today - timedelta(days=30 * value)

            elif unit == "year":
                start_date = today - timedelta(days=365 * value)

    return start_date


# ======================
# MAIN EXECUTOR
# ======================

def execute_ai_command(command, user):

    action = command.get("action")

    # ======================
    # CREATE EXPENSE
    # ======================

    if action == "create_expense":

        category = Category.objects.filter(Q(scope=CategoryScope.GLOBAL) | Q(user=user),name__iexact=command.get("category"),is_active=True).first()

        if not category:
            category = Category.objects.filter(name__iexact="Other",scope=CategoryScope.GLOBAL).first()

        amount = command.get("amount")

        if not amount:
            return {"message": "Couldn't detect amount. Please try again."}

        expense = Expense.objects.create(
            title=command.get("title") or command.get("description") or "Expense",
            amount=amount,
            category=category,
            user=user,
            date=resolve_expense_date(command.get("date")),
            note=command.get("note", "")
        )

        return {
            "message": f"Expense created for {amount}",
            "amount": amount,
            "expense": {
                "title": expense.title,
                "amount": float(expense.amount),
                "category": expense.category.name,
                "date": expense.date
            }
        }

    # ======================
    # ANALYTICS
    # ======================

    if action == "analytics":

        filters = command.get("filters", {})
        queryset = Expense.objects.filter(user=user)

        # CATEGORY
        if filters.get("category"):
            queryset = queryset.filter(
                category__name__iexact=filters["category"]
            )

        # TITLE
        if filters.get("title"):
            queryset = queryset.filter(
                title__icontains=filters["title"]
            )

        # DATE RANGE
        start, end = resolve_date_range(
            filters.get("date_from"),
            filters.get("date_to")
        )

        if start:
            queryset = queryset.filter(date__gte=start)

        if end:
            queryset = queryset.filter(date__lte=end)

        # GROUP BY CATEGORY
        if command.get("group_by") == "category":

            results = queryset.values("category__name").annotate(
                total=Sum("amount")
            )

            if command.get("sort") == "desc":
                results = results.order_by("-total")

            if command.get("limit"):
                results = results[:command["limit"]]

            data = list(results)

            if not data:
                return {"message": "No expenses found."}

            lines = []
            for i, item in enumerate(data, start=1):
                lines.append(f"{i}. {item['category__name']} — ₹{item['total']}")

            return {
                "message": "Top categories:\n" + "\n".join(lines),
                "data": data
            }

        # DEFAULT SUM
        total = queryset.aggregate(total=Sum("amount"))["total"] or 0

        category = filters.get("category")
        title = filters.get("title")

        if category:
            return {"message": f"You spent ₹{total} on {category}"}

        if title:
            return {"message": f"You spent ₹{total} on {title}"}

        return {"message": f"You spent ₹{total}"}

    # ======================
    # LIST EXPENSES
    # ======================

    if action == "list_expenses":

        filters = command.get("filters", {})
        queryset = Expense.objects.filter(user=user)

        # CATEGORY
        if filters.get("category"):
            queryset = queryset.filter(
                category__name__iexact=filters["category"]
            )

        # TITLE
        if filters.get("title"):
            queryset = queryset.filter(
                title__icontains=filters["title"]
            )

        # DATE RANGE
        start, end = resolve_date_range(
            filters.get("date_from"),
            filters.get("date_to")
        )

        if start:
            queryset = queryset.filter(date__gte=start)

        if end:
            queryset = queryset.filter(date__lte=end)

        expenses = queryset.order_by("-date")

        if command.get("limit"):
            expenses = expenses[:command["limit"]]

        results = []

        for e in expenses:
            results.append({
                "title": e.title,
                "amount": float(e.amount),
                "category": e.category.name,
                "date": e.date
            })

        return {
            "message": "Here are your expenses",
            "expenses": results
        }

    # ======================
    # UNKNOWN
    # ======================

    if action == "unknown":
        return {
            "message": "I didn't understand. Try adding an expense or asking about spending."
        }

    return {"message": "Command executed"}
