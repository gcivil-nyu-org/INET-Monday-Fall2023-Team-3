from rest_framework import serializers
from user.models import CustomUser
from .models import Graph
from node.models import Node
from edge.models import Edge


class GraphSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(write_only=True)  # Define the user_id field
    nodes = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Node.objects.all()
    )  # should get str[]
    edges = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Edge.objects.all()
    )

    class Meta:
        model = Graph
        fields = "__all__"

    def create(self, validated_data):
        user_id = validated_data.pop("user_id")
        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User does not exist")
        graph = Graph.objects.create(**validated_data, user=user)
        return graph

    def update(self, instance, validated_data):
        pass
