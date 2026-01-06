class Thought_Controller extends Controller {

/*
	to do for this class:

	get the item that you just interacted with, as soon as you move from it, an interval starts. 
	the interval increases in length each time that you interact with an object. 
	if you don’t interact with it the interval gets shorter and shorter.

	if you go back to check it  few times, it will remove it from the queue
	*/
	constructor() { 
		super();
		this._type;
		this._startTime;
		this._intensity;
		this._ignore;
		this._react;
		this._fireThoughtInterval;
		this._mind;
		this._instance;
		this._location;
}

	init(type, intensity, loc) {
	this._type = type;
	//this._startTime = startTime;
	this.setIntensity(intensity);
	this.setLocation(loc);
	//this.obsess();
}

	addInstance(instance) {
	this._instance = instance;
}

	startObsessing(){
  this._fireThoughtInterval = setInterval(this.obsess.bind(this), (100 + this.getRandomInt())); // use .bind to correct scope
}

	getRandomInt() {
		return Math.floor(Math.random() * (2000));
	}

	obsess(){
		clearInterval(this._fireThoughtInterval);
		g_eventHandler.dispatchAnEvent("thoughtFired", {type:this.getType()});
	}

	getType(){
		return this._type;
	}

	setIntensity(num){
		this._intensity = num;
	}

	getIntensity(){
		return this._intensity;
	}

	setLocation(num){
		this._location = num;
	}

	getLocation(){
		return this._location;
	}

	pauseObsessing(){
		clearInterval(this._fireThoughtInterval);
	}

	resumeObsessing(){
		this.startObsessing();
	}






}