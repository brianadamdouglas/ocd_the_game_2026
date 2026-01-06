var OnOffTile = InteractiveTile.extend({
  construct: function() { 
		this.SC.construct();
		this.frames = [0,1];
		this._className = "OnOffTile";
  },


  /**
  * @description turns on one of two frames based on this.interactState
  * @return {}
  */    
  interact: function(){
      this.interactState = ! this.interactState;
      this.frames.unshift(this.frames.pop());
      this._imageDiv.showFrameNum(this.frames[0]);
      this._imageDiv.hideFrameNum(this.frames[1]);
  }
  
});