// console.log("script is working")

// Matching Password and Confirm_Password
$(document).ready(function () {
    $("#cpass").bind("keyup change", function () {
    passcheck($("#pass").val(), $("#cpass").val());
  });
})   


function passcheck(mypass, myconfirmpass){
    if(mypass!=myconfirmpass){
    $("#register").removeAttr("onclick");
    $("#confirm_password_msg").show();
    $("#confirm_password_msg").html('<small class="text-danger">Password did not matched!</small>');
    document.getElementById('register').disabled = true;
    }

    else {
    $("#register").removeAttr("onclick");
    $("#confirm_password_msg").show();
    $("#confirm_password_msg").html('');
    document.getElementById('register').disabled = false;
    }
}


// Password pattern check on browser.
$(document).ready(function () {
  $("#pass").bind("keyup change", function () {
    check_Password($("#pass").val(), $("#confirm_pass").val());
  });
 
  $("#register").click(function () {
    check_Password($("#pass").val(), $("#confirm_pass").val());
  });
});

function check_Password(Pass, Con_Pass) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if(!re.test(Pass)){
  $("#password_msg").show();
  $("#password_msg").html('<small class="text-danger">Must input 1 uppercase, 1 lowercase,1 number and 1 special characters (min: 8)!</small>');
  buttonControl()
  }

  else if(re.test(Pass)){
  $("#password_msg").show();
  $("#password_msg").html('');
  document.getElementById('register').disabled = false;
  }
}

// email validation
function validation() {
  let form = document.getElementById("form");
  let email = document.getElementById("email").value;
  let text = document.getElementById("email_msg");
  let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (!email.match(pattern) || email == "") {
    form.classList.add("valid");
    form.classList.remove("valid");
    form.classList.add("invalid");
    text.innerHTML = "Enter Valid Email";
    text.style.color = "#ff0000";
    buttonControl()

  } 
  else {
    text.innerHTML = "";
    document.getElementById('register').disabled = false;

  }
};


// Disable register button on error
function buttonControl() {
    const form = document.getElementById('form');
    document.getElementById('register').disabled = !form.checkValidity();
}


// Toggle Password 
$(".toggle-password").click(function() {
  $(this).toggleClass("fa-eye fa-eye-slash");
  input = $(this).parent().find("input");
  if (input.attr("type") == "password") {
      input.attr("type", "text");
  } else {
      input.attr("type", "password");
  }
});

// Disable copy-paste.
$('body').bind('copy paste',function(e) {
    e.preventDefault(); return false; 
});