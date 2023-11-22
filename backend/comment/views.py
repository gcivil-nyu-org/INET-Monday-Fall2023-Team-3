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

from .models import GraphComment, NodeComment
from .serializers import GraphCommentSerializer, NodeCommentSerializer

COMMENT_PING_OK_MESSAGE = ok("comment: ok")
COMMENT_PING_OK_RESPONSE = Response(COMMENT_PING_OK_MESSAGE, status=status.HTTP_200_OK)

# ping endpoint
COMMENT_PING_PATH = "ping/"


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def comment_ping(request: Request):
    return COMMENT_PING_OK_RESPONSE


NODE_COMMENT_CREATE_INVALID_FORMAT_MESSAGE = error("node_comment: invalid format")
NODE_COMMENT_CREATE_INVALID_FORMAT_RESPONSE = Response(
    NODE_COMMENT_CREATE_INVALID_FORMAT_MESSAGE, status=status.HTTP_400_BAD_REQUEST
)

# create endpoint
NODE_COMMENT_CREATE_PATH = "node/create/"


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_comment_create(request: Request):
    return handle_create(
        create_data=request.data,
        serializer_class=NodeCommentSerializer,
        invalid_format_response=NODE_COMMENT_CREATE_INVALID_FORMAT_RESPONSE,
    )


NODE_COMMENT_GET_NOT_FOUND_MESSAGE = error("node_comment: not found")
NODE_COMMENT_GET_NOT_FOUND_RESPONSE = Response(
    NODE_COMMENT_GET_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# get endpoint
NODE_COMMENT_GET_PATH = "node/get/<str:comment_id>/"
NODE_COMMENT_GET_PATH_FORMAT = "node/get/{comment_id}/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_comment_get(request: Request, comment_id: str):
    return handle_get(
        model_class=NodeComment,
        instance_identifier={"id": comment_id},
        serializer_class=NodeCommentSerializer,
        not_found_response=NODE_COMMENT_GET_NOT_FOUND_RESPONSE,
    )


NODE_COMMENT_PATCH_NOT_FOUND_MESSAGE = error("node_comment: not found")
NODE_COMMENT_PATCH_NOT_FOUND_RESPONSE = Response(
    NODE_COMMENT_PATCH_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# patch endpoint
NODE_COMMENT_PATCH_PATH = "node/patch/<str:comment_id>/"
NODE_COMMENT_PATCH_PATH_FORMAT = "node/patch/{comment_id}/"


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_comment_patch(request: Request, comment_id: str):
    return handle_patch(
        model_class=NodeComment,
        instance_identifier={"id": comment_id},
        patch_data=request.data,
        patch_serializer_class=NodeCommentSerializer,
        not_found_response=NODE_COMMENT_PATCH_NOT_FOUND_RESPONSE,
    )


NODE_COMMENT_DELETE_NOT_FOUND_MESSAGE = error("node_comment: not found")
NODE_COMMENT_DELETE_NOT_FOUND_RESPONSE = Response(
    NODE_COMMENT_DELETE_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# delete endpoint
NODE_COMMENT_DELETE_PATH = "node/delete/<str:comment_id>/"
NODE_COMMENT_DELETE_PATH_FORMAT = "node/delete/{comment_id}/"


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def node_comment_delete(request: Request, comment_id: str):
    return handle_delete(
        model_class=NodeComment,
        instance_identifier={"id": comment_id},
        not_found_response=NODE_COMMENT_DELETE_NOT_FOUND_RESPONSE,
    )


GRAPH_COMMENT_CREATE_INVALID_FORMAT_MESSAGE = error("graph_comment: invalid format")
GRAPH_COMMENT_CREATE_INVALID_FORMAT_RESPONSE = Response(
    GRAPH_COMMENT_CREATE_INVALID_FORMAT_MESSAGE, status=status.HTTP_400_BAD_REQUEST
)

# create endpoint
GRAPH_COMMENT_CREATE_PATH = "graph/create/"


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_comment_create(request: Request):
    return handle_create(
        create_data=request.data,
        serializer_class=GraphCommentSerializer,
        invalid_format_response=GRAPH_COMMENT_CREATE_INVALID_FORMAT_RESPONSE,
    )


GRAPH_COMMENT_GET_NOT_FOUND_MESSAGE = error("graph_comment: not found")
GRAPH_COMMENT_GET_NOT_FOUND_RESPONSE = Response(
    GRAPH_COMMENT_GET_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# get endpoint
GRAPH_COMMENT_GET_PATH = "graph/get/<str:comment_id>/"
GRAPH_COMMENT_GET_PATH_FORMAT = "graph/get/{comment_id}/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_comment_get(request: Request, comment_id: str):
    return handle_get(
        model_class=GraphComment,
        instance_identifier={"id": comment_id},
        serializer_class=GraphCommentSerializer,
        not_found_response=GRAPH_COMMENT_GET_NOT_FOUND_RESPONSE,
    )


GRAPH_COMMENT_PATCH_NOT_FOUND_MESSAGE = error("graph: not found")
GRAPH_COMMENT_PATCH_NOT_FOUND_RESPONSE = Response(
    GRAPH_COMMENT_PATCH_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# patch endpoint
GRAPH_COMMENT_PATCH_PATH = "graph/patch/<str:comment_id>/"
GRAPH_COMMENT_PATCH_PATH_FORMAT = "graph/patch/{comment_id}/"


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_comment_patch(request: Request, comment_id: str):
    return handle_patch(
        model_class=GraphComment,
        instance_identifier={"id": comment_id},
        patch_data=request.data,
        patch_serializer_class=GraphCommentSerializer,
        not_found_response=GRAPH_COMMENT_PATCH_NOT_FOUND_RESPONSE,
    )


GRAPH_COMMENT_DELETE_NOT_FOUND_MESSAGE = error("graph_comment: not found")
GRAPH_COMMENT_DELETE_NOT_FOUND_RESPONSE = Response(
    GRAPH_COMMENT_DELETE_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# delete endpoint
GRAPH_COMMENT_DELETE_PATH = "graph/delete/<str:comment_id>/"
GRAPH_COMMENT_DELETE_PATH_FORMAT = "graph/delete/{comment_id}/"


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def graph_comment_delete(request: Request, comment_id: str):
    return handle_delete(
        model_class=GraphComment,
        instance_identifier={"id": comment_id},
        not_found_response=GRAPH_COMMENT_DELETE_NOT_FOUND_RESPONSE,
    )
