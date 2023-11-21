from django.db import models
from user.models import User


# Create your models here.
class Graph(models.Model):
    # user who created this graph, reference by email not default user id
    created_by = models.ForeignKey(
        User,
        to_field="email",
        on_delete=models.CASCADE,
        related_name="created_graphs",
    )
    # user who this graph is shared with
    shared_with = models.ManyToManyField(User, blank=True, related_name="shared_graphs")
