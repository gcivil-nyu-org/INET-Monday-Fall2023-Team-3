from rest_framework import serializers
from .models import Edge
from graph.models import Graph

from node.models import Node


class EdgeSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    source = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())
    target = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())
    graph_id = serializers.UUIDField(write_only=True)

    def create(self, validated_data):
        graph_id = validated_data.pop("graph_id", None)
        graph = Graph.objects.get(pk=graph_id)
        return Edge.objects.create(**validated_data, graph=graph)

    def update(self, instance: Edge, validated_data):
        instance.source = validated_data.get("source", instance.source.id)
        instance.target = validated_data.get("target", instance.target.id)
        instance.save()
        return instance
