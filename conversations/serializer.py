from conversation.models import Conversation, Reply
from rest_framework import serializers

class ConvSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        field = ('seller', 'buyer', 'date', 'time', 'seller_seen', 'buyer_seen')
        
class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        field = ('speaker', 'reply', 'date', 'time')