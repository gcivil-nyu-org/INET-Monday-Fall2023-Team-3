from django.contrib import admin
from graph.models import Graph

# Register your models here.

<<<<<<< HEAD
admin.site.register(Graph)
=======
from node.admin import NodeInline

admin.site.register(Graph)

# this is for testing purpose.
# Allows you to see the nodes added to a certain graph in /admin
# @admin.register(Graph)
# class GraphAdmin(admin.ModelAdmin):
#     inlines = [NodeInline]
>>>>>>> 3c4db39054d93d3a88370b80a4f08c4abb1ee31d
