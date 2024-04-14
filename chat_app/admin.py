from django.contrib import admin
from .models import ChatP2P, ChatGroup, Message, MessageHitory

admin.site.register(ChatP2P)
admin.site.register(ChatGroup)
admin.site.register(MessageHitory)
admin.site.register(Message)