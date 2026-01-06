var StartScreen_Controller = Controller.extend({

construct: function() { 
	this.SC.construct();
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
	
		
},

init: function(mainModel){
	//this._mainController = mainController;
	this._mainModel = mainModel;
	this.addListners();
	this.startScreenLoaded = false;
	this._loadedTotal = 0;
	this.initialLoadTotal = this._mainModel.getInitialLoadBytes();//140781;
	this._maxLoadTotal = this._mainModel.getTotalLoadBytes();//533253;
	this._closed = false;
	
},


/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("playGame", this);
	g_eventHandler.addAListener("displayProgress", this);
	g_eventHandler.addAListener("screenRotatedPortrait", this);
	g_eventHandler.addAListener("screenRotatedLandscape", this);
	
},

initializeStartScreen: function(){
	var screenInfo = g_gameboardModel.getStartScreenElements();
	var data = {
		className:"startScreen",	
		id:'startScreen',
		container:"body",	
		x:0,
		y:0,
		w:375,
		h:559,
	}
	
	this._startScreen = new StartMenu_Controller();
	var newView = new MultiPaneMenu_View();
	this._startScreen.bindView(newView,data);
	
	
	for(var i = 0; i< screenInfo.length; i++){
		var classAcronym = screenInfo[i].type;
		var dataNested = {
			container:"startScreen", 
			id:'screen_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:screenInfo[i].x, 
			y:screenInfo[i].y, 
			w:screenInfo[i].w, 
			h:screenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:screenInfo[i].buttonFunction, 
			IDOverride:screenInfo[i].IDOverride
		};
		/* console.log(classAcronym)
		console.log(data.imgs) */
		/* console.log(dataNested.IDOverride); */
		if(dataNested.IDOverride == "start"){
			/* console.log(dataNested); */
			this._delayedStartScreenData = dataNested;
		}else{
			this._startScreen.addTile(dataNested);
		}
		
	}
	/* this._startScreen.getInterfaceElement("instructions").getView().show(); */
	this._startScreen.getInterfaceElement("disclaimer").getView().show();
	
	/* this.initializeInformationDisplay(this._mainModel.getInstructionElements());
	this._startScreen.setExternalControlls("informationSlideshow", this._informationScreen); */
	
	
	this.initializeDisclaimerDisplay(this._mainModel.getDisclaimerElements());
	this._startScreen.setExternalControlls("disclaimerSlideshow", this._disclaimerScreen);
	
	
	this._startScreen.getView().show();
	/* g_startScreen.setGameEngineStartCallback(e_startGame); */
		
},
/*Stagger load of buttons*/
initializeStartButton: function(){
	this._startScreen.addTile(this._delayedStartScreenData);
},

initializeInformationDisplay: function(screenInfo){
	/* console.log("initializeInformationDisplay"); */
	var data = {
		className:"informationDisplay",	
		id:'informationDisplay',
		container:"startScreen",	
		x:28,
		y:24,
		w:319,
		h:508
	}
	
	this._informationScreen = new MultiPaneMenu_Controller();
	var newView = new MultiPaneMenu_View();
	this._informationScreen.bindView(newView,data);

	
	for(var i = 0; i< screenInfo.length; i++){
		var classAcronym = screenInfo[i].type;
		var data = {
			container:"informationDisplay", 
			id:'information_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:screenInfo[i].x, 
			y:screenInfo[i].y, 
			w:screenInfo[i].w, 
			h:screenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:screenInfo[i].buttonFunction, 
			IDOverride:screenInfo[i].IDOverride
		};
		this._informationScreen.addTile(data);
		
	}
	
	this._informationScreen.getInterfaceElement("back").getView().show();
	this._informationScreen.getInterfaceElement("forward").getView().show();
	this._informationScreen.getInterfaceElement("close").getView().show();
	this._informationScreen.close();

},

initializeDisclaimerDisplay: function(screenInfo){
	/* console.log("initializeDisclaimerDisplay"); */
	var data = {
		className:"disclaimerDisplay",	
		id:'disclaimerDisplay',
		container:"startScreen",	
		x:28,
		y:24,
		w:319,
		h:508
	}
	
	this._disclaimerScreen = new MultiPaneMenu_Controller();
	var newView = new MultiPaneMenu_View();
	this._disclaimerScreen.bindView(newView,data);
	
	
	for(var i = 0; i< screenInfo.length; i++){
		var classAcronym = screenInfo[i].type;
		var data = {
			container:"disclaimerDisplay", 
			id:'disclaimer_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:screenInfo[i].x, 
			y:screenInfo[i].y, 
			w:screenInfo[i].w, 
			h:screenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:screenInfo[i].buttonFunction, 
			IDOverride:screenInfo[i].IDOverride
		};
		this._disclaimerScreen.addTile(data);
		
	}
	this._disclaimerScreen.getInterfaceElement("close").getView().show();
	
},


playGame: function(){
		this._startScreen.hide();
		this._closed = true;
		g_eventHandler.dispatchAnEvent("showGameDisplay",{});
		/* this._mainController.showGameDisplay(); */
},

screenRotatedPortrait: function(){
		if(!this._closed){
			this._startScreen.show();
		}
},

screenRotatedLandscape: function(){
	console.log('a');
		if(!this._closed){
			this._startScreen.hide();
		}
},



displayStartButton: function(){
	this._startScreen.getInterfaceElement("loading").hide();
	this._startScreen.getInterfaceElement("start").show();
},


		
		
displayProgress: function(data){
	//console.log(data.bytes);
	this._loadedTotal += data.bytes;
	console.log(this._loadedTotal);
	if(this.startScreenLoaded){
		g_eventHandler.dispatchAnEvent("addNextSprite",{});
	}
	if(!this.startScreenLoaded && (this._loadedTotal/this.initialLoadTotal)==1){
		this.startScreenLoaded = true;
		g_startScreenRefresh();
	}
	
	if((this._loadedTotal/this._maxLoadTotal)>=1){
		this.displayStartButton();
	}
	
}	



});