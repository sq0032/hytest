# coding=utf-8
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods, require_GET, require_POST

from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from chats.serializer import ChatSerializer, ReplySerializer
from chats.models import Chat, Reply
from accounts.models import EventType, Event
from items.models import Item


def getList(request):
	chat = Chat.objects.filter(seller__username=request.user)
	serializer = ChatSerializer(chat, many=True)
	json = JSONRenderer().render(serializer.data)
	print('print json:')
	print(json)
	return HttpResponse(json)

@api_view(['GET','POST'])
def reply(request, chat_id):
	if request.method == 'POST':		
		#Create a reply
		chat = Chat.objects.get(id=chat_id)
		
		#Create a 'newchat' event for seller if it is the first reply
		if Reply.objects.filter(chat=chat).exists()==False:
			print('newchat')
			receiver = User.objects.get(username=request.DATA.get('receiver'))
			type = EventType.objects.get(type='newchat')
			Event.objects.create(user=receiver, event=type, data_id=chat_id)
		
		
		reply = Reply.objects.create(chat	=chat, 
									speaker	=request.user, 
									ip		='123.123.123.123', 
									reply	=request.DATA.get('reply'),
									)

		#Create a 'newmsg' event for message speaker and receiver
		receiver = User.objects.get(username=request.DATA.get('receiver'))
		type = EventType.objects.get(type='newmsg')
		Event.objects.create(user=receiver, event=type, data_id=reply.id)
		Event.objects.create(user=request.user, event=type, data_id=reply.id)

		#Set chat "seen" attribute
		if request.user == chat.seller:
			chat.buyer_seen = False
		elif request.user == chat.buyer:
			chat.seller_seen = False
		chat.save()

		#Serializer json for return
		serializer = ReplySerializer(reply)
		json = JSONRenderer().render(serializer.data)
		return HttpResponse(json)
	
	elif request.method == 'GET':
		reply = Reply.objects.filter(chat__id=chat_id)
		
		#Set chat "seen" attribute as True
		if reply:
			if request.user == reply[0].chat.seller:
				reply[0].chat.seller_seen = True
			elif request.user == reply[0].chat.buyer:
				reply[0].chat.buyer_seen = True
			reply[0].chat.save()
		
		#Serializer json for return
		serializer = ReplySerializer(reply, many=True)
		json = JSONRenderer().render(serializer.data)
		return HttpResponse(json)

def testreply(request):
	chat = Chat.objects.get(id=1)
	chat.seller_seen = False
	chat.save()

	speaker = chat.buyer
	print(speaker)
	reply = Reply.objects.create(chat	=chat, 
								speaker	=speaker, 
								ip		='123.123.123.123', 
								reply	='test reply',
								)
	
	receiver = chat.seller
	type = EventType.objects.get(type='newmsg')
	event = Event.objects.create(user=receiver, event=type, data_id=reply.id)
		
	return HttpResponse()