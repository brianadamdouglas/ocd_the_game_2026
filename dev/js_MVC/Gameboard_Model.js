/**
* @class Controller
* @description The basic Controller class
*/
const Gameboard_Model = Class.extend({
/**
* Constructor
*/
construct() { 
	this._rotaterPosition// = $('#rotater').position();
	this._rotaterX// = 190;//rotaterPosition.left//300;
	this._rotaterY// = 300;//rotaterPosition.top;
	this._stageWidth// = 1252;//width of stage
	this._stageHeight// =	1688;//height of stage
	this._stageStartX// = -380; // -380
	this._stageStartY// = -380; // -400
	this._gameboard// = [];
	this._thoughtAnimations// = [];
	this._startScreenElements// = [];
	this._instructionElements// = [];
	this._disclaimerElements// = [];
	this._loadTotal// = 0;
	this._stageBuilder// = new StageBuilder();
	this._lastBuildNum// = 0;
	this._playerInfo;
	this._directory;
	this._gameBoardClasses;
	this._gameBoardImageLookup;
	this._thoughtInfo;
	this._maskInfo;			
	this._volumeControlInfo;
	this._endScreenGoodInfo;
	this._goodEndScreenElements// = [];
	this._badEndScreenElements// = [];
	this._endScreenBadInfo;
	this._rotateScreenInfo;
	this._initialLoadBytes;
	this._totalLoadBytes;
	this._thoughtMatrix;
	this._g_potentialThoughtArray;
	this._relatedMatrix;
	this._timeLimit;
	
},

/**
* @description Initializes the instance
* @return 
*/
init(){
	this._gameboard = [];
	this._thoughtAnimations = [];
	this._startScreenElements = [];
	this._instructionElements = [];
	this._disclaimerElements = [];
	this._goodEndScreenElements = [];
	this._badEndScreenElements = [];
	this._loadTotal = 0;
	this._stageBuilder = new StageBuilder();
	this._lastBuildNum = 0;
	this._directory = "/img/gameDev/";
	this.setGameboardClasses();
	this.setGameboardImageLookup();
	
	this.generatePlayerInfo();
	this.generateThoughtInfo();
	this.generateMaskInfo();
	this.generateVolumeControlInfo();
	this.generateStartScreenElements();
	this.generateStageElements();
	this.generateThoughtElements();
	this.generateGoodEndScreenElements();
	this.generateBadEndScreenElements();
	this.generateRotateScreenInfo();
	this.generateThoughtMatrix();
	this.generateRelatedMatrix();
	this.generatePotentialThoughtArray();
},

/**
* @description Adds an element to the g_gameboard array which is used to build the stage
* @param {Object} data 
*/	
addStageElement:function(data){
	this._lastBuildNum = this._stageBuilder.addElement(data, this._gameboard,'tile');
},


/**
* @description Adds an element to the thoughtAnimations array which is used to import thought animations
* @param {Object} data 
*/	
addThoughtElement:function(data){
	this._lastBuildNum = this._stageBuilder.addElement(data, this._thoughtAnimations, 'animation');
},

/**
* @description Adds an element to the thoughtAnimations array which is used to import thought animations
* @param {Object} data 
*/	
addStartScreenElement:function(data){
	this._lastBuildNum = this._stageBuilder.addElement(data, this._startScreenElements, 'startScreen');
},

/**
* @description Adds an element to the thoughtAnimations array which is used to import thought animations
* @param {Object} data 
*/	
addInstructionsElement:function(data){
	this._lastBuildNum = this._stageBuilder.addElement(data, this._instructionElements, 'instructions');
},

/**
* @description Adds an element to the thoughtAnimations array which is used to import thought animations
* @param {Object} data 
*/	
addDisclaimerElement:function(data){
	this._lastBuildNum = this._stageBuilder.addElement(data, this._disclaimerElements, 'disclaimer');
},

/**
* @description Adds an element to the thoughtAnimations array which is used to import thought animations
* @param {Object} data 
*/	
addGoodEndScreenElement:function(data){
	this._lastBuildNum = this._stageBuilder.addElement(data, this._goodEndScreenElements, 'goodEndScreen');
},

/**
* @description Adds an element to the thoughtAnimations array which is used to import thought animations
* @param {Object} data 
*/	
addBadEndScreenElement:function(data){
	this._lastBuildNum = this._stageBuilder.addElement(data, this._badEndScreenElements, 'badEndScreen');
},

generateThoughtMatrix:function(){
	this._thoughtMatrix = {
		candle:{},
		lampBR:{},
		lampOffice:{},
		bookOffice:{},
		chairBar:{},
		chairTable:{},
		matCorner:{},
		kitchenSink:{},
		kitchenRange:{},
		frontDoor:{},
		tv:{},
		lampLR:{},
		toilet:{},
		bathtub:{},
		bathSink:{},
		sock:{},
		underwear:{},
		shirt:{},
		pant:{}
	};
},	

generatePotentialThoughtArray:function(){
	this._g_potentialThoughtArray  = [
		"candle",
		"lampBR",
		"lampOffice",
		"bookOffice",
		"chairBar",
		"chairTable",
		"matCorner",
		"kitchenSink",
		"kitchenRange",
		"tv",
		"lampLR",
		"toilet",
		"bathtub",
		"bathSink",
		"sock",
		"underwear",
		"shirt",
		"pant"
	];
},

generateRelatedMatrix:function(){
	this._relatedMatrix = {
		candle:["kitchenRange", "lampBR"],
		lampBR:["lampOffice", "lampLR"],
		lampOffice:["lampLR", "lampBR"],
		bookOffice:[],
		chairBar:[],
		chairTable:[],
		matCorner:["sock", "pant", "shirt", "underwear"],
		kitchenSink:["bathtub", "bathSink"],
		kitchenRange:["candle"],
		frontDoor:[],
		tv:[],
		lampLR:["lampOffice", "lampBR"],
		toilet:[],
		bathtub:["bathSink", "kitchenSink"],
		bathSink:["bathtub", "kitchenSink"],
		sock:["matCorner", "pant", "shirt", "underwear"],
		underwear:["matCorner", "pant", "shirt", "sock"],
		shirt:["matCorner", "pant", "underwear", "sock"],
		pant:["matCorner", "shirt", "underwear", "sock"]
	};
},		


generatePlayerInfo:function(){
	var playerW = 76;
	var playerH = 90;
	var playerX = this._rotaterX - (playerW/2);//the player's x is always centered on the rotater and then subtracts half width to put div on center
	var playerY = this._rotaterY - (playerH/2);//the player's y is always centered on the rotater and then subtracts half height to put div on center
	this._playerInfo = {
		type:'player', 
		x:playerX, 
		y:playerY, 
		w:playerW, 
		h:playerH, 
		stopFrame:0, 
		walkFrames:4, 
		turnLeftFrame:5, 
		turnRightFrame:6, 
		interactFrame:7, 
		stickyLiftOffset:[0,-14,-43,0,4,0,0,-58],
		hitTestHeadData:{container:"",id:"playerHead",x:18,y:2,width:38,height:27},
		hitTestTorsoData:{container:"",id:"playerTorso",x:8,y:30,width:58,height:60}
	};
},

generateThoughtInfo:function(){
	this._thoughtInfo = {type:'thoughtBubble', x:this._rotaterX - 87, y:this._rotaterY - 190, w:173, h:158, stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]}};
},

generateMaskInfo:function(){
	this._maskInfo = {type:'featheredMask', x:0, y:0, w:375, h:559};
},

generateVolumeControlInfo:function(){
	this._volumeControlInfo = {type:'volumeControl', x:0, y:0, w:42, h:39, buttonFunction:"toggleAudio"};
},

generateGoodEndScreenElements:function(){
	this.addGoodEndScreenElement({type:'endScreenGood', x:0, y:0, w:375, h:559, IDOverride:"goodEndScreenBackground"});
	this.addGoodEndScreenElement({type:'endScreenGoodButton', x:95, y:244, w:187, h:41, IDOverride:"goodEndScreenButton", buttonFunction:"buttonEvent"});
	/* this._endScreenInfo = {type:'endScreen', x:0, y:0, w:375, h:559}; */
},

generateBadEndScreenElements:function(){
	this.addBadEndScreenElement({type:'endScreenBad', x:0, y:0, w:375, h:559, IDOverride:"badEndScreenBackground"});
	this.addBadEndScreenElement({type:'endScreenBadButton', x:77, y:250, w:221, h:33, IDOverride:"badEndScreenButton", buttonFunction:"buttonEvent"});
	/* this._endScreenInfo = {type:'endScreen', x:0, y:0, w:375, h:559}; */
},

generateRotateScreenInfo:function(){
	this._rotateScreenInfo = {type:'rotateScreen', x:0, y:0, w:559, h:375};
},


generateStartScreenElements:function (){
	this.addStartScreenElement({type:'logo', x:27, y:25, w:321, h:301});
	this.addStartScreenElement({type:'loading', x:120, y:342, w:154, h:23, IDOverride:"loading"});
	this.addStartScreenElement({type:'startButton', x:139, y:342, w:90, h:23, IDOverride:"start", buttonFunction:"startGame"});
	this.addStartScreenElement({type:'instructionsButton', x:83, y:391, w:201, h:23, IDOverride:"instructions", buttonFunction:"openInstructions"});
	this.addStartScreenElement({type:'disclaimerButton', x:96, y:444, w:175, h:23, IDOverride:"disclaimer", buttonFunction:"openDisclaimer"});
	this.addStartScreenElement({type:'trademark', x:31, y:493, w:306, h:39});
	
	this.addInstructionsElement({type:'instructionImages', x:0, y:0, w:319, h:508});
	this.addInstructionsElement({type:'instructionButtonBack', x:3, y:457, w:58, h:47, IDOverride:"back", buttonFunction:"previousPanel"});
	this.addInstructionsElement({type:'instructionButtonForward', x:258, y:457, w:58, h:47, IDOverride:"forward", buttonFunction:"nextPanel"});
	this.addInstructionsElement({type:'menuClose', x:258, y:3, w:58, h:47, IDOverride:"close", buttonFunction:"close"});
	
	this.addDisclaimerElement({type:'disclaimerImage', x:0, y:0, w:319, h:508});
	this.addDisclaimerElement({type:'menuClose', x:258, y:3, w:58, h:47, IDOverride:"close", buttonFunction:"close"});
},

generateStageElements:function (){
	/* STAGE BACKGROUND */			
	this.addStageElement({type:'interactButton', x:0, y:0, w:this.getStageWidth(), h:this.getStageHeight(), IDOverride:"stageBackground"});
	/* STAGE BACKGROUND */					
	
	
	/* OUTDOORS */		
	this.addStageElement({type:'grass', x:-1000, y:-1000, w:this.getStageWidth() + 2000, h:1000});
	this.addStageElement({type:'grass', x:-1000, y:0, w:1000, h:this.getStageHeight() +1000});
	this.addStageElement({type:'grass', x:0, y:this.getStageHeight(), w:this.getStageWidth() + 2000, h:1000});
	this.addStageElement({type:'grass', x:this.getStageWidth() - 52, y:0, w:50, h:950});
	this.addStageElement({type:'grass', x:this.getStageWidth()- 4, y:0, w:1000, h:this.getStageHeight()}); 
	this.addStageElement({type:'dirt', x:793, y:0, w:70, h:210});
	this.addStageElement({type:'dirt', x:863, y:0, w:61, h:408});
	this.addStageElement({type:'dirt', x:1018, y:0, w:182, h:408});
	this.addStageElement({type:'shrubbery', x:803, y:15, w:66, h:45});
	this.addStageElement({type:'shrubbery', x:869, y:15, w:45, h:100});
	this.addStageElement({type:'shrubbery', x:869, y:115, w:45, h:100});
	this.addStageElement({type:'shrubbery', x:869, y:215, w:45, h:100});
	this.addStageElement({type:'shrubbery', x:869, y:315, w:45, h:85});
	
	this.addStageElement({type:'shrubbery', x:1021, y:15, w:45, h:100});
	this.addStageElement({type:'shrubbery', x:1021, y:115, w:45, h:100});
	this.addStageElement({type:'shrubbery', x:1021, y:215, w:45, h:100});
	this.addStageElement({type:'shrubbery', x:1021, y:315, w:45, h:85});
	this.addStageElement({type:'shrubbery', x:1066, y:15, w:100, h:45});
	this.addStageElement({type:'shrubbery', x:1166, y:15, w:23, h:45});
	
	this.addStageElement({type:'sidewalk', x:918, y:-290, w:100, h:700});
	this.addStageElement({type:'finishText', x:924, y:113, w:88, h:15});
	this.addStageElement({type:'exitGameBlocker', x:918, y:0, w:100, h:10});
	
	
	
	/* BATHROOM FLOOR TILE */			
	this.addStageElement({type:'bathroomTile', x:855, y:634, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:920, y:634, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:985, y:634, w:65, h:65});
	
	this.addStageElement({type:'bathroomTile', x:855, y:699, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:920, y:699, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:985, y:699, w:65, h:65});
	
	this.addStageElement({type:'bathroomTile', x:855, y:764, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:920, y:764, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:985, y:764, w:65, h:65});
	
	this.addStageElement({type:'bathroomTile', x:790, y:829, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:855, y:829, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:920, y:829, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:985, y:829, w:65, h:65});
	
	this.addStageElement({type:'bathroomTile', x:790, y:894, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:855, y:894, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:920, y:894, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:985, y:894, w:65, h:65});
	
	this.addStageElement({type:'bathroomTile', x:790, y:959, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:855, y:959, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:920, y:959, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:985, y:959, w:65, h:65});
	
	this.addStageElement({type:'bathroomTile', x:790, y:1024, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:855, y:1024, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:920, y:1024, w:65, h:65});
	this.addStageElement({type:'bathroomTile', x:985, y:1024, w:65, h:65});
	
	this.addStageElement({type:'bathroomCounterTile', x:1044, y:639, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:1084, y:639, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:1124, y:639, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTileHalf', x:1164, y:639, w:23, h:40});
	this.addStageElement({type:'blueShim', x:1044, y:639, w:2, h:40});
	
	this.addStageElement({type:'bathroomCounterTileHalf', x:1164, y:679, w:23, h:40});
	this.addStageElement({type:'bathroomCounterTileHalf', x:1164, y:719, w:23, h:40});
	this.addStageElement({type:'bathroomCounterTileHalf', x:1164, y:759, w:23, h:40});
	this.addStageElement({type:'bathroomCounterTileHalf', x:1164, y:799, w:23, h:40});
	this.addStageElement({type:'bathroomCounterTileHalf', x:1164, y:839, w:23, h:40});
	this.addStageElement({type:'bathroomCounterTileHalf', x:1164, y:879, w:23, h:40});
	
	
	this.addStageElement({type:'bathroomCounterTile', x:1044, y:903, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:1084, y:903, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:1124, y:903, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTileHalf', x:1164, y:903, w:23, h:40});
	this.addStageElement({type:'blueShim', x:1044, y:903, w:2, h:40});
	
	/* BATHROOM SINK COUNTER */
	this.addStageElement({type:'bathroomCounterTile', x:822, y:655, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:862, y:655, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:822, y:695, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:862, y:695, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:822, y:735, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:862, y:735, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:822, y:775, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:862, y:775, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:822, y:815, w:40, h:40});
	this.addStageElement({type:'bathroomCounterTile', x:862, y:815, w:40, h:40});
	
	
	
	/* TOP WALL*/
	
	this.addStageElement({type:'outerwallCornerInTL', x:0, y:0, w:20, h:20});
	this.addStageElement({type:'outerwallT', x:20, y:0, w:80, h:20});
	this.addStageElement({type:'outerwallT', x:100, y:0, w:100, h:20});
	this.addStageElement({type:'outerwallT', x:200, y:0, w:100, h:20});
	this.addStageElement({type:'outerwallT', x:300, y:0, w:100, h:20});
	this.addStageElement({type:'outerwallT', x:400, y:0, w:100, h:20});
	this.addStageElement({type:'outerwallT', x:500, y:0, w:100, h:20});
	this.addStageElement({type:'outerwallT', x:600, y:0, w:56, h:20}); // this is the problematic tile
	this.addStageElement({type:'outerwallTT', x:656, y:0, w:20, h:20});
	this.addStageElement({type:'innerwallCapDTopWall', x:656, y:20, w:20, h:75});////
	this.addStageElement({type:'outerwallT', x:676, y:0, w:100, h:20});
	this.addStageElement({type:'outerwallCornerInTR', x:776, y:0, w:20, h:20}); 
	
	/* RIGHT WALL*/
	
	
	this.addStageElement({type:'outerwallR', x:776, y:20, w:20, h:80});
	this.addStageElement({type:'outerwallR', x:776, y:100, w:20, h:100});
	this.addStageElement({type:'outerwallCornerOutBL', x:776, y:200, w:20, h:20});
	this.addStageElement({type:'outerwallT', x:796, y:200, w:48, h:20});
	this.addStageElement({type:'outerwallCornerInTR', x:844, y:200, w:20, h:20});
	this.addStageElement({type:'outerwallR', x:844, y:220, w:20, h:80});
	this.addStageElement({type:'outerwallR', x:844, y:300, w:20, h:80});
	this.addStageElement({type:'outerwallR', x:844, y:380, w:20, h:28});
	this.addStageElement({type:'innerwallCapDDoorRightWall', x:572, y:408, w:20, h:56});
	this.addStageElement({type:'innerwallH', x:592, y:408, w:64, h:20});
	this.addStageElement({type:'innerwallTB', x:656, y:408, w:20, h:20});
	this.addStageElement({type:'innerwallCapUClosetWall', x:656, y:343, w:20, h:65});
	this.addStageElement({type:'innerwallH', x:676, y:408, w:48, h:20});
	this.addStageElement({type:'innerwallH', x:724, y:408, w:78, h:20});
	this.addStageElement({type:'innerwallH', x:802, y:408, w:42, h:20});
	this.addStageElement({type:'innerAndOuterwallSplitBR', x:844, y:408, w:20, h:20});
	this.addStageElement({type:'outerwallCapTLEntrance', x:864, y:408, w:54, h:20});
	this.addStageElement({type:'outerwallCapTREntrance', x:1018, y:408, w:86, h:20});
	this.addStageElement({type:'outerwallT', x:1104, y:408, w:28, h:20});
	this.addStageElement({type:'outerwallT', x:1132, y:408, w:48, h:20});
	this.addStageElement({type:'outerwallCornerInTR', x:1180, y:408, w:20, h:20});
	this.addStageElement({type:'outerwallR', x:1180, y:428, w:20, h:50});
	this.addStageElement({type:'windowR', x:1180, y:478, w:20, h:100});
	this.addStageElement({type:'outerwallR', x:1180, y:578, w:20, h:41});
	this.addStageElement({type:'innerwallCapRBathroomRight', x:1019, y:619, w:70, h:20});
	this.addStageElement({type:'innerwallH', x:1089, y:619, w:91, h:20});
	this.addStageElement({type:'outerwallTR', x:1180, y:619, w:20, h:20});
	this.addStageElement({type:'outerwallR', x:1180, y:639, w:20, h:50});
	this.addStageElement({type:'windowR', x:1180, y:689, w:20, h:100});
	this.addStageElement({type:'windowR', x:1180, y:789, w:20, h:100});
	this.addStageElement({type:'outerwallR', x:1180, y:889, w:20, h:45});
	this.addStageElement({type:'innerwallCornerTL', x:1039, y:934, w:20, h:20});
	this.addStageElement({type:'innerwallH', x:1059, y:934, w:54, h:20});
	this.addStageElement({type:'innerwallH', x:1113, y:934, w:67, h:20});
	this.addStageElement({type:'innerAndOuterwallSplitBR', x:1180, y:934, w:20, h:20});
	this.addStageElement({type:'outerwallT', x:1200, y:934, w:32, h:20});
	this.addStageElement({type:'outerwallCornerInTR', x:1232, y:934, w:20, h:20});
	this.addStageElement({type:'outerwallR', x:1232, y:954, w:20, h:100});
	this.addStageElement({type:'outerwallR', x:1232, y:1054, w:20, h:50});
	this.addStageElement({type:'innerwallCapRLivingroomClosetRight', x:1179, y:1104, w:53, h:20});
	this.addStageElement({type:'outerwallTR', x:1232, y:1104, w:20, h:20});
	this.addStageElement({type:'outerwallR', x:1232, y:1124, w:20, h:100});
	this.addStageElement({type:'outerwallR', x:1232, y:1224, w:20, h:73});
	this.addStageElement({type:'windowR', x:1232, y:1297, w:20, h:100});
	this.addStageElement({type:'windowR', x:1232, y:1397, w:20, h:100});
	this.addStageElement({type:'outerwallR', x:1232, y:1497, w:20, h:100});
	this.addStageElement({type:'outerwallR', x:1232, y:1597, w:20, h:71});
	
	
	/* LEFT WALL*/
	this.addStageElement({type:'outerwallL', x:0, y:20, w:20, h:80});
	this.addStageElement({type:'windowL', x:0, y:100, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:200, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:300, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:400, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:500, w:20, h:100});
	this.addStageElement({type:'outerwallL', x:0, y:600, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:700, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:800, w:20, h:100});
	this.addStageElement({type:'outerwallL', x:0, y:900, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:1000, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:1100, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:1200, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:1300, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:1400, w:20, h:100});
	this.addStageElement({type:'windowL', x:0, y:1500, w:20, h:100});
	this.addStageElement({type:'outerwallL', x:0, y:1600, w:20, h:68});
	
	
	
	/* BOTTOM WALL*/
	this.addStageElement({type:'outerwallCornerInBL', x:0, y:1668, w:20, h:20});
	this.addStageElement({type:'outerwallB', x:20, y:1668, w:91, h:20});
	this.addStageElement({type:'windowB', x:111, y:1668, w:100, h:20});
	this.addStageElement({type:'windowB', x:211, y:1668, w:100, h:20});
	this.addStageElement({type:'outerwallB', x:311, y:1668, w:100, h:20});
	this.addStageElement({type:'outerwallB', x:411, y:1668, w:100, h:20});
	this.addStageElement({type:'outerwallB', x:511, y:1668, w:100, h:20});
	this.addStageElement({type:'outerwallB', x:611, y:1668, w:100, h:20});
	this.addStageElement({type:'outerwallB', x:711, y:1668, w:21, h:20});
	this.addStageElement({type:'windowB', x:732, y:1668, w:100, h:20});
	this.addStageElement({type:'windowB', x:832, y:1668, w:100, h:20});
	this.addStageElement({type:'windowB', x:932, y:1668, w:100, h:20});
	this.addStageElement({type:'windowB', x:1032, y:1668, w:100, h:20});
	this.addStageElement({type:'outerwallB', x:1132, y:1668, w:100, h:20});
	this.addStageElement({type:'outerwallCornerInBR', x:1232, y:1668, w:20, h:20});
	
	/* INNER WALL KITCHEN TOP */
	this.addStageElement({type:'innerwallCapRKitchenTop', x:204, y:620, w:28, h:20});
	this.addStageElement({type:'innerwallKitchenTopLeft', x:232, y:600, w:41, h:40});
	this.addStageElement({type:'outerwallT', x:273, y:620, w:63, h:20});
	this.addStageElement({type:'outerwallT', x:336, y:620, w:100, h:20});
	this.addStageElement({type:'outerwallT', x:436, y:620, w:50, h:20});
	this.addStageElement({type:'outerwallT', x:486, y:620, w:66, h:20});
	this.addStageElement({type:'innerwallCapLKitchenTop', x:588, y:620, w:24, h:20});
	this.addStageElement({type:'outerwallB', x:273, y:600, w:63, h:20});
	this.addStageElement({type:'outerwallB', x:336, y:600, w:100, h:20});
	this.addStageElement({type:'outerwallB', x:436, y:600, w:50, h:20});
	this.addStageElement({type:'outerwallB', x:486, y:600, w:66, h:20});
	this.addStageElement({type:'innerwallKitchenTopRight', x:552, y:600, w:40, h:40});
	this.addStageElement({type:'innerwallCapUKitchenTop', x:572, y:564, w:20, h:36});////
	this.addStageElement({type:'innerwallV', x:572, y:640, w:20, h:71});
	this.addStageElement({type:'innerwallCapD', x:572, y:711, w:20, h:20});////
	
	/* INNER WALL KITCHEN SIDE */
	this.addStageElement({type:'innerwallCapRKitchenSide', x:510, y:1084, w:63, h:20});
	this.addStageElement({type:'innerwallTB', x:572, y:1084, w:20, h:20});
	this.addStageElement({type:'innerwallCapLKitchenSide', x:591, y:1084, w:31, h:20});
	this.addStageElement({type:'innerwallV', x:572, y:988, w:20, h:96});
	this.addStageElement({type:'innerwallV', x:572, y:944, w:20, h:44});
	this.addStageElement({type:'innerwallV', x:572, y:868, w:20, h:76});
	this.addStageElement({type:'innerwallCapU', x:572, y:858, w:20, h:20});////
	
	
	/* BATHROOM WALL BOTTOM */ //innerwallBathroomBottomRight
	this.addStageElement({type:'innerwallBathroomBottomLeft', x:775, y:1084, w:65, h:40});
	this.addStageElement({type:'outerwallT', x:840, y:1104, w:39, h:20});
	this.addStageElement({type:'outerwallT', x:879, y:1104, w:90, h:20});
	this.addStageElement({type:'outerwallT', x:969, y:1104, w:41, h:20});
	this.addStageElement({type:'innerwallBathroomBottomRight', x:1010, y:1084, w:49, h:40});
	this.addStageElement({type:'innerwallCapL', x:1059, y:1104, w:20, h:20});////
	this.addStageElement({type:'innerwallCapRBathroomBottom', x:747, y:1084, w:28, h:20});////
	this.addStageElement({type:'outerwallB', x:840, y:1084, w:39, h:20});
	this.addStageElement({type:'outerwallB', x:879, y:1084, w:90, h:20});
	this.addStageElement({type:'outerwallB', x:969, y:1084, w:41, h:20});
	this.addStageElement({type:'innerwallV', x:1039, y:990, w:20, h:94});
	this.addStageElement({type:'innerwallV', x:1039, y:954, w:20, h:36});
	this.addStageElement({type:'innerwallCapU', x:775, y:1062, w:20, h:22});////
	
	/* BATHROOM WALL TOP(BOTTOM) */
	this.addStageElement({type:'innerwallCapUBathroomBottom1', x:755, y:816, w:20, h:62});////
	this.addStageElement({type:'innerwallTT', x:775, y:858, w:20, h:20});
	this.addStageElement({type:'innerwallH', x:795, y:858, w:7, h:20});
	this.addStageElement({type:'innerwallCapUBathroomBottom2', x:802, y:788, w:20, h:90});
	this.addStageElement({type:'innerwallCapDBathroomBottom', x:775, y:878, w:20, h:84});
	
	/* BATHROOM WALL TOP(TOP) */
	this.addStageElement({type:'innerwallCapDBathroomTop1', x:755, y:639, w:20, h:65});
	this.addStageElement({type:'innerwallCapRBathroomTop', x:732, y:619, w:23, h:20});
	this.addStageElement({type:'innerwallTT', x:755, y:619, w:20, h:20});
	this.addStageElement({type:'innerwallH', x:775, y:619, w:27, h:20});
	this.addStageElement({type:'innerwallBathroomTopRight1', x:802, y:619, w:20, h:36});
	this.addStageElement({type:'innerwallCapDBathroomTop2', x:802, y:654, w:20, h:79});
	this.addStageElement({type:'innerwallBathroomTopRight2', x:822, y:599, w:60, h:56});
	this.addStageElement({type:'innerwallCapLBathroomTop', x:880, y:619, w:38, h:20});
	
	
	
	
	
	
	
	/* FURNITURE*/
	
	/* BEDROOM */
	this.addStageElement({type:'bed1', x:280, y:20, w:100, h:80});
	this.addStageElement({type:'bed2', x:380, y:20, w:100, h:80});
	this.addStageElement({type:'bed3', x:280, y:100, w:100, h:100});
	this.addStageElement({type:'bed4', x:380, y:100, w:100, h:100});
	this.addStageElement({type:'bed5', x:280, y:200, w:100, h:100});
	this.addStageElement({type:'bed6', x:380, y:200, w:100, h:100});
	this.addStageElement({type:'blueChair', x:30, y:180, w:90, h:76});
	//this.addStageElement({type:'livingroomPlant', x:25, y:100, w:71, h:75});
	this.addStageElement({type:'bedroomDresserLeft', x:330, y:528, w:100, h:72});
	this.addStageElement({type:'bedroomDresserRight', x:430, y:528, w:34, h:72});
	this.addStageElement({type:'garbageCan', x:286, y:548, w:40, h:40});
	this.addStageElement({type:'hamper', x:678, y:19, w:96, h:74});
	
	
	
	
	/* KITCHEN*/
	
	this.addStageElement({type:'barStoolHorz', x:160, y:670, w:61, h:53, moveObject:{x:0, y:0, xMax:0, yMax:0, up:false, down:false, left:false, right:false}});
	this.addStageElement({type:'barStoolHorz', x:160, y:740, w:61, h:53, moveObject:{x:0, y:0, xMax:0, yMax:0, up:false, down:false, left:false, right:false}});
	this.addStageElement({type:'barStoolHorz', x:160, y:810, w:61, h:53, moveObject:{x:0, y:0, xMax:0, yMax:0, up:false, down:false, left:false, right:false}});
	
	
	
	this.addStageElement({type:'marbleThinShim', x:222, y:640, w:28, h:20});
	this.addStageElement({type:'marbleThin', x:222, y:660, w:28, h:50});
	this.addStageElement({type:'marbleThin', x:222, y:710, w:28, h:50});
	this.addStageElement({type:'marbleThin', x:222, y:760, w:28, h:50});
	this.addStageElement({type:'marbleThin', x:222, y:810, w:28, h:50});
	this.addStageElement({type:'marbleThin', x:222, y:860, w:28, h:50});
	this.addStageElement({type:'marbleFull', x:252, y:640, w:80, h:80});
	this.addStageElement({type:'marbleFull', x:252, y:720, w:80, h:80});
	this.addStageElement({type:'marbleFull', x:252, y:800, w:80, h:80});
	this.addStageElement({type:'marbleFullHalf', x:252, y:880, w:80, h:30});
	this.addStageElement({type:'marbleFull', x:332, y:640, w:80, h:80});
	this.addStageElement({type:'marbleFull', x:412, y:640, w:80, h:80});
	this.addStageElement({type:'marbleFull', x:492, y:640, w:80, h:80});
	this.addStageElement({type:'marbleThinDouble', x:222, y:910, w:56, h:50});
	this.addStageElement({type:'marbleThinDouble', x:278, y:910, w:56, h:50});
	this.addStageElement({type:'greyShim', x:250, y:640, w:2, h:270});
	this.addStageElement({type:'greyShim', x:250, y:910, w:84, h:2});
	this.addStageElement({type:'kitchenSinkRight', x:260, y:744, w:70, h:58});
	this.addStageElement({type:'kitchenSinkLeft', x:260, y:802, w:70, h:64});
	
	
	
	this.addStageElement({type:'kitchenMat1', x:358, y:750, w:49, h:50});
	this.addStageElement({type:'kitchenMat2', x:407, y:750, w:49, h:50});
	this.addStageElement({type:'kitchenMat3', x:358, y:800, w:49, h:50});
	this.addStageElement({type:'kitchenMat4', x:407, y:800, w:25, h:25});
	this.addStageElement({type:'kitchenMat5', x:432, y:800, w:24, h:25});
	this.addStageElement({type:'kitchenMat6', x:407, y:825, w:25, h:25});
	
	
	
	/* BATHROOM FIXTURES */
	this.addStageElement({type:'bathtub1', x:1050, y:679, w:100, h:100});
	this.addStageElement({type:'bathtub2', x:1150, y:679, w:24, h:100});
	this.addStageElement({type:'bathtub3', x:1050, y:779, w:100, h:100});
	this.addStageElement({type:'bathtub4', x:1150, y:779, w:24, h:100});
	this.addStageElement({type:'bathtub5', x:1050, y:879, w:100, h:24});
	this.addStageElement({type:'bathtub6', x:1150, y:879, w:24, h:24});
	
	this.addStageElement({type:'toiletBack', x:927, y:1056, w:62, h:28});
	
	
	this.addStageElement({type:'garbageCan', x:798, y:885, w:40, h:40}); 
	
	/* LIVING ROOM */
	this.addStageElement({type:'livingroomRug', x:725, y:1235, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:775, y:1235, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:825, y:1235, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:875, y:1235, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:925, y:1235, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:975, y:1235, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1025, y:1235, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1075, y:1235, w:50, h:50});
	
	this.addStageElement({type:'livingroomRug', x:725, y:1285, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:775, y:1285, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:825, y:1285, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:875, y:1285, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:925, y:1285, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:975, y:1285, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1025, y:1285, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1075, y:1285, w:50, h:50});
	
	this.addStageElement({type:'livingroomRug', x:725, y:1335, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:775, y:1335, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:825, y:1335, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:875, y:1335, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:925, y:1335, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:975, y:1335, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1025, y:1335, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1075, y:1335, w:50, h:50});
	
	this.addStageElement({type:'livingroomRug', x:725, y:1385, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:775, y:1385, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:825, y:1385, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:875, y:1385, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:925, y:1385, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:975, y:1385, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1025, y:1385, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1075, y:1385, w:50, h:50});
	
	this.addStageElement({type:'livingroomRug', x:725, y:1435, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:775, y:1435, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:825, y:1435, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:875, y:1435, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:925, y:1435, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:975, y:1435, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1025, y:1435, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1075, y:1435, w:50, h:50});
	
	this.addStageElement({type:'livingroomRug', x:725, y:1485, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:775, y:1485, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:825, y:1485, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:875, y:1485, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:925, y:1485, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:975, y:1485, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1025, y:1485, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1075, y:1485, w:50, h:50});
	
	this.addStageElement({type:'livingroomRug', x:725, y:1535, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:775, y:1535, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:825, y:1535, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:875, y:1535, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:925, y:1535, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:975, y:1535, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1025, y:1535, w:50, h:50});
	this.addStageElement({type:'livingroomRug', x:1075, y:1535, w:50, h:50});
	
	
	this.addStageElement({type:'livingroomPlant', x:770, y:1125, w:71, h:75});
	this.addStageElement({type:'coffeeTableLeft', x:856, y:1340, w:100, h:82});
	this.addStageElement({type:'coffeeTableRight', x:956, y:1340, w:57, h:82});
	
	this.addStageElement({type:'sofa1', x:784, y:1525, w:100, h:100});
	this.addStageElement({type:'sofa2', x:884, y:1525, w:100, h:100});
	this.addStageElement({type:'sofa3', x:984, y:1525, w:98, h:100});
	this.addStageElement({type:'sofa4', x:784, y:1625, w:100, h:35});
	this.addStageElement({type:'sofa5', x:884, y:1625, w:100, h:35});
	this.addStageElement({type:'sofa6', x:984, y:1625, w:98, h:35});
	
	this.addStageElement({type:'roundChair1', x:645, y:1326, w:55, h:55});
	this.addStageElement({type:'roundChair2', x:700, y:1326, w:52, h:55});
	this.addStageElement({type:'roundChair3', x:645, y:1381, w:55, h:55});
	this.addStageElement({type:'roundChair4', x:700, y:1381, w:52, h:55});
	
	this.addStageElement({type:'livingroomPlant', x:617, y:1460, w:71, h:75});
	
	
	this.addStageElement({type:'sofaEndTable1Plug', x:700, y:1635, w:6, h:33});
	this.addStageElement({type:'sofaEndTable1Plug', x:1139, y:1635, w:6, h:33});
	
	
	/* OFFICE */
	this.addStageElement({type:'bookcase1', x:544, y:1371, w:76, h:37});
	this.addStageElement({type:'bookcase2', x:544, y:1408, w:40, h:92});
	this.addStageElement({type:'bookcase3', x:584, y:1408, w:36, h:92});
	this.addStageElement({type:'bookcase4', x:544, y:1500, w:76, h:100});
	this.addStageElement({type:'bookcase5', x:544, y:1600, w:76, h:68});
	this.addStageElement({type:'bookcase6', x:379, y:1609, w:94, h:59});
	this.addStageElement({type:'bookcase7', x:473, y:1609, w:71, h:59});
	
	this.addStageElement({type:'tvTableLeft', x:844, y:1124, w:100, h:84});
	this.addStageElement({type:'tvTableRight', x:944, y:1124, w:84, h:84});
	this.addStageElement({type:'tvBack', x:889, y:1137, w:94, h:21});
	this.addStageElement({type:'bookInBookcase', x:542, y:1424, w:10, h:7, IDOverride:"bookInBookcase"});
	this.addStageElement({type:'dropTarget', x:680, y:40, w:90, h:75, IDOverride:"hamper", dropTargetFunction:"dropTargetHamper"});
	this.addStageElement({type:'dropTarget', x:520, y:1410, w:47, h:57, IDOverride:"bookcase", dropTargetFunction:"dropTargetBookcase"});
	
	this.addStageElement({type:'deskChair1', x:210, y:1531, w:66, h:70});
	this.addStageElement({type:'deskChair2', x:210, y:1357, w:68, h:67});
	this.addStageElement({type:'desk1', x:116, y:1428, w:94, h:80});
	this.addStageElement({type:'desk2', x:116, y:1508, w:94, h:24});
	this.addStageElement({type:'desk3', x:210, y:1428, w:85, h:80});
	this.addStageElement({type:'desk4', x:210, y:1508, w:85, h:23});
	this.addStageElement({type:'desk6', x:295, y:1508, w:80, h:24});
	this.addStageElement({type:'livingroomPlant', x:30, y:1590, w:71, h:75});
	
	
	
	/* THIS MUST BE IN BETWEEN ALL ITEMS THAT ARE MERELY OBSTACLES AND THOSE THAT CAN BE INTERACTED WITH AS IT WILL CATCH ALL TOUCH INPUT*/
	//	this.addStageElement({type:'interactButton', x:0, y:0, w:this.getStageWidth(), h:this.getStageHeight(), IDOverride:"swipeInterface"});
	
	
	
	
	
	
	/* INTERACTIVE ITEMS */
	/* DOORS */
	
	// from hall to bedroom
	this.addStageElement({type:'door0Deg', x:571, y:464, w:22, h:100, listener:'tile' + (this._lastBuildNum + 2), state:true});
	this.addStageElement({type:'door90Deg', x:477, y:550, w:100, h:22, listener:'tile' + this._lastBuildNum, state:false});
	
	// from hall to bathroom top
	this.addStageElement({type:'door90Deg', x:918, y:618, w:100, h:22, listener:'tile' + (this._lastBuildNum + 2), state:false});
	this.addStageElement({type:'door180Deg', x:1001, y:630, w:22, h:100, listener:'tile' + this._lastBuildNum, state:true});
	
	// from hall to bathroom bottom
	this.addStageElement({type:'door0Deg', x:774, y:962, w:22, h:100, listener:'tile' + (this._lastBuildNum + 2), state:true});
	this.addStageElement({type:'door270Deg', x:788, y:1046, w:100, h:22, listener:'tile' + this._lastBuildNum, state:false});
	
	// from hall to outside
	this.addStageElement({type:'door90Deg', x:918, y:407, w:100, h:22, listener:'tile' + (this._lastBuildNum + 2), state:true, thoughtType:'frontDoor',objectType:"immobile"});
	this.addStageElement({type:'door0Deg', x:1001, y:312, w:22, h:100, listener:'tile' + this._lastBuildNum, state:false, thoughtType:'frontDoor', objectType:"immobile"});		
	
	// closet in living room
	this.addStageElement({type:'door90Deg', x:1079, y:1103, w:100, h:22, listener:'tile' + (this._lastBuildNum + 2), state:true});
	this.addStageElement({type:'door180Deg', x:1162, y:1113, w:22, h:100, listener:'tile' + this._lastBuildNum, state:false});
	
	// hinged door top
	this.addStageElement({type:'hingedDoorOpenTop', x:607, y:96, w:64, h:54, listener1:'tile' + (this._lastBuildNum + 2), listener2:'tile' + (this._lastBuildNum + 3), state:true});
	this.addStageElement({type:'hingedDoorClosedTop1', x:660, y:95, w:10, h:62, state:false});
	this.addStageElement({type:'hingedDoorClosedTop2', x:654, y:157, w:22, h:62, listener1:'tile' + (this._lastBuildNum - 1), listener2:'tile' + this._lastBuildNum, state:false});
	
	// hinged door bottom
	this.addStageElement({type:'hingedDoorOpenBottom', x:607, y:289, w:64, h:54, listener1:'tile' + (this._lastBuildNum + 2), listener2:'tile' + (this._lastBuildNum + 3), state:false});
	this.addStageElement({type:'hingedDoorClosedBottom1', x:660, y:281, w:10, h:62, state:true});
	this.addStageElement({type:'hingedDoorClosedBottom2', x:654, y:219, w:22, h:62, listener1:'tile' + (this._lastBuildNum - 1), listener2:'tile' + this._lastBuildNum, state:true});
	
	
	/* BEDROOM */
	this.addStageElement({type:'nightstand', x:190, y:20, w:80, h:60});
	this.addStageElement({type:'plug', x:150, y:20, w:40, h:10, listener:'tile' + this._lastBuildNum, thoughtType:'lampBR', objectType:"immobile"});
	this.addStageElement({type:'bedroomCandle', x:334, y:535, w:28, h:28, thoughtType:'candle', objectType:"immobile"}); //, startFrame:1
	/* KITCHEN */
	this.addStageElement({type:'range', x:360, y:650, w:100, h:66});
	this.addStageElement({type:'rangeController', x:360, y:720, w:100, h:12,listener:'tile' + this._lastBuildNum, thoughtType:'kitchenRange', objectType:"immobile"});
	this.addStageElement({type:'kitchenMat7', x:432, y:825, w:24, h:25, thoughtType:'matCorner', objectType:"immobile"});
	this.addStageElement({type:'kitchenSinkWater', x:270, y:810, w:50, h:46, thoughtType:'kitchenSink', objectType:"immobile"});
	this.addStageElement({type:'barStoolHorz', x:160, y:916, w:61, h:53, moveObject:{x:5, y:5, xMax:0, yMax:0, xMin:0, yMin:-35, up:true, down:false, left:false, right:false},thoughtType:'chairBar', objectType:"mobile"});
	
	this.addStageElement({type:'kitchenTableBase', x:222, y:1119, w:102, h:79});
	this.addStageElement({type:'kitchenChairDown', x:243, y:1065, w:60, h:78});
	this.addStageElement({type:'kitchenChairUp', x:243, y:1173, w:60, h:78});
	this.addStageElement({type:'kitchenChairRight', x:112, y:1137, w:78, h:60, moveObject:{x:4, y:4, xMax:20, yMax:20, xMin:-10, yMin:-30, up:true, down:true, left:true, right:true},thoughtType:'chairTable', objectType:"mobile"});
	this.addStageElement({type:'kitchenChairLeft', x:387, y:1121, w:78, h:60, moveObject:{x:4, y:4, xMax:24, yMax:20, xMin:-52, yMin:-30, up:true, down:true, left:true, right:true},thoughtType:'chairTable', objectType:"mobile"});
	this.addStageElement({type:'kitchenTable1', x:165, y:1098, w:70, h:60});
	this.addStageElement({type:'kitchenTable2', x:235, y:1098, w:75, h:60});
	this.addStageElement({type:'kitchenTable3', x:310, y:1098, w:70, h:60});
	this.addStageElement({type:'kitchenTable4', x:165, y:1158, w:70, h:60});
	this.addStageElement({type:'kitchenTable5', x:235, y:1158, w:75, h:60});	this.addStageElement({type:'kitchenTable6', x:310, y:1158, w:70, h:60});
	//this.addStageElement({type:'kitchenSinkController', x:322, y:810, w:10, h:46,listener:'tile' + this._lastBuildNum, thoughtType:'range'});
	/* LIVING ROOM */
	this.addStageElement({type:'tvFront', x:880, y:1158, w:112, h:11, thoughtType:'tv', objectType:"immobile"});
	this.addStageElement({type:'tvRemote', x:982, y:1179, w:30, h:30 ,listener:'tile' + this._lastBuildNum, thoughtType:'tv', objectType:"sticky", stickyHoldingOffset:{0:[-3,1], 90:[-2,6], 180:[3,-1], 270:[-8,3]}});//x:982, y:1179
	this.addStageElement({type:'sofaEndTable1Interact', x:662, y:1537, w:98, h:98, thoughtType:'lampLR', objectType:"immobile"});
	this.addStageElement({type:'sofaEndTable1Interact', x:1100, y:1537, w:98, h:98, thoughtType:'lampLR', objectType:"immobile"});
	/* OFFICE */
	this.addStageElement({type:'desk5', x:295, y:1428, w:80, h:80, thoughtType:'lampOffice', objectType:"immobile"});
	
	
	this.addStageElement({type:'sock', x:520, y:200, w:30, h:30,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]},thoughtType:'sock', objectType:"sticky"});//w:19, h:24
	this.addStageElement({type:'sock', x:560, y:300, w:30, h:30,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]},thoughtType:'sock', objectType:"sticky"});//w:19, h:24
	this.addStageElement({type:'pants', x:510, y:30, w:46, h:37,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]},thoughtType:'pant', objectType:"sticky"});//w:19, h:24
	this.addStageElement({type:'underwear', x:718, y:247, w:48, h:25,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]},thoughtType:'underwear', objectType:"sticky"});//w:19, h:24
	this.addStageElement({type:'shirt', x:200, y:117, w:66, h:39,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]},thoughtType:'shirt', objectType:"sticky"});//w:19, h:24
	this.addStageElement({type:'book', x:108, y:1480, w:39, h:39,stickyHoldingOffset:{0:[-20,-10], 90:[20,-10], 180:[20,10], 270:[-20,10]},thoughtType:'bookOffice', objectType:"sticky"});//x:187, y:1460
	
	this.addStageElement({type:'bathWater', x:1065, y:693, w:96, h:200});
	this.addStageElement({type:'bathWaterTrigger', x:1065, y:703, w:30, h:80,listener:'tile' + this._lastBuildNum, thoughtType:'bathtub', objectType:"immobile"});
	this.addStageElement({type:'bathroomTubFaucet', x:1098, y:668, w:36, h:28});
	
	this.addStageElement({type:'bathroomSink', x:839, y:725, w:39, h:71});
	this.addStageElement({type:'bathWaterTrigger', x:870, y:743, w:30, h:342,listener:'tile' + this._lastBuildNum, thoughtType:'bathSink', objectType:"immobile"});
	this.addStageElement({type:'bathroomSinkFixtures', x:802, y:733, w:49, h:55}); 
	
	this.addStageElement({type:'toilet', x:928, y:988, w:56, h:68, thoughtType:'toilet', objectType:"immobile"});
	
	/* THIS MUST BE IN BETWEEN ALL ITEMS THAT ARE MERELY OBSTACLES AND THOSE THAT CAN BE INTERACTED WITH AS IT WILL CATCH ALL TOUCH INPUT*/
	this.addStageElement({type:'interactButton', x:0, y:0, w:this.getStageWidth(), h:this.getStageHeight(), IDOverride:"swipeInterface"});
			
},

generateThoughtElements:function (){
	/* THOUGHT ANIMATIONS*/
	this.addThoughtElement({name:'candle', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "candleThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'lampBR', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "lampBRThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'lampOffice', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "lampOfficeThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'bookOffice', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "bookOfficeThought/animation", frameType:".gif", className:"animationSequence"});
	this.addThoughtElement({name:'chairBar', x:8, y:8, w:157, h:116, frameCount:6, frameRoot:this._directory + "chairBarThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'chairTable', x:8, y:8, w:157, h:116, frameCount:4, frameRoot:this._directory + "chairTableThought/animation", frameType:".gif", className:"animationSequence"});
	this.addThoughtElement({name:'matCorner', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "matCornerThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'kitchenSink', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "kitchenSinkThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'kitchenRange', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "kitchenRangeThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'frontDoor', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "frontDoorThought/animation", frameType:".gif", className:"animationSequence"});
	this.addThoughtElement({name:'tv', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "tvThought/animation", frameType:".gif", className:"animationSequence"});
	this.addThoughtElement({name:'lampLR', x:8, y:8, w:157, h:116, frameCount:4, frameRoot:this._directory + "lampLRThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'toilet', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "toiletThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'bathtub', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "bathtubThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'bathSink', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "bathSinkThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'sock', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "sockThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'underwear', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "underwearThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'shirt', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "shirtThought/animation", frameType:".gif", className:"animationSequence"}); //complete
	this.addThoughtElement({name:'pant', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:this._directory + "pantThought/animation", frameType:".gif", className:"animationSequence"}); //complete
},

setGameboardClasses:function(){
//Lookup table for classes associated with parts of the gameBoard
	this._gameBoardClasses = {
		player:"player", 
		thoughtBubble:"thoughtBubble", 
		featheredMask:"mask",
		outerwallL:"obstacle", 
		outerwallR:"obstacle", 
		outerwallB:"obstacle", 
		outerwallT:"obstacle",
		outerwallTL:"obstacle", 
		outerwallTR:"obstacle", 
		outerwallTB:"obstacle", 
		outerwallTT:"obstacle",
		innerwallTB:"obstacle",	
		innerwallTL:"obstacle",
		innerwallTR:"obstacle",
		innerwallTT:"obstacle",  
		innerwallCapL:"obstacle",
		innerwallCapU:"obstacle",
		innerwallCapR:"obstacle",
		innerwallCapD:"obstacle",
		innerwallCapDTopWall:"obstacle",
		innerwallCapDDoorRightWall:"obstacle",
		innerwallCapDBathroomBottom:"obstacle",
		innerwallCapDBathroomTop1:"obstacle",
		innerwallCapDBathroomTop2:"obstacle",
		innerwallCapLKitchenTop:"obstacle",
		innerwallCapLKitchenSide:"obstacle",
		innerwallCapLBathroomTop:"obstacle",
		innerwallCapRKitchenTop:"obstacle",
		innerwallCapRKitchenSide:"obstacle",
		innerwallCapRBathroomBottom:"obstacle",
		innerwallCapRBathroomRight:"obstacle",
		innerwallCapRBathroomTop:"obstacle",
		innerwallCapRLivingroomClosetRight:"obstacle",
		innerwallCapUBathroomBottom1:"obstacle",
		innerwallCapUBathroomBottom2:"obstacle",
		innerwallCapUClosetWall:"obstacle",
		innerwallCapUKitchenTop:"obstacle",
		innerwallKitchenTopLeft:"obstacle",
		innerwallKitchenTopRight:"obstacle",
		innerwallBathroomBottomLeft:"obstacle",		
		innerwallBathroomBottomRight:"obstacle",
		innerwallBathroomTopRight1:"obstacle",
		innerwallBathroomTopRight2:"obstacle",
		outerwallCornerOutBL:"obstacle",
		outerwallCornerOutBR:"obstacle",
		outerwallCornerOutTL:"obstacle",
		outerwallCornerOutTR:"obstacle",
		outerwallCornerInBL:"obstacle",
		outerwallCornerInBR:"obstacle",
		outerwallCornerInTL:"obstacle",
		outerwallCornerInTR:"obstacle",
		outerwallCapBL:"obstacle",
		outerwallCapBR:"obstacle",
		outerwallCapTL:"obstacle",
		outerwallCapTR:"obstacle",
		outerwallCapTLEntrance:"obstacle",
		outerwallCapTREntrance:"obstacle",
		innerwallCornerBL:"obstacle",
		innerwallCornerBR:"obstacle",
		innerwallCornerTL:"obstacle",
		innerwallCornerTR:"obstacle",
		innerwallH:"obstacle",
		innerwallV:"obstacle",
		windowL:"obstacle",
		windowT:"obstacle",
		windowR:"obstacle",
		windowB:"obstacle",
		innerAndOuterwallSplitTL:"obstacle",			
		innerAndOuterwallSplitTR:"obstacle",
		innerAndOuterwallSplitBL:"obstacle",
		innerAndOuterwallSplitBR:"obstacle",
		door0Deg:"obstacle interactive door",
		door90Deg:"obstacle interactive door",
		door180Deg:"obstacle interactive door",
		door270Deg:"obstacle interactive door",
		nightstand:"obstacle OnOffTile",
		plug:"obstacle interactive OnOffTileController",
		bed1:"obstacle",
		bed2:"obstacle",
		bed3:"obstacle",
		bed4:"obstacle",
		bed5:"obstacle",
		bed6:"obstacle",
		blueChair:"obstacle",
		bedroomDresserLeft:"obstacle",
		bedroomDresserRight:"obstacle",
		bedroomCandle:"obstacle interactive OnOffTile",
		garbageCan:"obstacle",
		marbleThin:"obstacle",
		marbleThinDouble:"obstacle",
		marbleThinShim:"obstacle",
		marbleFull:"obstacle",
		marbleFullHalf:"obstacle",
		greyShim:"tile",
		blueShim:"tile",
		range:"obstacle OnOffTile",				
		rangeController:"obstacle interactive OnOffTileController",
		kitchenSinkRight:"obstacle",
		kitchenSinkLeft:"obstacle",
		kitchenSinkWater:"obstacle interactive OnOffTile",
		kitchenSinkController:"obstacle interactive OnOffTileController",
		bathroomTile:"tile",
		bathroomCounterTile:"obstacle",
		bathroomCounterTileHalf:"obstacle",
		bathroomTubFaucet:"obstacle",
		bathtub1:"obstacle",
		bathtub2:"obstacle",
		bathtub3:"obstacle",
		bathtub4:"obstacle",
		bathtub5:"obstacle",
		bathtub6:"obstacle",
		bathroomSink:"obstacle interactive OnOffTile",
		bathroomSinkFixtures:"tile",
		toilet:"obstacle interactive OnOffTile",
		toiletBack:"tile",
		kitchenMat1:"tile",
		kitchenMat2:"tile",
		kitchenMat3:"tile",
		kitchenMat4:"tile",
		kitchenMat5:"tile",
		kitchenMat6:"tile",
		kitchenMat7:"interactive OnOffTile",
		sock:"interactive sticky",
		tvTableLeft:"obstacle",					
		tvTableRight:"obstacle",
		tvBack:"obstacle",
		tvFront:"obstacle OnOffTile",
		tvRemote:"interactive sticky",
		livingroomPlant:"obstacle",
		livingroomRug:"tile",
		coffeeTableLeft:"obstacle",
		coffeeTableRight:"obstacle",
		sofa1:"obstacle",
		sofa2:"obstacle",
		sofa3:"obstacle",
		sofa4:"obstacle",
		sofa5:"obstacle",
		sofa6:"obstacle",
		interactButton:"mobileControl",
		grass:"grass",
		dropTarget:"dropTarget interactive",
		bookcase1:"obstacle",
		bookcase2:"obstacle",
		bookcase3:"obstacle",
		bookcase4:"obstacle",
		bookcase5:"obstacle",
		bookcase6:"obstacle",
		bookcase7:"obstacle",
		book:"interactive sticky",
		bookInBookcase:"targetRevealed interactive",
		hamper:"obstacle interactive OnOffTile",
		underwear:"interactive sticky",						
		pants:"interactive sticky",
		shirt:"interactive sticky",
		desk1:"obstacle",
		desk2:"obstacle",
		desk3:"obstacle",
		desk4:"obstacle",
		desk5:"obstacle interactive OnOffTile",
		desk6:"obstacle",
		deskChair1:"obstacle",
		deskChair2:"obstacle",
		sofaEndTable1Interact:"obstacle interactive OnOffTile",
		sofaEndTable1Plug:"tile",
		barStoolHorz:"obstacle interactive movable",//movable
		barStoolVert:"obstacle",
		kitchenTable1:"obstacle overMobileButton",
		kitchenTable2:"obstacle overMobileButton",
		kitchenTable3:"obstacle overMobileButton",
		kitchenTable4:"obstacle overMobileButton",
		kitchenTable5:"obstacle overMobileButton",
		kitchenTable6:"obstacle overMobileButton",
		kitchenTableBase:"tile overMobileButton",
		kitchenChairUp:"obstacle overMobileButton",
		kitchenChairRight:"obstacle interactive movable",
		kitchenChairDown:"obstacle overMobileButton",
		kitchenChairLeft:"obstacle interactive movable",
		hingedDoorOpenTop:"obstacle interactive hingedActive",
		hingedDoorClosedTop1:"obstacle interactive hingedInactive",
		hingedDoorClosedTop2:"obstacle interactive hingedActive",							
		hingedDoorOpenBottom:"obstacle interactive hingedActive",
		hingedDoorClosedBottom1:"obstacle interactive hingedInactive",
		hingedDoorClosedBottom2:"obstacle interactive hingedActive",
		bathWater:"obstacle OnOffTile bathWater",
		bathWaterTrigger:"obstacle interactive OnOffTileController",
		roundChair1:"obstacle",
		roundChair2:"obstacle",
		roundChair3:"obstacle",
		roundChair4:"obstacle",
		logo:"tile",
		startButton:"button",
		instructionsButton:"button",
		disclaimerButton:"button",
		trademark:"tile",
		instructionImages:"tile",
		instructionButtonBack:"button",
		instructionButtonForward:"button",
		menuClose:"button",
		disclaimerImage:"tile",
		volumeControl:"button",
		sidewalk:"sidewalk",
		exitGameBlocker:"obstacle",
		finishText:"tile",
		dirt:"dirt",
		shrubbery:"obstacle shrubbery",
		loading:"tile",
		endScreenGood:"tile",
		endScreenBad:"tile",
		rotateScreen:"tile",
		endScreenGoodButton:"button",
		endScreenBadButton:"button"
								
	};
},

setGameboardImageLookup:function(){
	this._gameBoardImageLookup = {
		player:[this._directory + "playerStill.png",this._directory + "playerWalk1.png",this._directory + "playerWalk2.png",this._directory + "playerWalk3.png",this._directory + "playerWalk4.png",this._directory + "playerTurn90.png",this._directory + "playerTurn270.png",this._directory + "playerInteract.png"], 
		thoughtBubble:this._directory + "thoughts.gif",
		featheredMask:this._directory + "featheredMask.png",
		outerwallL:this._directory + "outerwallL.gif", 
		outerwallR:this._directory + "outerwallR.gif", 
		outerwallB:this._directory + "outerwallB.gif", 
		outerwallT:this._directory + "outerwallT.gif", 
		outerwallTL:this._directory + "outerwallTL.gif",  
		outerwallTR:this._directory + "outerwallTR.gif",  
		outerwallTB:this._directory + "outerwallTB.gif", 
		outerwallTT:this._directory + "outerwallTT.gif", 
		innerwallTB:this._directory + "innerwallTB.gif",
		innerwallTL:this._directory + "innerwallTL.gif",
		innerwallTR:this._directory + "innerwallTR.gif",
		innerwallTT:this._directory + "innerwallTT.gif",
		innerwallCapL:this._directory + "innerwallCapL.gif",
		innerwallCapU:this._directory + "innerwallCapU.gif",
		innerwallCapR:this._directory + "innerwallCapR.gif",
		innerwallCapD:this._directory + "innerwallCapD.gif",
		innerwallCapDTopWall:this._directory + "innerwallCapDTopWall.gif",
		innerwallCapDDoorRightWall:this._directory + "innerwallCapDDoorRightWall.gif",
		innerwallCapDBathroomBottom:this._directory + "innerwallCapDBathroomBottom.gif",
		innerwallCapDBathroomTop1:this._directory + "innerwallCapDBathroomTop1.gif",
		innerwallCapDBathroomTop2:this._directory + "innerwallCapDBathroomTop2.gif",
		innerwallCapLKitchenTop:this._directory + "innerwallCapLKitchenTop.gif",
		innerwallCapLKitchenSide:this._directory + "innerwallCapLKitchenSide.gif",
		innerwallCapLBathroomTop:this._directory + "innerwallCapLBathroomTop.gif",
		innerwallCapRKitchenTop:this._directory + "innerwallCapRKitchenTop.gif",
		innerwallCapRKitchenSide:this._directory + "innerwallCapRKitchenSide.gif",
		innerwallCapRBathroomBottom:this._directory + "innerwallCapRBathroomBottom.gif",
		innerwallCapRBathroomRight:this._directory + "innerwallCapRBathroomRight.gif",
		innerwallCapRBathroomTop:this._directory + "innerwallCapRBathroomTop.gif",
		innerwallCapRLivingroomClosetRight:this._directory + "innerwallCapRLivingroomClosetRight.gif",
		innerwallCapUBathroomBottom1:this._directory + "innerwallCapUBathroomBottom1.gif",
		innerwallCapUBathroomBottom2:this._directory + "innerwallCapUBathroomBottom2.gif",
		innerwallCapUClosetWall:this._directory + "innerwallCapUClosetWall.gif",
		innerwallCapUKitchenTop:this._directory + "innerwallCapUKitchenTop.gif",
		innerwallKitchenTopLeft:this._directory + "innerwallKitchenTopLeft.gif",
		innerwallKitchenTopRight:this._directory + "innerwallKitchenTopRight.gif",
		innerwallBathroomBottomLeft:this._directory + "innerwallBathroomBottomLeft.gif",
		innerwallBathroomBottomRight:this._directory + "innerwallBathroomBottomRight.gif",
		innerwallBathroomTopRight1:this._directory + "innerwallBathroomTopRight1.gif",
		innerwallBathroomTopRight2:this._directory + "innerwallBathroomTopRight2.gif",
		outerwallCornerOutBL:this._directory + "outerwallCornerOutBL.gif",
		outerwallCornerOutBR:this._directory + "outerwallCornerOutBR.gif",
		outerwallCornerOutTL:this._directory + "outerwallCornerOutTL.gif",
		outerwallCornerOutTR:this._directory + "outerwallCornerOutTR.gif",
		outerwallCornerInBL:this._directory + "outerwallCornerInBL.gif",
		outerwallCornerInBR:this._directory + "outerwallCornerInBR.gif",
		outerwallCornerInTL:this._directory + "outerwallCornerInTL.gif",
		outerwallCornerInTR:this._directory + "outerwallCornerInTR.gif",
		outerwallCapBL:this._directory + "outerwallCapBL.gif",
		outerwallCapBR:this._directory + "outerwallCapBR.gif",
		outerwallCapTL:this._directory + "outerwallCapTL.gif",
		outerwallCapTR:this._directory + "outerwallCapTR.gif",
		outerwallCapTLEntrance:this._directory + "outerwallCapTLEntrance.gif",
		outerwallCapTREntrance:this._directory + "outerwallCapTREntrance.gif",
		innerwallCornerBL:this._directory + "innerwallCornerBL.gif",
		innerwallCornerBR:this._directory + "innerwallCornerBR.gif",
		innerwallCornerTL:this._directory + "innerwallCornerTL.gif",
		innerwallCornerTR:this._directory + "innerwallCornerTR.gif",
		innerwallH:this._directory + "innerwallH.gif",
		innerwallV:this._directory + "innerwallV.gif",
		windowL:this._directory + "windowL.gif",
		windowT:this._directory + "windowT.gif",
		windowR:this._directory + "windowR.gif",
		windowB:this._directory + "windowB.gif",
		innerAndOuterwallSplitTL:this._directory + "innerAndOuterwallSplitTL.gif",
		innerAndOuterwallSplitTR:this._directory + "innerAndOuterwallSplitTR.gif",
		innerAndOuterwallSplitBL:this._directory + "innerAndOuterwallSplitBL.gif",
		innerAndOuterwallSplitBR:this._directory + "innerAndOuterwallSplitBR.gif",
		door0Deg:this._directory + "door0Deg.gif",
		door90Deg:this._directory + "door90Deg.gif",
		door180Deg:this._directory + "door180Deg.gif",
		door270Deg:this._directory + "door270Deg.gif",
		nightstand:[this._directory + "nightstandOn.gif",this._directory + "nightstandOff.gif"],
		plug:[this._directory + "plugIn.gif",this._directory + "plugOut.gif"],
		bed1:this._directory + "bed1.gif",
		bed2:this._directory + "bed2.gif",
		bed3:this._directory + "bed3.gif",
		bed4:this._directory + "bed4.gif",
		bed5:this._directory + "bed5.gif",
		bed6:this._directory + "bed6.gif",
		blueChair:this._directory + "blueChair.gif",
		bedroomDresserLeft:this._directory + "bedroomDresserLeft.gif",
		bedroomDresserRight:this._directory + "bedroomDresserRight.gif",
		bedroomCandle:[this._directory + "candleOff.gif",this._directory + "candleOn.gif"],
		garbageCan:this._directory + "garbageCan.gif",
		marbleThin:this._directory + "marbleThin.gif",
		marbleThinDouble:this._directory + "marbleThinDouble.gif",
		marbleThinShim:this._directory + "marbleThinShim.gif",
		marbleFull:this._directory + "marbleFull.gif",
		marbleFullHalf:this._directory + "marbleFullHalf.gif",
		greyShim:this._directory + "greyShim.gif",
		blueShim:this._directory + "blueShim.gif",
		range:[this._directory + "rangeOff.gif",this._directory + "rangeOn.gif"],
		rangeController:this._directory + "rangeController.gif",
		kitchenSinkRight:this._directory + "sinkRight.gif",
		kitchenSinkLeft:this._directory + "sinkLeft.gif",
		kitchenSinkWater:[this._directory + "kitchenSinkOff.gif",this._directory + "kitchenSinkOn.gif"],
		kitchenSinkController:this._directory + "emptyShim.gif",
		bathroomTile:this._directory + "bathroomTile.gif",
		bathroomCounterTile:this._directory + "bathroomCounterTile.gif",
		bathroomCounterTileHalf:this._directory + "bathroomCounterTileHalf.gif",
		bathroomTubFaucet:this._directory + "bathroomTubFaucet.gif",
		bathtub1:this._directory + "bathtub1.gif",
		bathtub2:this._directory + "bathtub2.gif",
		bathtub3:this._directory + "bathtub3.gif",
		bathtub4:this._directory + "bathtub4.gif",
		bathtub5:this._directory + "bathtub5.gif",
		bathtub6:this._directory + "bathtub6.gif",
		bathroomSink:[this._directory + "bathroomSinkOff.gif",this._directory + "bathroomSinkOn.gif"],
		bathroomSinkFixtures:this._directory + "bathroomSinkFixtures.gif",
		toilet:[this._directory + "toiletOff.gif",this._directory + "toiletOn.gif"],
		toiletBack:this._directory + "toiletBack.gif",
		kitchenMat1:this._directory + "kitchenMat1.gif",
		kitchenMat2:this._directory + "kitchenMat2.gif",
		kitchenMat3:this._directory + "kitchenMat3.gif",
		kitchenMat4:this._directory + "kitchenMat4.gif",
		kitchenMat5:this._directory + "kitchenMat5.gif",
		kitchenMat6:this._directory + "kitchenMat6.gif",
		kitchenMat7:[this._directory + "kitchenMat7Off.gif",this._directory + "kitchenMat7On.png"],
		sock:[this._directory + "sockDown.gif",this._directory + "sockUp.gif"],
		tvTableLeft:this._directory + "tvTableLeft.gif",
		tvTableRight:this._directory + "tvTableRight.gif",
		tvBack:this._directory + "tvBack.gif",
		tvFront:[this._directory + "tvFrontOff.gif",this._directory + "tvFrontOn.gif"],
		tvRemote:[this._directory + "tvRemote.gif",this._directory + "tvRemote.gif"],
		livingroomPlant:this._directory + "livingroomPlant.gif",
		livingroomRug:this._directory + "livingroomRug.gif",
		coffeeTableLeft:this._directory + "coffeeTableLeft.gif",
		coffeeTableRight:this._directory + "coffeeTableRight.gif",
		sofa1:this._directory + "sofa1.gif",
		sofa2:this._directory + "sofa2.gif",
		sofa3:this._directory + "sofa3.gif",
		sofa4:this._directory + "sofa4.gif",
		sofa5:this._directory + "sofa5.gif",
		sofa6:this._directory + "sofa6.gif",
		interactButton:"",
		grass:this._directory + "emptyShim.gif",
		dropTarget:"",
		bookcase1:this._directory + "bookcase1.gif",
		bookcase2:this._directory + "bookcase2.gif",
		bookcase3:this._directory + "bookcase3.gif",
		bookcase4:this._directory + "bookcase4.gif",
		bookcase5:this._directory + "bookcase5.gif",
		bookcase6:this._directory + "bookcase6.gif",
		bookcase7:this._directory + "bookcase7.gif",
		book:[this._directory + "book1.gif",this._directory + "book2.gif"],
		bookInBookcase:this._directory + "bookInBookcase.gif",
		hamper:[this._directory + "hamperOpen.gif",this._directory + "hamperClose.gif"],
		underwear:[this._directory + "underwearDown.gif",this._directory + "underwearUp.gif"],
		pants:[this._directory + "pantsDown.gif",this._directory + "pantsUp.gif"],
		shirt:[this._directory + "shirtDown.gif",this._directory + "shirtUp.gif"],
		desk1:this._directory + "desk1.gif",
		desk2:this._directory + "desk2.gif",
		desk3:this._directory + "desk3.gif",
		desk4:this._directory + "desk4.gif",
		desk5:[this._directory + "desk5Off.gif",this._directory + "desk5On.gif"],
		desk6:this._directory + "desk6.gif",
		deskChair1:this._directory + "deskChair1.gif",
		deskChair2:this._directory + "deskChair2.gif",
		sofaEndTable1Interact:[this._directory + "sofaEndTable1Off.gif",this._directory + "sofaEndTable1On.gif"],
		sofaEndTable1Plug:this._directory + "sofaEndTable1Plug.gif",
		barStoolHorz:this._directory + "barStoolHorz.gif",
		barStoolVert:this._directory + "barStoolVert.gif",
		kitchenTable1:this._directory + "kitchenTable1.png",
		kitchenTable2:this._directory + "kitchenTable2.png",
		kitchenTable3:this._directory + "kitchenTable3.png",
		kitchenTable4:this._directory + "kitchenTable4.png",
		kitchenTable5:this._directory + "kitchenTable5.png",
		kitchenTable6:this._directory + "kitchenTable6.png",
		kitchenTableBase:this._directory + "kitchenTableBase.gif",
		kitchenChairUp:this._directory + "kitchenChairUp.gif",
		kitchenChairRight:this._directory + "kitchenChairRight.gif",
		kitchenChairDown:this._directory + "kitchenChairDown.gif",
		kitchenChairLeft:this._directory + "kitchenChairLeft.gif",
		hingedDoorOpenTop:this._directory + "hingedDoorOpenTop.png",
		hingedDoorClosedTop1:this._directory + "hingedDoorClosedTop1.gif",
		hingedDoorClosedTop2:this._directory + "hingedDoorClosedTop2.gif",
		hingedDoorOpenBottom:this._directory + "hingedDoorOpenBottom.png",
		hingedDoorClosedBottom1:this._directory + "hingedDoorClosedBottom1.gif",
		hingedDoorClosedBottom2:this._directory + "hingedDoorClosedBottom2.gif",
		bathWater:[this._directory + "emptyShim.gif",this._directory + "bathWater.gif"],
		bathWaterTrigger:[this._directory + "emptyShim.gif",this._directory + "emptyShim.gif"],
		roundChair1:this._directory + "roundChair1.gif",
		roundChair2:this._directory + "roundChair2.gif",
		roundChair3:this._directory + "roundChair3.gif",
		roundChair4:this._directory + "roundChair4.gif",
		logo:this._directory + "logo.gif",
		startButton:this._directory + "startButton.gif",
		instructionsButton:this._directory + "instructionsButton.gif",
		disclaimerButton:this._directory + "disclaimerButton.gif",
		trademark:this._directory + "trademark.gif",
		instructionImages:[this._directory + "instructions1.png",this._directory + "instructions2.png",this._directory + "instructions3.png"],
		instructionButtonBack:this._directory + "instructionButtonBack.gif",
		instructionButtonForward:this._directory + "instructionButtonForward.gif",
		menuClose:this._directory + "instructionButtonClose.gif",
		disclaimerImage:this._directory + "disclaimer.gif",
		volumeControl:[this._directory + "volumeOn.gif",this._directory + "volumeOff.gif"],
		sidewalk:this._directory + "emptyShim.gif",
		exitGameBlocker:this._directory + "emptyShim.gif",
		finishText:this._directory + "finish.gif",
		dirt:this._directory + "emptyShim.gif",
		shrubbery:this._directory + "emptyShim.gif",
		loading:this._directory + "loading.gif",
		endScreenGood:this._directory + "levelUp.gif",
		endScreenBad:this._directory + "gameOver.gif",
		rotateScreen:this._directory + "rotateScreen.gif",
		endScreenGoodButton:this._directory + "levelUpButton.gif",
		endScreenBadButton:this._directory + "gameOverButton.gif"
														
	};
},
	
setInitialLoadBytes:function(num){
	this._initialLoadBytes = num;
},

setTotalLoadBytes:function(num){
	this._totalLoadBytes = num;
},

setJQueryRotaterPosition:function(loc){
	this._rotaterPosition = loc;
},

setRotaterPosition:function(x,y){
	this._rotaterX = x;
	this._rotaterY = y;
},

setStageDimensions:function(w,h){
	this._stageWidth = w;
	this._stageHeight = h;
},

setStageStartPosition:function(x,y){
	this._stageStartX = x;
	this._stageStartY = y;
},

setTimeLimit:function(minutes){
	this._timeLimit = minutes;
},

getGameboardClasses:function(){
	return this._gameBoardClasses;
},

getGameboardImageLookup:function(){
	return this._gameBoardImageLookup;
},

getInitialLoadBytes:function(){
	return this._initialLoadBytes;
},

getTotalLoadBytes:function(){
	return this._totalLoadBytes;
},

getRotaterX:function(){
	return this._rotaterX;
},

getRotaterY:function(){
	return this._rotaterY;
},

getStageWidth:function(){
	return this._stageWidth;
},

getStageHeight:function(){
	return this._stageHeight;
},


getStageStartX:function(){
	return this._stageStartX;
},

getStageStartY:function(){
	return this._stageStartY;
},

getPlayerInfo:function(){
	return this._playerInfo;
},
getThoughtInfo:function(){
	return this._thoughtInfo;
},
getMaskInfo:function(){
	return this._maskInfo;
},
getVolumeControlInfo:function(){
	return this._volumeControlInfo;
},

getGoodEndScreenElements:function(){
	return this._goodEndScreenElements;
},

getBadEndScreenElements:function(){
	return this._badEndScreenElements;
},

getRotateScreenInfo:function(){
	return this._rotateScreenInfo;
},

getGameBoard:function(){
	return this._gameboard;
},

getThoughtAnimations:function(){
	return this._thoughtAnimations;
},

getStartScreenElements:function(){
	return this._startScreenElements;
},

getInstructionElements:function(){
	return this._instructionElements;
},

getDisclaimerElements:function(){
	return this._disclaimerElements;
},

getThoughtMatrix:function(){
	return this._thoughtMatrix;
},

getPotentialThoughtArray:function(){
	return this._g_potentialThoughtArray;
},

getRelatedMatrix:function(){
	return this._relatedMatrix;
},

getTimeLimit:function(){
	return this._timeLimit;
},



 
});


			
			
			
			
			
			