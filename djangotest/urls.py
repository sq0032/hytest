from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
	# Examples:
	# url(r'^$', 'djangotest.views.home', name='home'),
	# url(r'^djangotest/', include('djangotest.foo.urls')),

	# Uncomment the admin/doc line below to enable admin documentation:
	# url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

	# Uncomment the next line to enable the admin:
	url(r'^admin/', include(admin.site.urls)),
	#url(r'^polls/', include('polls.urls')),
	url(r'^css/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'C:\Users\SUPER\workspace\djangotest\static\css'}),
	url(r'^js/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'C:\Users\SUPER\workspace\djangotest\static\js'}),
	url(r'^img/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'C:\Users\SUPER\workspace\djangotest\static\img'}),
	url(r'^less/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'C:\Users\SUPER\workspace\djangotest\static\less'}),
	
	url(r'^login$', 'djangotest.views.login'),
	url(r'^.*$', TemplateView.as_view(template_name="index.html")),
	
)

