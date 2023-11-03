# Create your models here.
from django.db import models
import uuid
from user.models import CustomUser

# Create your models here.


class Graph(models.Model):
    graph_id = models.UUIDField(
        "id", primary_key=True, unique=True, editable=False, default=uuid.uuid4
    )
    editingEnabled = models.BooleanField(default=False)

    # foreign key in node.models already implicitly set the relationship here
    nodes = None
    edges = None
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='graphs', null=True)

    # nodePositions =

    def __str__(self):
        return "This is graph #" + str(self.graph_id)
