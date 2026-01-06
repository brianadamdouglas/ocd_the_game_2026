function O(i){return(typeof i=='object')?i:document.getElementById(i);}
function S(i){return(O(i).style);}
function C(i){return(document.getElementByClassName(i));}
function SA(i,v){O(i).setAttribute('style',v);}