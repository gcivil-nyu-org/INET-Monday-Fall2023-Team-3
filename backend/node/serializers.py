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
