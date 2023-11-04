from rest_framework import serializers

# from user.models import CustomUser
from .models import Graph
from node.models import Node
from edge.models import Edge


class GraphSerializer(serializers.ModelSerializer):
    user = serializers.CharField()  # Define the user_email field
    nodes = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Node.objects.all(), required=False
    )  # nodes should be str[];
    # Only check if the primary keys of nodes match records in table Node
    edges = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Edge.objects.all(), required=False
    )
    editing_enabled = serializers.BooleanField(required=False)

    class Meta:
        model = Graph
        fields = "__all__"

    def create(self, validated_data):
        # user_email = validated_data.pop("user")
        graph = Graph.objects.create(**validated_data)
        return graph

    def update(self, instance, validated_data):
        pass
