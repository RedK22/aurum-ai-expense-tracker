from rest_framework import generics
from .models import Expense,Category,CategoryScope,RecurringExpenseModel,RecurringExpenseChoice
from .serializers import ExpenseSerializer,CategorySerializer,RecurringExpenseSerializer
from django.db.models import Q,Sum,Count
from django.contrib.auth import authenticate, login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model,logout
from rest_framework import status
from django.contrib.postgres.search import TrigramSimilarity
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from django.db import transaction
from expenses.ai.parser import parse_user_message
from expenses.ai.router import execute_ai_command

from config.throttles import AuthRateThrottle, AIRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView

#======================EXPENSE VIEWS===========================

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self,serializer):
      serializer.save(user=self.request.user)

    def get_queryset(self):
        # Query Recurring Expenses
        with transaction.atomic():
          rec_exp = RecurringExpenseModel.objects.select_for_update().filter(user=self.request.user, is_active=True)
          today=timezone.now().date()
          # Loop through them to create expenses
          for rule in rec_exp:
            if rule.last_generated is None:
              next_date = rule.start_date
            else:
              if rule.frequency==RecurringExpenseChoice.MONTHLY:
                next_date=rule.last_generated+ relativedelta(months=1)
              else:
                next_date =rule.last_generated+  relativedelta(years=1)

            generated = False

            while next_date <= today:
              Expense.objects.create(
                title=rule.title,amount=rule.amount,category=rule.category,user=rule.user,date=next_date
              )
              generated=True
              rule.last_generated=next_date
              
              if rule.frequency==RecurringExpenseChoice.MONTHLY:
                next_date = next_date + relativedelta(months=1)
              else:
                next_date = next_date + relativedelta(years=1)
              
            if generated:
              rule.save()

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

          return queryset.order_by('-similarity','-date','-id')

        return queryset.order_by('-date','-id')

class SingleExpenseUpdateView(generics.RetrieveUpdateDestroyAPIView):
  permission_classes=[IsAuthenticated]
  serializer_class=ExpenseSerializer
  def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user)
        return queryset

#======================CATEGORY VIEWS===========================

class CategoryListCreateView(generics.ListCreateAPIView):
  permission_classes=[IsAuthenticated]
  serializer_class=CategorySerializer
  def get_queryset(self):
        user = self.request.user
        queryset = Category.objects.filter(
          Q(scope=CategoryScope.GLOBAL) | Q(user=user),
          is_active = True
        )
        return queryset.order_by("name", "id")
  def perform_create(self,serializer):
    serializer.save(user=self.request.user,scope=CategoryScope.PRIVATE)



class CategorySummaryView(APIView):
  permission_classes=[IsAuthenticated]
  def get(self,request):
    queryset=Expense.objects.filter(user=request.user)
    category_id = self.request.query_params.get('category')
    if category_id:
      queryset = queryset.filter(category_id=category_id)
    queryset=queryset.values('category__name').annotate(total=Sum('amount'),count=Count('id'))  
    

    return Response(queryset)
  

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class=CategorySerializer
  permission_classes=[IsAuthenticated]

  def get_queryset(self):
    return Category.objects.filter(scope = CategoryScope.PRIVATE, user = self.request.user)
#======================SIGNUP LOGIN LOGOUT VIEWS===========================


class SignUpView(APIView):
  permission_classes = []
  throttle_classes = [AuthRateThrottle]
  def post(self,request):
    User = get_user_model()
    user = request.data.get('username').strip().lower()
    email=request.data.get('email').strip().lower()
    pwd = request.data.get('password')
    try: 
      validate_password(pwd)
    except ValidationError as e:
      return Response({'error':e.messages},status=status.HTTP_400_BAD_REQUEST)
    if not user or not pwd or not email:
      return Response({'error':'Username, Email or Password missing'},status=status.HTTP_400_BAD_REQUEST)
    else:
      if(User.objects.filter(username=user).exists()):
        return Response({'error':'Username already taken'},status=status.HTTP_400_BAD_REQUEST)
      if(User.objects.filter(email=email).exists()):
        return Response({'error':'Email already taken'},status=status.HTTP_400_BAD_REQUEST)
      User.objects.create_user(username=user,password=pwd,email=email)
      return Response({"message": "User created"},status=status.HTTP_201_CREATED)
      


# class LoginView(APIView):
#   permission_classes = []
#   def post(self,request):
#     username = request.data.get('username')
#     pwd = request.data.get('password')
#     if not username or not pwd:
#       return Response({'error':'Missing Credentials'},status=status.HTTP_400_BAD_REQUEST)
#     user = authenticate(username=username,password=pwd)
#     if user==None:
#       return Response({'error':'Invalid Credentials'},status=status.HTTP_400_BAD_REQUEST)
#     else:
#       login(request,user)
#       return Response({'message':'Login successful'},status=status.HTTP_200_OK)

# class LogoutView(APIView):
#   permission_classes = [IsAuthenticated]
#   def post(self,request):
#     logout(request)
#     return Response({'message':'Logout successful'},status=status.HTTP_200_OK)
  
################### RECURRING EXPENSES VIEW ############################

class RecurringExpenseListCreateView(generics.ListCreateAPIView):
  serializer_class=RecurringExpenseSerializer
  permission_classes=[IsAuthenticated]

  def get_queryset(self):
    return RecurringExpenseModel.objects.filter(user=self.request.user)
  
  def perform_create(self,serializer):
    serializer.save(user=self.request.user)

class RecurringExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class=RecurringExpenseSerializer
  permission_classes=[IsAuthenticated]

  def get_queryset(self):
    return RecurringExpenseModel.objects.filter(user=self.request.user)
  
#################### AI VIEWS ##########################

class AIQueryView(APIView):
  permission_classes=[IsAuthenticated]
  throttle_classes = [AIRateThrottle]   
  def post(self,request):
    message=  request.data.get('message')
    categories = Category.objects.filter(is_active=True).values_list('name',flat=True)
    parsed=parse_user_message(message,categories)
    result = execute_ai_command(parsed,request.user)

    return Response(result)
  
# RATE LIMITING LOGIN
class CustomTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [AuthRateThrottle]