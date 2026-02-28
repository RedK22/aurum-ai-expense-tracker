from django.db import migrations
from django.contrib.postgres.operations import TrigramExtension


class Migration(migrations.Migration):

    dependencies = [
    ('expenses', '0006_expense_user'),
]

    operations = [
        TrigramExtension(),
    ]