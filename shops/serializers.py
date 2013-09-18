from shops.models import Shop

from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework.serializers import RelatedField

class ShopSerializer(serializers.ModelSerializer):
	class Meta:
		model = Shop
		fields = ('id','name','address','latitute','longtitute','description','owner','items')
