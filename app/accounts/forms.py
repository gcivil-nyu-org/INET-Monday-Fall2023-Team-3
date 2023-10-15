from django import forms
from .models import CustomUser
from django.contrib.auth.forms import UserCreationForm
import re

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password1','password2']


    def clean_email(self):
        email = self.cleaned_data.get("email")
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("Email is already registered")
        # Validating the email
        email_regex = re.compile(r'^[a-zA-Z0-9_.+-]+@nyu\.edu$')
        if bool(email_regex.match(email)) == False:
            raise forms.ValidationError("Invalid Email Address: The provided email address is not associated with NYU. Please ensure you're using an email that ends with @nyu.edu.")
        return email
    


class UpdateUserInfoForm(forms.ModelForm):
    username = forms.CharField(required=True, widget=forms.TextInput())

    class Meta:
        model = CustomUser
        fields = ['username']

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if CustomUser.objects.filter(username=username).exists():
            raise forms.ValidationError("Username is already registered")
        return username


