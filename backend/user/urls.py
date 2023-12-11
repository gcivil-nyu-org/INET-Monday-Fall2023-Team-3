from django.urls import path

from . import views

app_name = "user"

urlpatterns = [
    path(views.USER_PING_PATH, views.user_ping, name="ping"),
    path(views.USER_SIGNUP_PATH, views.user_sign_up, name="signup"),
    path(views.USER_LOGIN_PATH, views.user_login, name="login"),
    path(views.USER_PATCH_PATH, views.user_patch, name="patch"),
    path(views.USER_GET_PATH, views.user_get, name="get"),
    path(views.USER_GET_SELF_PATH, views.user_get_self, name="get-self"),
    path(views.USER_GET_ALL_PATH, views.user_get_all, name="all"),
]
