const Audio_View = View.extend({

construct() { 
	this.SC.construct();
	this._playing;
	this._track;
	this._className = "Audio_View";
},


 	
init(controller, data) {
	this._controller = controller;
	this._track = document.getElementById(data.trackName);
	this._playing = false;
},

getTrack(){
	return this._track;
},

setCurrentTime(position){
	this._track.currentTime = position;
}





});