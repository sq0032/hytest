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

'''
from django.template import Context, loader
def index(request):
	template = loader.get_template('index.html')
	print dir(template)
	context = Context({})
	return HttpResponse(template.render(context))
'''
