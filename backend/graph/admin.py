# Register your models here.

from django.contrib import admin
from graph.models import Graph

# Register your models here.

# this is for testing purpose. Allows you to see the nodes added to a certain graph in /admin
admin.site.register(Graph)

# class GraphAdmin(admin.ModelAdmin):
#     inlines = [NodeInline]
