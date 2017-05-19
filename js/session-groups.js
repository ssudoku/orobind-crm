//sahil's session groups module javascript - over-written and modified by sudhakar

//global variable that contains the url parameters
urlSessionGroupList = "/panel/sessiongrp/showallusersessiongrp";
urlFetchNewCoach = "/panel/sessiongrp/getcoach";
urlUserGrpDetails = "/panel/sessiongrp/userdetailbyemail";
urlSessionGroupByUser = "/panel/sessiongrp/getsessiongrpbyuser";
urlCreateSessionGroup = "/panel/sessiongrp/createsessiongrp";
urlUpdateSessionGroup = "/panel/sessiongrp/updatesessiongrp";
urlCreateNewUser = "/panel/sessiongrp/adduser";
urlUpdateUser = "/panel/sessiongrp/updateuser";

//global variables that are required in the functions
var theDay = "";
var oSystem = "";
var nameNew = "";
var mobileNew = "";
var coachName = "";
var timeSlot = "";
var latt = "00.0000";
var longg = "00.0000";
var slotType = "";
var coachCode = "";
var startDate = "";
var isTrial = "";
var seSSAll = false;

function initialize() {
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(12.97262, 77.64009),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
    map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
}
function loadScript(src,callback){
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(callback)script.onload=callback;
	document.getElementsByTagName("head")[0].appendChild(script);
	script.src = src;
}

$(document).ready(function(){
	//UI action in side navigation bar to trigger this panel
	$('.groupsLink').click(function(){
		$('.main').append(sessGrpCard);
		$.getScript(window.locationpickerurl, function(){
			loadSessionGroupsList({"start":0,"count":30});
		});
		$('.sideNavToggle').click();
	});
});

curSelDays = [];
$(document).on("click",".sessGroupsMain .userOnboardingModal .newSessionGroupForm .weekdays", function(e){
	e.preventDefault(); e.stopPropagation();
	$(this).toggleClass('chosen');

	var daystr = $(this).attr("data-day");
	
	if($.inArray(daystr,curSelDays) >=0)
	{
		curSelDays.splice($.inArray(daystr,curSelDays),1);
	}
	else{
		curSelDays.push(daystr);
	}

	var timeselstr = ".sessGroupsMain .userOnboardingModal .newSessionGroupForm .newTimeRow .timeSlotContainer." + daystr;
	$(timeselstr).toggleClass("active");
});

$(document).on('change','.sessGroupsMain .userOnboardingModal .newSessionGroupForm .toggleDays input[type="radio"]', function(){
	var tid = $(this).attr("id");
	if(tid == "daysOld")
	{
		$('.sessGroupsMain .userOnboardingModal .newSessionGroupForm .newDaysRow, .sessGroupsMain .userOnboardingModal .newSessionGroupForm .newTimeRow').hide();
		$('.sessGroupsMain .userOnboardingModal .newSessionGroupForm .oldDaysRow, .sessGroupsMain .userOnboardingModal .newSessionGroupForm .oldTimeRow').show().css("display","flex");
	}
	else if(tid == "daysNew")
	{
		$('.sessGroupsMain .userOnboardingModal .newSessionGroupForm .newDaysRow, .sessGroupsMain .userOnboardingModal .newSessionGroupForm .newTimeRow').show().css("display","flex");
		$('.sessGroupsMain .userOnboardingModal .newSessionGroupForm .oldDaysRow, .sessGroupsMain .userOnboardingModal .newSessionGroupForm .oldTimeRow').hide();
	}
});

//Button onclick handlers for edit session and edit user
$(document).on("click",".actionBtn.editUser", function(e){
	e.preventDefault(); e.stopPropagation();
	var uEmail = $(this).parent('td').attr("data-email");
	loadAddUser({"email":uEmail,"mode":"update"});
});

//Button onclick handlers result count update button
$(document).on("click",".sessGroupsPagination .pageCountCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var pCount = $('.sessGroupsPagination .pageResultCount').val();
	if(pCount)
	{
		loadSessionGroupsList({"start":0,"count":pCount});
	}
});

//Handler for when user clicks on a page nav arrow
$(document).on("click", ".sessGroupsPagination .numberNavLink", function(e){
	e.preventDefault(); e.stopPropagation();
	if($(this).hasClass('first'))
	{
		loadSessionGroupsList({"count":window.groupsPagination["count"],"start":0});
	}
	else if($(this).hasClass('previous'))
	{
		if(window.groupsPagination["current"] == 1)
		{
			return false;
		}
		else
		{
			var startVal = (window.groupsPagination["current"] - 2) * window.groupsPagination["count"];
			loadSessionGroupsList({"count":window.groupsPagination["count"],"start":startVal});
		}
	}
	else if($(this).hasClass('next'))
	{
		if(parseInt(window.groupsPagination["current"]) === parseInt(window.groupsPagination["pages"]))
		{
			return false;
		}
		else
		{
			var startVal = window.groupsPagination["current"] * window.groupsPagination["count"];
			loadSessionGroupsList({"count":window.groupsPagination["count"],"start":startVal});
		}
	}
	else if($(this).hasClass('last'))
	{
		var startVal = (window.groupsPagination["pages"] - 1) * window.groupsPagination["count"];
		loadSessionGroupsList({"count":window.groupsPagination["count"],"start":startVal});
	}
});

// Button onclick handler for page number update button
$(document).on("click", ".sessGroupsPagination .pageNavCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var countVal = $('.sessGroupsPagination .pageResultCount').val();
	if($(this).siblings('.paginationInput').val() !== '')
	{
		var startVal = (parseInt($(this).siblings('.paginationInput').val())-1)*countVal;
	}
	else
	{
		$(this).siblings('.paginationInput').focus();
		return false;
	}
	//window.groupsPagination["count"]
	loadSessionGroupsList({"start":startVal,"count":countVal});
});

//Button onclick handlers for search by email
$(document).on("click",".searchEmail .searchEmailSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	if(validateEmail($('.searchEmail .inputEmail').val()))
	{
		$('.searchEmail .inputEmail').removeClass("error");
		loadSessionGroupsUser({"userEmail":$('.searchEmail .inputEmail').val()});
	}
	else
	{
		$('.searchEmail .inputEmail').addClass("error").focus();
	}
});

$(document).on("click",".actionBtn.addSession", function(e){
	e.preventDefault(); e.stopPropagation();
	var uEmail = $(this).parent('td').attr("data-email");
	loadAddSessionGroup({"email":uEmail,"mode":"new"});
	
});

$(document).on("click",".actionBtn.editSession", function(e){
	e.preventDefault(); e.stopPropagation();
	var uEmail = $(this).parent('td').attr("data-email");
	loadAddSessionGroup({"email":uEmail,"mode":"update"});
	
});

//Function to close the modals
$(document).on("click",".modal .close", function(e){
	e.preventDefault(); e.stopPropagation();
	popHide($(this).parents('.modal'));
});

//Function to launch the user adding modal
$(document).on("click",".sessGroupsTop .addUserCta", function(e){
	e.preventDefault(); e.stopPropagation();
	loadAddUser();
});

//Function to handle the add user cta in user adding modal
$(document).on("click",".newUserCta", function(e){
	e.preventDefault(); e.stopPropagation();
	newUser({"elem":$(this).parents('form'),"mode":"new"});
});

//Function to handle the add user cta in user updating modal
$(document).on("click",".updateUserCta", function(e){
	e.preventDefault(); e.stopPropagation();
	newUser({"elem":$(this).parents('form'),"mode":"update"});
});

//Function to handle the no thanks option after adding user succesfully
$(document).on("click",".decisionForm .rejectCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popHide($('.decisionModal'));
});

//Function to handle the create session option after adding user succesfully
$(document).on("click",".decisionForm .acceptCta", function(e){
	e.preventDefault(); e.stopPropagation();
	popHide($('.decisionModal'));
	loadAddSessionGroup();
});

//Function to handle find a coach cta on the add session group modal
$(document).on("click",".userOnboardingModal .newSessionGroupForm .fetchCoach", function(e){
	e.preventDefault(); e.stopPropagation();
	var formobj = $(this).parents("form");
	getRecommendedCoach(formobj);
});

//Function to handle create sessions cta on the add session group modal
$(document).on("click",".userOnboardingModal .newSessionGroupForm .createCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var formobj = $(this).parents("form");
	createSessionGroup(formobj);
});

//Function to handle update sessions cta on the add session group modal
$(document).on("click",".userOnboardingModal .newSessionGroupForm .updateCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var formobj = $(this).parents("form");
	createSessionGroup(formobj);
});

//Function to create the pagination parameters
function paginateGroups(arg)
{
	if(arg && arg["count"])
	{
		$('.sessGroupsPagination .pageResultCount').val(arg["count"]);
	}
	if(arg && arg["data"] && arg["data"]["totalCount"])
	{
		if(arg["count"])
		{
			var pages = Math.floor(arg["data"]["totalCount"] / arg["count"]);
			if((arg["data"]["totalCount"] % arg["count"]) > 0)
			{
				pages++;
			}
		}
		else
		{
			var pages = Math.floor(arg["data"]["totalCount"] / 30);
			if((arg["data"]["totalCount"]%30) > 0)
			{
				pages++;
			}
		}
		var currentPage = (arg["start"] / arg["count"]) + 1;
		$('.sessGroupsPagination .which').text(currentPage);
		$('.sessGroupsPagination .totalCount').text(pages);
	}
	try {
		window.groupsPagination = {"start":arg["start"],"current":currentPage,"count":arg["count"],"pages":pages};
	}
	catch(e)
	{
		console.log(e);
	}
	if(arg["data"] && window.groupsPagination)
	{
		if(arg["start"] == 0)
		{
			$('.sessGroupsPagination .numberNavLink.first, .sessGroupsPagination .numberNavLink.previous').hide();
		}
		if(currentPage == window.groupsPagination["pages"])
		{
			$('.sessGroupsPagination .numberNavLink.last, .sessGroupsPagination .numberNavLink.next').hide();
		}
	}
}

//Function to load the session adding modal
function loadAddSessionGroup(arg)
{
	window.currentCoach = null;
	//$('.fetchedCoachResult .resultItem, .newSessionGroupForm .createCta, .newSessionGroupForm .updateCta').hide();
	$('.newSessionGroupForm .createCta, .newSessionGroupForm .updateCta').removeClass('updateCta').addClass('createCta');
	$('.newSessionGroupForm .createCta').html('Create Sessions <i class="fa fa-angle-double-right"></i>');
	$('.formRow .fetchCoach').html('Find a Coach <i class="fa fa-search"></i>');
	$('.timeSlotDay').datetimepicker({
		datepicker:false,
		format: 'H:i',
		step: 15,
		onChangeDateTime: function(){
			$('.timeSlotDay').datetimepicker('hide');
		}
	});
	$('.onboardingFormInput.demoWhen').datetimepicker({
		format: 'Y-m-d H:i:s',
		onChangeDateTime: function(){
			$('.onboardingFormInput.demoWhen').datetimepicker('hide');
		}
	});
	if(arg && arg["mode"] && arg["mode"] == "update")
	{
		$('.fetchedCoachResult .resultItem, .newSessionGroupForm .createCta').show(100);
		$('.formRow .fetchCoach').html('Coach name <i class="fa fa-search"></i>');
		$('.newSessionGroupForm .createCta').html('Update Sessions <i class="fa fa-angle-double-right"></i>').removeClass('createCta').addClass('updateCta');
		
		var onBoardForm = $('.userOnboardingModal .userOnboardingModalInner');
		if(window.currentUserGroupDetails)
		{
			var detailsObj = window.currentUserGroupDetails;
		}
		else if(window.currentUserGroupListDetails)
		{
			for(var i in window.currentUserGroupListDetails)
			{
				if(	window.currentUserGroupListDetails[i]["userEmail"] == arg["email"])
				{
					var detailsObj = window.currentUserGroupListDetails[i];
				}
			}
		}
		if(detailsObj && detailsObj["userEmail"] == arg["email"])
		{
			if (detailsObj["coachName"])
			{
				var dateParam = moment(detailsObj["exactTime"],"DD MMM, YYYY hh:mm:ss a");
				var etHours = dateParam.format("hh"), etMins = dateParam.format("mm"), etNoon = dateParam.format("A");
				var typeSlot = detailsObj["typeSlot"];
				$('.fetchedCoachResult .resultItem').find('.coachName').text(detailsObj["coachName"]);
				$('.fetchedCoachResult .resultItem').find('.userCount').text('');
				onBoardForm.find('.onboardingFormInput.date').val(dateParam.format("YYYY-MM-DD"));
				onBoardForm.find('.onboardingFormInput.coachCode').val(detailsObj["coachCode"]);
				onBoardForm.find('.onboardingFormInput.sessionGroupCode').val(detailsObj["sessionGroupCode"]);
				$('.userOnboardingModal h3 .titleUserName').text(detailsObj["userName"]);
				onBoardForm.find('.onboardingFormInput.days option').each(function(){
					if($(this).attr("data-slot") == typeSlot)
					{
						$(this).prop("selected","selected");
					}
					else
					{
						$(this).prop("selected",false);
					}
				});
				onBoardForm.find('.onboardingFormInput.hours option').each(function(){
					if(parseInt(etHours) === parseInt($(this).text()))
					{
						$(this).prop("selected","selected");
					}
					else
					{
						$(this).prop("selected",false);
					}
				});
				onBoardForm.find('.onboardingFormInput.ampm option').each(function(){
					if(etNoon == $(this).text())
					{
						$(this).prop("selected","selected");
					}
					else
					{
						$(this).prop("selected",false);
					}
				});
				onBoardForm.find('.onboardingFormInput.minutes option').each(function(){
					if(parseInt(etMins) < parseInt($(this).text()))
					{
						$(this).prop("selected",false);
					}
					else
					{
						if(parseInt(etMins) < parseInt($(this).text())+15)
						{
							$(this).prop("selected","selected");
						}
						else
						{
							$(this).prop("selected",false);
						}
					}
				});
				onBoardForm.find('.onboardingFormInput.platform option').each(function(){
					if($(this).text() == detailsObj["userOnOs"])
					{
						$(this).prop("selected","selected");
					}
					else
					{
						$(this).prop("selected",false);
					}
				});
				if(detailsObj["isTrial"])
				{
					onBoardForm.find('.onboardingFormInput.platform type').prop("checked","checked");
				}
				popShow($('.userOnboardingModal'));
				setTimeout(function(){
					$('.mapWrap').locationpicker('location', {
						latitude: detailsObj["latitude"],
						longitude: detailsObj["longitude"]
					});
				},200);
			}
			else
			{
				popShow($('.userOnboardingModal'));
				$('.userOnboardingModal').find('.userOnboardingModalInner').each(function(){
					$(this).find('.onboardingFormInput.date').val('');
					$('.userOnboardingModal h3 .titleUserName').text(detailsObj["userName"]);
					$(this).find('.onboardingFormInput.type').prop('checked', false);
				});
			}
			//<span class="coachName">Nisar Khan</span><span class="userCount">21 users</span> 
		}
	}
	else if(arg && arg["mode"] && arg["mode"] == "new")
	{
		if(window.currentUserGroupDetails)
		{
			var detailsObj = window.currentUserGroupDetails;
		}
		else if(window.currentUserGroupListDetails)
		{
			for(var i in window.currentUserGroupListDetails)
			{
				if(	window.currentUserGroupListDetails[i]["userEmail"] == arg["email"])
				{
					var detailsObj = window.currentUserGroupListDetails[i];
				}
			}
		}
		popShow($('.userOnboardingModal'));
		$('.userOnboardingModal').find('.userOnboardingModalInner').each(function(){
			$(this).find('.onboardingFormInput.date').val('');
			$('.userOnboardingModal h3 .titleUserName').text(detailsObj["userName"]);
			$(this).find('.onboardingFormInput.type').prop('checked', false);
		});
	}
	else
	{
		popShow($('.userOnboardingModal'));
		$('.userOnboardingModal').find('.userOnboardingModalInner').each(function(){
			$(this).find('.onboardingFormInput.date').val('');
			$(this).find('.onboardingFormInput.type').prop('checked', false);
		});
		$('.userOnboardingModal h3 .titleUserName').text(window.addedUserName);
	}
}

//Function to load the user adding modal
function loadAddUser(arg)
{
	if(arg && arg["email"])
	{
		var parentModal = $('.sessGroupsMain .userAddModal');
		var modalForm = parentModal.find('.newUserForm');
		modalForm.removeClass("update");
		modalForm.each(function(){
			this.reset();
		});
		if(arg["mode"] && arg["mode"] == "update")
		{
			modalForm.addClass("update");
			modalForm.find('.newUserEmail').prop("disabled","disabled");
		}
		if(window.currentUserGroupDetails && window.currentUserGroupDetails["userEmail"] == arg["email"])
		{
			modalForm.find('.newUserName').val(window.currentUserGroupDetails["userName"]);
			modalForm.find('.newUserMobile').val(window.currentUserGroupDetails["userMobile"]);
			modalForm.find('.newUserEmail').val(window.currentUserGroupDetails["userEmail"]);
			modalForm.find('.newUserCta').removeClass('newUserCta').addClass('updateUserCta').html('Update User <i class="fa fa-angle-right"></i>');
		}
		else if(window.currentUserGroupListDetails)
		{
			for (var i in window.currentUserGroupListDetails)
			{
				if(window.currentUserGroupListDetails[i]["userEmail"] == arg["email"])
				{
					modalForm.find('.newUserName').val(window.currentUserGroupListDetails[i]["userName"]);
					modalForm.find('.newUserMobile').val(window.currentUserGroupListDetails[i]["userMobile"]);
					modalForm.find('.newUserEmail').val(window.currentUserGroupListDetails[i]["userEmail"]);
					modalForm.find('.newUserCta').removeClass('newUserCta').addClass('updateUserCta').html('Update User <i class="fa fa-angle-right"></i>');
				}
			}
		}
		parentModal.fadeIn(150).css("display","flex");
	}
	else
	{
		$('.sessGroupsMain .userAddModal').fadeIn(150).css("display","flex").find('.newUserForm').each(function(){
			this.reset();
		});
		$('.sessGroupsMain .userAddModal').find('.newUserForm').removeClass("update");
		$('.sessGroupsMain .userAddModal .updateUserCta').removeClass('updateUserCta').addClass('newUserCta').html('Create User <i class="fa fa-angle-right"></i>');
		$('.sessGroupsMain .userAddModal').find('.newUserForm .newUserEmail').removeProp("disabled");
	};
}

//Function to create new user
function newUser(arg)
{
	if(arg && arg["elem"])
	{
		var form = arg["elem"];
		if(checkUserFields(arg) && arg["mode"] == "new")
		{
			if($(form).find('.newUserGenderMale').is(":checked"))
			{
				var gender = "ml";
			}
			else
			{
				var gender = "fl";
			}
			var datObj = {"name":$(form).find(".newUserName").val(),"email":$(form).find(".newUserEmail").val(),"mobile":$(form).find(".newUserMobile").val(),"gender":gender};
			if($(form).find(".newUserDob").val())
			{
				datObj["dateOfBirth"] = $(form).find(".newUserDob").val().split("-").reverse().join("-") + ' 00:00:00';
			}
			if($(form).find(".newUserAddress").val())
			{
				datObj["address"] = $(form).find(".newUserAddress").val();
			}
			var addState = addNewUser(datObj);
			if(addState && addState["responseCode"] == 1000)
			{
				popHide($(form).parents(".userAddModal"));
				popShow($(form).parents(".sessGroupsMain").find(".decisionModal"));
				window.addedUserEmail = $(form).find(".newUserEmail").val();
				window.addedUserName = $(form).find(".newUserName").val();
			}
		}
		if(checkUserFields(arg) && arg["mode"] == "update")
		{
			//code to form the update user query url
			if($(form).find('.newUserGenderMale').is(":checked"))
			{
				var gender = "ml";
			}
			else
			{
				var gender = "fl";
			}
			var datObj = {"name":$(form).find(".newUserName").val(),"email":$(form).find(".newUserEmail").val(),"mobile":$(form).find(".newUserMobile").val(),"gender":gender,"typeOfUser":"USR", "source":"ADM"};
			if($(form).find(".newUserHeight").val())
			{
				datObj.height = $(form).find(".newUserHeight").val();
			}
			if($(form).find(".newUserWeight").val())
			{
				datObj.weight = $(form).find(".newUserWeight").val();
			}
			if($(form).find(".newUserAddress").val())
			{
				datObj["address"] = $(form).find(".newUserAddress").val();
			}
			var addState = addNewUser(datObj);
			if(addState && addState["responseCode"] == 1000)
			{
				popHide($(form).parents(".userAddModal"));
			}
		}
	}
}
//Function to validate a date-string in YYYY-MM-DD format
function dateValid(obj)
{
	var dArray = obj.split("-").reverse();
	if(obj == '' || dArray.join("").length !== 8 || dArray.length !== 3)
	{
		return false;
	}
	else if ( dArray[0].length !== 4 || parseInt(dArray[0]) < 1900 || parseInt(dArray[0]) > 2100)
	{
		return false;
	}
	else if ( dArray[1].length !== 2 || parseInt(dArray[1]) < 1 || parseInt(dArray[1]) > 12)
	{
		return false;
	}
	else if ( dArray[2].length !== 2 || parseInt(dArray[2]) < 1 || parseInt(dArray[2]) > 31 || !isValidDateForMonth(parseInt(dArray[2]),parseInt(dArray[1]),parseInt(dArray[0])))
	{
		return false;
	}
	else 
	{
		return true;
	}
}
//Function to validate new user fields
function checkUserFields(arg)
{
	if(arg && arg["elem"] && arg["mode"] == "new")
	{
		var form = arg["elem"];
		var mob = $(form).find(".newUserMobile").val();
		if(!$(form).find(".newUserName").val())
		{
			$(form).find(".newUserName").addClass("error").focus();
			return false;
		}
		else if(!mob || mob.length !== 10 || isNaN(mob))
		{
			$(form).find(".newUserName").removeClass("error");
			$(form).find(".newUserMobile").addClass("error").focus();
			return false;
		}
		else if(!$(form).find(".newUserEmail").val() || !validateEmail($(form).find(".newUserEmail").val()))
		{
			$(form).find(".newUserMobile").removeClass("error");
			$(form).find(".newUserEmail").addClass("error").focus();
			return false;
		}
		else if($(form).find('.newUserDob').val() && !dateValid($(form).find('.newUserDob').val()))
		{
			$(form).find(".newUserEmail").removeClass("error");
			$(form).find(".newUserDob").addClass("error").focus();
			return false;
		}
		else
		{
			$(form).find(".newUserDob").removeClass("error");
			return true;
		}
	}
	if(arg && arg["elem"] && arg["mode"] == "update")
	{
		var form = arg["elem"];
		var mob = $(form).find(".newUserMobile").val();
		if(!$(form).find(".newUserName").val())
		{
			$(form).find(".newUserName").addClass("error").focus();
			return false;
		}
		else if(!mob || mob.length !== 10 || isNaN(mob))
		{
			$(form).find(".newUserName").removeClass("error");
			$(form).find(".newUserMobile").addClass("error").focus();
			return false;
		}
		else if(!$(form).find(".newUserEmail").val() || !validateEmail($(form).find(".newUserEmail").val()))
		{
			$(form).find(".newUserMobile").removeClass("error");
			$(form).find(".newUserEmail").addClass("error").focus();
			return false;
		}
		else if($(form).find('.newUserDob').val() && !dateValid($(form).find('.newUserDob').val()))
		{
			$(form).find(".newUserEmail").removeClass("error");
			$(form).find(".newUserDob").addClass("error").focus();
			return false;
		}
		else if($(form).find('.newUserHeight').val() && isNaN($(form).find('.newUserHeight').val()))
		{
			$(form).find(".newUserDob").removeClass("error");
			$(form).find(".newUserHeight").addClass("error").focus();
			return false;
		}
		else if($(form).find('.newUserWeight').val() && isNaN($(form).find('.newUserWeight').val()))
		{
			$(form).find(".newUserHeight").removeClass("error");
			$(form).find(".newUserWeight").addClass("error").focus();
			return false;
		}
		else
		{
			$(form).find(".newUserWeight").removeClass("error");
			return true;
		}
	}
}

//Reg exp function to validate email parameter
function validateEmail(mail)
{
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(mail);
}

//html placeholder to be inserted into the main UI
var sessGrpCard = '<div class="card sessGroups"> <div class="cardRow sessGroupsTop"> <div class="leftHuddle"> <h2 class="cardTitle">Session Groups</h2></div><div class="rightHuddle"> <form class="searchEmail"> <input type="text" class="inputEmail" placeholder="Search by email"> <button class="searchEmailSubmit">Search</button> <button class="addUserCta">+ Add new user</button> </form> </div></div><div class="cardRow sessGroupsPagination"> <div class="leftHuddle"> <p class="resultLabel">Results per page</p><input value="30" class="pageResultCount" type="text"> <button class="pageCountCta"><i class="fa fa-refresh"></i></button> </div><div class="rightHuddle"> <div class="numberNav"><a href="#" class="numberNavLink first"><i class="fa fa-angle-double-left"></i></a><a href="#" class="numberNavLink previous"><i class="fa fa-angle-left"></i></a></div><p class="status">Showing <span class="which">1</span> of <span class="totalCount">3</span></p><div class="numberNav"><a href="#" class="numberNavLink next"><i class="fa fa-angle-right"></i></a><a href="#" class="numberNavLink last"><i class="fa fa-angle-double-right"></i></a></div><input placeholder="Page" class="paginationInput" type="text"> <button class="pageNavCta">Go</button> </div></div><div class="cardRow sessGroupsMain"> <div class="userOnboardingModal modal xxlwide"> <div class="userOnboardingModalInner inner"><a class="close" href="#">X</a> <h3>Add session group for <span class="titleUserName">Shubhanshu Srivastava</span></h3> <div class="layout"> <div class="mapsCol"> <div class="addressWrap"> <input type="text" class="mapInput address" placeholder="Location"> </div><div class="mapWrap"></div><div class="radiusWrap">Radius(meters) : <input type="text" class="mapInput radius" placeholder="200"> </div><div class="co-ords"><span class="label">Latitude:</span> <input type="text" placeholder="23.23423423" class="onboardingFormInput latitude"><span class="label">Longitude:</span> <input type="text" placeholder="23.23423423" class="onboardingFormInput longitude"> </div></div><div class="dataCol"> <form class="newSessionGroupForm"> <div class="formRow toggleDays"><input type="radio" checked name="daysScheme" id="daysOld"><label for="daysOld">Old days scheme</label> <input type="radio" name="daysScheme" id="daysNew"><label for="daysNew">New days scheme</label></div> <div class="formRow newDaysRow"> <span class="label">Choose Days:</span> <div class="onboardingFormInput daysOfWeek"><span class="weekdays" data-day="mon">Mo</span> <span class="weekdays" data-day="tue">Tu</span> <span class="weekdays" data-day="wed">We</span> <span class="weekdays" data-day="thu">Th</span> <span class="weekdays" data-day="fri">Fr</span> <span class="weekdays" data-day="sat">Sa</span> <span class="weekdays" data-day="sun">Su</span></div> </div> <div class="formRow newTimeRow"><span class="label">Timeslots:</span> <div class="onboardingFormInput timeSlotsMap"><div class="timeSlotContainer mon"><span class="timeSlotLabel">Monday</span><input type="text" class="onboardingFormInput timeSlotDay" id="mon" value="06:30"></div><div class="timeSlotContainer tue"><span class="timeSlotLabel">Tuesday</span><input type="text" class="onboardingFormInput timeSlotDay" id="tue" value="06:30"></div><div class="timeSlotContainer wed"><span class="timeSlotLabel">Wednesday</span><input type="text" class="onboardingFormInput timeSlotDay" id="wed" value="06:30"></div><div class="timeSlotContainer thu"><span class="timeSlotLabel">Thursday</span><input type="text" class="onboardingFormInput timeSlotDay" id="thu" value="06:30"></div><div class="timeSlotContainer fri"><span class="timeSlotLabel">Friday</span><input type="text" class="onboardingFormInput timeSlotDay" id="fri" value="06:30"></div><div class="timeSlotContainer sat"><span class="timeSlotLabel">Saturday</span><input type="text" class="onboardingFormInput timeSlotDay" id="sat" value="06:30"></div><div class="timeSlotContainer sun"><span class="timeSlotLabel">Sunday</span><input type="text" class="onboardingFormInput timeSlotDay" id="sun" value="06:30"></div></div> </div> <div class="formRow oldDaysRow"><span class="label">Preferred Days:</span> <select class="onboardingFormInput days"> <option data-slot="xxx">Misc</option> <option selected="selected" data-slot="MON">Mon Wed Fri</option> <option data-slot="WKS">Weekdays + Sat</option> <option data-slot="WKK">Weekdays</option> <option data-slot="MWS">Mon Wed Sat</option> <option data-slot="TUE">Tue Thu Sat</option> <option data-slot="TTS">Tue Thu Sun</option> <option data-slot="TSS">Tue Thu Sat Sun</option> <option data-slot="TTH">Tue Thu</option> <option data-slot="WKN">Weekends</option> </select> </div><div class="formRow oldTimeRow"><span class="label">Timeslot:</span> <select class="onboardingFormInput hours"> <option>01</option> <option>02</option> <option>03</option> <option>04</option> <option>05</option> <option selected>06</option> <option>07</option> <option>08</option> <option>09</option> <option>10</option> <option>11</option> <option>12</option> </select> <select class="onboardingFormInput minutes"> <option>00</option> <option>15</option> <option selected>30</option> <option>45</option> </select> <select class="onboardingFormInput ampm"> <option>AM</option> <option>PM</option> </select> </div><div class="formRow"><span class="label">Date:</span> <input type="text" placeholder="YYYY-MM-DD" class="onboardingFormInput date"> </div><div class="formRow"><span class="label">Service Type:</span> <select class="onboardingFormInput typeService"> <option data-val="wtls">Weight Loss</option> <option data-val="wtgn">Weight Gain</option> <option data-val="msbl">Muscle Building</option> <option data-val="injr">Injury Management</option> <option data-val="yoga">Yoga</option> <option data-val="mrtn">Marathon Training</option> </select> </div><div class="formRow"><span class="label">Address:</span> <textarea class="onboardingFormInput userAddress"> </textarea> </div><div class="formRow"><span class="label">User OS:</span> <select class="onboardingFormInput platform"> <option data-val="AND">Android</option> <option data-val="NAND">Not Android</option> </select> </div><div class="formRow"><span class="label">Amount per session:</span> <input class="onboardingFormInput amountPerSession" value="500"></div><input type="hidden" class="onboardingFormInput sessionGroupCode"> <input type="hidden" class="onboardingFormInput coachCode"> <input type="hidden" class="onboardingFormInput latitude"> <input type="hidden" class="onboardingFormInput longitude"> <div class="formRow"><span class="label">Demo User?</span> <input type="checkbox" class="onboardingFormInput type" id="trialCheck"> <label for="trialCheck">Yes</label> </div> <div class="formRow trialDateRow"><span class="label">Demo date-time</span> <input type="text" class="onboardingFormInput demoWhen" placeholder="YYYY-MM-DD hh:mm:ss"> </div> <div class="formRow"><span class="label"><button class="fetchCoach">Find a Coach <i class="fa fa-search"></i></button></span> <div class="fetchedCoachResult"> <div class="resultItem"><span class="coachName">Nisar Khan</span><span class="userCount">21</span> users</div></div></div><div class="formRow"><span class="label">Or</span> <input type="text" class="onboardingFormInput cCode autoSuggest" placeholder="Enter coach code manually"> </div><button class="createCta">Create Sessions <i class="fa fa-angle-double-right"></i></button> </form> </div></div></div></div><div class="userNotFound modal"> <div class="userNotFoundInner inner"><a class="close" href="#">X</a> <p>User not found</p><h3>Do you want to create a new user?</h3> <form class="userNotFoundForm"> <button class="userNotFoundCancel">No Thanks <i class="fa fa-close"></i></button> <button class="userNotFoundCta">Create User <i class="fa fa-angle-right"></i></button> </form> </div></div><div class="userAddModal modal small"> <div class="userAddModalInner inner"><a class="close" href="#">X</a> <h3>Create a new user</h3> <form class="newUserForm"> <input type="text" placeholder="User Name" class="newUserName"> <input type="text" placeholder="Mobile" class="newUserMobile"> <input type="text" placeholder="Email address" class="newUserEmail"> <input type="text" placeholder="Date of birth" class="newUserDob"> <input type="radio" id="radioMale" name="genderChoice" class="newUserGenderMale"> <label for="radioMale">Male</label> <input type="radio" id="radioFemale" checked name="genderChoice" class="newUserGenderFemale"> <label for="radioFemale">Female</label> <br><textarea class="newUserAddress" placeholder="Address"></textarea> <h4 class="separator">Optional</h4> <input type="text" placeholder="Height (cm)" class="newUserHeight"> <input type="text" placeholder="Weight (Kg)" class="newUserWeight"> <button class="newUserCta">Create User <i class="fa fa-angle-right"></i></button> </form> </div></div><div class="decisionModal modal"> <div class="decisionModalInner inner"> <p>User succesfully created</p><h3>Add session group for user?</h3> <form class="decisionForm"> <button class="rejectCta">No thanks <i class="fa fa-close"></i></button> <button class="acceptCta">Yes, create now <i class="fa fa-chevron-right"></i></button> </form> </div></div></div></div>';

//function to load the searched user details into the main crm ui
function loadSessionGroupsUser(arg)
{
	window.currentUserGroupListDetails = null;
	window.lastCardState = $('.card').detach();
	$('.main').append(sessGrpCard);
	var sessGroupData = getPostDatabyEmail(arg);
	loadMap();
	$('.sessGroupsPagination').hide();
	$('.newUserDob').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.newUserDob').datetimepicker('hide');
		}
	});
	if(sessGroupData && sessGroupData["sessionGroupDetailedSRO"])
	{
		window.currentUserGroupDetails = sessGroupData["sessionGroupDetailedSRO"];
		if (sessGroupData["sessionGroupDetailedSRO"].coachEmail)
		{
			var tableCard = '<table class="sessGroupsUserList user" cellspacing="0"><thead><tr><th class="tabHead">Username</th><th 		class="tabHead">E-mail</th><th class="tabHead">Mobile</th><th class="tabHead">Preffered Time</th><th class="tabHead">Location</th><th class="tabHead">Time slot</th><th class="tabHead">Date</th><th class="tabHead">Trial User?</th><th class="tabHead">Coach Name</th><th class="tabHead">Actions</th></tr></thead><tbody></tbody></table><div class = "mapPop" onClick="hideMap();"></div><div class="mapPopWrap"><div class = "mapPopInner"></div></div>';
			$(".sessGroupsMain").append(tableCard);
			loadUserLoc($('.mapPopInner'));
			
			var tslot = typeSlotConvert(sessGroupData["sessionGroupDetailedSRO"].typeSlot);
			var trialVar = sessGroupData["sessionGroupDetailedSRO"].isTrial || '';
			var trow = '<tr><td class="newFields">'+sessGroupData["sessionGroupDetailedSRO"].userName+'</td><td class="newFields">'+sessGroupData["sessionGroupDetailedSRO"].userEmail+'</td><td class="newFields">'+sessGroupData["sessionGroupDetailedSRO"].userMobile+'</td><td class="newFields">'+tslot+'</td><td class="newFields"><a href = "#" style="text-align: center; left: 20px; position: relative;"onClick = "showUserLoc('+sessGroupData["sessionGroupDetailedSRO"].latitude+','+sessGroupData["sessionGroupDetailedSRO"].longitude+');"><i class="fa fa-map-marker fa-2x" style="color: rgb(212, 67, 67);" ></i></a></td><td class="newFields">'+sessGroupData["sessionGroupDetailedSRO"].timings+'</td><td class="newFields">'+sessGroupData["sessionGroupDetailedSRO"].startDate+'</td><td class="newFields">'+ trialVar +'</td><td class="newFields">'+sessGroupData["sessionGroupDetailedSRO"].coachName+'</td><td class="newFields" data-email="'+sessGroupData["sessionGroupDetailedSRO"].userEmail+'"><!--<button id="" class="actionBtn editSession">Edit Session</button>--><button class="actionBtn editUser" id ="">Edit User</button></td></tr>';
			
			$('.sessGroupsUserList tbody').append(trow);
		}
		else if (sessGroupData["sessionGroupDetailedSRO"].userName)
		{
			var tableCard = '<table class="sessGroupsUserList user" cellspacing="0"><thead><tr><th class="tabHead">Username</th><th 		class="tabHead">E-mail</th><th class="tabHead">Mobile</th><th class="tabHead">Actions</th></tr></thead><tbody></tbody></table>';
		
			$(".sessGroupsMain").append(tableCard);
			window.addedUserEmail = sessGroupData["sessionGroupDetailedSRO"].userEmail;
			var trow1 = '<tr><td class="newFields"><div class = "mapPop"><div class = "mapPopInner"><div class = "closePop"><h1>X<h1></div></div></div>'+sessGroupData["sessionGroupDetailedSRO"].userName+'</td><td class="newFields">'+sessGroupData["sessionGroupDetailedSRO"].userEmail+'</td><td class="newFields">'+sessGroupData["sessionGroupDetailedSRO"].userMobile+'</td><td class ="newFields"  data-email ="'+sessGroupData["sessionGroupDetailedSRO"].userEmail+'"><button class="actionBtn addSession" id =""><i class="fa fa-plus-circle"></i>&nbsp;Add Session</button> <button class="actionBtn editUser" id ="">Edit User</button></td></tr>';
			$('.sessGroupsUserList tbody').append(trow1);
		}
		
	}
	$('.onboardingFormInput.date').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.onboardingFormInput.date').datetimepicker('hide');
		}
	});
	//function to attach the datepicker to the date input
	/*$(".onboardingFormInput.date").datepicker({ dateFormat: 'yy-mm-dd' });
    $(".onboardingFormInput.date").datepicker({ dateFormat: 'yy-mm-dd' }).bind("change",function(){
        var minValue = $(this).val();
        minValue = $.datepicker.parseDate("yy-mm-dd", minValue);
		if ($(".onboardingFormInput.date").val())
		{
			//code
		}
		else
		{
			minValue.setDate(minValue.getDate()+1);
		}
	});*/
}
//function to load the session groups module into the main CRM UI
function loadSessionGroupsList(arg)
{
	$('.sessionsTop').detach();
	window.currentUserGroupDetails = null;
	window.lastCardState = $('.card').detach();
	$('.main').append(sessGrpCard);
	var sessGroupData = getAllPostData(arg);
	window.dataL = '{}';
	loadMap();
	$('.newUserDob').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.newUserDob').datetimepicker('hide');
		}
	});
	paginateGroups({"start":arg["start"],"count":arg["count"],"data":sessGroupData});
	var tableCard = '<table class="sessGroupsUserList all" cellspacing="0"><thead><tr><th class="tabHead">Username</th><th class="tabHead">E-mail</th><th class="tabHead">Mobile</th><th class="tabHead">Preffered Time</th><th class="tabHead">Location</th><!--<th class="tabHead">Time slot</th><th class="tabHead">Date</th>--><th class="tabHead">Coach Name</th><th class="tabHead">Trial?</th><th>Actions</th></tr></thead><tbody></tbody></table><div class = "mapPop" onclick="hideMap();"></div><div class="mapPopWrap"><div class = "mapPopInner"></div></div>';
	
	window.currentUserGroupListDetails = {};
	$(".sessGroupsMain").append(tableCard);
	loadUserLoc($('.mapPopInner'));
	if(sessGroupData && sessGroupData["sessionGroupUserSROs"])
	{
		var count=0;
		for(var i in sessGroupData["sessionGroupUserSROs"])
		{
			//var tslot = typeSlotConvert(sessGroupData["sessionGroupUserSROs"][count].typeSlot);
			var tslot = typeSlotRender({"ts":sessGroupData["sessionGroupUserSROs"][count].typeSlot,"time":sessGroupData["sessionGroupUserSROs"][i].timings.replace(" Onwards","")});
			
			window.currentUserGroupListDetails[count] = sessGroupData["sessionGroupUserSROs"][i];
			var trialVar = sessGroupData["sessionGroupUserSROs"][i].isTrial || '';
			var trow = '<tr><td class="newFields">'+sessGroupData["sessionGroupUserSROs"][i].userName+'</td>';
			trow += '<td class="newFields">'+sessGroupData["sessionGroupUserSROs"][i].userEmail+'</td>';
			trow += '<td class="newFields">'+sessGroupData["sessionGroupUserSROs"][i].userMobile+'</td>';
			trow += '<td class="newFields">'+tslot+'</td>';
			trow += '<td class="newFields"><a href = "#" style="text-align: center; left: 20px; position: relative;" onclick="showUserLoc('+sessGroupData["sessionGroupUserSROs"][i].latitude+','+sessGroupData["sessionGroupUserSROs"][i].longitude+');"><i class="fa fa-map-marker fa-2x" style="color: rgb(212, 67, 67);" ></i></a></td>';
			/*trow += '<td class="newFields">'+sessGroupData["sessionGroupUserSROs"][i].timings+'</td>';
			trow += '<td class="newFields">'+sessGroupData["sessionGroupUserSROs"][i].exactTime+'</td>';*/
			trow += '<td class="newFields">'+sessGroupData["sessionGroupUserSROs"][i].coachName+'</td>';
			trow += '<td class="newFields">'+ trialVar +'</td>';
			trow += '<td class="newFields" data-email="'+sessGroupData["sessionGroupUserSROs"][i].userEmail+'"><button class="actionBtn editUser" id ="">Edit User</button><!--<button id="" class="actionBtn editSession">Edit Session</button>--></td></tr>';
			
			$('.sessGroupsUserList tbody').append(trow);
			count++;
		}
	}
	$('.onboardingFormInput.date').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.onboardingFormInput.date').datetimepicker('hide');
		}
	});
	//function to attach the datepicker to the date input
	/*$(".onboardingFormInput.date").datepicker({ dateFormat: 'yy-mm-dd' });
    $(".onboardingFormInput.date").datepicker({ dateFormat: 'yy-mm-dd' }).bind("change",function(){
        var minValue = $(this).val();
        minValue = $.datepicker.parseDate("yy-mm-dd", minValue);
		if ($(".onboardingFormInput.date").val())
		{
			//code
		}
		else
		{
			minValue.setDate(minValue.getDate()+1);
		}   
	});*/
}

//function to close the popups
function popHide(elem)
{
   $(elem).fadeOut(150);
}

//function to open the popups
function popShow(elem)
{
   $(elem).fadeIn(150).css("display","flex");
   if($(elem).hasClass('userOnboardingModal'))
   {
   		window.clickedCoachResult = null;
		setTimeout(function()
		{
			$('.mapWrap').locationpicker('autosize');
		},200);
   }
}

//Function to create the parameters for posting the new session data
function createSessionGroup(form)
{
	if($(form).find('#daysOld').is(":checked"))
	{
		var createData = populateParamsOld(form);
	}
	else if($(form).find('#daysNew').is(":checked"))
	{
		var createData = populateParamsNew(form);
	}
	if(createData){
		var response = loadUsingPost({"url":urlCreateSessionGroup,"data":createData});
		if(response && response["responseCode"]==1000)
		{
			showModalMessage({"message":"Session group succesfully created","duration":5000});
			popHide($(form).parents('.modal'));
		}
	}
}

function populateParamsOld(form)
{
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
	
	var checkTrial = $(form).find('#trialCheck').is(":checked");
	
	var os = $(form).find('.platform option:selected').attr("data-val");
	
	var mapLat =  $('.onboardingFormInput.latitude').val();
	var mapLong =  $('.onboardingFormInput.longitude').val();
	
	var params = {"timeSlot":timeSlot,"slotType":slot,"latitude":mapLat,"longitude":mapLong};
	
	var ccode = getCoachCode();
	if(!ccode)
	{
		return false;
	}
	
	function getCoachCode()
	{
		var newCoachData = window.clickedCoachResult;
		if(newCoachData && newCoachData['code'] && $('.onboardingFormInput.cCode').val() == newCoachData['userName'])
		{
			$('.onboardingFormInput.cCode').removeClass("error");
			return newCoachData['code'];
		}
		else if(window.currentCoach && window.currentCoach["hashCode"])
		{
			$('.onboardingFormInput.cCode').removeClass("error");
			return window.currentCoach["hashCode"];
		}
		else if($('.onboardingFormInput.coachCode').val())
		{
			$('.onboardingFormInput.cCode').removeClass("error");
			return $('.onboardingFormInput.coachCode').val();
		}
		else
		{
			$('.onboardingFormInput.cCode').addClass("error").focus();
			return false;
		}
	}
	var servType = $('.onboardingFormInput.typeService option:selected').attr("data-val");

	var slot = $('.onboardingFormInput.days option:selected').attr("data-slot");
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

	if($(form).find('.amountPerSession').val())
	{
		var amt = $(form).find('.amountPerSession').val();
	}
	else
	{
		var amt = 500;
	}
	
	if(checkTrial && $(form).find('.demoWhen').val())
	{
		$(form).find('.demoWhen').removeClass("error");
		var demoSchedule = $(form).find('.demoWhen').val();
	}
	else if(checkTrial)
	{
		$(form).find('.demoWhen').addClass("error").focus();
		return false;
	}

	var createData = {"timeSlot":timeSlot,"slotType":slot,"latitude":mapLat,"longitude":mapLong, "userEmail":window.addedUserEmail,"userOs":os,"isTrial":checkTrial,"coachCode":ccode,"amountPerSession":amt,"startDate":dateStart,"address":userAddress,"typeService":servType};

	if(checkTrial)
	{
		createData["demoSchedule"] = demoSchedule;
	}

	return createData;
}

function populateParamsNew(form)
{
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
	
	var checkTrial = $(form).find('#trialCheck').is(":checked");
	
	var os = $(form).find('.platform option:selected').attr("data-val");
	
	var mapLat =  $('.onboardingFormInput.latitude').val();
	var mapLong =  $('.onboardingFormInput.longitude').val();
	
	var params = {"latitude":mapLat,"longitude":mapLong};
	
	var ccode = getCoachCode();
	if(!ccode)
	{
		return false;
	}
	
	function getCoachCode()
	{
		var newCoachData = window.clickedCoachResult;
		if(newCoachData && newCoachData['code'] && $('.onboardingFormInput.cCode').val() == newCoachData['userName'])
		{
			$('.onboardingFormInput.cCode').removeClass("error");
			return newCoachData['code'];
		}
		else if(window.currentCoach && window.currentCoach["hashCode"])
		{
			$('.onboardingFormInput.cCode').removeClass("error");
			return window.currentCoach["hashCode"];
		}
		else if($('.onboardingFormInput.coachCode').val())
		{
			$('.onboardingFormInput.cCode').removeClass("error");
			return $('.onboardingFormInput.coachCode').val();
		}
		else
		{
			$('.onboardingFormInput.cCode').addClass("error").focus();
			return false;
		}
	}
	var wrktDays = '';
	for (var x in curSelDays)
	{
		//first get the day code
		var dCode = curSelDays[x];

		//then check the value inside the time input with the same day code
		var tSel = ".sessGroupsMain .userOnboardingModal .newSessionGroupForm .newTimeRow #" + dCode;
		var tVal = $(tSel).val();

		//stitch them together like this mon-06:35::tue-07:40::wed-18:35 in wrktDays
		wrktDays += dCode + "-" + tVal;

		if(x < curSelDays.length - 1)
		{
			wrktDays += "::";
		}
	}
	var servType = $('.onboardingFormInput.typeService option:selected').attr("data-val");

	if($(form).find('.amountPerSession').val())
	{
		var amt = $(form).find('.amountPerSession').val();
	}
	else
	{
		var amt = 500;
	}

	if(checkTrial && $(form).find('.demoWhen').val())
	{
		$(form).find('.demoWhen').removeClass("error");
		var demoSchedule = $(form).find('.demoWhen').val();
	}
	else if(checkTrial)
	{
		$(form).find('.demoWhen').addClass("error").focus();
		return false;
	}

	var createData = {"wrktDays":wrktDays,"latitude":mapLat,"longitude":mapLong, "userEmail":window.addedUserEmail,"userOs":os,"isTrial":checkTrial,"coachCode":ccode,"amountPerSession":amt,"startDate":dateStart,"address":userAddress,"typeService":servType};
	
	if(checkTrial)
	{
		createData["demoSchedule"] = demoSchedule;
	}

	return createData;
}

//function to search for the user
function searchClicked(email,element)
{
   testRes = validateSearchField(email);
   if (testRes)
   {
		$(element).removeClass("error");
		var arg = {"userEmail":email};
        var returnVal =  getReqData(arg);
        if (returnVal != "error")
        {
            getPostDatabyEmail(arg);
        }
   }
   else
   {
        $(element).addClass("error");
		return false;
   }
}
//function to assemble the url for adding a new user
function addNewUser(datObj)
{
	if(datObj && datObj["email"] && datObj["name"] && datObj["mobile"])
	{
		if($('.newUserForm .updateUserCta').length)
		{
			var x = loadUsingPost({"url":urlUpdateUser,"data":datObj});
		}
		else
		{
			//var x = loadUsingPost({"url":urlCreateNewUser,"data":datObj});
			var x = loadUsingPost({"url":urlCreateNewUser,"data":datObj});
		}
		return x;
	}
}
//function to assemble the url for the sessiongroup by user email
function getPostDatabyEmail(arg)
{
	if(arg && arg["userEmail"])
	{
		var url = urlSessionGroupByUser;
		var x = loadUsingPost({"url":url,"data":arg});
	}
	return x;
}

//Function to get the data for fetching suggested coach
function getRecommendedCoach(form)
{
	if($('.onboardingFormInput.date').val() == '')
	{
		$('.onboardingFormInput.date').focus();
		return false;
	}
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
	var slot = $('.onboardingFormInput.days option:selected').attr("data-slot");
	var mapLat =  $('.onboardingFormInput.latitude').val();
	var mapLong =  $('.onboardingFormInput.longitude').val();
	var servType = $('.onboardingFormInput.typeService option:selected').attr("data-val");
	var params = {"timeSlot":timeSlot,"slotType":slot,"latitude":mapLat,"longitude":mapLong,"typeService":servType};
	var recommendation = getCoach(params);
	//editSession
	if(recommendation && recommendation["listTrainerDetails"][0]["name"] && recommendation["listTrainerDetails"][0]["numberOfUsers"])
	{
		$(form).find('.onboardingFormInput.coachCode').val(recommendation["listTrainerDetails"][0]["hashCode"]);
		$('.fetchedCoachResult .resultItem').html('<span class="coachName">'+ recommendation["listTrainerDetails"][0]["name"] +'</span><span class="userCount">'+ recommendation["listTrainerDetails"][0]["numberOfUsers"] +'</span>').show(100);
		window.currentCoach = recommendation["listTrainerDetails"][0];
		$('.fetchedCoachResult .resultItem, .newSessionGroupForm .createCta').show(100);
	}
	else
	{
		$('.fetchedCoachResult .resultItem').html('<span class="prim">No coach found</span>').show(100);
		window.currentCoach = null;
		$(form).find('.onboardingFormInput.coachCode').val('');
	}
}

//function to assemble the url for the coach suggestion
function getCoach(params)
{
	var url = urlFetchNewCoach;
	if(params)
	{
		var x = loadUsingPost({"url":url,"data":params});
		return x;
	}
}

//function to assemble the url for the sessiongroup data fetching
function getAllPostData(arg)
{
	if(arg && arg["start"] && arg["count"])
	{
		var url = urlSessionGroupList + "?count=" + arg["count"] + "&start=" + arg["start"];
	}
	else
	{
		var url = urlSessionGroupList + "?count=30&start=0";
	}
	var x = loadUsingPost({"url":url});
	return x;
}

//ajax loader function - segregated from all other features and affixed with a return data feature
function loadUsingPost(arg)
{
	var pData = pDataGet();
	function pDataGet() {
		if(arg && arg["data"])
		{
			return arg["data"];
		}
		else
		{
			return null;
		}
	};
	var result = null;
    attachLoader();
	$.ajax({
        url: arg["url"],
        type: 'GET',
        dataType: 'json',
		data:pData,
        async: false,
        success: function(response) {
			if (response && response.responseCode == "1000") {
				result = response;
				detachLoader();
			}
			else
			{
				var errorMessage = "Code " + response.responseCode + ": " + response.response;
				showModalMessage({"message":errorMessage,"duration":5000});
				detachLoader();
			}
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown,"duration":"5000"});
			detachLoader();
		}
    });
	return result;
}


function hideMap()
{
	$('.mapPop').fadeOut(200);
	$('.mapPopWrap, .mapPopInner').fadeOut(150);
}
function showUserLoc(lat, longg)
{
	$('.mapPop').fadeIn(200);
	$('.mapPopWrap, .mapPopInner').fadeIn(150);
	$('.mapPopInner').locationpicker('location', {
		latitude: lat,
		longitude: longg
	});
	$('.mapPopInner').locationpicker('autosize');
}
function loadUserLoc(elem)
{
	$(elem).locationpicker({
        location: {latitude: 12.97262, longitude: 77.64009},
        radius: 50,
        enableAutocomplete: true
    });
}

//function to load the google maps plugin
function loadMap()
{
	$('.mapWrap').locationpicker({
        location: {latitude: 12.97262, longitude: 77.64009},
        radius: 50,
        inputBinding: {
            latitudeInput: $('.onboardingFormInput.latitude'),
            longitudeInput: $('.onboardingFormInput.longitude'),
            radiusInput: $('.mapInput.radius'),
            locationNameInput: $('.mapInput.address')
        },
        enableAutocomplete: true,
        onchanged: function (currentLocation, radius, isMarkerDropped) {
            // Uncomment line below to show alert on each Location Changed event
            //alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
        }
    });
}
oldSlots = {
	"WKS" : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	"MON" : ["Mon", "Wed", "Fri"],
	"WKK" : ["Mon", "Tue", "Wed","Thu", "Fri"],
	"MWS" : ["Mon", "Wed", "Sat"],
	"TUE" : ["Tue", "Thu", "Sat"],
	"TTS" : ["Tue", "Thu", "Sun"],
	"TSS" : ["Tue", "Thu", "Sat", "Sun"],
	"WKN" : ["Sat, Sun"]
}
//Type slot bridging function
function typeSlotRender(arg)
{
	if(arg["ts"])
	{
		var ts = arg["ts"];
		var sl = ts.length;
		if(sl > 5)
		{
			var slotDays = ts.split("|");
			dayObj = {};
			for (var jey in slotDays)
			{
				var cTemp = slotDays[jey].split("-");
				var newkey = cTemp[0];
				var newVal = cTemp[1];
				dayObj[newkey] = newVal;
			}
			var retStr = '<div class="slotsContainer">';
			for (var ley in dayObj)
			{
				retStr += '<div class="slotWrapper">';
				retStr += '<span class="slotDayWrapper">'+ley+'</span>';
				retStr += '<span class="slotTimeWrapper">'+dayObj[ley]+'</span>'
				retStr += '</div>';
			}
			retStr += '</div>';
			return retStr;
		}
		else
		{
			var retStr = '<div class="slotsContainer">';
			for (var key in oldSlots[ts])
			{
				retStr += '<div class="slotWrapper">';
				retStr += '<span class="slotDayWrapper">'+oldSlots[ts][key]+'</span>';
				retStr += '<span class="slotTimeWrapper old">'+arg["time"]+'</span>'
				retStr += '</div>';
			}
			retStr += '</div>';
			return retStr;
		}	
	}
	else
	{
		return '';
	}
}

//Type slot glossary function
function typeSlotConvert(ts)
{
	dataSlot = "";
	if (ts == "WKS")
	{
	    dataSlot = "Mon, Tue, Wed, Thu, Fri, Sat";    
	}
	else if (ts == "MON")
	{
	   dataSlot = "Mon, Wed, Fri";     
	}
	else if (ts == "WKK")
	{
	    dataSlot = "Mon, Tue, Wed,Thu, Fri"; 
	}
	else if (ts == "MWS")
	{
	    dataSlot = "Mon, Wed, Sat"; 
	}
	else if (ts == "TUE")
	{
	    dataSlot = "Tue, Thu, Sat"; 
	}
	else if (ts == "TTS")
	{
	    dataSlot = "Tue, Thu, Sun"; 
	}
	else if (ts == "TSS")
	{
	    dataSlot = "Tue, Thu, Sat, Sun"; 
	}
	else if (ts == "WKN")
	{
	    dataSlot = "Sat, Sun"; 
	}
	return dataSlot;
}
    
function decodeTslot(ts)
{
	dataSlot = "";
	if (ts == "Mon, Tue, Wed, Thu, Fri, Sat")
	{
	    dataSlot = "WKS";    
	}
	else if (ts == "Mon, Wed, Fri")
	{
	   dataSlot = "MON";     
	}
	else if (ts == "Mon, Tue, Wed,Thu, Fri")
	{
	    dataSlot = "WKK"; 
	}
	else if (ts == "Mon, Wed, Sat")
	{
	    dataSlot = "MWS"; 
	}
	else if (ts == "Tue, Thu, Sat")
	{
	    dataSlot = "TUE"; 
	}
	else if (ts == "Tue, Thu, Sun")
	{
	    dataSlot = "TTS"; 
	}
	else if (ts == "Tue, Thu, Sat, Sun")
	{
	    dataSlot = "TSS"; 
	}
	else if (ts == "Sat, Sun")
	{
	    dataSlot = "WKN"; 
	}
	return dataSlot;
}

// UTC time to local time
function utcToLocal(utc)
{
	// Create a local date from the UTC string
	var t = new Date(Number(utc));
	// Get the offset in ms
	var offset = t.getTimezoneOffset()*60000;
	// Subtract from the UTC time to get local
	t.setTime(t.getTime() - offset);    
	// do whatever
	var d = [t.getFullYear(), t.getMonth(), t.getDate()].join('/');
	d += ' ' + t.toLocaleTimeString();
	return d;
}