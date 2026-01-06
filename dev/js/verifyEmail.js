function validateEmailForm(form){
	var email = form.confirmEmail.value;
	var fail = "";
	fail	+= validateEmail(email);

	if(fail==""){
		    form.submit(); 
		return true;
	}else{
		alert(fail);
		return false;
	}
			
}

function revealConfirmation(){
	$("#_loginCopy").css("display", "none");
	$("#_confirmationCopy").css("display", "block");
	
}


$(function() {
	var pull 		= $('#pull');
		menu 		= $('nav ul');
		menuHeight	= menu.height();

	$(pull).on('click', function(e) {
		e.preventDefault();
		menu.slideToggle();
	});

	$(window).resize(function(){
		var w = $(window).width();
		if(w > 320 && menu.is(':hidden')) {
			menu.removeAttr('style');
		}
	});
});



