var MIND = Class.extend({
	
	// there will be certain compulsions that are related so if the player reacts to one, 
	//then it will set teh intensity for the others.
	
  construct: function() { 
  		this._player;
  		this._thoughtBubble;
  		this._thoughtsQueue;
  		this._instance;
  		this._playerStartCheckPosition;
  		this._triggerOCDInterval;
  		this._playerReturnsInterval;
  		this._OCDIsWorking;
  		this.gameEnginePlayerPositionCallback;
  		this._playerCurrentPosition;
  		this._active;
  },
  
  /**
  * Initializes the instance
  * @param {Selection} player // refrence to the Player Class Instance
  * @param {Selection} thoughtBubble // refrence to the Thought Bubble Class Instance
  * @param {Function} getPlayerLoc // returns the player's location, seems like it should be a method of the player instance and not a method of the game engine
  * @return 
  */ 
  init: function(player, thoughtBubble) {
    	this._player = player;
    	this._thoughtBubble = thoughtBubble;
    	this._thoughtsQueue = new Array();
    	this._OCDIsWorking = false;
    	this._active = false;
  },
  
  addInstance: function(instance) {
    	this._instance = instance;
  },
  
  /**
  * @description Set the callback property this.gameEngineGetPlayerRectCallback to help position the instance to the Player instance
  * @param {Function} func // reference to getPlayerTransformRect funcion
  */  
  setGameEnginePlayerPositionCallback: function(func){
	this.gameEnginePlayerPositionCallback = func;  
  },
  
  /**
  * @description Set the callback property this.gameEngineGetPlayerRectCallback to help position the instance to the Player instance
  * @param {Function} func // reference to getPlayerTransformRect funcion
  */  
  getPlayerCurrentPosition: function(){
	return this.gameEnginePlayerPositionCallback(); 
  },
  
  
  /**
  * Add a thought to the thought queue
  */
  addThought: function(type, intensity, loc){
      //check thought queue to see if one exists.
      //if so increase the intensity and update the reacted 
      var exists = false;
      for(var i = 0; i< this._thoughtsQueue.length; i++){
      	if(this._thoughtsQueue[i].getType == type){
      	    consoe.log('already exists');
      	    var thought = this._thoughtsQueue[i];
      		thought.setIntensity(thought.getIntensity()+1);
      		exists = true;
      		break;
      	}
      }
      if(!exists){
      	var thought = new Thought();
      	thought.init(this._instance, type, intensity, loc);
      	thought.addInstance(thought);
      	if(!this._active){
      		this._thoughtsQueue.unshift(thought);
      	}else{
      	    this._thoughtsQueue.push(thought);
      	}
      	
      }
      if(!this._active){
      	this.fireLatestThought();
      }
      
      
  },
 
 
  /**
  * Fire the latest thought in the thought queue
  */  
  fireLatestThought: function(){
      this._active = true;
      this._thoughtsQueue[0].startObsessing();
  },
  
  
  /**
  * Triggered from the individual thought
  */ 
  thoughtFired: function(type){ // fired from thought back to thought bubble
      this._thoughtBubble.fireLatestThought(type); 
      //this.isPlayerResponding();
      // once thought has fired begin to look at the position of the player. If it appears that they have gone back to check on the item
      // wait until they stop moving toward the object/ press 's'
      //increase intensity, which triggers the distance to be shorter for the next "walk away"
  },
 
 
  /**
  * if the player has gone back to check on the object, it clears the thought and then waits to see if the player has left
  */   
  isOCDWorking: function(){
      var currentLoc = this.getPlayerCurrentPosition();
      var thought = this._thoughtsQueue[0];
      this._playerStartCheckPosition = thought.getLocation();
      var xDiff = currentLoc.x - this._playerStartCheckPosition.x;
      var yDiff = currentLoc.y - this._playerStartCheckPosition.y;
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
