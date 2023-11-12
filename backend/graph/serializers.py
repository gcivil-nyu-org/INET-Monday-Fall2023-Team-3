from rest_framework import serializers
from user.models import CustomUser
from .models import Graph
from node.models import Node
from edge.models import Edge


class GraphSerializer(serializers.ModelSerializer):
    editing_enabled = serializers.BooleanField(required=False)
    nodes = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Node.objects.all(), required=False
    )  # nodes should be str[];
    # Only check if the primary keys of nodes match records in table Node
    edges = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Edge.objects.all(), required=False
    )
    user = serializers.CharField(required=False)  # Define the user_email field

    class Meta:
        model = Graph
        fields = "__all__"

    def create(self, validated_data):
        useremail = validated_data.pop("user")
        nodes = validated_data.pop("nodes", [])
        edges = validated_data.pop("edges", [])
        try:
            user = CustomUser.objects.get(email=useremail)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User does not exist")
        graph = Graph.objects.create(**validated_data, user=user)
        graph.nodes.set(nodes)
        graph.edges.set(edges)
        return graph

    def update(self, instance, validated_data):
        pass
        # Since 'id' is read-only,
        # you need to explicitly set it if it's included in the request
        # if 'id' in validated_data:
        #     instance.id = validated_data['id']

        # # Handle other fields update here as needed

        # instance.save()
        # return instance
