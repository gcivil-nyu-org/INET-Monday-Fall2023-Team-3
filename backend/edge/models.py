from django.db import models

# Create your models here.
class Edge(models.Model):
    edgeID = models.AutoField(primary_key=True)
    belongsTo = models.IntegerField()
    fromNodeID = models.IntegerField()
    toNodeID = models.IntegerField()

    def __str__(self):
        return "edgeID: " + self.edgeID + ", from " + str(self.romNodeID) + " to " + str(self.toNodeID)
