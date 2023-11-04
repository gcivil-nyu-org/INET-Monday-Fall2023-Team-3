from rest_framework import serializers
from .models import Node


class NodeSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField(required=True)
    description = serializers.CharField()
    predefined = serializers.BooleanField()
    dependencies = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Node.objects.all()
    )

    def validate(self, attrs):
        if attrs.get("name") is None:
            raise serializers.ValidationError("name is required")
        return attrs

    def create(self, validated_data):
        dependencies = validated_data.pop("dependencies", None)
        node = Node.objects.create(**validated_data)
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
