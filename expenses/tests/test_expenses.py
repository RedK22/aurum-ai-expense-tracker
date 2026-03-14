import pytest

from expenses.models import Expense

@pytest.mark.django_db
def test_create_expense(auth_client,category):
  data = {
    "title":"Coffee",
    "amount":200,
    "category":category.id,
    "note":"Starbucks"
  }

  response = auth_client.post('/api/expenses/',data)

  assert response.status_code == 201
  assert Expense.objects.count() == 1
  assert Expense.objects.first().title == "Coffee"