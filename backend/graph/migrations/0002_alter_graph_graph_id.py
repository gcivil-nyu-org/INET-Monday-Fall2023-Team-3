# Generated by Django 4.2.6 on 2023-11-03 03:52

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):
    dependencies = [
        ("graph", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="graph",
            name="graph_id",
            field=models.UUIDField(
                default=uuid.uuid4,
                editable=False,
                primary_key=True,
                serialize=False,
                unique=True,
                verbose_name="id",
            ),
        ),
    ]
