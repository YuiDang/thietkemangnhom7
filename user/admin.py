from django.contrib import admin
from .models import *

class CustomUserDetails(admin.ModelAdmin):
    list_display = ['email', 'name', 'cell_phone', 'city', 'district', 'address']

admin.site.register(CustomUser, CustomUserDetails)
