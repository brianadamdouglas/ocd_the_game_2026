var Thought_Controller = Controller.extend({

/*
to do for this class:

get the item that you just interacted with, as soon as you move from it, an interval starts. 
the interval increases in length each time that you interact with an object. 
if you don’t interact with it the interval gets shorter and shorter.

if you go back to check it  few times, it will remove it from the queue
*/
construct: function() { 
		this._type;
		this._startTime;
		this._intensity;
		this._ignore;
		this._react;
		this._fireThoughtInterval;
		this._mind;
		this._instance;
		this._location;
},

init: function(type, intensity, loc) {
	this._type = type;
	//this._startTime = startTime;
	this.setIntensity(intensity);
	this.setLocation(loc);
	//this.obsess();
},

addInstance: function(instance) {
	this._instance = instance;
},

startObsessing: function(){
  this._fireThoughtInterval = setInterval(this.obsess.bind(this), (100 + this.getRandomInt())); // use .bind to correct scope
},

getRandomInt: function() {
	 return Math.floor(Math.random() * (4000));
},

obsess: function(){
 clearInterval(this._fireThoughtInterval);
 g_eventHandler.dispatchAnEvent("thoughtFired", {type:this.getType()});
},

getType: function(){
  return this._type;
},

setIntensity: function(num){
  this._intensity = num;
},

getIntensity: function(){
  return this._intensity;
},

setLocation: function(num){
  this._location = num;
},

getLocation: function(){
  return this._location;
},

pauseObsessing:function(){
	clearInterval(this._fireThoughtInterval);
},

resumeObsessing:function(){
	this.startObsessing();
},






});