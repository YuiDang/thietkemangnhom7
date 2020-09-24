from django.shortcuts import render, redirect
from django.shortcuts import HttpResponse
import json
from .forms import UserPaymentInfoForm
from .models import CustomUser
from django.contrib.auth.decorators import login_required

@login_required
def paymentinfo(request):
    if request.method == 'POST':
        form = UserPaymentInfoForm(request.POST)

        if form.is_valid():
            user = request.user
            matched_user = CustomUser.objects.filter(cell_phone = form.cleaned_data.get('cell_phone')).first()
            if matched_user and matched_user != user:
                form.add_error('cell_phone', 'A user with that cell phone number already exists.')
            else:
                user.first_name = form.cleaned_data.get('first_name')
                user.last_name = form.cleaned_data.get('last_name')
                user.cell_phone = form.cleaned_data.get('cell_phone')
                user.city = form.cleaned_data.get('city')
                user.district = form.cleaned_data.get('district')
                user.address = form.cleaned_data.get('address')
                user.save()
                return redirect('flowershop-home')
    else:
        form = UserPaymentInfoForm()

    return render(request, '../templates/user/paymentinfo.html', {'form': form})
