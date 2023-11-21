from typing import Any, Type

from django.db import models
from rest_framework import serializers, status
from rest_framework.response import Response


def ok(value: Any) -> dict:
    """create standard response body for success

    Args:
        value (Any): value to be returned when success

    Returns:
        dict: standard response body for success
    """
    return {
        "status": True,
        "detail": "ok",
        "value": value,
    }


def error(message: str) -> dict:
    """create standard response body for errors

    Args:
        message (str): error message

    Returns:
        dict: standard response body for error
    """
    return {
        "status": False,
        "detail": message,
    }


def handle_create(
    create_data: dict,
    serializer_class: Type[serializers.Serializer],
    invalid_format_response: Response,
) -> Response:
    """handle simple creation for http request

    Args:
        create_data (dict): request body containing create data
        serializer_class (Type[serializers.Serializer]): serializer class for the instance model
        invalid_format_response (Response): response when request body is invalid

    Returns:
        Response: corresponding response
    """
    serializer = serializer_class(data=create_data)
    # serializer invalid -> invalid format response
    if not serializer.is_valid():
        return invalid_format_response
    # model serializer id field is read_only, therefore
    # id in request body will have no effect

    # create model instance
    serializer.save()
    return Response(ok(serializer.data), status=status.HTTP_200_OK)


def handle_get(
    model_class: Type[models.Model],
    instance_identifier: dict,
    serializer_class: Type[serializers.Serializer],
    not_found_response: Response,
) -> Response:
    """handle simple get for http request

    Args:
        model_class (Type[models.Model]): model class of the instance
        instance_identifier (dict): keys and values to uniquely identify model instance
        serializer_class (Type[serializers.Serializer]): serializer class for the instance model
        not_found_response (Response): response when model instance not found

    Returns:
        Response: corresponding response
    """
    instance = model_class.objects.filter(**instance_identifier).first()
    # instance not found -> not found response
    if instance is None:
        return not_found_response
    # serialize model instance
    serializer = serializer_class(instance=instance)
    return Response(ok(serializer.data), status=status.HTTP_200_OK)


def handle_patch(
    model_class: Type[models.Model],
    instance_identifier: dict,
    patch_data: dict,
    patch_serializer_class: Type[serializers.Serializer],
    not_found_response: Response,
    result_serializer_class: Type[serializers.Serializer] = None,
) -> Response:
    """handle simple patch for http request

    Args:
        model_class (Type[models.Model]): model class of the instance
        instance_identifier (dict): keys and values to uniquely identify model instance
        patch_data (dict): request body containing patch data
        patch_serializer_class (Type[serializers.Serializer]): serializer for patching the instance model
        not_found_response (Response): response when instance not found
        result_serializer_class (Type[serializers.Serializer]): serializer for returning the instance model

    Returns:
        Response: corresponding response
    """
    instance = model_class.objects.filter(**instance_identifier).first()
    # instance not found -> not found response
    if instance is None:
        return not_found_response
    # instantiate patch serialzier
    serializer = patch_serializer_class(
        instance=instance, data=patch_data, partial=True
    )
    # serializer invalid -> invalid format response
    # serializer will never be invalid since partial=True
    serializer.is_valid(raise_exception=True)
    if result_serializer_class is None:
        # patch model instance
        serializer.save()
        return Response(ok(serializer.data), status=status.HTTP_200_OK)
    instance = serializer.save()
    serializer = result_serializer_class(instance=instance)
    return Response(ok(serializer.data), status=status.HTTP_200_OK)


def handle_delete(
    model_class: Type[models.Model],
    instance_identifier: dict,
    not_found_response: Response,
) -> Response:
    """handle simple delete for http request

    Args:
        model_class (Type[models.Model]): model class of the instance
        instance_identifier (dict): keys and values to uniquely identify model instance
        not_found_response (Response): response when instance not found

    Returns:
        Response: corresponding response
    """
    instance = model_class.objects.filter(**instance_identifier).first()
    # instance not found -> not found response
    if instance is None:
        return not_found_response
    # delete model instance
    instance.delete()
    return Response(ok({}), status=status.HTTP_200_OK)
