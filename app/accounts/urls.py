# accounts/urls.py
from django.urls import path

from .views import SignUpView

from .views import update_user_information


urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("update/", update_user_information, name='update')
]