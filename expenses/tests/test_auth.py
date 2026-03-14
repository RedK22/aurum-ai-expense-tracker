import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_user_can_get_token():
    User = get_user_model()

    User.objects.create_user(
        username="testuser",
        password="testpass123",
    )

    client = APIClient()

    response = client.post(
        "/api/token/",
        {
            "username": "testuser",
            "password": "testpass123",
        },
    )

    assert response.status_code == 200
    assert "access" in response.data


@pytest.mark.django_db
def test_user_cannot_get_token_with_wrong_password():
    User = get_user_model()

    User.objects.create_user(
        username="testuser",
        password="correctpass",
    )

    client = APIClient()

    response = client.post(
        "/api/token/",
        {
            "username": "testuser",
            "password": "wrongpass",
        },
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_protected_endpoint_requires_auth():
    client = APIClient()

    response = client.get("/api/expenses/")

    assert response.status_code == 401


@pytest.mark.django_db
def test_protected_endpoint_with_token():
    User = get_user_model()

    user = User.objects.create_user(
        username="testuser",
        password="testpass123",
    )

    client = APIClient()

    token_response = client.post(
        "/api/token/",
        {
            "username": "testuser",
            "password": "testpass123",
        },
    )

    access_token = token_response.data["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    response = client.get("/api/expenses/")

    assert response.status_code == 200
    