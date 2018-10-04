
function shortcut(gallery){
		$(".mini_form .icons_holder").livequery(function(){
			renderUI(this);
		});
		$("#plurk_form .icons_holder").livequery(function() {
			renderUI(this);
		});

		//$("#plurk_form .icons_holder .pif-emoticon").livequery('click', function(e){
		//	//Let's just add all our icons to the current choices easier for now
		//	gallery.open('', findCurrentInput(e.target));
		//});

		function renderUI(container){
			$('<span/>', {class: 'plurkcustoms_shortcut',
				html: [
					$('<a>', {
						class: 'shortcut addEmoticons',
						attr: {title: __('添加新的表情圖案')},
						click: showUploadPanel
					}),

					$('<a>', {
						class: 'shortcut gallery',
						attr: {title: __('開啟圖庫')},
						click: function(e){
							gallery.open('gallery local', findCurrentInput(e.target));
							return false;
						}
					}),

					$('<a>', {
						class: 'shortcut tools',
						attr: {title: __('外掛設定')},
						click: function(e){
							gallery.open('tools', findCurrentInput(e.target));
							return false;
						}
					})

				]
			}).appendTo(container)



		}

		function showUploadPanel(event){
			localScript(`(new PopWindow({
		    url: "/EmoticonManager2",
		    width: 660,
		    height: 444,
		    onClose: function() {
		       EmoticonsMy.reloadEverything()
		    }
			})).show();`);
			return false;
		}

		function findCurrentInput(element){
			// NOTE: plurkFrom 官方錯字
			var input = gallery.lastInputFocused = $(element).closest('.plurkForm, .plurkFrom').find('#input_big, #input_small').get(0);
			var id = $(gallery.lastInputFocused).attr('id');
			return id;
		}

		//function openGallery(event){
		//	// NOTE: plurkFrom 官方錯字
		//	var input = gallery.lastInputFocused = $(event.target).closest('.plurkForm, .plurkFrom').find('#input_big, #input_small').get(0);
		//	var id = $(gallery.lastInputFocused).attr('id');
		//	//EmoticonSelector.toggleFrom(i.input, i.input)
		//	localScript(`EmoticonSelector.toggleFrom($('#${id}'),$('#${id}'));`);
		//	//localScript("Emoticons.toggle('"+id+"');");
		//	gallery.openGallery();
		//	$("#emoticon-selector").css({'top': $(this).offset().top+30, 'left': $(this).offset().left});
		//	return false;
		//}
}