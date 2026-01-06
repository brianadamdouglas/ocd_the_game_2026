/**
* @class AnimationFrame_View
* @description The Controller class for the player in the OCD game
*/
const AnimationFrame_View = View.extend({
construct() { 
  	this.SC.construct();
	this._state;
	this._img;
	this._className = "Animation Frame View";
},

/**
* @description Initializes the instance
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return 
*/
init(controller, data) {
	/* console.log('new image frame'); */
	this._controller = controller;
	
  	const container = data.container; 
  	const id = data.id;
  	const className = data.className; 
  	const img = data.img;
  	const width = data.w;
  	const height = data.h;
  	const classContainer = data.classContainer;

 	
	this.setID(id);
	const newDiv = document.createElement('div');
	newDiv.id = id;
	O(container).appendChild(newDiv); 
	const myImage = this.newImage(img,width,height);
	this._div = $(`#${id}`);
	this._div.addClass(className);//style the new div
	this._div.append(myImage);//nesting an image tag inside the new div
	/* console.log(this._div); */
	//this._div.append(`<img src="${img}" />`);//nesting an image tag inside the new div
	this._img = $(`#${this._id} img`);// making a jQuery selector that points to the Image Selector inside of the ID Selector
	this.setDimensions(width,height);
	this.setDefaultLoc(0,0);
	this.setLoc(0,0);// the images will always be placed in the top corner of the tile
	
},

/**
* @description Set the location for the Tile in the Stage Selector
* @param {Interger} x // the x position of the Tile Selector
* @param {Interger} y // the y position of the Tile Selector
*/  
setLoc(x,y) {
	this._x = x;
	this._y = y;
	this._div.css('left',x);
	this._div.css('top',y);
},

/**
* @description Set the dimensions and basic styling for the Image Selector
* @param {Interger} w // the width of the Image Selector
* @param {Interger} h // the height of the Image Selector
*/
setDimensions(w,h) {
 	this._div.css('width',w);
	this._div.css('height',h);
	this._img.css('width',w);
	this._img.css('height',h);
},

/**
* @description Hide the Image Selector
*/
hide() {
 	this._div.hide(0);
},

/**
* @description Show the Image Selector
*/  
show() {
 	this._div.show(0);
},

newImage(src, w, h){
 	const myImage = new Image(w, h);
 	myImage.load(src);
	//myImage.src = src;
	//console.log(src);
	//console.log(myImage);
	return (myImage);
}


});