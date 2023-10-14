from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
import re

class RegisterForm(UserCreationForm):
    
    class Meta:
        model=User
        fields = ['username','email','password1','password2'] 

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Username is already registered")
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get("email")
        # check exist email
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email is already registered")
        # validate email
        email_regex = re.compile(r'^[a-zA-Z0-9_.+-]+@nyu\.edu$')
        if bool(email_regex.match(email)) == False:
            raise forms.ValidationError("Invalid Email Address: The provided email address is not associated with NYU. Please ensure you're using an email that ends with @nyu.edu.")
        return email
    

class UpdateUserInfoForm(forms.ModelForm):
    username = forms.CharField(required=True, widget=forms.TextInput())
    email = forms.EmailField(required=True, widget=forms.TextInput())

    class Meta:
        model = User
        fields = ['username', 'email']
