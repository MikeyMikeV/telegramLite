from django.db import models
from django.contrib.auth.models import User

class MessageHitory(models.Model):
    messages = models.ManyToManyField("Message", related_name='message_history', blank=True)
    pinned_messages = models.ManyToManyField("Message", related_name='pinned_messages', blank=True)

class ChatP2P(models.Model):
    message_history = models.ForeignKey(MessageHitory, on_delete=models.CASCADE, related_name='p2p_history')
    user1 = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'init')
    user2 = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'not_init')

    def current_user(self, user):
        return self.user1 if user==self.user1 else self.user2

    def __str__(self) -> str:
        return f'p2p: {self.user1.username} - {self.user2.username}'
    
class ChatGroup(models.Model):
    message_history = models.ForeignKey(MessageHitory, on_delete=models.CASCADE, related_name='p2g_history')
    users = models.ManyToManyField(User)
    group_name = models.CharField(max_length=50)
    group_icon = models.ImageField(upload_to='chat/group/icons/', null=True, blank=True )

    def __str__(self) -> str:
        return f'p2g: {self.group_name}'
    
class Message(models.Model):
    author = models.ForeignKey(User, on_delete = models.SET_NULL, null=True, related_name='author')
    text = models.CharField(max_length=256, null = True, blank = True)
    image = models.ImageField(upload_to='chat/message_files/img/', null = True, blank = True)
    file = models.FileField(upload_to='chat/message_files/file/', null = True, blank = True)

    def check_content(self):
        if self.text or self.image or self.file:
            return True
        return False
    