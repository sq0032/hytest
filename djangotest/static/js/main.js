//Global Variables
var app = app || {};

app.loginUser = new app.LoginUser();
app.itemCategorys = new app.ItemCategorys();
app.myShop = new app.Shop();
console.log(app.myShop);
app.myFavorite = new app.Favorite({'id':0});
new app.myRouter();
Backbone.history.start();

// this is where all the site code should begin
// using jQuery
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
	// test that a given url is a same-origin URL
	// url could be relative or scheme relative or absolute
	var host = document.location.host; // host + port
	var protocol = document.location.protocol;
	var sr_origin = '//' + host;
	var origin = protocol + sr_origin;
	// Allow absolute or scheme relative URLs to same origin
	return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
		(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
			// Send the token to same-origin, relative URLs only.
			// Send the token only if the method warrants CSRF protection
			// Using the CSRFToken value acquired earlier
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	}
});

RINGOverlay.prototype = new google.maps.OverlayView();
function RINGOverlay(center,outerRadial,innerRadial, map) {
	this.center_ = center;
	this.outerRadial_ = outerRadial;
	this.innerRadial_ = innerRadial;
	this.div_ = null;
	this.setMap(map);
}

RINGOverlay.prototype.setCenter = function(center){
	this.center_ = center;
	this.draw();
}

RINGOverlay.prototype.setRadial = function(outerRadial,innerRadial){
	this.outerRadial_ = outerRadial;
	this.innerRadial_ = innerRadial;
	this.draw();
}

RINGOverlay.prototype.onAdd = function() {
	var div = document.createElement('div');
	div.style.borderStyle = 'solid';
	div.style.borderWidth = '10px';
	div.style.borderColor = 'rgba(66, 139, 202, 0.5)';
	div.style.position = 'absolute';
	this.div_ = div;
	$(div).css('border-radius','100% 100% 100% 100%').css('transition','width 0.5s,height 0.5s,left 0.5s,top 0.5s,border 0.5s');
	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div);
};

RINGOverlay.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	var center = this.center_;
	var outerRadial = this.outerRadial_;
	var innerRadial = this.innerRadial_;
	var computeOffset = google.maps.geometry.spherical.computeOffset;
	
	var ni_latlng = computeOffset(center,innerRadial,0);
	var no_latlng = computeOffset(center,outerRadial,0);
	var ni = overlayProjection.fromLatLngToDivPixel(ni_latlng);
	var no = overlayProjection.fromLatLngToDivPixel(no_latlng);
	
	var sw_latlng = computeOffset(center,outerRadial*1.41421,225);
	var ne_latlng = computeOffset(center,outerRadial*1.41421,45);
	var sw = overlayProjection.fromLatLngToDivPixel(sw_latlng);
	var ne = overlayProjection.fromLatLngToDivPixel(ne_latlng);
	var div = this.div_;
	//console.log('gg',overlayProjection.getWorldWidth(),outerRadial,innerRadial);
	//div.style.borderWidth = overlayProjection.getWorldWidth()/4007.57/(outerRadial-innerRadial) + 'px';
	console.log(ni,no,outerRadial,innerRadial)
	div.style.borderWidth = Math.abs(no.y-ni.y) +'px';
	div.style.left = sw.x + 'px';
	div.style.top = ne.y + 'px';
	div.style.width = (ne.x - sw.x) + 'px';
	div.style.height = (sw.y - ne.y) + 'px';
};

RINGOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};



function confirm(message,func){
	var $modal= $(
		'<div class="modal fade" tabindex="-1">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<h4 class="modal-title">確認</h4>\
					</div>\
					<div class="modal-body">\
						<div class="btn-confirm-message"></div>\
					</div>\
					<div class="modal-footer">\
						<button class="btn btn-default btn-confirm-cancel">取消</button>\
						<button class="btn btn-primary btn-confirm-ok">確定</button>\
					</div>\
				</div>\
			</div>\
		</div>').modal('show');
	console.log($modal);
	var $msg = $modal.find('.btn-confirm-message').text(message);
	var $ok = $modal.find('.btn-confirm-ok').click(function(){
		$modal.on('hidden.bs.modal',function(){
			$modal.remove();
			$modal = null;
		}).modal('hide');
		func(true);
	});
	
	var $cancel = $modal.find('.btn-confirm-cancel').click(function(){
		$modal.on('hidden.bs.modal',function(){
			$modal.remove();
			$modal = null;
		}).modal('hide');
		func(false);
	});
}

function msgbox(message){
	var $modal= $(
		'<div class="modal fade" tabindex="-1">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<h4 class="modal-title">確認</h4>\
					</div>\
					<div class="modal-body">\
						<div class="btn-confirm-message"></div>\
					</div>\
					<div class="modal-footer">\
						<button class="btn btn-primary btn-confirm-ok">確定</button>\
					</div>\
				</div>\
			</div>\
		</div>').modal('show');
	console.log($modal);
	var $msg = $modal.find('.btn-confirm-message').text(message);
	var $ok = $modal.find('.btn-confirm-ok').click(function(){
		$modal.on('hidden.bs.modal',function(){
			$modal.remove();
			$modal = null;
		}).modal('hide');
	});
}





//var myEvents = new Events();

////////////////Global Events start////////////////
var globalEvents = {
	newmsg:function(data){
		var reply = data;

		app.myShop.items.each(function(item){
			console.log(item.get('name'));
			item.chats.each(function(chat){
				if(chat.get('id') == reply.chat){
					if(chat.replys.length==0){
						var $chatBox = $("div[data-chat-id='"+chat.get('id')+"'] .badge");
						if($chatBox.hasClass('seen')){
							//change chat-box notification
							$chatBox.removeClass('seen').addClass('unseen');
							
							//change chat-list notification
							$chatList = $("div[id='chats"+item.get('id')+"'] .panel-title .badge");
							count = parseInt($chatList.text());
							if(isNaN(count)){count=0;}
							$chatList.removeClass('seen').addClass('unseen').text(count+1);
						}
						
						alert(chat.get('buyer')+'向你詢問'+chat.get('item'));
					}
					else{
						chat.replys.each(function(existReply){
							existReply.get('id') == reply.id;
							return;
						});
						reply = new app.Reply(reply);
						chat.replys.add(reply);
					}
				}
			});
		});
		
		app.myFavorite.items.each(function(item){
			item.chats.each(function(chat){
				if(chat.get('id')==reply.chat){
					if(chat.replys.length==0){
						$("div[data-chat-id="+chat.get('id')+"] .badge").addClass('unseen');
						alert(chat.get('seller')+'向你詢問'+chat.get('item'));
					}else{
						reply = new app.Reply(reply);
						chat.replys.add(reply);
					}
				}
			});
		});
	},
	newchat:function(data){
		var item = app.myShop.items.get(data);
		item.chats.fetch({reset:true});
		//alert(data.id);
	},
	//sendMessage:function(data){
	//	myShop.items.each(function(item){
	//		//item.
	//	});
	//},
	shopUpdate:function(){
		//do something
	},
	test:function(data){
		console.log(data);
	}
};


function hEvent(e){
	console.log(e);
	_.each(e.events,function(event){
		this[event.type](event.data);
	}, globalEvents);
	
	$.post('accounts/events', {time:e.time}).done(function(e){
		hEvent(e);
	}).fail(function(){
		console.log('connection error');
	});
};

$(function(){
	app.app = new app.AppView();

	window.onresize = function(event) {
		if(window.innerWidth>window.innerHeight){
			this.$(".item-box-description").css("display","block");
		}else{
			this.$(".item-box-description").css("display","none");
		}
	}

});
