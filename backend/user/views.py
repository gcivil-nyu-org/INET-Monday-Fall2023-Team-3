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

from django.contrib.auth.models import User

from .serializers import UserSerializer


def detail(msg: str):
    return {"detail": msg}


USER_400_RESPONSE = Response(
    detail("user data format invalid"), status=status.HTTP_400_BAD_REQUEST
)
USER_401_RESPONSE = Response(
    detail("user password does not match"), status=status.HTTP_401_UNAUTHORIZED
)
USER_404_RESPONSE = Response(
    detail("user does not exist on server"), status=status.HTTP_404_NOT_FOUND
)
USER_409_RESPONSE = Response(
    detail("user already exists"), status=status.HTTP_409_CONFLICT
)


# Ping
@api_view(["POST"])
def ping(request):
    return Response(data={"message": "pong"}, status=status.HTTP_200_OK)


# Create user
@api_view(["POST"])
def user_signup(request):
    serializer = UserSerializer(data=request.data)

    if not serializer.is_valid():
        return USER_400_RESPONSE

    if User.objects.filter(email=serializer.validated_data.get("email")).exists():
        return USER_409_RESPONSE

    serializer.save()
    token = Token.objects.create(user=serializer.instance)

    return Response({ "token": token.key }, status=status.HTTP_201_CREATED)


# User login
@api_view(["POST"])
def user_login(request):
    serializer = UserSerializer(data=request.data, partial=True)

    if not serializer.is_valid():
        return USER_400_RESPONSE

    try:
        user = User.objects.get(email=serializer.validated_data.get("email"))
    except User.DoesNotExist:
        return USER_404_RESPONSE

    if serializer.validated_data.get("password") != user.password:
        return USER_401_RESPONSE

    try:
        token = Token.objects.get(user=user)
    except Token.DoesNotExist:
        token = Token.objects.create(user=user)

    return Response({ "token": token.key }, status=status.HTTP_200_OK)


# Update user profile
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_update(request):
    serializer = UserSerializer(data=request.data)

    if not serializer.is_valid():
        return USER_400_RESPONSE

    try:
        user = User.objects.get(email=serializer.validated_data.get("email"))
    except User.DoesNotExist:
        return USER_404_RESPONSE

    serializer.instance = user
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)
