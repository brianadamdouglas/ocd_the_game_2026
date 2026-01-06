const IDOverride_View = Tile_View.extend({
construct() { 
	this.SC.construct();
	
},


init(controller,data) {
  	this._controller = controller;
  	
  	var container = data.container;
  	var id = data.id;
  	var className = data.className;
  	var x = data.x;
  	var y = data.y;
  	var width = data.width;
  	var height = data.height;
  	var imgs = data.imgs;
  	var IDOverride = data.IDOverride;
  	
    var myID = IDOverride;
	this.setID(myID);
	var newDiv = document.createElement('div');
	newDiv.id = myID;
	O(container).appendChild(newDiv);//appends the newly created div into the container. 
	this._div = $('#'+myID);//making the jQuery selection reference
	this._div.addClass(className);
	
	var imagesData = {
		id:myID, 
		w:width, 
		h:height, 
		imgs:imgs, 
		startFrame:0
	}
	this._imageController = new Images_Controller();
	var newView = new Images_View();
	this._imageController.bindView(newView,imagesData);

	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this.hide();
}

});