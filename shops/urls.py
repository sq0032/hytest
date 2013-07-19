from django.conf.urls import patterns, url

from shops import views

urlpatterns = patterns('',
	url(r'^items/i$', views.items_i),
	url(r'^.*$','django.views.defaults.page_not_found')
)