var AnimationFrame = Base.extend({
  construct: function() { 
      	this.SC.construct();
		this._state;
		this._img;
		this._className = "Animation Frame";
  },

  /**
  * @description Initializes the instance
  * @param {Selection} container // the selection on the container(up one level) selector that houses the tile
  * @param {String} id // unique name of the new DIV
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {String} img // reference to an url for the image
  * @param {Interger} width // Max width of the animation tiles.
  * @param {Interger} height // Max height of the animation tiles.
  * @param {?} imgs // Not sure what this is, will most likely remove
  * @return 
  */ 
  init: function(container, id, className, img, width, height, classContainer) {
     	 //console.log([img,width, height]);
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		O(container).appendChild(newDiv); 
		var myImage = this.newImage(img,width,height);
		this._div = $('#'+id);
		this._div.addClass(className);//style the new div
		this._div.append(myImage);//nesting an image tag inside the new div
		//this._div.append('<img src="'+img+'" />');//nesting an image tag inside the new div
		this._img = $('#'+this._id+ ' img');// making a jQuery selector that points to the Image Selector inside of the ID Selector
		this.setDimensions(width,height);
		this.setLoc(0,0);// the images will always be placed in the top corner of the tile
  },
  
  /**
  * @description Set the dimensions and basic styling for the Image Selector
  * @param {Interger} w // the width of the Image Selector
  * @param {Interger} h // the height of the Image Selector
  */
  setDimensions: function(w,h) {
     	this._div.css('width',w);
		this._div.css('height',h);
		this._img.css('width',w);
		this._img.css('height',h);
  },
  
  /**
  * @description Hide the Image Selector
  */
  hide: function() {
     	this._div.hide(0);
  },

  /**
  * @description Show the Image Selector
  */  
  show: function() {
     	this._div.show(0);
  },
  
  newImage: function(src, w, h){
     	var myImage = new Image(w, h);
     	myImage.load(src);
		//myImage.src = src;
		//console.log(src);
		//console.log(myImage);
		return (myImage);
  }
  
  
});