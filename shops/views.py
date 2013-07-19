# coding=utf-8
from django.core.exceptions import ValidationError
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods, require_GET, require_POST

from rest_framework.renderers import JSONRenderer
#from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from shops.serializers import ItemSerializer
from shops.models import Item

@api_view(['GET'])
def items_i(request):
	user = request.user
	
	items = Item.objects.filter(owner=user)
	for item in items:
		print item.attrs.all()
	serializer = ItemSerializer(items,many=True)
	return Response(serializer.data)
