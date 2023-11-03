from django.contrib import admin

from .models import Node

# Register your models here.

admin.site.register(Node)

class NodeInline(admin.TabularInline):  # or admin.StackedInline if you prefer
    model = Node
    extra = 1  # Number of blank forms to display
