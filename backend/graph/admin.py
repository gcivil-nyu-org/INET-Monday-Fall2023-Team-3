from django.contrib import admin
from graph.models import Graph

# Register your models here.

from node.admin import NodeInline

# this is for testing purpose. Allows you to see the nodes added to a certain graph in /admin
@admin.register(Graph)
class GraphAdmin(admin.ModelAdmin):
    inlines = [NodeInline]
