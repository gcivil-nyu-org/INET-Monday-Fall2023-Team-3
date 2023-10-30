from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import NodeSerializer
from .models import Node


@api_view(["POST"])
def ping(request):
    return Response(data={"message": "pong"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes(
    [AllowAny]
)  # Or use IsAuthenticated if you want to restrict it to logged-in users only.
def node_list(request):
    nodes = Node.objects.all()
    serializer = NodeSerializer(nodes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes(
    [AllowAny]
)  # Or use IsAuthenticated if you want to restrict it to logged-in users only.
def predefined_node_list(request):
    predefined_nodes = Node.objects.filter(isPredefined=True)
    serializer = NodeSerializer(predefined_nodes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_create(request):
    serializer = NodeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
