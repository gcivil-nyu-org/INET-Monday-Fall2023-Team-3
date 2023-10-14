from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.


def index(request):
    return HttpResponse("This is user management pape")

def login(request):
    return HttpResponse("login page")