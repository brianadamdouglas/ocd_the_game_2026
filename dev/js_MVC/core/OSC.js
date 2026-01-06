/* 
	Function Name 
		O
	Parameters 
		i - and object or element id. If an object do not put in quotes;
	Returns
		either and object or a reference to an element in the DOM
*/

	const O = (i) => {
		return (typeof i === 'object') ? i : document.getElementById(i);
	};


/* 
	Function Name 
		S
	Parameters 
		i - and object or element id. If an object do not put in quotes;
	Returns
		a reference to an objects style property/subobject
*/

	const S = (i) => {
		return (O(i).style);
	};


/* 
	Function Name 
		C
	Parameters 
		i - class name from the DOM/CSS
	Returns
		an array of elements with the supplied class name;
*/

	const C = (i) => {
		return (document.getElementByClassName(i));
	};
	
	
/* 
	Function Name 
		SA
	Parameters 
		i - and object or element id. If an object do not put in quotes;
		v - value (string)
	Returns
		null
		
		If using SA the user must include the entire style of the object rather than just one attribute, otherwise it sets style to the last attribute
*/

	const SA = (i,v) => {
		O(i).setAttribute('style',v);
	};

