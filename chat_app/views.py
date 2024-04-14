from django.shortcuts import render
from rest_framework import viewsets, permissions, parsers, response
from . import models, serializers


class MessageViewSet(viewsets.ModelViewSet):
    queryset = models.Message.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.MessageSerializer
    parser_classes = (parsers.JSONParser,)

    # def create(self, )

class MessageHistoryViewSet(viewsets.ModelViewSet):
    queryset = models.MessageHitory.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.MessageHistorySerializer
    parser_classes = (parsers.JSONParser,)

class ChatP2PViewSet(viewsets.ModelViewSet):
    queryset = models.ChatP2P.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.ChatP2PSerializer
    parser_classes = (parsers.JSONParser,)

class ChatGroupViewSet(viewsets.ModelViewSet):
    queryset = models.ChatGroup.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.ChatGroupSerializer
    parser_classes = (parsers.JSONParser,)

class CreateMessageP2PViewSet(viewsets.ModelViewSet):
    parser_classes = [permissions.AllowAny]
    parser_classes = (parsers.JSONParser,)
    serializer_class = serializers.CreateMessageP2PSerializer

    def list(self, request):
        return response.Response('list')

    def create(self, request):
        chat_id = request.data['chat_id']
        chat = models.ChatP2P.objects.get(pk = chat_id)
        message = serializers.MessageSerializer(data=request.data['message'])
        if message.is_valid():
            message = message.save()
        chat.message_history.messages.add(message)
        return response.Response("Message created")