from django.contrib import admin
from items.models import Item,ItemImage,Category,Attribute,Thumbnail

admin.site.register(Item)
admin.site.register(ItemImage)
admin.site.register(Category)
admin.site.register(Attribute)
admin.site.register(Thumbnail)