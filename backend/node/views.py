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


def detail(msg: str):
    return {"detail": msg}


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


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_edit(request):
    serializer = NodeSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    try:
        node = Node.objects.get(node_id=request.data["node_id"])
    except Node.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer.instance = node
    serializer.save()
    return Response(serializer.data)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_delete(request):
    print(request.data)
    try:
        node = Node.objects.get(node_id=request.data["node_id"])
    except Node.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    node.delete()
    return Response(
        detail("Node deleted successfully"), status=status.HTTP_204_NO_CONTENT
    )
