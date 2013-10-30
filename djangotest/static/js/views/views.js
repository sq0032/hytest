var app = app || {};

app.ItemBoxView = Backbone.View.extend({
	className: "item-box",
	events: {
		"click .item-box":"openItemModal",
		"click .media":"openItemModal",
		"click .item-box-attrs":"openItemModal"
	},
	initialize: function() {
		this.item = this.model;
		this.listenTo(this.item, "destroy", this.remove);
		this.listenTo(this.item, "change", this.renderBox);
		this.renderBox();
	},
	renderBox: function() {
		var that = this;
		var name = this.item.get('name');
		var price = this.item.get('price');
		var description = this.item.get('description');
		var attrs = this.item.get('attrs');
		var categoryID = this.item.get('category');
		var img = './img/goods.jpg';
		//var img = '../media/image/items/'+this.item.get('rid')+'-s.png';
		this.$el.html(
			'<div class="media">\
				<a class="pull-left" href="#">\
					<img class="media-object" data-src="holder.js/64x64" src="'+img+'" alt="..." style="width:64px; height:64px">\
				</a>\
				<div class="item-box-description">'+(description==''?'無內容':description)+'</div>\
				<div class="media-body">\
				<h4 class="media-heading" style="white-space:nowrap">'+name+'</h4>\
				<div class="item-box-price">'+price+'</div>\
				<div class="item-box-attrs">\
					<span>背包可裝</span>\
					<span>二手品</span>\
					<span>可議價</span>\
				</div>\
			</div>');
			
		//this.$('.item-box-attrs div').text(attrs);
		//return this;
	},
	openItemModal: function(){
		alert('open modal');
		var itemModal = new app.ItemModalView();
		itemModal.open();
	}
});

app.ItemModalView = Backbone.View.extend({
	el: "#itemModal",
	open: function(){
		this.$el.modal('show');
	}
});

app.SellerItemBoxView = Backbone.View.extend({
	className: "seller-item-box",
	events: {
		"click .item-delete":"deleteItem",
		"click .chatroom-btn":"openChatroom",
		"click .item-box":"openItemModal"
	},
	initialize: function() {
		this.item = this.model;
		
		this.itemBox = new app.ItemBoxView({model:this.item});
		
		this.listenTo(this.item, "destroy", this.remove);
		this.listenTo(this.item.chats, "reset", this.render);
		
		this.render();
	},
	openItemModal: function(){
		alert('open modal');
		var itemModal = new app.ItemModalView();
		itemModal.open();
	},			
	deleteItem: function(){
		var that = this;
		confirm('確定要刪除"'+this.item.get('name')+'"?',function(result){
			if(!result){return;}
			that.item.destroy();
		});
	},
	openChatroom:function(event){
		var $btn = $(event.currentTarget);
		var chatID = $btn.attr('data-chat-id');
		var chat = this.item.chats.find(function(chat){
			return (chat.get('id') == chatID);
		});
		var chatroom = new app.ChatroomModalView({model:chat});
		chatroom.open();
		$btn.next().removeClass('newmsg');
	},
	render: function(){
		var that = this;
		
		this.$el.empty();
		var num = this.item.chats.length;
		var item_id = this.item.get('id');
		var notification_img = "./img/notification.png";
		var $chatList = $(
			'<div class="panel-group" id="chats'+item_id+'">\
				<div class="panel panel-default">\
					<div class="panel-heading">\
						<h4 class="panel-title">\
							<span class="glyphicon glyphicon-collapse-down"></span>\
							<a class="accordion-toggle" data-toggle="collapse" href="#item'+item_id+'">有 '+num+' 人找你</a>\
							<img class="pull-right" data-item-id="'+item_id+'" src='+notification_img+'>\
						</h4>\
					</div>\
					<div id="item'+item_id+'" class="panel-collapse collapse in">\
						<div class="chat-list">\
						</div>\
					</div>\
				</div>\
			</div>'
		);
		
		this.item.chats.each(function(chat, index){
			var buyer = chat.get('buyer');
			var id = chat.get('id');
			var seen = chat.get('seller_seen');
			if(seen == false){chats_seen = false}
			console.log('chat '+id+' seller_seen='+seen);
			$chatList.find(".chat-list").append($(
				'<div>\
					<span class="chats-order">'+(index+1)+'</span>\
					<span class="chat-to">'+buyer+'</span>\
					<button class="chatroom-btn" data-chat-id='+id+'></button>\
					<img class="'+(seen?'':'newmsg')+'" data-chat-id='+id+' src='+notification_img+'>\
				</div>'
			));
		});
		
		var removeBtn = '<button class="item-delete glyphicon glyphicon-remove pull-right" style="border:none; background-color:white; color:red"></button>';
		this.$el.append(removeBtn).append(this.itemBox.el).append($chatList);
		return this;
	}
});

app.ShopBoxView = Backbone.View.extend({
	className: "shop-box",
	events: {
	},
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function() {
		var name = this.model.get('name');
		var address = this.model.get('address');
		var description = this.model.get('description');
		var isOpen = this.model.get('open');
		var shopimg = './img/Shop.png';
		this.$el.html(
			'<div class="media">\
				<a class="pull-left" href="#">\
				<img class="media-object" data-src="holder.js/64x64" src="img/Shop.png" alt="'+name+'" style="width:64px; height:64px">\
				</a>\
				<div class="media-body">\
					<h4 class="media-heading shop-box-name">'+name+'</h4>\
					<div class="shop-box-subtitle">十七字簡單解說商店性質拍賣商品為何</div>\
					<div class="shop-box-item-num">12</div>\
				</div>\
			</div>'
		);
	}
});

app.EditShopModalView = Backbone.View.extend({
	el: "#editShopModal",
	events: {
		"shown.bs.modal": "shown",
		"show.bs.modal": "show",
		"keyup #shopAddress": "getLatLng",
		"click #shopSubmitBtn": "submit"
	},
	initialize: function(){
		var $shopName = this.$shopName = this.$("#shopName");
		var $shopAddress = this.$shopAddress = this.$("#shopAddress");
		var $shopDesc = this.$shopDesc = this.$("#shopDesc");
		
		var geocoder = this.geocoder = new google.maps.Geocoder();
	
		var latlng = new google.maps.LatLng(23.973875,120.982024);
		var mapOptions = {
			zoom: 14,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		this.map = new google.maps.Map(this.$('#shopMap')[0],mapOptions);
		
		var marker = this.marker = new google.maps.Marker({
			draggable:true,
			position: latlng,
			title:"台灣",
			map:this.map
		});
		
		google.maps.event.addListener(this.marker, 'mouseup', function() {
			var latlng = marker.getPosition(); 
			geocoder.geocode(
				{latLng:latlng},
				function (results,status) {
					if(status==google.maps.GeocoderStatus.OK) {
						$shopAddress.val(results[0].formatted_address);
					}
				}
			);
		});
	},
	submit:function(){
		var that = this;
		var name = this.$shopName.val();
		var address = this.$shopAddress.val();
		var description = this.$shopDesc.val();
		var latlng = this.marker.getPosition();
		var latitude = latlng.lat();
		var longitude = latlng.lng();
		app.myShop.set({
			name:name,
			address:address,
			description:description,
			latitude:latitude,
			longitude:longitude
		});
		app.myShop.save().done(function(){
			alert('修改成功');
			that.$el.modal('hide');
		}).fail(function(){
			app.myShop.fetch();
			alert('資料錯誤');
		});
	},
	getLatLng:function(){
		var address = this.$shopAddress.val();
		if(this.address && (this.address == address)){
			return;
		}
		this.address = address;
		
		var that = this;
		if(this.timer){
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(function(){
			that.geocoder.geocode(
				{address:address},
				function (results,status) {
					if(status==google.maps.GeocoderStatus.OK) {
						var LatLng = results[0].geometry.location;
						that.map.setCenter(LatLng);
						that.marker.setPosition(LatLng);
						that.marker.setTitle(address);
					}
				}
			);
			that.timer = null;
		},1000);
	},
	show:function(){
		var that = this;
		if(app.myShop.isNew()){
			var latlng = new google.maps.LatLng(23.973875,120.982024);
			this.marker.setPosition(latlng);
		}else{
			app.myShop.fetch().done(function(){
				that.$shopName.val(app.myShop.get('name'));
				that.$shopAddress.val(app.myShop.get('address'));
				that.$shopDesc.val(app.myShop.get('description'));
				var latlng = new google.maps.LatLng(app.myShop.get('latitude'),app.myShop.get('longitude'));
				that.marker.setPosition(latlng);
			});
		}
	},
	shown:function(){
		google.maps.event.trigger(this.map, "resize");
		var latlng = this.marker.getPosition();
		this.map.setCenter(latlng);
	}
});

app.ShopModalView = Backbone.View.extend({
	el: "#shopModal",
	initialize: function() {
		var that = this;
		this.myShop = this.model;
		this.$shopModalItemList = this.$("#shopModalItemList");
		this.listenTo(this.myShop.items, 'reset', this.render);
	},
	render: function(){
		var that = this;
		var shopName = this.myShop.get('name');
		
		this.$("#shopModalBoard h4").text(shopName);
		
		this.myShop.items.each(function(item){
			var itemBox = new app.ItemBoxView({model:item});
			that.$shopModalItemList.append(itemBox.el);
		});
	},
	open: function(item){
		this.$el.modal('show');
	}
});

app.FormFieldView = Backbone.View.extend({
	initialize: function(){
		this.val = function(){
			var $input = this.$('input');
			return $input.val.apply($input, arguments);
		}
	},
	showError: function(msg){
		this.$el.addClass('has-error');
		if(msg){
			this.$('.msg-error').text(msg);
		}
	},
	clearError: function(){
		this.$el.removeClass('has-error');
		this.$('.msg-error').text('');
	}
});

app.EditItemModalView = Backbone.View.extend({
	el: "#editItemModal",
	events: {
		"click #itemSubmit": "submit",
		"change #itemName": "checkItemName",
		"change #itemPrice": "checkItemPrice",
		"change #itemDesc": "checkItemDesc",
		"change #itemCategory": "changeItemCategory",
		"keydown #itemPrice": "checkKeyNumber",
	},
	initialize: function() {
		var that = this;
		
		this.nameField = new app.FormFieldView({el:this.$('#itemNameField')});
		this.priceField = new app.FormFieldView({el:this.$('#itemPriceField')});
		this.descriptionField = new app.FormFieldView({el:this.$('#itemDescField')});
		
		this.name = this.$('#itemName');
		this.price = this.$('#itemPrice');
		this.description = this.$('#itemDesc');
		this.conditionAttr = this.$('input:radio[name=conditionAttr]');
		this.sizeAttr = this.$('input:radio[name=sizeAttr]');
		this.category = this.$('#itemCategory');
		
		//uploadfile
		this.files = {};
		this.itemImages = this.$("#newItemImages");
		this.itemImages.find('input:file').fileupload({
			autoUpload: false,
			singleFileUploads:true,
			previewMaxWidth: 100,
			previewMaxHeight: 75,
		}).on('fileuploadadd',function(e, data){
			var index = $(this).attr('name');
			that.files[index] = data;
			console.log(that.files);
		}).on('fileuploadprocessalways',function(e,data){
			var index = data.index,
				file = data.files[index];
			$(this).parent().find(".preview-image").empty().append(file.preview);
		});
		
	},
	checkItemName: function(){
		var name = this.name.val();
		if(name.length==0){
			this.nameField.showError('名稱不可空白');
		}else{
			this.nameField.clearError();
		}
	},
	checkItemPrice:	function(){
		var price = this.price.val();
		if(price.length==0){
			this.priceField.showError('價錢不可空白');
		}else{
			this.priceField.clearError();
		}
	},
	checkKeyNumber: function(event){
		 // Allow: backspace, delete, tab, escape, and enter
		 console.log(event.keyCode);
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
			 // Allow: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) || 
			 // Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39)) {
				 // let it happen, don't do anything
				 return;
		} else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				event.preventDefault(); 
			}
		}
	},
	checkItemDesc: function(){
		var description = this.description.val();
		if(description.length>100){
			this.descriptionField.showError('敘述文字不可超過100字');
		}else{
			this.descriptionField.clearError();
		}
	},
	changeItemCategory: function(event){
		var $target = $(event.target);
		var categoryID = parseInt($target.val());
		
		if(itemCategorys.getByID(categoryID).get('child').length == 0){
			this.category.val(categoryID);
			return;
		}
		
		$target.parent().nextAll().remove();
		this.category.val(null);
		
		var $select = $('<select>').attr('size','5').addClass('form-control');
		_.each(itemCategorys.getByParentID(categoryID),function(category){
			$('<option>').attr('value',category.get('id')).html(category.get('name')).appendTo($select);
		});
		$('<div>').addClass("col-sm-4").css('margin','10px 0 0 0').append($select).appendTo(this.category);
	},
	submit: function(){
		var that = this;
		var name = this.name.val();
		var price = parseInt(this.price.val());
		var description = this.description.val();
		var conditionAttr = this.conditionAttr.filter(':checked').val();
		var sizeAttr = this.sizeAttr.filter(':checked').val();
		var attrs = [parseInt(conditionAttr),parseInt(sizeAttr)];
		var category = this.category.val();

		this.item.set({
			name:name,
			price:price,
			description:description,
			attrs:attrs,
			category:category,
			shops:[myShop.get('id')]
		});
		
		this.item.save().done(function(){
			that.$el.modal('hide');
			/*
			var item_id = newItem.get('id');
			var dfs = []
			for(var i in that.files){
				that.files[i].url = 'shops/upload/items/'+item_id+'/image/'+i;
				console.log(that.files[i]);
				dfs.push(that.files[i].submit())
			}
			console.log(dfs);
			that.files = {};
			that.$el.modal('hide');
			newItem.set({'name':newItem.get('name')+"(上傳圖片中)"});
			myItems.add(newItem);
			$.when.apply($, dfs).done(function(){
				myItems.fetch();
			});
			*/
		});
	},
	clearField: function(){
		this.name.val('');
		this.price.val('');
		this.description.val('');
		this.conditionAttr.parent().removeClass('active');
		this.conditionAttr.filter('[value=1]').prop('checked', true).parent().addClass('active');
		this.sizeAttr.parent().removeClass('active');
		this.sizeAttr.filter('[value=3]').prop('checked', true).parent().addClass('active');
		this.category.empty().val(null);
		
		//產生category選單
		var $select = $('<select>').attr('size','5').addClass('form-control');
		_.each(itemCategorys.getByParentID(null),function(category){
			$('<option>').attr('value',category.get('id')).html(category.get('name')).appendTo($select);
		});
		$('<div>').addClass("col-sm-4").css('margin','10px 0 0 0').append($select).appendTo(this.category);
		
		
		this.itemImages.find(".preview-image").empty();
	},
	initField:function(item){
		//初始化(未完成)
		this.clearField();
	},
	open: function(item){
		this.item = item?item:(new app.Item());
		if(this.item.isNew()){
			this.clearField();
			this.$el.modal('show');
		}else{
			this.initField(this.item);
		}
	}
});

app.MapPanelView = Backbone.View.extend({
	el: "#mapPanel",
	events:{
		'shown': "shown",
		//'scroll #mapBoxList':"scrollBoxList"
	},
	initialize:function(){
		var that = this;
		var center = new google.maps.LatLng(25.056220142845, 121.54178450802);
		var mapOptions = {
			center: center,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		var map = this.map = new google.maps.Map(this.$('#mainMap')[0], mapOptions);
		var noPoi = [{
			featureType: "poi",
			stylers: [{ visibility: "off" }]
		}];
		this.map.setOptions({styles: noPoi});
		
		var ring = new RINGOverlay(center,0,0,map);
		
		var centerMarker = new google.maps.Marker({
			map:map,
			draggable:true,
			position: map.getCenter()
		});
		centerMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
		
		google.maps.event.addListener(centerMarker, 'position_changed', function(){
			if(!this.markerTimer){this.markerTimer=null;}
			clearTimeout(this.markerTimer);
			this.markerTimex	r = setTimeout(function(){
				ring.setCenter(centerMarker.getPosition());
				shopsCache.sort();
			},200);
		});
		
		var shopsCache = new app.Shops();
		shopsCache.comparator = function(shop1,shop2){
			var center = centerMarker.getPosition();
			var latlng1 = new google.maps.LatLng(shop1.get('latitude'), shop1.get('longitude'));
			var latlng2 = new google.maps.LatLng(shop2.get('latitude'), shop2.get('longitude'));
			var d1 = google.maps.geometry.spherical.computeDistanceBetween(center,latlng1)
			var d2 = google.maps.geometry.spherical.computeDistanceBetween(center,latlng2)
			if(d1>d2){return 1;}
			else if(d1=d2){return 0;}
			else{return -1}
		}
		
		var shopMarkers = {};
		var displayShopMarkers = {};
		
		var shopBoxList = new app.ShopBoxListView({
			shops:shopsCache,
			el:'#mapBoxList',
			display:function(shops){
				_.each(displayShopMarkers,function(marker){
					marker.setMap(null);
					delete marker;
				});
				_.each(shops,function(shop){
					var latlng = new google.maps.LatLng(shop.get('latitude'),shop.get('longitude'));
					var marker = new google.maps.Marker({
						position:latlng,
						map:map,
						title:shop.get('name')
					});
					displayShopMarkers[shop.id] = marker;
					displayShopMarkers[shop.id].setAnimation(google.maps.Animation.BOUNCE);
				});
			}
		});
		
		this.listenTo(shopsCache,'display_changed',function(shownShops,hiddenShops){
			//console.log('showshoplist',shop);
			var center = centerMarker.getPosition();
			var maxR = 0;
			var minR = 10000;
			_.each(shownShops,function(shop){
				var latlng = new google.maps.LatLng(shop.get('latitude'), shop.get('longitude'));
				var R = google.maps.geometry.spherical.computeDistanceBetween(center,latlng);
				if(R>maxR){maxR = R;}
				if(R<minR || R==0){minR = R;}
				shopMarkers[shop.id].setAnimation(google.maps.Animation.BOUNCE);
			});
			ring.setRadial(maxR,minR);
			
			_.each(hiddenShops,function(shop){
				shopMarkers[shop.id].setAnimation(null);
			});
		});
		
		this.listenTo(shopsCache,'reset',function(){
			_.each(shopMarkers,function(marker){
				marker.setMap(null);
				delete marker;
			});
			shopsCache.each(function(shop){
				var latlng = new google.maps.LatLng(shop.get('latitude'),shop.get('longitude'));
				shopMarkers[shop.id] = new google.maps.Marker({
					position:latlng,
					map:map,
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						strokeColor:'#428bca',
						strokeWeight:2,
						fillColor:'#ffffff',
						fillOpacity:1,
						scale: 4
					},
					title:shop.get('name')
				});
				//console.log(shopMarkers[shop.id].getShape());
			});
		});
		
		google.maps.event.addListener(map, 'bounds_changed', function() {
			if(!this.timer){this.timer=null;}
			clearTimeout(this.timer);
			this.timer = setTimeout(function(){
				var bounds = map.getBounds();
				//console.log(bounds.getNorthEast(),bounds.getSouthWest());
				var n_lat = bounds.getNorthEast().lat();
				var e_lng = bounds.getNorthEast().lng();
				var s_lat = bounds.getSouthWest().lat();
				var w_lng = bounds.getSouthWest().lng();
				var bounds = {n_lat:n_lat,s_lat:s_lat,e_lng:e_lng,w_lng:w_lng};
				shopsCache.setBounds(bounds).fetch({reset:true});
				//shopsCache.fetchByBounds(bounds);
				/*.done(function(){
					var center = map.getCenter();
					var c_lat = center.lat();
					var c_lng = center.lng();
					shopsCache.each(function(shop){
						var d = Math.pow(c_lat-shop.get('latitude'),2)+Math.pow(c_lng-shop.get('longitude'),2)
						console.log(shop.get('name'),d)
					});
				});*/
				//console.log(shopsCache);
			},500);
		});
	},
	shown:function(){
		google.maps.event.trigger(this.map, "resize");
	}
});

app.ShopBoxListView = Backbone.View.extend({
	events:{
		'scroll': "changeDisplay"
	},
	changeDisplay: function(){
		var that = this;
		if(!this.changeDisplayTimer){this.changeDisplayTimer = null;}
		clearTimeout(this.changeDisplayTimer);
		this.changeDisplayTimer = setTimeout(function(){
			var height = that.$el.height();
			var shownShops = [];
			var hiddenShops = [];
			that.shops.each(function(shop){
				var shopBox = that.shopBoxs[shop.id];
				var position = shopBox.$el.position();
				var top = position.top;
				var bottom = top + shopBox.$el.height();
				if((top>=0 && top<height)||(bottom>=0 && bottom<height)){
					that.shopBoxs[shop.id].$el.css('color','red');
					shownShops.push(shop);
				}else{
					that.shopBoxs[shop.id].$el.css('color','black');
					hiddenShops.push(shop);
				}
			});
			that.shownShops = shownShops;
			that.hiddenShops = hiddenShops;
			that.shops.trigger('display_changed',that.shownShops,that.hiddenShops);
		},100);
	},
	initialize: function(options){
		var that = this;
		this.shownShops = [];
		this.hiddenShops = [];
		var shops = this.shops = options.shops;
		this.display = options.display;
		this.listenTo(shops, 'add',this.add);
		this.listenTo(shops, 'remove',this.remove);
		this.listenTo(shops, 'reset',this.reset);
		this.listenTo(shops, 'sort',this.reset);
		this.shopBoxs = {};
		$(window).resize(function(){that.changeDisplay()});
	},
	reset: function(shops){
		var that = this;
		this.$el.empty();
		shops.each(function(shop){
			var shopBox = new app.ShopBoxView({model:shop});
			that.shopBoxs[shop.id] = shopBox;
			that.$el.append(shopBox.el);
		});
		this.$el.scrollTop(0);
		this.changeDisplay();
	},
	add: function(shop){
		console.log('add',shop.get('description'));
	},
	remove:function(shop){
		console.log('remove',shop.get('description'));
	}
});

app.ShopMarkerView = Backbone.View.extend({
	initialize: function(options){
	
	}
});

app.SellerPanelView = Backbone.View.extend({
	el: "#sellerPanel",
	events: {
		"click #editItemModalBtn": "newEditItemModal",
		"click #shopModalBtn": "newShopModal"
	},
	newEditItemModal:function(){
		this.editItemModal.open();
	},
	newShopModal:function(){
		this.shopModal.open();
	},
	initialize: function() {
		this.editItemModal = new app.EditItemModalView();
		this.editShopModal = new app.EditShopModalView();
		
		//this.listenTo(myItems, 'sync', this.updateItems);
		//this.listenTo(myItems, 'add', this.addOneItem);
		this.listenTo(app.myShop.items, 'reset', this.resetItems);
		
		this.$sellerItemsList = this.$('#sellerItemsList');
		this.$sellerShopBox = this.$('#sellerShopBox');
		
		this.shopBox = new app.ShopBoxView({model:app.myShop});
		this.$sellerShopBox.append(this.shopBox.$el);
		
		this.shopModal = new app.ShopModalView({model:app.myShop});
	},
	resetItems:function(){
		var that = this;
		this.$sellerItemsList.empty();
		app.myShop.items.each(function(item){
			item.chats.fetch({reset:true});
			if(item.get('state') != 'on'){return;}
			var itemBox = new app.SellerItemBoxView({model:item})
			that.$sellerItemsList.append(itemBox.el);
		});
	}
});

app.UserPanelView = Backbone.View.extend({
	el: $("#userPanel"),
	events:{
		"click #settingModalbtn": "openSettingModal",
		"click #logoutBtn":	"logout",
	},
	openSettingModal:function(){
		//do something
	},
	logout: function(){
		$.get('accounts/logout').done(function(data) {
			//重新整理
			location.reload();
		}).fail(function(){
			alert('登出失敗!');
		});
	}
});

app.LoginModalView = Backbone.View.extend({
	el: $("#loginModal"),
	events: {
		"show": "showModal",
		"click #loginBtn": "login",
	},
	initialize: function() {
		this.$('#loginEmail').val("");
		this.$('#loginPassword').val("");
	},
	showModal: function() {
		this.$('#loginPassword').val("");
	},
	login: function() {
		var that = this;
		var email = this.$("#loginEmail").val();
		var password = this.$("#loginPassword").val();
		app.loginUser.login(email,password)
		.done(function(){
			that.$el.modal('hide');
		}).fail(function(jqXHR, textStatus, errorThrown){
			alert('帳號或密碼錯誤!');
		});
		this.$('#loginPassword').val("");
	}
});

app.RegModalView = Backbone.View.extend({
	el: "#regModal",
	events: {
		"show.bs.modal": "showModal",
		"click #registerBtn": "register",
		"click #refreshCaptcha": "getCaptcha",
		"change #regEmail": "checkEmail",
		"change #regUsername": "checkUsername",
		"keyup #regPassword": "checkPassword",
		"keyup #regPasswordConfirm": "checkPasswordConfirm",
		"keyup #regCaptcha": "clearCaptcha",
		"click #regAgree": "clearAgree",
	},
	initialize: function() {
		this.field = {
			name: this.$('#regUsernameField'),
			email: this.$('#regEmailField'),
			password: this.$('#regPasswordField'),
			passwordConfirm: this.$('#regPasswordConfirmField'),
			captcha: this.$('#regCaptchaField'),
			agree: this.$('#regAgreeField')
		}
		
		this.input = {
			name: this.$('#regUsername'),
			email: this.$('#regEmail'),
			password: this.$('#regPassword'),
			passwordConfirm: this.$('#regPasswordConfirm'),
			captcha: this.$('#regCaptcha'),
			agree: this.$('#regAgree')
		}
		
		this.$regBtn = this.$('#registerBtn');
	},
	showError: function(fieldName, msg){
		var $field = this.field[fieldName];
		if(!$field){return;}
		$field.addClass('has-error');
		if(msg){$field.find('.msg-error').text(msg);}
	},
	clearError: function(fieldName){
		var $field = this.field[fieldName];
		$field.removeClass('has-error');
		$field.find('.msg-error').text('');
	},
	clearAgree: function(){
		this.clearError('agree');
	},
	clearCaptcha: function(){
		this.clearError('captcha');
	},
	checkEmail: function(){
		var view = this;
		var email = this.input.email.val();
		if(email.length == 0){
			this.clearError('email');
			return;
		}
		$.getJSON('accounts/check-email', {email: email})
		.done(function(data){
			if(data.status == 'ERROR'){
				view.showError('email',data.msg);
			}else{
				view.clearError('email');
			}
		});
	},
	checkUsername:function(){
		var view = this;
		var name = this.input.name.val();
		var $nameField = this.$nameField;
		if(name.length == 0){
			this.clearError('name');
			return;
		}else if(name.length > 20){
			view.showError('name', '名稱太長');
			return;
		}
		$.getJSON('accounts/check-name', {name:name}).done(function(data){
			if(data.status == 'ERROR'){
				view.showError('name', data.msg);
			}else{
				view.clearError('name');
			}
		});
	},
	checkPassword:function(){
		var password = this.input.password.val();
		var length = password.length;
		if(length > 0 && length < 8){
			this.showError('password', '密碼長度太短');
		}else if(length > 16){
			this.showError('password', '密碼長度太長');
		}else{
			this.clearError('password');
		}
	},
	checkPasswordConfirm:function(){
		var password = this.input.password.val();
		var passwordConfirm = this.input.passwordConfirm.val();
		
		if(password != passwordConfirm){
			this.showError('passwordConfirm', '密碼不符');
		}else{
			this.clearError('passwordConfirm');
		}
	},
	showModal: function() {
		this.getCaptcha();
		this.input.name.val("");
		this.input.email.val("");
		this.input.password.val("");
		this.input.passwordConfirm.val("");
		this.input.captcha.val();
		this.input.agree.prop("checked",false);
		this.$('.error').removeClass('error');
		this.$('.msg-error').text('');
	},
	getCaptcha: function(){
		var d = new Date();
		$("#regCaptchaImage").attr("src", "accounts/captcha?"+d.getTime());
		this.input.captcha.val('');
	},
	register: function() {
		var view = this;
		var name = this.input.name.val();
		var email = this.input.email.val();
		var password = this.input.password.val();
		var captcha = this.input.captcha.val();
		var agree = this.input.agree.prop("checked");
		
		if(this.$('.error').length != 0){
			return;
		}else if(email.length == 0){
			this.showError('email', '請輸入帳號');
			return;
		}else if(name.length == 0){
			this.showError('name', '請輸入名稱');
			return;
		}else if(password.length == 0){
			this.showError('password', '請輸入密碼');
			return;
		}else if(captcha.length == 0){
			this.showError('captcha', '請輸入驗證碼');
			return;
		}else if(!agree){
			this.showError('agree');
			return;
		}
		
		var $regBtn = this.$regBtn;
		$regBtn.button('loading');
		
		$regBtn.prop('disabled', true);
		$.post('accounts/create-user',{name:name,email:email,password:password,captcha:captcha},'json')
		.done(function(data){
			$regBtn.prop('disabled', false);
			$regBtn.button('reset');
			console.log(data);
			if(data.status == 'OK'){
				view.$el.modal('hide');
				loginUser.fetch();
				msgbox('註冊成功!! 認證信已發送至'+email);
				return;
			}
			
			for(var fieldName in data){
				if(fieldName == 'captcha'){
					view.getCaptcha();
				}
				view.showError(fieldName, data[fieldName]);
			}
			
		}).fail(function(){
			$regBtn.prop('disabled', false);
			$regBtn.button('reset');
			alert('註冊失敗!');
		});
	},
	render: function() {
		
	}
});

app.SettingView = Backbone.View.extend({
	el:$('#settingModal'),
	events:{
		'click #photo-edit':'openPhotoPage',
		'click #email-edit':'openEmailPage',
		'click #name-edit':'openNamePage',
		'click #password-edit':'openPasswordPage',
		'click #newphoto-panel .btn':'changePhoto',
		'click #newpass-panel .btn':'changePassword'
	},
	initialize: function() {
		this.listenTo(app.loginUser, 'change', this.updateUser);
	},
	openPhotoPage: function(){
		$("#newphoto-panel").toggle();
	},
	openEmailPage: function(){
		$("#oldemail-panel").toggle();
		$("#newemail-panel").toggle();
	},
	openNamePage: function(){
		$("#oldname-panel").toggle();
		$("#newname-panel").toggle();
	},
	openPasswordPage: function(){
		$("#oldpass-panel").toggle();
		$("#newpass-panel").toggle();
	},
	changePassword: function(){
		var thisView = this;
		var password = this.$('#settingPassword').val();
		var newPassword = this.$('#settingNewPassword').val();
		var newPassword2 = this.$('#settingNewPassword2').val();
		if (newPassword !== newPassword2){
			alert('新密碼不相符!');
			return
		}
		$.post('accounts/password',{password:password,newpassword:newPassword})
		.done(function(data){
			alert('修改完成!')
			thisView.$('#settingPassword').val('');
			thisView.$('#settingNewPassword').val('');
			thisView.$('#settingNewPassword2').val('');
		}).fail(function(a,b){
			console.log(a)
			console.log(b)
			alert('密碼錯誤!');
		});
	},
	sendVerifyEmail: function(){
		$.post('accounts/send-verify-email',{})
		.done(function(){
			alert('認證信已發送');
		}).fail(function(){
			alert('認證信發送失敗 請稍後再試');
		});
	},
	changePhoto: function(){
		alert('change photo');
	},
	updateUser: function(){
		var email = app.loginUser.get('email');
		var name = app.loginUser.get('name');
		this.$('#oldemail').text(email);
		this.$('#oldname').text(name);
	}
})

app.NavBarView = Backbone.View.extend({
	el: '#navBar',
	events: {
		"click #logoutBtn": "logout",
		'show.bs.tab #userNav a[href="#sellerPanel"]': "showSellerPanel",
		'shown.bs.tab #userNav a[href="#mapPanel"]': "shownMapPanel"
	},
	initialize: function() {
		this.$userNav = this.$("#userNav");
		this.$guestNav = this.$("#guestNav");
		this.guestMode();
		this.listenTo(app.loginUser, 'login', this.loginMode);
	},
	guestMode: function(){
		this.$userNav.hide();
		this.$guestNav.show();
	},
	loginMode: function(){
		this.$userNav.show().find('#navUsername').text(app.loginUser.get('name'));
		this.$guestNav.hide();
	},
	showSellerPanel: function(){
		$("#sellerPanel").trigger('show');
	},
	shownMapPanel:function(){
		$("#mapPanel").trigger('shown');
	}
});

app.InfoEmailView = Backbone.View.extend({
	el:$('#infoEmailModal'),
	initialize: function() {
	},
	events: {
		"click #sendVerifyEmail": "sendVerifyEmail",
	},
	sendVerifyEmail: function(){
		$.post('accounts/send-verify-email',{})
		.done(function(){
			alert('認證信已發送');
		}).fail(function(){
			alert('認證信發送失敗 請稍後再試');
		});
	}
});

//ChatroomModalView
app.ChatroomModalView = Backbone.View.extend({
	className:'modal fade',
	initialize: function(){
		this.chat = this.model;

	
		this.initChat();
		
		this.listenTo( this.chat.replys, 'reset', this.renderBody);
		this.listenTo( this.chat.replys, 'add', this.renderReply);
	},
	events:{
		'click .modal-footer>button':'sendReply',
		'click .close':'close',
		'click .open':'open'
	},
	initChat:function(){
		//Chatroom Modal
		this.$el.html(
			'<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
						<h4 class="modal-title">'+this.chat.get('item')+'</h4>\
					</div>\
					<div class="modal-body" style="background-color: #E8E8E8">\
						<ul class="msglist">\
						</ul>\
					</div>\
					<div class="modal-footer" style="margin-top:0px">\
						<input type="text" class="form-control pull-left" placeholder="Enter message">\
						<button type="button" class="btn btn-default">送出</button>\
					</div>\
				</div>\
			</div>'
		);
	},
	renderBody:function(){
		console.log(this.chat.replys.length);
		$('.msglist').html('');
		this.chat.replys.each(function(reply){
			this.renderReply(reply);
		}, this);
		$('.msglist').scrollTop(8000);	//scroll bar位置還要修改 #BW15B
	},
	renderReply:function(reply){
		var replyView = new app.ReplyView({model:reply});
		replyView.chat = this.chat;
		this.$('.msglist').append(replyView.renderReply().el);
	
		if(typeof reply.get('datetime')=='undefined'){
			reply.save().fail(function(){
				reply.trigger('fail');
			});					
		}
	},
	sendReply:function(){
		if($(".modal-footer>input").val()){
			var data={
				reply:$(".modal-footer>input").val(),
				speaker : this.chat.get('seller'),
				receiver : this.chat.get('buyer'),
			};
			
			var reply = new app.Reply(data);
			reply.chat = this.chat;
			reply.url = 'chats/'+this.chat.get('id');
			this.chat.replys.add(reply);
			$(".modal-footer>input").val('');
		}
	},

	close:function(){
		this.chat.replys.reset();
		this.remove();
	},
	open:function(){
		this.chat.replys.fetch({reset:true});
		this.$el.modal('show');
	}
});

app.ReplyView = Backbone.View.extend({
	tagName: 'li',
	initialize: function(){
		this.reply = this.model;

		this.listenTo( this.reply, 'sync', this.renderTime);
		this.listenTo( this.reply, 'fail', this.renderError);
	},
	events:{
		'click .btn-xs':'resend'
	},
	renderReply:function(){
		if(this.reply.get('speaker')==this.chat.get('seller')){
			var div = '	<div class="pull-right msgbox msg-me">'
		}
		else{
			var div = '	<div class="pull-left msgbox msg-other">'
		}
		
		this.$el.html(
			div
		+'		<div class="speaker">'+this.reply.get('speaker')+'</div>'
		+'		<div class="">'+this.reply.get('reply')+'</div>'
		+'		<div class="" style="width:100%">'
		+'			<div class="pull-right time"></div>'
		+'		</div>'
		+'	</div>'
		+'	<div style="clear:both;"></div>'					
		);
		
		this.renderTime();
		
		return this;
	},
	renderTime: function(){
		var time;
		if(typeof this.reply.get('datetime')==='undefined'){
			time = '傳送中…';
		}
		else{
			var now = new Date();
			var d = new Date(this.reply.get('datetime'));
			var M = d.getMonth()+1;
			var D = d.getDate();
			var HH = d.getHours();
			var MM = d.getMinutes();
			
			if(now.getDate()==d.getDate()){
				time = HH+':'+MM;
			}
			else{
				time = M+'/'+D+' '+HH+':'+MM;
			}
		}
		
		this.$('.time').html(time);
	},
	renderError: function(){
		this.$('.time').html(
			'傳送失敗<button type="button" class="btn btn-default btn-xs">重新傳送</button>'				
		);
	},
	resend: function(){
		this.$('.time').html('傳送中…');
		console.log(this);
		var reply = this.reply;
		reply.save().fail(function(){
			reply.trigger('fail');
		});
	}
});

app.AppView = Backbone.View.extend({
	el: 'body',
	events: {
	},
	initialize: function(){
		this.navBar = new app.NavBarView();	
		this.loginModal = new app.LoginModalView();
		this.regModal = new app.RegModalView();
		this.settingModal = new app.SettingView();
		this.infoEmailModal = new app.InfoEmailView();
		this.sellerPanel = new app.SellerPanelView();
		this.mapPanel = new app.MapPanelView();
		this.userPanel = new app.UserPanelView();
		
		app.itemCategorys.fetch()
		
		//e = {events:[{},{}],time:time};
		var e = {events:[]};
		app.loginUser.fetch().pipe(function(){
			var dfd = $.Deferred();
			if(app.loginUser.isNew()){
				dfd.reject();
			}else if(app.loginUser.get('shops').length == 0){
				app.loginUser.trigger('login');
				dfd.reject();
			}else{
			
				hEvent(e);
				app.loginUser.trigger('login');
				dfd.resolve();
			}
			return dfd;
		}).pipe(function(){
			var shopID = app.loginUser.get('shops')[0];
			app.myShop.set('id',shopID);
			return app.myShop.fetch();
		}).pipe(function(){
			return app.myShop.items.fetch({reset:true});
		}).done(function(){
			console.log('done');
		}).fail(function(){
			console.log('fail');
		});
	}
});
