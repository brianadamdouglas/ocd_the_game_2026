var MIND = Controller.extend({

// there will be certain compulsions that are related so if the player reacts to one, 
//then it will set teh intensity for the others.

construct: function() { 
		this._player;
		this._thoughtBubble;
		this._thoughtsQueue;
		this._thoughtStartPosition;
		this._triggerOCDInterval;
		this._playerReturnsInterval;
		this._OCDIsWorking;
		this._active;
		this._mainController;
		this._checkRadiusInterval;
		this._triggeredThought;
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
	
	g_eventHandler.addAListener("respondedOCDTrigger", this);
	g_eventHandler.addAListener("thoughtFired", this);
},


/**
* Add a thought to the thought queue
*/
addThought: function(thoughtType, objectType, intensity, loc){
  var exists = false;
  var existingThought;
  for(var i = 0; i< this._thoughtsQueue.length; i++){
  	if(this._thoughtsQueue[i].getType() == thoughtType){
  	    existingThought = this._thoughtsQueue[i];
  	    if(this._triggeredThought != existingThought){
  	    	existingThought.setIntensity(existingThought.getIntensity()+1);
  	    }
  		exists = true;
  		break;
  	}
  }
  
  if(!exists){
  	var thought = new Thought_Controller();
  	thought.init(thoughtType, intensity, loc);
  	this._triggeredThought = thought;
  	//thought.addInstance(thought);
  	if(!this._active){
  		this._thoughtsQueue.unshift(thought);
  	}else{
  	    this._thoughtsQueue.push(thought);
  	}
  	
  }else{
    console.log("i exist");
    if(objectType == "sticky" || objectType == "mobile"){
        console.log(loc);
    	existingThought.setLocation(loc);
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
  this._triggeredThought = undefined;
  this._active = true;
  this._thoughtsQueue[0].startObsessing();
},


/**
* Triggered from the individual thought
*/ 
thoughtFired: function(data){ // fired from thought back to thought bubble
  /* console.log( "thoughtFired");
  console.log( data.type); */
  this._thoughtBubble.fireLatestThought(data.type); 
  //this.isPlayerResponding();
  // once thought has fired begin to look at the position of the player. If it appears that they have gone back to check on the item
  // wait until they stop moving toward the object/ press 's'
  //increase intensity, which triggers the distance to be shorter for the next "walk away"
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
  var thought = this._triggeredThought;
  this._thoughtStartPosition = thought.getLocation();
  var xDiff = currentLoc.x - this._thoughtStartPosition.x;
  var yDiff = currentLoc.y - this._thoughtStartPosition.y;
  
  if(Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)) < 100){
  }else{
    clearInterval(this._checkRadiusInterval);
    console.log("can fire now");
   	console.log(currentLoc);
   	console.log(this._thoughtStartPosition);
    
  	this.fireLatestThought();
  }
},


/**
* if the player has gone back to check on the object, it clears the thought and then waits to see if the player has left
*/   
isOCDWorking: function(){
  var currentLoc = this._mainController.getPlayerLocation();
  var thought = this._thoughtsQueue[0];
  this._thoughtStartPosition = thought.getLocation();
  var xDiff = currentLoc.x - this._thoughtStartPosition.x;
  var yDiff = currentLoc.y - this._thoughtStartPosition.y;
  if(Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)) < 100){
    this._OCDIsWorking = true;
    //this.canOCDTrigger();	
  }else{
  	this._OCDIsWorking = false;
  }
},



respondedOCDTrigger: function(){
  this._active = false;
  this.isOCDWorking();
  if(this._OCDIsWorking){
    //PLAY SAME CLIP AGAIN
    var thought = this._thoughtsQueue[0];
    thought.setIntensity(thought.getIntensity()+1);
    this.fireLatestThought();
    //this._OCDIsWorking = false;
  	//this._triggerOCDInterval = setInterval(this.canOCDRespondManifest.bind(this), 100); // use .bind to correct scope
  }else{
      var thought = this._thoughtsQueue[0];
      thought.setIntensity(thought.getIntensity()-1);
      var moveThought = this._thoughtsQueue.shift();
      if(thought.getIntensity() > 0){
      	this._thoughtsQueue.push(moveThought);
      }
      if(this._thoughtsQueue.length > 0){
          this.fireLatestThought();
      }
  }
  
}

});