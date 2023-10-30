# Generated by Django 4.2.6 on 2023-10-29 03:18
from ..models import Node
from django.db import migrations, models


def load_initial_data(apps, schema_editor):
    node1 = Node.objects.create(
        name="MAT188", description="Linear Algebrea", isPredefined=True
    )
    node2 = Node.objects.create(
        name="MAT186", description="Calculus I", isPredefined=True
    )
    node3 = Node.objects.create(
        name="MAT187", description="Calculus II", isPredefined=True
    )
    node4 = Node.objects.create(
        name="ECE244", description="Programming Fundamentals", isPredefined=True
    )
    node5 = Node.objects.create(
        name="ECE297", description="Design and Communications", isPredefined=True
    )

    node6 = Node.objects.create(
        name="ECE361", description="Computer Networks", isPredefined=True
    )
    node7 = Node.objects.create(
        name="ECE345", description="Data Structures & Algorithms", isPredefined=True
    )
    node8 = Node.objects.create(
        name="ECE461", description="Internetworking", isPredefined=True
    )
    # Adding dependencies
    node3.dependencies.add(node2.node_id)
    node5.dependencies.add(node4.node_id)
    node7.dependencies.add(node1.node_id, node2.node_id, node3.node_id)
    node8.dependencies.add(node6.node_id)


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Node",
            fields=[
                ("node_id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=60)),
                ("description", models.TextField(blank=True)),
                ("isPredefined", models.BooleanField(default=False)),
                ("dependencies", models.ManyToManyField(blank=True, to="node.node")),
            ],
        ),
        migrations.RunPython(load_initial_data),
    ]
