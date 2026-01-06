var OnOffTileController = InteractiveTile.extend({
  construct: function() { 
		this.SC.construct();
		this.frames = [0,1];
		this.listener; // a Tile Selector's class instance in the Stage Selector that will react when this instance is acted upon
		this.listenerString;// temporarily holds a string refernce to the sprite number; will later be converted to an object reference
		this._className = "OnOffTileController";
  },

  /**
  * @description Set the reference to the listener instance
  * @param {Class} listener // reference to another Tile Selector's Class instance
  */    
  setListener: function(listener) {
      	this.listener = listener;
      	//console.log(listener);
  },

  /**
  * @description Check to see if the Tile Instance has a listener
  * @return {Boolean} does it have a listening tile
  */      
  hasListener: function (){
   		return true;   
  },

  /**
  * @description Set the reference to a String version of listener's Tile Name, in the game engine after building the stage 
  * we register pairs of Selectors that have a symbiotic relationship, it uses the string name to ultimately find it's pait which can be set
  * once all the tiles are on the stage
  * @param {String} listenerString // the listener string reference
  */   
  setListenerString: function(listenerString) {
      	this.listenerString = listenerString;
      	//console.log("stringSet");
  },
 
  /**
  * @description Returns the previously set listenerString used in the registerPairs function in the game engine
  * @return {String} the listener string reference
  */   
  getListenerString: function() {
      	return this.listenerString;
  },
 
  /**
  * @description Return the name of the Class
  * @return {String} Name of the class
  */  
  getClass: function() {
      return("OnOffTileController");
  },
  
  /**
  * @description Similar to setImagesState except that it also switches a boolean this.interactState
  * @return {}
  */  
  interact: function(){
      this.interactState = ! this.interactState;
      if(this._imageDiv.getImageCount()>1){
        this.frames.unshift(this.frames.pop());
      	this._imageDiv.showFrameNum(this.frames[0]);
      	this._imageDiv.hideFrameNum(this.frames[1]);
      }
  },
 
  /**
  * @description Fires the interact function and tells the paired Listener Selector to fire as well
  * @return {}
  */   
  actedUpon: function(){
      this.interact();
      this.listener.interact();
  }
  
});