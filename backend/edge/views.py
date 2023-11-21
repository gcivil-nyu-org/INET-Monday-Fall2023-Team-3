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

from .models import Edge
from .serializers import EdgeSerializer

EDGE_PING_OK_MESSAGE = ok("edge: ok")
EDGE_PING_OK_RESPONSE = Response(EDGE_PING_OK_MESSAGE, status=status.HTTP_200_OK)

# ping endpoint
EDGE_PING_PATH = "ping/"


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def edge_ping(request: Request):
    return EDGE_PING_OK_RESPONSE


EDGE_CREATE_INVALID_FORMAT_MESSAGE = error("edge: invalid format")
EDGE_CREATE_INVALID_FORMAT_RESPONSE = Response(
    EDGE_CREATE_INVALID_FORMAT_MESSAGE, status=status.HTTP_400_BAD_REQUEST
)

# create endpoint
EDGE_CREATE_PATH = "create/"


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_create(request: Request):
    return handle_create(
        create_data=request.data,
        serializer_class=EdgeSerializer,
        invalid_format_response=EDGE_CREATE_INVALID_FORMAT_RESPONSE,
    )


EDGE_GET_NOT_FOUND_MESSAGE = error("edge: not found")
EDGE_GET_NOT_FOUND_RESPONSE = Response(
    EDGE_GET_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# get endpoint
EDGE_GET_PATH = "get/<str:edge_id>/"
EDGE_GET_PATH_FORMAT = "get/{edge_id}/"


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_get(request: Request, edge_id: str):
    return handle_get(
        model_class=Edge,
        instance_identifier={"id": edge_id},
        serializer_class=EdgeSerializer,
        not_found_response=EDGE_GET_NOT_FOUND_RESPONSE,
    )


EDGE_PATCH_NOT_FOUND_MESSAGE = error("edge: not found")
EDGE_PATCH_NOT_FOUND_RESPONSE = Response(
    EDGE_PATCH_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)

# patch endpoint
EDGE_PATCH_PATH = "patch/<str:edge_id>/"
EDGE_PATCH_PATH_FORMAT = "patch/{edge_id}/"


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_patch(request: Request, edge_id: str):
    return handle_patch(
        model_class=Edge,
        instance_identifier={"id": edge_id},
        patch_data=request.data,
        serializer_class=EdgeSerializer,
        not_found_response=EDGE_PATCH_NOT_FOUND_RESPONSE,
    )


EDGE_DELETE_NOT_FOUND_MESSAGE = error("edge: not found")
EDGE_DELETE_NOT_FOUND_RESPONSE = Response(
    EDGE_DELETE_NOT_FOUND_MESSAGE, status=status.HTTP_404_NOT_FOUND
)


# delete endpoint
EDGE_DELETE_PATH = "delete/<str:edge_id>/"
EDGE_DELETE_PATH_FORMAT = "delete/{edge_id}/"


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edge_delete(request: Request, edge_id: str):
    return handle_delete(
        model_class=Edge,
        instance_identifier={"id": edge_id},
        not_found_response=EDGE_DELETE_NOT_FOUND_RESPONSE,
    )
