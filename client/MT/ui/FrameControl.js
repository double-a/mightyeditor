MT.extend("core.Emitter")(
	MT.ui.FrameControl = function(mm){
		this.mm = mm;
		this.el = new MT.ui.DomElement("div");
		
		this.el.addClass("ui-frame-control");
		
		this.sepHolder = document.createElement("div");
		this.sepHolder.className = "ui-frame-sep-holder";
		
		this.el.el.appendChild(this.sepHolder);
		this.el.style.position = "absolute";
		this.handle = document.createElement("div");
		this.handle.className = "ui-frame-handle";
		
		
		this.background = document.createElement("div");
		this.background.className = "ui-frame-background";
		
		this.el.el.appendChild(this.background);
		
		
		this.sliderContainer = document.createElement("div");
		this.sliderContainer.className = "ui-frame-control-slider-container";
		
		this.slh = new MT.ui.SliderHelper(0, 0, Infinity);
		
		this.slider = document.createElement("div");
		this.slider.className = "ui-frame-control-slider";
		
		this.sliderContainer.appendChild(this.slider);
		
		this.showSlider();
		
		var mdown = false;
		var that = this;
		
		var minWidth = 150;
		
		var startWidth = 150;
		this.slider.style.width = startWidth + "px";
		
		
		this.slider.onmousedown = function(e){
			mdown = true;
			//startWidth = e.target.offsetWidth;
			minWidth = startWidth + 50;
		};
		
		var ev = this.mm.ui.events;
		var scale = 1;
		
		var impact = 0;
		
		ev.on(ev.MOUSEMOVE, function(e){
			if(!mdown){
				return;
			}
			//console.log(ev.mouse.mx);
			
			that.slh.change(ev.mouse.mx);
			
			var max = that.sliderContainer.offsetWidth - minWidth;
			
			if(that.slh < max){
				that.slider.style.left = that.slh + "px";
			}
			else{
				impact = (that.slh - max) * 0.01;
				console.log("impact:", impact);
				var w = startWidth / impact;
				if(w < 20){
					w = 20;
				}
				if(w < startWidth){
					that.slider.style.left = max + startWidth - w + "px";
					that.slider.style.width = w + "px";
				}
				else{
					w = startWidth;
				}
			}
			
			
			
			that.emit("change", that.slh.value * (1 + impact), scale);
			
			var overflow = that.slider.offsetLeft + that.slider.offsetWidth;
			
		});
		
		ev.on(ev.MOUSEUP, function(){
			mdown = false;
			that.slh.reset();
			
		});
		
		
			
		
		
		this.labels = [];
	},
	{
		build: function(){
			this.clear();
			
			
			var m = this.mm.getActiveMovie();
			var len = m.getLastFrame();
			var framesize = this.mm.frameSize;
			
			var drawOffset = Math.floor(this.mm.frameOffset + framesize*0.5);
			
			//this.el.style.marginLeft = Math.floor(this.mm.frameOffset + framesize*0.5) + "px";
			//this.handle.style.marginLeft = -Math.floor(this.mm.frameOffset + framesize*0.5) + "px";
			
			var width = this.mm.rightPanel.width;
			
			var totFrames = Math.ceil(width / framesize);
			
			var fps = m.getFps();
			var totTime = Math.ceil(totFrames / fps);
			
			var start = Math.floor(this.mm.startFrame / fps);
			
			var el;
			var inc = Math.floor(1/this.mm.scale);
			if(inc < 1){
				inc = 1;
			}
			
			
			var k = 0;
			var round = 5;
			var info;
			
			for(var i=0; i<totFrames; i += inc){
				el = document.createElement("span");
				this.sepHolder.appendChild(el);
				el.className = "ui-frame-sep";
				el.style.left = i*framesize + drawOffset;
				info = i + this.mm.startFrame;
				
				if((info+"").length > 2){
					round = 10;
				}
				else{
					round = 5;
				}
				
				if( (k % round) == 0 ){
					el.className = "ui-frame-sep ui-frame-sep-long";
					el.setAttribute("data-seconds", i + this.mm.startFrame);
				}
				k++;
			}
			
			var off = 0;
			var rightBorder = 0;
			for(var i=0; i<totTime + start+5; i++){
				if( (i) % 2){
					off += framesize*fps ;
					continue;
				}
				
				rightBorder = framesize*(fps) + (-this.mm.startFrame*framesize + off);
				if(rightBorder < -40){
					off += framesize*fps ;
					continue;
				}
				
				el = document.createElement("div");
				el.className = "ui-frame-seconds";
				el.style.width = framesize*(fps) + "px";
				el.style.left = -this.mm.startFrame*framesize + off + drawOffset + "px";
				
				this.background.appendChild(el);
				
				off += framesize*fps;
			}
			
			
			
			this.sepHolder.appendChild(this.handle);
			this.adjustHandle();
			
			
			this.showSlider();
		},
		
		adjustHandle: function(){
			this.handle.style.left = this.mm.slider.x  - this.handle.offsetWidth*0.5 + this.mm.slider.width*0.5 + "px";
			this.handle.innerHTML = this.mm.activeFrame;
		},
		
		hide: function(){
			if(this.el.el.parentNode){
				this.el.el.parentNode.removeChild(this.el.el);
			}
			this.clear();
		},
		
		clear: function(){
			this.sepHolder.innerHTML = "";
			this.background.innerHTML = "";
			
			if(this.handle.parentNode){
				this.handle.parentNode.removeChild(this.handle);
			}
			
			this.hideSlider();
		},
		
		showSlider: function(){
			this.mm.rightPanel.el.appendChild(this.sliderContainer);
		},
		
		hideSlider: function(){
			if(!this.sliderContainer.parentNode){
				return;
			}
			this.sliderContainer.parentNode.removeChild(this.sliderContainer);
		},
	}
);