/**
 * Global Configuration and Instances
 * All global game objects and configuration functions
 */

// Global game instances
const g_eventHandler = new EventHandler();
const g_gameboardModel = new Gameboard_Model();
const g_rotateScreen = new RotateScreen_Controller();
const g_startScreen = new StartScreen_Controller();
const g_mainGameController = new Main_Controller();
const g_touchController = new Touch_Controller();

// Global callback functions
const g_startScreenRefresh = () => {
	const test = setTimeout(initializeMainController, 3000);
};

const initializeMainController = () => {
	g_mainGameController.init(g_gameboardModel);
};

const g_afterAssetsLoad = () => {
	g_startScreen.initializeStartButton();
	g_touchController.init(g_mainGameController, g_mainGameController.getPlayer(), g_mainGameController.getStage()); 
};

