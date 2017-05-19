$(document).ready(function(){
	$('.ofcIntro .cta').click(function(){
		$('.ofcIntro').slideUp(150);
		$('.ofcForm').slideDown(150);
	});
	$('.registerOfc .cta').click(function(e){
		e.preventDefault();
		var registerform = $('.registerOfc');
		if(validate(registerform))
		{
			registerform.submit();
		}
	});
});
function validate(obj){
	console.log('hi');
	var name = $(obj).find('.registerName');
	var mobile = $(obj).find('.registerMobile');
	var email = $(obj).find('.registerEmail');
	var dateTime = $(obj).find('.registerDateTime');
	var location = $(obj).find('.registerLocation');
	if (name.val() == '' || name.val().length < 3)
	{
		name.addClass('error').focus();
		return false;
	}
	else if (mobile.val() == '' || mobile.val().length < 10)
	{
		name.removeClass('error');
		mobile.addClass('error').focus();
		return false;
	}
	else if (email.val() == '' || email.val().length < 6 || !isNaN(email.val()) || email.val().indexOf('@') == -1 || email.val().indexOf('.') == -1)
	{
		mobile.removeClass('error');
		email.addClass('error').focus();
		return false;
	}
	else if (dateTime.val() == '')
	{
		email.removeClass('error');
		dateTime.addClass('error');
		return false;
	}
	else if (location.val() == '' || location.val().length < 20)
	{
		dateTime.removeClass('error');
		location.addClass('error').focus();
		return false;
	}
	else
	{
		$(obj).find('.ofcFormFields').each(function(){
			$(this).removeClass('error');
		});
		return true;
	}
}