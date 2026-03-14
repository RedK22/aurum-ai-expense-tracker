import pytest

from expenses.ai.router import execute_ai_command
from expenses.models import Category, Expense


@pytest.mark.django_db
def test_ai_create_expense(user, category):
	command = {
		"action": "create_expense",
		"title": "Lunch",
		"amount": "12.50",
		"category": category.name,
		"note": "Team meal",
	}

	response = execute_ai_command(command, user)

	assert Expense.objects.filter(
		user=user,
		title="Lunch",
		amount="12.50",
		category=category,
		note="Team meal",
	).exists()
	assert "Expense created" in response["message"]


@pytest.mark.django_db
def test_ai_analytics(user, category):
	Expense.objects.create(
		user=user,
		title="Coffee",
		amount="5.00",
		category=category,
		note="",
	)

	command = {
		"action": "analytics",
		"period": "today",
	}

	response = execute_ai_command(command, user)

	assert "You spent" in response["message"]


@pytest.mark.django_db
def test_ai_list_expenses(user, category):
	Expense.objects.create(
		user=user,
		title="Bus Ticket",
		amount="2.50",
		category=category,
		note="",
	)

	command = {
		"action": "list_expenses",
		"period": "today",
	}

	response = execute_ai_command(command, user)

	assert response["message"] == "Here are your expenses"
	assert len(response["expenses"]) >= 1
	assert any(item["title"] == "Bus Ticket" for item in response["expenses"])


@pytest.mark.django_db
def test_ai_unknown_input_returns_fallback_message(user):
	command = {
		"action": "unknown",
	}

	response = execute_ai_command(command, user)

	assert "didn't understand" in response["message"]


@pytest.mark.django_db
def test_ai_create_expense_unknown_category_falls_back_to_other(user):
	other_category = Category.objects.create(name="Other", scope="GLOBAL")

	command = {
		"action": "create_expense",
		"title": "Snacks",
		"amount": "3.75",
		"category": "NotARealCategory",
		"note": "Late night",
	}

	response = execute_ai_command(command, user)

	assert Expense.objects.filter(
		user=user,
		title="Snacks",
		amount="3.75",
		category=other_category,
		note="Late night",
	).exists()
	assert "Expense created" in response["message"]
