from expenses.models import Expense, Category
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum
import re


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


def execute_ai_command(command, user):

    action = command.get("action")

    # ======================
    # CREATE EXPENSE
    # ======================

    if action == "create_expense":

        category = Category.objects.filter(
            name__iexact=command.get("category")
        ).first()

        if not category:
            category = Category.objects.filter(
                name__iexact="Other"
            ).first()

        amount = command.get("amount")

        if not amount:
            return {"message": "Couldn't detect amount. Please try again."}

        expense = Expense.objects.create(
            title=command.get("title") or command.get("description") or "Expense",
            amount=amount,
            category=category,
            user=user,
            date=timezone.now().date(),
            note=command.get("note", "")
        )

        return {
            "message": f"Expense created for {amount}",
            "amount": amount,
            "expense":{
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

        today = timezone.now().date()
        period = command.get("period")

        start_date = parse_period_to_start_date(period, today)

        queryset = Expense.objects.filter(user=user)

        if start_date:
            queryset = queryset.filter(date__gte=start_date)

        category_name = command.get("category")

        if category_name:
            category = Category.objects.filter(name__iexact=category_name).first()

            if category:
                queryset = queryset.filter(category=category)

        total = queryset.aggregate(total=Sum("amount"))["total"] or 0

        if period == "today":
            message = f"You spent {total} today"

        elif period == "week":
            message = f"You spent {total} this week"

        elif period == "month":
            message = f"You spent {total} this month"

        elif period == "year":
            message = f"You spent {total} this year"

        elif period:
            message = f"You spent {total} in the last {period}"

        else:
            message = f"You spent {total} in total"

        return {"message": message}

    # ======================
    # LIST EXPENSES
    # ======================

    if action == "list_expenses":

        today = timezone.now().date()
        period = command.get("period")

        start_date = parse_period_to_start_date(period, today)

        queryset = Expense.objects.filter(user=user)

        if start_date:
            queryset = queryset.filter(date__gte=start_date)

        category_name = command.get("category")

        if category_name:
            category = Category.objects.filter(name__iexact=category_name).first()

            if category:
                queryset = queryset.filter(category=category)

        expenses = queryset.order_by("-date")[:10]

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
    elif action == "unknown":

        return {
            "message": "I didn't understand. Try adding an expense or asking about spending."
        }

    return {"message": "Command executed"}