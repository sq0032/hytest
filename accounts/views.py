from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
#from django.views.decorators.csrf import csrf_exempt

from rest_framework.renderers import JSONRenderer
#from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from accounts.serializers import UserSerializer

class JSONResponse(HttpResponse):
	def __init__(self, data, **kwargs):
		content = JSONRenderer().render(data)
		kwargs['content_type'] = 'application/json'
		super(JSONResponse, self).__init__(content, **kwargs)
		
@api_view(['GET'])
def login_view(request):
	email = request.GET.get('email')
	password = request.GET.get('password')
	user = authenticate(username=email, password=password)
	if user is not None:
		if user.is_active:
			login(request, user)
			serializer = UserSerializer(user)
			return Response(serializer.data)
		else:
			return Response(status=status.HTTP_401_UNAUTHORIZED)
	else:
		return Response(status=status.HTTP_401_UNAUTHORIZED)

def logout_view(request):
	logout(request)
	data = {'status':'OK'}
	return JSONResponse(data)

def loginCheck(request):
	if request.user.is_authenticated():
		data = {'status':'OK'}
	else:
		data = {'status':'ERROR'}
	return JSONResponse(data)

import string
import random
@api_view(['GET'])
def captcha(request):
	captcha = ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(6))
	request.session['captcha'] = captcha
	return HttpResponse(captcha)

@api_view(['GET'])
def user_i_view(request):
	user = request.user
	if user.is_anonymous():
		return Response({'name':'guest'})
	else:
		serializer = UserSerializer(user)
		return Response(serializer.data)


@api_view(['POST'])
def createUser(request):
	serializer = UserSerializer(data=request.DATA)
	if serializer.is_valid():
		user = serializer.object
		password = request.DATA.get('password')
		user.set_password(password)
		user.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''
class userDetail(APIView):
	def get(self, request, user_id):
		try:
			user = User.objects.get(id=user_id)
			serializer = UserSerializer(user)
			return Response(serializer.data)
		except User.DoesNotExist:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
