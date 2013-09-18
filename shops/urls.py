from django.conf.urls import patterns, url

from shops import views

urlpatterns = patterns('',
	url(r'^shops/(?P<id>[0-9]+)$', views.ShopsDetail.as_view()),
	url(r'^shops/$', views.ShopsList.as_view()),
)