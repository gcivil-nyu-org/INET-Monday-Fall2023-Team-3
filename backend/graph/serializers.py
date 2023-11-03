from rest_framework import serializers
from graph.models import Graph

class GraphSerializer(serializers.ModelSerializer):

    class Meta:
        model = Graph
        fields = '__all__'

    def create(self, validated_data):
        # Create a new Graph instance
        new_graph = Graph.objects.create(**validated_data)

        return new_graph

    def update(self, instance, validated_data):
        pass

