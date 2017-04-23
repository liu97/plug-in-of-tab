;(function($){

	var Tab=function(tab){
		var _this=this;
		this.tab=tab;
		this.config={
						"triggerType":"mouseover",
						"effect"     :"default",
						"invoke"     :1,
						"auto"       :false
					};
		if(this.getConfig()){
			$.extend(this.config,this.getConfig());
		}
		//保存配置参数，减少查询次数
		var config=this.config;
		this.tabItems=this.tab.find("ul.tab-nav li");
		this.contentItems=this.tab.find("div.content-warp div.content-item");
		if(config.triggerType=="click"){
			this.tabItems.bind(config.triggerType,function(){
				_this.invoke($(this));
			})
		}
		else if(config.triggerType=="mouseover"||config.triggerType!="click"){
			this.tabItems.bind("mouseover",function(event){
				_this.invoke($(this));
				event.stopPropagation();
			});
		};
		if(this.config.auto){
			this.timer=null;
			this.autoPlay();
			this.loop=0;

			this.tab.hover(function(){
				window.clearInterval(_this.timer);
			},function(){
				_this.autoPlay();
			});
		}
		if(this.config.invoke>1){
			this.invoke(this.tabItems.eq(this.config.invoke-1));
		}
	};
	Tab.prototype={
		//自动切换
		autoPlay:function(){
			var _this=this,
			tabLength=this.tabItems.length;
			window.clearInterval(_this.timer);
			this.timer=window.setInterval(function(){
				(_this.loop++);
				if(_this.loop>=4){
					_this.loop=0;
				}
				_this.tabItems.eq(_this.loop).trigger(_this.config.triggerType);
				// if(_this.config.auto){
				// 	_this.tabItems.eq(_this.loop).trigger("mouseout")
				// }
				
			},_this.config.auto)
		},
		//获得config
		getConfig:function(){
			var config=this.tab.attr("data-config");
			if(config&&config!=""){
				return $.parseJSON(config);
			}
			else{
				return null;
			}
		},
		//事件驱动函数
		invoke:function(currentTab){
			currentTab.addClass("actived").siblings().removeClass("actived");

			var currentIndex=currentTab.index();
			var effect=this.config.effect;
			if(effect=="default"||effect!="fade"){
				this.contentItems.eq(currentIndex).addClass("current").siblings().removeClass("current");
			}
			else if(effect=="fade"){
				this.contentItems.eq(currentIndex).fadeIn().siblings().fadeOut();
			}
			if(this.config.auto){
				this.loop=currentIndex;
			}
		}
		
	};
	$.fn.extend({
		tab:function(){
			this.each(function(){
				new Tab($(this));
			});
			return this;

		}
	})
	window.Tab=Tab;
})(jQuery);