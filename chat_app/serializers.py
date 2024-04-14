from rest_framework import serializers
from . import models


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Message
        fields = '__all__'

class MessageHistorySerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True)
    class Meta:
        model = models.MessageHitory
        fields = "__all__"

class ChatP2PSerializer(serializers.ModelSerializer):
    message_history = MessageHistorySerializer()
    class Meta:
        model = models.ChatP2P
        fields = '__all__'

class ChatGroupSerializer(serializers.ModelSerializer):
    message_history = MessageHistorySerializer()
    class Meta:
        model = models.ChatGroup
        fields = '__all__'


class CreateMessageP2PSerializer(serializers.Serializer):
    chat_id = serializers.IntegerField()
    message = MessageSerializer()

# {
#     "chat_id":cid,
#     "message":{
#         "author":user_id,
#         "text":text,
#         "image":img,
#         "file":file
#     }
# }