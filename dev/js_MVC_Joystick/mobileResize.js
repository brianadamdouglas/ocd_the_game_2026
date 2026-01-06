$( window ).on( "orientationchange", mobile_orientationChange);




function mobile_orientationChange(event){	
	if(event != undefined){
		
		if(event.orientation == "portrait"){
			
			/* var centerX = Math.floor(g_screenWidth/2);//190//
			var centerY = g_centerY// this should be a global called centerY I will either need a lookup table or figure out it's ratio to the screen
			var rotY = centerY;
			var diffX = Math.ceil((screen.width - 375)/2); // this should be a global called maskWidth
			var diffY = Math.ceil((screen.height - 559)/2); // this should be a global called maskHeight
			var orientation = "portrait";

			//g_mainGameController.updateMask(0,[diffX,0]);
			$("#mask").css('clip', 'rect('+0+'px, '+ g_screenWidth +'px, '+ g_screenHeight +'px, '+0+'px)');
			
			if(orientation == "portrait"){
				var screenWidth = g_screenWidth;
				var screenHeight = g_screenHeight // this should be a global called mask height;
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
			
			var volumePositionX =  (screenWidth - volumeWidth) - 5;
			var volumePositionY =  (screenHeight - volumeHeight) - 5;
			
		    g_mainGameController._player.setViewLoc(playerX,playerY);
		    g_mainGameController._timer.setViewLoc(timerX,0);
		    g_mainGameController._volumeControl.setViewLoc(volumePositionX, volumePositionY); 
			g_mainGameController._rotater.setViewLoc(centerX,rotY);
			g_gameboardModel.setRotaterPosition(centerX,rotY); */
			/* g_rotaterX = centerX;
			g_rotaterY = rotY; */
			/* g_mainGameController.updateThoughtBubbleLoc(g_gameboardModel.getRotaterX()  - 87, g_gameboardModel.getRotaterY()  - 215);	g_gameboardModel.getRotaterX() 	 */
			
			g_eventHandler.dispatchAnEvent("screenRotatedPortrait",{});
			
	    }else if(event.orientation == "landscape"){
	        var x = Math.floor((g_screenRotateHeight - 559)/2); 
	        var y = Math.floor((g_screenWidth - 375)/10);
	        g_eventHandler.dispatchAnEvent("screenRotatedLandscape",{});
	        g_rotateScreen._rotateScreen.setViewLoc(x,y);
			
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




