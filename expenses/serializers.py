from rest_framework import serializers
from django.utils import timezone
from .models import Expense,Category,CategoryScope,RecurringExpenseModel
from decimal import Decimal

###########################################
###### EXPENSE SERIALIZER #################
###########################################


class ExpenseSerializer(serializers.ModelSerializer):
  category_name = serializers.CharField(source='category.name',read_only=True)
  amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=Decimal("0.01"))
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


###########################################
###### CATEGORY SERIALIZER ################
###########################################


class CategorySerializer(serializers.ModelSerializer):
  
  class Meta:
    model=Category
    fields= ['id','name','scope']
  
  def validate(self,data):
    user=self.context['request'].user

    if data.get('scope')=="GLOBAL" and not user.is_staff:
      raise serializers.ValidationError("Only admins can create global categories")
    return data


###########################################
###### RECURRING EXPENSE SERIALIZER #######
###########################################

class RecurringExpenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = RecurringExpenseModel
    fields="__all__"
    read_only_fields=["user","last_generated"]