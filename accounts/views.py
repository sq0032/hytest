# coding=utf-8
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.mail import EmailMultiAlternatives
from django.views.decorators.http import require_http_methods, require_GET, require_POST
#from django.views.decorators.csrf import csrf_exempt

from rest_framework.renderers import JSONRenderer
#from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from accounts.serializers import UserSerializer
from accounts.models import EmailVerification

import string
import random
def randomString(length):
	return ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(length))

class JSONResponse(HttpResponse):
	def __init__(self, data, **kwargs):
		content = JSONRenderer().render(data)
		kwargs['content_type'] = 'application/json'
		super(JSONResponse, self).__init__(content, **kwargs)
		
@require_GET
def login_view(request):
	email = request.GET.get('email')
	password = request.GET.get('password')
	user = authenticate(username=email, password=password)
	if user is None:
		return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
	elif not user.is_active:
		return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
	else:
		login(request, user)
		return HttpResponse()

def logout_view(request):
	logout(request)
	return HttpResponse()

@require_GET
def checkEmail(request):
	email = request.GET.get('email')
	
	try:
		validate_email(email)
	except ValidationError:
		return JSONResponse({'status':'ERROR','msg':'非合法帳號'})
	
	try:
		User.objects.get(email=email)
		return JSONResponse({'status':'ERROR','msg':'帳號已存在'})
	except User.DoesNotExist:
		return JSONResponse({'status':'OK'})

@require_GET
def checkUsername(request):
	name = request.GET.get('name')
	
	if len(name) > 20:
		return JSONResponse({'status':'ERROR','msg':'名稱太長'})
	
	try:
		User.objects.get(username=name)
		return JSONResponse({'status':'ERROR','msg':'名稱已存在'})
	except User.DoesNotExist:
		return JSONResponse({'status':'OK'})


@require_GET
def captcha(request):
	captcha = randomString(6)
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

@require_POST
def createUser(request):
	captcha = request.POST.get('captcha')
	username = request.POST.get('name');
	password = request.POST.get('password');
	email = request.POST.get('email');
	
	ret = {}
	if captcha is None or captcha != request.session.get('captcha'):
		if 'captcha' in request.session:
			del request.session['captcha']
		return JSONResponse({'status':'ERROR', 'captcha':'驗證碼錯誤'})
	
	#if username = 
	
	#try:
	user = User(username=username,email=email)
	user.set_password(password)
	user.save()
	user = authenticate(username=email, password=password)
	if user is not None:
		login(request, user)
	return JSONResponse({'status':'OK'},status=status.HTTP_201_CREATED)
	#except:
	#	return JSONResponse({},status=status.HTTP_400_BAD_REQUEST)
		
	'''
	key = ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(10))
	emailVeri = EmailVerification(user=user,key=key)
	emailVeri.save()
	url = 'http://127.0.0.1:8000/accounts/verify?key=%s'%(key)
	subject = '會員信箱認證(測試)'
	from_email = '測試測試<cchung1985@gmail.com>'
	to = email
	text_content = url
	html_content = '<html><body><a href="%s">確認信箱%s</a></body></html>'%(url,url)
	msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
	msg.attach_alternative(html_content, "text/html")
	msg.send()
	'''

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
	
	
@require_POST
def changePassword(request):
	password = request.DATA.get('password')
	newPassword = request.DATA.get('newpassword')
	user = request.user
	
	if not user.check_password(password):
		return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
	
	user.set_password(newPassword)
	user.save()
	print 'change passowrd'
	return HttpResponse()
	

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
