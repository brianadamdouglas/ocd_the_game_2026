var g_eventHandler = new EventHandler();
var g_gameboardModel = new Gameboard_Model();
var g_rotateScreen = new RotateScreen_Controller();
var g_startScreen = new StartScreen_Controller();
var g_mainGameController = new Main_Controller();
var g_touchController = new Touch_Controller();




g_gameboardModel.setRotaterPosition(g_screenWidth/2,g_centerY);  // rotaterY is 0.53667262969589 * g_screenHeight;  
g_gameboardModel.setStageDimensions(1252,1688);// this should not be changed
g_gameboardModel.setStageStartPosition(-380,-380);// this should not be changed
g_gameboardModel.setInitialLoadBytes(160875);
g_gameboardModel.setTotalLoadBytes(603287);
g_gameboardModel.setTimeLimit(3);
g_gameboardModel.setDirectory("/img/gameDev/");
g_gameboardModel.init();


g_rotateScreen.init(g_gameboardModel);
g_rotateScreen.initializeRotateScreen();
g_startScreen.init(g_gameboardModel);
g_startScreen.initializeStartScreen();


function g_startScreenRefresh(){
	var test = setTimeout(initializeMainController, 3000);
}

function initializeMainController(){
	g_mainGameController.init(g_gameboardModel);
	
}

function g_afterAssetsLoad(){
	g_startScreen.initializeStartButton();
	g_touchController.init(g_mainGameController, g_mainGameController.getPlayer(), g_mainGameController.getStage(), true); 
	
}

document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });




