from django.contrib import admin
from .models import *

class TopicAdmin(admin.ModelAdmin):
    list_display = ['name', 'show_image', 'get_tags']
    fields = ['name', ('image', 'show_image'), 'tags']
    readonly_fields = ['show_image']

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

class TagAdmin(admin.ModelAdmin):
    list_display = ['name']

class InlineProductImage(admin.TabularInline):
    model = ProductImage
    readonly_fields = ['show_image']

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'show_thumbnail', 'quantity', 'price', 'sale_off', 'get_topics', 'get_categories', 'get_tags', 'posted_date']
    fields = ['topics', 'categories', 'tags', 'name', ('thumbnail', 'show_thumbnail'), 'summary', 'description', 'quantity', 'price', 'sale_off']
    readonly_fields = ['show_thumbnail']
    inlines = [InlineProductImage]

class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'brief', 'show_background', 'posted_date', 'get_tags']
    fields = ['title', 'brief', ('background', 'show_background'), 'content', 'posted_date', 'tags']
    readonly_fields = ['show_background', 'posted_date']

class CounponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'percent', 'percent_max_amount', 'amount', 'quantity']

class InlineOrderItem(admin.TabularInline):
    model = OrderItem
    readonly_fields = ['product', 'quantity', 'price']
    max_num = 0
    can_delete = False

class OrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_time', 'status']
    inlines = [InlineOrderItem]

admin.site.register(Topic, TopicAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Blog, BlogAdmin)
admin.site.register(Coupon, CounponAdmin)
admin.site.register(Order, OrderAdmin)

class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'quantity']
admin.site.register(Cart, CartAdmin)