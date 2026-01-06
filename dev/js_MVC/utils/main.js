// Initialize game configuration and start the game
try {
	g_gameboardModel.setRotaterPosition(190,300);  // rotaterY is 0.53667262969589 * g_screenHeight;
	g_gameboardModel.setStageDimensions(1252,1688);// this should not be changed
	g_gameboardModel.setStageStartPosition(-380,-380);// this should not be changed
	// Initial load bytes - should include all start screen images
	// Based on actual loading logs: start screen images total exactly 163902 bytes
	// Setting to 163900 to trigger when all start screen images are loaded (>= 1 condition)
	g_gameboardModel.setInitialLoadBytes(163900);
	g_gameboardModel.setTotalLoadBytes(592981);
	g_gameboardModel.setTimeLimit(3);
	g_gameboardModel.init();

	g_rotateScreen.init(g_gameboardModel);
	g_rotateScreen.initializeRotateScreen();
	g_startScreen.init(g_gameboardModel);
	g_startScreen.initializeStartScreen();
} catch(error) {
	console.error("Error during initialization:", error);
	console.error(error.stack);
}

document.body.addEventListener('touchstart', (e) => { e.preventDefault(); });