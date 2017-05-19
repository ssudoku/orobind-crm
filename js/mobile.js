// code for responsive mode

var w = $(window).width();
var originalWidth = w;
var d = new Date();

var xMonth = d.getMonth()+1;
var xDay = d.getDate();

var xToday = d.getFullYear() + '-' + (xMonth<10 ? '0' : '') + xMonth + '-' + (xDay<10 ? '0' : '') + xDay;

$(window).load(function(){
	switch (window.userRole) {
		case 'ops':
			if(w < 840)
			{
				loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"small"});
			}
			else
			{
				loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"large"});
			}
		break;
		case 'others':
			loadLanding();
		break;
	};
});

$(document).on("click", ".typeToggle", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.typeDropDown').toggle(100);
});
$(document).on("click", ".typeLink", function(e){
	e.preventDefault(); e.stopPropagation();
	var targ = $(this).attr("data-target");
	$(".typeToggle").click();
	var selStr = '.SelectResult option';
	$(selStr).each(function () {
		if($(this).attr("data-target") == targ)
		{
			$(this).attr("selected","selected");
		}
		else
		{
			$(this).removeAttr("selected");
		}
	});
});
$(document).on("click", ".topArea .searchToggle", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.searchExtend').slideToggle(100);
});

function switchTarg(targ)
{
	switch (targ) {
		case "total":
			$('.sessionsList, .sessionsList tr').show();
		break;
		case "completed":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasStarted').parent('tr').show();
		break;
		case "cancels":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasCanceled').parent('tr').show();
		break;
		case "demo":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasTrial').parent('tr').show();
		break;
		case "executed":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasTrial').parent('tr').each(function() {
				if($(this).find('td.hasDeviation').length)
				{
					$(this).show();
				}
			});
		break;
		case "deviation":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasDeviation').parent('tr').show();
		break;
		case "duration":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasDuration').parent('tr').show();
		break;
		case "uRating":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasUrating').parent('tr').show();
		break;
		case "cRating":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasCrating').parent('tr').show();
		break;
		case "hasData":
			$('.sessionsList tbody tr').hide();
			$('.sessionsList tbody td.hasWeight').siblings('td.hasWater').siblings('td.hasSleep').parent('tr').show();
		break;
	}
	slowScroll($('.card.sessions'),400);
}
// Function to slowly scroll the screen to the target elementFromPoint
function slowScroll(elem,duration)
{
	$('html,body').animate({
		scrollTop: elem.offset().top
    }, duration);
}
// Function to link the table to the summary
$(document).on("click", ".summTab .uiLink", function(e){
	w = $(window).width();
	e.preventDefault(); e.stopPropagation();
	var targ = $(this).attr("data-href");
	if(w > 840)
	{
		switchTarg(targ);
	}
	else
	{
		var x = null;
		x = loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"toLarge"});
		if(x){switchTarg(targ)}
	}
});

var timeoutId;
$(window).resize(function(e) {
	if(timeoutId)
	{
		clearTimeout(timeoutId);
	}
    timeoutId = setTimeout(onWidthChange, 75);
});
function onWidthChange()
{
	w = $(window).width();
	var tl = $('.sessionsList').length;
	if(w < 840 && tl)
	{
		$('.topArea .searchSubmit').removeClass('searchSubmit').addClass('searchToggle');
		if(originalWidth >= 840)
		{
			switch (window.loadedTable) {
				case 'default':
					loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"toSmall"});
				break;
				case 'dateSize':
					loadOpsDateSize({"startDate":window.tableStartDate,"endDate":window.tableEndDate,"maxSize":window.tableMaxSize,"mode":"toSmall"});
				break;
				case 'coachSize':
					loadbyCoachSize({"coachName":window.tableCoachName,"count":window.tableCount,"mode":"toSmall"});
				break;
				case 'coachDateSize':
					loadbyCoachDateSize({"startDate":window.tableStartDate,"endDate":window.tableEndDate,"coachName":window.tableCoachName,"start":window.tableStart,"count":window.tableCount,"mode":"toSmall"});
				break;
				case 'coach':
					loadbyCoach({"coachName":window.tableCoachName,"mode":"toSmall"});
				break;
				case 'user':
					loadbyUser({"userName":window.tableUserName,"mode":"toSmall"});
				break;
				case 'userSize':
					loadbyUserSize({"userName":window.tableUserName,"count":window.tableCount,"mode":"toSmall"});
				break;
				case 'userDateSize':
					loadbyUserDateSize({"startDate":window.tableStartDate,"endDate":window.tableEndDate,"userName":window.tableUserName,"start":window.tableStart,"count":window.tableCount,"mode":"toSmall"});
				break;
			};
			originalWidth = w;
		}
	}
	else if(tl)
	{
		$('.topArea .searchToggle').removeClass('searchToggle').addClass('searchSubmit');
		if(originalWidth < 840)
		{
			switch (window.loadedTable) {
				case 'default':
					loadOpsDefault({"startDate":xToday,"endDate":xToday,"mode":"toLarge"});
				break;
				case 'dateSize':
					loadOpsDateSize({"startDate":window.tableStartDate,"endDate":window.tableEndDate,"maxSize":window.tableMaxSize,"mode":"toLarge"});
				break;
				case 'coachSize':
					loadbyCoachSize({"coachName":window.tableCoachName,"count":window.tableCount,"mode":"toLarge"});
				break;
				case 'coachDateSize':
					loadbyCoachDateSize({"startDate":window.tableStartDate,"endDate":window.tableEndDate,"coachName":window.tableCoachName,"start":window.tableStart,"count":window.tableCount,"mode":"toLarge"});
				break;
				case 'coach':
					loadbyCoach({"coachName":window.tableCoachName,"mode":"toLarge"});
				break;
				case 'user':
					loadbyUser({"userName":window.tableUserName,"mode":"toLarge"});
				break;
				case 'userSize':
					loadbyUserSize({"coachName":window.tableUserName,"count":window.tableCount,"mode":"toLarge"});
				break;
				case 'userDateSize':
					loadbyUserDateSize({"startDate":window.tableStartDate,"endDate":window.tableEndDate,"userName":window.tableUserName,"start":window.tableStart,"count":window.tableCount,"mode":"toLarge"});
				break;
			};
			originalWidth = w;
		}
	}
}
$(document).ready(function() {
	if(w < 840)
	{
		$('.topArea .searchSubmit').removeClass('searchSubmit').addClass('searchToggle');
	}
});