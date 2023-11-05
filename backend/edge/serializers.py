from rest_framework import serializers
from .models import Edge

from node.models import Node


class EdgeSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    source = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())
    target = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())

    def create(self, validated_data):
        return Edge.objects.create(**validated_data)

    def update(self, instance: Edge, validated_data):
        instance.source = validated_data.get("source", instance.source.id)
        instance.target = validated_data.get("target", instance.target.id)
        instance.save()
        return instance
