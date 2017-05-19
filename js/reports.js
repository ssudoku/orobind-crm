urlReport = "../reporting/overall?";

$(document).ready(function(){
	// When reports button is clicked on the side navigation
	$('.reportsLink').click(function(){
		loadReport();
		$('.reportsDuration[data-type="daysLastSeven"]').addClass("current");
		$('.sideNavToggle').click();
	});
});
//datePickerSubmit
$(document).on("click",".reportsDatepicker .datePickerSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	var dateStart = $('.startDate').val();
	var dateEnd = $('.endDate').val();
	var startDate = dateStart.split("-").reverse().join("-");
	var endDate = dateEnd.split("-").reverse().join("-");
	loadReport({"startDate":startDate,"endDate":endDate});
});
$(document).on("click","a.reportsDuration", function(e){
	e.preventDefault(); e.stopPropagation();
	var type = $(this).attr("data-type");
	loadReport({"type":type});
});
//Function for loading the reports based on date input
function loadReport(arg)
{
	$('.sessionsTop').detach();
	$('.sessionsList, .card').detach();
	var reportCard = '<div class="card reports"><div class="cardRow reportsTop"><div class="leftHuddle"><h3 class="cardTitle">Orobind Metrics</h3></div><div class="rightHuddle"><a class="reportsDuration" data-type="daysLastSeven" href="#">Last 7 days</a><a class="reportsDuration" data-type="weekLast" href="#">Last week</a><a class="reportsDuration" data-type="weekThis" href="#">This week</a><a class="reportsDuration" data-type="monthThis" href="#">This month</a><a class="reportsDuration" data-type="monthLast" href="#">Last month</a><a class="reportsDuration" data-type="allTime" href="#">All time</a><div class="reportsWhen"><div class="reportsWhenSelect"><input type="text" class="whenText" value="Choose interval"><button class="whenToggle"><i class="fa fa-chevron-down fa-lg"></i> </button></div><form class="reportsDatepicker"><div class="datePickerInput">From <input type="text" class="startDate" placeholder="DD-MM-YYYY"> To <input type="text" class="endDate" placeholder="DD-MM-YYYY"><button class="datePickerSubmit">Refresh</button></div></form></div></div></div><div class="cardRow reportsMain"></div></div>';
	$('.main').append(reportCard);
	$('.datePickerInput input[type="text"]').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.datePickerInput input[type="text"]').datetimepicker('hide');
		}
	});
	if(arg && arg["type"])
	{
		switch (arg["type"])
		{
		case "weekThis":
			var now = moment();
			var first = moment().startOf('week');
			var previousEnd = moment(first).subtract(1, 'days');
			var previous = moment(first).subtract(1, 'weeks');
			var startDate = first.format('YYYY-MM-DD');
			var endDate = now.format('YYYY-MM-DD');
			var previousDate = previous.format('YYYY-MM-DD');
			var previousEndDate = previousEnd.format('YYYY-MM-DD');
			$('.reportsDuration').removeClass("current");
			$('.reportsDuration[data-type="weekThis"]').addClass("current");
		break;
		case "weekLast":
			var first = moment().startOf('week');
			var then = moment(first).subtract(1, 'days');
			var previous = moment(first).subtract(1, 'weeks');
			var earlierEnd = moment(first).subtract(8, 'days');
			var earlier = moment(first).subtract(2, 'weeks');
			var startDate = previous.format('YYYY-MM-DD');
			var endDate = then.format('YYYY-MM-DD');
			var previousDate = earlier.format('YYYY-MM-DD');
			var previousEndDate = earlierEnd.format('YYYY-MM-DD');
			$('.reportsDuration').removeClass("current");
			$('.reportsDuration[data-type="weekLast"]').addClass("current");
		break;
		case "monthThis":
			var now = moment();
			var first = moment().startOf('month');
			var previous = moment().subtract(1, 'months').startOf('month');
			var previousEnd = moment(first).subtract(1, 'days');
			var startDate = first.format('YYYY-MM-DD');
			var endDate = now.format('YYYY-MM-DD');
			var previousDate = previous.format('YYYY-MM-DD');
			var previousEndDate = previousEnd.format('YYYY-MM-DD');
			$('.reportsDuration').removeClass("current");
			$('.reportsDuration[data-type="monthThis"]').addClass("current");
		break;
		case "monthLast":
			var lastMonth = moment().subtract(1, 'months');
			var first = moment(lastMonth).startOf('month');
			var last = moment(lastMonth).endOf('month');
			var previous = moment(lastMonth).subtract(1, 'months').startOf('month');
			var previousEnd = moment(previous).endOf('month');
			var startDate = first.format('YYYY-MM-DD');
			var endDate = last.format('YYYY-MM-DD');
			var previousDate = previous.format('YYYY-MM-DD');
			var previousEndDate = previousEnd.format('YYYY-MM-DD');
			$('.reportsDuration').removeClass("current");
			$('.reportsDuration[data-type="monthLast"]').addClass("current");
		break;
		case "daysLastSeven":
			var now = moment();
			var then = moment().subtract(7, 'days');
			var previous = moment(then).subtract(1, 'days');
			var previousEnd = moment(previous).subtract(1,'days');
			var startDate = then.format('YYYY-MM-DD');
			var endDate = now.format('YYYY-MM-DD');
			var previousDate = previous.format('YYYY-MM-DD');
			var previousEndDate = previousEnd.format('YYYY-MM-DD');
			$('.reportsDuration').removeClass("current");
			$('.reportsDuration[data-type="daysLastSeven"]').addClass("current");
		break;
		case "allTime":
			var now = moment();
			var startDate = '2013-01-01';
			var endDate = now.format('YYYY-MM-DD');
			$('.reportsDuration').removeClass("current");
			$('.reportsDuration[data-type="allTime"]').addClass("current");
		break;
		}
	}
	else if(arg && arg["startDate"] && arg["endDate"])
	{
		var start = moment(arg["startDate"],"YYYY-MM-DD");
		var end = moment(arg["endDate"],"YYYY-MM-DD");
		var num = (parseInt(end.format("x")) - parseInt(start.format("x")))/86400000;
		var previousEnd = moment(arg["startDate"],"YYYY-MM-DD").subtract(1, 'days');
		var previous = moment(arg["startDate"],"YYYY-MM-DD").subtract(num+1, 'days');
		var startDate = arg["startDate"];
		var endDate = arg["endDate"];
		var previousDate = previous.format('YYYY-MM-DD');
		var previousEndDate = previousEnd.format('YYYY-MM-DD');
	}
	else
	{
		var now = moment();
		var then = moment().subtract(7,'days');
		var previous = moment().subtract(7,'days').subtract(8, 'days');
		var previousEnd = moment().subtract(8, 'days');
		var startDate = then.format('YYYY-MM-DD');
		var endDate = now.format('YYYY-MM-DD');
		var previousDate = previous.format('YYYY-MM-DD');
		var previousEndDate = previousEnd.format('YYYY-MM-DD');
	}
	var range = startDate.split("-").reverse().join("-") + ' to ' + endDate.split("-").reverse().join("-");
	$('.reports .cardTitle').text(range);
	reportData = getReport({"startDate":startDate,"endDate":endDate});
	if(previousDate && previousEndDate){
		lastReportData = getReport({"startDate":previousDate,"endDate":previousEndDate});
	}
	var blockstr = '';
	if(reportData["masterSummaryReportSRO"]["activeUsers"])
	{
		blockstr += getBlock("activeUsers");
	}
	if(reportData["masterSummaryReportSRO"]["acquiredUsers"])
	{
		blockstr += getBlock("acquiredUsers");
	}
	if(reportData["masterSummaryReportSRO"]["dormantUsers"])
	{
		blockstr += getBlockInvert("dormantUsers");
	}
	if(reportData["masterSummaryReportSRO"]["activeCoaches"])
	{
		blockstr += getBlock("activeCoaches");
	}
		blockstr += '<hr class="divider" />';
	if(reportData["masterSummaryReportSRO"]["totalSessions"])
	{
		blockstr += getBlock("totalSessions");
	}
	if(reportData["masterSummaryReportSRO"]["completedSessions"])
	{
		blockstr += getBlock("completedSessions");
	}
	if(reportData["masterSummaryReportSRO"]["freeSessions"])
	{
		blockstr += getBlock("freeSessions");
	}
	if(reportData["masterSummaryReportSRO"]["freeConverted"])
	{
		blockstr += getBlock("freeConverted");
	}
		blockstr += '<hr class="divider" />';
	if(reportData["masterSummaryReportSRO"]["durationRevenue"])
	{
		blockstr += getBlock("durationRevenue");
	}
	if(reportData["masterSummaryReportSRO"]["monthlyRevenue"])
	{
		blockstr += getBlock("monthlyRevenue");
	}
	if(reportData["masterSummaryReportSRO"]["receivedRevenue"])
	{
		blockstr += getBlock("receivedRevenue");
	}
	$('.reportsMain').append(blockstr);
}
//Function to get the % difference between this set of data and the last onerror
function getDifference(newVal,oldVal)
{
	if(newVal > oldVal)
	{
		var diff = newVal - oldVal;
		var perc = ((diff/oldVal)*100).toFixed(2);
	}
	else
	{
		var diff = oldVal - newVal;
		var perc = ((diff/oldVal)*100).toFixed(2);
	}
	return perc;
}
//Function to create the label for the blockstr
function getLabel(indx)
{
	switch (indx){
		case 'activeUsers':
			return "Active Users";
		break;
		case 'acquiredUsers':
			return "New Users";
		break;
		case 'dormantUsers':
			return "Dormant Users";
		break;
		case 'activeCoaches':
			return "Active Coaches";
		break;
		case 'totalSessions':
			return "Total Sessions";
		break;
		case 'completedSessions':
			return "Completed Sessions";
		break;
		case 'freeSessions':
			return "Free Sessions";
		break;
		case 'freeConverted':
			return "Conversion from free";
		break;
		case 'durationRevenue':
			return "Revenue";
		break;
		case 'monthlyRevenue':
			return "Monthly Recurring Revenue";
		break;
		case 'receivedRevenue':
			return "Payments Received";
		break;
	}
}
//Function to create the blockstr
function getBlock(indx,className)
{
	var labelstr = getLabel(indx);
	var returnstr = '<div class="cardBlock '+className+'"><h4 class="blockTitle">'+labelstr+'</h4><div class="cardBlockInner"><span class="mainMetric">';
	if(lastReportData["masterSummaryReportSRO"][indx])
	{
		// data exists for last interval
		returnstr += reportData["masterSummaryReportSRO"][indx] + '</span>';
		var growth = getDifference(reportData["masterSummaryReportSRO"][indx],lastReportData["masterSummaryReportSRO"][indx]);
		var growthAbs = Math.abs(reportData["masterSummaryReportSRO"][indx] - lastReportData["masterSummaryReportSRO"][indx]);
		if(reportData["masterSummaryReportSRO"][indx] > lastReportData["masterSummaryReportSRO"][indx])
		{
			// new data is bigger than old data
			returnstr += '<span class="subMetric positive">+' + growth + '&nbsp;&nbsp;<span class="change">+'+ growthAbs +'</span></span></div></div>';
		}
		else
		{
			// new data is smaller than old data
			returnstr += '<span class="subMetric negative">-' + growth + '&nbsp;&nbsp;<span class="change">-'+ growthAbs +'</span></span></div></div>';
		}
	}
	else
	{
		// data doesnt exist for last interval
		returnstr += reportData["masterSummaryReportSRO"][indx] + '</span></div></div>';
	}
	return returnstr;
}
function getBlockInvert(indx,className)
{
	var labelstr = getLabel(indx);
	var returnstr = '<div class="cardBlock '+className+'"><h4 class="blockTitle">'+labelstr+'</h4><div class="cardBlockInner"><span class="mainMetric">';
	if(lastReportData["masterSummaryReportSRO"][indx])
	{
		// data exists for last interval
		returnstr += reportData["masterSummaryReportSRO"][indx] + '</span>';
		var growth = getDifference(reportData["masterSummaryReportSRO"][indx],lastReportData["masterSummaryReportSRO"][indx]);
		var growthAbs = Math.abs(reportData["masterSummaryReportSRO"][indx] - lastReportData["masterSummaryReportSRO"][indx]);
		if(reportData["masterSummaryReportSRO"][indx] > lastReportData["masterSummaryReportSRO"][indx])
		{
			// new data is bigger than old data
			returnstr += '<span class="subMetric negative">+' + growth + '&nbsp;&nbsp;<span class="change">+'+ growthAbs +'</span></span></div></div>';
		}
		else
		{
			// new data is smaller than old data
			returnstr += '<span class="subMetric positive">-' + growth + '&nbsp;&nbsp;<span class="change">-'+ growthAbs +'</span></span></div></div>';
		}
	}
	else
	{
		// data doesnt exist for last interval
		returnstr += reportData["masterSummaryReportSRO"][indx] + '</span></div></div>';
	}
	return returnstr;
}
// Function to construct the fetch URL for getting the report data
function getReport(arg)
{
	var url = urlReport + 'startDate=' + arg["startDate"] + '&endDate=' + arg["endDate"];
	var x = getData(url);
	return x;
}