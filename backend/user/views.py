from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import CustomUser
from .serializers import UserSerializer

# Create your views here.

def detail(msg: str):
    return  { "detail": msg }

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
@api_view(["GET"])
def ping(request):
    return Response(detail("pong"), status=status.HTTP_200_OK)

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
    return Response({ "token": user_token.key }, status=status.HTTP_200_OK)

# User login
@api_view(["POST"])
def user_login(request):
    serializer = UserSerializer(data=request.data)

    if not serializer.is_valid():
        return USER_400_RESPONSE

    try:
        user = CustomUser.objects.get(email=serializer.validated_data.get("email"))
    except CustomUser.DoesNotExist:
        return USER_404_RESPONSE

    user_token = Token.objects.get_or_create(user=user)[0]
    return Response({ "token": user_token.key }, status=status.HTTP_200_OK)

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
    serializer = UserSerializer(data=request.data, partial=True)

    if not serializer.is_valid():
        return USER_400_RESPONSE

    try:
        user = CustomUser.objects.get(email=serializer.validated_data.get("email"))
    except CustomUser.DoesNotExist:
        return USER_404_RESPONSE

    serializer.instance = user
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)
