from rest_framework import serializers
from .models import Edge

from node.models import Node


class EdgeSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    from_node = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())
    to_node = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())

    def create(self, validated_data):
        return Edge.objects.create(**validated_data)

    def update(self, instance: Edge, validated_data):
        instance.from_node = validated_data.get("from_node", instance.from_node.id)
        instance.to_node = validated_data.get("to_node", instance.to_node.id)
        instance.save()
        return instance
