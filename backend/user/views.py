from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import CustomUser
from .serializers import UserSerializer

# Create your views here.


def detail(msg: str):
    return {"detail": msg}


USER_PONG_MSG = detail("pong")
USER_INVALID_FORMAT_MSG = detail("user data format invalid")
USER_PASSWORD_MISMATCH_MSG = detail("user mismatch")
USER_NOT_FOUND_MSG = detail("user does not exist on server")
USER_ALREADY_EXISTS_MSG = detail("user already exists")

USER_400_RESPONSE = Response(
    USER_INVALID_FORMAT_MSG, status=status.HTTP_400_BAD_REQUEST
)
USER_401_RESPONSE = Response(
    USER_PASSWORD_MISMATCH_MSG, status=status.HTTP_401_UNAUTHORIZED
)
USER_404_RESPONSE = Response(USER_NOT_FOUND_MSG, status=status.HTTP_404_NOT_FOUND)
USER_409_RESPONSE = Response(USER_ALREADY_EXISTS_MSG, status=status.HTTP_409_CONFLICT)


# Ping
@api_view(["GET"])
def ping(request):
    return Response(USER_PONG_MSG, status=status.HTTP_200_OK)


# Create user
@api_view(["POST"])
def user_create(request):
    serializer = UserSerializer(data=request.data)

    if not serializer.is_valid():
        return USER_400_RESPONSE

    if CustomUser.objects.filter(email=serializer.validated_data.get("email")).exists():
        return USER_409_RESPONSE

    serializer.save()
    user_token = Token.objects.create(user=serializer.instance)
    return Response({"token": user_token.key}, status=status.HTTP_200_OK)


# User login
@api_view(["POST"])
def user_login(request):
    serializer = UserSerializer(data=request.data, partial=True)

    if not serializer.is_valid():
        return USER_400_RESPONSE

    try:
        user = CustomUser.objects.get(email=serializer.validated_data.get("email"))
    except CustomUser.DoesNotExist:
        return USER_404_RESPONSE

    password = serializer.validated_data.get("password")
    if password is None:
        return USER_400_RESPONSE

    if user.password != password:
        return USER_401_RESPONSE

    user_token = Token.objects.get_or_create(user=user)[0]
    return Response({"token": user_token.key}, status=status.HTTP_200_OK)


# Get full user information, need authentication
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_get(request):
    serializer = UserSerializer(instance=request.user)
    data = serializer.data
    data.pop("password")
    return Response(data, status=status.HTTP_200_OK)


# Update user
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_update(request):
    user: CustomUser = request.user
    serializer = UserSerializer(data=request.data, partial=True)

    if not serializer.is_valid():
        return USER_400_RESPONSE

    if user.email != serializer.validated_data.get("email"):
        return USER_401_RESPONSE

    next_username = serializer.validated_data.get("username")
    if next_username is not None:
        user.username = next_username

    next_password = serializer.validated_data.get("password")
    if next_password is not None:
        user.password = next_password

    user.save()

    data = serializer.data
    data.pop("password")

    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_list(request):
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
