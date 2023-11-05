# Create your models here.
from django.db import models
import uuid
from user.models import CustomUser
from node.models import Node
from edge.models import Edge

class Graph(models.Model):
<<<<<<< HEAD
    graph_id = models.UUIDField(
        primary_key=True, unique=True, editable=False, default=uuid.uuid4
=======
    id = models.UUIDField(
        "id", primary_key=True, unique=True, editable=False, default=uuid.uuid4
>>>>>>> 3c4db39054d93d3a88370b80a4f08c4abb1ee31d
    )
    editingEnabled = models.BooleanField(default=False)

    # foreign key in node.models already implicitly set the relationship here
<<<<<<< HEAD
    node_ids = models.JSONField(default=list)
    edge_ids = models.JSONField(default=list)
=======
    nodes = models.ManyToManyField(Node, blank=True)
    edges = models.ManyToManyField(Edge, blank=True)
>>>>>>> 3c4db39054d93d3a88370b80a4f08c4abb1ee31d
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="graphs", null=True
    )


    def __str__(self):
        return "This is graph #" + str(self.id)
