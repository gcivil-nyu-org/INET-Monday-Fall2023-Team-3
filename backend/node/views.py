from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import NodeSerializer
from .models import Node
from graph.models import Graph


# Create your views here.
def detail(msg: str):
    return {"detail": msg}


NODE_PONG_MSG = detail("pong")
NODE_INVALID_FORMAT_MSG = detail("node format invalid")
NODE_ID_REQUIRED_MSG = detail("node id is missing")
NODE_ALREADY_EXISTS_MSG = detail("node with same id already exists")
NODE_NOT_FOUND_MSG = detail("node not found")

NODE_INVALID_FORMAT_RESPONSE = Response(
    NODE_INVALID_FORMAT_MSG, status=status.HTTP_400_BAD_REQUEST
)
NODE_ALREADY_EXISTS_RESPONSE = Response(
    NODE_ALREADY_EXISTS_MSG, status=status.HTTP_409_CONFLICT
)
NODE_ID_REQUIRED_RESPONSE = Response(
    NODE_ID_REQUIRED_MSG, status=status.HTTP_400_BAD_REQUEST
)
NODE_NOT_FOUND_RESPONSE = Response(NODE_NOT_FOUND_MSG, status=status.HTTP_404_NOT_FOUND)


# Ping
@api_view(["GET"])
def ping(request):
    return Response(NODE_PONG_MSG, status=status.HTTP_200_OK)


# Create node
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_create(request):
    serializer = NodeSerializer(data=request.data, partial=True)

    if not serializer.is_valid():
        print(1)
        return NODE_INVALID_FORMAT_RESPONSE

    # Extract the 'graph_id' from the request data,
    # assuming it's provided in the POST request.
    graph_id = serializer.validated_data.get("graph_id")

    # Check if the specified Graph exists.
    try:
        graph = Graph.objects.get(pk=graph_id)
    except Graph.DoesNotExist:
        return Response(
            {"message": "Graph does not exist."}, status=status.HTTP_400_BAD_REQUEST
        )
    serializer.validated_data["graph"] = graph

    node_id = serializer.validated_data.get("id")
    if Node.objects.filter(id=node_id).exists():
        return NODE_ALREADY_EXISTS_RESPONSE

    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)


# Get node
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_get(request, node_id):
    try:
        node = Node.objects.get(id=node_id)

        serializer = NodeSerializer(instance=node)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Node.DoesNotExist:
        return NODE_NOT_FOUND_RESPONSE


# Update Node
@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_update(request):
    serializer = NodeSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return NODE_ID_REQUIRED_RESPONSE
    node_id = serializer.validated_data.get("id")

    try:
        instance = Node.objects.get(id=node_id)
        serializer.instance = instance
        serializer.save()

        serializer = NodeSerializer(instance=serializer.instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Node.DoesNotExist:
        return NODE_NOT_FOUND_RESPONSE


# Delete Node
@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_delete(request, node_id):
    try:
        node = Node.objects.get(id=node_id)
        node.delete()
        return Response(status=status.HTTP_200_OK)
    except Node.DoesNotExist:
        return NODE_NOT_FOUND_RESPONSE
