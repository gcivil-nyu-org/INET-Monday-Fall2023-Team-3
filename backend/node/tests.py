import uuid

from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token

from user.models import CustomUser

from .views import (
    NODE_PONG_MSG,
    NODE_INVALID_FORMAT_MSG,
    NODE_ALREADY_EXISTS_MSG,
    NODE_NOT_FOUND_MSG,
    NODE_ID_REQUIRED_MSG,
)

# Create your tests here.

test_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "testpassword",
}


class NodeAPITest(APITestCase):
    def setUp(self) -> None:
        user = CustomUser.objects.create(**test_user)
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    def test_ping(self):
        response = self.client.get("/backend/node/ping/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, NODE_PONG_MSG)

    def test_node_create(self):
        invalid_data = {"bob": "peter"}
        response = self.client.post(
            "/backend/node/create/", invalid_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, NODE_INVALID_FORMAT_MSG)

        valid_data = {"name": "CSE 101", "description": "CSE 101 class"}
        response = self.client.post("/backend/node/create/", valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data["id"])
        self.assertEqual(response.data["name"], valid_data["name"])
        self.assertEqual(response.data["description"], valid_data["description"])

        valid_data["id"] = response.data["id"]
        response = self.client.post("/backend/node/create/", valid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data, NODE_ALREADY_EXISTS_MSG)

    def test_node_get(self):
        response = self.client.get("/backend/node/")
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(f"/backend/node/get/{uuid.uuid4()}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, NODE_NOT_FOUND_MSG)

        valid_data = {"name": "CSE 101", "description": "CSE 101 class"}
        response = self.client.post("/backend/node/create/", valid_data, format="json")
        node = response.data
        response = self.client.get(f"/backend/node/get/{node['id']}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, node)

    def test_node_update(self):
        invalid_data = {"bob": "peter"}
        response = self.client.put("/backend/node/update/", invalid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, NODE_ID_REQUIRED_MSG)

        response = self.client.put(
            "/backend/node/update/", {"id": uuid.uuid4(), "name": "test"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, NODE_NOT_FOUND_MSG)

        valid_data = {"name": "CSE 101", "description": "CSE 101 class"}

        response = self.client.post("/backend/node/create/", valid_data, format="json")
        node1_id = response.data["id"]

        response = self.client.get(f"/backend/node/get/{node1_id}/")

        self.assertEqual(response.data["name"], valid_data["name"])
        self.assertEqual(response.data["description"], valid_data["description"])

        valid_data["name"] = "CSE 102"
        valid_data["description"] = "CSE 102 class"
        response = self.client.post("/backend/node/create/", valid_data, format="json")
        node2_id = response.data["id"]

        response = self.client.put(
            "/backend/node/update/",
            {"id": node1_id, "name": "CSE 101", "dependencies": [node2_id]},
            format="json",
        )

        self.assertEqual(len(response.data["dependencies"]), 1)
        self.assertEqual(str(response.data["dependencies"][0]), node2_id)

    def test_node_delete(self):
        response = self.client.delete(f"/backend/node/delete/{uuid.uuid4()}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, NODE_NOT_FOUND_MSG)

        valid_data = {"name": "CSE 101", "description": "CSE 101 class"}
        response = self.client.post("/backend/node/create/", valid_data, format="json")
        node_id = response.data["id"]

        response = self.client.delete(f"/backend/node/delete/{response.data['id']}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.delete(f"/backend/node/delete/{node_id}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, NODE_NOT_FOUND_MSG)
