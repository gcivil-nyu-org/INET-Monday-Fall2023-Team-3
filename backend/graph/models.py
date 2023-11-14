# Create your models here.
from django.db import models
import uuid
from user.models import CustomUser
from node.models import Node
from edge.models import Edge


class Graph(models.Model):
    id = models.UUIDField(
        "id", primary_key=True, unique=True, editable=False, default=uuid.uuid4
    )
    editing_enabled = models.BooleanField(default=False)
    title = models.TextField(default="Untitled Graph")

    # foreign key in node.models already implicitly set the relationship here
    nodes = models.ManyToManyField(Node, blank=True)
    edges = models.ManyToManyField(Edge, blank=True)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="graphs", null=True
    )
    shared_user = models.JSONField(default=list)
    # it seems that json field can store list
    node_positions = models.JSONField(default=list)

    def __str__(self):
        return "This is graph #" + str(self.id)
