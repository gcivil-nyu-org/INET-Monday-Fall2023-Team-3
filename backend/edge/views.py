from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes
)
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


from .serializer import EdgeSerializer
from .models import Edge


def detail(msg: str, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"detail": msg}, status=status_code)


@api_view(["POST", "GET"])
def ping(request):
    return Response(data={"message": "pong"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_create(request):
    serializer = EdgeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_get(request, pk):
    try:
        edge = Edge.objects.get(pk=pk)
    except Edge.DoesNotExist:
        return detail("Edge does not exist", status_code=status.HTTP_404_NOT_FOUND)
    serializer = EdgeSerializer(edge)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_delete(request, pk):
    try:
        edge = Edge.objects.get(pk=pk)
    except Edge.DoesNotExist:
        return detail("Edge does not exist", status_code=status.HTTP_404_NOT_FOUND)
    else:
        edge.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
