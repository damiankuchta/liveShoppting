from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Channel

class ChannelSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Channel
        fields = ['id', 'user', 'arn', 'created_at', 'updated_at', 'signed_link']
        read_only_fields = ['id', 'created_at', 'updated_at']