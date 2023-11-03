from django.db import models
import uuid
from graph.models import Graph
from node.models import Node


# Create your models here.
class Edge(models.Model):
    id = models.UUIDField(
        "id", primary_key=True, unique=True, editable=False, default=uuid.uuid4
    )
    source = models.ForeignKey(
        Node, on_delete=models.CASCADE, related_name="outgoing_edges"
    )
    target = models.ForeignKey(
        Node, on_delete=models.CASCADE, related_name="incomming_edges"
    )

    def __str__(self) -> str:
        return f"Edge {self.id}: source: {self.source.id}, to: {self.target.id}"
