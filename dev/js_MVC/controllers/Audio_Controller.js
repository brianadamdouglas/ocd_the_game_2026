class Audio_Controller extends Tile_Controller {

	constructor() { 
	super();
	this._trackLength;
	this._playhead;
	this._checkPlayheadPositionInterval;
	this._duration;
	this._activeAudioClip;
	this._className = "Timer";
}


 	
	init() {
	this._activeAudioClip = false;
	this.addListners();	
}

	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("startAudio", this);
	g_eventHandler.addAListener("pauseAudio", this);
	g_eventHandler.addAListener("seekAudio", this);
	g_eventHandler.addAListener("resumeAudio", this);
	g_eventHandler.addAListener("toggleAudio", this);
	g_eventHandler.addAListener("restartAudio", this);
	g_eventHandler.addAListener("kill", this);
}

	startAudio(){
	this._activeAudioClip = true;
	this.startCheckingPlayhead();
	this._view.getTrack().play();
	this.getDuration();
}

	pauseAudio(){
		this._activeAudioClip = false;
		this._view.getTrack().pause();
		clearInterval(this._checkPlayheadPositionInterval);
		this._checkPlayheadPositionInterval = null;
	}

	resumeAudio(){
		if(this._activeAudioClip){
			const playPromise = this._view.getTrack().play();
			// Handle promise rejection (e.g., autoplay policy)
			if (playPromise !== undefined) {
				playPromise.catch(error => {
					console.warn('Audio play failed:', error);
					this._activeAudioClip = false;
				});
			}
			this.startCheckingPlayhead();
		}
	
	}

	toggleAudio(){
		if(this._view.getTrack().paused){
			this._activeAudioClip = true;
			this.resumeAudio();
		}else{
			this.pauseAudio();
		}
	}

	seekAudio(position){
	
}

	setAudioVolume(volume){
	const normalizedVolume = volume/100;
	this._view.getTrack().volume = normalizedVolume;
}

	getDuration(){
	this._duration = this._view.getTrack().duration;
}

	startCheckingPlayhead(){
	this._checkPlayheadPositionInterval = setInterval(this.checkPlayheadPosition.bind(this), 10); // use .bind to correct scope
}

	checkPlayheadPosition(){
	const currentTime = this._view.getTrack().currentTime;
	//console.log(currentTime);
	if(currentTime > 35.2){//this._duration - currentTime < .25
		this._view.setCurrentTime(.01);
	}
	
}

	restartAudio(){
	this._view.setCurrentTime(.36);
	this.resumeAudio();
}

	kill(){
	
}




}