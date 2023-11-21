import uuid

from rest_framework import status
from rest_framework.authtoken.models import Token
from shared.test_helper import CustomTestCase, get_actual_endpoint
from user.models import User

from . import serializers, views
from .models import Node
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

valid_predefined_node = {
    "name": "test node predefined",
    "description": "test node predefined description",
    "predefined": True,
}

invalid_node = {
    "bob": "peter",
}


actual_endpoint = get_actual_endpoint(app_name=app_name)


class NodeTest(CustomTestCase):
    user_model = User

    def test_node_ping(self):
        ping_endpoint = actual_endpoint(views.NODE_PING_PATH)
        # tst ping response
        response = self.client.get(ping_endpoint)
        self.assertResponseEqual(expect=views.NODE_PING_OK_RESPONSE, response=response)

    def test_node_create(self):
        create_endpoint = actual_endpoint(views.NODE_CREATE_PATH)
        # test create response
        # test invalid format
        response = self.client.post(create_endpoint, data=invalid_node)
        self.assertResponseEqual(
            expect=views.NODE_CREATE_INVALID_FORMAT_RESPONSE, response=response
        )
        # test success create
        response = self.client.post(create_endpoint, data=valid_node_1)
        self.assertResponseDataKeyEqual(
            key="name", expect=valid_node_1, response=response
        )
        self.assertResponseDataKeyEqual(
            key="description", expect=valid_node_1, response=response
        )

    def test_node_get(self):
        create_endpoint = actual_endpoint(views.NODE_CREATE_PATH)
        get_endpoint = actual_endpoint(views.NODE_GET_PATH_FORMAT)
        # test unknown node
        response = self.client.get(get_endpoint.format(node_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.NODE_GET_NOT_FOUND_RESPONSE, response=response
        )
        # test for success get
        response = self.client.post(create_endpoint, data=valid_node_1)
        node_data = response.data["value"]

        response = self.client.get(get_endpoint.format(node_id=node_data["id"]))
        self.assertResponseOk(response=response)
        node_data = response.data["value"]

        self.assertResponseDataKeyEqual(
            key="name", expect=valid_node_1, response=response
        )
        self.assertResponseDataKeyEqual(
            key="description", expect=valid_node_1, response=response
        )

    def test_node_patch(self):
        create_endpoint = actual_endpoint(views.NODE_CREATE_PATH)
        get_endpoint = actual_endpoint(views.NODE_GET_PATH_FORMAT)
        patch_endpoint = actual_endpoint(views.NODE_PATCH_PATH_FORMAT)
        # test for unknown patch
        response = self.client.patch(
            patch_endpoint.format(node_id=uuid.uuid4()), data={}
        )
        self.assertResponseEqual(
            expect=views.NODE_PATCH_NOT_FOUND_RESPONSE, response=response
        )
        # test for success patch
        response = self.client.post(create_endpoint, data=valid_node_1)
        node_1_data = response.data["value"]

        patch_data = {"name": "patched node name"}
        response = self.client.patch(
            patch_endpoint.format(node_id=node_1_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="name", expect=patch_data, response=response
        )
        self.assertResponseDataKeyEqual(
            key="description", expect=valid_node_1, response=response
        )
        # test for patch dependency
        response = self.client.post(create_endpoint, data=valid_node_2)
        node_2_data = response.data["value"]
        response = self.client.post(create_endpoint, data=valid_node_3)
        node_3_data = response.data["value"]
        # test set 1 dependency
        patch_data = {"dependencies": [node_2_data["id"]]}
        response = self.client.patch(
            patch_endpoint.format(node_id=node_1_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        dependencies = response.data["value"]["dependencies"]
        self.assertEqual(1, len(dependencies))
        self.assertEqual(node_2_data["id"], str(dependencies[0]))

        patch_data = {"dependencies": [node_3_data["id"]]}
        response = self.client.patch(
            patch_endpoint.format(node_id=node_1_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        dependencies = response.data["value"]["dependencies"]
        self.assertEqual(1, len(dependencies))
        self.assertEqual(node_3_data["id"], str(dependencies[0]))
        # test set 2 dependencies
        patch_data = {"dependencies": [node_2_data["id"], node_3_data["id"]]}
        response = self.client.patch(
            patch_endpoint.format(node_id=node_1_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        dependencies = response.data["value"]["dependencies"]
        self.assertEqual(2, len(dependencies))
        self.assertIn(uuid.UUID(node_2_data["id"]), dependencies)
        self.assertIn(uuid.UUID(node_3_data["id"]), dependencies)

    def test_node_delete(self):
        create_endpoint = actual_endpoint(views.NODE_CREATE_PATH)
        get_endpoint = actual_endpoint(views.NODE_GET_PATH_FORMAT)
        delete_endpoint = actual_endpoint(views.NODE_DELETE_PATH_FORMAT)
        # test for unknown delete
        response = self.client.delete(delete_endpoint.format(node_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.NODE_DELETE_NOT_FOUND_RESPONSE, response=response
        )
        # test for success delete
        response = self.client.post(create_endpoint, data=valid_node_1)
        node_data = response.data["value"]

        response = self.client.delete(delete_endpoint.format(node_id=node_data["id"]))
        self.assertResponseOk(response=response)

        response = self.client.get(get_endpoint.format(node_id=node_data["id"]))
        self.assertResponseEqual(
            expect=views.NODE_GET_NOT_FOUND_RESPONSE, response=response
        )

    def test_predefined_node_get(self):
        create_endpoint = actual_endpoint(views.NODE_CREATE_PATH)
        get_predefined_endpoint = actual_endpoint(views.NODE_GET_PREDEFINED_PATH)
        # test for empty get
        response = self.client.get(get_predefined_endpoint)
        self.assertResponseOk(response=response)
        self.assertEqual(0, len(response.data["value"]))
        # test for success get
        response = self.client.post(create_endpoint, data=valid_predefined_node)
        response = self.client.get(get_predefined_endpoint)
        self.assertResponseOk(response=response)
        self.assertEqual(1, len(response.data["value"]))
