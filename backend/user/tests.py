from rest_framework import status
from rest_framework.authtoken.models import Token
from shared.test_helper import CustomTestCase, basic_user, get_actual_endpoint

from . import serializers, views
from .models import User
from .urls import app_name

valid_user = {
    "email": "test@gmail.com",
    "username": "test",
    "password": "5p#:)=+}",
    "avatar": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/012.png"
}

valid_user_wrong_password = {
    "email": "test@gmail.com",
    "password": "wrong password",
}

invalid_user = {
    "bob": "peter",
}

patch_valid_user = {
    "username": "basic",
    "password": "b~.t,2po",
    "avatar": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
}


actual_endpoint = get_actual_endpoint(app_name=app_name)


class UserTest(CustomTestCase):
    user_model = User

    def test_user_ping(self):
        ping_endpoint = actual_endpoint(views.USER_PING_PATH)
        # test ping response
        response = self.client.get(ping_endpoint)
        self.assertResponseEqual(expect=views.USER_PING_OK_RESPONSE, response=response)

    def test_user_sign_up(self):
        sign_up_endpoint = actual_endpoint(views.USER_SIGNUP_PATH)
        # test sign up response
        # test invalid format
        response = self.client.post(sign_up_endpoint, data=invalid_user)
        self.assertResponseEqual(
            expect=views.USER_SIGNUP_INVALID_FORMAT_RESPONSE, response=response
        )
        # test success sign up
        response = self.client.post(sign_up_endpoint, data=valid_user)
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="username", expect=valid_user, response=response
        )
        self.assertResponseDataKeyEqual(
            key="email", expect=valid_user, response=response
        )
        self.assertIn("token", response.data["value"], msg="token is not in response")
        # test for conflict sign up
        response = self.client.post(sign_up_endpoint, data=valid_user)
        self.assertResponseEqual(
            expect=views.USER_SIGNUP_CONFLICT_RESPONSE, response=response
        )

    def test_user_login(self):
        sign_up_endpoint = actual_endpoint(views.USER_SIGNUP_PATH)
        login_endpoint = actual_endpoint(views.USER_LOGIN_PATH)
        # test invalid format
        response = self.client.post(login_endpoint, data=invalid_user)
        self.assertResponseEqual(
            expect=views.USER_LOGIN_INVALID_FORMAT_RESPONSE, response=response
        )
        # test unknown user
        response = self.client.post(login_endpoint, data=valid_user)
        self.assertResponseEqual(
            expect=views.USER_LOGIN_NOT_FOUND_RESPONSE, response=response
        )
        # test wrong password
        response = self.client.post(sign_up_endpoint, data=valid_user)
        user_data = response.data["value"]
        response = self.client.post(login_endpoint, data=valid_user_wrong_password)
        self.assertResponseEqual(
            expect=views.USER_LOGIN_WRONG_PASSWORD_RESPONSE, response=response
        )
        # test success login
        response = self.client.post(login_endpoint, data=valid_user)
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="token", expect=user_data, response=response
        )

    def test_user_patch(self):
        login_endpoint = actual_endpoint(views.USER_LOGIN_PATH)
        patch_endpoint = actual_endpoint(views.USER_PATCH_PATH_FORMAT)
        # test success patch
        response = self.client.patch(patch_endpoint, data=patch_valid_user)
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="username", expect=patch_valid_user, response=response
        )
        response = self.client.patch(
            patch_endpoint,
            data={
                "email": valid_user["email"],
                "username": patch_valid_user["username"],
                "password": patch_valid_user["password"],
                "avatar": patch_valid_user["avatar"],
            },
        )
        self.assertResponseOk(response=response)

        # test invalid patch (no avatar, username or password field missing)
        response = self.client.patch(
            patch_endpoint,
            data={
                "username": patch_valid_user["username"],
            },
        )
        self.assertResponseNotOk(response=response)

        response = self.client.patch(
            patch_endpoint,
            data={
                "password": patch_valid_user["password"],
            },
        )
        self.assertResponseNotOk(response=response)

    def test_user_get(self):
        sign_up_endpoint = actual_endpoint(views.USER_SIGNUP_PATH)
        get_endpoint = actual_endpoint(views.USER_GET_PATH_FORMAT)
        # test not found
        response = self.client.get(get_endpoint.format(email="bob@peter.com"))
        self.assertResponseEqual(
            expect=views.USER_GET_NOT_FOUND_RESPONSE, response=response
        )
        # test success get
        response = self.client.post(sign_up_endpoint, data=valid_user)
        response = self.client.get(get_endpoint.format(email=valid_user["email"]))
        self.assertResponseOk(response=response)
        self.assertResponseDataKeyEqual(
            key="username", expect=valid_user, response=response
        )

    def test_user_get_self(self):
        get_self_endpoint = actual_endpoint(views.USER_GET_SELF_PATH)
        # test success get
        response = self.client.get(get_self_endpoint)
        self.assertResponseOk(response=response)

        self.assertResponseDataKeyEqual(
            key="email", expect=basic_user, response=response
        )
        self.assertResponseDataKeyEqual(
            key="username", expect=basic_user, response=response
        )

    def test_user_get_all(self):
        sign_up_endpoint = actual_endpoint(views.USER_SIGNUP_PATH)
        get_all_endpoint = actual_endpoint(views.USER_GET_ALL_PATH)
        # test initial get all
        response = self.client.get(get_all_endpoint)
        self.assertResponseOk(response=response)
        self.assertEqual(1, len(response.data["value"]))
        # test get all
        response = self.client.post(sign_up_endpoint, data=valid_user)
        response = self.client.get(get_all_endpoint)
        self.assertResponseOk(response=response)
        self.assertEqual(2, len(response.data["value"]))
