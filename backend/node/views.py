from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .serializers import NodeSerializer
from .models import Node


def detail(msg: str, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"detail": msg}, status=status_code)


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
@permission_classes([AllowAny])
def predefined_node_list(request):
    nodes = Node.objects.filter(isPredefined=True)
    serializer = NodeSerializer(nodes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def node_create(request):
    serializer = NodeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def node_edit(request):
    serializer = NodeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes(
    [AllowAny]
)  # Or use IsAuthenticated if you want to restrict it to logged-in users only.
def node_detail(request, pk):
    try:
        node = Node.objects.get(pk=pk)
    except Node.DoesNotExist:
        return detail("Node does not exist", status_code=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = NodeSerializer(node)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = NodeSerializer(node, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return detail("Node data format invalid")

    elif request.method == "DELETE":
        node.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
