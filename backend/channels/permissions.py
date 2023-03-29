from rest_framework.permissions import BasePermission
from django.core.exceptions import ObjectDoesNotExist

class HasOpenedChannel(BasePermission):
    message = "You do not have channel opened"

    def has_permission(self, request, view):
        try:
            request.user.channel
        except ObjectDoesNotExist:
            return False
        return True

class HasNotOpenedChannel(BasePermission):
    message = "You already have channel opened"

    def has_permission(self, request, view):
        try:
            request.user.channel
        except ObjectDoesNotExist:
            return True
        return False