from rest_framework import generics
from .models import Expense,Category
from .serializers import ExpenseSerializer,CategorySerializer
from django.db.models import Q,Sum,Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self,serializer):
      serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user)
        from_date = self.request.query_params.get('from')
        to_date = self.request.query_params.get('to')
        query = self.request.query_params.get('q')
        if query:
          queryset = queryset.filter(Q(title__icontains=query) | Q(note__icontains=query))

        category_id = self.request.query_params.get('category')

        if from_date:
          queryset = queryset.filter(date__gte=from_date)

        if to_date:
          queryset = queryset.filter(date__lte=to_date)

        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset.order_by('-date')

class SingleExpenseUpdateView(generics.RetrieveUpdateDestroyAPIView):
  permission_classes=[IsAuthenticated]
  serializer_class=ExpenseSerializer
  def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user)
        return queryset

class CategoryListCreateView(generics.ListCreateAPIView):
  permission_classes=[IsAuthenticated]
  queryset=Category.objects.all()
  serializer_class=CategorySerializer


class CategorySummaryView(APIView):
  permission_classes=[IsAuthenticated]
  def get(self,request):
    queryset=Expense.objects.filter(user=request.user)
    category_id = self.request.query_params.get('category')
    if category_id:
      queryset = queryset.filter(category_id=category_id)
    queryset=queryset.values('category__name').annotate(total=Sum('amount'),count=Count('id'))  
    

    return Response(queryset)