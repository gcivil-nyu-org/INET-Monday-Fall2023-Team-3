from rest_framework import serializers
from .models import Node


class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = "__all__"  # This will include all fields in the serializer

    def create(self, validated_data):
        """
        Create and return a new `Node` instance, given the validated data.
        """
        # You can add any custom creation logic here if needed
        return Node.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Node` instance, given the validated data.
        """
        # Update the Node fields here
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)

        # Handle prerequisites

        # Save and return the updated instance
        instance.save()
        return instance
