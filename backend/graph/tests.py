# Create your tests here.

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from user.models import CustomUser
from .models import Graph
from node.models import Node
from edge.models import Edge
# from node.models import Node
# from edge.models import Edge

test_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "testpassword",
}

class GraphTests(APITestCase):

    def setUp(self) -> None:
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

    def test_add_nodes(self):
        testgraph = Graph.objects.create()
        node1 = Node.objects.create(name="node1", graph=testgraph)
        node2 = Node.objects.create(name="node2", graph=testgraph)
        nodes_in_testgraph = testgraph.nodes.all()
        self.assertEqual(len(nodes_in_testgraph), 2)
        self.assertIn(node1, nodes_in_testgraph)
        self.assertIn(node2, nodes_in_testgraph)

    def test_add_edges(self):
        testgraph = Graph.objects.create()
        node1 = Node.objects.create(name="node1", graph=testgraph)
        node2 = Node.objects.create(name="node2", graph=testgraph)
        edge = Edge.objects.create(source=node1, target=node2, graph=testgraph)
        edges_in_testgraph = testgraph.edges.all()
        self.assertEqual(len(edges_in_testgraph), 1)
        self.assertIn(edge, edges_in_testgraph)
