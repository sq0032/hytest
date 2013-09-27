# coding=utf-8
from django.conf.urls import patterns, url

from conversations import views

urlpatterns = patterns('',
    url(r'^list$', views.getList),
)