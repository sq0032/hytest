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

#comment

#debug1
#comment branch1

def login_view(request):
	username = request.GET.get('email')
	password = request.GET.get('password')
	print username
	user = authenticate(username=username, password=password)
	if user is not None:
		if user.is_active:
			login(request, user)
			data = {'status': 'OK'}
		else:
			data = {'status': 'NO_ACTIVE'}
	else:
		data = {'status': 'ERROR'}
	return JSONResponse(data)

#comment

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

def user_view(request):
	if request.user.is_authenticated():
		username = request.user.username
		email = request.user.email
		user = {'username':username,email:email}
		data = {'status':'OK','user': user}
	else:
		data = {'status':'ERROR'}
	return JSONResponse(data)