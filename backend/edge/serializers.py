from rest_framework import serializers

from .models import Edge


class EdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edge
        fields = "__all__"
