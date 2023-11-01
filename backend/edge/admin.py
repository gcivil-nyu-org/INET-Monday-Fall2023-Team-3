from django.contrib import admin

from .models import Edge

# Register your models here.
<<<<<<<< HEAD:backend/edge/admin.py

admin.site.register(Edge)
========
from .models import Node

admin.site.register(Node)
>>>>>>>> develop:backend/node/admin.py
