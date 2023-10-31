from django.db import models

import uuid

# Create your models here.


class Node(models.Model):
    id = models.UUIDField(
        "id", primary_key=True, unique=True, editable=False, default=uuid.uuid4
    )
    name = models.CharField(max_length=60)
    description = models.TextField(blank=True)
    predefined = models.BooleanField(default=False)
    dependencies = models.ManyToManyField("self", symmetrical=False, blank=True)

    def __str__(self) -> str:
        return f"Node {self.name}: id={self.id} is_predefined={self.predefined}"
