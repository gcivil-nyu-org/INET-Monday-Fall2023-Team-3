import uuid

from django.db import models
from node.models import Node


class Edge(models.Model):
    id = models.UUIDField(
        primary_key=True, unique=True, editable=False, default=uuid.uuid4
    )
    source = models.ForeignKey(
        Node, on_delete=models.CASCADE, related_name="outgoing_edges"
    )
    target = models.ForeignKey(
        Node, on_delete=models.CASCADE, related_name="incomming_edges"
    )
