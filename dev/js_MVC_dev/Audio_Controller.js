var Audio_Controller = Tile_Controller.extend({

construct: function() { 
	this.SC.construct();
	this._trackLength;
	this._playhead;
	this._checkPlayheadPositionInterval;
	this._duration;
	this._activeAudioClip;
	this._className = "Timer";
},


 	
init: function() {
	this._activeAudioClip = false;
	this.addListners();	
},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("startAudio", this);
	g_eventHandler.addAListener("pauseAudio", this);
	g_eventHandler.addAListener("seekAudio", this);
	g_eventHandler.addAListener("resumeAudio", this);
	g_eventHandler.addAListener("toggleAudio", this);
	g_eventHandler.addAListener("restartAudio", this);
	g_eventHandler.addAListener("kill", this);
},

startAudio:function(){
	this._activeAudioClip = true;
	this.startCheckingPlayhead();
	this._view.getTrack().play();
	this.getDuration();
},

pauseAudio:function(){
	this._view.getTrack().pause();
	clearInterval(this._checkPlayheadPositionInterval);
},

resumeAudio:function(){
	if(this._activeAudioClip){
		this._view.getTrack().play();
		this.startCheckingPlayhead();
	}
	
},

toggleAudio:function(){
	if(this._view.getTrack().paused){
		this._activeAudioClip = true;
		this.resumeAudio();
	}else{
		this._activeAudioClip = false;
		this.pauseAudio();
	}
},

seekAudio: function(position){
	
},

setAudioVolume:function(volume){
	var volume = volume/100;
	this._view.getTrack().volume = volume;
},

getDuration:function(){
	this._duration = this._view.getTrack().duration;
},

startCheckingPlayhead:function(){
	this._checkPlayheadPositionInterval = setInterval(this.checkPlayheadPosition.bind(this), 10); // use .bind to correct scope
},

checkPlayheadPosition:function(){
	var currentTime = this._view.getTrack().currentTime;
	//console.log(currentTime);
	if(currentTime> 35.2){//this._duration - currentTime < .25
		this._view.setCurrentTime(.01);
	}
	
},

restartAudio:function(){
	this._view.setCurrentTime(.36);
	this.resumeAudio();
},

kill:function(){
	
}




});