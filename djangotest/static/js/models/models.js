var app = app || {};

app.User = Backbone.Model.extend({
	urlRoot:'accounts/users/'
});

app.LoginUser = app.User.extend({
	url: 'accounts/users/i',
	login: function(email, password){
		var dfd = $.Deferred();
		$.get('accounts/login',{email:email,password:password}).done(function(){
			app.loginUser.fetch().done(function(){
				dfd.resolve();
				app.loginUser.trigger('login');
			}).fail(function(){
				dfd.reject();
			});
		}).fail(function(){
			dfd.reject();
		});
		return dfd.promise();
	}
});

app.Item = Backbone.Model.extend({
	urlRoot:'items/',
	initialize: function(){
		var that = this;
		this.chats = new app.Chats();
		this.chats.url = function(){
			return 'items/'+that.id+'/chat/';
		}
	}
});

app.ItemCategory = Backbone.Model.extend({
});

app.Shop = Backbone.Model.extend({
	urlRoot: 'shops/',
	initialize: function(){
		var that = this;
		this.items = new app.Items();
		this.items.url = function(){
			return 'shops/'+that.id+'/items/';
		}
		//this.on('change:id',this.resetItems)
	},
	resetItems: function(){
		this.items.fetch({reset:true});
	}
});

app.Chat = Backbone.Model.extend({
	default:{
		buyer: null,
		seller: null,
		item: null,
		time: null,
		date: null,
		seller_seen: true,
		buyer_seen: true,
	},
	initialize: function(){
		var that = this;
		this.replys = new app.Replys();
		this.replys.url = 	function(){
			return 'chats/'+that.id;
		};
	}
});

app.Reply = Backbone.Model.extend({
	default:{
		reply: null,
		speaker: null,
		datetime: null,
	}
});