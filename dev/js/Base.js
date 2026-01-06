var Base = Class.extend({
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
  construct: function() { 
  		this._id; // the String name of the Tile Selection
		this._div; // the jQuery reference for the Tile Selection
		this.animationSequence; // 
		this.imageDiv; // a neseted DIV Selection that contains the images that are used for various states of the Tile
		this.images; // Array of images that are nested within the imageDiv -- should probably make this a seperate class or object for easier maintenance
		this.rect; // Object that contains 4 properties(top,right,bottom,left) that contain the bounding box of the Tile
		this._width; // Interger of the width of the Tile
		this._height; // Interger of the height of the Tile
		this._x; // Interger of the x position of the Tile
		this._y; // Interger of the y position of the Tile
		this._defaultX;
		this._defaultY;
		this._className;
		this._imageDiv;
		this.registeredQuads;
		this._state;
		this._defaultState;
		this._classContainer;// reference to the containing selectors Class, used for callback functions 
  },
 
  
  
  /**
  * @description Return the name of the Class
  * @return {String} Name of the class
  */
  getClass: function() {
      	return(this._className);
  },
  
  /**
  * @description Return a reference to the JQuery Tile Selection
  * @return {jQuery} the jquery object
  */
  getDiv: function() {
      	return(this._div);
  },

  /**
  * @description Return the name of the Tile in the DOM
  * @return {String} Name of the Tile
  */
  getID: function() {
      	return (this._id);
  },

  /**
  * @description Set the name of the Tile in the DOM
  * @param {String} id // the name of the Tile
  */  
  setID: function(id) {
     	this._id = id;
  },
  
  /**
  * @description Inspect the CSS classes that are part of the Selector(jQuery)
  * @param {String} c // the name of the class to check for
  * @return {Boolean} contains the class 
  */  
  checkForClass: function(c) {//string
     	return this._div.hasClass(c);
  },
  
  /**
  * @description Return the location(jQuery position) of a Selector
  * @return {Object} position of the Selector in absolute positioning 
  */   
  getLoc: function() {
     	return this._div.position();
  },
  
  /**
  * @description Set the location for the Tile in the Stage Selector
  * @param {Interger} x // the x position of the Tile Selector
  * @param {Interger} y // the y position of the Tile Selector
  */  
  setLoc: function(x,y) {
      	this._x = x;
      	this._y = y;
     	this._div.css('left',x);
		this._div.css('top',y);
  },
  
  /**
  * @description Set the location for use when restarting game
  * @param {Interger} x // the x position of the Tile Selector
  * @param {Interger} y // the y position of the Tile Selector
  */  
  setDefaultLoc: function(x,y) {
      	this._defaultX = x;
      	this._defaultY = y;
  },
  
  /**
  * @description Return the rect Object(top,right,bottom,left);
  * @return {Object} the rect Object(top,right,bottom,left); 
  */  
   getRect: function() {
     	return this.rect;
  },
  
  /**
  * @description Set the rect Object(top,right,bottom,left)for the Tile Selector
  * @param {Interger} x // the x position of the Tile Selector
  * @param {Interger} y // the y position of the Tile Selector
  */ 
  setRect: function(x,y) {
      	this.rect.top = y;
      	this.rect.right = x + this._width;
      	this.rect.bottom = y + this._height;
      	this.rect.left = x;
  },
  
  /**
  * @description Set the dimensions and basic styling for the Tile Selector
  * @param {Interger} w // the width of the Tile Selector
  * @param {Interger} h // the height of the Tile Selector
  */ 
  setDimensions: function(w,h) {
      	this._width = w;
		this._height = h;
     	this._div.css('width',w);
		this._div.css('height',h);
		this._div.css('margin',0);
		this._div.css('padding',0);
		this._div.css('border',0);//"1px blue solid");
  },
  
  /**
  * @description Return the width of the instance's this._div
  * @return {Interger}
  */  
  getState: function() {
     	return this._state;
  },
  
    /**
  * @description Return the width of the instance's this._div
  * @return {Interger}
  */  
  setState: function(state) {
     	this._state = state;
  },
  
  /**
  * @description Return the width of the instance's this._div
  * @return {Interger}
  */  
  getWidth: function() {
     	return this._width;
  },
  
 
  /**
  * @description Return the height of the instance's this._div
  * @return {Interger}
  */ 
  getHeight: function() {
     	return this._height;
  },
  
  
  /**
  * @description Create the this.registeredQuads Array, used for moving an instance on the stage by pushing or carrying
  */   
  createQuadRegistry: function(){
      this.registeredQuads = new Array();
  },
 

  /**
  * @description Add a quadrant to the this.registeredQuads Array
  * @param {Object} quad
  */   
  registerAQuad: function(quad){//quad is an x,y point from multiDimensional Array
      this.registeredQuads.push(quad)
  },
  
  
  rotateDiv : function(degrees){
	this._div.css('-webkit-transform','rotate('+ degrees +'deg)'); 
	this._div.css('-moz-transform','rotate('+ degrees +'deg)');
	this._div.css('transform','rotate('+ degrees +'deg)');

  } ,
  
  hide: function(){
      this._div.hide(0);
  },
  
  show:function(){
   	  this._div.show(0);   
  }
   
  
  
  
  
  
});
