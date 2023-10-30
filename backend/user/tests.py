from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class UserAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "email": "existinguser@example.com",
            "username": "existinguser",
            "password": "testpassword",
        }
        # Create a user for testing login and update
        self.existing_user = User.objects.create(**self.user_data)
        self.test_user_token = Token.objects.create(user=self.existing_user)

    def test_ping(self):
        response = self.client.post("/user/ping/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "pong"})

    def test_user_signup_successful(self):
        data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "newpassword",
        }
        response = self.client.post("/user/signup/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_signup_invalid_data(self):
        response = self.client.post("/user/signup/", {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_signup_existing_user(self):
        response = self.client.post("/user/signup/", self.user_data)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_user_login_successful(self):
        response = self.client.post(
            "/user/login/",
            {
                "email": "existinguser@example.com",
                "password": "testpassword",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_login_invalid_email(self):
        response = self.client.post(
            "/user/login/",
            {
                "email": "nonexistent@example.com",
                "password": "testpassword",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_login_incorrect_password(self):
        response = self.client.post(
            "/user/login/",
            {
                "email": "existinguser@example.com",
                "password": "wrongpassword",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_get(self):
        data = {
            "email": "existinguser@example.com",
            "username": "existinguser",
        }
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.test_user_token.key)
        response = self.client.get("/user/get/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, data)

    def test_user_update_successful(self):
        data = {
            "email": "existinguser@example.com",
            "username": "updateduser",
        }
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.test_user_token.key)
        response = self.client.post("/user/update/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "updateduser")

    def test_user_update_failed(self):
        data = {
            "email": "invalid-email",
            "username": "updateduser",
        }
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.test_user_token.key)
        response = self.client.post("/user/update/", data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def tearDown(self):
        self.existing_user.delete()
