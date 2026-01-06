class Door_Controller extends OnOffTileControl_Controller {
	constructor() { 
	super();
	this._defaultVisibility;
	//console.log("New Door");
	this._className = "Door";
	
}

	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("resetState", this);
}

	setDefaultVisibility(b){
	this._defaultVisibility = b;
}


	/**
* @description Sets the visibility to true or false
	*/  
	setVisibility(b){
  this._interactState = b;
  if(!this._interactState){
    this._view.getImageController().hideFrameNum(0);
  	//this.images[0].hide();
  	this._view.setVisibility(false);
  }else{
    this._view.getImageController().showFrameNum(0);
  	//this.images[0].show();
  	this._view.setVisibility(true);
  }
}


	/**
* @description Turns the instance this.Interact to true of false. It also shows and hides this._div
	*/  
	interact(){
  this._interactState = ! this._interactState;
  if(!this._interactState){
    this._view.getImageController().hideFrameNum(0);
  	//this.images[0].hide()
  	this._view.setVisibility(false);
  }else{
    this._view.getImageController().showFrameNum(0);
  	//this.images[0].show();
  	this._view.setVisibility(true);
  }
}


	/**
* @description Public function that calls the private function this.interact. It tells the listener to interact as well.(might change to acted upon); 
	*/ 
	actedUpon(){
  this.interact();
  this.listener.interact();
}

	resetState(){
	this.setVisibility(this._defaultVisibility);
}
  
}