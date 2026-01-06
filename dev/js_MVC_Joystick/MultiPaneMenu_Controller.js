var MultiPaneMenu_Controller = Tile_Controller.extend({
construct: function() { 
	this.SC.construct();
	this._interfaceReferences;
	this._slideShow;
	this._currentPage;
	this._maxPages;
	this._className = "MultiPaneMenu";
},

/**
* @description Initializes the instance
* @param {Selection} container // the selection on the stage that houses the player tile
* @param {String} id // unique name of the new DIV
* @param {String} className // space delimited string of CSS classes that are attached to this instance.
* @param {Interger} x // X coordinate on the stage.
* @param {Interger} y // Y coordinate on the stage.
* @param {Interger} width // Max width .
* @param {Interger} height // Max height .
* @return 
*/

init: function(){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};
	this._interfaceReferences = new Object();
	this._currentPage = 0;
	this.addListners();	
},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("open", this);
	g_eventHandler.addAListener("close", this);	
	g_eventHandler.addAListener("nextPanel", this);	
	g_eventHandler.addAListener("previousPanel", this);
},


setInterfaceElement: function(name, reference){
  this._interfaceReferences[name] = reference;
},

getInterfaceElement: function(name){
  return this._interfaceReferences[name];
},


/**
* @description Return the dimensions of the PLayer tile;
* @return {Object} the dimensions Object(width, height); 
*/    
getDimensions: function() {
  	return {width:this._width,height:this._height};
},

addTile: function(data) {
  	if(data.className.match(/button/gi) != null){
  	    
		/* var newButton = new Button_Controller();
		var newView = new Button_View();
		newButton.bindView(newView,data);	
		var buttonFunction = this[data.buttonFunction].bind(this);
		newButton.init(this, data.container, data.spriteID, data.className, data.x, data.y,data.w,data.h,data.imagePath, 0,buttonFunction, data.IDOverride); */
		data.buttonTarget = this;
		var newButton = new Button_Controller();
		var newView = new Button_View();
		newButton.bindView(newView,data);  
		this.setInterfaceElement(data.IDOverride, newButton);
	/* OnOffTile*/
	
	}else if(data.className.match(/tile/gi) != null){
		
		var newController = new SlideShow_Controller();
		var newView = new Tile_View();
		newController.bindView(newView,data);
		//console.log(data)
		/* var new_slideShow = new _slideShow();
		new_slideShow.init(data.container, data.spriteID, data.className, data.x, data.y,data.w,data.h,data.imagePath,0, this); */
		this._slideShow = newController;
		this._maxPages = data.imgs.length;
	/* StickyTile*/
		
	}
		
},

nextPanel: function(data){
  if(this._slideShow.nextFrame()){
      this.getInterfaceElement("forward").hide();
      this.getInterfaceElement("back").show();
  }else{
  	this.getInterfaceElement("forward").show();  
  	this.getInterfaceElement("back").show();
  }
},

previousPanel: function(data){
  if(this._slideShow.previousFrame()){
  	  this.getInterfaceElement("back").hide();
      this.getInterfaceElement("forward").show();
  }else{
      this.getInterfaceElement("back").show();
      this.getInterfaceElement("forward").show();  
  	
  }
},

close: function(){
  this._slideShow.hideSequence(0);
  this.hide();
},

open: function(){
  this.reset_slideShow();
  this.show();
},

reset_slideShow: function(){
  if(this.getInterfaceElement("back") != undefined){
  	this.getInterfaceElement("back").hide();
    this.getInterfaceElement("forward").show();
  }
  
  this._slideShow.resetFrames();
  this._slideShow.showSequence();
}
  
  
  
});

