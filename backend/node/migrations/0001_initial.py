# Generated by Django 4.2.6 on 2023-10-29 03:18
from ..models import Node
from django.db import migrations, models
import json


def load_initial_data(apps, schema_editor):
    with open("./backend/node/migrations/courseList.json", "rb") as file:
        data = json.load(file)

    prerequisiteList = {}
    for item in data:
        Node.objects.create(
            name=item["name"], description=item["description"], isPredefined=True
        )
        if item["dependencies"] == "":
            prerequisiteList[item["name"]] = item["dependencies"]

    for key in prerequisiteList.keys():
        node = Node.objects.filter(name__startswith=key)[0]
        dependenciesList = prerequisiteList[key].split(",")
        for dependency in dependenciesList:
            depen_node = Node.objects.filter(name__startswith=dependency)[0]
            node.dependencies.add(depen_node.node_id)


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
