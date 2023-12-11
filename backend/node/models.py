import uuid

from django.db import models


class Node(models.Model):
    id = models.UUIDField(
        primary_key=True, unique=True, editable=False, default=uuid.uuid4
    )
    name = models.CharField(max_length=150)
    description = models.TextField(default="")
    predefined = models.BooleanField(default=False)
    dependencies = models.ManyToManyField("self", symmetrical=False, blank=True)
