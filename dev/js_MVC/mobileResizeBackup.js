$( window ).on( "orientationchange", mobile_orientationChange);




function mobile_orientationChange(event){	
	if(event != undefined){
		
		if(event.orientation == "portrait"){
			
			
			
			var centerX = Math.floor(screen.width/2);//190//
			var centerY = 300// this should be a global called centerY
			var rotY = centerY;
			var diffX = Math.ceil((screen.width - 375)/2); // this should be a global called maskWidth
			var diffY = Math.ceil((screen.height - 559)/2); // this should be a global called maskHeight
			var orientation = "portrait";
			//console.log(screen.height);
			g_mainGameController.updateMask(0,[diffX,0]);
			$("#mask").css('clip', 'rect('+0+'px, '+(screen.width - diffX)+'px, '+559+'px, '+(diffX)+'px)');
			
			if(orientation == "portrait"){
				var screenWidth = screen.width;
				var screenHeight = 559 // this should be a global called mask height;
			}else{
				/* var screenWidth = screen.height;
				var screenHeight = screen.width; */
			}
		    //place player
		    var playerW = g_mainGameController._player.getViewWidth();
		    //console.log(playerW);
			var playerH = g_mainGameController._player.getViewHeight();
			var playerX = centerX - (playerW/2);
			var playerY = centerY - (playerH/2);
			
			var timerW = g_mainGameController._timer.getViewWidth();
			var timerX = centerX - (timerW/2);
			
			var volumeWidth = g_mainGameController._volumeControl.getViewWidth();
			var volumeHeight = g_mainGameController._volumeControl.getViewHeight();
			
			var volumePositionX =  screenWidth - volumeWidth;
			var volumePositionY =  screenHeight - volumeHeight;
			
			//console.log([volumePositionX,volumePositionY]);
			
			//console.log([playerX,playerY]);
		    g_mainGameController._player.setViewLoc(playerX,playerY);
		    g_mainGameController._timer.setViewLoc(timerX,0);
		    g_mainGameController._volumeControl.setViewLoc(volumePositionX, volumePositionY); 
			g_mainGameController._rotater.setViewLoc(centerX,rotY);
			g_gameboardModel.setRotaterPosition(centerX,rotY);
			/* g_rotaterX = centerX;
			g_rotaterY = rotY; */
			g_mainGameController.updateThoughtBubbleLoc(g_gameboardModel.getRotaterX()  - 87, g_gameboardModel.getRotaterY()  - 190);	g_gameboardModel.getRotaterX() 	
			/* g_mainGameController._timer.resumeClock();	
			g_mainGameController._audio.resumeAudio();	 */
			g_eventHandler.dispatchAnEvent("screenRotatedPortrait",{});
	    }else if(event.orientation == "landscape"){
	        var leftX = Math.floor((screen.height- 559)/2); // this should be a global called maskHeight
	        g_eventHandler.dispatchAnEvent("screenRotatedLandscape",{});
	        g_rotateScreen._rotateScreen.setViewLoc(leftX,0);
			
			/* console.log([screen.height, screen.width]);
			
			var centerX = Math.floor(screen.height/2);
			var centerY = Math.floor(screen.width/2) + 80;//280//Math.floor(screen.width/2);
			var rotY = centerY;
			var diffX = Math.ceil((screen.height - 559)/2);
			var diffY = Math.ceil((screen.width - 375)/2);
			g_mainGameController.updateMask(90,[screen.height - diffX,diffY]);
			$("#mask").css('clip', 'rect('+diffY+'px, '+(screen.height - diffX)+'px, '+(screen.width - diffY)+'px, '+(diffX)+'px)'); */
	    }
    }else{
		/* var centerX = Math.ceil(screen.width/2);//190//
		var centerY = Math.ceil(screen.height/2) + 50;//300//
		var orientation = "landscape";
		var rotY = centerY;
		var diffX = Math.ceil((screen.width - 375)/2);
		var diffY = Math.ceil((screen.height - 559)/2);
		g_mainGameController.updateMask(0,[diffX,diffY]);
		$("#mask").css('clip', 'rect('+diffY+'px, '+(screen.width - diffX)+'px, '+(screen.height - diffY)+'px, '+(diffX)+'px)'); */
    }
    
    							   
}




