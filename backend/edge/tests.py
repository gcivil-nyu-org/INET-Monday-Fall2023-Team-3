import uuid

from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token

from user.models import CustomUser
from node.models import Node

from .views import (
    EDGE_PONG_MSG,
    EDGE_INVALID_FORMAT_MSG,
    EDGE_ID_ALREADY_EXISTS_MSG,
    EDGE_NOT_FOUND_MSG,
)


test_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "testpassword",
}


class EdgeAPITest(APITestCase):
    def setUp(self) -> None:
        # set up authentication
        user = CustomUser.objects.create(**test_user)
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    def test_ping(self):
        # test ping works
        response = self.client.get("/backend/edge/ping/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, EDGE_PONG_MSG)

    def test_edge_create(self):
        # test invalid data raise format error
        invalid_data = {"bob": "peter"}
        response = self.client.post(
            "/backend/edge/create/", data=invalid_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, EDGE_INVALID_FORMAT_MSG)

        # test invalid node id (missing node instance) raise format error
        invalid_id1 = uuid.uuid4()
        invalid_id2 = uuid.uuid4()

        invalid_data = {"source": invalid_id1, "target": invalid_id2}
        response = self.client.post(
            "/backend/edge/create/", data=invalid_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, EDGE_INVALID_FORMAT_MSG)

        # test edge creation ok
        valid_data1 = {"name": "CSE 101", "description": "CSE 101 class"}
        valid_data2 = {"name": "CSE 102", "description": "CSE 102 class"}

        node1 = Node.objects.create(**valid_data1)
        node2 = Node.objects.create(**valid_data2)

        valid_edge = {"source": node1.id, "target": node2.id}
        response = self.client.post(
            "/backend/edge/create/", data=valid_edge, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["source"], node1.id)
        self.assertEqual(response.data["target"], node2.id)

        # test recreate same edge raise already exist error
        edge_data = response.data

        response = self.client.post(
            "/backend/edge/create/", data=edge_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data, EDGE_ID_ALREADY_EXISTS_MSG)

    def test_edge_get(self):
        # test get nonexisting edge raise not found error
        response = self.client.get(f"/backend/edge/get/{uuid.uuid4()}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, EDGE_NOT_FOUND_MSG)

        # test get existing edge ok
        valid_data1 = {"name": "CSE 101", "description": "CSE 101 class"}
        valid_data2 = {"name": "CSE 102", "description": "CSE 102 class"}

        node1 = Node.objects.create(**valid_data1)
        node2 = Node.objects.create(**valid_data2)

        valid_edge = {"source": node1.id, "target": node2.id}
        response = self.client.post(
            "/backend/edge/create/", data=valid_edge, format="json"
        )

        edge_id = response.data["id"]

        response = self.client.get(f"/backend/edge/get/{edge_id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["source"], node1.id)
        self.assertEqual(response.data["target"], node2.id)

    def test_edge_update(self):
        # test invalid data raise format error
        invalid_data = {"bob": "peter"}
        response = self.client.put(
            "/backend/edge/update/", data=invalid_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, EDGE_INVALID_FORMAT_MSG)

        # test nonexisting edge raise not found error
        valid_data1 = {"name": "CSE 101", "description": "CSE 101 class"}
        valid_data2 = {"name": "CSE 102", "description": "CSE 102 class"}

        node1 = Node.objects.create(**valid_data1)
        node2 = Node.objects.create(**valid_data2)

        invalid_data = {"id": uuid.uuid4(), "source": node1.id, "target": node2.id}
        response = self.client.put(
            "/backend/edge/update/", data=invalid_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, EDGE_NOT_FOUND_MSG)

        # test update edge ok
        valid_edge = {"source": node1.id, "target": node2.id}
        response = self.client.post(
            "/backend/edge/create/", data=valid_edge, format="json"
        )

        valid_data3 = {"name": "CSE 103", "description": "CSE 103 class"}
        node3 = Node.objects.create(**valid_data3)

        valid_edge["id"] = response.data["id"]
        valid_edge["source"] = node3.id
        response = self.client.put(
            "/backend/edge/update/", data=valid_edge, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["source"], node3.id)
        self.assertEqual(response.data["target"], node2.id)

        # test invalid node id (missing node instance) raise format error
        valid_edge["source"] = uuid.uuid4()
        response = self.client.put(
            "/backend/edge/update/", data=valid_edge, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, EDGE_INVALID_FORMAT_MSG)

    def test_edge_delete(self):
        # test nonexisting edge raise not found error
        response = self.client.delete(f"/backend/edge/delete/{uuid.uuid4()}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # test delete ok
        valid_data1 = {"name": "CSE 101", "description": "CSE 101 class"}
        valid_data2 = {"name": "CSE 102", "description": "CSE 102 class"}

        node1 = Node.objects.create(**valid_data1)
        node2 = Node.objects.create(**valid_data2)

        valid_edge = {"source": node1.id, "target": node2.id}
        response = self.client.post(
            "/backend/edge/create/", data=valid_edge, format="json"
        )
        response = self.client.delete(f"/backend/edge/delete/{response.data['id']}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
