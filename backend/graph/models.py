import uuid

from django.db import models
from edge.models import Edge
from node.models import Node
from user.models import User


class NodePosition(models.Model):
    graph_id = models.ForeignKey(
        "Graph", on_delete=models.CASCADE, related_name="node_positions"
    )
    node_id = models.ForeignKey(Node, on_delete=models.CASCADE)
    x = models.IntegerField()
    y = models.IntegerField()

    class Meta:
        unique_together = ("graph_id", "node_id")


class NodeColor(models.Model):
    graph_id = models.ForeignKey(
        "Graph", on_delete=models.CASCADE, related_name="node_colors"
    )
    node_id = models.ForeignKey(Node, on_delete=models.CASCADE)
    color = models.CharField(max_length=50)

    class Meta:
        unique_together = ("graph_id", "node_id")


class Graph(models.Model):
    id = models.UUIDField(
        primary_key=True, unique=True, editable=False, default=uuid.uuid4
    )
    # graph title, default to Untitled
    title = models.CharField(default="Untitled", max_length=60)
    # nodes in the graph
    nodes = models.ManyToManyField(Node, symmetrical=False, blank=True)
    # node_positions are generated by NodePosition model using graph_id
    node_positions: models.Manager[NodePosition]
    # node_colors are generated by NodeColor model using graph_id foreign key field
    node_colors: models.Manager[NodeColor]
    # edges in the graph
    edges = models.ManyToManyField(Edge, symmetrical=False, blank=True)
    # user who created this graph, reference by email not default user id
    created_by = models.ForeignKey(
        User,
        to_field="email",
        on_delete=models.CASCADE,
        related_name="created_graphs",
    )
    # user who this graph is shared with
    shared_with = models.ManyToManyField(User, blank=True, related_name="shared_graphs")
    # allow others to edit this graph?
    # removed due to complexity
    # editing_enabled = models.BooleanField(default=False)
