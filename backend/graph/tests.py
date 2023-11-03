# Create your tests here.

from rest_framework import status
from rest_framework.test import APITestCase
from .models import Graph
from node.models import Node
from edge.models import Edge

class GraphTests(APITestCase):

    def setUp(self):
        graph1 = Graph.objects.create()
        graph2 = Graph.objects.create()

    def test_ping(self):
        # Test the ping view
        response = self.client.post("/graph/ping/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "pong"})
        print("graph ping passed")

    def test_graph_list(self):
        # Test the graph_list view
        response = self.client.get("/graph/graphs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.data)

    def test__create(self):
        # Test the graph_create view
        response = self.client.post("/graph/create/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.data)
