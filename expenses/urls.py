from django.urls import path
from .views import ExpenseListCreateView,SingleExpenseUpdateView

urlpatterns = [
    path('', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('<int:pk>/',SingleExpenseUpdateView.as_view(),name='single-expense-update')
]