from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from shared.view_helper import error, ok

from . import serializers
from .models import User

USER_PING_OK_MESSAGE = ok("user: pong")
USER_PING_OK_RESPONSE = Response(USER_PING_OK_MESSAGE, status=status.HTTP_200_OK)

# ping endpoint
USER_PING_PATH = "ping/"


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def user_ping(request: Request):
    return USER_PING_OK_RESPONSE


USER_SIGNUP_INVALID_FORMAT_MESSAGE = error("user: invalid format")
USER_SIGNUP_INVALID_FORMAT_RESPONSE = Response(
    USER_SIGNUP_INVALID_FORMAT_MESSAGE, status=status.HTTP_400_BAD_REQUEST
)

USER_SIGNUP_CONFLICT_MESSAGE = error("user: conflict")
USER_SIGNUP_CONFLICT_RESPONSE = Response(
    USER_SIGNUP_CONFLICT_MESSAGE, status=status.HTTP_409_CONFLICT
)

# signup endpoint
USER_SIGNUP_PATH = "signup/"


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def user_sign_up(request: Request):
    serializer = serializers.SignUpSerializer(data=request.data)
    # serializer invalid -> invalid format response
    if not serializer.is_valid():
        return USER_SIGNUP_INVALID_FORMAT_RESPONSE
    # user exists -> conflict response
    if serializer.user_exists():
        return USER_SIGNUP_CONFLICT_RESPONSE
    # create user instance
    instance = serializer.save()

    serializer = serializers.GetSerializer(instance=instance)
    user_data = serializer.data
    user_data["token"] = serializer.user_token()
    return Response(ok(user_data), status=status.HTTP_200_OK)


USER_LOGIN_INVALID_FORMAT_MESSAGE = error("user: invalid format")
USER_LOGIN_INVALID_FORMAT_RESPONSE = Response(
    USER_LOGIN_INVALID_FORMAT_MESSAGE, status=status.HTTP_400_BAD_REQUEST
)

USER_LOGIN_NOT_FOUND_MESSAGE = error("user: not found")
USER_LOGIN_NOT_FOUND_RESPONSE = Response(
    USER_LOGIN_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

USER_LOGIN_WRONG_PASSWORD_MESSAGE = error("user: wrong password")
USER_LOGIN_WRONG_PASSWORD_RESPONSE = Response(
    USER_LOGIN_WRONG_PASSWORD_MESSAGE, status=status.HTTP_401_UNAUTHORIZED
)

# login endpoint
USER_LOGIN_PATH = "login/"


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def user_login(request: Request):
    serializer = serializers.LoginSerializer(data=request.data)
    # serializer invalid -> invalid format response
    if not serializer.is_valid():
        return USER_LOGIN_INVALID_FORMAT_RESPONSE
    # user not found -> not found response
    if not serializer.user_exists():
        return USER_LOGIN_NOT_FOUND_RESPONSE
    # password incorrect -> wrong password response
    if not serializer.check_password():
        return USER_LOGIN_WRONG_PASSWORD_RESPONSE

    serializer = serializers.GetSerializer(instance=serializer.user_get())
    user_data = serializer.data
    user_data["token"] = serializer.user_token()
    return Response(ok(user_data), status=status.HTTP_200_OK)


# patch endpoint
USER_PATCH_PATH = "patch/"
USER_PATCH_PATH_FORMAT = "patch/"


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_patch(request: Request):
    serializer = serializers.PatchSerializer(
        instance=request.user,
        data=request.data,
        partial=True,
    )
    serializer.is_valid(raise_exception=True)
    instance = serializer.save()

    serializer = serializers.GetSerializer(instance=instance)
    return Response(ok(serializer.data), status=status.HTTP_200_OK)


USER_GET_NOT_FOUND_MESSAGE = error("user: not found")
USER_GET_NOT_FOUND_RESPONSE = Response(
    USER_GET_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# get endpoint
USER_GET_PATH = "get/<str:email>/"
USER_GET_PATH_FORMAT = "get/{email}/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_get(request: Request, email: str):
    instance = User.objects.filter(email=email).first()
    # user not found -> not found response
    if instance is None:
        return USER_GET_NOT_FOUND_RESPONSE

    serializer = serializers.GetSerializer(instance=instance)
    return Response(ok(serializer.data), status=status.HTTP_200_OK)


# get endpoint
USER_GET_SELF_PATH = "self/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_get_self(request: Request):
    instance = request.user
    serializer = serializers.GetSerializer(instance=instance)
    return Response(ok(serializer.data), status=status.HTTP_200_OK)


# get_all endpoint
USER_GET_ALL_PATH = "all/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_get_all(request: Request):
    serializer = serializers.GetSerializer(instance=User.objects.all(), many=True)
    return Response(ok(serializer.data), status=status.HTTP_200_OK)
