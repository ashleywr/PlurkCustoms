
function shortcut(gallery){
		$(".mini_form .icons_holder").livequery(function(){
			renderUI(this);
		});
		$("#plurk_form .icons_holder").livequery(function(){
			renderUI(this);
		});

		function getOverlay(){
			return $('<div/>', {
				class: 'simpleoverlay'
			}).appendTo(document.body);
		}

		function renderUI(container){
			$('<span/>', {class: 'plurkcustoms_shortcut',
				html: [			
					$('<a>', {
						class: 'shortcut addEmoticons',
						attr: {title: __('添加新的表情圖案')},
						click: showUploadPanel
					}),			
							
					$('<a>', {
						class: 'shortcut setting',
						attr: {title: __('外掛設定')},
						click: function(e){
							gallery.open('setting', findCurrentInput(e.target));
							return false;
						}
					}),
						
					$('<a>', {
						class: 'shortcut gallery',
						attr: {title: __('開啟圖庫')},
						click: function(e){
							gallery.open('gallery local', findCurrentInput(e.target));
							return false;
						}
					})
	
				]
			}).appendTo(container)

		}

		function showUploadPanel(event){
			localScript(['(new GB_Window({',
			'    caption: \"\",',
			'    show_close_img: false,',
			'    overlay_click_close: true,',
			'    width: 660,',
			'    height: 444,',
			'    fullscreen: false,',
			'    use_fx: false,',
			'    callback_fn: function() {',
			'        EmoticonsMy.reloadEverything()',
			'    }',
			'})).show(\"/EmoticonManager2\");'].join('\n'));
			return false;		
		}

		function findCurrentInput(element){
			// NOTE: plurkFrom 官方錯字
			var input = gallery.lastInputFocused = $(element).closest('.plurkForm, .plurkFrom').find('#input_big, #input_small').get(0);
			var id = $(gallery.lastInputFocused).attr('id');
			return id;
		}

		function openGallery(event){
			// NOTE: plurkFrom 官方錯字
			var input = gallery.lastInputFocused = $(event.target).closest('.plurkForm, .plurkFrom').find('#input_big, #input_small').get(0);
			var id = $(gallery.lastInputFocused).attr('id');
			localScript("Emoticons.toggle('"+id+"');");
			gallery.openGallery();
			$("#emoticon_selecter").css({'top': $(this).offset().top+30, 'left': $(this).offset().left});
			return false;			
		}	
}