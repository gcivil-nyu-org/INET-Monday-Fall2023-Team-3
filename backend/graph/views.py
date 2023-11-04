# Create your views here.
import requests
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
from node.views import node_create, node_delete


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
    print("entered graph_create")
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
        graph_to_be_deleted.delete()
        return Response(status=status.HTTP_200_OK)
    except Graph.DoesNotExist:
        return GRAPH_404_RESPONSE


# @api_view(["PUT"])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def graph_add_node(request, graph_id):
#     try:
#         graph = Graph.objects.get(pk=graph_id)
#         node_data = { # let's just use the dummy data for now
#             "name": "New Node",
#             "description": "Description of the new node",
#         }

#         print("step 1 success")

#         token = request.auth
#         print("token is views is:", token.key)
#         headers = {"Authorization": f"Token {token.key}"}

#         response = requests.post(
#             "http://localhost:8000/backend/node/create/",
#             headers=headers,
#             json=node_data,
#         )

#         print("step 2 success")

#         if response.status_code == 200:
#             print("step 3 success")
#             # Update the graph's node_ids with the new node's ID
#             node_id = response.json().get("id")
#             graph.node_ids.append(node_id)
#             graph.save()
#             return Response(status=status.HTTP_200_OK)
#         else:
#             print("step 4 success")
#             print(response.json())
#             print(response.status_code)
#             return Response(response.json(), status=response.status_code)

#     except Graph.DoesNotExist:
#         return GRAPH_404_RESPONSE
