from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='flowershop-home'),
    path('products/<str:product_name>/', views.pdetail, name='flowershop-pdetail'),
    path('products/', views.plist, name='flowershop-plist'),
    path('search/<str:key>/', views.search, name='flowershop-search'),
    path('blogs/<str:blog_title>/', views.bdetail, name='flowershop-bdetail'),
    path('cartcount/', views.cartcount, name='flowershop-cartcount'),
    path('getcart/', views.getcart, name='flowershop-getcart'),
    path('addcart/', views.addcart, name='flowershop-addcart'),
    path('updatecart/', views.updatecart, name='flowershop-updatecart'),
    path('checkcart/', views.checkcart, name='flowershop-checkcart'),
    path('cart/', views.cart, name='flowershop-cart'),
    path('updateuserinfo/',views.updateuserinfo,name='flowershop-updateuserinfo'),
    path('checkcoupon/',views.checkcoupon,name='flowershop-checkcoupon'),
    path('checkout/',views.checkout,name='flowershop-checkout'),
    path('account/order/', views.accountorder, name='flowershop-accountorder'),
    path('api/', views.api, name='flowershop-api'),
]