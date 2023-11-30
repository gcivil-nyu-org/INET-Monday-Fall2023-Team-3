# Create your views here.
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import CommentSerializer
from .models import Comment, Node

from .pusher import pusher_client
import json


# Helper function to create a detail message
def detail(msg: str):
    return {"detail": msg}


# Constant messages and responses
COMMENT_PONG_MSG = detail("pong")
COMMENT_INVALID_FORMAT_MSG = detail("comment format invalid")
COMMENT_ID_ALREADY_EXISTS_MSG = detail("comment with the same id already exists")
COMMENT_NOT_FOUND_MSG = detail("comment not found")

COMMENT_PONG_RESPONSE = Response(COMMENT_PONG_MSG, status=status.HTTP_200_OK)
COMMENT_INVALID_FORMAT_RESPONSE = Response(
    COMMENT_INVALID_FORMAT_MSG, status=status.HTTP_400_BAD_REQUEST
)
COMMENT_ID_ALREADY_EXISTS_RESPONSE = Response(
    COMMENT_ID_ALREADY_EXISTS_MSG, status=status.HTTP_409_CONFLICT
)
COMMENT_NOT_FOUND_RESPONSE = Response(
    COMMENT_NOT_FOUND_MSG, status=status.HTTP_404_NOT_FOUND
)


# Ping
@api_view(["GET"])
def ping(request):
    return COMMENT_PONG_RESPONSE


# Create comment
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def comment_create(request):
    serializer = CommentSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return COMMENT_INVALID_FORMAT_RESPONSE
    comment_id = serializer.validated_data.get("id")
    if comment_id and Comment.objects.filter(id=comment_id).exists():
        return COMMENT_ID_ALREADY_EXISTS_RESPONSE
    serializer.save()  # Assuming the user is assigned from the request
    data = json.loads(json.dumps(serializer.data, default=str))
    pusher_client.trigger("comments-channel", "new-comment", data)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# Get comment
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def comment_get(request, comment_id):
    print(comment_id)
    try:
        comment = Comment.objects.get(id=comment_id)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Comment.DoesNotExist:
        return COMMENT_NOT_FOUND_RESPONSE


# Get comments by Node ID
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def comments_by_node(request, node_id):
    try:
        node = Node.objects.get(id=node_id)
    except Node.DoesNotExist:
        return Response({"detail": "Node not found"}, status=status.HTTP_404_NOT_FOUND)

    comments = Comment.objects.filter(related_to_node=node)
    serializer = CommentSerializer(comments, many=True)
    data = serializer.data
    for item in data:
        item["createdAt"] = item.pop("created_at")
        item["relatedToNode"] = item.pop("related_to_node")
    print(data)
    return Response(data, status=status.HTTP_200_OK)


# Update comment
@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def comment_update(request):
    print(request)
    serializer = CommentSerializer(data=request.data, partial=True)
    if not serializer.is_valid():
        return COMMENT_INVALID_FORMAT_RESPONSE
    comment_id = request.data.get("id")
    try:
        instance = Comment.objects.get(id=comment_id)
        serializer.instance = instance
        serializer.save()
        serializer = CommentSerializer(instance=serializer.instance)
        # pusher_client.trigger('comments-channel', 'update-comment', serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Comment.DoesNotExist:
        return COMMENT_NOT_FOUND_RESPONSE


# Delete comment
@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def comment_delete(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id)
        serializer = CommentSerializer(comment)  # Serialize the comment
        comment.delete()
        serializer.data.id = comment_id
        return Response({"id": comment_id}, status=status.HTTP_200_OK)
    except Comment.DoesNotExist:
        return COMMENT_NOT_FOUND_RESPONSE
