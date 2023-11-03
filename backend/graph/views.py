# Create your views here.
# Create your views here.

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .serializers import GraphSerializer
from .models import Graph


def detail(msg: str):
    return {"detail": msg}


GRAPH_400_RESPONSE = Response(
    detail("invalid request"), status=status.HTTP_400_BAD_REQUEST
)
GRAPH_401_RESPONSE = Response(
    detail("user unauthorized to view graph"), status=status.HTTP_401_UNAUTHORIZED
)
GRAPH_404_RESPONSE = Response(
    detail("graph does not exist on server"), status=status.HTTP_404_NOT_FOUND
)
GRAPH_409_RESPONSE = Response(
    detail("graph already exists"), status=status.HTTP_409_CONFLICT
)


@api_view(["GET"])
def ping(request):
    return Response(data={"message": "pong"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes(
    [AllowAny]
)  # Or use IsAuthenticated if you want to restrict it to logged-in users only.
def graph_list(request):
    graphs = Graph.objects.all()
    serializer = GraphSerializer(graphs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_get(request, graph_id):
    try:
        graph = Graph.objects.get(id=graph_id)
        serializer = GraphSerializer(instance=graph)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Graph.DoesNotExist:
        return GRAPH_404_RESPONSE


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
# @authentication_classes([AllowAny])
@permission_classes([IsAuthenticated])
# @permission_classes([AllowAny])
def graph_create(request):
    serializer = GraphSerializer(data=request.data)
    print("entered graph_create")
    if serializer.is_valid():
        print("serializer is valid!! not my fault")
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
    return GRAPH_400_RESPONSE

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_update(request):
    serializer = GraphSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return GRAPH_400_RESPONSE
    graph_id = serializer.validated_data.get("id")
    try:
        instance = Graph.objects.get(id=graph_id)
        if "nodes" in serializer.validated_data:
            new_nodes = serializer.validated_data.get("nodes")
            instance.nodes += new_nodes
        if "edges" in serializer.validated_data:
            new_edges = serializer.validated_data.get("edges")
            instance.edges += new_edges
        update_serializer = GraphSerializer(instance = instance)
        update_serializer.instance.save()
    except Graph.DoesNotExist:
        return GRAPH_404_RESPONSE

