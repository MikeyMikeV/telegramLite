import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User

from .models import ChatGroup, ChatP2P, Message

class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_id = None
        self.room_type = None
        self.room_group_name = None
        self.room = None

    def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_type = self.scope['url_route']['kwargs']['room_type']
        self.room_group_name = f'chat_{self.room_id}'
        if self.room_type == "p2p":
            self.room = ChatP2P.objects.get(id=self.room_id)
        elif self.room_type == "group":
            self.room = ChatGroup.objects.get(id=self.room_id)
        self.accept()

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        text_data_type = text_data_json['type']
        print(text_data_type)
        # send chat message event to the room
        match text_data_type:
            case 'message':
                print(text_data_json["author"],text_data_json["message"])
                user = User.objects.get(email = text_data_json["author"])
                message = Message.objects.create(author=user, text=text_data_json['message'])
                self.room.message_history.messages.add(message)
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'author':user.username,
                        'text': message.text,
                    }
                )
            case _:
                print("Wrong type received!")
        # new_message = Message.objects.create(author = self.author, text=message)
        # self.room.message_history.messages.add()

    def chat_message(self, event):
        self.send(text_data=json.dumps(event))