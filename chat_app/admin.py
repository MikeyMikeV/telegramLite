from django.contrib import admin
from .models import ChatP2P, ChatGroup, Message, MessageHistory

admin.site.register(ChatP2P)
admin.site.register(ChatGroup)
admin.site.register(MessageHistory)
admin.site.register(Message)