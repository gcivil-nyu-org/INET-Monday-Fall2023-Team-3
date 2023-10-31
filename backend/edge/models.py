from django.db import models
import uuid

from node.models import Node


# Create your models here.
class Edge(models.Model):
    id = models.UUIDField(
        "id", primary_key=True, unique=True, editable=False, default=uuid.uuid4
    )
    from_node = models.ForeignKey(
        Node, on_delete=models.CASCADE, related_name="outgoing_edges"
    )
    to_node = models.ForeignKey(
        Node, on_delete=models.CASCADE, related_name="incomming_edges"
    )

    def __str__(self) -> str:
        return f"Edge {self.id}: from: {self.from_node.id}, to: {self.to_node.id}"
