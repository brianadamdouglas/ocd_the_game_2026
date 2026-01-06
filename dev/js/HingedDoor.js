var HingedDoor = InteractiveTile.extend({
  construct: function() { 
		this.SC.construct();
		this.listener1;
		this.listener2;
		this.listenerString1;
		this.listenerString2;
		//console.log("New Door");
		this._className = "HingedDoor";
		
  },
 
  /**
  * @description Set the reference to the listener instance
  * @param {Class} listener // reference to another Tile Selector's Class instance
  */    
  setListener1: function(listener) {
      	this.listener1 = listener;
      	//console.log(listener);
  },
  
  /**
  * @description Set the reference to the listener instance
  * @param {Class} listener // reference to another Tile Selector's Class instance
  */    
  setListener2: function(listener) {
      	this.listener2 = listener;
      	//console.log(listener);
  },

  /**
  * @description Check to see if the Tile Instance has a listener
  * @return {Boolean} does it have a listening tile
  */      
  hasMultipleListeners: function (){
   		return true;   
  },

  /**
  * @description Set the reference to a String version of listener's Tile Name, in the game engine after building the stage 
  * we register pairs of Selectors that have a symbiotic relationship, it uses the string name to ultimately find it's pait which can be set
  * once all the tiles are on the stage
  * @param {String} listenerString // the listener string reference
  */   
  setListenerString1: function(listenerString) {
      	this.listenerString1 = listenerString;
      	//console.log(listenerString);
  },
  
    /**
  * @description Set the reference to a String version of listener's Tile Name, in the game engine after building the stage 
  * we register pairs of Selectors that have a symbiotic relationship, it uses the string name to ultimately find it's pait which can be set
  * once all the tiles are on the stage
  * @param {String} listenerString // the listener string reference
  */   
  setListenerString2: function(listenerString) {
      	this.listenerString2 = listenerString;
      	//console.log(listenerString);
      	//console.log("stringSet");
  },
 
  /**
  * @description Returns the previously set listenerString used in the registerPairs function in the game engine
  * @return {String} the listener string reference
  */   
  getListenerString1: function() {
      	return this.listenerString1;
  },
  
    /**
  * @description Returns the previously set listenerString used in the registerPairs function in the game engine
  * @return {String} the listener string reference
  */   
  getListenerString2: function() {
      	return this.listenerString2;
  },
 
  /**
  * @description Turns the instance this.Interact to true of false. It also shows and hides this._div
  */  
  interact: function(){
      this.interactState = ! this.interactState;
      if(!this.interactState){
        this._imageDiv.hideFrameNum(0);
      	//this.images[0].hide()
      	this.visible = false;
      }else{
        this._imageDiv.showFrameNum(0);
      	//this.images[0].show();
      	this.visible = true;
      }
  },
  
  
  /**
  * @description Public function that calls the private function this.interact. It tells the listener to interact as well.(might change to acted upon); 
  */ 
  actedUpon: function(){
      if(this.interactState){
      	  this.interact();
      	  this.listener1.interact();
	      this.listener2.interact();
	      setCanMoveForward(true);
	      checkForHit();
      }
     
  },
  
  /**
  * @description Sets the visibility to true or false
  */  
  setVisibility: function(b){
      this.interactState = b;
      if(!this.interactState){
        this._imageDiv.hideFrameNum(0);
      	//this.images[0].hide();
      	this.visible = false;
      }else{
        this._imageDiv.showFrameNum(0);
      	//this.images[0].show();
      	this.visible = true;
      }
  }
  
});