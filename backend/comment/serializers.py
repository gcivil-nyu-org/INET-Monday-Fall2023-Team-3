from rest_framework import serializers
from .models import Comment, CustomUser, Node  # Import User and Node models as well


class CommentSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    body = serializers.CharField()
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(), required=False, allow_null=True
    )
    related_to = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        # Create a new Comment instance using the validated data
        return Comment.objects.create(**validated_data)

    def update(self, instance: Comment, validated_data):
        # Update the Comment instance with the validated data
        instance.body = validated_data.get("body", instance.body)
        instance.user = validated_data.get("user", instance.user)
        instance.parent = validated_data.get("parent", instance.parent)
        instance.related_to = validated_data.get("related_to", instance.related_to)
        instance.save()
        return instance
