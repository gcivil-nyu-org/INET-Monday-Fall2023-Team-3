from rest_framework import status
from rest_framework.test import APIClient
from .models import Node
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.test import TestCase


class NodeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.test_user = User.objects.create_user(
            "testuser", "test@example.com", "testpassword"
        )
        self.test_user_token = Token.objects.create(user=self.test_user)
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

    def test_node_create_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.test_user_token.key)
        # Test the node_create view
        data = {"name": "New Node", "description": "A new node", "isPredefined": False}
        response = self.client.post("/node/create/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Node.objects.count(), self.total_nodes_count_after_setup + 1)
        self.assertEqual(Node.objects.get(name="New Node").description, "A new node")

    def test_node_create_unauthenticated(self):
        response = self.client.post("/nodes/create/", {"name": "Node 2"}, format="json")
        self.assertEqual(response.status_code, 404)  # Unauthorized
