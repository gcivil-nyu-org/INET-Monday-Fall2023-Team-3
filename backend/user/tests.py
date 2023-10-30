# from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

# Create your tests here.


class UserTests(APITestCase):
    def setUp(self):
        data = {
            "email": "existinguser@example.com",
            "username": "existinguser",
            "password": "testpassword",
        }
        # Create a user for testing login and update
        self.existing_user = User.objects.create(**data)
        self.test_user_token = Token.objects.create(user=self.existing_user)

    def test_ping(self):
        response = self.client.post("/user/ping/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "pong"})

    def test_user_login(self):
        data = {"email": "existinguser@example.com", "password": "testpassword"}
        response = self.client.post("/user/login/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_user_get(self):
        data = {
            "email": "existinguser@example.com",
            "username": "existinguser",
        }
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.test_user_token.key)
        response = self.client.get("/user/get/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, data)

    def test_user_update(self):
        data = {
            "email": "existinguser@example.com",
            "username": "updateduser",
        }
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.test_user_token.key)
        response = self.client.post("/user/update/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "updateduser")

    def test_user_signup(self):
        data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "newpassword",
        }
        response = self.client.post("/user/signup/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
