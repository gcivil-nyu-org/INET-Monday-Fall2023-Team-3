from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import EdgeSerializer
from .models import Edge


# Create your views here.
def detail(msg: str):
    return {"detail": msg}


EDGE_PONG_MSG = detail("pong")
EDGE_INVALID_FORMAT_MSG = detail("edge format invalid")
EDGE_ID_ALREADY_EXISTS_MSG = detail("edge with same id already exists")
EDGE_NOT_FOUND_MSG = detail("edge not found")

EDGE_PONG_RESPONSE = Response(EDGE_PONG_MSG, status=status.HTTP_200_OK)
EDGE_INVALID_FORMAT_RESPONSE = Response(
    EDGE_INVALID_FORMAT_MSG, status=status.HTTP_400_BAD_REQUEST
)
EDGE_ID_ALREADY_EXISTS_RESPONSE = Response(
    EDGE_ID_ALREADY_EXISTS_MSG, status=status.HTTP_409_CONFLICT
)
EDGE_NOT_FOUND_RESPONSE = Response(EDGE_NOT_FOUND_MSG, status=status.HTTP_404_NOT_FOUND)


# Ping
@api_view(["GET"])
def ping(request):
    return EDGE_PONG_RESPONSE


# Create edge
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_create(request):
    serializer = EdgeSerializer(data=request.data)

    if not serializer.is_valid():
        return EDGE_INVALID_FORMAT_RESPONSE

    edge_id = serializer.validated_data.get("id")
    if Edge.objects.filter(id=edge_id).exists():
        return EDGE_ID_ALREADY_EXISTS_RESPONSE

    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)


# Get edge
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_get(request, edge_id):
    try:
        edge = Edge.objects.get(id=edge_id)

        serializer = EdgeSerializer(instance=edge)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Edge.DoesNotExist:
        return EDGE_NOT_FOUND_RESPONSE


# Update edge
@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_update(request):
    serializer = EdgeSerializer(data=request.data)

    if not serializer.is_valid():
        return EDGE_INVALID_FORMAT_RESPONSE
    edge_id = serializer.validated_data.get("id")

    try:
        instance = Edge.objects.get(id=edge_id)

        serializer.instance = instance
        serializer.save()

        serializer = EdgeSerializer(instance=serializer.instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Edge.DoesNotExist:
        return EDGE_NOT_FOUND_RESPONSE


# Delete edge
@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_delete(request, edge_id):
    try:
        edge = Edge.objects.get(id=edge_id)
        edge.delete()
        return Response(status=status.HTTP_200_OK)
    except Edge.DoesNotExist:
        return EDGE_NOT_FOUND_RESPONSE
