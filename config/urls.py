from django.contrib import admin
from django.urls import path, include
from expenses.views import CategoryListCreateView,CategorySummaryView,SignUpView,LoginView,LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/expenses/', include('expenses.urls')),
    path('api/categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('api/analytics/category-summary/',CategorySummaryView.as_view(),name='category-summary-view'),
    path('api/auth/signup/',SignUpView.as_view(),name='signup'),
    path('api/auth/login/',LoginView.as_view(),name='login'),
    path('api/auth/logout/',LogoutView.as_view(),name='logout')
]