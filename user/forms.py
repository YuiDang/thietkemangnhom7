from django import forms
from .models import CustomUser
from allauth.account.forms import SignupForm
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError

class CustomSignupForm(forms.Form):
    alphabet = "a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ"
    name_regex = "^["+ alphabet +"]+(([',. -]["+ alphabet +" ])?["+ alphabet +"]*)*$"
    name = forms.CharField(max_length = 150)
    cell_phone = forms.CharField(min_length = 10, max_length = 10,
        validators=[RegexValidator('^0\d{9}$', message = 'Enter a valid cell phone number.')])
    city = forms.CharField(max_length = 50)
    district = forms.CharField(max_length = 50)
    address = forms.CharField(max_length = 150)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'cell_phone', 'city', 'district', 'address']
