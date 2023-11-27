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
        graph = Graph.objects.get(pk=graph_id)
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
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
    return GRAPH_400_RESPONSE


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_delete(request, graph_id):
    try:
        graph_to_be_deleted = Graph.objects.get(pk=graph_id)
        nodes = graph_to_be_deleted.nodes.all()
        edges = graph_to_be_deleted.edges.all()
        for node in nodes:
            # not passing a request through the node_delete endpoint
            # because it is not necessary
            if node.predefined:  # if the node is predefined, do not delete it
                continue
            node.delete()
        for edge in edges:
            edge.delete()
        graph_to_be_deleted.delete()
        return Response(status=status.HTTP_200_OK)
    except Graph.DoesNotExist:
        return GRAPH_404_RESPONSE


@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_update_add(request):
    # the request data contains the graph id and entire nodes or edges
    # need the ids only
    data = request.data
    print(data)
    if "nodes" in request.data:
        # strip out the ids from the nodes
        data["nodes"] = [node["id"] for node in request.data["nodes"]]
    if "edges" in request.data:
        # strip out the ids from the edges
        data["edges"] = [edge["id"] for edge in request.data["edges"]]
    graph_id = data.get("id")
    try:
        instance = Graph.objects.get(id=graph_id)
        if "nodes" in data:
            # if the request is for adding a new node
            new_nodes = data.get("nodes")
            instance.nodes.add(*new_nodes)
        if "edges" in data:
            # if the request is for adding a new edge
            new_edges = data.get("edges")
            instance.edges.add(*new_edges)
        instance.save()
        return Response(status=status.HTTP_200_OK)
    except Graph.DoesNotExist:
        return GRAPH_404_RESPONSE


@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_update_delete(request):
    data = request.data
    if "nodes" in request.data:
        # strip out the ids from the nodes
        data["nodes"] = [node["id"] for node in request.data["nodes"]]
    if "edges" in request.data:
        # strip out the ids from the edges
        data["edges"] = [edge["id"] for edge in request.data["edges"]]
    graph_id = data.get("id")

    try:
        instance = Graph.objects.get(id=graph_id)
        if "nodes" in data:
            # if the request is for adding a new node
            nodes_to_be_deleted = data.get("nodes")
            for node in nodes_to_be_deleted:
                instance.nodes.remove(node)
        if "edges" in data:
            # if the request is for adding a new edge
            edges_to_be_deleted = data.get("edges")
            for edge in edges_to_be_deleted:
                instance.edges.remove(edge)
        instance.save()
        return Response(status=status.HTTP_200_OK)
    except Graph.DoesNotExist:
        return GRAPH_404_RESPONSE


@api_view(["Get"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_list_get(request, user_email):
    graph_id_title_list = Graph.objects.filter(user__email=user_email).values_list(
        "id", "title",
    )
    graph_id_title_list = list(graph_id_title_list)
    for i in range(len(graph_id_title_list)):
        graph_id_title_list[i] = [
            str(graph_id_title_list[i][0]),
            graph_id_title_list[i][1],
        ]
    print(graph_id_title_list)
    return Response({"graph_list": graph_id_title_list}, status=status.HTTP_200_OK)


@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_position_set(request):
    new_node_position = request.data
    try:
        graph_instance = Graph.objects.get(id=new_node_position["graph_id"])
        node_position_list = graph_instance.node_positions

        flag = False
        for d in node_position_list:
            if d["id"] == new_node_position["node_id"]:
                flag = True
                d["x"] = new_node_position["x"]
                d["y"] = new_node_position["y"]
        if not flag:  # new node
            node_position_list.append(
                {
                    "id": new_node_position["node_id"],
                    "x": new_node_position["x"],
                    "y": new_node_position["y"],
                }
            )
        graph_instance.node_positions = node_position_list
        graph_instance.save()
        return Response(status=status.HTTP_200_OK)
    except Graph.DoesNotExist:
        return GRAPH_404_RESPONSE


@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_title_set(request):
    new_title = request.data["title"]
    try:
        graph_instance = Graph.objects.get(id=request.data["id"])
        graph_instance.title = new_title
        graph_instance.save()
        return Response(status=status.HTTP_200_OK)
    except Graph.DoesNotExist:
        return GRAPH_404_RESPONSE
