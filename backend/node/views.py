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

from .models import Node
from .serializers import NodeSerializer

NODE_PING_OK_MESSAGE = ok("node: ok")
NODE_PING_OK_RESPONSE = Response(NODE_PING_OK_MESSAGE, status=status.HTTP_200_OK)

# ping endpoint
NODE_PING_PATH = "ping/"


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def node_ping(request: Request):
    return NODE_PING_OK_RESPONSE


NODE_CREATE_INVALID_FORMAT_MESSAGE = error("node: invalid format")
NODE_CREATE_INVALID_FORMAT_RESPONSE = Response(
    NODE_CREATE_INVALID_FORMAT_MESSAGE, status=status.HTTP_400_BAD_REQUEST
)

# create endpoint
NODE_CREATE_PATH = "create/"


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_create(request: Request):
    return handle_create(
        create_data=request.data,
        serializer_class=NodeSerializer,
        invalid_format_response=NODE_CREATE_INVALID_FORMAT_RESPONSE,
    )


NODE_GET_NOT_FOUND_MESSAGE = error("node: not found")
NODE_GET_NOT_FOUND_RESPONSE = Response(
    NODE_GET_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# get endpoint
NODE_GET_PATH = "get/<str:node_id>/"
NODE_GET_PATH_FORMAT = "get/{node_id}/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_get(request: Request, node_id: str):
    return handle_get(
        model_class=Node,
        instance_identifier={"id": node_id},
        serializer_class=NodeSerializer,
        not_found_response=NODE_GET_NOT_FOUND_RESPONSE,
    )


NODE_PATCH_NOT_FOUND_MESSAGE = error("node: not found")
NODE_PATCH_NOT_FOUND_RESPONSE = Response(
    NODE_PATCH_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# patch endpoint
NODE_PATCH_PATH = "patch/<str:node_id>/"
NODE_PATCH_PATH_FORMAT = "patch/{node_id}/"


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_patch(request: Request, node_id: str):
    return handle_patch(
        model_class=Node,
        instance_identifier={"id": node_id},
        patch_data=request.data,
        patch_serializer_class=NodeSerializer,
        not_found_response=NODE_PATCH_NOT_FOUND_RESPONSE,
    )


NODE_DELETE_NOT_FOUND_MESSAGE = error("node: not found")
NODE_DELETE_NOT_FOUND_RESPONSE = Response(
    NODE_DELETE_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# delete endpoint
NODE_DELETE_PATH = "delete/<str:node_id>/"
NODE_DELETE_PATH_FORMAT = "delete/{node_id}/"


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_delete(request: Request, node_id: str):
    return handle_delete(
        model_class=Node,
        instance_identifier={"id": node_id},
        not_found_response=NODE_DELETE_NOT_FOUND_RESPONSE,
    )


# get predefined endpoint
NODE_GET_PREDEFINED_PATH = "predefined/all/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_get_predefined(request: Request):
    predefined_nodes = Node.objects.filter(predefined=True).all()
    serializer = NodeSerializer(instance=predefined_nodes, many=True)
    return Response(ok(serializer.data), status=status.HTTP_200_OK)
