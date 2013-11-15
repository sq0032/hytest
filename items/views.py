# coding=utf-8
from django.core.exceptions import ValidationError
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods, require_GET, require_POST
from django.core.context_processors import csrf
from django.shortcuts import render_to_response

from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from items.serializers import CategorySerializer
from items.models import Category

from items.serializers import AttributeSerializer
from items.models import Attribute

from items.serializers import ItemSerializer
from items.models import Item
from items.models import ItemImage
from items.models import Thumbnail

from chats.models import Chat
from chats.serializer import ChatSerializer

from PIL import Image

class JSONResponse(HttpResponse):
	def __init__(self, data, **kwargs):
		content = JSONRenderer().render(data)
		kwargs['content_type'] = 'application/json'
		super(JSONResponse, self).__init__(content, **kwargs)

@require_GET
def index(request):
	c = {}
	c.update(csrf(request))
	print csrf(request)
	return render_to_response("index.html", c)

@api_view(['GET'])
def items_i(request):
	user = request.user
	
	items = Item.objects.filter(owner=user)
	serializer = ItemSerializer(items,many=True)
	return Response(serializer.data)

@require_POST
def uploadItemImage(request,item_id,index):
	item = Item.objects.get(id=item_id)
	for index in request.FILES:
		print index
		#save the first image as a thumbnail
		image = ItemImage(item=item,index=index,image=request.FILES[index])
		image.save()
		
		if index == '0':
			thumbnail = Thumbnail(name = 'test', item = item, thumbnail=request.FILES[index])
			thumbnail.save()		
	return JSONResponse({'status':'OK'},status=status.HTTP_201_CREATED)


import random
def randomID(length):
	return ''.join(random.choice("0123456789abcdef") for i in range(length))

class ItemsList(APIView):
	def get(self, request, format=None):
		return Response(status=status.HTTP_204_NO_CONTENT)

	def post(self, request, format=None):
		data = request.DATA
		data['owner'] = request.user.id
		data['rid'] = randomID(40)
		serializer = ItemSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
class ItemsDetail(APIView):
	def delete(self, request, id, format=None):
		user = request.user
		try:
			item = Item.objects.get(id=id)
			if item.owner.id != user.id:
				item.follower.remove(request.user)
				return Response('removed')
		except Item.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)
		item.state = Item.DEL
		item.save()
		return Response(status=status.HTTP_200_OK)
	def get(self, request, id):
		item = Item.objects.get(id=id)
		serializer = ItemSerializer(item, user=request.user)
		return Response(serializer.data)

@api_view(['GET'])
def getItemCategorys(request):
	categorys = Category.objects.all()
	serializer = CategorySerializer(categorys,many=True)
	return Response(serializer.data)

#權限未完成
#取得聊天室清單
@api_view(['GET'])
def getItemConversationList(request, item_id):
	chat = Chat.objects.filter(item__id=item_id)
	
	if chat.exists()==False:
		print('has no chat')
		return Response()
	
	print(chat[0].buyer)
	print(chat[0])
	
	if chat[0].seller == request.user:
		serializer = ChatSerializer(chat, many=True)
	elif chat.filter(buyer = request.user).exists() == True:
		chat = chat.filter(buyer = request.user)
		serializer = ChatSerializer(chat)
	else:
		return Response()
		

#	print('print chat')
#	print(request.user)
#	print(chat)
	
	return Response(serializer.data)

class ItemsFavorList(APIView):
	def post(self, request, item_id):
		item = Item.objects.get(id=item_id)
		if item.owner==request.user:
			print('is owner')
			return Response()
		
		if Chat.objects.filter(item = item).filter(buyer = request.user).exists() == False:
			print('has no chat')
			chat = Chat(buyer = request.user,
						seller = item.owner,
						item = item)
			chat.save();
		
		if item.follower.all().filter(username = request.user.username).exists():
			item.follower.remove(request.user)
			return HttpResponse('removed')
		else:
			item.follower.add(request.user)
			serializer = ItemSerializer(item, user=request.user)
			return Response(serializer.data)
		return Response()
	
	def get(self, request, item_id):	
		item = Item.objects.filter(follower = request.user)
		serializer = ItemSerializer(item, user=request.user, many=True)
		return Response(serializer.data)

	def delete(self, request, item_id):
		item = Item.objects.filter(follower = request.user)
		item.follower.remove(request.user)
		print('remove item')
		return HttpResponse('removed')

@api_view(['GET'])
def getItemTest(request, item_id):
	item = Item.objects.get(id=item_id)
	print(item)
	print('print item.pic')
	print(str(item.pic))
	img = Image.open(item.pic)
#	print('print img size')
	img = cropped_thumbnail(img, (100,100))
	
	#img.show()
#	img.save(MEDIA_ROOT+str(item.pic),'PNG')
#	img.save('D:/test/sdf.png')
#	print(type(img))
	#item.pic = img
	#item.save()
	return HttpResponse(123)
	#return Response(serializer.data)


