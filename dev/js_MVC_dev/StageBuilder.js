var StageBuilder = Class.extend({
	
	// there will be certain compulsions that are related so if the player reacts to one, 
	//then it will set teh intensity for the others.
	
  construct: function() { ; 
  },
  
  /**
  * @description Initializes the instance
  * @param {Object} data 
  * @param {Array} myArray
  * @param {String} type
  * @return {Interger} position
  */ 
  addElement: function(data, myArray, type) {
      	var position = myArray.length;
      	window[type + position] = data;
      	myArray.push(window[type + position]);
    	return(position);
  }
   
});
