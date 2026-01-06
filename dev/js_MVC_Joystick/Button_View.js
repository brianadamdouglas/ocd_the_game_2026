var Button_View = Tile_View.extend({
  construct: function() { 
		this.SC.construct();
		
  },
  
  /**
  * @description Initializes the instance
  * @param {Selection} container // the selection on the stage that houses the tile
  * @param {String} id // unique name of the new DIV
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {Interger} x // X coordinate on the stage.
  * @param {Interger} y // Y coordinate on the stage.
  * @param {Interger} width // Max width of the animation tiles.
  * @param {Interger} height // Max height of the animation tiles.
  * @param {Array} imgs // Array of image paths for the animations or various frame states
  * @param {Interger} startFrame // frame that the animation is set on
  * @return 
  */	
  init: function(controller,data) {
      	this._controller = controller;
      	
      	var container = data.container;
      	var id = data.id;
      	var className = data.className;
      	var x = data.x;
      	var y = data.y;
      	var w = data.w;
      	var h = data.h;
      	var imgs = data.imgs;
      	var startFrame = data.startFrame;
      	var IDOverride = data.IDOverride;
      	
        var myID = id;
    	this.setID(myID);
		var newDiv = document.createElement('div');
		newDiv.id = myID;
		if(container != "body"){
			O(container).appendChild(newDiv);//appends the newly created div into the container. 
		} else{
			$('body').append(newDiv);;//appends the newly created div into the container.
		}
		this._div = $('#'+myID);//making the jQuery selection reference
		this._div.addClass(className);
		
		var imagesData = {
			id:data.id, 
			w:data.w, 
			h:data.h, 
			imgs:data.imgs, 
			startFrame:data.startFrame
		}
		this._imageController = new Images_Controller();
		var newView = new Images_View();
		this._imageController.bindView(newView,imagesData);

		this.setDimensions(w,h);
		this.setDefaultLoc(x,y);
		this.setLoc(x,y);
		this.hide();
  }
  
});
