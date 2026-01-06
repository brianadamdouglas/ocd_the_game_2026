var myInterval;
		var stopInterval;
		O('myAudio').volume = .2;
		O('myAudio2').volume = .2;
	
		function playAudio(){
			currentTime = 0;
			O('myAudio').play();
			myInterval = setInterval(checkAudioPoint, 1);
			stop2();
			//stopInterval = setInterval(stop2, 20);
		}
		
		function checkAudioPoint(){
			
			if(currentTime >= 1.5){
				clearInterval(myInterval);
				playAudio2();
			}
			currentTime = O('myAudio').currentTime;
		}
		
		function playAudio2(){
			currentTime = 0;
			O('myAudio2').play();	
			myInterval = setInterval(checkAudioPoint2, 1);
			stop1();
			//stopInterval = setInterval(stop1, 20);
		}
		
		
		function checkAudioPoint2(){
			
			if(currentTime >= 1.5){
				clearInterval(myInterval);
				playAudio();
			}
			currentTime = O('myAudio2').currentTime;
		}
		
		function stop1(){
			O('myAudio').pause();
			O('myAudio').currentTime = 0;
			clearInterval(stopInterval);
		}
		
		function stop2(){
			O('myAudio2').pause();
			O('myAudio2').currentTime = 0;
			clearInterval(stopInterval);
		}
		var currentTime;
		//playAudio();