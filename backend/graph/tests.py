# Create your tests here.

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from user.models import CustomUser
from .models import Graph
# from node.models import Node
# from edge.models import Edge

test_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "testpassword",
}

class GraphTests(APITestCase):

    def setUp(self) -> None:
        graph1 = Graph.objects.create()
        graph2 = Graph.objects.create()
        user = CustomUser.objects.create(**test_user)
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    def test_ping(self):
        # Test the ping view
        response = self.client.get("/backend/graph/ping/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "pong"})

    def test_graph_list(self):
        # Test the graph_list view
        response = self.client.get("/backend/graph/graphs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.data)

    def test__create(self):
        # Test the graph_create view
        response = self.client.post("/backend/graph/create/")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print(response.data)
