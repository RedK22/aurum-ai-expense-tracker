from django.contrib import admin
from django.urls import path, include
from expenses.views import health, CategoryListCreateView,CategorySummaryView,SignUpView,RecurringExpenseListCreateView,RecurringExpenseDetailView,AIQueryView,CategoryDetailView,CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path("api/health/", health),
    path('admin/', admin.site.urls),
    path('api/expenses/', include('expenses.urls')),
    path('api/categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path("api/categories/<int:pk>/",CategoryDetailView.as_view(),name="category-detail"),
    path('api/analytics/category-summary/',CategorySummaryView.as_view(),name='category-summary-view'),
    path('api/auth/signup/',SignUpView.as_view(),name='signup'),
    # path('api/auth/login/',LoginView.as_view(),name='login'),
    # path('api/auth/logout/',LogoutView.as_view(),name='logout'),
    path('api/recurring/',RecurringExpenseListCreateView.as_view()),
    path('api/recurring/<int:pk>/',RecurringExpenseDetailView.as_view()),
    path('api/ai/query',AIQueryView.as_view()),


    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/",TokenRefreshView.as_view(),name="token_refresh")
]