from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    username = models.CharField(
        "username",
        max_length=150,
        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        validators=[super.username_validator],
    )
    email = models.EmailField(
        "email address",
        unique=True,
        help_text="Required.",
        error_messages={
            "unique": "A user with this email address already exists",
        }
    )
    REQUIRED_FIELDS = ["email", "username"]
