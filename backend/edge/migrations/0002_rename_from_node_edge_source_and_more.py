# Generated by Django 4.2.6 on 2023-11-01 16:18

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("edge", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="edge",
            old_name="from_node",
            new_name="source",
        ),
        migrations.RenameField(
            model_name="edge",
            old_name="to_node",
            new_name="target",
        ),
    ]
