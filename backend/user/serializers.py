from rest_framework import serializers

from .models import CustomUser


class UserSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        if email is None or email == "":
            raise serializers.ValidationError("email is required")
        return attrs

    def create(self, validated_data):
        return CustomUser.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.password = validated_data.get("password", instance.password)
        instance.save()
        return instance
