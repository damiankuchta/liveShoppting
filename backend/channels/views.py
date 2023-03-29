from django.conf import settings

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated

from .permissions import HasOpenedChannel, HasNotOpenedChannel
from .serializers import ChannelSerializer

import boto3
import botocore

class OpenChannelView(CreateAPIView):
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated, HasNotOpenedChannel]

    def __init__(self, **kwargs) -> None:

        # Create a new boto3 client with the AWS region, access ID, and access secret settings
        self.client = boto3.client(
            "kinesisvideo",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_ID,
            aws_secret_access_key=settings.AWS_ACCESS_SECRET
        )

        self.user = self.request.user
        super().__init__(**kwargs)

    # Define the create method, which creates a new channel
    def create(self, request, *args, **kwargs):

        # Get the channel name from the request data
        channel_name = request.data.get('name')

        # Use the boto3 client to create a new signaling channel with the given name
        response = self.client.create_signaling_channel(
            ChannelName=channel_name,
            ChannelType="SINGLE_MASTER",
            SingleMasterConfiguration={
                "MessageTtlSeconds": 3600
            }
        )
        channel_arn = response['ChannelARN']

        # Use the serializer to validate and save the new channel to the database
        serializer = self.get_serializer(data={
            'user': self.user.id,
            'arn': channel_arn,
            'signed_link': self._create_singed_link(),
        })

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def _create_singed_link(self, channel_arn):
        # Use the botocore session to generate a signed URL for the channel
        session = botocore.session.Session()
        kinesisvideo = session.create_client(
            'kinesisvideo',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_ID,
            aws_secret_access_key=settings.AWS_ACCESS_SECRET
        )
        response = kinesisvideo.get_data_endpoint(
            StreamARN= channel_arn,
            APIName='GET_SIGNALING_CHANNEL_ENDPOINT'
        )
        endpoint = response['DataEndpoint']
        signed_url = kinesisvideo.generate_presigned_url(
            ClientMethod='get_signaling_channel_endpoint',
            Params={
                'ChannelARN': channel_arn,
                'SingleMasterChannelEndpointConfiguration': {
                    'Protocols': ['WSS', 'HTTPS'],
                    'Role': 'VIEWER'
                }
            },
            ExpiresIn=3600,
            EndpointUrl=endpoint
        )

        return signed_url


class CloseChannelView(DestroyAPIView):
    permission_classes = [IsAuthenticated, HasOpenedChannel]
    serializer_class = ChannelSerializer

    def get_object(self):
        return self.request.user.channel

    def perform_destroy(self, instance):

        # We use boto3 to call the Kinesis Video Signaling API to delete the signaling channel
        response = self.client.delete_signaling_channel(
            ChannelARN=instance.arn,
            CurrentVersion=self._get_current_channel_version()
        )

        instance.delete()
        return response

    # The _get_current_channel_version method is called to retrieve the current version of the channel
    # so that we can provide it as a parameter to the delete_signaling_channel API call, 
    # current version it is needed to close the channel
    def _get_current_channel_version(self):
        response = self.client.describe_signaling_channel(
            ChannelARN=self.request.user.channel.arn
        )
        return response['ChannelInfo']['Version']