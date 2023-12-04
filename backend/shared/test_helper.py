from typing import Any, Callable, Type  # noqa: F401

from app.settings import BACKEND_URL_ENDPOINT
from django.db import models
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.test import APITestCase


def get_actual_endpoint(app_name: str) -> Callable[[str], str]:
    """create template function to generate actual endpoint

    Args:
        app_name (str): name of current module

    Returns:
        Callable[[str], str]: template function to generate actual endpoint
    """

    def actual_endpoint(endpoint: str) -> str:
        """get actual endpoint

        Args:
            endpoint (str): current endpoint

        Returns:
            str: actual endpoint
        """
        return f"/{BACKEND_URL_ENDPOINT}/{app_name}/{endpoint}"

    return actual_endpoint


basic_user = {
    "email": "basic@gmail.com",
    "username": "basic",
    "password": "b~.t,2po",
}


class CustomTestCase(APITestCase):
    user_model: Type[models.Model] = None

    def setUp(self):
        user = self.user_model.objects.create(**basic_user)
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    def assertResponseStatusCodeEqual(self, expect: int, response: Response):
        self.assertEqual(
            expect,
            response.status_code,
            "http response status code mismatch",
        )

    def assertResponseDataEqual(self, expect: Response, response: Response):
        self.assertEqual(
            expect.data,
            response.data,
            "http response data mismatch",
        )

    def assertResponseEqual(self, expect: Response, response: Response):
        self.assertResponseStatusCodeEqual(expect=expect.status_code, response=response)
        self.assertResponseDataEqual(expect=expect, response=response)

    def assertResponseDataKeyEqual(self, key: str, expect: dict, response: Response):
        self.assertEqual(
            expect[key],
            response.data["value"][key],
            f"http response data key {key} mismatch",
        )

    def assertResponseOk(self, response: Response):
        self.assertEqual(response.status_code, status.HTTP_200_OK, "response is not ok")
        self.assertTrue(response.data["status"], "response is not ok")
        self.assertEqual(response.data["detail"], "ok", "response is not ok")
        self.assertIsNotNone(response.data["value"], "response is not ok")

    def assertResponseNotOk(self, response: Response):
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "response is ok")
