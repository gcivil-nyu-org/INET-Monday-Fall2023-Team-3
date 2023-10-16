from django.urls import reverse_lazy
from django.views import generic
from .forms import RegisterForm

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from .forms import UpdateUserInfoForm
from django.shortcuts import render, redirect

class SignUpView(generic.CreateView):
    form_class = RegisterForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

@login_required
def update_user_information(request):
    if request.method == 'POST':
        user_form = UpdateUserInfoForm(request.POST, instance=request.user)

        if user_form.is_valid():
            # logout user for new user info login
            logout(request)
            # save new user info
            user = user_form.save()
            password = user_form.cleaned_data.get("password2")
            if password:
                user.set_password(password)
                user.save()
            messages.success(request, 'Your profile has been udpated')
            return redirect(to='login')
    else:
        user_form = UpdateUserInfoForm(instance=request.user)
    
    return render(request, 'registration/profile.html', {'user_form': user_form, 'user_email': request.user.email})