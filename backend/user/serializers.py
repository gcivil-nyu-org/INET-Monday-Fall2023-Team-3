from graph.models import Graph
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import User


class BaseSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def user_exists(self) -> bool:
        if self.instance is None:
            email = self.validated_data.get("email")
            return User.objects.filter(email=email).exists()
        return True

    def user_get(self) -> User:
        if self.instance is None:
            email = self.validated_data.get("email")
            return User.objects.get(email=email)
        return self.instance

    def user_token(self) -> str:
        token, _ = Token.objects.get_or_create(user=self.user_get())
        return token.key


class LoginSerializer(BaseSerializer):
    password = serializers.CharField(required=True)

    def check_password(self) -> bool:
        password = self.validated_data.get("password")
        return self.user_get().check_password(password)


class SignUpSerializer(BaseSerializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def create(self, validated_data: dict) -> User:
        # remove password from data
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        # save hashed password instead
        user.set_password(password)
        user.save()
        return user


class PatchSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True)
    avatar = serializers.CharField(required=False, allow_blank=True)

    def update(self, instance: User, validated_data: dict) -> User:
        # if a new avatar is provide, only update avatar
        if validated_data.get("avatar") is not None:
            instance.avatar = validated_data["avatar"]
        elif validated_data.get("username") is not None and validated_data.get("password") is not None:
            # if an avatar is not provided, user wants to update password/username
            # since required is set to False, check if there are inputs
            # update username
            instance.username = validated_data.get("username")
            # update password
            instance.set_password(validated_data.get("password"))
        else:
            raise serializers.ValidationError("At least one of 'avatar', 'username', or 'password' must be provided.")

        instance.save()
        return instance


class GetSerializer(BaseSerializer):
    username = serializers.CharField()
    # provide created_graphs
    created_graphs = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Graph.objects.all()
    )
    # provide shared_graphs
    shared_graphs = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Graph.objects.all()
    )
    avatar = serializers.CharField()


