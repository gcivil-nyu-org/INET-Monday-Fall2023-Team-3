from rest_framework import serializers
from .models import Comment

from rest_framework import serializers
from .models import Comment
import uuid

class CommentCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField()  # Accept user_id as a string
    parent_id = serializers.CharField(allow_null=True, required=False)  # Accept parent_id as a string, can be null
    related_to_id = serializers.CharField()

    class Meta:
        model = Comment
        fields = ['body', 'username', 'user_id', 'parent_id', 'related_to_id']

    def validate_user_id(self, value):
        # Validate that user_id is a valid UUID
        try:
            return uuid.UUID(value)
        except ValueError:
            raise serializers.ValidationError("user_id must be a valid UUID format.")

    def validate_parent_id(self, value):
        # Validate that parent_id is a valid UUID if provided
        if value in [None, '', 'null', 'None']:
            return None
        try:
            return uuid.UUID(value)
        except ValueError:
            raise serializers.ValidationError("parent_id must be a valid UUID format or null.")
        
    def validate_related_to_id(self, value):
        # Validate that user_id is a valid UUID
        try:
            return uuid.UUID(value)
        except ValueError:
            raise serializers.ValidationError("related_to_id must be a valid UUID format.")

    def create(self, validated_data):
        # Convert user_id and parent_id to UUID objects before saving
        validated_data['user_id'] = uuid.UUID(validated_data.get('user_id'))
        
        parent_id = validated_data.get('parent_id')
        if parent_id:
            validated_data['parent_id'] = uuid.UUID(parent_id)
        else:
            validated_data['parent_id'] = None

        validated_data['related_to_id'] = uuid.UUID(validated_data.get('related_to_id'))

        # Call the superclass method to save the new Comment instance
        return super().create(validated_data)
