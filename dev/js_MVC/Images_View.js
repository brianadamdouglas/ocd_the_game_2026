class Images_View extends View {
  		constructor() { 
		super();
		this.images;
  		this._className = "Images";
  }

	/**
	* Initializes the instance
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
	init(controller, data) {
	
	this._controller = controller;
	
	const container = data.id;
	const id = data.id;
	const width = data.w;
	const height = data.h;
	const imgs = data.imgs;
	const startFrame = data.startFrame;
  
	this.setID(`imagesDiv${id}`);
	const newDiv = document.createElement('div');
	newDiv.id = `imagesDiv${id}`;
	O(container).appendChild(newDiv);//appends the newly created div into the container. 
	this._div = $(`#imagesDiv${id}`);//making the jQuery selection reference		
	
	/* adding image subclass which adds the images into the currenly empty div*/
	this.images = [];
	if(Array.isArray(imgs)){
		for(let i = 0; i< imgs.length; i++){
			this.images[i] = new AnimationFrame_View();
			const frameData = {
				container:`imagesDiv${id}`, 
      			id:`imagesDiv${id}img${i}`,
	      		className:'tile', 
	      		img:imgs[i],
	      		w:width,
	      		h:height,
	      		classContainer:null
			}
			this.images[i].init(this._controller, frameData);
			
		}
	}else{
		this.images[0] = new AnimationFrame_View();
		const frameData = {
			container:`imagesDiv${id}`, 
  			id:`imagesDiv${id}img${1}`,
      		className:'tile', 
      		img:imgs,
      		w:width,
      		h:height,
      		classContainer:null
		}
		this.images[0].init(this._controller, frameData);
		
	}
	
	this.setImagesState(startFrame);
	
	/* adding image subclass */
	
}

	/**
* @description Set the image state of the images DIV -- seems like something to move into it's own class
* @param {Interger} startFrame // frame to display initially
	*/   
	setImagesState(startFrame) {
  if(startFrame !== null){
 	for(let i = 0; i< this.images.length; i++){
 	    this.hideFrameNum(i);
 	}
 	this.showFrameNum(startFrame);
 }
}

	/**
* @description Display specific "frame" in images
* @param {Interger} frameNum // frame to display
	*/   
	showFrameNum(frameNum) {
  if(this.images[frameNum] !== undefined){
    this.images[frameNum].getDiv().show();
  }
}

	/**
* @description Hide specific "frame" in images
* @param {Interger} frameNum // frame to display
	*/   
	hideFrameNum(frameNum) {
  if(this.images[frameNum] !== undefined){
    this.images[frameNum].getDiv().hide();
  }
}


	/**
* @description Returns number of images in a given Selector
* @returns {Interger} images.length // number of "frames"
	*/   
	getImageCount() {
  return(this.images.length);
}

  
  
  
}