from rest_framework import serializers
from .models import Node
from graph.models import Graph


class NodeSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField(required=True)
    description = serializers.CharField()
    predefined = serializers.BooleanField()
    dependencies = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Node.objects.all()
    )
    graph_id = serializers.UUIDField(write_only=True)


    def validate(self, attrs):
        if attrs.get("name") is None:
            raise serializers.ValidationError("name is required")
        return attrs

    def create(self, validated_data):
        # Extract the 'graph_id' from validated data.
        graph_id = validated_data.pop("graph_id", None)
        try:
            graph = Graph.objects.get(pk=graph_id)
        except Graph.DoesNotExist:
            raise serializers.ValidationError("Graph does not exist")

        dependencies = validated_data.pop("dependencies", None)
        node = Node.objects.create(**validated_data, graph=graph)
        if dependencies is not None:
            node.dependencies.set(dependencies)
        return node

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.predefined = validated_data.get("predefined", instance.predefined)
        instance.dependencies.clear()
        dependencies = validated_data.get("dependencies", [])
        for dependency in dependencies:
            instance.dependencies.add(dependency)
        return instance
