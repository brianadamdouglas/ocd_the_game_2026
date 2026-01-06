function mobile_orientationChange(event) {	
	if(event !== undefined){
		
		if(event.orientation === "portrait"){
			
			const centerX = Math.floor(screen.width/2);//190//
			const centerY = 300// this should be a global called centerY I will either need a lookup table or figure out it's ratio to the screen
			const rotY = centerY;
			const diffX = Math.ceil((screen.width - 375)/2); // this should be a global called maskWidth
			const diffY = Math.ceil((screen.height - 559)/2); // this should be a global called maskHeight
			const orientation = "portrait";

			g_mainGameController.updateMask(0,[diffX,0]);
			$("#mask").css('clip', `rect(${0}px, ${screen.width - diffX}px, ${559}px, ${diffX}px)`);
			
			const screenWidth = screen.width;
			const screenHeight = 559; // this should be a global called mask height;
			
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
			
			const volumePositionX =  screenWidth - volumeWidth;
			const volumePositionY =  screenHeight - volumeHeight;
			
		    g_mainGameController._player.setViewLoc(playerX,playerY);
		    g_mainGameController._timer.setViewLoc(timerX,0);
		    g_mainGameController._volumeControl.setViewLoc(volumePositionX, volumePositionY); 
			g_mainGameController._rotater.setViewLoc(centerX,rotY);
			g_gameboardModel.setRotaterPosition(centerX,rotY);
			/* g_rotaterX = centerX;
			g_rotaterY = rotY; */
			g_mainGameController.updateThoughtBubbleLoc(g_gameboardModel.getRotaterX()  - 87, g_gameboardModel.getRotaterY()  - 190);	g_gameboardModel.getRotaterX() 	
			
			g_eventHandler.dispatchAnEvent("screenRotatedPortrait",{});
	    }else if(event.orientation === "landscape"){
	        const leftX = Math.floor((screen.height- 559)/2); // this should be a global called maskHeight
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

$( window ).on( "orientationchange", mobile_orientationChange);




