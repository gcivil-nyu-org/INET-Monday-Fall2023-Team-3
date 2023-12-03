from edge.models import Edge
from edge.serializers import EdgeSerializer
from node.models import Node
from node.serializers import NodeSerializer
from rest_framework import serializers

from .models import Graph, NodePosition, NodeColor


class NodePositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodePosition
        fields = "__all__"

class NodeColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeColor
        fields = "__all__"


class GraphSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, required=False)
    node_positions = NodePositionSerializer(many=True, required=False)
    node_colors = NodeColorSerializer(many=True, required=False)
    edges = EdgeSerializer(many=True, required=False)

    class Meta:
        model = Graph
        fields = "__all__"


class GraphPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = "__all__"
