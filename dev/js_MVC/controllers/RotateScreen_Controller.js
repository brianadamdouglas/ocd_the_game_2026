class RotateScreen_Controller extends Controller {

	constructor() { 
	super();
	this._mainController;
	this._startScreenController;
	this._mainModel;
	this._rotateScreen;
	
		
}

	init(mainModel){
	//this._mainController = mainController;
	//this._startScreenController = startScreenController
	this._mainModel = mainModel;
	this.addListners();
	
}


	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("screenRotatedLandscape", this);
	g_eventHandler.addAListener("screenRotatedPortrait", this);
	g_eventHandler.addAListener("changeZIndex", this);
}

	initializeRotateScreen(){
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
}

	screenRotatedLandscape(){
	this._rotateScreen.setViewVisibility(true);
	this._rotateScreen.show();	
}

	screenRotatedPortrait(){
	this._rotateScreen.setViewVisibility(false);
	this._rotateScreen.hide();	
}

	changeZIndex(){
	this._rotateScreen.getViewDIV().css( "zIndex", 1000 );
}




}