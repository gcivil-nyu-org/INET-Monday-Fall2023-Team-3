# Generated by Django 4.2.6 on 2023-11-03 03:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("graph", "0002_alter_graph_graph_id"),
        ("edge", "0002_rename_from_node_edge_source_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="edge",
            name="graph",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="edges",
                to="graph.graph",
            ),
        ),
    ]
