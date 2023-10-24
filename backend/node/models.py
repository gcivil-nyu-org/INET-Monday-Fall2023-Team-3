from django.db import models


# Create your models here.
class Node(models.Model): 
    name = models.CharField(max_length=60)
    description = models.TextField(blank=True)
    

    def __str__(self):
        return self.name
