if(typeof PlurkCustoms == 'undefined') PlurkCustoms = {};

var isMac = navigator.platform.match(/Mac/i);
var plurkCustoms;
var user_id;
var token;
var extension_url = "https://chrome.google.com/webstore/detail/plurkcustoms-%E8%87%AA%E8%A8%82%E8%A1%A8%E6%83%85%E5%9C%96%E5%BA%AB/npkllofhoohpldfjaepknfbjbmehjpmc";
var permission_request = false;


function arrayClone(arr){
	if(typeof arr == 'object') return arr.slice(0);
	else return arr;
}

//取得 manifest 的資料
function manifest(name) {
	var value;

	if(! manifest.data ) $.ajax({
		url: chrome.extension.getURL('/manifest.json'),
		dataType: 'json',
		async: false,
		success: function(data){
			manifest.data = data;
		}
	});
	value = manifest.data[name];
	return value;
}

function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}

function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}

//Start PlurkCustoms

var emotiland;
var storage;
var gallery;
var GLOBAL;

(function($){

	jQuery.fn.swapWith = function(to) {
	    return this.each(function() {
	        var copy_to = $(to).clone(true);
	        $(to).replaceWith(this);
	        $(this).replaceWith(copy_to);
	    });
	};

	getLocal('GLOBAL', function(_GLOBAL){

		if(window.frameElement && window.frameElement.nodeName == "IFRAME"){
			if(window.location.toString().match('EmoticonManager')){
				console.info('PlurkCustoms: 非河道模式運作');
				return runFallbackMode();
			}else{
				return false;
			}
		}

		if(! _GLOBAL ){
			console.error('PlurkCustoms: 無法運作');
			return false;
		}

		GLOBAL = _GLOBAL;
		sessionStorage.GLOBAL = JSON.stringify(GLOBAL);

		token = GLOBAL.session_user.token;
		user_id = GLOBAL.session_user.id;

		emotiland 	= new PlurkEmotiland(GLOBAL);
		storage 	= new StorageAdapter(emotiland);
		gallery 	= new Gallery(storage);

		emotiland.getStorageLimit(function(limit){
			console.info('表符上限為', limit, '將縮減為', limit - 5, '以確保可以上傳新表符');
			gallery.reduceOnlineEmoticons(limit - 5);
		});

		//註冊外掛
		gallery.registerPlugin(new CandidatePlugin(gallery), 'CandidatePlugin');
		//gallery.registerPlugin(new CollectorPlugin(gallery), 'CollectorPlugin');
		gallery.registerPlugin(new AdvancedGalleryPlugin(gallery), 'AdvancedGalleryPlugin');

		// gallery.registerPlugin(new LocalPluginAdapter('PlurkBoxAdvancedPlugin', __('噗文時間列')), 'PlurkBoxAdvancedPlugin');
		gallery.registerPlugin(new LocalPluginAdapter('TitleCounterPlugin', __('標題計數器')), 'TitleCounterPlugin');
		gallery.registerPlugin(new LocalPluginAdapter('NotificationSoundPlugin', __('通知音效')), 'NotificationSoundPlugin');
		gallery.registerPlugin(new LocalPluginAdapter('AvatarZoomPlugin', __('頭像放大鏡')), 'AvatarZoomPlugin');
		gallery.registerPlugin(new LocalPluginAdapter('BlockAdsPlugin', __('隱藏廣告')), 'BlockAdsPlugin');

		//

		packer(gallery);
		shortcut(gallery);
	});

	// 非河道模式運作
	function runFallbackMode(){
		try{
			GLOBAL = _GLOBAL = JSON.parse(sessionStorage.GLOBAL);
		}catch(e){
			console.error('PlurkCustoms: 無法在非河道模式運作');
			return false;
		}

		token = GLOBAL.session_user.token;
		user_id = GLOBAL.session_user.id;

		emotiland 	= new PlurkEmotiland(GLOBAL);
		storage 	= new StorageAdapter(emotiland);
		gallery 	= new Gallery(storage);

		return true;

	}

	//RPlurkSmiley 版面
	$('#emoticon-tabs').livequery(function(){
		//console.log($('li.emoticon-selector'));
		$("#emoticons-holder").hide();
		$(this).html("<ul></ul>");
		$('<div/>', {
			css:{
				'margin': '3px 0px',
				'clear' :'both',
				'overflow' : 'auto'
			},
			html: $('li.emoticon-selector')
		}).appendTo('#emoticon-tabs');
		$('#emoticon-tabs > ul, #emoticon-tabs > div').click(function(){return false;});
		$('#emoticon-selector').mousedown(function(){return false;})
	});



	Function.prototype.clone = function() {
	    var that = this;
	    var temp = function temporary() { return that.apply(this, arguments); };
	    for( key in this ) {
	        temp[key] = this[key];
	    }
	    return temp;
	};

	function require(file, callback){
		$.ajax({
		  url: chrome.extension.getURL('/' + file),
		  dataType: "script",
		  async: false,
		  success: callback
		});
	}

})(jQuery);