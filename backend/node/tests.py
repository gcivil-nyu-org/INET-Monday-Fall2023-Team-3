from rest_framework import status
from rest_framework.test import APITestCase
from .models import Node


class NodeTests(APITestCase):
    def setUp(self):
        # Set up any objects you need for the tests
        self.predefined_nodes_count = Node.objects.filter(isPredefined=True).count()
        self.total_nodes_count = Node.objects.count()

        Node.objects.create(
            name="Test Node 1", description="A test node", isPredefined=True
        )
        Node.objects.create(
            name="Test Node 2", description="Another test node", isPredefined=False
        )

        self.total_nodes_count_after_setup = Node.objects.count()
        self.predefined_nodes_count_after_setup = Node.objects.filter(
            isPredefined=True
        ).count()

    def test_ping(self):
        # Test the ping view
        response = self.client.post("/node/ping/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "pong"})

    def test_node_list(self):
        # Test the node_list view
        response = self.client.get("/node/nodes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), self.total_nodes_count_after_setup)

    def test_predefined_node_list(self):
        # Test the predefined_node_list view
        response = self.client.get("/node/predefined-nodes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), self.predefined_nodes_count_after_setup)

    def test_node_create(self):
        # Test the node_create view
        data = {"name": "New Node", "description": "A new node", "isPredefined": False}
        response = self.client.post("/node/create/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Node.objects.count(), self.total_nodes_count_after_setup + 1)
        self.assertEqual(Node.objects.get(name="New Node").description, "A new node")
