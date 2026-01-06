//Defines the top level Class
function Class() { }
Class.prototype.construct = function() {};
Class.__asMethod__ = (func, superClass) => {  
  return function() {
      const currentSuperClass = this.SC;
      this.SC = superClass;
      const ret = func.apply(this, arguments);      
      this.SC = currentSuperClass;
      return ret;
  };
};
 
Class.extend = function(def) {
  const classDef = function() {
      if (arguments[0] !== Class) { this.construct.apply(this, arguments); }
  };
 
  const proto = new this(Class);
  const superClass = this.prototype;
 
  for (const n in def) {
      let item = def[n];                      

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