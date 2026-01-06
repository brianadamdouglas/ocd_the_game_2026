var MIND = Controller.extend({

// there will be certain compulsions that are related so if the player reacts to one, 
//then it will set teh intensity for the others.

construct: function() { 
		this._player;
		this._thoughtBubble;
		this._thoughtsQueue;
		this._thoughtStartPosition;
		this._triggerOCDInterval;
		this._OCDIsWorking;
		this._active;
		this._mainController;
		this._checkRadiusInterval;
		this._triggeredThought;
		this._exitRadii;
		this._waitingToFire;
		this._paused;
},


/**
* Initializes the instance
* @param {Selection} player // refrence to the Player Class Instance
* @param {Selection} thoughtBubble // refrence to the Thought Bubble Class Instance
* @param {Function} getPlayerLoc // returns the player's location, seems like it should be a method of the player instance and not a method of the game engine
* @return 
*/ 
init: function(player, thoughtBubble, mainController) {
	this._player = player;
	this._thoughtBubble = thoughtBubble;
	this._mainController = mainController;
	this._thoughtsQueue = new Array();
	this._OCDIsWorking = false;
	this._active = false;
	this._exitRadii = {
		immobile:100,
		mobile:150,
		sticky:150
		
	}
	
	this._paused = false;
	this._waitingToFire = false;
	this.addListners();
	
},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("respondedOCDTrigger", this);
	g_eventHandler.addAListener("thoughtFired", this);
	g_eventHandler.addAListener("pauseThought", this);
	g_eventHandler.addAListener("resumeThought", this);
	g_eventHandler.addAListener("kill", this);
	
},


/**
* Add a thought to the thought queue
*/
addThought: function(callerID, thoughtType, objectType, intensity, loc){
	var exists = false;
	var existingThought;
	for(var i = 0; i< this._thoughtsQueue.length; i++){
		if(this._thoughtsQueue[i].callerID == callerID ){
		    existingThought = this._thoughtsQueue[i];
		    //console.log(this._triggeredThought);
		    //console.log(existingThought);
		   if(this._triggeredThought.thought != existingThought.thought){
		    	existingThought.thought.setIntensity(existingThought.thought.getIntensity()+1);
		    }
			exists = true;
			break;
		}
	}
	
	if(!exists){
		var thought = new Thought_Controller();
		thought.init(thoughtType, intensity, loc);
		var mindObj = {thought:thought, active:false, callerID:callerID, objectType:objectType};
		
		console.log(mindObj);
		if(!this._active){  
			this._thoughtsQueue.unshift(mindObj);
			this._triggeredThought = this._thoughtsQueue[0];
		}else{
		    this._thoughtsQueue.push(mindObj);
		    this._triggeredThought = this._thoughtsQueue[this._thoughtsQueue.length-1];
		}
		
	}else{
		if(objectType == "sticky" || objectType == "mobile"){
			existingThought.thought.setLocation(loc);
		    this._triggeredThought = existingThought;
		}
	}
	
	
	if(!this._active){
	/* If not active start an interval that looks to see if they have left a specified radius from the item */
		//this.fireLatestThought();
		this.startCheckingRadius();
	}
  
  
},


/**
* Fire the latest thought in the thought queue
*/  
fireLatestThought: function(){
	//this._triggeredThought = undefined;
	this._active = true;
	this._thoughtsQueue[0].active = true;
	this._thoughtsQueue[0].thought.startObsessing();
	this._waitingToFire = true;
},


/**
* Triggered from the individual thought
*/ 
thoughtFired: function(data){ // fired from thought back to thought bubble
	if(!this._paused){
		this._thoughtBubble.fireLatestThought(data.type); 
		this._waitingToFire = false;
	}
	
},

pauseThought:function(){
	this._paused = true;
	if(this._waitingToFire){
		this._thoughtsQueue[0].thought.pauseObsessing();
	}	
},

resumeThought:function(){
	this._paused = false;
	if(this._waitingToFire){
		this._thoughtsQueue[0].thought.resumeObsessing();
	}
},

startCheckingRadius: function(){
	clearInterval(this._checkRadiusInterval);
	this._checkRadiusInterval = setInterval(this.didPlayerExitRadius.bind(this), (500)); // use .bind to correct scope
},

/**
* if the player has gone back to check on the object, it clears the thought and then waits to see if the player has left
*/   
didPlayerExitRadius: function(){
	var currentLoc = this._mainController.getPlayerLocation();
	var thought = this._triggeredThought.thought;
	this._thoughtStartPosition = thought.getLocation();
	var xDiff = currentLoc.x - this._thoughtStartPosition.x;
	var yDiff = currentLoc.y - this._thoughtStartPosition.y;
	var distance = this._exitRadii[this._triggeredThought.objectType];
	if(Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)) < 100){
	}else{
		clearInterval(this._checkRadiusInterval);
		/* console.log("can fire now");
			console.log(currentLoc);
			console.log(this._thoughtStartPosition); */
		
		this.fireLatestThought();
	}
},


/**
* if the player has gone back to check on the object, it clears the thought and then waits to see if the player has left
*/   
isOCDWorking: function(){
	var currentLoc = this._mainController.getPlayerLocation();
	var thought = this._thoughtsQueue[0].thought;
	this._thoughtStartPosition = thought.getLocation();
	var xDiff = currentLoc.x - this._thoughtStartPosition.x;
	var yDiff = currentLoc.y - this._thoughtStartPosition.y;
	if(Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)) < 50){
		this._OCDIsWorking = true;
	}else{
		this._OCDIsWorking = false;
	}
},


/* Fired when the thought bubble closes */
respondedOCDTrigger: function(){
	if(this._triggeredThought.thought != undefined){
		//console.log(this._triggeredThought);
		g_eventHandler.dispatchAnEvent("addAssociatedThought",{type:this._triggeredThought.thought.getType()});
	}
	
	this._active = false;
	this.isOCDWorking();
	if(this._OCDIsWorking){
		//PLAY SAME CLIP AGAIN
		var thought = this._thoughtsQueue[0].thought;
		thought.setIntensity(thought.getIntensity()+1);
		this._triggeredThought = thought;
		this.fireLatestThought();
	}else{
	  var thought = this._thoughtsQueue[0].thought;
	  thought.setIntensity(thought.getIntensity()-1);
	  var moveThought = this._thoughtsQueue.shift();
	  if(thought.getIntensity() > 0){
	  	this._thoughtsQueue.push(moveThought);
	  }
	  if(this._thoughtsQueue.length > 0){
	      if(!this._thoughtsQueue[0].active){
	        this._triggeredThought = this._thoughtsQueue[0];
	      	this.startCheckingRadius();
	      }else{
			//if it is active but you are not experiencing OCD(it fired and you are out of range)
	      	this.fireLatestThought();
	      }
	      
	  }else{
	    console.log("thought queue is empty");
	    this._triggeredThought = undefined;
	    g_eventHandler.dispatchAnEvent("checkPositionForFinish",{type:thought.getType()});
	  	
	  }
	}
  
},

kill:function(){
	this._triggeredThought = undefined;
	clearInterval(this._checkRadiusInterval);
	if(this._thoughtsQueue.length > 0){
		for(var i=0; i<this._thoughtsQueue.length; i++){
			this._thoughtsQueue[i].thought.pauseObsessing();
		}
	}
	this._thoughtsQueue = new Array();
	this._OCDIsWorking = false;
	this._active = false;
	this._waitingToFire = false;
	this._paused = false;
}

});