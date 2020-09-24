from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.html import mark_safe
from django.core.exceptions import ValidationError
from user.models import CustomUser

class Tag(models.Model):
    name = models.CharField(max_length = 50, unique = True)

    def __str__(self):
        return self.name

class Topic(models.Model):
    name = models.CharField(max_length = 150, unique = True)
    image = models.ImageField(upload_to = 'topic_image')
    tags = models.ManyToManyField(Tag, blank = True)

    def __str__(self):
        return self.name

    def show_image(self):
        return mark_safe('<img src="/media/%s" width="100" height="auto"/>' % self.image)
    show_image.short_description = ''

    def get_tags(self):
        return ", ".join([t.name for t in self.tags.all()])
    get_tags.short_description = 'tags'

class Category(models.Model):
    name = models.CharField(max_length = 150, unique = True)

    def __str__(self):
        return self.name

class Product(models.Model):
    categories = models.ManyToManyField(Category)
    topics = models.ManyToManyField(Topic)
    name = models.CharField(max_length = 150, unique = True)
    thumbnail = models.ImageField(upload_to = 'product_thumbnail')
    summary = models.TextField(blank = True, null = True)
    description = RichTextUploadingField(blank = True, null = True)
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
    sale_off = models.PositiveSmallIntegerField(default = 0, validators = [MaxValueValidator(100)])
    tags = models.ManyToManyField(Tag, blank = True)
    posted_date = models.DateField(auto_now_add = True)

    def __str__(self):
        return self.name

    def clean(self):
        if self.price == 0 or self.price % 1000 != 0:
            raise ValidationError('Price must be greater than or equal to 1000 and divisible by 1000.', code='invalid-price')

    def get_topics(self):
        return ", ".join([t.name for t in self.topics.all()])
    get_topics.short_description = 'topics'

    def get_categories(self):
        return ", ".join([c.name for c in self.categories.all()])
    get_categories.short_description = 'categories'

    def get_tags(self):
        return ", ".join([t.name for t in self.tags.all()])
    get_tags.short_description = 'tags'

    def show_thumbnail(self):
        return mark_safe('<img src="/media/%s" width="100" height="auto"/>' % self.thumbnail)
    show_thumbnail.short_description = ''

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    image = models.ImageField(upload_to = 'product_image')

    def __str__(self):
        return ''

    def show_image(self):
        return mark_safe('<img src="/media/%s" width="100" height="auto"/>' % self.image)
    show_image.short_description = ''

class Blog(models.Model):
    title = models.CharField(max_length = 150, unique = True)
    brief = models.TextField()
    background = models.ImageField(upload_to = 'blog_background')
    content = RichTextUploadingField()
    posted_date = models.DateField(auto_now_add = True)
    tags = models.ManyToManyField(Tag, blank = True)

    def __str__(self):
        return self.title

    def show_background(self):
        return mark_safe('<img src="/media/%s" width="100" height="auto"/>' % self.background)
    show_background.short_description = ''

    def get_tags(self):
        return ", ".join([t.name for t in self.tags.all()])
    get_tags.short_description = 'tags'

COUPON_TYPE_CHOICES = (
    (0, 'Percent'),
    (1, 'Amount'),
)

class Coupon(models.Model):
    code = models.CharField(max_length = 6, unique = True)
    discount_type = models.PositiveSmallIntegerField(default = 0, choices = COUPON_TYPE_CHOICES)
    percent = models.PositiveSmallIntegerField(validators = [MaxValueValidator(100)], null = True, blank = True)
    percent_max_amount = models.PositiveIntegerField(null = True, blank = True)
    amount = models.PositiveIntegerField(null = True, blank = True)
    quantity = models.PositiveIntegerField(validators = [MinValueValidator(1)])

    def __str__(self):
        return self.code

    def clean(self):
        if self.discount_type == 0:
            if not (type(self.percent) is int) or self.percent <= 0 or not (type(self.percent_max_amount) is int) or self.percent_max_amount <= 0:
                raise ValidationError('Invalid coupon.', code='invalid-coupon')
        else:
            if not (type(self.amount) is int) or self.amount <= 0:
                raise ValidationError('Invalid coupon.', code='invalid-coupon')

ORDER_STATUS_CHOICES = (
    (0, 'Waiting for confirmation'),
    (1, 'Confirmed - processing'),
    (2, 'Delivering'),
    (3, 'Delivered'),
)

class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    created_time = models.DateTimeField(auto_now_add = True)
    status = models.PositiveSmallIntegerField(default = 0, choices = ORDER_STATUS_CHOICES)

    def __str__(self):
        return self.user.email

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    quantity = models.PositiveSmallIntegerField()
    price = models.PositiveIntegerField()
    rate = models.PositiveSmallIntegerField(validators = [MinValueValidator(1), MaxValueValidator(5)], blank = True, null = True)
    comment = models.TextField(blank = True, null = True)

    def __str__(self):
        return ''

class Cart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    quantity = models.PositiveSmallIntegerField()