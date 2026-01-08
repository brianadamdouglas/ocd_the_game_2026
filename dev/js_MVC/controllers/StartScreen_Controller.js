class StartScreen_Controller extends Controller {

	constructor() { 
	super();
	this._mainController;
	this._startScreen;
	this._informationScreen;
	this._disclaimerScreen;
	this._maxLoadTotal;
	this.initialLoadTotal;
	this.startScreenLoaded;
	this._loadedTotal;
	this._delayedStartScreenData;
	this._mainModel;
	this._closed;
	
		
}

	init(mainModel){
	//this._mainController = mainController;
	this._mainModel = mainModel;
	this.addListners();
	this.startScreenLoaded = false;
	this._loadedTotal = 0;
	this.initialLoadTotal = this._mainModel.getInitialLoadBytes();//140781;
	this._maxLoadTotal = this._mainModel.getTotalLoadBytes();//533253;
	this._closed = false;
	this._startScreenRefreshCalled = false;
	
}


	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("playGame", this);
	g_eventHandler.addAListener("displayProgress", this);
	g_eventHandler.addAListener("screenRotatedPortrait", this);
	g_eventHandler.addAListener("screenRotatedLandscape", this);
	
}

	initializeStartScreen(){
	const screenInfo = g_gameboardModel.getStartScreenElements();
	const data = {
		className:"startScreen",	
		id:'startScreen',
		container:"body",	
		x:0,
		y:0,
		w:375,
		h:559,
	}
	
	this._startScreen = new StartMenu_Controller();
	const newView = new MultiPaneMenu_View();
	this._startScreen.bindView(newView,data);
	
	
	for(let i = 0; i< screenInfo.length; i++){
		const classAcronym = screenInfo[i].type;
		const dataNested = {
			container:"startScreen", 
			id:'screen_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:screenInfo[i].x, 
			y:screenInfo[i].y, 
			w:screenInfo[i].w, 
			h:screenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:screenInfo[i].buttonFunction, 
			IDOverride:screenInfo[i].IDOverride,
			startFrame:0  // Always show the first frame (index 0) for start screen images
		};
		/* console.log(classAcronym)
		console.log(data.imgs) */
		/* console.log(dataNested.IDOverride); */
		if(dataNested.IDOverride === "start"){
			/* console.log(dataNested); */
			this._delayedStartScreenData = dataNested;
			this._delayedStartScreenData.startFrame = 0;  // Ensure startFrame is set
		}else{
			this._startScreen.addTile(dataNested);
		}
		
	}
	// Show instructions button if it exists
	try {
		const instructionsButton = this._startScreen.getInterfaceElement("instructions");
		if (instructionsButton && instructionsButton.getView) {
			instructionsButton.getView().show();
		}
	} catch (e) {
		console.warn("Instructions button not found:", e);
	}
	
	// Show disclaimer button if it exists (may be commented out)
	try {
		const disclaimerButton = this._startScreen.getInterfaceElement("disclaimer");
		if (disclaimerButton && disclaimerButton.getView) {
			disclaimerButton.getView().show();
		}
	} catch (e) {
		// Disclaimer button is commented out, so this is expected
		console.log("Disclaimer button not found (expected if commented out)");
	}
	
	this.initializeInformationDisplay(this._mainModel.getInstructionElements());
	this._startScreen.setExternalControlls("informationSlideshow", this._informationScreen);
	
	
	// Only initialize disclaimer display if there are disclaimer elements
	const disclaimerElements = this._mainModel.getDisclaimerElements();
	if (disclaimerElements && disclaimerElements.length > 0) {
		this.initializeDisclaimerDisplay(disclaimerElements);
		this._startScreen.setExternalControlls("disclaimerSlideshow", this._disclaimerScreen);
	}
	
	
	// Start screen should be hidden initially and shown when initial load completes
	// Don't show it here - it will be shown in displayProgress when initial load completes
	const startScreenView = this._startScreen.getView();
	if(startScreenView && startScreenView.getDiv()) {
		startScreenView.hide(); // Hide initially until images are loaded
	}
	/* g_startScreen.setGameEngineStartCallback(e_startGame); */
		
}
/*Stagger load of buttons*/
	initializeStartButton(){
	this._startScreen.addTile(this._delayedStartScreenData);
}

	initializeInformationDisplay(screenInfo){
	/* console.log("initializeInformationDisplay"); */
	const data = {
		className:"informationDisplay",	
		id:'informationDisplay',
		container:"startScreen",	
		x:28,
		y:24,
		w:319,
		h:508
	}
	
	this._informationScreen = new MultiPaneMenu_Controller();
	const newView = new MultiPaneMenu_View();
	this._informationScreen.bindView(newView,data);

	
	for(let i = 0; i< screenInfo.length; i++){
		const classAcronym = screenInfo[i].type;
		const data = {
			container:"informationDisplay", 
			id:'information_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:screenInfo[i].x, 
			y:screenInfo[i].y, 
			w:screenInfo[i].w, 
			h:screenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:screenInfo[i].buttonFunction, 
			IDOverride:screenInfo[i].IDOverride,
			startFrame:0  // Always show the first frame for information screen images
		};
		this._informationScreen.addTile(data);
		
	}
	
	this._informationScreen.getInterfaceElement("back").getView().show();
	this._informationScreen.getInterfaceElement("forward").getView().show();
	this._informationScreen.getInterfaceElement("close").getView().show();
	this._informationScreen.close();

}

	initializeDisclaimerDisplay(screenInfo){
	/* console.log("initializeDisclaimerDisplay"); */
	const data = {
		className:"disclaimerDisplay",	
		id:'disclaimerDisplay',
		container:"startScreen",	
		x:28,
		y:24,
		w:319,
		h:508
	}
	
	this._disclaimerScreen = new MultiPaneMenu_Controller();
	const newView = new MultiPaneMenu_View();
	this._disclaimerScreen.bindView(newView,data);
	
	
	for(let i = 0; i< screenInfo.length; i++){
		const classAcronym = screenInfo[i].type;
		const data = {
			container:"disclaimerDisplay", 
			id:'disclaimer_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:screenInfo[i].x, 
			y:screenInfo[i].y, 
			w:screenInfo[i].w, 
			h:screenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:screenInfo[i].buttonFunction, 
			IDOverride:screenInfo[i].IDOverride,
			startFrame:0  // Always show the first frame for disclaimer screen images
		};
		this._disclaimerScreen.addTile(data);
		
	}
	this._disclaimerScreen.getInterfaceElement("close").getView().show();
	
}


	playGame(){
		this._startScreen.hide();
		this._closed = true;
		g_eventHandler.dispatchAnEvent("showGameDisplay",{});
		/* this._mainController.showGameDisplay(); */
}

	screenRotatedPortrait(){
		if(!this._closed){
			this._startScreen.show();
		}
}

	screenRotatedLandscape(){
		if(!this._closed){
			this._startScreen.hide();
		}
}



	displayStartButton(){
	this._startScreen.getInterfaceElement("loading").hide();
	this._startScreen.getInterfaceElement("start").show();
}


		
		
	displayProgress(data){
	this._loadedTotal += data.bytes;
	
	if(this.startScreenLoaded){
		g_eventHandler.dispatchAnEvent("addNextSprite",{});
	}
	if(!this.startScreenLoaded && (this._loadedTotal/this.initialLoadTotal) >= 1){
		this.startScreenLoaded = true;
		// Show the start screen now that initial assets are loaded
		if(this._startScreen && this._startScreen.getView()) {
			this._startScreen.getView().show();
		}
		g_startScreenRefresh();
	}
	
	// Fallback: if we've loaded way past initial and start screen still isn't shown, show it anyway
	if(!this.startScreenLoaded && (this._loadedTotal/this.initialLoadTotal) >= 1.5){
		this.startScreenLoaded = true;
		if(this._startScreen && this._startScreen.getView()) {
			this._startScreen.getView().show();
		}
		if(!this._startScreenRefreshCalled) {
			this._startScreenRefreshCalled = true;
			g_startScreenRefresh();
		}
	}
	
	if((this._loadedTotal/this._maxLoadTotal)>=1){
		this.displayStartButton();
	}
	
}	



}