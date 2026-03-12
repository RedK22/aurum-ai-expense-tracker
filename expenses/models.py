from django.db import models
from django.utils import timezone 
from django.conf import settings
from django.db.models import Q
def today():
    return timezone.now().date()

# Create your models here.
class CategoryScope(models.TextChoices):
    GLOBAL = "GLOBAL", "Global"
    PRIVATE = "PRIVATE", "Private"

class Category(models.Model):
    name=models.CharField(max_length=20)
    scope = models.CharField(
    max_length=10,
    choices=CategoryScope.choices,
    default=CategoryScope.GLOBAL
)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
        # GLOBAL must not have a user
        models.CheckConstraint(
            condition=Q(scope="GLOBAL", user__isnull=True) | Q(scope="PRIVATE", user__isnull=False),
            name="category_scope_user_consistency",
        ),

        # Unique GLOBAL names
        models.UniqueConstraint(
            fields=["name"],
            condition=Q(scope="GLOBAL"),
            name="unique_global_category_name",
        ),

        # Unique PRIVATE names per user
        models.UniqueConstraint(
            fields=["name", "user"],
            condition=Q(scope="PRIVATE"),
            name="unique_private_category_per_user",
        ),
    ]

    def __str__(self):
        return self.name


class Expense(models.Model):
  title=models.CharField(max_length=200)
  amount=models.DecimalField(max_digits=15,decimal_places=2)
  category=models.ForeignKey(Category,on_delete=models.PROTECT,related_name='expenses')
  date=models.DateField(default=today)
  note=models.TextField(blank=True)
  user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='expenses')

  def __str__(self):
        return f"{self.title} - {self.amount}"
  
class RecurringExpenseChoice(models.TextChoices):
    MONTHLY = "MONTHLY", "Monthly"
    YEARLY = "YEARLY", "Yearly"

class RecurringExpenseModel(models.Model):
    title=models.CharField(max_length=200)
    amount=models.DecimalField(max_digits=15,decimal_places=2)
    category=models.ForeignKey(Category,on_delete=models.PROTECT, related_name='recurring_expenses')
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='recurring_expenses')
    start_date = models.DateField()
    last_generated=models.DateField(null=True,blank=True)
    end_date = models.DateField(null=True,blank=True)
    is_active = models.BooleanField(default=True)
    frequency=models.CharField(choices=RecurringExpenseChoice.choices,max_length=10)

    def __str__(self):
        return f"{self.title} - {self.amount}"