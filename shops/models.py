from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
	name = models.CharField(max_length=100,unique=True)
	def __unicode__(self):
		return self.name

class Attribute(models.Model):
	name = models.CharField(max_length=100,unique=True)
	def __unicode__(self):
		return self.name

def item_pic_filename(instance, filename):
	fname, dot, extension = filename.rpartition('.')
	print instance.title
	return 'item_pic/%s.%s' % (instance.title, extension)

class Item(models.Model):
	owner = models.ForeignKey(User)
	name = models.CharField(max_length=100)
	price = models.IntegerField()
	pic = models.ImageField(upload_to=item_pic_filename,blank=True,)
	pub_date = models.DateTimeField(auto_now_add=True)
	category = models.ForeignKey(Category)
	attrs = models.ManyToManyField(Attribute)
	#description = 
	def __unicode__(self):
		return "%s %s"%(self.owner,self.name)