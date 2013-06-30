from django.conf.urls import patterns, url

from accounts import views

urlpatterns = patterns('',
	url(r'^login$', views.login_view, name='login'),
	url(r'^logout$', views.logout_view, name='logout'),
	url(r'^users/i$', views.user_i_view),
	url(r'^users/$', views.user_i_view),
	url(r'^users/(?P<user_id>\d+)$', views.user_view),
	url(r'^qq$','django.views.defaults.page_not_found')
)