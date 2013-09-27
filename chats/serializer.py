# coding=utf-8
from chats.models import Chat, Reply
from rest_framework import serializers
from django.contrib.auth.models import User

class ChatSerializer(serializers.ModelSerializer):
    #chat = RelatedField()
    class Meta:
        model = Chat
        field = ('chat', 'seller', 'buyer', 'date', 'time', 'seller_seen', 'buyer_seen')
        #field = ('chat')
        depth = 1
        
class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        field = ('speaker', 'reply', 'date', 'time')
