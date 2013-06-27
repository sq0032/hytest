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

def login(request):
	username = request.POST.get('username')
	password = request.POST.get('password')
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

def logout_view(request):
	logout(request)
	data = {'status':'OK'}
	return JSONResponse(data)

def loginCheck(request):
	print request.user
	if request.user.is_authenticated():
		data = {'status':'OK'}
	else:
		data = {'status':'ERROR'}
	return JSONResponse(data)
	