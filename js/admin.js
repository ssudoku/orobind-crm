// javascript for the UI
var d = new Date();
var xMonth = d.getMonth()+1;
var xDay = d.getDate();
var xToday = d.getFullYear() + '-' + (xMonth<10 ? '0' : '') + xMonth + '-' + (xDay<10 ? '0' : '') + xDay;
$(document).on("click", ".clickable", function(e){
	e.preventDefault(); e.stopPropagation();
	var what = $(this).attr("data-type");
	switch (what) {
		case 'coachNameLink':
			var mainParam = $(this).attr("data-coachemail");
			loadCoachInfo(mainParam);
		break;
		case 'userNameLink':
			var mainParam = $(this).attr("data-useremail");
			loadUserInfo(mainParam);
		break;
		case 'rescheduleUserLink':
			var mainParam = $(this).attr("data-email");
			loadRescheduleRequests({"startDate":"2014-01-01","endDate":xToday,"email":mainParam,"mode":"user"});
		break;
		case 'rescheduleCoachLink':
			var mainParam = $(this).attr("data-email");
			loadRescheduleRequests({"startDate":"2014-01-01","endDate":xToday,"email":mainParam,"mode":"coach"});
		break;
		case 'cancelUserLink':
			var mainParam = $(this).attr("data-email");
			loadCancelRequests({"startDate":"2014-01-01","endDate":xToday,"email":mainParam,"mode":"user"});
		break;
		case 'cancelCoachLink':
			var mainParam = $(this).attr("data-email");
			loadCancelRequests({"startDate":"2014-01-01","endDate":xToday,"email":mainParam,"mode":"coach"});
		break;
		case 'leadUser':
			var par = $(this).parents('tr');
			var emailParam = par.attr("data-email");
			var phoneParam = par.attr("data-phone");
			var nameParam = par.attr("data-name");
			var sourceParam = par.attr("data-source") + ' - "' + par.attr("data-campaign") + '"';
			var statusParam = par.attr("data-type");
			var idParam = par.attr("data-id");
			var mod = $('.userHistoryModal');
			mod.find('.userHistoryTitle').text(nameParam);
			mod.find('.userNameField span.value').text(nameParam);
			mod.find('.userMobileField span.value').text(phoneParam);
			mod.find('.userEmail span.value').text(emailParam);
			mod.find('.userStatus span.value').text(statusParam);
			mod.find('.userSource span.value').text(sourceParam);
			mod.fadeIn(100).css("display","flex");
			renderComments(mod,idParam);
		break;
	}
});
function renderComments(mod,idParam)
{
	var par = $(mod).find('.notesWrap');
	if(window.campaignUserData[idParam])
	{
		par.find('.note').detach();
		for(var indx in window.campaignUserData[idParam]["subscriberTrackerDTOs"])
		{
			var appdStr = '<div class="note">';
			appdStr += '<p class="noteText">'+commentData(window.campaignUserData[idParam]["subscriberTrackerDTOs"][indx]["comment"])+'</p>';
			appdStr += '<span class="noteTime">'+window.campaignUserData[idParam]["subscriberTrackerDTOs"][indx]["created"]+'</span>';
			appdStr += '<span class="noteBy">'+window.campaignUserData[idParam]["subscriberTrackerDTOs"][indx]["userName"]+'</span>';
			appdStr += '</div>';
			par.append(appdStr);
		}
	}
}
function commentData(comm)
{
	var retStr = '';
	try{
		commObj = JSON.parse(comm);
		if(commObj && typeof commObj !== "object")
		{
			return comm;
		}
	}
	catch(e)
	{
		return comm;
	}
	
	switch(commObj["type"])
	{
		case "NOTE":
			retStr += '<span class="commentLabel">Note: </span><span class="commentBody">'+commObj["content"]["comment"]+'</span>';
		break;
		case "CLBK":
			retStr += '<span class="commentLabel">Callback: </span><span class="commentSpecial">'+commObj["content"]["when"]+'</span><p class="commentBody">Comment- '+commObj["content"]["comment"]+'</p>';
		break;
		case "DEME":
			retStr += '<span class="commentLabel">Demo Completed: </span><span class="commentBody">'+commObj["content"]["comment"]+'</span>';
		break;
		case "DEMC":
			retStr += '<span class="commentLabel">Demo Canceled: </span><p class="commentBody">'+demoCanceledComment(commObj["content"])+'</p>';
		break;
		case "DROP":
			retStr += '<span class="commentLabel">Not Interested: </span><p class="commentBody">'+userDroppedComment(commObj["content"])+'</p>';
		break;
	}
	return retStr;
}
function demoCanceledComment(content)
{
	var retStr = '';
	if(content["informedCancel"=="true"])
	{
		retStr += 'Type: Was informed; Reason: '+content["informedCancelReason"];
	}
	else if(content["suddenCancel"=="true"])
	{
		retStr += 'Type: Was not informed; Reason: '+content["informedCancelReason"];
	}
	if(content["comment"])
	{
		retStr += '<br>Comment - '+ content["comment"];
	}
	return retStr;
}

function userDroppedComment(content)
{
	var retStr = '';
	if(content["price"=="true"])
	{
		retStr += 'Price was not ok with user; Expected: '+content["priceExpected"] +'<br>';
	}
	if(content["ladyCoach"])
	{
		retStr += 'User expected lady coach<br>';
	}
	if(content["diffCity"])
	{
		retStr += 'Different City: '+ content["diffCityName"] +'<br>';
	}
	if(content["diffService"])
	{
		retStr += 'User wants different service: '+ content["diffServiceName"] +'<br>';
	}
	if(content["comment"])
	{
		retStr += 'Comments: '+ content["comment"];
	}
	return retStr;
}

$(document).on("click", ".modal .inner .close", function(e){
	e.preventDefault(); e.stopPropagation();
	$(this).parents('.modal').fadeOut(150);
});

$(document).on("keyup", function(e){
	if(e.keyCode == 27)
	{
		$('.modal').fadeOut(150);
	}
});

// Function to collapse the table column in user leads table
$(document).on("click", ".leadsList th a.toggle", function(e){
	e.preventDefault(); e.stopPropagation();
	var indx = $(this).parents('th').index();
	$(this).find('i').toggleClass('fa-minus-circle fa-plus-circle');
	$(this).parents('table').find('td, th').each(function () {
		if($(this).index() === indx)
		{
			$(this).toggleClass('collapsed');
		}
	});
});

$(document).on("click", ".leadsList td .userStatusSelect", function(e){
	e.preventDefault(); e.stopPropagation();
	loadUserStatusDropDown({"elem":$(this)});
	window.chosenLead = $(this);
});

$(document).on("change", '.userStatusChangeModal .statusChangeForm input[type="checkbox"]', function(e){
	var pr = $(this).parent('.inputRow');
	if(pr.hasClass('active'))
	{
		pr.removeClass('active loaded');
	}
	else
	{
		pr.addClass('active loaded');
	}
});

$(document).on("click", '.userStatusChangeModal .disabled *', function(e){
	e.preventDefault(); e.stopPropagation();
	return false;
});

$(document).on("change", '.statusChangeForm #unresponsiveUser, .statusChangeForm #unresponsiveUser+label', function(e){
	$('.userStatusChangeModal .sendSMS').toggleClass('disabled');
});

$(document).on("change", '.statusChangeForm #informed, .statusChangeForm #sudden', function(e){
	$('.inputRow').removeClass("active loaded");
	var pr = $(this).parent('.inputRow');
	pr.addClass('active loaded');
});

$(document).on("click", '.userStatusChangeModal .inputRow > i', function(e){
	var pr = $(this).parents('.inputRow');
	$(this).toggleClass('fa-plus-circle fa-minus-circle');
	pr.toggleClass('active');
});

$(document).on("click", ".userStatusChangeModal .innerContainer .statusChangeCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var par = $(this).parents('.innerContainer');
	var uid = window.chosenLead.parents("tr").attr("data-id");
	var now = new Date();
	var timestamp = now.getFullYear() + '-' + zeroPrefix(now.getMonth() + 1) + '-' + zeroPrefix(now.getDate()) + ' ' + zeroPrefix(now.getHours()) + ':' + zeroPrefix(now.getMinutes()) + ':' + zeroPrefix(now.getSeconds());
	if(par.hasClass('callback'))
	{
		var totStr = {"type":"CLBK","content":{"when":moment(par.find('.callBackWhen').val(),"DD-MM-YYYY HH:mm").format("YYYY-MM-DD HH:mm")}};
		var callback = moment(par.find('.callBackWhen').val(),"DD-MM-YYYY HH:mm").format("YYYY-MM-DD HH:mm:ss");
		if(par.find('#unresponsiveUser').is(':checked'))
		{
			totStr["content"]["noResponse"] = "true";
			if(par.find('#notifySMS').is(':checked'))
			{
				totStr["content"]["sendSms"] = "true";
				var smsSent = sendSmsUserCallback({"mobile":window.chosenLead.parents("tr").attr("data-phone"),"name":window.chosenLead.parents("tr").attr("data-name")});
				if(smsSent && smsSent["responseCode"] && smsSent["responseCode"] == 1000)
				{
					showModalMessage({"message":"SMS succesfully sent"});
				}
			}
			else
			{
				totStr["content"]["sendSms"] = "false";
			}
		}
		if(par.find('#needsLadyCoach').is(':checked'))
		{
			totStr["content"]["ladyCoach"] = "true";
		}
		if(par.find('#needsYogaCoach').is(':checked'))
		{
			totStr["content"]["yogaCoach"] = "true";
		}
		if(par.find('#wrongNumber').is(':checked'))
		{
			totStr["content"]["wrongNumber"] = "true";
		}
		if(par.find('textarea').val())
		{
			totStr["content"]["comment"] = par.find('textarea').val();
		}
		var postComment = campaignPostComment(uid,timestamp,JSON.stringify(totStr));

		if(postComment && postComment["responseCode"] && postComment["responseCode"] == 1000)
		{
			campaignPostStatus(uid,callback,"CLBK");
			popHide($('.userStatusChangeModal'));
			$('.searchLeads .searchLeadsCta').click();
		}
	}
	else if(par.hasClass('demofinished'))
	{
		if(par.find('textarea').val())
		{
			par.find('textarea').removeClass('error');
			var cmt = '{"type":"DEME","content":{"comment":"'+ par.find('textarea').val() +'"}}';
			var postComment = campaignPostComment(uid,timestamp,cmt);
			if(postComment && postComment["responseCode"] && postComment["responseCode"] == 1000)
			{
				campaignPostStatus(uid,null,"DEME");
				popHide($('.userStatusChangeModal'));
				$('.searchLeads .searchLeadsCta').click();
			}
		}
		else
		{
			par.find('textarea').addClass('error').focus();
		}
	}
	else if(par.hasClass('democanceled'))
	{
		var parform = $(this).parents('form');
		var dataObj = {"type":"DROP","content":{}};
		var commt = par.find('textarea').val();

		if(!commt && !parform.find('#informed').is(':checked') && !parform.find('#sudden').is(':checked'))
		{
			showModalMessage({"message":"Please enter information"});
			return false;
		}

		if(commt)
		{
			dataObj["content"]["comment"] = commt;
		}

		if(parform.find('#informed').is(':checked'))
		{
			dataObj["content"]["informedCancel"] = "true";
			if(parform.find('#informed').parent('.inputRow').find('.subRow .informedSelect:checked').val())
			{
				parform.find('#informed').parent('.inputRow').removeClass("error");
				dataObj["content"]["informedCancelReason"] = parform.find('#informed').parent('.inputRow').find('.subRow .informedSelect:checked').val();
			}
			else
			{
				parform.find('#informed').parent('.inputRow').addClass("error");
				return false;
			}
		}

		if(parform.find('#sudden').is(':checked'))
		{
			dataObj["content"]["suddenCancel"] = "true";
			if(parform.find('#sudden').parent('.inputRow').find('.subRow .suddenSelect:checked').val())
			{
				parform.find('#sudden').parent('.inputRow').removeClass("error");
				dataObj["content"]["suddenCancelReason"] = parform.find('#sudden').parent('.inputRow').find('.subRow .suddenSelect:checked').val();
			}
			else
			{
				parform.find('#sudden').parent('.inputRow').addClass("error");
				return false;
			}
		}
		var postComment = campaignPostComment(uid,timestamp,JSON.stringify(dataObj));
		if(postComment && postComment["responseCode"] && postComment["responseCode"] == 1000)
		{
			campaignPostStatus(uid,null,"DEMC");
			popHide($('.userStatusChangeModal'));
			$('.searchLeads .searchLeadsCta').click();
		}
	}
	else if (par.hasClass('demoscheduled'))
	{
		if(validateDemo($(this).parents('form')))
		{
			var datObj = {};

			if($(this).parents('form').find("#newUserMale").is(":checked"))
			{
				var gender = "ml";
			}
			else
			{
				var gender = "fl";
			}

			datObj["name"] = $(this).parents('form').find(".leadAddName").val();
			datObj["mobile"] = $(this).parents('form').find(".leadAddMobile").val();
			datObj["email"] = $(this).parents('form').find(".leadAddEmail").val();
			datObj["address"] = $(this).parents('form').find(".leadAddAddress").val();
			datObj["gender"] = gender;
			datObj["dateOfBirth"] = $(this).parents('form').find(".leadAddDob").val().split("-").reverse().join("-") + ' 00:00:00';
			var addState = addNewUser(datObj);
			if(addState && addState["responseCode"] == 1000)
			{
				popHide($(this).parents(".modal"));
				window.addedUserEmail = datObj["email"];
				window.addedUserName = datObj["name"];
				createLeadDemo({"elem":$('.statusChangeForm')});
				campaignPostStatus(uid,null,"DEMS");
				popHide($('.userStatusChangeModal'));
				$('.searchLeads .searchLeadsCta').click();
			}
		}
	}
	else if(par.hasClass('dropped'))
	{
		var parform = $(this).parents('form');
		var dataObj = {"type":"DROP","content":{}};

		if(parform.find('#affordability').is(':checked'))
		{
			dataObj["content"]["price"] = "true";
			if(parform.find('.altPrices .priceRow .priceSelect:checked').length)
			{
				dataObj["content"]["priceExpected"] = parform.find('.altPrices .priceRow .priceSelect:checked + label').text();
				parform.find('.altPrices').removeClass('error');
			}
			else
			{
				parform.find('.altPrices').addClass('error active loaded');
				return false;
			}
		}

		if(parform.find('#ladyCoachCheck').is(':checked'))
		{
			dataObj["content"]["ladyCoach"] = "true";
		}

		if(parform.find('#otherCity').is(':checked'))
		{
			dataObj["content"]["diffCity"] = "true";
			if(parform.find('.altCities .cityRow .citySelect:checked').length)
			{
				dataObj["content"]["diffCityName"] = parform.find('.altCities .cityRow .citySelect:checked + label').text();
				parform.find('.altCities').removeClass('error');
			}
			else
			{
				parform.find('.altCities').addClass('error active loaded');
				return false;
			}
		}

		if(parform.find('#otherService').is(':checked'))
		{
			dataObj["content"]["diffService"] = "true";
			if(parform.find('.altServices .serviceRow .serviceSelect:checked').length)
			{
				dataObj["content"]["diffServiceName"] = parform.find('.altServices .serviceRow .serviceSelect:checked + label').text();
				parform.find('.altServices').removeClass('error');
			}
			else
			{
				parform.find('.altServices').addClass('error active loaded');
				return false;
			}
		}

		var commt = parform.find('textarea').val();
		if(commt)
		{
			dataObj["content"]["comment"] = commt;
		}

		if(!commt && !parform.find('#otherService').is(':checked') && !parform.find('#otherCity').is(':checked') && !parform.find('#ladyCoachCheck').is(':checked') && !parform.find('#affordability').is(':checked'))
		{
			showModalMessage({"message":"Please enter information"});
			return false;
		}
		var postComment = campaignPostComment(uid,timestamp,JSON.stringify(dataObj));
		if(postComment && postComment["responseCode"] && postComment["responseCode"] == 1000)
		{
			campaignPostStatus(uid,null,"DROP");
			popHide($('.userStatusChangeModal'));
			$('.searchLeads .searchLeadsCta').click();
		}
	}
});
function validateDemo(formobj)
{
	var nameval = formobj.find('.leadAddName').val();
	var emailval = formobj.find('.leadAddEmail').val();
	var mobileval = formobj.find('.leadAddMobile').val();
	var dobval = formobj.find('.leadAddDob').val();
	var addressval = formobj.find('.leadAddAddress').val();

	if(nameval == '' || !testName(nameval))
	{
		formobj.find('.leadAddName').addClass('error').focus();
		return false;
	}
	else if(emailval == '' || !validateEmail(emailval))
	{
		formobj.find('.leadAddName').removeClass('error');
		formobj.find('.leadAddEmail').addClass('error').focus();
		return false;	
	}
	else if(mobileval == '' || mobileval.length != 10 || isNaN(mobileval))
	{
		formobj.find('.leadAddEmail').removeClass('error');
		formobj.find('.leadAddMobile').addClass('error').focus();
		return false;	
	}
	else if(dobval == '' || !dateValid(dobval))
	{
		formobj.find('.leadAddMobile').removeClass('error');
		formobj.find('.leadAddDob').addClass('error').focus();
		return false;	
	}
	else if(addressval == '' || addressval.length < 15)
	{
		formobj.find('.leadAddDob').removeClass('error');
		formobj.find('.leadAddAddress').addClass('error').focus();
		return false;	
	}
	else
	{
		formobj.find('.leadAddAddress, .leadAddDob, .leadAddMobile, .leadAddEmail, .leadAddName').removeClass('error');
		return true;
	}
}
function testName(name)
{
	var rx = /^[a-zA-Z ]+$/;
	return rx.test(name);
}

$(document).on("click", ".statusDropDownMenu li.choice", function(e){
	e.preventDefault(); e.stopPropagation();
	loadUserStatusChangeModal({"code":$(this).attr("data-type")});
});

$(document).on("click",".addUserGroupModal .newSessionGroupForm .updateCta, .addUserGroupModal .newSessionGroupForm .createCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var formobj = $(this).parents("form");
	leadAddSessionGroup(formobj);
});
function leadAddSessionGroup(form)
{
	if($(form).find('.ampm').val() == 'AM')
	{
		var timeSlot = $(form).find('.hours option:selected').val()+':'+$(form).find('.minutes option:selected').val()+':00';
	}
	else if ($(form).find('.hours option:selected').val() == 12)
	{
		if($(form).find('.ampm').val() == 'AM')
		{
			var timeSlot = '00:'+$(form).find('.minutes option:selected').val()+':00';
		}
		else
		{
			var timeSlot = '12:'+$(form).find('.minutes option:selected').val()+':00';
		}
	}
	else
	{
		var timeSlot = parseInt(parseInt($(form).find('.hours option:selected').val()) + 12)+':'+$(form).find('.minutes option:selected').val()+':00';
	}
	if($(form).find('.date').val())
	{
		$(form).find('.date').removeClass("error")
		var dateStart = $(form).find('.date').val();
	}
	else
	{
		$(form).find('.date').addClass("error").focus();
		return false;
	}

	if($(form).find('.userAddress').val() && $(form).find('.userAddress').val().length > 10)
	{
		$(form).find('.userAddress').removeClass('error');
		var userAddress = $(form).find('.userAddress').val();
	}
	else
	{
		$(form).find('.userAddress').addClass('error').focus();
		return false;
	}

	var slot = $('.addUserGroupInput.days option:selected').attr("data-slot");
	
	var checkTrial = $(form).find('#trialCheck').is(":checked");
	
	var os = $(form).find('.platform option:selected').attr("data-val");
	
	var mapLat =  $('.addUserGroupInput.latitude').val();
	var mapLong =  $('.addUserGroupInput.longitude').val();
	
	var params = {"timeSlot":timeSlot,"slotType":slot,"latitude":mapLat,"longitude":mapLong};
	
	var ccode = getCoachCode();
	if(!ccode)
	{
		return false;
	}
	
	function getCoachCode()
	{
		var newCoachData = window.clickedCoachResult;
		if(newCoachData && newCoachData['code'] && $('.addUserGroupInput.cCode').val() == newCoachData['userName'])
		{
			$('.addUserGroupInput.cCode').removeClass("error");
			return newCoachData['code'];
		}
		else if(window.currentCoach && window.currentCoach["hashCode"])
		{
			$('.addUserGroupInput.cCode').removeClass("error");
			return window.currentCoach["hashCode"];
		}
		else if($('.addUserGroupInput.coachCode').val())
		{
			$('.addUserGroupInput.cCode').removeClass("error");
			return $('.addUserGroupInput.coachCode').val();
		}
		else
		{
			$('.addUserGroupInput.cCode').addClass("error").focus();
			return false;
		}
	}
	var servType = form.find('.addUserGroupInput.typeService option:selected').attr("data-val");

	var createData = {"timeSlot":timeSlot,"slotType":slot,"latitude":mapLat,"longitude":mapLong, "userEmail":window.addedUserEmail,"userOs":os,"isTrial":checkTrial,"coachCode":ccode,"amountPerSession":"500","startDate":dateStart,"address":userAddress,"typeService":servType};
	//var updateData = {"numOfSession":"500","timeSlot":timeSlot,"amountPerSession":"500","longitude":mapLong,"latitude":mapLat,"slotType":slot,"sessionGroupCode":sessGrpCd,"timings":timing};
	var response = loadUsingPost({"url":urlCreateSessionGroup,"data":createData});
	if(response && response["responseCode"]==1000)
	{
		showModalMessage({"message":"Session group succesfully created","duration":5000});
		if($(form).parents('.modal').attr("data-mode") == "USER")
		{
			campaignPostStatus(window.chosenLead.parents("tr").attr("data-id"),null,"USER");
		}
		popHide($(form).parents('.modal'));
		$('.searchLeads .searchLeadsCta').click();
	}
}

$(document).on("click", ".addUserGroupModal .newSessionGroupForm .fetchCoach", function(e){
	e.preventDefault(); e.stopPropagation();
	var formobj = $(this).parents("form");
	leadsRecommendedCoach(formobj);
});
//Function to get the data for fetching suggested coach
function leadsRecommendedCoach(form)
{
	if(form.find('.addUserGroupInput.date').val() == '')
	{
		form.find('.addUserGroupInput.date').focus();
		return false;
	}
	if($(form).find('.ampm').val() == 'AM')
	{
		if ($(form).find('.hours option:selected').val() == 12)
		{
			var timeSlot = '00:'+$(form).find('.minutes option:selected').val()+':00';
		}
		else
		{
			var timeSlot = $(form).find('.hours option:selected').val()+':'+$(form).find('.minutes option:selected').val()+':00';
		}
	}
	else
	{
		if ($(form).find('.hours option:selected').val() == 12)
		{
			var timeSlot = '12:'+$(form).find('.minutes option:selected').val()+':00';
		}
		else
		{
			var timeSlot = parseInt(parseInt($(form).find('.hours option:selected').val()) + 12)+':'+$(form).find('.minutes option:selected').val()+':00';
		}
	}
	var slot = form.find('.addUserGroupInput.days option:selected').attr("data-slot");
	var mapLat =  form.find('.addUserGroupInput.latitude').val();
	var mapLong =  form.find('.addUserGroupInput.longitude').val();
	var servType = form.find('.addUserGroupInput.typeService option:selected').attr("data-val");
	var params = {"timeSlot":timeSlot,"slotType":slot,"latitude":mapLat,"longitude":mapLong,"typeService":servType};
	var recommendation = getCoach(params);
	//editSession
	if(recommendation && recommendation["listTrainerDetails"][0]["name"] && recommendation["listTrainerDetails"][0]["numberOfUsers"])
	{
		form.find('.addUserGroupInput.coachCode').val(recommendation["listTrainerDetails"][0]["hashCode"]);
		form.find('.fetchedCoachResult .resultItem').html('<span class="coachName">'+ recommendation["listTrainerDetails"][0]["name"] +'</span><span class="userCount">'+ recommendation["listTrainerDetails"][0]["numberOfUsers"] +'</span>').show(100);
		window.currentCoach = recommendation["listTrainerDetails"][0];
		form.find('.fetchedCoachResult .resultItem, .newSessionGroupForm .createCta').show(100);
	}
	else
	{
		form.find('.fetchedCoachResult .resultItem').html('<span class="prim">No coach found</span>').show(100);
		window.currentCoach = null;
		form.find('.addUserGroupInput.coachCode').val('');
	}
}

$(document).on("click", ".sessionsMain .checkInMapLink, .freeSessionsMain .mapLink, .userInfo .userInfoMapLink", function(e){
	e.preventDefault(); e.stopPropagation();
	loadCheckInMap({"elem":$(this)})
});

$(document).on("click", ".freeSessionsMain .fulfillRequest", function(e){
	e.preventDefault(); e.stopPropagation();
	$(".freeSessionsMain .freeSessionsModal").fadeIn(100).css("display","flex");
	var thisTime = moment($(this).attr("data-time"),"X").format("DD-MM-YYYY h:mm a");
	$(".freeSessionsModal .fulfillForm .fulfillInput.timing").val(thisTime);
	$(".freeSessionsModal .infoRow.when .infoValue").text(thisTime);
	$(".freeSessionsModal .infoRow.where .infoValue").text($(this).attr("data-address"));
	$(".freeSessionsModal .infoRow.name .infoValue").text($(this).attr("data-name"));
	$(".freeSessionsModal .infoRow.email .infoValue").text($(this).attr("data-email"));
	$(".freeSessionsModal .infoRow.mobile .infoValue").text($(this).attr("data-mobile"));
});

// Function for the clicks on page number links in payment page
$(document).on("click", ".payments .numberNavLink", function(e){
	e.preventDefault(); e.stopPropagation();
	if($(this).hasClass('first'))
	{
		loadPaymentData({"count":window.paymentPagination["count"],"start":0});
	}
	else if($(this).hasClass('previous'))
	{
		if(window.paymentPagination["current"] === 0)
		{
			return false;
		}
		else
		{
			var startVal = (window.paymentPagination["current"] - 2) * window.paymentPagination["count"];
			loadPaymentData({"count":window.paymentPagination["count"],"start":startVal});
		}
	}
	else if($(this).hasClass('next'))
	{
		if(window.paymentPagination["current"] == window.paymentPagination["pages"])
		{
			return false;
		}
		else
		{
			var startVal = window.paymentPagination["current"] * window.paymentPagination["count"];
			loadPaymentData({"count":window.paymentPagination["count"],"start":startVal});
		}
	}
	else if($(this).hasClass('last'))
	{
		var startVal = (window.paymentPagination["pages"] - 1) * window.paymentPagination["count"];
		loadPaymentData({"count":window.paymentPagination["count"],"start":startVal});
	}
});

// Function for updating the result count on click of the refresh button
$(document).on("click", ".payments .pageCountCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var countVal = $(this).siblings('.pageResultCount').val();
	loadPaymentData({"count":countVal,"start":0});
});

// Function on click of the pagination cta on the payments page
$(document).on("click", ".payments .pageNavCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var countVal = $(this).parents('.paymentsTop').find('.pageResultCount').val();
	if($(this).siblings('.paginationInput').val() !== '')
	{
		var startVal = (parseInt($(this).siblings('.paginationInput').val())-1)*countVal;
	}
	else
	{
		$(this).siblings('.paginationInput').focus();
		return false;
	}
	//window.paymentPagination["count"]
	loadPaymentData({"count":countVal, "start":startVal});
});

//Closing the step in module in reschedule requests
$(document).on("click", ".stepInClose", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.stepIn').fadeOut(100);
});

// Function to post a comment for the user in user leads table
$(document).on("click", ".userCommentForm .userCommentCta", function(e){
	e.preventDefault(); e.stopPropagation();
	if($(this).parent().find('.userStatusComment').val() === '')
	{
		$(this).parent().find('.userStatusComment').addClass('error').focus();
		return false;
	}
	else
	{
		$(this).parent().find('.userStatusComment').removeClass('error');
		var now = new Date();
		var timestamp = now.getFullYear() + '-' + zeroPrefix(now.getMonth() + 1) + '-' + zeroPrefix(now.getDate()) + ' ' + zeroPrefix(now.getHours()) + ':' + zeroPrefix(now.getMinutes()) + ':' + zeroPrefix(now.getSeconds());
		var cmt = '{"type":"NOTE","content":{"comment":"'+ $(this).parent().find('.userStatusComment').val() +'"}}';
		campaignPostComment(window.selectedUser,timestamp,cmt);
		$(this).parents('.modalWrap').fadeOut(100);
		$('.searchLeads .searchLeadsCta').click();
	}
});

// Function to update the user status in the user leads table
$(document).on("click", ".userStatusForm .userStatusCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var element = $(this).parent().find('input[type="radio"]:checked');
	if(element.length > 0)
	{
		campaignPostStatus(window.selectedUser,null,element.attr("data-type"));
		$(this).parents('.modalWrap').fadeOut(100);
	}
});

// Function to handle the submit of datepicker cta
$(document).on("click", ".stepInForm .stepInButton", function(e){
	e.preventDefault(); e.stopPropagation();
	var which = $(this).attr("id");
	var comm = $('.stepInForm .stepInReason').val();
	if(!comm)
	{
		$('.stepInForm .stepInReason').addClass('error').focus();
		return false;
	}
	else
	{
		$('.stepInForm .stepInReason').removeClass('error');
	}
	var sCode = $(this).siblings('.sessCodeHolder').val();
	switch(which){
		case 'stepInDeny':
			var status = 'REJ';
		break;
		case 'stepInAccept':
			var status = 'ACP';
		break;
	}
	if($(this).parents('.cancelsMain').length)
	{
		var canStatus = updateCanRequests({"sessionCode":sCode, "statusCode":status, "comment":comm});
		if(canStatus && canStatus["responseCode"] && canStatus["responseCode"] == 1000)
		{
			$('.cancelsMain .stepIn').fadeOut(150);
			showModalMessage({"message":"Successfully updated"});
		}
		else if(canStatus && canStatus["responseCode"] && canStatus["responseCode"] != 1000)
		{
			var errorText = canStatus["responseCode"] + ': ' + canStatus["response"];
			showModalMessage({"message":errorText});
		}
		else
		{
			showModalMessage({"message":"There was some error. Request not processed","duration":5000});
		}
	}
	else if($(this).parents('.requestsMain').length)
	{
		var rsdStatus = updateRsdRequests({"sessionCode":sCode, "statusCode":status, "comment":comm});
		if(rsdStatus && rsdStatus["responseCode"] && rsdStatus["responseCode"] == 1000)
		{
			$('.requestsMain .stepIn').fadeOut(150);
			showModalMessage({"message":"Successfully updated"});
		}
		else if(rsdStatus && rsdStatus["responseCode"] && rsdStatus["responseCode"] != 1000)
		{
			var errorText = rsdStatus["responseCode"] + ': ' + rsdStatus["response"];
			showModalMessage({"message":errorText});
		}
		else
		{
			showModalMessage({"message":"There was some error. Request not processed"});
		}
	}
});

// Function to handle the submit of datepicker cta
$(document).on("click", ".requestDatepicker .datePickerSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	var newvalues = $('.requestDatepicker');
	if(dateValidate(newvalues))
	{
		var startDate = newvalues.find('input.startDate').val().split("-").reverse().join("-");
		var endDate = newvalues.find('input.endDate').val().split("-").reverse().join("-");
		loadRescheduleRequests({"startDate":startDate,"endDate":endDate});
	}
});

// Function to handle the submit of datepicker cta
$(document).on("click", ".cancelsDatepicker .datePickerSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	var newvalues = $('.cancelsDatepicker');
	if(dateValidate(newvalues))
	{
		var startDate = newvalues.find('input.startDate').val().split("-").reverse().join("-");
		var endDate = newvalues.find('input.endDate').val().split("-").reverse().join("-");
		if(window.cancelsMode)
		{
			switch(window.cancelsMode){
				case "user":
					loadCancelRequests({"startDate":startDate,"endDate":endDate,"mode":"user","email":window.cancelEmail});
				break;
				case "coach":
					loadCancelRequests({"startDate":startDate,"endDate":endDate,"mode":"coach","email":window.cancelEmail});
				break;
			}
		}
		else
		{
			loadCancelRequests({"startDate":startDate,"endDate":endDate});
		}
	}
});

function dateValidate(obj)
{
	var sDate = $(obj).find('input.startDate'); var sArray = sDate.val().split("-").reverse();
	var eDate = $(obj).find('input.endDate'); var eArray = eDate.val().split("-").reverse();
	if(sDate.val() === '' || sArray.join("").length !== 8 || sArray.length !== 3)
	{
		sDate.addClass('error').focus();
		return false;
	}
	else if ( sArray[0].length !== 4 || parseInt(sArray[0]) < 2014 || parseInt(sArray[0]) > 2100)
	{
		sDate.addClass('error').focus();
		return false;
	}
	else if ( sArray[1].length !== 2 || parseInt(sArray[1]) < 1 || parseInt(sArray[1]) > 12)
	{
		sDate.addClass('error').focus();
		return false;
	}
	else if ( sArray[2].length !== 2 || parseInt(sArray[2]) < 1 || parseInt(sArray[2]) > 31 || !isValidDateForMonth(parseInt(sArray[2]),parseInt(sArray[1]),parseInt(sArray[0])))
	{
		sDate.addClass('error').focus();
		return false;
	}
	else 
	{
		sDate.removeClass('error');
	}
	if(eDate.val() === '' || eArray.join("").length !== 8 || eArray.length !== 3)
	{
		eDate.addClass('error').focus();
		return false;
	}
	else if ( eArray[0].length !== 4 || parseInt(eArray[0]) < 2014 || parseInt(eArray[0]) > 2100)
	{
		eDate.addClass('error').focus();
		return false;
	}
	else if ( eArray[1].length !== 2 || parseInt(eArray[1]) < 1 || parseInt(eArray[1]) > 12)
	{
		eDate.addClass('error').focus();
		return false;
	}
	else if ( eArray[2].length !== 2 || parseInt(eArray[2]) < 1 || parseInt(eArray[2]) > 31 || !isValidDateForMonth(parseInt(eArray[2]),parseInt(eArray[1]),parseInt(eArray[0])))
	{
		eDate.addClass('error').focus();
		return false;
	}
	else 
	{
		eDate.removeClass('error');
	}
	return true;
}
$(document).on("click", ".requestItemCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.stepIn').fadeIn(100).css('display','flex');
	var sessCode = $(this).attr("data-sessioncode");
	for (var i in window.rescheduleList)
	{
		if(window.rescheduleList[i]["sessionCode"] === sessCode)
		{
			$('.stepIn span.userName').text(window.rescheduleList[i]["userName"]);
			$('.stepIn .fromDate').text(window.rescheduleList[i]["fromDate"]);
			if(window.rescheduleList[i]["toDate"])
			{
				$('.stepIn .toDate').text(window.rescheduleList[i]["toDate"]);
			}
			else
			{
				$('.stepIn .toDate').text('Later');
			}
			$('.stepIn .sessCodeHolder').val(sessCode);
			$('.stepIn span.coachName').text(window.rescheduleList[i]["coachName"]);
		}
	}
});
$(document).on("click", ".cancelItemCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.stepIn').fadeIn(100).css('display','flex');
	var sessCode = $(this).attr("data-sessioncode");
	for (var i in window.cancelsList)
	{
		if(window.cancelsList[i]["sessionCode"] === sessCode)
		{
			$('.stepIn span.userName').text(window.cancelsList[i]["userName"]);
			$('.stepIn .sessCodeHolder').val(sessCode);
			$('.stepIn span.coachName').text(window.cancelsList[i]["coachName"]);
		}
	}
});
$(document).on("click", ".orderCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.orderActions').fadeIn(100).css('display','flex');
	window.orderCode = $(this).attr("data-code");
	window.orderSubCode = $(this).attr("data-subcode");
});
$(document).on("click", ".orderActionsInner .close", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.orderActionComment').removeClass('error');
	$('.orderActions').fadeOut(100);
	window.orderCode = '';
	window.orderSubCode = '';
	window.orderStatus = '';
	window.orderComment = '';
});
$(document).on("click", ".orderActionsInner button", function(e){
	e.preventDefault(); e.stopPropagation();
	if($('.orderActionComment').val() !== '')
	{
		$('.orderActionComment').removeClass('error');
		$('.orderActions').fadeOut(100);
		window.orderComment = $('.orderActionComment').val();
		if($(this).hasClass("orderActionCancel"))
		{
			window.orderStatus = "CAN";
		}
		else if($(this).hasClass("orderActionAuthorize"))
		{
			window.orderStatus = "AUT";
		}
		else if($(this).hasClass("orderActionFulfill"))
		{
			window.orderStatus = "FUL";
		}
		updateOrderStatus(window.orderCode,window.orderSubCode,window.orderStatus,window.orderComment);
	}
	else
	{
		$('.orderActionComment').addClass('error').focus();
	}
});
$(document).on("click", ".dietTop .fetchPlanCta", function(e){
	e.preventDefault(); e.stopPropagation();
	if(!$('.dietTop .fetchPlan .fetchEmail').val() || !validateEmail($('.dietTop .fetchPlan .fetchEmail').val()))
	{
		$('.dietTop .fetchPlan .fetchEmail').addClass('error').focus();
		return false;
	}
	else
	{
		$('.dietTop .fetchPlan .fetchEmail').removeClass('error');
		var x = getDietData($('.dietTop .fetchPlan .fetchEmail').val());
		if(x && x["responseCode"] && x["responseCode"] == 1000)
		{
			window.dietEmail = $('.dietTop .fetchPlan .fetchEmail').val();
			loadDietPlanTable(x);
		}
		else
		{
			var errmsg = x["responseCode"] + ' - ' + x["response"]
			showModalMessage({"message":errmsg});
		}
	}
});

$(document).on('change','.updateSessionGroupForm .toggleDays input[type="radio"]', function(){
	var tid = $(this).attr("id");
	if(tid == "daysOld")
	{
		$('.updateSessionGroupForm .newDaysRow, .updateSessionGroupForm .newTimeRow').hide();
		$('.updateSessionGroupForm .oldDaysRow, .updateSessionGroupForm .oldTimeRow').show();
	}
	else if(tid == "daysNew")
	{
		$('.updateSessionGroupForm .newDaysRow, .updateSessionGroupForm .newTimeRow').show();
		$('.updateSessionGroupForm .oldDaysRow, .updateSessionGroupForm .oldTimeRow').hide();
	}
});

editSelDays = [];
$(document).on("click",".updateSessionGroupForm .weekdays", function(e){
	e.preventDefault(); e.stopPropagation();
	$(this).toggleClass('chosen');

	var daystr = $(this).attr("data-day");

	var timeselstr = ".updateSessionGroupForm .newTimeRow .timeSlotContainer." + daystr;
	$(timeselstr).toggleClass("active");
});

var uploadFile;
$(document).on("change", ".dietMain .uploadPlan .uploadFile", function(e){
	uploadFile = e.target.files;
});
$(document).on("click", ".dietTop .uploadCta", function(e){
	loadDietModule();
});
$(document).on("click", ".dietMain .uploadPlan .uploadPlanCta", function(e){
	e.preventDefault(); e.stopPropagation();
	if(validateUploadForm($(this).parent('form')))
	{
		var fd = new FormData();
		fd.append("file", uploadFile[0]);
	    fd.append("email", $(this).parent('form').find('.uploadEmail').val());
	    var dataUploadStatus = postDietplan(fd);
	    if(dataUploadStatus && dataUploadStatus["responseCode"] && dataUploadStatus["responseCode"] == 1000)
	    {
	    	showModalMessage({"message":"Diet plan uploaded succesfully"});
	    	$(".dietMain .uploadPlan").reset();
	    }
	    else
	    {
	    	var errMsg = dataUploadStatus["responseCode"] + ": " + dataUploadStatus["response"]
	    	showModalMessage({"message":errMsg,"duration":5000});
	    }
	}
	else
	{
		return false;
	}
});
function validateUploadForm($form)
{
	if(!$form.find('.uploadEmail').val() || !validateEmail($form.find('.uploadEmail').val()))
	{
		$form.find('.uploadEmail').focus().addClass('error');
		return false;
	}
	else if(!uploadFile || !uploadFile.length)
	{
		$form.find('.uploadEmail').removeClass('error');
		$form.find('.uploadFile').focus().addClass('error');
		return false;
	}
	else
	{
		$form.find('.uploadFile').removeClass('error');
		return true;
	}
}
$(document).on("click", ".userPayments .addReferralCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.referralCreditsModal'));
});
$(document).on("click", ".userPayments .referralCreditsCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var toEmail = $(this).parent('form').find('.referralCreditsToEmail').val();
	if(toEmail && validateEmail(toEmail))
	{
		$(this).parent('form').find('.referralCreditsToEmail').removeClass('error');
		var addedData = addUserReferral({"fromEmail":window.userEmail,"toEmail":toEmail});
		if(addedData && addedData["responseCode"] && addedData["responseCode"] == 1000)
		{
			popHide($('.referralCreditsModal'));
			showModalMessage({"message":"Referral credits added succesfully","duration":1000});
			setTimeout(function(){
				loadUserInfo(window.userEmail);
				setTimeout(function(){
					$('.userTabs .tabPayments').click();
				},100);
			},1000);
		}
	}
	else
	{
		$(this).parent('form').find('.referralCreditsToEmail').focus().addClass('error');
	}
});

$(document).on("click", ".userPayments .addSocialCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.socialCreditsModal'));
});
$(document).on("click", ".userPayments .socialCreditsCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var amount = $(this).parent('form').find('.socialCreditsAmount').val();
	if(amount && !isNaN(amount))
	{
		$(this).parent('form').find('.socialCreditsAmount').removeClass('error');
		var addedData = addUserSocial({"fromEmail":window.userEmail,"amount":amount});
		if(addedData && addedData["responseCode"] && addedData["responseCode"] == 1000)
		{
			popHide($('.socialCreditsModal'));
			showModalMessage({"message":"Social credits added succesfully","duration":1000});
			setTimeout(function(){
				loadUserInfo(window.userEmail);
				setTimeout(function(){
					$('.userTabs .tabPayments').click();
				},100);
			},1000);
		}
	}
	else
	{
		$(this).parent('form').find('.socialCreditsAmount').focus().addClass('error');
	}
});

$(document).on("click", ".userPayments .offlinePaymentCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.offlinePaymentModal'));
});
$(document).on("click", ".userPayments .offlinePaymentSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	if(validateOfflinePayment($(this).parent('form')))
	{
		var form = $(this).parent('form');
		var qty = form.find('input.offlinePaymentQty').val();
		var checked = form.find('input[name="offlinePaymentMethod"]:checked').attr("data-mode");
		var comm = form.find('textarea').val();
		var offlinePaymentData = {"email":window.userEmail,"mode":checked,"amount":qty,"comment":comm};
		if(form.find('input.offlinePaymentRef').val() && !isNaN(form.find('input.offlinePaymentRef').val()))
		{
			offlinePaymentData["refDiscount"] = form.find('input.offlinePaymentRef').val();
		}
		else
		{
			offlinePaymentData["refDiscount"] = 0;
		}
		if(form.find('input.offlinePaymentSoc').val() && !isNaN(form.find('input.offlinePaymentSoc').val()))
		{
			offlinePaymentData["socDiscount"] = form.find('input.offlinePaymentSoc').val();
		}
		else
		{
			offlinePaymentData["socDiscount"] = 0;
		}
		if(form.find('input.offlinePaymentAdv').val() && !isNaN(form.find('input.offlinePaymentAdv').val()))
		{
			offlinePaymentData["advpayDiscount"] = form.find('input.offlinePaymentAdv').val();
		}
		else
		{
			offlinePaymentData["advpayDiscount"] = 0;
		}
		if(form.find('input.offlinePaymentPromo').val() && !isNaN(form.find('input.offlinePaymentPromo').val()))
		{
			offlinePaymentData["promoAmount"] = form.find('input.offlinePaymentPromo').val();
		}
		else
		{
			offlinePaymentData["promoAmount"] = 0;
		}
		var submittedData = submitOfflinePayment(offlinePaymentData);
		if(submittedData && submittedData["responseCode"] && submittedData["responseCode"] == 1000)
		{
			popHide($('.offlinePaymentModal'));
			showModalMessage({"message":"Payment added succesfully","duration":1000});
			setTimeout(function(){
				loadUserInfo(window.userEmail);
				setTimeout(function(){
					$('.userTabs .tabPayments').click();
				},100);
			},1000);
		}
	}
});
function validateOfflinePayment(form)
{
	var qty = form.find('input.offlinePaymentQty').val();
	var checked = form.find('input[name="offlinePaymentMethod"]:checked');
	var comm = form.find('textarea').val();
	if(!qty || isNaN(qty))
	{
		form.find('input.offlinePaymentQty').addClass('error').focus();
		return false;
	}
	else if(!checked.length)
	{
		form.find('input.offlinePaymentQty').removeClass('error');
		form.find('input[name="offlinePaymentMethod"]').addClass('error');
		return false;
	}
	else if(!comm || comm.length < 5)
	{
		form.find('input[name="offlinePaymentMethod"]').removeClass('error');
		form.find('textarea').addClass('error').focus();
		return false;
	}
	else
	{
		form.find('input.offlinePaymentQty').removeClass('error');
		form.find('input[name="offlinePaymentMethod"]').removeClass('error');
		form.find('textarea').removeClass('error');
		return true;
	}
}

$(document).on("click", ".userInfo .substituteCta", function(e){
	e.preventDefault(); e.stopPropagation();
	window.clickedCoachResult = null;
	popShow($('.userInfo .substituteCoachModal'));
});

$(document).on("click", ".userInfo .activateTrialCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.userInfo .convertGroupModal'));
});

$(document).on("click", ".userInfo .updateGrpCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.userInfo .updateSessionGroupModal'));
	if(window.newSchemeTimings)
	{
		var str = '<div class="daysContainer"><h4>Current workout days</h4>';
		$('.toggleDays #daysNew').click();
		for(var x in window.newSchemeTimings)
		{
			var objval = window.newSchemeTimings[x];
			for(var y in objval)
			{
				str += '<div class="days">';
				str += '<span class="day">'+ y +'</span>';
				str += '<span class="time">' + objval[y] + '</span>';
				str += '</div>';
				var selstr = '.daysOfWeek .weekdays[data-day="'+y+'"]';
				if(!$(selstr).hasClass('chosen')){
					$(selstr).click();
				}
				var selstr2 = '.timeSlotContainer.'+y+' #' +y;
				$(selstr2).val(objval[y]);
			}
		}
		str += "</div>"
		$('.updateSessionGroupModal .currentValues.days').hide();
		if(!$('.userInfo .updateSessionGroupModal .daysContainer').length)
		{
			$('.updateSessionGroupModal .currentValues.timeslot').hide().after(str);	
		}
	}
});

$(document).on("click", ".userInfo .migrateCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.userInfo .migrateModal'));
});

$(document).on("click", ".userInfo .editInfoCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.userInfo .editInfoModal'));
});

$(document).on("click", ".userInfo .pauseCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.userInfo .pauseGroupModal'));
});

$(document).on("click", ".coachInfo .editCoachInfo", function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.coachInfo .editInfoModal'));
});

$(document).on("click", ".pauseGroupModal .pauseAffirmCta", function(e){
	e.preventDefault(); e.stopPropagation();
	if(window.isPaused == true)
	{
		var paused = 0;
	}
	else
	{
		var paused = 1;
	}
	var pause = pauseGroup({"email":window.userEmail,"flag":paused});
	if(pause && pause["responseCode"] && pause["responseCode"]==1000)
	{
		popHide($('.pauseGroupModal'));
		loadUserInfo(window.userEmail);
		$('.userTabs .tabInfo').click();
	}
});

$(document).on("click", ".convertGroupModal .convertAffirmCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var convert = convertTrialUser({"email":window.userEmail});
	if(convert && convert["responseCode"] && convert["responseCode"]==1000)
	{
		popHide($('.convertGroupModal'));
		loadUserInfo(window.userEmail);
		$('.userTabs .tabInfo').click();
	}
});
function validateEditUserForm(form)
{
	var name = form.find('.editInfoName').val();
	var mobile = form.find('.editInfoMobile').val();
	var height = form.find('.editInfoHeight').val();
	var weight = form.find('.editInfoWeight').val();

	if(!name || name.length < 3)
	{
		form.find('.editInfoName').addClass('error').focus();
		return false;
	}
	else if(!mobile || mobile.length != 10 || isNaN(mobile))
	{
		form.find('.editInfoName').removeClass('error');
		form.find('.editInfoMobile').addClass('error').focus();
		return false;
	}
	else if(height && isNaN(height))
	{
		form.find('.editInfoName').removeClass('error');
		form.find('.editInfoMobile').removeClass('error');
		form.find('.editInfoHeight').addClass('error').focus();
		return false;
	}
	else if(weight && isNaN(weight))
	{
		form.find('.editInfoName').removeClass('error');
		form.find('.editInfoMobile').removeClass('error');
		form.find('.editInfoHeight').removeClass('error');
		form.find('.editInfoWeight').addClass('error').focus();
		return false;
	}
	else
	{
		form.find('.editInfoName').removeClass('error');
		form.find('.editInfoMobile').removeClass('error');
		form.find('.editInfoHeight').removeClass('error');
		form.find('.editInfoWeight').removeClass('error');
		return true;
	}
}

$(document).on("change", ".userOnboardingModal #trialCheck", function(e){
	$('.userOnboardingModal .trialDateRow').toggle(150).css("display","flex");
});

$(document).on("click", ".editInfoModal .editInfoSubmitCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var $form = $(this).parents('form');
	if(validateEditUserForm($form))
	{
		var datObj = {"name":$form.find(".editInfoName").val(),"email":window.userEmail,"mobile":$form.find(".editInfoMobile").val()};
		if($form.find('#editInfoMale').is(":checked"))
		{
			var gender = "ml";
			datObj["gender"] = gender;
		}
		else if($form.find('#editInfoFemale').is(":checked"))
		{
			var gender = "fl";
			datObj["gender"] = gender;
		}
		if($form.find(".editInfoDob").val())
		{
			datObj["dateOfBirth"] = $form.find(".editInfoDob").val().split("-").reverse().join("-") + ' 00:00:00';
		}
		if($form.find(".editInfoHeight").val())
		{
			datObj["height"] = $form.find(".editInfoHeight").val();
		}
		if($form.find(".editInfoWeight").val())
		{
			datObj["weight"] = $form.find(".editInfoWeight").val();
		}
		var edited = updateUserInfo($.param(datObj));
		if(edited && edited["responseCode"] && edited["responseCode"] == 1000)
		{
			popHide($('.editInfoModal'));
			if($(this).attr("data-mode") && $(this).attr("data-mode") == "coach")
			{
				loadCoachInfo(window.userEmail);
				$('.coachTabs .tabInfo').click();
			}
			else
			{
				loadUserInfo(window.userEmail);
				$('.userTabs .tabInfo').click();
			}
		}
	}
});

$(document).on("click",".newReportsWhen .newReportsWhenSelect .whenText, .newReportsWhen .newReportsWhenSelect .whenToggle", function(e){
	e.preventDefault(); e.stopPropagation();
	$(this).parents('.newReportsWhen').find(".newReportsDatepicker").slideToggle(100);
});

$(document).on("click",".newReportsWhen .datePickerInput .datePickerSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	var form = $(this).parents('form');
	if(!form.find('.startDate').val())
	{
		form.find('.startDate').addClass("error").focus();
		return false;
	}
	else if (!form.find('.endDate').val())
	{
		form.find('.startDate').removeClass("error");
		form.find('.endDate').addClass("error").focus();
		return false;
	}
	else
	{
		form.find('.startDate').removeClass("error");
		form.find('.endDate').removeClass("error");
		loadNewReports({"fromDate":form.find('.startDate').val(),"toDate":form.find('.endDate').val()});
	}
});

$(document).on("click",".userInfo .updateSessionGroupModal .updateSessionGroupForm .updateFormCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var form = $(this).parents('form');

	if($(form).find('#daysOld').is(":checked"))
	{
		var updateData = updateSessGrpOldDays(form);
	}
	else if($(form).find('#daysNew').is(":checked"))
	{
		var updateData = updateSessGrpNewDays(form);
	}

	var sessionGrpUpdated = updateSessionGroup(updateData);
	if(sessionGrpUpdated && sessionGrpUpdated["responseCode"] && sessionGrpUpdated["responseCode"]==1000)
	{
		showModalMessage({"message":"Success"});
		loadUserInfo(window.userEmail);
		$('.userTabs .tabInfo').click();
	}
	else
	{
		showModalMessage({"message":sessionGrpUpdated["responseCode"] + ": " + sessionGrpUpdated["response"]});
	}
});

function updateSessGrpOldDays(form)
{
	var days = form.find('.updateFormDays option:selected').attr("data-slot");
	if($(".updateFormInput.ampm option:selected").text() == 'PM')
	{
		var timeSlot = parseInt(parseInt(form.find(".updateFormInput.hours option:selected").text()) + 12) + ":" + form.find(".updateFormInput.minutes option:selected").text() + ":00";
	}
	else
	{
		var timeSlot = form.find(".updateFormInput.hours option:selected").text() + ":" + form.find(".updateFormInput.minutes option:selected").text() + ":00";
	}
	var timings = form.find(".updateFormInput.hours option:selected").text() + ":" + form.find(".updateFormInput.minutes option:selected").text() + form.find(".updateFormInput.ampm option:selected").text() + " Onwards";
	var updateData = {"timeSlot":timeSlot,"timings":timings,"email":window.userEmail,"slotType":days};
	var latitude = form.find(".updateFormInput.latitude").val();
	var longitude = form.find(".updateFormInput.longitude").val();
	if(latitude && longitude && !isNaN(latitude) && !isNaN(longitude))
	{
		updateData["latitude"] = latitude;
		updateData["longitude"] = longitude;
	}
	return updateData;
}

function updateSessGrpNewDays(form)
{
	var wrktDays = '';
	$(form).find('.daysOfWeek .chosen').each(function(){
		//first get the day code
		var dCode = $(this).attr("data-day");
		//then check the value inside the time input with the same day code
		var tSel = ".updateSessionGroupForm .newTimeRow #" + dCode;
		var tVal = $(tSel).val();

		//stitch them together like this mon-06:35::tue-07:40::wed-18:35 in wrktDays
		wrktDays += dCode + "-" + tVal + "::";
	});
	wrktDays = wrktDays.slice(0,-2);

	var updateData = {"wrktDays":wrktDays,"email":window.userEmail};
	var latitude = form.find(".updateFormInput.latitude").val();
	var longitude = form.find(".updateFormInput.longitude").val();
	if(latitude && longitude && !isNaN(latitude) && !isNaN(longitude))
	{
		updateData["latitude"] = latitude;
		updateData["longitude"] = longitude;
	}
	return updateData;
}

$(document).on("click",".addReportDateModal .addReportCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var form = $(this).parents('form');
	var serialdata = {};
	form.find("input").not(".addReportInput.date").each(function(){
		var key = $(this).attr("name");
		serialdata[key] = $(this).val() || "";
	});
	if(!form.find(".addReportInput.date").val())
	{
		form.find(".addReportInput.date").addClass("error").focus();
		return false;
	}
	else
	{
		form.find(".addReportInput.date").removeClass("error");
		var date = form.find(".addReportInput.date").val();
	}
	var reportAdded = addReportDate({"date":date,"data":serialdata});
	if(reportAdded && reportAdded["responseCode"] && reportAdded["responseCode"] == 1000)
	{
		showModalMessage({"message":"Success"});
		popHide($(".addReportDateModal"));
		loadNewReports(window.currentReportedDates);
	}
	else
	{
		showModalMessage({"message":reportAdded["responseCode"] + " " + reportAdded["response"]});
	}
});

$(document).on("click", ".pauseGroupModal .pauseDenyCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popHide($('.pauseGroupModal'));
});

$(document).on("click", ".convertGroupModal .convertDenyCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popHide($('.convertGroupModal'));
});

$(document).on("click", ".substituteCoachModal .substitueFormCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var input = $(this).parent('form').find('.substitueFormCode');
	var newCoachData = window.clickedCoachResult;
	if(newCoachData && newCoachData['code'] && input.val() == newCoachData['userName'])
	{
		input.removeClass('error');
		if($('#substituteCoachMode').is(':checked'))
		{
			var substituted = substituteCoach({"coachCode":newCoachData['code'],"email":window.userEmail,"mode":"perm"});
		}
		else
		{
			var substituted = substituteCoach({"coachCode":newCoachData['code'],"email":window.userEmail,"mode":"temp"});
		}
	}
	else
	{
		input.addClass('error').focus();
		return false;
	}
	if(substituted && substituted["responseCode"] && substituted["responseCode"] == 1000)
	{
		popHide($('.substituteCoachModal'));
		loadUserInfo(window.userEmail);
		$('.userTabs .tabInfo').click();
	}
});

$(document).on("click", ".invoiceCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.invoiceConfirmation').fadeIn(100).css('display','flex');
	$('.invoiceConfirmation p.message').hide();
	window.paymentEmail = $(this).attr("data-email");
	window.paymentCell = $(this).parent('td');
});
$(document).on("click", ".invoiceConfirmationInner button", function(e){
	e.preventDefault(); e.stopPropagation();
	if($(this).hasClass('returning'))
	{
		if($(this).parent().find('.invoiceConfirmationCode').val() === '')
		{
			triggerInvoiceSend(window.paymentEmail,window.paymentCell,"returning");
		}
		else
		{
			triggerInvoiceSendPromo(window.paymentEmail,window.paymentCell,"returning",$(this).parent().find('.invoiceConfirmationCode').val());
		}
	}
	else
	{
		if($(this).parent().find('.invoiceConfirmationCode').val() === '')
		{
			triggerInvoiceSend(window.paymentEmail,window.paymentCell,"new");
		}
		else
		{
			triggerInvoiceSendPromo(window.paymentEmail,window.paymentCell,"new",$(this).parent().find('.invoiceConfirmationCode').val());
		}
	}
});

$(document).on("click", ".landingMain .linkWrapInner", function(e){
	e.preventDefault(); e.stopPropagation();
	if($(this).hasClass('launchSessions'))
	{
		if(w < 840)
		{
			loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"small"});
		}
		else
		{
			loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"large"});
		}
	}
	if($(this).hasClass('launchReports'))
	{
		loadReport();
		$('.reportsDuration[data-type="daysLastSeven"]').addClass("current");
	}
	if($(this).hasClass('launchInvoices'))
	{
		loadPaymentData({"start":0,"count":30});
	}
	if($(this).hasClass('launchPayments'))
	{
		loadReceivedPayments({"startDate":xToday,"endDate":xToday});
	}
	if($(this).hasClass('launchReschedules'))
	{
		loadRescheduleRequests({"startDate":xToday,"endDate":xToday});
	}
	if($(this).hasClass('launchCancels'))
	{
		loadCancelRequests({"startDate":xToday,"endDate":xToday});
	}
	if($(this).hasClass('launchLeads'))
	{
		var xYestday = moment().subtract(1,"days").format("YYYY-MM-DD");
		var cmpns = getUserLeadsCampaigns();
		if(cmpns && cmpns["responseCode"] && cmpns["responseCode"]==1000)
		{
			var list = cmpns["campaignNames"];
			loadUserLeadsInitial({"startDate":xYestday,"endDate":xToday,"list":list,"code":"demosessionfb"});
		}
		else
		{
			loadUserLeadsInitial({"startDate":xYestday,"endDate":xToday,"code":"demosessionfb"});
		}
	}
	if($(this).hasClass('launchDiet'))
	{
		loadDietModule();
	}
	if($(this).hasClass('launchStats'))
	{
		loadNewReports();
	}
	if($(this).hasClass('launchGroups'))
	{
		$('.groupsLink').click();
		$('.sideNavToggle').click();
	}
});

$(document).on("click", ".invoiceConfirmationInner .close", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.invoiceConfirmation').fadeOut(100);
});
$(document).on("click", ".sideNavToggle", function(e){
	$('.leftBar').toggleClass('active');
});
$(document).on("click", ".leftHuddle .home", function(e){
	switch (window.userRole) {
		case 'ops':
		case 'others':
			if($(window).width() < 768)
			{
				loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"small"});
			}
			else
			{
				loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"large"});
			}
		break;
	};
});
$(document).on("click", ".leftHuddle .back", function(e){
	restoreCard();
});
$(document).on("click", ".dataCta", function(e){
	$('.dataInputWrap').fadeIn(150).css("display","flex");
	var txt = window.reschedulestr.split('-').reverse().join('-');
	$('.dataInputWrap input[name="dataFormStartDate"], .dataInputWrap input[name="dataFormEndDate"]').val(txt);
});
$(document).on("click", ".dataInputClose", function(e){
	$('.dataInputWrap').fadeOut(150);
});
$(document).on("click", ".dataSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	if(dataValidate($(this).parent('form')))
	{
		$('.dataInputWrap').fadeOut(150);
	}
});
//leadsUserCta
$(document).on("click", ".leadsUserCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var mod = $('.userStatusModal');
	var par = $(this).parents('tr');
	mod.find('.userNameField span.value').text(par.attr("data-name"));
	mod.find('.userMobileField span.value').text(par.attr("data-phone"));
	var srctext = par.attr("data-source") + '-"' + par.attr("data-campaign") + '"';
	mod.find('.userSource span.value').text(srctext);
	mod.fadeIn(100).css("display","flex");
	window.selectedUser = par.attr("data-id");
});
$(document).on("click", ".leadsCommentCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var mod = $('.userCommentModal');
	var par = $(this).parents('tr');
	mod.find('.userNameField span.value').text(par.attr("data-name"));
	mod.find('.userMobileField span.value').text(par.attr("data-phone"));
	var srctext = par.attr("data-source") + '-"' + par.attr("data-campaign") + '"';
	mod.find('.userSource span.value').text(srctext);
	mod.fadeIn(100).css("display","flex");
	window.selectedUser = par.attr("data-id");
});
$(document).on("click", ".modalWrap .close", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.modalWrap').fadeOut(100);
});
$(document).on("click", ".dietTable .sendPlanEmailCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var emailSent = sendDietEmail(window.dietEmail);
	if(emailSent && emailSent["responseCode"] && emailSent["responseCode"] == 1000)
	{
		showModalMessage({"message":emailSent["response"]});
	}
});
$(document).on("click", ".sessionDatepicker .datePickerSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	var newvalues = $('.sessionDatepicker');
	if(!newvalues.find('input.startDate').val() && !newvalues.find('input.endDate').val())
	{
		if($(window).width() > 768)
		{
			var mode = "large";
		}
		else
		{
			var mode = "small";
		}
		window.lastCardState = $('.card').detach();
		loadOpsDateSize({"maxSize":$('.inputRangeWrap .inputRangeValue').val(),"mode":mode});
		$('.sessionsWhenSelect button').click();
	}
	else if(dateValidate(newvalues))
	{
		var startDate = newvalues.find('input.startDate').val().split("-").reverse().join("-");
		var endDate = newvalues.find('input.endDate').val().split("-").reverse().join("-");
		if($(window).width() > 768)
		{
			var mode = "large";
		}
		else
		{
			var mode = "small";
		}
		window.lastCardState = $('.card').detach();
		loadOpsDateSize({"startDate":startDate,"endDate":endDate,"maxSize":$('.inputRangeWrap .inputRangeValue').val(),"mode":mode});
		$('.sessionsWhenSelect button').click();
	}
});
$(document).on("input change", ".leads .campaignChoice", function(e){
	var ccode = $(this).find('option:selected').text();
	$('.searchLeadsOptions .searchLeadsCampaign').val(ccode);
	$('.searchLeads .searchLeadsCta').click();
});

$(document).on("input change", ".inputRangeWrap .inputRangeSlider", function(e){
	var x = parseInt($(".inputRangeWrap .inputRangeSlider").val());
	var y = parseInt(x * (500 / 18));
	$('.inputRangeWrap .inputRangeValue').val(y);
});

$(document).on("input change", ".inputRangeWrap .inputRangeValue", function(e){
	var x = parseInt($(".inputRangeWrap .inputRangeValue").val());
	var y = parseInt(x / (500 / 18));
	$('.inputRangeWrap .inputRangeSlider').val(y);
});
$(window).load(function(){
	$('.inputRangeWrap .inputRangeSlider').val(18);
	$('.inputRangeWrap .inputRangeValue').val(500);
});
$(document).on("click", ".userTabs li a", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.userTabs li a, .coachTabs li a').removeClass('current');
	$(this).addClass('current');
	if($(this).hasClass('tabSessions'))
	{
		$('.cardRow.userInfo, .cardRow.userPayments, .cardRow.userPerformance').hide();
		$('.cardRow.userSessions').show(150);
	}
	else if($(this).hasClass('tabInfo'))
	{
		$('.cardRow.userSessions, .cardRow.userPayments, .cardRow.userPerformance').hide();
		$('.cardRow.userInfo').show(150);
	}
	else if($(this).hasClass('tabPayments'))
	{
		$('.cardRow.userSessions, .cardRow.userInfo, .cardRow.userPerformance').hide();
		$('.cardRow.userPayments').show(150);
	}
	else if($(this).hasClass('tabPerformance'))
	{
		$('.cardRow.userSessions, .cardRow.userInfo, .cardRow.userPayments').hide();
		$('.cardRow.userPerformance').show(150);
		loadPerfChart({"typeParam":"1","chartCanvas":"chartdiv"});
	}
});
$(document).on("change", ".chartControlWidget .chartTypeSelect", function(e){
	var typeParam = $('.chartControlWidget .chartTypeSelect').find('option:selected').attr("data-val");
	loadPerfChart({"typeParam":typeParam,"chartCanvas":"chartdiv"});
});
$(document).on("click", ".chartControlWidget .chartRefresh", function(e){
	e.preventDefault(); e.stopPropagation();
	if(!$(this).siblings('.chartStartDate').val())
	{
		$(this).siblings('.chartStartDate').focus();
		return false;
	}
	else if(!$(this).siblings('.chartEndDate').val())
	{
		$(this).siblings('.chartEndDate').focus();
		return false;
	}
	else
	{
		var stDate = $(this).siblings('.chartStartDate').val().split("-").reverse().join("-");
		var enDate = $(this).siblings('.chartEndDate').val().split("-").reverse().join("-");
		window.dataPerfAll = loadPerfUser({"email":window.userEmail,"startDate":stDate,"endDate":enDate});
		loadPerfChart(window.currentChart);
	}
});
$(document).on("click", ".coachTabs li a", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.userTabs li a, .coachTabs li a').removeClass('current');
	$(this).addClass('current');
	if($(this).hasClass('tabSchedule'))
	{
		$('.cardRow.coachSchedule').show(150).css('display','flex');
		$('.cardRow.coachInfo, .cardRow.userPayments, .cardRow.coachSessions').hide();
	}
	else if($(this).hasClass('tabSessions'))
	{
		$('.cardRow.coachSessions').show(150);
		$('.cardRow.coachInfo, .cardRow.userPayments, .cardRow.coachSchedule').hide();
	}
	else if($(this).hasClass('tabInfo'))
	{
		$('.cardRow.coachSessions, .cardRow.userPayments, .cardRow.coachSchedule').hide();
		$('.cardRow.coachInfo').show(150);
	}
	else if($(this).hasClass('tabPayments'))
	{
		$('.cardRow.coachSessions, .cardRow.coachInfo, .cardRow.coachSchedule').hide();
		$('.cardRow.coachPayments').show(150);
	}
});
$(document).on("click",".sessionsList .sort", function(){
	var cellEq = $(this).parent('th').index();
	var rows = {};
	var i = 0;
	$(this).parents('table').find('tbody tr').each(function(){
		
		rows[i] = $(this).html();
		i++;
	});
	var count = i+1;
	var newRows = alphaSort({"rowsObject":rows,"index":cellEq,"type":"asc"});
	$(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
});
//Function to sort the cells of a table column based on starting characterSet
function alphaSort(arg)
{
}
$(document).on('input change','.dateControlWidget .controlForm input[name="listtype"]', function(){
	$(this).parents('.dateControlWidget').find('.dropDown .whenText').val($('input[name="listtype"]:checked + label').text());
});

$(document).on("click",".dateControlWidget .dropDown input, .dateControlWidget .dropDown button", function(){
	$('.dateControlWidget .controlForm').slideToggle(150);
});

$(document).on("click",".dateControlWidget .dateControlSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	var mod = $(this).attr("data-module");
	switch(mod) {
		case 'receivedPayments':
			var stDt = $(this).siblings('.startDate').val();
			var enDt = $(this).siblings('.endDate').val();
			loadReceivedPayments({"startDate":stDt,"endDate":enDt});
		break;
	}
});

$(document).on("click",".reportsWhenSelect input, .reportsWhenSelect button", function(){
	$('.reportsDatepicker').slideToggle(150);
});

$(document).on("click",".sessionsWhenSelect input, .sessionsWhenSelect button", function(){
	$('.sessionDatepicker').slideToggle(150);
});

$(document).on("click",".requestsWhenSelect input, .requestsWhenSelect button", function(){
	$('.requestDatepicker').slideToggle(150);
});

$(document).on("click",".cancelsWhenSelect input, .cancelsWhenSelect button", function(){
	$('.cancelsDatepicker').slideToggle(150);
});

function checkHighlighted()
{
	if($('.results .resultItem.highlighted').length === 0 && typeof $('.results .resultItem.highlighted').length !== 'undefined')
	{
		return false;
	}
	else
	{
		return true;
	}
}
function chooseHighlighted()
{
	var datasrc = $('.results .resultItem.highlighted');
	window.clickedResult = {"userName":datasrc.attr('data-name'),"type":datasrc.attr('data-type'),"phone":datasrc.attr('data-phone'),"email":datasrc.attr('data-email')};
	$(".searchText").val(window.clickedResult["userName"]);
	$('.results .resultItem').removeClass('highlighted');
	$('.suggestions').fadeOut(150);
}
function moveHighlighted(where)
{
	switch (where) {
		case 'up':
			if(checkHighlighted())
			{
				var ind = $('.results .resultItem.highlighted').index();
				ind -= 1;
				$('.results .resultItem').removeClass('highlighted').eq(ind).addClass('highlighted');
			}
			else
			{
				$('.results .resultItem:last-child').addClass('highlighted');
			}
		break;
		case 'down':
			if(checkHighlighted())
			{
				var ind = $('.results .resultItem.highlighted').index();
				ind += 1;
				$('.results .resultItem').removeClass('highlighted').eq(ind).addClass('highlighted');
			}
			else
			{
				$('.results .resultItem:first-child').addClass('highlighted');
			}
		break;
	}
}
$(document).on("input change",'.leads .searchLeadsCountRange',function(){
	var x = parseInt($(this).val());
	var y = parseInt(x * (500 / 17));
	$('.leads .searchLeadsCountValue').val(y);
});
$(document).on("input change",'.leads .searchLeadsCountValue',function(){
	var x = parseInt($(this).val());
	var y = parseInt(x / (500 / 17));
	$('.leads .searchLeadsCountRange').val(y);
});
$(document).on("click",".searchLeadsCta", function(e){
	e.preventDefault(); e.stopPropagation();
	if(validateSearchForm($(this).parent('form')))
	{
		performLeadSearch($(this).parent('form'));
	}
});
$(document).on("click",".tabSms", function()
{
	loadSmsData();
});
$(document).on("click",".tabEmail", function()
{
	loadEmailData();
});

$(document).on("click",".searchSubmit", function(e) {
	e.preventDefault(); e.stopPropagation();
	var f = $('.searchForm');
	if(validate(f))
	{
		performSearch(f);
	}
});
$(document).on("click","#checkBx2", function()
{
	if(this.checked)
	{
	}
	else
	{
	}
});
function validateSearchForm(formobj)
{
	if($(formobj).find('.searchLeadsCampaign').val() === '')
	{
		$(formobj).find('.searchLeadsCampaign').addClass('error').focus();
		return false;
	}
	else if ($(formobj).find('.searchLeadsStart').val() === '')
	{
		$(formobj).find('.searchLeadsCampaign').removeClass('error');
		$(formobj).find('.searchLeadsStart').addClass('error').focus();
		return false;
	}
	else if ($(formobj).find('.searchLeadsEnd').val() === '')
	{
		$(formobj).find('.searchLeadsCampaign, .searchLeadsStart').removeClass('error');
		$(formobj).find('.searchLeadsEnd').addClass('error').focus();
		return false;
	}
	else {
		$(formobj).find('.searchLeadsCampaign, .searchLeadsStart, .searchLeadsEnd').removeClass('error');
		return true;
	}
}
function performLeadSearch(formobj)
{
	var searchCampaign = $(formobj).find('.searchLeadsCampaign').val();
	var searchStartDate = $(formobj).find('.searchLeadsStart').val();
	var searchEndDate = $(formobj).find('.searchLeadsEnd').val();
	var searchCount = $(formobj).find('.searchLeadsCountValue').val();
	var searchType = $(formobj).find('.searchLeadsType').find('option:selected').attr("data-type");
	if(searchType === 'null')
	{
		var passArg = {"count":searchCount, "startDate":searchStartDate, "endDate":searchEndDate, "campaign":searchCampaign, "start":'0'};
	}
	else
	{
		var passArg = {"count":searchCount, "startDate":searchStartDate, "endDate":searchEndDate, "campaign":searchCampaign, "start":'0', "status":searchType};
	}
	loadCampaignUserTable(passArg);
}
$(document).ready(function(){
	//Clear all form data on page-load
	$('form').each(function(){
		this.reset();
	});
	// When business stats button is clicked on the side navigation
	$('.newReportsLink').click(function(){
		loadNewReports();
		$('.sideNavToggle').click();
	});
	// When invoices button is clicked on the side navigation
	$('.paymentsLink').click(function(){
		loadPaymentData({"start":0,"count":30});
		$('.sideNavToggle').click();
	});
	// When reschedule button is clicked on the side navigation
	$('.requestsLink').click(function(){
		loadRescheduleRequests({"startDate":xToday,"endDate":xToday});
		$('.sideNavToggle').click();
	});
	// When cancels button is clicked on the side navigation
	$('.cancelsLink').click(function(){
		loadCancelRequests({"startDate":xToday,"endDate":xToday});
		$('.sideNavToggle').click();
	});
	$('.leadsLink').click(function(){
		var xYestday = moment().subtract(1,"days").format("YYYY-MM-DD");
		var cmpns = getUserLeadsCampaigns();
		if(cmpns && cmpns["responseCode"] && cmpns["responseCode"]==1000)
		{
			var list = cmpns["campaignNames"];
			loadUserLeadsInitial({"startDate":xYestday,"endDate":xToday,"list":list,"code":"demosessionfb"});
		}
		else
		{
			loadUserLeadsInitial({"startDate":xYestday,"endDate":xToday,"code":"demosessionfb"});
		}
		$('.sideNavToggle').click();
	});
	$('.dietLink').click(function(){
		loadDietModule();
		$('.sideNavToggle').click();
	});
	$('.freeLink').click(function(){
		var xYestday = moment().subtract(1,"days").format("YYYY-MM-DD");
		loadFreeRequests({"startDate":xYestday,"endDate":xToday,"code":"demosessionfb"});
		$('.sideNavToggle').click();
	});
	// When orders button is clicked on the side navigation
	$('.ordersLink').click(function(){
		loadOrderData();
		$('.sideNavToggle').click();
	});
	// When Payment button is clicked on the side navigation
	$('.receivedLink').click(function(){
		loadReceivedPayments({"startDate":xToday,"endDate":xToday});
		$('.sideNavToggle').click();
	});
	// When email / sms button is clicked on the side navigation
	$('.emailsLink').click(function(){
		loadEmailData();
		$('.sideNavToggle').click();
	});
	$('.searchInput.searchText').focus();
	//Keypress detector on search input text-box
	$('.searchInput.searchText').keydown(function(e){
		if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13)
		{
			if($('.suggestions').is(':visible'))
			{
				if(e.keyCode === 13 && checkHighlighted())
				{
					e.preventDefault(); e.stopPropagation();
					chooseHighlighted();
				}
				if(e.keyCode === 38)
				{
					moveHighlighted('up');
				}
				if(e.keyCode === 40)
				{
					moveHighlighted('down');
				}
			}
		}
	});
	//Auto-suggest trigger function
	var timeDelay;
	$('.topLogo').click(function(){
		restoreCard();
	});
	$('input.searchInput').on("input",function(){
		$('.suggestions .errorMessage').hide(50);
		$('.suggestions .loading').show(50);
		window.clearTimeout(timeDelay);
		var result = null;
		var $this = $(this);
		var container = '<div class="suggestions" id="suggestions"><div class="loading">Searching <img class="preloader" src="http://cdn.orobind.com/srv/static/imagesV2/loading.gif"></div><div class="suggestionsWrap"><ul class="results"></ul></div><div class="errorMessage">No results to display</div>';
		//get the current screen position of the input field
		
		timeDelay = window.setTimeout(function(){
			var param = $this.val();
			if (param.length > 2 && !document.getElementById("suggestions"))
			{
				result = fetchSuggestions(param);
				loadAuto(result,container,$this);
			}
			else if (param.length > 2 && !!document.getElementById("suggestions"))
			{
				result = fetchSuggestions(param);
				refreshAuto(result,$this);
			}
			else {
				$('.suggestions ul.results').empty();
				$('.suggestions .errorMessage').show(50);
				$('.suggestions .loading').hide(50);
				return;
			}
		},500);
	});
	$(document).on("input","input.autoSuggest",function(){
		$('.suggestionsCoach .errorMessage').hide(50);
		$('.suggestionsCoach .loading').show(50);
		window.clearTimeout(timeDelay);
		var result = null;
		var $this = $(this);
		var container = '<div class="suggestionsCoach" id="suggestionsCoach"><div class="loading">Searching <img class="preloader" src="http://cdn.orobind.com/srv/static/imagesV2/loading.gif"></div><div class="suggestionsWrap"><ul class="results"></ul></div><div class="errorMessage">No results to display</div>';
		//get the current screen position of the input field
		
		timeDelay = window.setTimeout(function(){
			var param = $this.val();
			if (param.length > 2 && !document.getElementById("suggestionsCoach"))
			{
				result = fetchCoachSuggestions(param);
				loadAutoCoach(result,container,$this);
			}
			else if (param.length > 2 && !!document.getElementById("suggestionsCoach"))
			{
				result = fetchCoachSuggestions(param);
				refreshAutoCoach(result,$this);
			}
			else {
				$('.suggestionsCoach ul.results').empty();
				$('.suggestionsCoach .errorMessage').show(50);
				$('.suggestionsCoach .loading').hide(50);
				return;
			}
		},500);
	});
	var clickedElem; var focusedElem;
	$(document).mousedown(function(e){
		clickedElem = e.target;
	});
	$(document).click(function(e){
		clkElem = e.target;
		if(!checkReports(clkElem))
		{
			$(window.currentFocus).removeClass("current");
			closeCellInput(1);
		}
	});
	$('.searchText').focus(function(e){
		$('.suggestions .errorMessage').hide(50);
		$('.suggestions .loading').show(50);
		var param = $(this).val();
		if(param.length > 2)
		{
			result = fetchSuggestions(param);
			$this = $(this)
			refreshAuto(result,$this);
		}
	});
	$(document).on('focus','.autoSuggest',function(e){
		$('.suggestionsCoach .errorMessage').hide(50);
		$('.suggestionsCoach .loading').show(50);
		var param = $(this).val();
		if(param.length > 2)
		{
			result = fetchCoachSuggestions(param);
			$this = $(this)
			refreshAutoCoach(result,$this);
		}
	});
	$('.searchText').blur(function(e){
		if(checkSelf(clickedElem))
		{
			return;
			$('.suggestions').fadeOut(150);
		}
		else
		{
			$('.suggestions').fadeOut(150);
		}
	});
	$(document).on('blur','.autoSuggest',function(e){
		$('.suggestionsCoach').fadeOut(150);
	});
	$(document).on('click','.suggestionsCoach',function(e){
		checkSelfCoach(e.target);
	});
	$('.searchTypeWrap .searchType').change(function(){
		$('.userSelectResult, .coachSelectResult').toggleClass('active');
		var optionSelected = $("select.searchInput:visible option:selected");
		if(optionSelected.attr('data-type') === 'sessions')
		{
			$('.sliderWrap, .searchCalendar').addClass('active');
		}
		else
		{
			$('.sliderWrap, .searchCalendar').removeClass('active');
		}
	});
	/*$('.searchSubmit').click(function(e){
		e.preventDefault(); e.stopPropagation;
		if($('.searchUser').is(':checked'))
		{
			loadbyUser($('.searchInput').val());
		}
		else
		{
			loadbyCoach($('.searchInput').val());
		}
	});*/
	$('.numberSlider input').val(18);
	$('.rangeValue').val(500);
	$('.numberSlider input').on("input change",function(){
		var x = parseInt($(this).val());
		var y = parseInt(x * (500 / 18));
		$('.rangeValue').val(y);
	});
	$('.rangeValue').on("input change",function(){
		var x = parseInt($(this).val());
		var y = parseInt(x / (500 / 18));
		$('.numberSlider input').val(y);
	});
	$('select.searchInput').change(function(){
		var optionSelected = $("option:selected", this);
		if(optionSelected.attr('data-type') === 'sessions')
		{
			$('.sliderWrap, .searchCalendar').addClass('active');
		}
		else
		{
			$('.sliderWrap, .searchCalendar').removeClass('active');
		}
	});
	$('.searchCalendarBtn').click(function(e){
		e.preventDefault(); e.stopPropagation();
		$('.searchDateWrap').slideToggle(100);
	});
	$('.dateRangeInput').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.dateRangeInput').datetimepicker('hide');
		}
	});
});
function loadAutoCoach(result,container,$this)
{
	var cPos = $this.position();
	var parSearch = ($this.parents('.substituteCoachInner').length) ? $this.parents('.substituteCoachInner') : $this.parents('.newSessionGroupForm');
	var big = (x > 10) ? true : false;
	if($("#suggestionsCoach").length)
	{
		parSearch.find('.suggestionsCoach').fadeIn(150);
	}
	else{
		parSearch.append(container);
		var w = $this.outerWidth() + 'px';
		var x = parseFloat(cPos.left) + 'px';
		if(parSearch.hasClass('substituteCoachInner')){
			var y = eval(parseFloat(cPos.top)+40) + 'px';
		}
		else{
			var y = eval(802+40) + 'px';
		}
		parSearch.find('.suggestionsCoach').fadeIn(150).css({"display":"block","width":w,"left":x,"top":y});
	}
	if(result["coachMiniDTO"].length > 0)
	{
		$('.suggestionsCoach .loading').hide(50);
		for(var j in result["coachMiniDTO"])
		{
			var itemstr = '<li class="resultItem" data-name="' + result["coachMiniDTO"][j]["name"] + '" data-code="' + result["coachMiniDTO"][j]["code"] + '" data-phone="' + result["coachMiniDTO"][j]["mobile"] + '">';
			itemstr += '<span class="resultName">' + result["coachMiniDTO"][j]["name"] + '</span> <span class="resultPhone">' + result["coachMiniDTO"][j]["mobile"] + '</span></li>';
			$('.suggestionsCoach ul.results').append(itemstr);
		}
	}
	else{
		$('.suggestionsCoach ul.results').empty();
		$('.suggestionsCoach .errorMessage').show(50);
		$('.suggestionsCoach .loading').hide(50);
	}
}
function loadAuto(result,container,$this)
{
	var cPos = $this.position();
	var parSearch = ($this.parents('.searchWidget').length) ? $this.parents('.searchWidget') : $this.parents('.searchExtend .searchForm');
	var big = (x > 10) ? true : false;
	if($("#suggestions").length)
	{
		parSearch.find('.suggestions').fadeIn(150);
	}
	else{
		parSearch.append(container);
		var w = $this.outerWidth() + 'px';
		var x = parseFloat(cPos.left) + 'px';
		var y = eval(parseFloat(cPos.top)+40) + 'px';
		parSearch.find('.suggestions').fadeIn(150).css({"display":"block","width":w,"left":x,"top":y});
	}
	if(result["userMiniDTO"].length > 0)
	{
		$('.suggestions .loading').hide(50);
		for(var j in result["userMiniDTO"])
		{
			var itemstr = '<li class="resultItem" data-email="';
			itemstr += result["userMiniDTO"][j]["email"] + '" data-name="' + result["userMiniDTO"][j]["name"] + '" data-type="' + result["userMiniDTO"][j]["type"] + '" data-phone="' + result["userMiniDTO"][j]["mobile"] + '">';
			itemstr += '<span class="resultName">' + result["userMiniDTO"][j]["name"] + '</span> <span class="resultPhone">' + result["userMiniDTO"][j]["mobile"] + '</span> <span class="type">' + result["userMiniDTO"][j]["type"] + '</span></li>';
			$('.suggestions ul.results').append(itemstr);
		}
	}
	else{
		$('.suggestions ul.results').empty();
		$('.suggestions .errorMessage').show(50);
		$('.suggestions .loading').hide(50);
	}
}
function refreshAuto(result, $this)
{
	var lft = $this.position();
	var lftpx = lft.left + 'px';
	$('.suggestions').fadeIn(150).css("left",lftpx);
	if(result["userMiniDTO"].length > 0)
	{
		$('.suggestions .loading').hide(50);
		var totalstr = '';
		for(var j in result["userMiniDTO"])
		{
			var itemstr = '<li class="resultItem" data-email="';
			itemstr += result["userMiniDTO"][j]["email"] + '" data-name="' + result["userMiniDTO"][j]["name"] + '" data-type="' + result["userMiniDTO"][j]["type"] + '" data-phone="' + result["userMiniDTO"][j]["mobile"] + '">';
			itemstr += '<span class="resultName">' + result["userMiniDTO"][j]["name"] + '</span> <span class="resultPhone">' + result["userMiniDTO"][j]["mobile"] + '</span> <span class="type">' + result["userMiniDTO"][j]["type"] + '</span></li>';
			totalstr += itemstr;
		}
		$('.suggestions ul.results').empty().append(totalstr);
	}
	else{
		$('.suggestions ul.results').empty();
		$('.suggestions .errorMessage').show(50);
		$('.suggestions .loading').hide(50);
	}
}
function refreshAutoCoach(result, $this)
{
	var lft = $this.position();
	var lftpx = lft.left + 'px';
	$('.suggestionsCoach').fadeIn(150).css("left",lftpx);
	if(result["coachMiniDTO"].length > 0)
	{
		$('.suggestionsCoach .loading').hide(50);
		var totalstr = '';
		for(var j in result["coachMiniDTO"])
		{
			var itemstr = '<li class="resultItem" data-name="' + result["coachMiniDTO"][j]["name"] + '" data-code="' + result["coachMiniDTO"][j]["code"] + '" data-phone="' + result["coachMiniDTO"][j]["mobile"] + '">';
			itemstr += '<span class="resultName">' + result["coachMiniDTO"][j]["name"] + '</span> <span class="resultPhone">' + result["coachMiniDTO"][j]["mobile"] + '</span></li>';
			totalstr += itemstr;
		}
		$('.suggestionsCoach ul.results').empty().append(totalstr);
	}
	else{
		$('.suggestionsCoach ul.results').empty();
		$('.suggestionsCoach .errorMessage').show(50);
		$('.suggestionsCoach .loading').hide(50);
	}
}
function checkReports(clickedElem)
{
	if($(clickedElem).hasClass('reportDataList') || $(clickedElem).parents('.reportDataList').length > 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function checkSelf(clickedElem)
{
	if($(clickedElem).hasClass('suggestions') || $(clickedElem).parents('.suggestions').length > 0)
	{
		if($(clickedElem).hasClass('resultPhone') || $(clickedElem).hasClass('resultName') || $(clickedElem).hasClass('type'))
		{
			var datasrc = $(clickedElem).parent('.resultItem');
			window.clickedResult = {"userName":datasrc.attr('data-name'),"type":datasrc.attr('data-type'),"phone":datasrc.attr('data-phone'),"email":datasrc.attr('data-email')};
		}
		else if($(clickedElem).hasClass('resultItem'))
		{
			var datasrc = $(clickedElem);
			window.clickedResult = {"userName":datasrc.attr('data-name'),"type":datasrc.attr('data-type'),"phone":datasrc.attr('data-phone'),"email":datasrc.attr('data-email')};
		}
		$(".searchText").val(window.clickedResult["userName"]);
		$('#whatSel').text(window.clickedResult["type"]+': ');
		inputval = window.clickedResult["userName"];
	}
	else
	{
		$(document).mousedown();
		return false;
	}
}
function checkSelfCoach(clickedElem)
{
	if($(clickedElem).hasClass('suggestionsCoach') || $(clickedElem).parents('.suggestionsCoach').length > 0)
	{
		if($(clickedElem).hasClass('resultPhone') || $(clickedElem).hasClass('resultName'))
		{
			var datasrc = $(clickedElem).parent('.resultItem');
			window.clickedCoachResult = {"userName":datasrc.attr('data-name'),"code":datasrc.attr('data-code'),"phone":datasrc.attr('data-phone')};
		}
		else if($(clickedElem).hasClass('resultItem'))
		{
			var datasrc = $(clickedElem);
			window.clickedCoachResult = {"userName":datasrc.attr('data-name'),"code":datasrc.attr('data-code'),"phone":datasrc.attr('data-phone')};
		}

		$(".autoSuggest").val(window.clickedCoachResult["userName"]);
	}
}
function validate(elem){
	var email = $(elem).find('input.searchInput');
	var fromDate = $(elem).find('.dateRangeWrap.from .dateRangeInput');
	var toDate = $(elem).find('.dateRangeWrap.to .dateRangeInput');
	if ($(elem).find('#searchUser').is(':checked'))
	{
		var sel = $(elem).find('select.userSelectResult');
		var opt = sel.find('option:selected');
	}
	else
	{
		var sel = $(elem).find('select.coachSelectResult')
		var opt = sel.find('option:selected');
	}
	if(email.val() === '')
	{
		$(email).focus().addClass('error');
		return false;
	}
	if(opt.prop('disabled'))
	{
		$(sel).focus().addClass('error');
		return false;
	}
	if(!fromDate.val() === '')
	{
		var dateArray = fromDate.val().split("-");
		if(!dateArray.length === 3)
		{
			$(fromDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
		else if (isNaN(dateArray[0]) || parseInt(dateArray[0]) > 31 || parseInt(dateArray[0]) < 1)
		{
			$(fromDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
		else if (isNaN(dateArray[1]) || parseInt(dateArray[1]) > 12 || parseInt(dateArray[1]) < 0)
		{
			$(fromDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
		else if (isNaN(dateArray[2]) || parseInt(dateArray[2]) > 2099 || parseInt(dateArray[2]) < 2014)
		{
			$(fromDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
		else if(toDate.val() === '')
		{
			$(toDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
	}
	if(!toDate.val() === '')
	{
		var dateArray = toDate.val().split("-");
		if(!dateArray.length === 3)
		{
			$(toDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
		else if (isNaN(dateArray[0]) || parseInt(dateArray[0]) > 31 || parseInt(dateArray[0]) < 1)
		{
			$(toDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
		else if (isNaN(dateArray[1]) || parseInt(dateArray[1]) > 12 || parseInt(dateArray[1]) < 0)
		{
			$(toDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
		else if (isNaN(dateArray[2]) || parseInt(dateArray[2]) > 2099 || parseInt(dateArray[2]) < 2014)
		{
			$(toDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
		else if(toDate.val() === '')
		{
			$(fromDate).parent('.dateRangeWrap').addClass('error');
			return false;
		}
	}
	$(fromDate).parent('.dateRangeWrap').removeClass('error');
	$(toDate).parent('.dateRangeWrap').removeClass('error');
	$(email).removeClass('error');
	$(sel).removeClass('error');
	return true;
}
function validateSchedule(obj){
	var dateParam = $(obj).find('.rescheduleDate').val();
	var timeParam = $(obj).find('.rescheduleTime').val();
	var commentParam = $(obj).find('.rescheduleComment').val();
	dateArray = dateParam.split("-").reverse(); timeArray = timeParam.split(":");
	if(dateParam === '' || dateParam.length !== 10 || dateParam.indexOf("-") > 5)
	{
		$(obj).find('.rescheduleDate').addClass('error');
		return false;
	}
	else if (dateArray[0].length !== 4 || parseInt(dateArray[0]) < 2015 || parseInt(dateArray[1]) > 12 || parseInt(dateArray[1]) < 1 || parseInt(dateArray[2] > 31 || parseInt(dateArray[2]) < 1))
	{
		$(obj).find('.rescheduleDate').addClass('error');
		return false;
	}
	else if (timeParam === '' || timeParam.length !== 5 || timeParam.indexOf(":") > 3)
	{
		$(obj).find('.rescheduleDate').removeClass('error');
		$(obj).find('.rescheduleTime').addClass('error');
		return false;
	}
	else if (parseInt(timeArray[0]) > 24 || parseInt(timeArray[0]) < 0 || parseInt(timeArray[1]) > 59 || parseInt(timeArray[1]) < 0 || /[^0-9]/.test(timeArray[0]) || /[^0-9]/.test(timeArray[1]))
	{
		$(obj).find('.rescheduleDate').removeClass('error');
		$(obj).find('.rescheduleTime').addClass('error');
		return false;
	}
	else if (commentParam === '')
	{
		$(obj).find('.rescheduleDate, .rescheduleTime').removeClass('error');
		$(obj).find('.rescheduleComment').addClass('error');
		return false;
	}
	else
	{
		$(obj).find('.rescheduleDate, .rescheduleTime, .rescheduleComment').removeClass('error');
		return true;
	}
}
function validateCancel(obj){
	var commentParam = $(obj).find('.rescheduleComment').val();
	if(commentParam === '')
	{
		$(obj).find('.rescheduleComment').addClass('error');
		return false;
	}
	else
	{
		$(obj).find('.rescheduleComment').removeClass('error');
		return true;
	}
}
function performSearch(obj){
	var emailParam = window.clickedResult["email"];
	/*if ($(obj).find('#searchUser').is(':checked'))
	{
		var sel = $(obj).find('select.userSelectResult');
		var optParam = sel.find('option:selected').attr('data-target');
	}
	else
	{
		var sel = $(obj).find('select.coachSelectResult')
		var optParam = sel.find('option:selected').attr('data-target');
	}*/
	var selType = window.clickedResult["type"];
	var sel = $(obj).find('select.SelectResult');
	var optParam = sel.find('option:selected').attr('data-target');
	var numberParam = $(obj).find('input.rangeValue').val();
	
	switch (optParam) {
		
		case 'Sessions':
		if (selType == 'User')
		{
			var fromDate = $(obj).find('.dateRangeWrap.from .dateRangeInput');
			if(fromDate.val() === '')
			{
				if($(window).width() > 768)
				{
					var mode = "large";
				}
				else
				{
					var mode = "small";
				}
				window.lastCardState = $('.card').detach();
				loadbyUserSize({"userName":emailParam,"start":0,"count":numberParam,"mode":mode});
				break;
			}
			else
			{
				var toDate = $(obj).find('.dateRangeWrap.to .dateRangeInput');
				if($(window).width() > 768)
				{
					var mode = "large";
				}
				else
				{
					var mode = "small";
				}
				window.lastCardState = $('.card').detach();
				loadbyUserDateSize({"userName":emailParam,"startDate":fromDate.val().split("-").reverse().join("-"),"endDate":toDate.val().split("-").reverse().join("-"),"start":"0","count":numberParam,"mode":mode});
				break;
			}//code
		}
		else
		{
			var fromDate = $(obj).find('.dateRangeWrap.from .dateRangeInput');
			if(fromDate.val() === '')
			{
				if($(window).width() > 768)
				{
					var mode = "large";
				}
				else
				{
					var mode = "small";
				}
				window.lastCardState = $('.card').detach();
				loadbyCoachSize({"coachName":emailParam,"count":numberParam,"mode":mode});
				break;
			}
			else
			{
				var toDate = $(obj).find('.dateRangeWrap.to .dateRangeInput');
				if($(window).width() > 768)
				{
					var mode = "large";
				}
				else
				{
					var mode = "small";
				}
				window.lastCardState = $('.card').detach();
				loadbyCoachDateSize({"coachName":emailParam,"startDate":fromDate.val().split("-").reverse().join("-"),"endDate":toDate.val().split("-").reverse().join("-"),"start":"0","count":numberParam,"mode":mode});
				break;
			}
		}
		
		case 'Requests':
		if (selType == 'User')
		{
			getRequestsUserEmail('2014-01-01',xToday,emailParam);
			loadRescheduleRequests({"startDate":"2014-01-01","endDate":xToday,"email":emailParam,"mode":"user"});
			break;
		}
		else
		{
			loadRescheduleRequests({"startDate":"2014-01-01","endDate":xToday,"email":emailParam,"mode":"coach"});
			break;
		}
		
		case 'Info':
		if (selType == 'User')
		{
			loadUserInfo(emailParam);
			break;
		}
		else
		{
			loadCoachInfo(emailParam);
			break;
		}
	}
}
//Function for restoring the previous sessions card
function restoreCard()
{
	window.removedCard = $('.card').detach();
	if(typeof window.lastCardState.length !== 'undefined')
	{
		for(var s in window.lastCardState){
			if(!isNaN(s)){
				$('.main').append(window.lastCardState[s]);
			}
		}
	}
	else
	{
		location.reload();
	}
}
//Functions for validating the form on data input for sessions
function dataValidate(obj)
{
	formobj = {};
	$(obj).find('input').each(function(){
		var c = $(this).attr("name");
		var v = $(this).val();
		formobj[c] = v;
	});
	for(var cl in formobj)
	{
		var sel = '.dataAddForm input[name="'+cl+'"]'; 
		switch (cl){
			case 'dataFormWeight':
				if(formobj[cl] === '' || isNaN(formobj[cl]))
				{
					$(sel).addClass('error').focus();
					return false;
				}
				else
				{
					$(sel).removeClass('error');
				}
			break;
			case 'dataFormWater':
			case 'dataFormSleep':
				if(formobj[cl] === '' || isNaN(formobj[cl]))
				{
					$(sel).addClass('error').focus();
					return false;
				}
				else
				{
					$(sel).removeClass('error');
				}
			break;
			case 'dataFormMeals':
				if(formobj[cl] === '' || isNaN(formobj[cl]) || !isInt(formobj[cl]))
				{
					$(sel).addClass('error').focus();
					return false;
				}
				else
				{
					$(sel).removeClass('error');
				}
			break;
			case 'dataFormStartDate':
			case 'dataFormEndDate':
				if(formobj[cl] === '' || !isDate(formobj[cl]))
				{
					$(sel).addClass('error').focus();
					return false;
				}
				else
				{
					$(sel).removeClass('error');
				}
			break;
			case 'dataFormStartTime':
			case 'dataFormEndTime':
				if(formobj[cl] === '' || !isTime(formobj[cl]))
				{
					$(sel).addClass('error').focus();
					return false;
				}
				else
				{
					$(sel).removeClass('error');
					if(cl === 'dataFormEndTime')
					{
						var code = '';
						currentDate = window.reschedulestr;
						for (var i in window.datelistobj)
						{
							if(window.datelistobj[i]['date'] === currentDate)
							{
								code = window.datelistobj[i]['code'];
							}
						}
						addSessionData(formobj,window.userEmail,code);
						return true;
					}
				}
			break;
		}
	}
}
function isTime(value) {
	var arr = value.split(":");
	if (!value.length === 5 || !arr.length === 2)
	{
		return false;
	}
	else if(!arr[0].length === 2 || arr[0] === '' || isNaN(arr[0]))
	{
		return false;
	}
	else if(!arr[1].length === 2 || arr[1] === '' || isNaN(arr[1]))
	{
		return false;
	}
	else
	{
		return true;
	}
}
function isInt(value) {
	return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}
function isDate(value) {
	var arr = value.split("-");
	var va = parseInt(arr[0]);
	var vb = parseInt(arr[1]);
	var vc = parseInt(arr[2]);
	if (!value.length === 10 || !arr.length === 3)
	{
		return false;
	}
	else if(!arr[0].length === 2 || arr[0] === '' || isNaN(arr[0]) || !isValidDateForMonth(va,vb,vc))
	{
		return false;
	}
	else if(!arr[1].length === 2 || arr[1] === '' || isNaN(arr[1]))
	{
		return false;
	}
	else if(!arr[2].length === 4 || arr[2] === '' || isNaN(arr[2]))
	{
		return false;
	}
	else
	{
		return true;
	}
}
function isValidDateForMonth(vdate,vmonth,vyear)
{
	switch (vmonth) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			if(parseInt(vdate) < 1 || parseInt(vdate) > 31)
			{
				return false;
			}
			else
			{
				return true;
			}
		break;
		case 4:
		case 6:
		case 9:
		case 11:
			if(parseInt(vdate) < 1 || parseInt(vdate) > 30)
			{
				return false;
			}
			else
			{
				return true;
			}
		break;
		case 2:
			if(isLeapYear(vyear))
			{
				if(parseInt(vdate) < 1 || parseInt(vdate) > 28)
				{
					return false;
				}
				else
				{
					return true;
				}
			}
			else 
			{
				if(parseInt(vdate) < 1 || parseInt(vdate) > 27)
				{
					return false;
				}
				else
				{
					return true;
				}
			}
		break;
	}
}
var tsorter = (function()
{
    'use strict';

    var sorterPrototype,
        addEvent,
        removeEvent,
        hasEventListener = !!document.addEventListener;

    if( !Object.create ){
        // Define Missing Function
        Object.create = function( prototype ) {
            var Obj = function(){return undefined;};
            Obj.prototype = prototype;
            return new Obj();
        };
    }

    // Cross Browser event binding
    addEvent = function( element, eventName, callback ) { 
        if( hasEventListener ) { 
            element.addEventListener(eventName, callback, false ); 
        } else {
            element.attachEvent( 'on' + eventName, callback); 
        }
    };

    // Cross Browser event removal
    removeEvent = function( element, eventName, callback ) { 
        if( hasEventListener ) { 
            element.removeEventListener(eventName, callback, false ); 
        } else {
            element.detachEvent( 'on' + eventName, callback); 
        }
    };

    sorterPrototype = {

        getCell: function(row)
        {
            var that = this;
            return that.trs[row].cells[that.column];
        },

        /* SORT
         * Sorts a particular column. If it has been sorted then call reverse
         * if not, then use quicksort to get it sorted.
         * Sets the arrow direction in the headers.
         * @param oTH - the table header cell (<th>) object that is clicked
         */
        sort: function( e )
        {   
            var that = this,
                th = e.target;

            // TODO: make sure target 'th' is not a child element of a <th> 
            //  We can't use currentTarget because of backwards browser support
            //  IE6,7,8 don't have it.

            // set the data retrieval function for this column 
            that.column = th.cellIndex;
            that.get = that.getAccessor( th.getAttribute('data-tsorter') );

            if( that.prevCol === that.column )
            {
                // if already sorted, reverse
                th.className = th.className !== 'ascend' ? 'ascend' : 'descend';
                that.reverseTable();
            }
            else
            {
                // not sorted - call quicksort
                th.className = 'ascend';
                if( that.prevCol !== -1 && that.ths[that.prevCol].className !== 'exc_cell'){
                    that.ths[that.prevCol].className = '';
                }
                that.quicksort(0, that.trs.length);
            }
            that.prevCol = that.column;
        },
        
        /* 
         * Choose Data Accessor Function
         * @param: the html structure type (from the data-type attribute)
         */
        getAccessor: function(sortType)
        {
            var that = this,
                accessors = that.accessors;

            if( accessors && accessors[ sortType ] ){
                return accessors[ sortType ];
            }

            switch( sortType )
            {   
                case "link":
                    return function(row){
                        return that.getCell(row).firstChild.firstChild.nodeValue;
                    };
                case "input":
                    return function(row){  
                        return that.getCell(row).firstChild.value;
                    };
                case "numeric":
                    return function(row){  
                        return parseFloat( that.getCell(row).firstChild.nodeValue, 10 );
                    };
                default: /* Plain Text */
                    return function(row){
                        return that.getCell(row).firstChild.nodeValue;
                    };
            }
        },

        /* Exchange
         * A complicated way of exchanging two rows in a table.
         * Exchanges rows at index i and j
         */
        exchange: function(i, j)
        {
            var that = this,
                tbody = that.tbody,
                trs = that.trs,
                tmpNode;

            if( i === j+1 ) {
                tbody.insertBefore(trs[i], trs[j]);
            } else if( j === i+1 ) {
                tbody.insertBefore(trs[j], trs[i]);
            } else {
                tmpNode = tbody.replaceChild(trs[i], trs[j]);
                if( !trs[i] ) {
                    tbody.appendChild(tmpNode);
                } else {
                    tbody.insertBefore(tmpNode, trs[i]);
                }
            }
        },
        
        /* 
         * REVERSE TABLE
         * Reverses a table ordering
         */
        reverseTable: function()
        {
            var that = this,
                i;

            for( i = 1; i < that.trs.length; i++ ) {
                that.tbody.insertBefore( that.trs[i], that.trs[0] );
            }
        },

        /*
         * QUICKSORT
         * @param: lo - the low index of the array to sort
         * @param: hi - the high index of the array to sort
         */
        quicksort: function(lo, hi)
        {
            var i, j, pivot,
                that = this;

            if( hi <= lo+1 ){ return; }
             
            if( (hi - lo) === 2 ) {
                if(that.get(hi-1) > that.get(lo)) {
                    that.exchange(hi-1, lo);   
                }
                return;
            }
            
            i = lo + 1;
            j = hi - 1;
            
            if( that.get(lo) > that.get( i) ){ that.exchange( i, lo); }
            if( that.get( j) > that.get(lo) ){ that.exchange(lo,  j); }
            if( that.get(lo) > that.get( i) ){ that.exchange( i, lo); }
            
            pivot = that.get(lo);
            
            while(true) {
                j--;
                while(pivot > that.get(j)){ j--; }
                i++;
                while(that.get(i) > pivot){ i++; }
                if(j <= i){ break; }
                that.exchange(i, j);
            }
            that.exchange(lo, j);
            
            if((j-lo) < (hi-j)) {
                that.quicksort(lo, j);
                that.quicksort(j+1, hi);
            } else {
                that.quicksort(j+1, hi);
                that.quicksort(lo, j);
            }
        },

        init: function( table, initialSortedColumn, customDataAccessors ){
            var that = this,
                i;	
            if( typeof table === 'string' ){
                table = document.getElementsByClassName(table)[0];
            }

            that.table = table;
            that.ths   = table.getElementsByTagName("th");
            that.tbody = table.tBodies[0];
            that.trs   = that.tbody.getElementsByTagName("tr");
            that.prevCol = ( initialSortedColumn && initialSortedColumn > 0 ) ? initialSortedColumn : -1;
            that.accessors = customDataAccessors;
            that.boundSort = that.sort.bind( that );

            for( i = 0; i < that.ths.length; i++ ) {
                addEvent( that.ths[i], 'click', that.boundSort );
            }
        },

        destroy: function(){
            var that = this,
                i;

            if( that.ths ){
                for( i = 0; i < that.ths.length; i++ ) {
                    removeEvent( that.ths[i], 'click', that.boundSort );
                }
            }
        }
    };

    // Create a new sorter given a table element
    return {
        create: function( table, initialSortedColumn, customDataAccessors )
        {
            var sorter = Object.create( sorterPrototype );
            sorter.init( table, initialSortedColumn, customDataAccessors );
            return sorter;
        }
    };
}());
function readQueries()
{
	var x = window.location.search.replace("?", "");
	if (x.length > 0)
	{
		var tmp = x.split('&');
		var queries = {};
		var count = 0;
		for (var i in tmp)
		{
			var keyvalue = tmp[i].split('=');
			queries[keyvalue[0]] = keyvalue[1];
		}
	}
	return queries;
}
function showModalMessage(arg)
{
	var det = $('.messageModal').detach();
	if(arg["width"]) // small, wide, xl, xxl
	{
		var modalCard = '<div class="messageModal '+ arg["width"] +'"><div class="messageModalInner"><p class="modalText"></p><button class="modalCta">Close <i class="fa fa-close"></i></button></div></div>';
	}
	else
	{
		var modalCard = '<div class="messageModal"><div class="messageModalInner"><p class="modalText"></p><button class="modalCta">Close <i class="fa fa-close"></i></button></div></div>';
	}
	var message = arg["message"];
	var duration = parseInt(arg["duration"])|| 3000 ;
	$('body').append(modalCard);
	$('.messageModal .modalText').html(message);
	$('.messageModal').fadeIn(150).css("display","flex");
	setTimeout(function(){
		$('.messageModal .modalCta').click();
	},duration);
}
$(document).on("click", ".messageModal .modalCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.messageModal').fadeOut(150);
});
function lineChart(arg)
{
	var chartColors = arg["colors"];
	var chartGraphs = arg["graphs"];
	var chartValueAxes = arg["valueAxes"];
	var chartGraphTitles = arg["graphTitles"];
	var chartDataObj = arg["dataObj"];
	var chartCategoryName = arg["categoryField"];
	
	var chartNew = AmCharts.makeChart(arg["canvasDivId"],
		{
			"type": "serial",
			"path": "http://cdn.amcharts.com/lib/3/",
			"categoryField": chartCategoryName,
			"colors": chartColors,
			"startDuration": 1,
			"color": "#555555",
			"fontFamily": '"Lato", Helvetica, sans-serif',
			"fontSize": 14,
			"handDrawThickness": 3,
			"theme": "light",
			"categoryAxis": {
				"gridPosition": "start"
			},
			"trendLines": [],
			"graphs": chartGraphs,
			//"angle":"30",
			//"depth3D":"15",
			"guides": [],
			"valueAxes": chartValueAxes,
			"allLabels": [],
			"balloon": {},
			"legend": {
				"useGraphSettings": true
			},
			"titles": chartGraphTitles,
			"export": {
				"enabled": true,
				"libs": {
					"path": "http://cdn.amcharts.com/lib/3/plugins/export/libs/"
				}
			},
			"dataProvider": chartDataObj
		}
	);
}
// function to create the config data json for loading the chart
function loadPerfChart(arg)
{
	var plotColors = []; //no of colours here should equal the no of graphs being plotted in the chart
	var plotGraphs = [];
	var plotValueAxes = [];
	var plotGraphTitles = [];
	var plotDataObj = [];
	var prevWeight = null;

	var divid = arg["chartCanvas"];
	var categoryField = null;
	
	//{"canvasDivId":"chartdiv","colors":plotColors,"graphs":plotGraphs,"valueAxes":plotValueAxes,"graphTitles":plotGraphTitles,"dataObj":plotDataObj}
	switch (arg["typeParam"]){
		case '1': //Weight over time
			categoryField = "Date";
			plotColors.push("#D63443");
			plotGraphs.push({
				"balloonText": "[[title]], as on [["+ categoryField +"]] - [[value]] Kg",
				"bullet": "round",
				"id": "perfGraph1",
				"title": "User\'s Weight",
				"type": "smoothedLine",//smoothedLine
				"valueAxis": "ValueAxis-1",
				"valueField": "Weight",
				//"fillAlphas": "0.8"
			});
			plotValueAxes.push({
				"id": "ValueAxis-1",
				"title": "Weight in Kg"
			});
			plotGraphTitles.push({
				"id": "Title-1",
				"size": 18, //font-size of graph title
				"text": "Change in weight over time"
			});
			for (var l in window.dataPerfAll)
			{
				if(prevWeight)
				{
					var weightDiff = Math.abs((parseFloat(window.dataPerfAll[l]["weight"]) - prevWeight)/prevWeight);
				}
				if(!prevWeight || weightDiff < 0.1)
				{
					var weightDataSet = {};
					weightDataSet[categoryField] = window.dataPerfAll[l]["label"];
					weightDataSet["Weight"] = window.dataPerfAll[l]["weight"];
					weightDataSet["dateAbs"] = window.dataPerfAll[l]["dateAbs"];
					weightDataSet["fullDate"] = window.dataPerfAll[l]["date"];
					plotDataObj.push(weightDataSet);
					prevWeight = parseFloat(window.dataPerfAll[l]["weight"]);
				}
			}
			chartFlag = 1;
		break;
		case '2'://sleep pattern over time
			categoryField = "Date";
			plotColors.push("#17BCD3");
			plotGraphs.push({
				"balloonText": "[[title]], as on [["+ categoryField +"]] - [[value]] Hours",
				"bullet": "round",
				"id": "perfGraph2",
				"title": "User\'s Sleep Pattern",
				"type": "smoothedLine",//smoothedLine
				"valueAxis": "ValueAxis-1",
				"valueField": "Sleep",
				//"fillAlphas": "0.8"
			});
			plotValueAxes.push({
				"id": "ValueAxis-1",
				"title": "Sleep duration in Hours"
			});
			plotGraphTitles.push({
				"id": "Title-1",
				"size": 18, //font-size of graph title
				"text": "Change in sleep pattern over time"
			});
			for (var l in window.dataPerfAll)
			{
				var sleepDataSet = {};
				sleepDataSet[categoryField] = window.dataPerfAll[l]["label"];
				sleepDataSet["Sleep"] = window.dataPerfAll[l]["sleep"];
				sleepDataSet["dateAbs"] = window.dataPerfAll[l]["dateAbs"];
				sleepDataSet["fullDate"] = window.dataPerfAll[l]["date"];
				plotDataObj.push(sleepDataSet);
			}
			chartFlag = 1;
		break;
		case '3'://water consumption over time
			categoryField = "Date";
			plotColors.push("#FF9844");
			plotGraphs.push({
				"balloonText": "[[title]], as on [["+ categoryField +"]] - [[value]] Litres",
				"bullet": "round",
				"id": "perfGraph3",
				"title": "User\'s Water Consumption",
				"type": "smoothedLine",//smoothedLine
				"valueAxis": "ValueAxis-1",
				"valueField": "Water",
				//"fillAlphas": "0.8"
			});
			plotValueAxes.push({
				"id": "ValueAxis-1",
				"title": "Water Consumed in Litres"
			});
			plotGraphTitles.push({
				"id": "Title-1",
				"size": 18, //font-size of graph title
				"text": "Change in water consumption over time"
			});
			for (var l in window.dataPerfAll)
			{
				var waterDataSet = {};
				waterDataSet[categoryField] = window.dataPerfAll[l]["label"];
				waterDataSet["Water"] = window.dataPerfAll[l]["water"];
				waterDataSet["dateAbs"] = window.dataPerfAll[l]["dateAbs"];
				waterDataSet["fullDate"] = window.dataPerfAll[l]["date"];
				plotDataObj.push(waterDataSet);
			}
			chartFlag = 1;
		break;
		case '4'://weight change vs water consumed over time
			categoryField = "Date";
			plotColors.push("#D63443","#17BCD3");
			plotGraphs.push({
				"balloonText": "[[title]], as on [["+ categoryField +"]] - [[value]] Kgs",
				"bullet": "round",
				"id": "perfGraph4",
				"title": "User\'s Weight",
				"type": "smoothedLine",//smoothedLine
				"valueAxis": "ValueAxis-1",
				"valueField": "Weight",
				//"fillAlphas": "0.8"
			},{
				"balloonText": "[[title]], as on [["+ categoryField +"]] - [[value]] Litres",
				"bullet": "round",
				"id": "perfGraph5",
				"title": "User\'s Water Consumption",
				"type": "smoothedLine",//smoothedLine
				"valueAxis": "ValueAxis-2",
				"valueField": "Water",
				//"fillAlphas": "0.8"
			});
			plotValueAxes.push({
				"id": "ValueAxis-1",
				"title": "Weight in Kgs"
			},
			{
				"id": "ValueAxis-2",
				"position": "right",
				"title": "Water Consumed in Litres"
			});
			plotGraphTitles.push({
				"id": "Title-1",
				"size": 18, //font-size of graph title
				"text": "Weight change vs Water consumed over time"
			});
			for (var l in window.dataPerfAll)
			{
				if(prevWeight)
				{
					var weightDiff = Math.abs((parseFloat(window.dataPerfAll[l]["weight"]) - prevWeight)/prevWeight);
				}
				if(!prevWeight || weightDiff < 0.1)
				{
					var weightDataSet = {};
					weightDataSet[categoryField] = window.dataPerfAll[l]["label"];
					weightDataSet["Weight"] = window.dataPerfAll[l]["weight"];
					weightDataSet["Water"] = window.dataPerfAll[l]["water"];
					weightDataSet["dateAbs"] = window.dataPerfAll[l]["dateAbs"];
					weightDataSet["fullDate"] = window.dataPerfAll[l]["date"];
					plotDataObj.push(weightDataSet);
					prevWeight = parseFloat(window.dataPerfAll[l]["weight"]);
				}
			}
			chartFlag = 1;
		break;
		case '5'://weight change vs water consumed over time
			categoryField = "Date";
			plotColors.push("#D63443","#17BCD3");
			plotGraphs.push({
				"balloonText": "[[title]], as on [["+ categoryField +"]] - [[value]] Kgs",
				"bullet": "round",
				"id": "perfGraph6",
				"title": "User\'s Weight",
				"type": "smoothedLine",//smoothedLine
				"valueAxis": "ValueAxis-1",
				"valueField": "Weight",
				//"fillAlphas": "0.8"
			},{
				"balloonText": "[[title]], as on [["+ categoryField +"]] - [[value]] Hours",
				"bullet": "round",
				"id": "perfGraph7",
				"title": "User\'s Sleep Pattern",
				"type": "smoothedLine",//smoothedLine
				"valueAxis": "ValueAxis-2",
				"valueField": "Sleep",
				//"fillAlphas": "0.8"
			});
			plotValueAxes.push({
				"id": "ValueAxis-1",
				"title": "Weight in Kgs"
			},
			{
				"id": "ValueAxis-2",
				"position": "right",
				"title": "Sleep duration in Hours"
			});
			plotGraphTitles.push({
				"id": "Title-1",
				"size": 18, //font-size of graph title
				"text": "Weight change vs Sleep pattern over time"
			});
			
			for (var l in window.dataPerfAll)
			{
				if(prevWeight)
				{
					var weightDiff = Math.abs((parseFloat(window.dataPerfAll[l]["weight"]) - prevWeight)/prevWeight);
				}
				if(!prevWeight || weightDiff < 0.1)
				{
					var weightDataSet = {};
					weightDataSet[categoryField] = window.dataPerfAll[l]["label"];
					weightDataSet["Weight"] = window.dataPerfAll[l]["weight"];
					weightDataSet["Sleep"] = window.dataPerfAll[l]["sleep"];
					weightDataSet["dateAbs"] = window.dataPerfAll[l]["dateAbs"];
					weightDataSet["fullDate"] = window.dataPerfAll[l]["date"];
					plotDataObj.push(weightDataSet);
					prevWeight = parseFloat(window.dataPerfAll[l]["weight"]);
				}
			}
			chartFlag = 1;
		break;
	};
	if(chartFlag)
	{
		lineChart({"canvasDivId":divid,"colors":plotColors,"graphs":plotGraphs,"valueAxes":plotValueAxes,"graphTitles":plotGraphTitles,"dataObj":plotDataObj,"categoryField":categoryField});
		window.currentChart = arg;
		makeChartSummary(plotDataObj);
	}
}
//function to create the summary for the chart
function makeChartSummary(chartDataObj)
{
	var dataMax = chartDataObj.length - 1;
	var noOfSessions = chartDataObj.length;
	var noOfDays = Math.floor((chartDataObj[dataMax]["dateAbs"] - chartDataObj[0]["dateAbs"])/(60*60*24));
	
	switch(window.currentChart["typeParam"]){
		case '1':
			var weightLost = parseFloat(chartDataObj[0]["Weight"] - chartDataObj[dataMax]["Weight"]).toFixed(2);
			var summaryStr = '<p class="summaryText">Total weight lost: <span class="data">' + weightLost + ' Kgs</span>, in <span class="data">' + noOfSessions + ' sessions</span>, over <span class="data">' + noOfDays + " days</span></p>";
		break;
		case '2':
			var avgSleep = 0;
			for (var count in chartDataObj)
			{
				avgSleep += parseFloat(chartDataObj[count]["Sleep"]);
			}
			avgSleep = parseFloat(avgSleep / chartDataObj.length).toFixed(2);
			var summaryStr = '<p class="summaryText">Avg sleep duration: <span class="data">' + avgSleep + ' Hrs</span>, across <span class="data">' + noOfSessions + ' sessions</span>, over <span class="data">' + noOfDays + " days</span></p>";
		break;
		case '3':
			var avgWater = 0;
			for (var count in chartDataObj)
			{
				avgWater += parseFloat(chartDataObj[count]["Water"]);
			}
			avgWater = parseFloat(avgWater / chartDataObj.length).toFixed(2);
			var summaryStr = '<p class="summaryText">Avg water intake: <span class="data">' + avgWater + ' Litres</span>, across <span class="data">' + noOfSessions + ' sessions</span>, over <span class="data">' + noOfDays + " days</span></p>";
		break;
		case '4':
			var avgWater = 0;
			for (var count in chartDataObj)
			{
				avgWater += parseFloat(chartDataObj[count]["Water"]);
			}
			avgWater = parseFloat(avgWater / chartDataObj.length).toFixed(2);
			var weightLost = parseFloat(chartDataObj[0]["Weight"] - chartDataObj[dataMax]["Weight"]).toFixed(2);
			var summaryStr = '<p class="summaryText">Total weight lost: <span class="data">' + weightLost + 'Kgs</span>, with an avg water intake of: <span class="data">' + avgWater + ' Litres</span>, across <span class="data">' + noOfSessions + ' sessions</span>, over <span class="data">' + noOfDays + " days</span></p>";
		break;
		case '5':
			var avgSleep = 0;
			for (var count in chartDataObj)
			{
				avgSleep += parseFloat(chartDataObj[count]["Sleep"]);
			}
			avgSleep = parseFloat(avgSleep / chartDataObj.length).toFixed(2);
			var weightLost = parseFloat(chartDataObj[0]["Weight"] - chartDataObj[dataMax]["Weight"]).toFixed(2);
			var summaryStr = '<p class="summaryText">Total weight lost: <span class="data">' + weightLost + 'Kgs</span>, with an avg sleep duration of: <span class="data">' + avgSleep + ' Hrs</span>, across <span class="data">' + noOfSessions + ' sessions</span>, over <span class="data">' + noOfDays + " days</span></p>";
		break;
	}
	
	$('.summaryDiv').html(summaryStr);
}
function makeUrl( s ) {
    return encodeURIComponent( s ).replace( /\%20/g, '+' ).replace( /!/g, '%21' ).replace( /'/g, '%27' ).replace( /\(/g, '%28' ).replace( /\)/g, '%29' ).replace( /\*/g, '%2A' ).replace( /\~/g, '%7E' );
}
var overlaidForm = '<div class="reportCellBox"><input type="text" class="reportCellInput"></div>';
$(document).on("click",".reportDataList td", function(e){
	closeCellInput(1);
	var rw = $(this).parent('tr').index();
	var cl = $(this).index();
	if(rw < 1 || cl < 1)
	{
		return false;
	}
	$('.reportDataList td').not(this).removeClass("current");
	$(this).toggleClass("current");
	window.currentFocus = this;
});
$(document).on("dblclick",".reportDataList td", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.reportDataList td').not(this).removeClass("current");
	$(this).toggleClass("current");
	window.currentFocus = this;
	modifyCellContent(this);
});
$(document).on("click",".newReports .newReportsTop .addNew",function(e){
	e.preventDefault(); e.stopPropagation();
	popShow($('.newReports .addReportDateModal'));
});
$(document).on("keydown", function(e){
	// left 37, up 38, right 39, down 40, enter 13, esc 27, tab 9, backspace 8, space 32, delete 46
	var kp = e.which;
	if(window.currentFocus && window.currentFocus == 'input')
	{
		switch(kp){
			case 13:
				var orig = $('.newReportsMain .reportCellBox .reportCellInput').attr("data-val");
				var newval = $('.newReportsMain .reportCellBox .reportCellInput').val();
				if(newval != orig)
				{
					updateCellContent($('.newReportsMain .reportCellBox .reportCellInput'));
					closeCellInput(0);
				}
				else
				{
					closeCellInput(0);
				}
			break;
			case 27:
				closeCellInput(0);
			break;
		}
	}
	else if(window.currentFocus)
	{
		var rw = $(window.currentFocus).parent('tr').index();
		var cl = $(window.currentFocus).index() - 1;
		switch2(kp);
	}
	function switch2(opt){
		switch(opt)
		{
			case 37: //left key
				e.preventDefault(); e.stopPropagation();
				$('.reportDataList td').removeClass("current");
				$('.reportDataList tr').eq(rw).find('td').eq(cl-1).addClass("current");
				window.currentFocus = $('.reportDataList tr').eq(rw).find('td').eq(cl-1);
				pageCenter(window.currentFocus);
			break;
			case 38: //up key
				e.preventDefault(); e.stopPropagation();
				$('.reportDataList td').removeClass("current");
				$('.reportDataList tr').eq(rw-1).find('td').eq(cl).addClass("current");
				window.currentFocus = $('.reportDataList tr').eq(rw-1).find('td').eq(cl);
				pageCenter(window.currentFocus);
			break;
			case 39: //right key
			case 9: //tab key
				e.preventDefault(); e.stopPropagation();
				$('.reportDataList td').removeClass("current");
				$('.reportDataList tr').eq(rw).find('td').eq(cl+1).addClass("current");
				window.currentFocus = $('.reportDataList tr').eq(rw).find('td').eq(cl+1);
				pageCenter(window.currentFocus);
			break;
			case 40: //down key
				e.preventDefault(); e.stopPropagation();
				$('.reportDataList td').removeClass("current");
				$('.reportDataList tr').eq(rw+1).find('td').eq(cl).addClass("current");
				window.currentFocus = $('.reportDataList tr').eq(rw+1).find('td').eq(cl);
				pageCenter(window.currentFocus);
			break;
			case 13:
				modifyCellContent(window.currentFocus);
			break;
			case 27:
				$(window.currentFocus).removeClass("current");
				closeCellInput(1);
			break;
		}
	}
});
function pageCenter(elem)
{
	var posTop = $(elem)[0].offsetTop;
	var posLeft = $(elem)[0].offsetLeft;
	var pos = $(elem).position();
	var scLeft = $('.newReportsMain').scrollLeft();
	var scTop = $('.newReportsMain').scrollTop();
	var w = $('.newReportsMain').width();
	var h = $('.newReportsMain').height();
	var heightDiff = parseInt(posTop - h/2);
	var widthDiff = parseInt(posLeft - w/2);
	$('.newReportsMain').stop().animate({"scrollLeft":widthDiff,"scrollTop":heightDiff},200);
}
function modifyCellContent(obj)
{
	var vl = $(obj).text();
	var pos = $(obj).position();
	var scLeft = $('.newReportsMain').scrollLeft();
	var scTop = $('.newReportsMain').scrollTop();
	var rw = $(obj).parent('tr').index();
	var cl = $(obj).index();
	if(rw < 1 || cl < 1)
	{
		return false;
	}
	var reportDate = $('.reportDataList tr').eq(0).find('td').eq(cl - 1).attr("data-date");
	var actualKey = $('.reportDataList tr').eq(rw).find('th').attr("data-key");
	$('.reportCellBox').detach();
	$('.newReportsMain').append(overlaidForm);
	var lft = parseInt(pos.left + scLeft) + 'px'; var tp = parseInt(pos.top + scTop) + 'px';
	var w = parseInt($(obj).width() - 15) + 'px';
	var cellval = $(obj).text();
	$('.newReportsMain .reportCellBox').css({'left':lft,'top':tp});
	$('.newReportsMain .reportCellBox .reportCellInput').css({'width':w});
	$('.newReportsMain .reportCellBox .reportCellInput').attr({"data-date":reportDate,"data-key":actualKey,"data-val":vl});
	$('.newReportsMain .reportCellBox .reportCellInput').val(cellval).focus();
	window.previousFocus = window.currentFocus;
	window.currentFocus = 'input';
}
function closeCellInput(flag)
{
	$('.reportCellBox').detach();
	switch(flag){
		case 0:
			if(window.previousFocus)
			{
				window.currentFocus = window.previousFocus;
				$(window.currentFocus).focus();
			}
			else
			{
				window.currentFocus = null;
			}
		break;
		case 1:
			window.currentFocus = null;
			window.previousFocus = null;
		break;
	}
}
function updateCellContent(elem)
{
	var cellVal = $(elem).val();
	var cellDate = $(elem).attr("data-date");
	var cellKey = $(elem).attr("data-key");

	var updateCell = postCellContent({"value":cellVal,"date":cellDate,"key":cellKey});
	if(updateCell && updateCell["responseCode"] && updateCell["responseCode"] == 1000)
	{
		loadNewReports(window.currentReportedDates);
	}
	else if(updateCell && updateCell["responseCode"])
	{
		var errmsg = "Error code: " + updateCell["responseCode"] + ", " + updateCell["response"];
		showModalMessage({"message":errmsg});
	}
}
function attachLoader()
{
	var loaderCard = '<div class="loader"><h4 class="loaderText">Waiting</h4><img class="loaderImg" src="http://cdn.orobind.com/srv/static/imagesV2/orobind-spinning-clock.gif"></div>';
	$('body').append(loaderCard);
}
function detachLoader()
{
	$('.loader').detach();
}
function zeroPrefix(obj)
{
	var val = parseInt(obj);
	if(val < 10)
	{
		var retstr = '0'+val;
		return retstr
	}
	else{
		return val;
	}
}
$(document).on("click", ".cal tbody tr td", function(){
	var thisDate = $(this).attr("data-val");

	//if date is not valid for this month, dont do anything
	if($(this).hasClass('off'))
	{
		return false;
	}

	//check whether session group is old format or new
	if(window.currentUserGroup["wrktDays"])
	{
		//new session group
		//check if any date is already selected
		if($(this).hasClass('selected'))
		{
			//if this date is blank and is selected
			$(this).toggleClass('selected');
			var keystr = ''+$(this).index()+$(this).parent('tr').index()+'';
			delete window.currentChosen[keystr];
			chosenstr = window.currentCal['year']+'-'+zeroPrefix(parseInt(window.currentCal['month'])+1)+'-'+zeroPrefix($(this).text());
			for (var key in window.addstr)
			{
				if(window.addstr[parseInt(key)] == chosenstr)
				{
					window.addstr.splice(parseInt(key),1);
				}
			}
			var txt = '';
			for (var key in window.addstr)
			{
				txt += '<div class="newDateRow">';
				txt += '<span class="newDateVal">'+window.addstr[key].split('-').reverse().join('-')+'</span>'
				txt += '<span class="newDateInput"><input type="text" class="dateChangeInput" placeholder="16:30"></span>';
				txt += '</div>';
			}
			if(window.addstr.length > 0)
			{
				$('.selectedDates').html(txt);
				$('.doneSession, .dataCta').hide(100);
				$('.addInfo, .addCta').show(100);
			}
			else
			{
				$('.addInfo, .addCta').hide(100);
			}
		}
		else if($(this).hasClass('selected-alt'))
		{
			//if this date has session and is selected
			if($('.selected').is(':visible'))
			{
				//already some blank sessions are selected
				$(this).toggleClass('selected-alt');
				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
				$('.doneSession').hide(100);
				$('.addInfo, .addCta').show(100);
			}
			else
			{
				//no blank sessions are selected
				$(this).toggleClass('selected-alt');
				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
				$('.doneSession').hide(100);
				$('.addInfo, .addCta').hide(100);
			}
		}
		else if($('.selected').is(':visible'))
		{
			//another blank date(s) selected
			if($(this).hasClass('restricted'))
			{
				$('.addInfo, .addCta').hide(100);
				$(this).toggleClass('selected-alt');
				//new selection has session as well
				if($(this).hasClass('done'))
				{
					// new selection is marked 'done'
					$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
					$('.doneSession').show(100);
				}
				else
				{
					// new selection is not marked 'done'
					$('.doneSession').hide(100);

					$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').show(100);

					window.reschedulestr = $(this).attr("data-val");
					var txt = window.reschedulestr.split('-').reverse().join('-');
					$('.reschdate').text(txt);

					putSessionDate();
				}
			}
			else
			{
				//new selection doesn't have session
				newBlank(this);
			}
		}
		else if($('.selected-alt').is(':visible'))
		{
			//another session date is selected
			if($(this).hasClass('restricted'))
			{
				$('.selected-alt').removeClass('selected-alt');
					
				$(this).toggleClass('selected-alt');

				//new selection has session as well
				if($(this).hasClass('done'))
				{
					// new selection is marked 'done'
					$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
					$('.doneSession').show(100);
				}
				else
				{
					// new selection is not marked 'done'
					$('.doneSession').hide(100);

					$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').show(100);

					window.reschedulestr = $(this).attr("data-val");
					var txt = window.reschedulestr.split('-').reverse().join('-');
					$('.reschdate').text(txt);

					putSessionDate();
				}
			}
			else
			{
				//new selection doesn't have session
				$('.selected-alt').removeClass('selected-alt');
				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta, .doneSession').hide(100);	
				newBlank(this);
			}
		}
		else if($(this).hasClass('restricted'))
		{
			$(this).toggleClass('selected-alt');
			$('.addInfo, .addCta').hide(100);

			// no date is selected and this one has a session
			if($(this).hasClass('done'))
			{
				// this date is marked 'done'
				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
				$('.doneSession').show(100);
			}
			else
			{
				// this date is not marked 'done'
				$('.doneSession').hide(100);

				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').show(100);

				window.reschedulestr = $(this).attr("data-val");
				var txt = window.reschedulestr.split('-').reverse().join('-');
				$('.reschdate').text(txt);

				putSessionDate();
			}
		}
		else
		{
			// no date is selected and this one is blank
			newBlank(this);
		}
	}
	else
	{
		//old
		//check if any date is already selected
		if($(this).hasClass('selected'))
		{
			//if this date is blank and is selected
			$(this).toggleClass('selected');
			var keystr = ''+$(this).index()+$(this).parent('tr').index()+'';
			delete window.currentChosen[keystr];
			chosenstr = window.currentCal['year']+'-'+zeroPrefix(parseInt(window.currentCal['month'])+1)+'-'+zeroPrefix($(this).text());
			for (var key in window.addstr)
			{
				if(window.addstr[parseInt(key)] == chosenstr)
				{
					window.addstr.splice(parseInt(key),1);
				}
			}
			var txt = '';
			for (var key in window.addstr)
			{
				txt += '<div class="newDateRow">';
				txt += '<span class="newDateVal">'+window.addstr[key].split('-').reverse().join('-')+'</span>'
				txt += '<span class="newDateInput"><input type="text" class="dateChangeInput" placeholder="16:30"></span>';
				txt += '</div>';
			}
			if(window.addstr.length > 0)
			{
				$('.selectedDates').html(txt);
				$('.doneSession, .dataCta').hide(100);
				$('.addInfo, .addCta').show(100);
			}
			else
			{
				$('.addInfo, .addCta').hide(100);
			}
		}
		else if($(this).hasClass('selected-alt'))
		{
			//if this date has session and is selected
			if($('.selected').is(':visible'))
			{
				//already some blank sessions are selected
				$(this).toggleClass('selected-alt');
				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
				$('.doneSession').hide(100);
				$('.addInfo, .addCta').show(100);
			}
			else
			{
				//no blank sessions are selected
				$(this).toggleClass('selected-alt');
				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
				$('.doneSession').hide(100);
				$('.addInfo, .addCta').hide(100);
			}
		}
		else if($('.selected').is(':visible'))
		{
			//another blank date(s) selected
			if($(this).hasClass('restricted'))
			{
				$('.addInfo, .addCta').hide(100);
				$(this).toggleClass('selected-alt');
				//new selection has session as well
				if($(this).hasClass('done'))
				{
					// new selection is marked 'done'
					$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
					$('.doneSession').show(100);
				}
				else
				{
					// new selection is not marked 'done'
					$('.doneSession').hide(100);

					$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').show(100);

					window.reschedulestr = $(this).attr("data-val");
					var txt = window.reschedulestr.split('-').reverse().join('-');
					$('.reschdate').text(txt);

					putSessionDate();
				}
			}
			else
			{
				//new selection doesn't have session
				defaultBlank(this);
			}
		}
		else if($('.selected-alt').is(':visible'))
		{
			//another session date is selected
			if($(this).hasClass('restricted'))
			{
				$('.selected-alt').removeClass('selected-alt');
					
				$(this).toggleClass('selected-alt');

				//new selection has session as well
				if($(this).hasClass('done'))
				{
					// new selection is marked 'done'
					$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
					$('.doneSession').show(100);
				}
				else
				{
					// new selection is not marked 'done'
					$('.doneSession').hide(100);

					$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').show(100);

					window.reschedulestr = $(this).attr("data-val");
					var txt = window.reschedulestr.split('-').reverse().join('-');
					$('.reschdate').text(txt);

					putSessionDate();
				}
			}
			else
			{
				//new selection doesn't have session
				$('.selected-alt').removeClass('selected-alt');
					
				defaultBlank(this);
			}
		}
		else if($(this).hasClass('restricted'))
		{
			$(this).toggleClass('selected-alt');
			$('.addInfo, .addCta').hide(100);

			// no date is selected and this one has a session
			if($(this).hasClass('done'))
			{
				// this date is marked 'done'
				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').hide(100);
				$('.doneSession').show(100);
			}
			else
			{
				// this date is not marked 'done'
				$('.doneSession').hide(100);

				$('.existInfo, .rescheduleCta, .cancelCta, .dataInfo, .dataCta').show(100);

				window.reschedulestr = $(this).attr("data-val");
				var txt = window.reschedulestr.split('-').reverse().join('-');
				$('.reschdate').text(txt);

				putSessionDate();
			}
		}
		else
		{
			// no date is selected and this one is blank
			defaultBlank(this);
		}
	}
});

function defaultBlank(obj)
{
	$(obj).toggleClass('selected');

	var x = $(obj).text();

	var keystr = ''+$(obj).index()+$(obj).parent('tr').index()+'';
	var keyval = {};
	keyval[keystr] = {'td':$(obj).index(), 'tr':$(obj).parent('tr').index(), 'month':window.currentCal['month']};
	$.extend(window.currentChosen, keyval);

	chosenstr = window.currentCal['year']+'-'+zeroPrefix(parseInt(window.currentCal['month']+1))+'-'+zeroPrefix(x);
	window.addstr.push(chosenstr);

	var txt = '';
	for (var key in window.addstr)
	{
		txt += window.addstr[key].split('-').reverse().join('-') + ', ';
	}
	
	$('.overallTime').hide();
	$('.selectedDates').html(txt);
	$('.doneSession, .dataCta').hide(100);
	$('.addInfo, .addCta').show(100);
}

function newBlank(obj)
{
	$('.selected').removeClass('selected');
	$(obj).toggleClass('selected');

	var x = $(obj).text();

	window.currentChosen = {};

	var keystr = ''+$(obj).index()+$(obj).parent('tr').index()+'';
	var keyval = {};
	keyval[keystr] = {'td':$(obj).index(), 'tr':$(obj).parent('tr').index(), 'month':window.currentCal['month']};
	$.extend(window.currentChosen, keyval);

	window.addstr = [];
	chosenstr = window.currentCal['year']+'-'+zeroPrefix(parseInt(window.currentCal['month']+1))+'-'+zeroPrefix(x);
	window.addstr.push(chosenstr);

	var txt = window.addstr[0].split('-').reverse().join('-');
	
	$('.overallTime').show();
	$('.selectedDates').html(txt);
	$('.doneSession, .dataCta').hide(100);
	$('.addInfo, .addCta').show(100);
}

function putSessionDate()
{
	currentDate = window.reschedulestr;
	var code = getSessionCode(currentDate);

	var thisTime = getTimeForSession({"code":code});

	if(thisTime && thisTime["statusCode"] && thisTime["statusCode"] == 1000)
	{
		var sessTime = moment(thisTime["startTime"],"YYYY-MM-DD hh:mm:ss");
	}
	$('.reschTime').text(sessTime.format("h:mm a"));
}

$(document).on("click",".addCta",function(){
	if($('.overallTime').is(':visible'))
	{
		if($('.overallTime .commonTime').val()){
			$('.overallTime .commonTime').removeClass('error');
			addSessionsUser({"email":window.userEmail,"dates":window.addstr,"time":$('.overallTime .commonTime').val()});
		}
		else
		{
			$('.overallTime .commonTime').addClass('error').focus();
		}
	}
	else
	{
		addSessionsUser({"email":window.userEmail,"dates":window.addstr});
	}
	//addSessionsUser({"userEmail":window.userEmail, "dates":window.addstr, "time":window.addtime});
});

$(document).on("click",".rescheduleCta",function(){
	$form = $(this).parents('.sessioninfo').find('.rescheduleInput')
	if(validateSchedule($form))
	{
		popShow($('.userSessions .sendSMSCheck'));
		window.reschForm = $form; window.cancelForm = null;
	}
});

$(document).on("click",".sendSMSCheck .affirmCta",function(){
	if(window.reschForm)
	{
		popHide($('.userSessions .sendSMSCheck'));
		finishReschedule(window.reschForm,true);	
	}
	else
	{
		popHide($('.userSessions .sendSMSCheck'));
		finishCancel(window.cancelForm,true);
	}
});

$(document).on("click",".sendSMSCheck .rejectCta",function(){
	if(window.reschForm)
	{
		popHide($('.userSessions .sendSMSCheck'));
		finishReschedule(window.reschForm,false);	
	}
	else
	{
		popHide($('.userSessions .sendSMSCheck'));
		finishCancel(window.cancelForm,false);
	}
});

function finishReschedule($form,opt)
{
	currentDate = window.reschedulestr;
	var code = getSessionCode(currentDate);

	var targetDate = $form.find('.rescheduleDate').val().split("-").reverse().join("-");
	var targetTime = $form.find('.rescheduleTime').val()+':00';
	var targetComment = $form.find('.rescheduleComment').val();
	userSessionReschedule(code,targetDate,targetTime,targetComment,window.userEmail,opt);
}

$(document).on("click",".cancelCta",function(){
	$form = $(this).parents('.sessioninfo').find('.rescheduleInput')
	if(validateCancel($form))
	{
		window.cancelForm = $form; window.reschForm = null;
		popShow($('.userSessions .sendSMSCheck'));
	}
});

function getSessionCode(datestr)
{
	for (var i in window.datelistobj)
	{
		if(window.datelistobj[i]['date'] == datestr)
		{
			return window.datelistobj[i]['code'];
		}
	}
}

function finishCancel($form,opt)
{
	currentDate = window.reschedulestr;
	var code = getSessionCode(currentDate);

	var targetComment = $form.find('.rescheduleComment').val();
	userSessionCancel(code,targetComment,window.userEmail,opt);
}

var now   = new Date();
var today   = now.getDate();
var day = now.getDay();
var month = now.getMonth();
var year  = now.getFullYear();

var placeholder = '<table class="cal"><caption><span class="prev"><i class="fa fa-chevron-left"></i></span><h3 class="calTitle">Jan 2014</h3><span class="next"><i class="fa fa-chevron-right"></i></span></caption><thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>';


$.fn.makeCal = function (arg) {
	// arg prototype - {"restricted":"string", "class":"classes given""}
	$(this).customCal({"month":month, "year":year, "class":arg["class"], "restricted":arg["restricted"], "done":arg["done"]});
	window.argCal = arg;
};
$.fn.customCal = function (arg) {
	// arg prototype - {"month":"12", "year":"2014", "restricted":"string", "class":"classes given")"}
	// define monthnames and daynames
	window.restobj = {};
	window.doneobj = {};
	window.currentChosen={};
	window.addstr = [];
	window.calparent = this;
	var monthnames = {1:'January', 2:'February', 3:'March', 4:'April', 5:'May', 6:'June', 7:'July', 8:'August', 9:'September', 10:'October', 11:'November', 12:'December'};
	var daynames = {1:'Sunday', 2:'Monday', 3:'Tuesday', 4:'Wednesday', 5:'Thursday', 6:'Friday', 7:'Saturday'};
	// parse the restricted dates string from the arguement object passed
	try {
		if(arg["restricted"])
		{
			var restarray = arg["restricted"].split(",");	
			for (key in restarray)
			{
				var temp = restarray[key].split("-");
				var tempstr = '{"'+key+'" :{"year":"'+temp[0]+'", "month":"'+temp[1]+'", "date":"'+temp[2]+'"}}';
				$.extend(window.restobj, JSON.parse(tempstr));
			}
		}
	}
	catch(e) {
		window.restobj = {};
	}
	try {
		if(arg["done"])
		{
			var donearray = arg["done"].split(",");	
			for (key in donearray)
			{
				var temp = donearray[key].split("-");
				var tempstr = '{"'+key+'" :{"year":"'+temp[0]+'", "month":"'+temp[1]+'", "date":"'+temp[2]+'"}}';
				$.extend(window.doneobj, JSON.parse(tempstr));
			}
		}
	}
	catch(e) {
		window.doneobj = {};
	}
	// define the month and year to be displayed from the arguement object passed
	month = parseInt(arg["month"]);
	year = parseInt(arg["year"]);
	window.currentCal = {'year':year, 'month':month};
	
	// remove the 'selected-alt' class from the dates
	$('.cal td.selected-alt').removeClass('selected-alt');
	//create the html structure for the calendar in the container elementFromPoint
	if($('.cal').length > 0)
	{
		// remove the 'selected' class from the dates
		$('.cal td.selected').removeClass('selected');
		
		// if the month does not contain any restricted dates, remove the class restricted from all dates
		for (s in window.restobj)
		{
			if(parseInt(month) !== parseInt(window.restobj[s]['month']-1))
			{
				$('.cal td').removeClass('restricted');
			}
		}
		// if the month does not contain any done session dates, remove the class done from all dates
		for (t in window.doneobj)
		{
			if(parseInt(month) !== parseInt(window.doneobj[t]['month']-1))
			{
				$('.cal td').removeClass('done');
			}
		}
	}
	else
	{
		// insert the calendar placeholder into the element where orocal was called
		$(this).prepend(placeholder);
		
		// add the user defined classes as required
		if(arg["class"])
		{
			$('.cal').addClass(arg["class"]);
		}
	}
	
	// define the variables required for populating the dates in the fields
	var days = getDaysInMonth(month+1,year);
	var firstOfMonth = new Date (year, month, 1);
	var lastOfMonth = new Date (year, month + 1, 0);
	var startingPos = firstOfMonth.getDay();
	days += startingPos;
	var prev = getDaysInMonth(month,year);
	var cal = $('.cal');
	var todays = new Date();
	var cDate = todays.getDate();
	var cMonth = todays.getMonth();
	var cYear = todays.getFullYear();
	
	//window.currentMonthSessions = getCurrentMonthSessions(window.userEmail,firstOfMonth,lastOfMonth);
	// change the current month & year displayed
	cal.find('.calTitle').text(monthnames[month+1] +' '+ year);
	
	// declare the loop counters required
	var j=1; var k = 1;
	var n = 1;
	
	// loop to populate the dates till the starting date of the current month (from previous month)
	for (i = 0; i < startingPos; i++) {
		var cell = cal.find('tbody').find('tr:nth-child('+j+') td:nth-child('+n+')');
		var x = prev - startingPos + 1 + i;
		cell.text(x);
		cell.addClass('off');
		cell.removeClass('active');
		n++;
	}
	
	// loop to populate the dates of the current month
	k = i+1;
	for (i = startingPos; i < days; i++) {
		var cell = cal.find('tbody').find('tr:nth-child('+j+') td:nth-child('+k+')');
		var x = 1 + i - startingPos;
		cell.text(x);
		var cellDate = window.currentCal["year"] + "-" + zeroPrefix(window.currentCal["month"] + 1) + "-" + zeroPrefix(x);
		cell.attr("data-val",cellDate);
		cell.removeClass('active off');
		if(x == cDate && month == cMonth && year == cYear){
			cell.addClass('active');
		}
		if(window.currentChosen){
			for (var key in window.currentChosen)
			{
				var a = window.currentChosen[key]['td']+1;
				var b = window.currentChosen[key]['tr']+1;
				if(month == window.currentChosen[key]['month'] && k == a && j == b){
					cell.addClass('selected');
				}
			}
		}
		for (s in window.restobj)
		{
			if (x == window.restobj[s]['date'] && year == window.restobj[s]['year'] && month == eval(window.restobj[s]['month']-1))
			{
				cell.addClass('restricted');
			}
		}
		for (var q in window.doneobj)
		{
			if (x == window.doneobj[q]['date'] && year == window.doneobj[q]['year'] && month == eval(window.doneobj[q]['month']-1))
			{
				cell.addClass('done');
			}
		}
		k++;
		if(cell.is(':last-child')){		
			j++;
		}
		if (k == 8)
		{
			k = 1;
		}
	}
	
	// loop to populate the days from the end of current month till the end of the fields (next month)
	for (i=days; i<42; i++) {
		var cell = cal.find('tbody').find('tr:nth-child('+j+') td:nth-child('+k+')');
		var x = 1 + i - days;
		cell.text(x);
		cell.addClass('off');
		cell.removeClass('active');
		k++;
		if(cell.is(':last-child')){		
			j++;
		}
		if (k == 8)
		{
			k = 1;
		}
	}
	
	// add jquery chainability
	return this;
};
function getCurrentMonthSessions(uemail,monthStart,monthEnd) {
	var ms = monthStart.getFullYear() + "-" + zeroPrefix(monthStart.getMonth()+1) + "-" + zeroPrefix(monthStart.getDate());
	var me = monthEnd.getFullYear() + "-" + zeroPrefix(monthEnd.getMonth()+1) + "-" + zeroPrefix(monthEnd.getDate());
	return getSessionsUserDate(uemail,ms,me,0,45);
}
function getDaysInMonth(month,year)  {
	var days;
	if (month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12 || month==0)  days=31;
	else if (month==4 || month==6 || month==9 || month==11) days=30;
	else if (month==2)  {
		if (isLeapYear(year)) { days=29; }
		else { days=28; }
	}
return (days);
};
function isLeapYear (Year) {
	if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
		return (true);
	} 
	else { return (false); }
};
$(document).on('click', '.cal .next', function (e) {
	if(window.currentCal['month'] < 11){
		var month = window.currentCal['month'] + 1;
	}
	else {
		month = 0;
		year++;
	}
	restlist = window.argCal["restricted"];
	donelist = window.argCal["done"];
	$(window.calparent).customCal({"month":month, "year":year, "restricted":restlist, "done":donelist});
});
$(document).on('click', '.cal .prev', function (e) {
	if(window.currentCal['month'] > 0){			
		var month = window.currentCal['month'] - 1;
	}
	else {
		month = 11;
		year--;
	}
	restlist = window.argCal["restricted"];
	donelist = window.argCal["done"];
	$(window.calparent).customCal({"month":month, "year":year, "restricted":restlist, "done":donelist});
});