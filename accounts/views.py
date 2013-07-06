# coding=utf-8
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from django.core.mail import EmailMultiAlternatives
#from django.views.decorators.csrf import csrf_exempt

from rest_framework.renderers import JSONRenderer
#from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from accounts.serializers import UserSerializer
from accounts.models import EmailVerification

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
	captcha = request.DATA.get('captcha')
	if not captcha == request.session.get('captcha'):
		return Response(status=status.HTTP_400_BAD_REQUEST)
	
	serializer = UserSerializer(data=request.DATA)
	if serializer.is_valid():
		user = serializer.object
		password = request.DATA.get('password')
		user.is_active = False
		user.set_password(password)
		user.save()
		key = ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(10))
		emailVeri = EmailVerification(user=user,key=key)
		emailVeri.save()
		
		url = 'http://127.0.0.1:8000/accounts/verify?key=%s'%(key)
		subject = '會員信箱認證(測試)'
		from_email = '測試測試<cchung1985@gmail.com>'
		to = 'hung.hjc@msa.hinet.net'
		text_content = url
		html_content = '<html><body><a href="%s">確認信箱%s</a></body></html>'%(url,url)
		msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
		msg.attach_alternative(html_content, "text/html")
		msg.send()
		
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	else:
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def verifyEmail(request):
	key = request.GET.get('key')
	try:
		emailVeri = EmailVerification.objects.get(key=key)
	except EmailVerification.DoesNotExist:
		return HttpResponse("認證成功", content_type="text/plain")
	print emailVeri
	user = emailVeri.user
	user.is_active = True
	user.save()
	emailVeri.delete()
	return HttpResponse("認證成功", content_type="text/plain")
	
	
@api_view(['POST'])
def changePassword(request):
	password = request.DATA.get('password')
	newPassword = request.DATA.get('newpassword')
	user = request.user
	
	if not user.check_password(password):
		return Response(status=status.HTTP_400_BAD_REQUEST)
	
	user.set_password(newPassword)
	user.save()
	print 'change passowrd'
	return Response({})
	

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
