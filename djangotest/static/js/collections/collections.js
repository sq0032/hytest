var app = app || {};


app.Items = Backbone.Collection.extend({
	model: app.Item
});

app.ItemCategorys = Backbone.Collection.extend({
	model: app.ItemCategory,
	url:'item-categorys',
	getByID: function(id){
		return this.find(function(category){
			return (category.get('id') == id);
		});
	},
	getByIDs: function(ids){
		return this.filter(function(category){
			return $.inArray(category.get('id'), ids) > -1;
		});
	},
	getByParentID: function(id){
		return this.filter(function(category){
			return (category.get('parent') == id);
		});
	}
});

app.Shops = Backbone.Collection.extend({
	model: app.Shop,
	url:'shops/',
	initialize:function(options){
		var that = this;
		this.url = function(){ 
			if (that.bounds){
				return 'shops/?'+$.param(that.bounds);
			}
			return 'shops/';
		}
	},
	fetchByBounds:function(bounds){
		/*var that = this;
		var dfd = $.get('shops/',bounds);
		dfd.done(function(shops){
			that.set(shops);
		});
		return dfd;*/
		this.setBounds(bounds);
		return this.fetch();
	},
	setBounds:function(bounds){
		this.bounds = bounds
		return this;
	}
})

app.Chats = Backbone.Collection.extend({
	model: app.Chat,
	url: 'chats/list'
});

app.Replys = Backbone.Collection.extend({
	model: app.Reply,
	url: '/chats/chat_id',
});