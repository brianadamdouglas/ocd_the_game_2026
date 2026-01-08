function mobile_orientationChange(event) {	
	if(event !== undefined){
		
		if(event.orientation === "portrait"){
			
			// Original mask dimensions (375x559) - maintain aspect ratio
			const originalMaskWidth = 375;
			const originalMaskHeight = 559;
			const maskAspectRatio = originalMaskWidth / originalMaskHeight; // ~0.67
			
			// Calculate responsive mask dimensions
			// Use 90% of screen width, or maintain aspect ratio based on height
			const maxMaskWidth = Math.floor(screen.width * 0.9);
			const maxMaskHeight = Math.floor(screen.height * 0.9);
			
			// Calculate dimensions maintaining aspect ratio
			let maskWidth, maskHeight;
			if (maxMaskWidth / maskAspectRatio <= maxMaskHeight) {
				// Width is the limiting factor
				maskWidth = maxMaskWidth;
				maskHeight = Math.floor(maskWidth / maskAspectRatio);
			} else {
				// Height is the limiting factor
				maskHeight = maxMaskHeight;
				maskWidth = Math.floor(maskHeight * maskAspectRatio);
			}
			
			const centerX = Math.floor(screen.width/2);
			const centerY = Math.floor(screen.height/2); // Center vertically
			const rotY = centerY;
			const diffX = Math.ceil((screen.width - maskWidth)/2);
			const diffY = Math.ceil((screen.height - maskHeight)/2);
			const orientation = "portrait";

			g_mainGameController.updateMask(0,[diffX,diffY]);
			const maskElement = document.getElementById('mask');
			if (maskElement) {
				DOMUtils.css(maskElement, 'clip', `rect(${diffY}px, ${screen.width - diffX}px, ${screen.height - diffY}px, ${diffX}px)`);
			}
			
			const screenWidth = screen.width;
			const screenHeight = maskHeight; // Use calculated mask height
			
		    //place player
		    const playerW = g_mainGameController._player.getViewWidth();
		    //console.log(playerW);
			const playerH = g_mainGameController._player.getViewHeight();
			const playerX = centerX - (playerW/2);
			const playerY = centerY - (playerH/2);
			
			const timerW = g_mainGameController._timer.getViewWidth();
			const timerX = centerX - (timerW/2);
			
			const volumeWidth = g_mainGameController._volumeControl.getViewWidth();
			const volumeHeight = g_mainGameController._volumeControl.getViewHeight();
			
			const volumePositionX =  screenWidth - volumeWidth - 5; // 5px padding
			const volumePositionY =  (diffY + screenHeight) - volumeHeight - 5; // Position relative to mask bottom
			
		    g_mainGameController._player.setViewLoc(playerX,playerY);
		    g_mainGameController._timer.setViewLoc(timerX,diffY); // Position relative to mask top
		    g_mainGameController._volumeControl.setViewLoc(volumePositionX, volumePositionY); 
			g_mainGameController._rotater.setViewLoc(centerX,rotY);
			g_gameboardModel.setRotaterPosition(centerX,rotY);
			/* g_rotaterX = centerX;
			g_rotaterY = rotY; */
			g_mainGameController.updateThoughtBubbleLoc(g_gameboardModel.getRotaterX()  - 87, g_gameboardModel.getRotaterY()  - 190);	g_gameboardModel.getRotaterX() 	
			
			g_eventHandler.dispatchAnEvent("screenRotatedPortrait",{});
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
	// Wait a bit for game to initialize
	setTimeout(() => {
		if (typeof g_mainGameController !== 'undefined' && typeof screen !== 'undefined') {
			const initialOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
			mobile_orientationChange({ orientation: initialOrientation });
		}
	}, 100);
});




