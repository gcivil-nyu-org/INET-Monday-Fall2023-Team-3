# Create your tests here.

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from user.models import CustomUser
from .models import Graph
from node.models import Node
from edge.models import Edge
from graph.serializers import GraphSerializer
import uuid

# from node.models import Node
# from edge.models import Edge

test_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "testpassword",
}


class GraphTests(APITestCase):
    def setUp(self) -> None:
        self.user = CustomUser.objects.create(**test_user)
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    def test_ping(self):
        # Test the ping view
        response = self.client.get("/backend/graph/ping/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "pong"})

    def test_create(self):
        request_data = {"user": self.user.email}
        response = self.client.post("/backend/graph/create/", request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_graph_list(self):
        # Test the graph_list view
        response = self.client.get("/backend/graph/graphs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        Graph.objects.create(user=self.user)
        Graph.objects.create(user=self.user)
        response = self.client.get("/backend/graph/graphs/")
        self.assertEqual(len(response.data), 2)

    def test_graph_get(self):
        Graph.objects.create(user=self.user)
        graph1 = Graph.objects.create(user=self.user)
        response = self.client.get(f"/backend/graph/get/{graph1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(graph1.id))

    def test_graph_delete(self):
        # testing if an empty graph can be deleted
        graph1 = Graph.objects.create(user=self.user)
        self.assertEqual(len(Graph.objects.all()), 1)
        response = self.client.delete(f"/backend/graph/delete/{graph1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(Graph.objects.all()), 0)

        # testing if a graph with nodes can be deleted, without impacting predefined nodes
        graph2 = Graph.objects.create(user=self.user)
        node1 = Node.objects.create(name="node1", predefined=True)
        node2 = Node.objects.create(name="node2", predefined=False)
        node1_id, node2_id = node1.id, node2.id
        graph2.nodes.add(node1)
        graph2.nodes.add(node2)
        self.assertEqual(len(Node.objects.all()), 2)
        response1 = self.client.delete(f"/backend/graph/delete/{graph2.id}/")
        response2 = self.client.get(f"/backend/node/get/{node1_id}/")
        response3 = self.client.get(f"/backend/node/get/{node2_id}/")
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response3.status_code, status.HTTP_200_OK)

    def test_graph_update_add(self):
        graph1 = Graph.objects.create(user=self.user)
        valid_data1 = {
            "name": "ECE244",
            "description": "Programming Fundamentals",
        }
        valid_data2 = {
            "name": "ECE311",
            "description": "Control System I",
        }
        node1 = Node.objects.create(**valid_data1)
        node2 = Node.objects.create(**valid_data2)
        valid_data1["id"] = str(node1.id)
        valid_data2["id"] = str(node2.id)

        graph_id = str(graph1.id)
        request_data = {"id": graph_id, "nodes": [valid_data1, valid_data2]}
        response = self.client.put("/backend/graph/update-add/", request_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        nodes_from_graph = sorted(graph1.nodes.all().values_list('id', flat=True))
        expected_node_ids = sorted([node1.id, node2.id])
        self.assertEqual(nodes_from_graph, expected_node_ids)

    def test_graph_update_delete(self):
        graph1 = Graph.objects.create(user=self.user)
        node1 = Node.objects.create(name="node1", predefined=True)
        node2 = Node.objects.create(name="node2", predefined=False)
        graph1.nodes.add(node1)
        graph1.nodes.add(node2)
        self.assertEqual(len(graph1.nodes.all()), 2)


    # def test_graph_add_node(self):
    #     graph1 = Graph.objects.create(user=self.user)
    #     print("the acutal token is: ", self.token.key)
    #     response1 = self.client.put(f"/backend/graph/add_node/{graph1.graph_id}/")
    #     self.assertEqual(response1.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(Node.objects.all()), 1)


    # def test_add_nodes(self):
    #     testgraph = Graph.objects.create()
    #     node1 = Node.objects.create(name="node1", graph=testgraph)
    #     node2 = Node.objects.create(name="node2", graph=testgraph)
    #     nodes_in_testgraph = testgraph.nodes.all()
    #     self.assertEqual(len(nodes_in_testgraph), 2)
    #     self.assertIn(node1, nodes_in_testgraph)
    #     self.assertIn(node2, nodes_in_testgraph)

    # def test_add_edges(self):
    #     testgraph = Graph.objects.create()
    #     node1 = Node.objects.create(name="node1", graph=testgraph)
    #     node2 = Node.objects.create(name="node2", graph=testgraph)
    #     edge = Edge.objects.create(source=node1, target=node2, graph=testgraph)
    #     edges_in_testgraph = testgraph.edges.all()
    #     self.assertEqual(len(edges_in_testgraph), 1)
    #     self.assertIn(edge, edges_in_testgraph)

    # def test_create_by_user(self):
    #     pass
