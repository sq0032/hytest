from django.http import HttpResponse
import json

class JSONResponse(HttpResponse):
	def __init__(self, request, data, status=200):
		serialized = json.dumps(data)
		super(JSONResponse, self).__init__(
			content=serialized,
			content_type='application/json',
			status=status
		)


from django.template import Context, loader


def index(request):
	template = loader.get_template('index.html')
	print dir(template)
	context = Context({})
	return HttpResponse(template.render(context))

from django.contrib.auth import authenticate, login


def login(request):
	username = request.POST['username']
	password = request.POST['password']
	user = authenticate(username=username, password=password)
	if user is not None:
		if user.is_active:
			login(request, user)
			ret = {'status':0}
		else:
			ret = {'status':1}
	else:
		ret = {'status':2}
	return JSONResponse(ret)

