const RotateScreen_Controller = Controller.extend({

construct() { 
	this.SC.construct();
	this._mainController;
	this._startScreenController;
	this._mainModel;
	this._rotateScreen;
	
		
},

init(mainModel){
	//this._mainController = mainController;
	//this._startScreenController = startScreenController
	this._mainModel = mainModel;
	this.addListners();
	
},


/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("screenRotatedLandscape", this);
	g_eventHandler.addAListener("screenRotatedPortrait", this);
	g_eventHandler.addAListener("changeZIndex", this);
},

initializeRotateScreen:function(){
	var rotateScreenInfo = this._mainModel.getRotateScreenInfo();
	var classAcronym = rotateScreenInfo.type;
	var data = {
		className:this._mainModel.getGameboardClasses()[classAcronym],	
		imagePath:this._mainModel.getGameboardImageLookup()[classAcronym],
		id:'rotateScreen',
		container:"body",	
		imgs:this._mainModel.getGameboardImageLookup()[classAcronym],	
		x:rotateScreenInfo.x,
		y:rotateScreenInfo.y,
		w:rotateScreenInfo.w,
		h:rotateScreenInfo.h
	}
	
	this._rotateScreen = new Tile_Controller();
	var newView = new StageMask_View();
	this._rotateScreen.bindView(newView,data);
	this._rotateScreen.setViewVisibility(false);
	this._rotateScreen.hide();	
},

screenRotatedLandscape:function(){
	this._rotateScreen.setViewVisibility(true);
	this._rotateScreen.show();	
},

screenRotatedPortrait:function(){
	this._rotateScreen.setViewVisibility(false);
	this._rotateScreen.hide();	
},

changeZIndex:function(){
	this._rotateScreen.getViewDIV().css( "zIndex", 1000 );
},




});