import pytest
from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APIRequestFactory, force_authenticate

from expenses.models import Expense, RecurringExpenseChoice, RecurringExpenseModel
from expenses.views import ExpenseListCreateView


@pytest.mark.django_db
def test_recurring_expense_generates(user, category):
	RecurringExpenseModel.objects.create(
		title="Monthly Internet",
		amount="30.00",
		category=category,
		user=user,
		start_date=timezone.now().date() - timedelta(days=60),
		frequency=RecurringExpenseChoice.MONTHLY,
		is_active=True,
	)

	factory = APIRequestFactory()
	request = factory.get("/api/expenses/")
	force_authenticate(request, user=user)

	view = ExpenseListCreateView()
	view.request = view.initialize_request(request)
	view.get_queryset()

	assert Expense.objects.filter(user=user, title="Monthly Internet").count() >= 1
