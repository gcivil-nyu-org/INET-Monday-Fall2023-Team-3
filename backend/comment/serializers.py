from rest_framework import serializers

from .models import GraphComment, NodeComment


class NodeCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeComment
        fields = "__all__"


class GraphCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraphComment
        fields = "__all__"
