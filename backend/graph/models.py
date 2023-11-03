# Create your models here.
from django.db import models

# Create your models here.

class Graph(models.Model):

    graph_id = models.AutoField(primary_key=True)
    editingEnabled = models.BooleanField(default=False)

    # foreign key in node.models already implicitly set the relationship here
    nodes = None
    edges = None

    # nodePositions =


    def __str__(self):
        return(
            "This is graph #" + str(self.graph_id)
        )


