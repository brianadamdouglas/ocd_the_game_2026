function mobile_orientationChange(event) {	
	if(event !== undefined){
		
		if(event.orientation === "portrait"){
			
			const centerX = Math.floor(screen.width/2);//190//
			const centerY = 300// this should be a global called centerY I will either need a lookup table or figure out it's ratio to the screen
			const rotY = centerY;
			const diffX = Math.ceil((screen.width - 375)/2); // this should be a global called maskWidth
			const diffY = Math.ceil((screen.height - 559)/2); // this should be a global called maskHeight
			const orientation = "portrait";

			// Only update mask if it exists
			if (g_mainGameController && g_mainGameController._mask) {
				g_mainGameController.updateMask(0,[diffX,0]);
			}
			const maskElement = document.getElementById('mask');
			if (maskElement) {
				// Use DOMUtils if available, otherwise fall back to jQuery
				if (typeof DOMUtils !== 'undefined') {
					DOMUtils.css(maskElement, 'clip', `rect(${0}px, ${screen.width - diffX}px, ${559}px, ${diffX}px)`);
				} else if (typeof $ !== 'undefined') {
					$("#mask").css('clip', `rect(${0}px, ${screen.width - diffX}px, ${559}px, ${diffX}px)`);
				}
			}
			
			const screenWidth = screen.width;
			const screenHeight = 559; // this should be a global called mask height;
			
			// Only update game elements if they exist
			if (g_mainGameController) {
			    //place player
			    const playerW = g_mainGameController._player ? g_mainGameController._player.getViewWidth() : 0;
			    //console.log(playerW);
				const playerH = g_mainGameController._player ? g_mainGameController._player.getViewHeight() : 0;
				const playerX = centerX - (playerW/2);
				const playerY = centerY - (playerH/2);
				
				const timerW = g_mainGameController._timer ? g_mainGameController._timer.getViewWidth() : 0;
				const timerX = centerX - (timerW/2);
				
				const volumeWidth = g_mainGameController._volumeControl ? g_mainGameController._volumeControl.getViewWidth() : 0;
				const volumeHeight = g_mainGameController._volumeControl ? g_mainGameController._volumeControl.getViewHeight() : 0;
				
				const volumePositionX =  screenWidth - volumeWidth;
				const volumePositionY =  screenHeight - volumeHeight;
				
				if (g_mainGameController._player) {
					g_mainGameController._player.setViewLoc(playerX,playerY);
				}
				if (g_mainGameController._timer) {
					g_mainGameController._timer.setViewLoc(timerX,0);
				}
				if (g_mainGameController._volumeControl) {
					g_mainGameController._volumeControl.setViewLoc(volumePositionX, volumePositionY);
				}
				if (g_mainGameController._rotater) {
					g_mainGameController._rotater.setViewLoc(centerX,rotY);
				}
				if (g_gameboardModel) {
					g_gameboardModel.setRotaterPosition(centerX,rotY);
					if (g_mainGameController.updateThoughtBubbleLoc) {
						g_mainGameController.updateThoughtBubbleLoc(g_gameboardModel.getRotaterX()  - 87, g_gameboardModel.getRotaterY()  - 190);
					}
				}
			}
			
			if (typeof g_eventHandler !== 'undefined') {
				g_eventHandler.dispatchAnEvent("screenRotatedPortrait",{});
			}
	    }else if(event.orientation === "landscape"){
	        // For landscape, show rotate screen message
	        const leftX = Math.floor((screen.height - 559)/2); // Keep original for landscape message
	        g_eventHandler.dispatchAnEvent("screenRotatedLandscape",{});
	        g_rotateScreen._rotateScreen.setViewLoc(leftX,0);
			
	    }
    }else{
		/* const centerX = Math.ceil(screen.width/2);//190//
		const centerY = Math.ceil(screen.height/2) + 50;//300//
		const orientation = "landscape";
		const rotY = centerY;
		const diffX = Math.ceil((screen.width - 375)/2);
		const diffY = Math.ceil((screen.height - 559)/2);
		g_mainGameController.updateMask(0,[diffX,diffY]);
		$("#mask").css('clip', `rect(${diffY}px, ${screen.width - diffX}px, ${screen.height - diffY}px, ${diffX}px)`); */
    }
    
    							   
}

// Initialize mask on page load and orientation changes
if (typeof TouchUtils !== 'undefined') {
	TouchUtils.onOrientationChange(mobile_orientationChange);
} else {
	// Fallback if TouchUtils not loaded yet - use jQuery for now
	$(window).on("orientationchange", mobile_orientationChange);
}

// Call on initial load once game is ready
window.addEventListener('load', () => {
	// Wait for game to fully initialize (mask is created in init2)
	setTimeout(() => {
		if (typeof g_mainGameController !== 'undefined' && 
		    g_mainGameController._mask && 
		    typeof screen !== 'undefined') {
			const initialOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
			mobile_orientationChange({ orientation: initialOrientation });
		}
	}, 500); // Increased delay to ensure mask is created
});




