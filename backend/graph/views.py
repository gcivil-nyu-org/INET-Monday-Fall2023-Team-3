import json

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from shared.view_helper import (
    error,
    handle_create,
    handle_delete,
    handle_get,
    handle_patch,
    ok,
)

from .models import Graph, NodePosition
from .pusher import pusher_client
from .serializers import GraphPatchSerializer, GraphSerializer, NodePositionSerializer

GRAPH_PING_OK_MESSAGE = ok("graph: ok")
GRAPH_PING_OK_RESPONSE = Response(GRAPH_PING_OK_MESSAGE, status=status.HTTP_200_OK)

# ping endpoint
GRAPH_PING_PATH = "ping/"


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def graph_ping(request: Request):
    return GRAPH_PING_OK_RESPONSE


GRAPH_CREATE_INVALID_FORMAT_MESSAGE = error("graph: invalid format")
GRAPH_CREATE_INVALID_FORMAT_RESPONSE = Response(
    GRAPH_CREATE_INVALID_FORMAT_MESSAGE, status=status.HTTP_400_BAD_REQUEST
)

# create endpoint
GRAPH_CREATE_PATH = "create/"


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_create(request: Request):
    return handle_create(
        create_data=request.data,
        serializer_class=GraphSerializer,
        invalid_format_response=GRAPH_CREATE_INVALID_FORMAT_RESPONSE,
    )


GRAPH_GET_NOT_FOUND_MESSAGE = error("graph: not found")
GRAPH_GET_NOT_FOUND_RESPONSE = Response(
    GRAPH_GET_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# get endpoint
GRAPH_GET_PATH = "get/<str:graph_id>/"
GRAPH_GET_PATH_FORMAT = "get/{graph_id}/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_get(request: Request, graph_id: str):
    return handle_get(
        model_class=Graph,
        instance_identifier={"id": graph_id},
        serializer_class=GraphSerializer,
        not_found_response=GRAPH_GET_NOT_FOUND_RESPONSE,
    )


GRAPH_PATCH_NOT_FOUND_MESSAGE = error("graph: not found")
GRAPH_PATCH_NOT_FOUND_RESPONSE = Response(
    GRAPH_PATCH_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# patch endpoint
GRAPH_PATCH_PATH = "patch/<str:graph_id>/"
GRAPH_PATCH_PATH_FORMAT = "patch/{graph_id}/"


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_patch(request: Request, graph_id: str):
    return handle_patch(
        model_class=Graph,
        instance_identifier={"id": graph_id},
        patch_data=request.data,
        patch_serializer_class=GraphPatchSerializer,
        result_serializer_class=GraphSerializer,
        not_found_response=GRAPH_PATCH_NOT_FOUND_RESPONSE,
    )


GRAPH_DELETE_NOT_FOUND_MESSAGE = error("graph: not found")
GRAPH_DELETE_NOT_FOUND_RESPONSE = Response(
    GRAPH_DELETE_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# delete endpoint
GRAPH_DELETE_PATH = "delete/<str:graph_id>/"
GRAPH_DELETE_PATH_FORMAT = "delete/{graph_id}/"


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_delete(request: Request, graph_id: str):
    graph = Graph.objects.filter(id=graph_id).first()
    # graph not found -> not found response
    if graph is None:
        return GRAPH_DELETE_NOT_FOUND_RESPONSE
    # delete nodes in graph
    for node in graph.nodes.all():
        if not node.predefined:
            node.delete()
    # delete edges in graph
    for edge in graph.edges.all():
        edge.delete()
    graph.delete()
    return Response(ok({}), status=status.HTTP_200_OK)


# share endpoint
GRAPH_SHARE_PATH = "share/<str:graph_id>/"
GRAPH_SHARE_PATH_FORMAT = "share/{graph_id}/"


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_share(request: Request, graph_id: str):
    response = handle_patch(
        model_class=Graph,
        instance_identifier={"id": graph_id},
        patch_data=request.data,
        patch_serializer_class=GraphPatchSerializer,
        result_serializer_class=GraphSerializer,
        not_found_response=GRAPH_PATCH_NOT_FOUND_RESPONSE,
    )
    if response.status_code == 200:
        data = json.loads(json.dumps(response.data, default=str))
        pusher_client.trigger("graph-channel", "new-graph-share", data)
    return response


NODE_POSITION_CREATE_INVALID_FORMAT_MESSAGE = error("node_position: invalid format")
NODE_POSITION_CREATE_INVALID_FORMAT_RESPONSE = Response(
    NODE_POSITION_CREATE_INVALID_FORMAT_MESSAGE, status=status.HTTP_400_BAD_REQUEST
)

# create endpoint
NODE_POSITION_CREATE_PATH = "node-position/create/"


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_position_create(request: Request):
    return handle_create(
        create_data=request.data,
        serializer_class=NodePositionSerializer,
        invalid_format_response=NODE_POSITION_CREATE_INVALID_FORMAT_RESPONSE,
    )


NODE_POSITION_PATCH_NOT_FOUND_MESSAGE = error("node_position: not found")
NODE_POSITION_PATCH_NOT_FOUND_RESPONSE = Response(
    NODE_POSITION_PATCH_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# patch endpoint
NODE_POSITION_PATCH_PATH = "node-position/patch/<str:graph_id>/<str:node_id>/"
NODE_POSITION_PATCH_PATH_FORMAT = "node-position/patch/{graph_id}/{node_id}/"


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_position_patch(request: Request, graph_id: str, node_id: str):
    return handle_patch(
        model_class=NodePosition,
        instance_identifier={"graph_id": graph_id, "node_id": node_id},
        patch_data=request.data,
        patch_serializer_class=NodePositionSerializer,
        not_found_response=NODE_POSITION_PATCH_NOT_FOUND_RESPONSE,
    )


NODE_POSITION_DELETE_NOT_FOUND_MESSAGE = error("node_position: not found")
NODE_POSITION_DELETE_NOT_FOUND_RESPONSE = Response(
    NODE_POSITION_DELETE_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# delete endpoint
NODE_POSITION_DELETE_PATH = "node-position/delete/<str:graph_id>/<str:node_id>/"
NODE_POSITION_DELETE_PATH_FORMAT = "node-position/delete/{graph_id}/{node_id}/"


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_position_delete(request: Request, graph_id: str, node_id: str):
    return handle_delete(
        model_class=NodePosition,
        instance_identifier={"graph_id": graph_id, "node_id": node_id},
        not_found_response=NODE_POSITION_DELETE_NOT_FOUND_RESPONSE,
    )
