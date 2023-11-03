from django.db import models
import uuid

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    body = models.TextField()
    username = models.CharField(max_length=255)
    user_id = models.UUIDField()  # Assuming an external system is responsible for user identification
    parent_id = models.UUIDField(null=True, blank=True)  # Can be null if this is a top-level comment
    related_to_id = models.UUIDField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.username} on {self.created_at.strftime("%Y-%m-%d %H:%M:%S")}'

