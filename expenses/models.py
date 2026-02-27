from django.db import models
from django.utils import timezone  

def today():
    return timezone.now().date()

# Create your models here.
class Category(models.Model):
    name=models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name


class Expense(models.Model):
  title=models.CharField(max_length=200)
  amount=models.DecimalField(max_digits=15,decimal_places=2)
  category=models.ForeignKey(Category,on_delete=models.PROTECT,related_name='expenses')
  date=models.DateField(default=today)
  note=models.TextField(blank=True)

  def __str__(self):
        return f"{self.title} - {self.amount}"
  
