var User="";
var Password="";
var Email="";
var currentForm ="";

function beginValidateUsernameAndEmail(form){
	currentForm = form;
	Email = form.loginEmail.value;
	User = form.loginUsername.value;
	Password = form.newPassword.value;
	checkUsernameAndEmail(User, Email);
}




function validateUsernameAndEmail(str){
	alert(str);
	if(str == "notVerified" || str==""){
		revealInvalidUsernameOrPassword();
		return false;
	}
	var fail = "";
		fail	+= validateUsername(User);
		fail	+= validatePassword(Password);
		console.log(fail);

		if(fail==""){
			    currentForm.submit(); 
			return true;
		}else{
			alert(fail);
			return false;
		}
			
}

function revealLogin(){
	$("#_loginCopy").css("display", "block");
	
}

function revealConfirmation(){
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


function revealInvalidUsernameOrPassword(){
	$("#_invalidUsernameOrPassword").css("display", "table-cell");
}


