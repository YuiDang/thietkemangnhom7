# Generated by Django 3.0.5 on 2020-06-02 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='name',
            field=models.CharField(default='Nguyễn Huy Thuật', max_length=150),
            preserve_default=False,
        ),
    ]
