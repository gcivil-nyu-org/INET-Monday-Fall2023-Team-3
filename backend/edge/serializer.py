from rest_framework import serializers
from .models import Edge

class EdgeSerializer(serializers.ModelSerializer):
    # userID = serializers.IntegerField(source='belongsTo', required=True)  # map userID to belongsTo defined in Egde model

    class Meta:
        model = Edge
        fields = ['belongsTo', 'fromNodeID', 'toNodeID', 'edgeID']

    def create(self, validated_data):
        new_edge = Edge(**validated_data)
        new_edge.save()

        return new_edge
