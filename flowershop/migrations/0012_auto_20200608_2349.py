# Generated by Django 3.0.5 on 2020-06-08 16:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('flowershop', '0011_cart_coupon_order_orderdetail'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='OrderDetail',
            new_name='OrderItem',
        ),
    ]
