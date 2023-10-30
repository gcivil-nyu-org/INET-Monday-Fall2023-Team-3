from rest_framework import serializers
from .models import Node


class NodeSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.CharField(style={"base_template": "textarea.html"})

    class Meta:
        model = Node
        fields = "__all__"  # This will include all fields in the serializer
