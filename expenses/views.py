from rest_framework import generics
from .models import Expense,Category
from .serializers import ExpenseSerializer,CategorySerializer
from django.db.models import Q,Sum,Count
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model,logout
from rest_framework import status
from django.contrib.postgres.search import TrigramSimilarity

#======================EXPENSE VIEWS===========================

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
          

        category_id = self.request.query_params.get('category')

        if from_date:
          queryset = queryset.filter(date__gte=from_date)

        if to_date:
          queryset = queryset.filter(date__lte=to_date)

        if category_id:
            queryset = queryset.filter(category_id=category_id)

        if query:
          queryset = queryset.annotate(
            similarity=TrigramSimilarity('title',query)+TrigramSimilarity('note',query)
          ).filter(similarity__gt=0.2)

          return queryset.order_by('-similarity')

        return queryset.order_by('-date')

class SingleExpenseUpdateView(generics.RetrieveUpdateDestroyAPIView):
  permission_classes=[IsAuthenticated]
  serializer_class=ExpenseSerializer
  def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user)
        return queryset

#======================CATEGORY VIEWS===========================

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
  
#======================SIGNUP LOGIN LOGOUT VIEWS===========================


class SignUpView(APIView):
  permission_classes = []
  def post(self,request):
    User = get_user_model()
    user = request.data.get('username')
    email=request.data.get('email')
    pwd = request.data.get('password')
    if not user or not pwd or not email:
      return Response({'error':'Username, Email or Password missing'},status=status.HTTP_400_BAD_REQUEST)
    else:
      if(User.objects.filter(username=user).exists()):
        return Response({'error':'Username already taken'},status=status.HTTP_400_BAD_REQUEST)
      if(User.objects.filter(email=email).exists()):
        return Response({'error':'Email already taken'},status=status.HTTP_400_BAD_REQUEST)
      User.objects.create_user(username=user,password=pwd,email=email)
      return Response({"message": "User created"},status=status.HTTP_201_CREATED)
      


class LoginView(APIView):
  permission_classes = []
  def post(self,request):
    username = request.data.get('username')
    pwd = request.data.get('password')
    if not username or not pwd:
      return Response({'error':'Missing Credentials'},status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username,password=pwd)
    if user==None:
      return Response({'error':'Invalid Credentials'},status=status.HTTP_400_BAD_REQUEST)
    else:
      login(request,user)
      return Response({'message':'Login successful'},status=status.HTTP_200_OK)

class LogoutView(APIView):
  permission_classes = [IsAuthenticated]
  def post(self,request):
    logout(request)
    return Response({'message':'Logout successful'},status=status.HTTP_200_OK)