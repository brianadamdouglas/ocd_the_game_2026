
$( window ).on( "orientationchange", mobile_orientationChange);

function mobile_orientationChange(event){
	
	if(event != undefined){
		if(event.orientation == "portrait"){
			console.log([screen.width , screen.height]);
			var centerX = Math.floor(screen.width/2);//190//
			var centerY = 300//Math.floor(screen.height/2) + 20;//
			var rotY = centerY;
			var diffX = Math.ceil((screen.width - 375)/2);
			var diffY = Math.ceil((screen.height - 559)/2);
			console.log(screen.height);
			g_mask.rotateDiv(0);
			g_mask.setLoc(diffX,0);
			$("#mask").css('clip', 'rect('+0+'px, '+(screen.width - diffX)+'px, '+559+'px, '+(diffX)+'px)');
	    }else if(event.orientation == "landscape"){
			console.log([screen.height, screen.width]);
			var centerX = Math.floor(screen.height/2);
			var centerY = Math.floor(screen.width/2) + 80;//280//Math.floor(screen.width/2);
			var rotY = centerY;
			g_mask.rotateDiv(90);
			var diffX = Math.ceil((screen.height - 559)/2);
			var diffY = Math.ceil((screen.width - 375)/2);
			g_mask.setLoc(screen.height - diffX,diffY);
			$("#mask").css('clip', 'rect('+diffY+'px, '+(screen.height - diffX)+'px, '+(screen.width - diffY)+'px, '+(diffX)+'px)');
	    }
    }else{
        console.log('hello');
		var centerX = Math.ceil(screen.width/2);//190//
		var centerY = Math.ceil(screen.height/2) + 50;//300//
		var rotY = centerY;
		var diffX = Math.ceil((screen.width - 375)/2);
		var diffY = Math.ceil((screen.height - 559)/2);
		console.log(screen.height);
		g_mask.rotateDiv(0);
		g_mask.setLoc(diffX,diffY);
		$("#mask").css('clip', 'rect('+diffY+'px, '+(screen.width - diffX)+'px, '+(screen.height - diffY)+'px, '+(diffX)+'px)');
    }
    
    //place player
    var playerW = g_player.getWidth();
    console.log(playerW);
	var playerH = g_player.getHeight();
	var playerX = centerX - (playerW/2);
	var playerY = centerY - (playerH/2);
	console.log([playerX,playerY]);
    g_player.setLoc(playerX,playerY);
	g_rotater.setLoc(centerX,rotY);
	g_rotaterX = centerX;
	g_rotaterY = rotY;
	g_thoughtBubble.setLoc(g_rotaterX - 87, g_rotaterY - 190);											   
}



