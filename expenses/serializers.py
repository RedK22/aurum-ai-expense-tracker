from rest_framework import serializers
from django.utils import timezone
from .models import Expense,Category,CategoryScope

class ExpenseSerializer(serializers.ModelSerializer):
  category_name = serializers.CharField(source='category.name',read_only=True)
  amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0.01)
  date = serializers.DateField(required=False)

  class Meta:
    model=Expense
    fields= ['id','title','amount','date','note','category','category_name']
  
  def validate_date(self, value):
    if value > timezone.now().date():
      raise serializers.ValidationError("Date cannot be in the future.")
    return value 
  
  def validate_category(self,value):
    user = self.context['request'].user

    if value.scope == CategoryScope.GLOBAL:
      return value
    
    if value.scope == CategoryScope.PRIVATE and value.user==user:
      return value
    
    raise serializers.ValidationError("You cannot use this category.")

class CategorySerializer(serializers.ModelSerializer):
  
  class Meta:
    model=Category
    fields= ['id','name']
    