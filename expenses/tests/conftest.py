import pytest
from django.contrib.auth import get_user_model
from expenses.models import Category

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(
      username='test',
      password='testpw'
  )

@pytest.fixture
def category(db):
    return Category.objects.create(
        name="Food",
        scope="GLOBAL"
    )

@pytest.fixture
def auth_client(client,user):
      client.force_login(user)
      return client