from django.db import models


# Create your models here.
class Node(models.Model):
    node_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=60)
    description = models.TextField(blank=True)
    isPredefined = models.BooleanField(default=False)

    def __str__(self):
        return self.name
