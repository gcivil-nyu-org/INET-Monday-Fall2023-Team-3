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
        # Assuming you have the name and description values in validated_data
        name = validated_data["name"]
        description = validated_data.get(
            "description", ""
        )  # Use an empty string if description is not provided

        # Create a new Node instance with AutoField automatically generated node_id
        new_node = Node(name=name, description=description)

        # Save the new instance to the database
        new_node.save()
        return new_node

    def update(self, instance, validated_data):
        """
        Update and return an existing `Node` instance, given the validated data.
        """
        # Update the Node instance
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)

        # You can add any other fields here that you want to be able to update

        # Save the updated instance to the database
        instance.save()
        return instance
