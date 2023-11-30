from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator

# Create your models here.


class CustomUser(AbstractUser):
    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        "username",
        max_length=150,
        help_text="Required. max 150 characters. Letters, digits and @/./+/-/_ only.",
        validators=[username_validator],
    )
    email = models.EmailField(
        "email address",
        unique=True,
        help_text="Required.",
        error_messages={
            "unique": "A user with this email address already exists",
        },
    )
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    graphs = None

    def set_username(self, username):
        self.username = username
