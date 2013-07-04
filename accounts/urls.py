from django.conf.urls import patterns, url

from accounts import views

urlpatterns = patterns('',
	url(r'^login$', views.login_view, name='login'),
	url(r'^logout$', views.logout_view, name='logout'),
	url(r'^captcha$', views.captcha),
	url(r'^users/i$', views.user_i_view),
	url(r'^users/$', views.createUser),
	url(r'^password$', views.changePassword),
	#url(r'^users/(?P<user_id>\d+)$', views.userDetail.as_view()),
	url(r'^.*$','django.views.defaults.page_not_found')
)