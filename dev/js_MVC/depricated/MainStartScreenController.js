var MainStartScreenController = Class.extend({
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
construct: function() { 
	this._mainController;
	this._player;
	this._stage;
	this._lastInteractTime;
	this._startScreen;
},

init:function(mainController, player, stage){
	this._mainController = mainController;
	this._player = player;
	this._stage = stage;
},

initializeStartScreen: function(screenInfo){
	var data = {
		className:"startScreen";	
		spriteID:'startScreen';
		container:"body";	
		x:0;
		y:0;
		w:375;
		h:559;
	}
	
	this._startScreen = new StartScreen_Controller();
	var newView = new StartScreen_View();
	this._startScreen.bindView(newView,data);

	for(var i = 0; i< g_startScreenElements.length; i++){
		var classAcronym = g_startScreenElements[i].type;
		var className = gameBoardClasses[classAcronym];	// changeToStartScreenClasses
		var imagePath = gameBoardImageLookup[classAcronym];
		var spriteID = 'screen_tile'+i;
		var container = "startScreen";		
		var x = g_startScreenElements[i].x;
		var y = g_startScreenElements[i].y;
		var w = g_startScreenElements[i].w;
		var h = g_startScreenElements[i].h;
		var IDOverride = g_startScreenElements[i].IDOverride;
		var buttonFunction = g_startScreenElements[i].buttonFunction;
		var data = {container:container, spriteID:spriteID, className:className, x:x, y:y, w:w, h:h, imagePath:imagePath, buttonFunction:buttonFunction, IDOverride:IDOverride};
		g_startScreen.addTile(data);
	}
	this._startScreen.getInterfaceElement("instructions").show();
	this._startScreen.getInterfaceElement("disclaimer").show();
	
	this.initializeInformationDisplay(g_instructionElements);
	this._startScreen.setInterfaceElement("informationSlideshow", g_startScreenInformation);

	
	this.initializeDisclaimerDisplay(g_disclaimerElements);
	this._startScreen.setInterfaceElement("disclaimerSlideshow", g_startScreenDisclaimer);
	
	this._startScreen.setGameEngineStartCallback(e_startGame);
	
}

function e_initializeInformationDisplay(screenInfo){
	var className = "informationDisplay";	
	var spriteID = 'informationDisplay';
	var container = "startScreen";	
	var x = 28;
	var y = 24;
	var w = 319;
	var h = 508;
	g_startScreenInformation = new MultiPaneMenu();
	g_startScreenInformation.init(g_startScreen, container, spriteID, className, x, y,w,h);

	for(var i = 0; i< screenInfo.length; i++){
		var classAcronym = screenInfo[i].type;
		var className = gameBoardClasses[classAcronym];	// changeToStartScreenClasses
		var imagePath = gameBoardImageLookup[classAcronym];
		var spriteID = 'information_tile'+i;
		var container = "informationDisplay";		
		var x = screenInfo[i].x;
		var y = screenInfo[i].y;
		var w = screenInfo[i].w;
		var h = screenInfo[i].h;
		var IDOverride = screenInfo[i].IDOverride;
		var buttonFunction = screenInfo[i].buttonFunction;
		var data = {container:container, spriteID:spriteID, className:className, x:x, y:y, w:w, h:h, imagePath:imagePath, buttonFunction:buttonFunction, IDOverride:IDOverride};
		g_startScreenInformation.addTile(data);
		
	}
	
	g_startScreenInformation.getInterfaceElement("back").show();
	g_startScreenInformation.getInterfaceElement("forward").show();
	g_startScreenInformation.getInterfaceElement("close").show();
	
}

function e_initializeDisclaimerDisplay(screenInfo){
	var className = "disclaimerDisplay";	
	var spriteID = 'disclaimerDisplay';
	var container = "startScreen";	
	var x = 28;
	var y = 24;
	var w = 319;
	var h = 508;
	g_startScreenDisclaimer = new MultiPaneMenu();
	g_startScreenDisclaimer.init(g_startScreen, container, spriteID, className, x, y,w,h);

	for(var i = 0; i< screenInfo.length; i++){
		var classAcronym = screenInfo[i].type;
		var className = gameBoardClasses[classAcronym];	// changeToStartScreenClasses
		var imagePath = gameBoardImageLookup[classAcronym];
		var spriteID = 'disclaimer_tile'+i;
		var container = "disclaimerDisplay";		
		var x = screenInfo[i].x;
		var y = screenInfo[i].y;
		var w = screenInfo[i].w;
		var h = screenInfo[i].h;
		var IDOverride = screenInfo[i].IDOverride;
		var buttonFunction = screenInfo[i].buttonFunction;
		var data = {container:container, spriteID:spriteID, className:className, x:x, y:y, w:w, h:h, imagePath:imagePath, buttonFunction:buttonFunction, IDOverride:IDOverride};
		g_startScreenDisclaimer.addTile(data);
		
	}
	g_startScreenDisclaimer.getInterfaceElement("close").show();
	
}
 
});
