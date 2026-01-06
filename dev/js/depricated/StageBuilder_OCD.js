var StageBuilder_OCD = StageBuilder.extend({
	
	// there will be certain compulsions that are related so if the player reacts to one, 
	//then it will set teh intensity for the others.
	
  construct: function() { 
  		this.SC.construct();
  },
  
  /**
  * Initializes the instance
  * @param {Selection} player // refrence to the Player Class Instance
  * @param {Selection} thoughtBubble // refrence to the Thought Bubble Class Instance
  * @param {Function} getPlayerLoc // returns the player's location, seems like it should be a method of the player instance and not a method of the game engine
  * @return 
  */ 
  addElement: function(type, x, y, width, height, listener, state, thoughtType) {
    	var data = {type:type, x:x, y:y, w:width, h:height, listener:listener, state:state, thoughtType:thoughtType};
    	return(addStagePiece(data));
  }
   
});
