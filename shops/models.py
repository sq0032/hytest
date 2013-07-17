from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
	name = models.CharField(max_length=100)
	
	def __unicode__(self):
		return self.name

class Attribute(models.Model):
	name = models.CharField(max_length=100)
	def __unicode__(self):
		return self.name
	
class Item(models.Model):
	owner = models.ForeignKey(User)
	title = models.CharField(max_length=100)
	price = models.IntegerField()
	pic = models.ImageField(upload_to='item_pic')
	pub_date = models.DateTimeField(auto_now_add=True)
	category = models.ForeignKey(Category)
	attrs = models.ManyToManyField(Attribute)
	def __unicode__(self):
		return self.title