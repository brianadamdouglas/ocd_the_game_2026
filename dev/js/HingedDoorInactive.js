var HingedDoorInactive = InteractiveTile.extend({
  construct: function() { 
		this.SC.construct();
		//console.log("New Door");
		this._className = "HingedDoor";
		
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