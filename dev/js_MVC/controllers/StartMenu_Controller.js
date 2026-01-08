class StartMenu_Controller extends MultiPaneMenu_Controller {
	constructor() { 
	super();
	this.interfaceReferences;
	this.externalControlls;
	this._className = "StartScreen";
}

	init(){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};
	this._interfaceReferences = {};
	this.externalControlls = {}
	this._currentPage = 0;	
	this.addListners();
}

	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("startGame", this);
	g_eventHandler.addAListener("openInstructions", this);
	g_eventHandler.addAListener("openDisclaimer", this);
}



	addTile(data) {
  
  
  	if(data.className.match(/button/gi) !== null){
  	    	data.buttonTarget = this;
			const newButton = new Button_Controller();
			const newView = new Button_View();
			newButton.bindView(newView,data);  	    
  	    
			
			this.setInterfaceElement(data.IDOverride, newButton);
		/* OnOffTile*/
		
		}else if(data.className.match(/tile/gi) !== null){
			
			const newController = new Tile_Controller();
			const newView = new Tile_View();
			newController.bindView(newView,data);
			
			if(data.IDOverride !== undefined){
				this.setInterfaceElement(data.IDOverride, newController);
			}
		
		/* StickyTile*/
			
		}
}

	setExternalControlls(name, reference){
  this.externalControlls[name] = reference;
}

	startGame(){
  /* document.getElementById("myAudio").play();
  document.getElementById("myAudio").volume = 0.1; */
  /* g_eventHandler.dispatchAnEvent("startAudio",{}); */
  g_eventHandler.dispatchAnEvent("playGame",{});
}
	openInstructions(){
  g_eventHandler.dispatchAnEventOneTarget("open",{target:this.externalControlls["informationSlideshow"]});
}

	openDisclaimer(){
  if (this.externalControlls && this.externalControlls["disclaimerSlideshow"]) {
    g_eventHandler.dispatchAnEventOneTarget("open",{target:this.externalControlls["disclaimerSlideshow"]});
  } else {
    console.warn("StartMenu_Controller: disclaimerSlideshow not found in externalControlls");
  }
}




}