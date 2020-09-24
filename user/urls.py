from django.urls import path
from . import views

urlpatterns = [
    path('paymentinfo', views.paymentinfo, name='user-paymentinfo')
]