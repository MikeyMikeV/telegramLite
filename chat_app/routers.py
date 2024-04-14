from rest_framework import routers
from . import views
router = routers.DefaultRouter()

router.register(r'messages',views.MessageViewSet)
router.register(r'message_history', views.MessageHistoryViewSet)
router.register(r'chat_p2p',views.ChatP2PViewSet)
router.register(r'chat_group',views.ChatGroupViewSet)
router.register(r'create_message',views.CreateMessageP2PViewSet, basename='CreateMessageP2PViewSet')

