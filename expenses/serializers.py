from rest_framework import serializers
from .models import Expense,Category

class ExpenseSerializer(serializers.ModelSerializer):
  category_name = serializers.CharField(source='category.name',read_only=True)
  
  class Meta:
    model=Expense
    fields= ['id','title','amount','date','note','category','category_name'] 
  

class CategorySerializer(serializers.ModelSerializer):
  
  class Meta:
    model=Category
    fields= ['id','name']
    