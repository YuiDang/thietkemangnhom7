from .models import *
from user.models import CustomUser
from django.shortcuts import render
from django.shortcuts import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.core import serializers
from django.db.models import Q
from random import sample
from django.contrib.auth.decorators import login_required
import json

def api(request):
    if request.GET['view'] == 'home':
        blogs = list(Blog.objects.filter(tags__name__contains = 'home').values('title', 'brief', 'background'))

        topics = list(Topic.objects.filter(tags__name__contains = 'home').values('name', 'image')[:4])

        for topic in topics:
            min_price = Product.objects.filter(topics__name__contains = topic['name']).values('price').order_by('price').first()
            if min_price:
                topic['min_price'] = min_price['price']
            else:
                topic['min_price'] = '! no products !'

        new_products = list(Product.objects.filter(tags__name__contains = 'new').values('name', 'thumbnail', 'price', 'sale_off', 'quantity'))

        onsale_products = list(Product.objects.filter(tags__name__contains = 'on sale').values('name', 'thumbnail', 'price', 'sale_off', 'quantity'))

        result = {
            'blogs': blogs,
            'topics': topics,
            'new_products': new_products,
            'onsale_products': onsale_products
        }
        return JsonResponse(result)

    elif request.GET['view'] == 'pdetail':
        temp = Product.objects.filter(name = request.GET['pname'])
        if len(temp) == 0:
            result = {
                'product': 'not found'
            }
            return JsonResponse(result)

        product = temp.values('name', 'thumbnail', 'summary', 'description', 'quantity', 'price', 'sale_off').first()

        product['topics'] = [t.name for t in temp[0].topics.all()]
        product['categories'] = [c.name for c in temp[0].categories.all()]

        product_images = list(ProductImage.objects.filter(product = temp[0]).values('image'))
        product['images'] = [product_image['image'] for product_image in product_images]

        related_products = []
        related_products_name = [product['name']]
        for topic in product['topics']:
            rps = list(Product.objects.filter(~Q(name = product['name']), topics__name__contains = topic).values('name', 'thumbnail', 'price', 'sale_off', 'quantity'))
            for rp in rps:
                if rp['name'] not in related_products_name:
                    related_products.append(rp)
                    related_products_name.append(rp['name'])
        for category in product['categories']:
            rps = list(Product.objects.filter(~Q(name = product['name']), categories__name__contains = category).values('name', 'thumbnail', 'price', 'sale_off', 'quantity'))
            for rp in rps:
                if rp['name'] not in related_products_name:
                    related_products.append(rp)
                    related_products_name.append(rp['name'])
        if len(related_products) > 8:
            related_products = sample(related_products, 8)
    
        result = {
            'product': product,
            'related_products': related_products
        }
        return JsonResponse(result)

    elif request.GET['view'] == 'plist':
        topic = request.GET['topic']
        category = request.GET['category']
        if topic == 'all' and category == 'all':
            products = list(Product.objects.values('name', 'thumbnail', 'price', 'quantity', 'sale_off'))
        elif topic == 'all' and category != 'all':
            products = list(Product.objects.filter(categories__name__contains = category).values('name', 'thumbnail', 'price', 'quantity', 'sale_off'))
        elif topic != 'all' and category == 'all':
            products = list(Product.objects.filter(topics__name__contains = topic).values('name', 'thumbnail', 'price', 'quantity', 'sale_off'))
        else:
            products = list(Product.objects.filter(topics__name__contains = topic, categories__name__contains = category).values('name', 'thumbnail', 'price', 'quantity', 'sale_off'))

        index = int(request.GET['index'])
        
        more = True
        if index + 6 >= len(products):
            more = False

        result = {
            'products': products[index:(index + 6)],
            'next_index': index + len(products[index:(index + 6)]),
            'more': more
        }
        return JsonResponse(result)
    
    elif request.GET['view'] == 'search':
        key = request.GET['key']

        products = list(Product.objects.filter(Q(name__contains = key) | Q(topics__name__contains = key) | Q(categories__name__contains = key) | Q(summary__contains = key)).values('name', 'thumbnail', 'price', 'quantity', 'sale_off'))

        index = int(request.GET['index'])
        
        products_len = len(products)

        more = True
        if index + 4 >= products_len:
            more = False

        result = {
            'sum': products_len,
            'products': products[index:(index + 4)],
            'next_index': index + len(products[index:(index + 4)]),
            'more': more
        }
        return JsonResponse(result)

def cartcount(request):
    try:
        items = list(Cart.objects.filter(user = request.user).values('quantity'))
        count = sum(item['quantity'] for item in items)
        return count
    except:
        return 0

def home(request):
    context = {
        'page_title': 'Home',
        'cart_count': cartcount(request)
    }
    return render(request, 'home.html', context)

def pdetail(request, product_name):
    context = {
        'page_title': product_name,
        'cart_count': cartcount(request),
        'product_name': product_name,
    }
    return render(request, 'product-detail.html', context)

def plist(request):    
    try:
        selected_topic = request.GET['topic']
        selected_category = request.GET['category']
    except:
        return HttpResponseRedirect('/products/?topic=all&category=all')
    if selected_topic != 'all' and Topic.objects.filter(name = selected_topic).count() == 0:
        return HttpResponseRedirect('/products/?topic=all&category=all')
    if selected_category != 'all' and Category.objects.filter(name = selected_category).count() == 0:
        return HttpResponseRedirect('/products/?topic=all&category=all')

    temp = list(Topic.objects.all().values('name'))
    topics = ['all'] + [t['name'] for t in temp]
    temp = list(Category.objects.all().values('name'))
    categories = ['all'] + [c['name'] for c in temp]

    context = {
        'page_title': 'Products List',
        'cart_count': cartcount(request),
        'topics': topics,
        'categories': categories,
        'selected_topic': selected_topic,
        'selected_category': selected_category
    }
    return render(request, 'product-list.html', context)

def search(request, key):
    context = {
        'page_title': 'Search',
        'cart_count': cartcount(request),
        'key': key
    }
    return render(request, 'search.html', context)

def bdetail(request, blog_title):
    blog = Blog.objects.get(title = blog_title)
    
    context = {
        'page_title': 'Home',
        'cart_count': cartcount(request),
        'blog': blog
    }

    return render(request, 'blog-detail.html', context)

@login_required
def getcart(request):
    items = list(Cart.objects.filter(user = request.user).values('product', 'quantity'))
    for item in items:
        product = Product.objects.get(pk = item['product'])
        item['product'] = product.name
        item['thumbnail'] = str(product.thumbnail)
        item['price'] = product.price * (1 - product.sale_off / 100)
        item['sku'] = product.quantity
    return JsonResponse({'items': items})

@login_required
def addcart(request):
    try:
        product_name = request.GET['pname']
        quantity = int(request.GET['quantity'])
        product = Product.objects.get(name = product_name)
    except:
        return JsonResponse({'status': "Something wrong."})

    if quantity <= 0:
        return JsonResponse({'status': "Thang vo van hoa. Tao ban may nhe may."})
   
    try:
        dup_item = Cart.objects.get(user = request.user, product = product)
        if product.quantity - (quantity + dup_item.quantity) < 0:
            return JsonResponse({'status': "Sorry! We do not have enough quantity for you."})
        dup_item.quantity += quantity
        dup_item.save()
    except:
        if product.quantity - quantity < 0:
            return JsonResponse({'status': "Sorry! We do not have enough quantity for you."})
        new_item = Cart(user = request.user, product = product, quantity = quantity)
        new_item.save()

    result = {
        'status': "Add to cart successfully.",
        'cart_count': cartcount(request)
    }
    return JsonResponse(result)

@login_required
def updatecart(request):
    in_items = json.loads(request.POST['items'])

    for in_item in in_items:
        try:
            product = Product.objects.get(name = in_item['name'])
            item = Cart.objects.get(user = request.user, product = product)
        except:
            return JsonResponse({'status': "Something wrong."})

        if product.quantity == 0:
            item.delete()
        else:
            if int(in_item['quantity']) == 0:
                item.delete()
            else:
                if int(in_item['quantity']) > product.quantity:
                    item.quantity = product.quantity
                    item.save()
                else:
                    item.quantity = int(in_item['quantity'])
                    item.save()

    result = {
        'status': "Ok",
        'cart_count': cartcount(request)
    }
    return JsonResponse(result)

@login_required
def checkcart(request):
    items = Cart.objects.filter(user = request.user)
    for item in items:
        product = Product.objects.get(name = item.product)
        if product.quantity < item.quantity:
            return HttpResponse("invalid")

    return HttpResponse("valid")

@login_required
def cart(request):
    context = {
        'page_title': 'Cart',
        'cart_count': cartcount(request),
    }
    return render(request, 'cart.html', context)

@login_required
def updateuserinfo(request):
    try:
        request.user.name = request.POST['name']
        request.user.cell_phone = request.POST['phone']
        request.user.address = request.POST['address']
        request.user.save()
        return HttpResponse("success")
    except:
        return HttpResponse("error")

@login_required
def checkcoupon(request):
    try:
        coupon = Coupon.objects.get(code = request.POST['coupon'])
        if coupon.quantity > 0:
            result = {
                'status': "valid",
                'discount_type': coupon.discount_type,
                'percent': coupon.percent,
                'percent_max_amount': coupon.percent_max_amount,
                'amount': coupon.amount
            }
            return JsonResponse(result)    
        else:
            return JsonResponse({'status': "invalid"})
    except:
        return JsonResponse({'status': "invalid"})

@login_required
def checkout(request):
    if checkcart(request).content.decode("utf-8") == "invalid":
        return HttpResponseRedirect('/cart/')

    context = {
        'page_title': 'Checkout',
        'cart_count': cartcount(request),
    }
    return render(request, 'checkout.html', context)

def accountorder(request):
    return render(request, 'account-order.html')
