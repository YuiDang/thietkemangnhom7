# Generated by Django 3.0.5 on 2020-06-09 09:43

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowershop', '0015_auto_20200609_1642'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coupon',
            name='quantity',
            field=models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)]),
        ),
    ]
