//Defines the top level Class
function Class() { }
Class.prototype.construct = function() {};
Class.__asMethod__ = function(func, superClass) {  
  return function() {
      var currentSuperClass = this.SC;
      this.SC = superClass;
      var ret = func.apply(this, arguments);      
      this.SC = currentSuperClass;
      return ret;
  };
};
 
Class.extend = function(def) {
  var classDef = function() {
      if (arguments[0] !== Class) { this.construct.apply(this, arguments); }
  };
 
  var proto = new this(Class);
  var superClass = this.prototype;
 
  for (var n in def) {
      var item = def[n];                      
 
      if (item instanceof Function) {
          item = Class.__asMethod__(item, superClass);
      }
 
      proto[n] = item;
  }
 
  proto.SC = superClass;
  classDef.prototype = proto;
 
  //Give this new class the same static extend method    
  classDef.extend = this.extend;      
  return classDef;
};