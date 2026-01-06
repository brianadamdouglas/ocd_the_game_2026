console.log('a');
var event = new Event('build');
var obj = {
    handleEvent: function(e) {
        console.log(e);
    }
};

obj.addEventListener('build',function (e) { console.log('f'); });
obj.dispatchEvent(event);




