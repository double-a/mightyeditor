"use strict";
MT.require("ui.Holder");
MT.require("ui.Panel");
MT.require("ui.Button");
MT.require("ui.Events");
MT.require("ui.DomElement");

MT(
	MT.ui.UIController = function(){
		this.events = new MT.ui.Events();
		
		//window.x = new MT.ui.DomElement();
		//return;
		
		this.addHolders();
		this.addCenter();
		this.addEvents();
		
		
	},
	{
		
		addHolders: function(){
			
			this.top = new MT.ui.Holder(MT.ui.position.TOP, this.events);
			this.top.height = 29;
			this.top.el.className += " top";
			
			this.top.resizeable = false;
			this.top.show(document.body);
			
			
			this.left = new MT.ui.Holder(MT.ui.position.LEFT, this.events);
			this.left.width = 70;
			this.left.resizeable = false;
			this.left.addTop(this.top);
			this.left.el.className += " left";
			this.left.show(document.body);
			
			
			this.bottom = new MT.ui.Holder(MT.ui.position.BOTTOM, this.events);
			this.bottom.height = 200;
			this.bottom.addLeft(this.left);
			this.bottom.show(document.body);
			
			
			//this.left.addBottom(this.bottom);
			
			this.right = new MT.ui.Holder(MT.ui.position.RIGHT, this.events);
			
			this.right.addTop(this.top);
			this.right.addBottom(this.bottom);
			this.right.width = 320;
			this.right.show(document.body);
			
			this.addPanels();
		},
		
		addPanel: function(name){
			var panel = new MT.ui.Panel(name, this.events);
			
			this.right.addPanel(panel);
			
			return panel;
		},
   
		addPanels: function(){
			
			/*
			this.panels = {
				top: null,//new MT.ui.Panel(this.events),
				left: new MT.ui.Panel("Untitled",this.events)
			};
			
			//this.top.addPanel(this.panels.top);
			
			this.right.addPanel(this.panels.left);
			this.right.addPanel(new MT.ui.Panel("Untitled2",this.events));
			*/
		},
		
		addEvents: function(){
			
			var that = this;
			this.top.onupdate(function(){
				that.left.setPosition();
				that.right.setPosition();
			});
			this.bottom.onupdate(function(){
				that.left.setPosition();
				that.right.setPosition();
			});
			this.left.onupdate(function(){
				that.alignCenter();
				
			});
			this.right.onupdate(function(){
				that.alignCenter();
			});
			
		},
		
		addCenter: function(){
			this.center = document.createElement("div");
			this.center.style.position = "absolute";
			this.center.style.backgroundColor = "rgba(0,255,0,0.5)";
			this.center.className = "center";
			document.body.appendChild(this.center);
			
			this.alignCenter();
		},
		
		alignCenter: function(){
			this.center.style.top = this.top.height + "px";
			this.center.style.bottom = this.bottom.height + "px";
			this.center.style.left = this.left.width + "px";
			this.center.style.right = this.right.width + "px";
		}
	   
	   
	}
);