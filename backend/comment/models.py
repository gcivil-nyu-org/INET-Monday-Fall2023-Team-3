from django.db import models
import uuid
from node.models import Node
from user.models import CustomUser


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    body = models.TextField()
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE
    )  # Links to a User model instance
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )  # Can be null for top-level comments
    related_to = models.ForeignKey(
        Node, on_delete=models.CASCADE
    )  # Links to a Node model instance
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.body
