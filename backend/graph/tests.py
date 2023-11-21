import uuid

from edge.models import Edge
from node.models import Node
from rest_framework import status
from shared.test_helper import CustomTestCase, get_actual_endpoint
from user.models import User

from . import serializers, views
from .models import Graph, NodePosition
from .urls import app_name

valid_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "5p#:)=+}",
}


valid_user_shared_with = {
    "email": "shared_with@gmail.com",
    "username": "shared with user",
    "password": "3ReNz3m?",
}

valid_graph = {
    "title": "Test Graph",
    "created_by": valid_user["email"],
}

invalid_graph = {
    "bob": "peter",
}

valid_node_1 = {
    "name": "test node 1",
    "description": "test node 1 description",
}

valid_node_2 = {
    "name": "test node 2",
    "description": "test node 2 description",
}

invalid_node_position = {
    "bob": "peter",
}

actual_endpoint = get_actual_endpoint(app_name=app_name)


class GraphTest(CustomTestCase):
    user_model = User

    def setUp(self):
        User.objects.create(**valid_user)
        super().setUp()

    def test_graph_ping(self):
        ping_endpoint = actual_endpoint(views.GRAPH_PING_PATH)
        # test ping response
        response = self.client.get(ping_endpoint)
        self.assertResponseEqual(expect=views.GRAPH_PING_OK_RESPONSE, response=response)

    def test_graph_create(self):
        create_endpoint = actual_endpoint(views.GRAPH_CREATE_PATH)
        # test for invalid format
        response = self.client.post(create_endpoint, data=invalid_graph)
        self.assertResponseEqual(
            expect=views.GRAPH_CREATE_INVALID_FORMAT_RESPONSE, response=response
        )
        # test for success create
        serializer = serializers.GraphSerializer(data=valid_graph)
        serializer.is_valid(raise_exception=True)
        response = self.client.post(create_endpoint, data=valid_graph)
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="title", expect=valid_graph, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=valid_graph, response=response
        )

    def test_graph_get(self):
        create_endpoint = actual_endpoint(views.GRAPH_CREATE_PATH)
        get_endpoint = actual_endpoint(views.GRAPH_GET_PATH_FORMAT)
        # test for unknown graph
        response = self.client.get(get_endpoint.format(graph_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.GRAPH_GET_NOT_FOUND_RESPONSE, response=response
        )
        # test for success get
        response = self.client.post(create_endpoint, data=valid_graph)
        self.assertResponseOk(response=response)
        graph_data = response.data["value"]

        response = self.client.get(get_endpoint.format(graph_id=graph_data["id"]))
        self.assertResponseDataKeyEqual(
            key="title", expect=valid_graph, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=valid_graph, response=response
        )

    def test_graph_patch(self):
        create_endpoint = actual_endpoint(views.GRAPH_CREATE_PATH)
        get_endpoint = actual_endpoint(views.GRAPH_GET_PATH_FORMAT)
        patch_endpoint = actual_endpoint(views.GRAPH_PATCH_PATH_FORMAT)
        # test for unknown graph
        response = self.client.patch(
            patch_endpoint.format(graph_id=uuid.uuid4()), data={}
        )
        self.assertResponseEqual(
            expect=views.GRAPH_PATCH_NOT_FOUND_RESPONSE, response=response
        )
        # test for success patch
        # test for patch title
        response = self.client.post(create_endpoint, data=valid_graph)
        self.assertResponseOk(response=response)
        graph_data = response.data["value"]

        patch_data = {"title": "Patched Title"}
        response = self.client.patch(
            patch_endpoint.format(graph_id=graph_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="title", expect=patch_data, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=valid_graph, response=response
        )
        # test for patch nodes
        node_1 = Node.objects.create(**valid_node_1)
        node_2 = Node.objects.create(**valid_node_2)
        patch_data = {"nodes": [node_1.id, node_2.id]}

        response = self.client.patch(
            patch_endpoint.format(graph_id=graph_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        graph_data = response.data["value"]

        self.assertEqual(2, len(graph_data["nodes"]))
        # test for patch edge
        edge_data = {"source": node_1, "target": node_2}
        edge = Edge.objects.create(**edge_data)
        patch_data = {"edges": [edge.id]}

        response = self.client.patch(
            patch_endpoint.format(graph_id=graph_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        graph_data = response.data["value"]

        self.assertEqual(1, len(graph_data["edges"]))
        # test for patch shared_with
        user = User.objects.create(**valid_user_shared_with)
        patch_data = {"shared_with": [user.email]}

        response = self.client.patch(
            patch_endpoint.format(graph_id=graph_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        graph_data = response.data["value"]

        self.assertEqual(1, len(graph_data["shared_with"]))
        self.assertIn(user.email, graph_data["shared_with"])

    def test_graph_delete(self):
        create_endpoint = actual_endpoint(views.GRAPH_CREATE_PATH)
        get_endpoint = actual_endpoint(views.GRAPH_GET_PATH_FORMAT)
        delete_endpoint = actual_endpoint(views.GRAPH_DELETE_PATH_FORMAT)
        # test for unknown graph
        response = self.client.delete(delete_endpoint.format(graph_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.GRAPH_DELETE_NOT_FOUND_RESPONSE, response=response
        )
        # test for success delete
        response = self.client.post(create_endpoint, data=valid_graph)
        self.assertResponseOk(response=response)
        graph_data = response.data["value"]

        response = self.client.delete(delete_endpoint.format(graph_id=graph_data["id"]))
        self.assertResponseOk(response=response)

        response = self.client.get(get_endpoint.format(graph_id=graph_data["id"]))
        self.assertResponseEqual(
            expect=views.GRAPH_GET_NOT_FOUND_RESPONSE, response=response
        )

    def test_node_position_create(self):
        node_position_create_endpoint = actual_endpoint(views.NODE_POSITION_CREATE_PATH)
        create_endpoint = actual_endpoint(views.GRAPH_CREATE_PATH)
        # test for invalid format
        response = self.client.post(
            node_position_create_endpoint, data=invalid_node_position
        )
        self.assertResponseEqual(
            expect=views.NODE_POSITION_CREATE_INVALID_FORMAT_RESPONSE, response=response
        )
        # test for success create
        node_1 = Node.objects.create(**valid_node_1)

        response = self.client.post(create_endpoint, data=valid_graph)
        self.assertResponseOk(response=response)
        graph_data = response.data["value"]

        valid_node_position = {
            "graph_id": uuid.UUID(graph_data["id"]),
            "node_id": node_1.id,
            "x": 100,
            "y": 50,
        }
        response = self.client.post(
            node_position_create_endpoint, data=valid_node_position
        )
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="graph_id", expect=valid_node_position, response=response
        )
        self.assertResponseDataKeyEqual(
            key="node_id", expect=valid_node_position, response=response
        )
        self.assertResponseDataKeyEqual(
            key="x", expect=valid_node_position, response=response
        )
        self.assertResponseDataKeyEqual(
            key="y", expect=valid_node_position, response=response
        )

    def test_node_position_patch(self):
        node_position_create_endpoint = actual_endpoint(views.NODE_POSITION_CREATE_PATH)
        create_endpoint = actual_endpoint(views.GRAPH_CREATE_PATH)
        patch_endpoint = actual_endpoint(views.GRAPH_PATCH_PATH_FORMAT)
        node_position_patch_endpoint = actual_endpoint(
            views.NODE_POSITION_PATCH_PATH_FORMAT
        )
        # test for unknown graph_id
        response = self.client.patch(
            node_position_patch_endpoint.format(
                graph_id=uuid.uuid4(), node_id=uuid.uuid4()
            ),
            data={},
        )
        self.assertResponseEqual(
            expect=views.NODE_POSITION_PATCH_NOT_FOUND_RESPONSE, response=response
        )
        # test for unknown node_id
        response = self.client.post(create_endpoint, data=valid_graph)
        self.assertResponseOk(response=response)
        graph_data = response.data["value"]

        response = self.client.patch(
            node_position_patch_endpoint.format(
                graph_id=graph_data["id"], node_id=uuid.uuid4()
            ),
            data={},
        )
        self.assertResponseEqual(
            expect=views.NODE_POSITION_PATCH_NOT_FOUND_RESPONSE, response=response
        )
        # test for success patch
        node_1 = Node.objects.create(**valid_node_1)

        valid_node_position = {
            "graph_id": graph_data["id"],
            "node_id": node_1.id,
            "x": 100,
            "y": 50,
        }
        response = self.client.post(
            node_position_create_endpoint, data=valid_node_position
        )
        self.assertResponseOk(response=response)

        node_position_data = response.data["value"]
        patch_data = {"x": 200, "y": 100}

        response = self.client.patch(
            node_position_patch_endpoint.format(
                graph_id=graph_data["id"], node_id=node_1.id
            ),
            data=patch_data,
        )
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="graph_id", expect=node_position_data, response=response
        )
        self.assertResponseDataKeyEqual(
            key="node_id", expect=node_position_data, response=response
        )
        self.assertResponseDataKeyEqual(key="x", expect=patch_data, response=response)
        self.assertResponseDataKeyEqual(key="y", expect=patch_data, response=response)
