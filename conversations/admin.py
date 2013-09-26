from django.contrib import admin
from conversations.models import Conversation, Reply

admin.site.register(Conversation)
admin.site.register(Reply)