from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    first_name = None
    last_name = None

    username =  models.CharField(max_length=255)# Here
    email = models.EmailField(max_length=255, unique=True) # changes email to unique and blank to false

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

