import pytest
from django.contrib.auth import get_user_model
from expenses.models import Category


@pytest.mark.django_db
def test_create_private_category(auth_client):
    data = {
        "name": "Test Category",
        "scope": "PRIVATE",
    }

    response = auth_client.post("/api/categories/", data)

    assert response.status_code == 201
    assert Category.objects.filter(name="Test Category").exists()


@pytest.mark.django_db
def test_list_categories(auth_client):
    Category.objects.create(name="Food", scope="GLOBAL")

    response = auth_client.get("/api/categories/")

    assert response.status_code == 200
    assert len(response.data["results"]) >= 1


@pytest.mark.django_db
def test_user_cannot_create_global_category(auth_client):
    data = {
        "name": "Luxury",
        "scope": "GLOBAL",
    }

    response = auth_client.post("/api/categories/", data)

    assert response.status_code == 400
    assert not Category.objects.filter(name="Luxury").exists()


@pytest.mark.django_db
def test_admin_can_create_global_category(client):
    User = get_user_model()

    admin = User.objects.create_user(
        username="admin",
        password="adminpass",
        is_staff=True,
    )

    client.force_login(admin)

    data = {
        "name": "Luxury",
        "scope": "GLOBAL",
    }

    response = client.post("/api/categories/", data)

    assert response.status_code == 201
    assert Category.objects.filter(name="Luxury").exists()