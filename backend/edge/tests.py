import uuid

from node.models import Node

# from rest_framework import status
from shared.test_helper import CustomTestCase, get_actual_endpoint
from user.models import User

from . import views

# from .models import Edge
from .urls import app_name

valid_node_1 = {
    "name": "test node 1",
    "description": "test node 1 description",
}

valid_node_2 = {
    "name": "test node 2",
    "description": "test node 2 description",
}

valid_node_3 = {
    "name": "test node 3",
    "description": "test node 3 description",
}

invalid_edge = {
    "bob": "peter",
}

actual_endpoint = get_actual_endpoint(app_name=app_name)


class EdgeTest(CustomTestCase):
    user_model = User

    def get_valid_edge(self, source: Node, target: Node):
        return {
            "source": source.id,
            "target": target.id,
        }

    def test_edge_ping(self):
        ping_endpoint = actual_endpoint(views.EDGE_PING_PATH)
        # test ping response
        response = self.client.get(ping_endpoint)
        self.assertResponseEqual(expect=views.EDGE_PING_OK_RESPONSE, response=response)

    def test_edge_create(self):
        create_endpoint = actual_endpoint(views.EDGE_CREATE_PATH)
        # test for invalid format
        response = self.client.post(create_endpoint, data=invalid_edge)
        self.assertResponseEqual(
            expect=views.EDGE_CREATE_INVALID_FORMAT_RESPONSE, response=response
        )
        # test for success create
        node_1 = Node.objects.create(**valid_node_1)
        node_2 = Node.objects.create(**valid_node_2)
        valid_edge = self.get_valid_edge(source=node_1, target=node_2)

        response = self.client.post(create_endpoint, data=valid_edge)
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="source", expect=valid_edge, response=response
        )
        self.assertResponseDataKeyEqual(
            key="target", expect=valid_edge, response=response
        )

    def test_edge_get(self):
        create_endpoint = actual_endpoint(views.EDGE_CREATE_PATH)
        get_endpoint = actual_endpoint(views.EDGE_GET_PATH_FORMAT)
        # test for unknown edge
        response = self.client.get(get_endpoint.format(edge_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.EDGE_GET_NOT_FOUND_RESPONSE, response=response
        )
        # test for success get
        node_1 = Node.objects.create(**valid_node_1)
        node_2 = Node.objects.create(**valid_node_2)
        valid_edge = self.get_valid_edge(source=node_1, target=node_2)

        response = self.client.post(create_endpoint, data=valid_edge)
        edge_data = response.data["value"]

        response = self.client.get(get_endpoint.format(edge_id=edge_data["id"]))
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="source", expect=valid_edge, response=response
        )
        self.assertResponseDataKeyEqual(
            key="target", expect=valid_edge, response=response
        )

    def test_edge_patch(self):
        create_endpoint = actual_endpoint(views.EDGE_CREATE_PATH)
        # get_endpoint = actual_endpoint(views.EDGE_GET_PATH_FORMAT)
        patch_endpoint = actual_endpoint(views.EDGE_PATCH_PATH_FORMAT)
        # test for unknown edge
        response = self.client.patch(
            patch_endpoint.format(edge_id=uuid.uuid4()), data={}
        )
        self.assertResponseEqual(
            expect=views.EDGE_PATCH_NOT_FOUND_RESPONSE, response=response
        )
        # test for success patch
        node_1 = Node.objects.create(**valid_node_1)
        node_2 = Node.objects.create(**valid_node_2)
        node_3 = Node.objects.create(**valid_node_3)
        valid_edge = self.get_valid_edge(source=node_1, target=node_2)

        response = self.client.post(create_endpoint, data=valid_edge)
        edge_data = response.data["value"]

        patch_data = {"source": node_3.id}
        response = self.client.patch(
            patch_endpoint.format(edge_id=edge_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="source", expect=patch_data, response=response
        )
        self.assertResponseDataKeyEqual(
            key="target", expect=valid_edge, response=response
        )

    def test_edge_delete(self):
        create_endpoint = actual_endpoint(views.EDGE_CREATE_PATH)
        get_endpoint = actual_endpoint(views.EDGE_GET_PATH_FORMAT)
        delete_endpoint = actual_endpoint(views.EDGE_DELETE_PATH_FORMAT)
        # test for unknown edge
        response = self.client.delete(delete_endpoint.format(edge_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.EDGE_DELETE_NOT_FOUND_RESPONSE, response=response
        )
        # test for success delete
        node_1 = Node.objects.create(**valid_node_1)
        node_2 = Node.objects.create(**valid_node_2)
        valid_edge = self.get_valid_edge(source=node_1, target=node_2)

        response = self.client.post(create_endpoint, data=valid_edge)
        edge_data = response.data["value"]

        response = self.client.delete(delete_endpoint.format(edge_id=edge_data["id"]))
        self.assertResponseOk(response=response)

        response = self.client.get(get_endpoint.format(edge_id=edge_data["id"]))
        self.assertResponseEqual(
            expect=views.EDGE_GET_NOT_FOUND_RESPONSE, response=response
        )
        # test for cascade delete
        node_1 = Node.objects.create(**valid_node_1)
        node_2 = Node.objects.create(**valid_node_2)
        valid_edge = self.get_valid_edge(source=node_1, target=node_2)

        response = self.client.post(create_endpoint, data=valid_edge)
        edge_data = response.data["value"]

        node_1.delete()

        response = self.client.get(get_endpoint.format(edge_id=edge_data["id"]))
        self.assertResponseEqual(
            expect=views.EDGE_GET_NOT_FOUND_RESPONSE, response=response
        )
