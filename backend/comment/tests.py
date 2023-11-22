import uuid

from graph.models import Graph
from node.models import Node
from rest_framework import status
from shared.test_helper import CustomTestCase, get_actual_endpoint
from user.models import User

from . import serializers, views
from .models import GraphComment, NodeComment
from .urls import app_name

valid_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "5p#:)=+}",
}

valid_comment = {
    "body": "valid comment",
    "created_by": valid_user["email"],
    "belongs_to": "",
}

invalid_comment = {
    "bob": "peter",
}

valid_node = {
    "name": "test node 1",
    "description": "test node 1 description",
}

valid_graph = {
    "title": "Test Graph",
    "created_by": valid_user["email"],
}

actual_endpoint = get_actual_endpoint(app_name=app_name)


class CommentTest(CustomTestCase):
    user_model = User

    def test_comment_ping(self):
        ping_endpoint = actual_endpoint(views.COMMENT_PING_PATH)
        # test ping response
        response = self.client.get(ping_endpoint)
        self.assertResponseEqual(
            expect=views.COMMENT_PING_OK_RESPONSE, response=response
        )


class NodeCommentTest(CustomTestCase):
    user_model = User

    def setUp(self):
        User.objects.create(**valid_user)
        super().setUp()

    def test_node_comment_create(self):
        create_endpoint = actual_endpoint(views.NODE_COMMENT_CREATE_PATH)
        # test for invalid format
        response = self.client.post(create_endpoint, data=invalid_comment)
        self.assertResponseEqual(
            expect=views.NODE_COMMENT_CREATE_INVALID_FORMAT_RESPONSE, response=response
        )
        # test for success create
        node = Node.objects.create(**valid_node)
        valid_comment["belongs_to"] = node.id

        response = self.client.post(create_endpoint, data=valid_comment)
        self.assertResponseOk(response=response)
        comment_data = response.data["value"]

        self.assertResponseDataKeyEqual(
            key="body", expect=valid_comment, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=valid_comment, response=response
        )
        self.assertResponseDataKeyEqual(
            key="belongs_to", expect=valid_comment, response=response
        )

    def test_node_comment_get(self):
        create_endpoint = actual_endpoint(views.NODE_COMMENT_CREATE_PATH)
        get_endpoint = actual_endpoint(views.NODE_COMMENT_GET_PATH_FORMAT)
        # test for unknown comment
        response = self.client.get(get_endpoint.format(comment_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.NODE_COMMENT_GET_NOT_FOUND_RESPONSE, response=response
        )
        # test for success get
        node = Node.objects.create(**valid_node)
        valid_comment["belongs_to"] = node.id

        response = self.client.post(create_endpoint, data=valid_comment)
        self.assertResponseOk(response=response)
        comment_data = response.data["value"]

        response = self.client.get(get_endpoint.format(comment_id=comment_data["id"]))
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="body", expect=valid_comment, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=valid_comment, response=response
        )
        self.assertResponseDataKeyEqual(
            key="belongs_to", expect=valid_comment, response=response
        )

    def test_node_comment_patch(self):
        create_endpoint = actual_endpoint(views.NODE_COMMENT_CREATE_PATH)
        patch_endpoint = actual_endpoint(views.NODE_COMMENT_PATCH_PATH_FORMAT)
        # test for unknown comment
        response = self.client.patch(patch_endpoint.format(comment_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.NODE_COMMENT_PATCH_NOT_FOUND_RESPONSE, response=response
        )
        # test for success patch
        node = Node.objects.create(**valid_node)
        valid_comment["belongs_to"] = node.id

        response = self.client.post(create_endpoint, data=valid_comment)
        self.assertResponseOk(response=response)
        comment_data = response.data["value"]
        patch_data = {"body": "wow, awesome comment"}

        response = self.client.patch(
            patch_endpoint.format(comment_id=comment_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="body", expect=patch_data, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=comment_data, response=response
        )
        self.assertResponseDataKeyEqual(
            key="belongs_to", expect=comment_data, response=response
        )

    def test_node_comment_delete(self):
        create_endpoint = actual_endpoint(views.NODE_COMMENT_CREATE_PATH)
        get_endpoint = actual_endpoint(views.NODE_COMMENT_GET_PATH_FORMAT)
        delete_endpoint = actual_endpoint(views.NODE_COMMENT_DELETE_PATH_FORMAT)
        # test for unknown comment
        response = self.client.delete(delete_endpoint.format(comment_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.NODE_COMMENT_DELETE_NOT_FOUND_RESPONSE, response=response
        )
        # test for success delete
        node = Node.objects.create(**valid_node)
        valid_comment["belongs_to"] = node.id

        response = self.client.post(create_endpoint, data=valid_comment)
        self.assertResponseOk(response=response)
        comment_data = response.data["value"]

        response = self.client.delete(
            delete_endpoint.format(comment_id=comment_data["id"])
        )
        self.assertResponseOk(response=response)

        response = self.client.get(get_endpoint.format(comment_id=comment_data["id"]))
        self.assertResponseEqual(
            expect=views.NODE_COMMENT_GET_NOT_FOUND_RESPONSE, response=response
        )


class GraphCommentTest(CustomTestCase):
    user_model = User

    def setUp(self):
        user = User.objects.create(**valid_user)
        valid_graph["created_by"] = user
        super().setUp()

    def test_graph_comment_create(self):
        create_endpoint = actual_endpoint(views.GRAPH_COMMENT_CREATE_PATH)
        # test for invalid format
        response = self.client.post(create_endpoint, data=invalid_comment)
        self.assertResponseEqual(
            expect=views.GRAPH_COMMENT_CREATE_INVALID_FORMAT_RESPONSE, response=response
        )
        # test for success create
        graph = Graph.objects.create(**valid_graph)
        valid_comment["belongs_to"] = graph.id

        response = self.client.post(create_endpoint, data=valid_comment)
        self.assertResponseOk(response=response)
        comment_data = response.data["value"]

        self.assertResponseDataKeyEqual(
            key="body", expect=valid_comment, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=valid_comment, response=response
        )
        self.assertResponseDataKeyEqual(
            key="belongs_to", expect=valid_comment, response=response
        )

    def test_graph_comment_get(self):
        create_endpoint = actual_endpoint(views.GRAPH_COMMENT_CREATE_PATH)
        get_endpoint = actual_endpoint(views.GRAPH_COMMENT_GET_PATH_FORMAT)
        # test for unknown comment
        response = self.client.get(get_endpoint.format(comment_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.GRAPH_COMMENT_GET_NOT_FOUND_RESPONSE, response=response
        )
        # test for success get
        graph = Graph.objects.create(**valid_graph)
        valid_comment["belongs_to"] = graph.id

        response = self.client.post(create_endpoint, data=valid_comment)
        self.assertResponseOk(response=response)
        comment_data = response.data["value"]

        response = self.client.get(get_endpoint.format(comment_id=comment_data["id"]))
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="body", expect=valid_comment, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=valid_comment, response=response
        )
        self.assertResponseDataKeyEqual(
            key="belongs_to", expect=valid_comment, response=response
        )

    def test_graph_comment_patch(self):
        create_endpoint = actual_endpoint(views.GRAPH_COMMENT_CREATE_PATH)
        get_endpoint = actual_endpoint(views.GRAPH_COMMENT_GET_PATH_FORMAT)
        patch_endpoint = actual_endpoint(views.GRAPH_COMMENT_PATCH_PATH_FORMAT)
        # test for unknown comment
        response = self.client.patch(
            patch_endpoint.format(comment_id=uuid.uuid4()), data={}
        )
        self.assertResponseEqual(
            expect=views.GRAPH_COMMENT_PATCH_NOT_FOUND_RESPONSE, response=response
        )
        # test for success patch
        graph = Graph.objects.create(**valid_graph)
        valid_comment["belongs_to"] = graph.id

        response = self.client.post(create_endpoint, data=valid_comment)
        self.assertResponseOk(response=response)
        comment_data = response.data["value"]
        patch_data = {"body": "wow, awesome comment"}

        response = self.client.patch(
            patch_endpoint.format(comment_id=comment_data["id"]), data=patch_data
        )
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="body", expect=patch_data, response=response
        )
        self.assertResponseDataKeyEqual(
            key="created_by", expect=comment_data, response=response
        )
        self.assertResponseDataKeyEqual(
            key="belongs_to", expect=comment_data, response=response
        )

    def test_graph_comment_delete(self):
        create_endpoint = actual_endpoint(views.GRAPH_COMMENT_CREATE_PATH)
        get_endpoint = actual_endpoint(views.GRAPH_COMMENT_GET_PATH_FORMAT)
        delete_endpoint = actual_endpoint(views.GRAPH_COMMENT_DELETE_PATH_FORMAT)
        # test for unknown comment
        response = self.client.delete(delete_endpoint.format(comment_id=uuid.uuid4()))
        self.assertResponseEqual(
            expect=views.GRAPH_COMMENT_DELETE_NOT_FOUND_RESPONSE, response=response
        )
        # test for success delete
        graph = Graph.objects.create(**valid_graph)
        valid_comment["belongs_to"] = graph.id

        response = self.client.post(create_endpoint, data=valid_comment)
        self.assertResponseOk(response=response)
        comment_data = response.data["value"]

        response = self.client.delete(
            delete_endpoint.format(comment_id=comment_data["id"])
        )
        self.assertResponseOk(response=response)

        response = self.client.get(get_endpoint.format(comment_id=comment_data["id"]))
        self.assertResponseEqual(
            expect=views.GRAPH_COMMENT_GET_NOT_FOUND_RESPONSE, response=response
        )
