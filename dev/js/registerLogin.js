var User="";
var Password="";
var Email="";
var currentForm ="";

function beginValidateUsernameCreate(form){
	currentForm = form;
	User = form.registerUser.value;
	Password = form.registerPassword.value;
	Email = form.registerEmail.value;
	checkUsername(form.registerUser.value);

}

function beginValidateUsernameAndPassword(form){
	currentForm = form;
	User = form.loginUsername.value;
	Password = form.loginPassword.value;
	checkUsernameAndPassword(User, Password);

}



function validateUsernameCreate(str){
	if(str != 0){
		revealInvalidUsername();
		return false;
	}
	var fail = "";
		fail	+= validateUsername(User);
		fail	+= validatePassword(Password);
		fail	+= validateEmail(Email);
		console.log(fail);

		if(fail==""){
			    currentForm.submit(); 

			return true;
		}else{
			alert(fail);
			return false;					}
			
}

function validateUsernameAndPasswordLogin(str){
	if(str == "notVerified" || str==""){
		//update page for client to respond
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
			return false;					}
			
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

function revealLoggedIn(){
	 clearAll();
	$("#_loggedInCopy").css("display", "block"); 
}

function revealInvalidUsername(){
	$("#_invalidUsername").css("display", "table-cell");
}


function revealInvalidUsernameOrPassword(){
	$("#_invalidUsernameOrPassword").css("display", "table-cell");
}

function revealRegister(){
	clearAll();
	$("#_joinCopy").css("display", "block");
	
}

function revealCreate(){
	clearAll();
	$("#_createCopy").css("display", "block");
	
	
}

function revealError(){
	clearAll();
	$("#_errorCopy").css("display", "block");
	
}

function revealConfirmation(){
	clearAll();
	$("#_confirmationCopy").css("display", "block");
}

function clearAll(){
	$("#_errorCopy").css("display", "none");
	$("#_loginCopy").css("display", "none");
	$("#_joinCopy").css("display", "none");
	$("#_createCopy").css("display", "none");
	$("#_confirmationCopy").css("display", "none");
	$("#_loggedInCopy").css("display", "none");
	$("#_invalidUsername").css("display", "none");
	$("#_invalidUsernameOrPassword").css("display", "none");
}

function back(){
	clearAll();
	$("#_loginCopy").css("display", "block");
}
