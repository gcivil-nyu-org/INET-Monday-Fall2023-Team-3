from rest_framework.test import APITestCase
from rest_framework import status

from .models import CustomUser
from .serializers import UserSerializer
from .views import USER_PONG_MSG, USER_INVALID_FORMAT_MSG, USER_PASSWORD_MISMATCH_MSG, USER_ALREADY_EXISTS_MSG, USER_NOT_FOUND_MSG

test_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "testpassword",
}

# Create your tests here.
class CustomUserTest(APITestCase):
    def test_ping(self):
        response = self.client.get("/user/ping/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, USER_PONG_MSG)

    def test_user_login_invalid_data(self):
        data = { "bob": "james" }
        response = self.client.post("/user/login/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, USER_INVALID_FORMAT_MSG)

    def test_user_login_not_found(self):
        data = { "email": "not@exist.com", "username": "notfound" }
        response = self.client.post("/user/login/", data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, USER_NOT_FOUND_MSG)

    def test_user_login_invalid_password(self):
        CustomUser.objects.create(**test_user)
        data = { "email": test_user["email"], "password": "123" }
        response = self.client.post("/user/login/", data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, USER_PASSWORD_MISMATCH_MSG)
        CustomUser.objects.get(email=test_user["email"]).delete()

    def test_user_login_success(self):
        CustomUser.objects.create(**test_user)
        response = self.client.post("/user/login/", test_user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data["token"])
        CustomUser.objects.get(email=test_user["email"]).delete()

    def test_user_create_invalid_data(self):
        data = { "bob": "james" }
        response = self.client.post("/user/create/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, USER_INVALID_FORMAT_MSG)

    def test_user_create_exists(self):
        CustomUser.objects.create(**test_user)
        response = self.client.post("/user/create/", test_user)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data, USER_ALREADY_EXISTS_MSG)
        CustomUser.objects.get(email=test_user["email"]).delete()

    def test_user_create_success(self):
        response = self.client.post("/user/create/", test_user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data["token"])
        CustomUser.objects.get(email=test_user["email"]).delete()

    def test_user_get_invalid(self):
        response = self.client.get("/user/get/")
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_user_get_success(self):
        response = self.client.post("/user/create/", test_user)
        response = self.client.get("/user/get/", headers={ "Authorization": f"token {response.data['token']}" })
        self.assertEqual(response.data, { "email": test_user["email"], "username": test_user["username"] })
        CustomUser.objects.get(email=test_user["email"]).delete()

    def test_user_update_invalid_data(self):
        response = self.client.post("/user/create/", test_user)
        data = { "bob": "james" }
        response = self.client.post("/user/update/", data, headers={ "Authorization": f"token {response.data['token']}" })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, USER_INVALID_FORMAT_MSG)
        CustomUser.objects.get(email=test_user["email"]).delete()

    def test_user_update_not_found(self):
        response = self.client.post("/user/create/", test_user)
        data = { "email": "not@exist.com", "username": "notfound" }
        response = self.client.post("/user/update/", data, headers={ "Authorization": f"token {response.data['token']}" })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, USER_PASSWORD_MISMATCH_MSG)

    def test_user_update_succeed(self):
        response = self.client.post("/user/create/", test_user)
        data = {
            "email": "test@gmail.com",
            "username": "test-bob",
            "password": "testpassword",
        }
        response = self.client.post("/user/update/", data, headers={ "Authorization": f"token {response.data['token']}" })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, data)

        modified_user = CustomUser.objects.get(email=test_user["email"])
        modified_user = UserSerializer(instance=modified_user)
        self.assertEqual(modified_user.data, data)
        CustomUser.objects.get(email=test_user["email"]).delete()
