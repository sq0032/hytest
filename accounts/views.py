from django.http import HttpResponse
import json

class JSONResponse(HttpResponse):
	def __init__(self, data, status=200):
		serialized = json.dumps(data)
		super(JSONResponse, self).__init__(
			content=serialized,
			content_type='application/json',
			status=status
		)

from django.contrib.auth import authenticate, login, logout

def login_view(request):
	email = request.GET.get('email')
	password = request.GET.get('password')
	user = authenticate(username=email, password=password)
	print dir(user)
	if user is not None:
		if user.is_active:
			login(request, user)
			data = {'status': 'OK'}
		else:
			data = {'status': 'NO_ACTIVE'}
	else:
		data = {'status': 'ERROR'}
	return JSONResponse(data)

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

def user_i_view(request):
	user = request.user
	'''
	print dir(user)
	if user.is_authenticated():
		is_auth = True
		status=200
	else:
		is_auth = False
		status=200
	'''
	uid = user.id
	name = user.get_username()
	email = user.email
	user = {'id':uid,'name':name,'email':email}

	return JSONResponse(user)

from django.http import HttpResponseNotFound
from django.contrib.auth.models import User

def user_view(request,user_id):
	if request.method == "GET":
		try:
			user = User.objects.get(id=id)
			name = user.get_username()
			email = user.email
			user = {'id':id,'name':name,'email':email}
			return JSONResponse(user)
		except User.DoesNotExist:
			return HttpResponseNotFound()
	elif request.method == "POST":
		print user_id
		return HttpResponseNotFound()
	elif request.method == "PUT":
		return HttpResponseNotFound()
	elif request.method == "DELETE":
		return HttpResponseNotFound()
	else:
		return HttpResponseNotFound()

		