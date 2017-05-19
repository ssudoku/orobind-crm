//JS to handle the json api calls and populate the interface

//these are the prefixes for the url at the end of which the appropriate queries will be added to create the request url for fetching data
urlMain = "/panel/getsession?";
urlUserInfo = "/panel/getuserinfo?";
urlCoachInfo = "/panel/getcoachinfo?";
urlCoachSchedule = "/panel/getcoachsessionsinaday?";
urlUserSessionInfo = "/panel/getsessionforuser?";
urlUserAddSession = "/panel/addsessionforuser?";
urlUserModSession = "/panel/updatesession?";
urlAutoSuggest = "/panel/autosuggest?search=";
urlAutoSuggestCoach = "/panel/autosuggestcoach?search=";
urlAddData = "/panel/services/updatesession?";
urlGetPayment = "/panel/showallusercreditsV2?";
urlSendInvoice = "/panel/sendpaymentmailer?";
urlUserPayment = "/panel/getusertxndetails?email=";
urlOrderHistory = "/panel/getallproductitemrequestV2?startDate=2015-01-01%2000:00:00&endDate=2016-01-01%2000:00:00";
urlOrderUpdate = "/panel/updateorderstatusV2?";
urlUserCreditHistory = "/panel/sessioncreditconsumption?";
urlRescheduleRequests = "/panel/getsessionrsdreq?";
urlUpdateRescheduleRequests = "/panel/actionrsdrequest?";
urlUserLeads = "/panel/subscriber/getusers?";
urlUserLeadsWithCallback = "/panel/subscriber/getusersbycallback?";
urlUserCampaigns = "/panel/getcampaigns?";
urlPostStatus = "/panel/subscriber/updatesubscriberforstatus?";
urlPostComment = "/panel/subscriber/updatesubscriberforcomment?";
urlCallbackSms = "/panel/leads/notpickup?";
urlGetFreeSessions = "/panel/sessiongrp/getfreesessiongrp?";
urlEditFreeSessions = "/api/session/freerequest?did=ffffffff-8fb5-ae05-ffff-ffff99d603b&tnk=ac4b16af3b-747a-4772-ab7b-2dad45b00bb5";
urlFreeSessionsCoach = "/panel/sessiongrp/settrainerfreesessiongrp?";
urlDietplanUpload = "/panel/uploaddietsheet?";
urlDietplanFetch = "/panel/getDietByUser?";
urlSendDietEmail = "/panel/senduserdiet?";
urlOfflinePayment = "/panel/renewbycash?";
urlReceivedPayments = "/panel/getallusertxndetails?";
urlUserReferrals = "/panel/getusertranscredits?";
urlAddReferralCredits = "/panel/addrefcredits?";
urlAddSocialCredits = "/panel/addsoccredits?";
urlSubstituteCoach = "/panel/update/substitute/on?";
urlPauseGroup = "/panel/update/pauseOrResumeSessions?";
urlConvertTrial = "/panel/update/updatesessiongroupaftertrial?";
urlUpdateSessGroup = "/panel/update/updatesessiongrp";
urlMigrateSessGroup = "/panel/update/migratefuturesession?";
urlUpdateReportCell = "/panel/updatebusinessreport?";
urlGetNewReports = "/panel/businessreportrequest?";
urlAddReportDate = "/panel/addbusinessreport?";
urlCheckReportDate = "/panel/checkbusinessreportfordate?";
urlSessTime = "/panel/getsessionstarttime?";
urlCancelRequests = "/panel/getsessioncanreq?";
urlUpdateCancelRequests = "/panel/actioncanrequest?";

//global vars for the summary tableRow
meanDev = 0;
countDev = 0;
meanDur = 0;
countDur = 0;
meanCoachRat = 0;
countCoachRat = 0;
countCanc = 0;
timeArray = 0;
meanUserRat = 0;
countUserRat = 0;
sSessArray  = [];
countCoachArray = []
meanWeight = 0;
countWeight = 0;
meanWater = 0;
countwater = 0;
meanSleep = 0;
countSleep = 0;
countNSess = 0;
countComplete = 0;
countDemo = 0;
countDemoExec = 0;

//Mapping object for the new business reports key values
reportVisibleKeys = {};

//getSessionsDate('2015-03-01','2015-03-21',0,30);
//getSessionsUserDate('shubhanshu.srivastava@gmail.com','2015-03-01','2015-03-15',0,30);
//getSessionsCoachDate('tr-vyas.satya@gmail.com','2015-03-01','2015-03-15',0,30);

coachTemp = {};
conflictingTimes = {};

window.userRole = 'others'; //others, ops
window.lastCardState = {};
lastTableState = {};

altCities = {
	"1": "Chennai",
	"2": "Hyderabad",
	"3": "Mumbai",
	"4": "New Delhi",
	"5": "Pune",
	"6" : "Others"
}

altServices = {
	"1":"Yoga",
	"2":"Zumba",
	"3":"Group Workouts",
	"4":"Pilates",
	"5" : "Others"
}

altPrices = {
	"1" : "4500 - 6000",
	"2" : "3000 - 4500",
	"3" : "Less than 3000"
}

informedCauses = {
	"1" : "User emergency",
	"2" : "Coach emergency",
	"3" : "User change of mind",
	"4" : "User converted without demo"
}

suddenCauses = {
	"1" : "User did not show up",
	"2" : "Coach did not show up",
	"3" : "Weather issues",
	"4" : "Other (please explain in the comment box)"
}

//Function for creating the ops landing page
var defaultcard = '<div class="cardRow sessionsTop"><h2 class="cardTitle">Recent Sessions</h2><div class="sessionsWhen"><div class="sessionsWhenSelect"><input type="text" class="whenText" value="Last 500 sessions"><button class="whenToggle"><i class="fa fa-chevron-down"></i></button></div><form class="sessionDatepicker"><div class="datePickerInput">From <input type="text" class="startDate" placeholder="DD-MM-YYYY"> To <input type="text" class="endDate" placeholder="DD-MM-YYYY"><div class="inputRangeWrap"><span class="rangeHint">How many sessions</span><input type="range" class="inputRangeSlider"><input type="text" class="inputRangeValue"></div><button class="datePickerSubmit">Refresh Table</button></div></form></div></div><div class="summary card"><h3 class="summary cardTitle">Quick View</h3><table class = "summTab dataTable"><tr><th>Total</th><th>Cancels</th><th>Done</th><th>Demos</th><th>Executed</th><th>Peak Scheduled</th><th>Deviation</th><th>Duration</th><th>Coach Rating</th><th>User Rating</th><th>Coaches</th><th>User data for</th><th>Water</th><th>Weight</th><th>Sleep</th></tr></table></div><div class="card sessions"><div class="cardRow sessionsMain"><h3 class="tableRange">May 30, 2015</h3><div class="checkInMapModal modal"><div class="inner"><a href="#" class="close">X</a><div class="checkInMapCanvas"></div></div></div></div>';
function init()
{
	var sorterSessions = tsorter.create('sessionsList', 0, {
		time: function(row){
			var x = this.getCell(row);
			var timeval = $(x).attr("data-time");
			return parseFloat( timeval, 10 );
		},
		rating: function(row){
			var x = this.getCell(row);
			var ratingval = $(x).attr("data-rating");
			return parseFloat( ratingval, 10 );
		},
		diff: function(row){
			var x = this.getCell(row);
			var ratingval = $(x).attr("data-difference");
			return parseFloat( ratingval, 10 );
		},
		userComment: function(row){
			var x = this.getCell(row);
			var ratingval = $(x).find(".userComment").text();
			return parseFloat( ratingval, ' ' );
		},
		coachComment: function(row){
			var x = this.getCell(row);
			var ratingval = $(x).find(".coachComment").text();
			return parseFloat( ratingval, ' ' );
		}
	});
}
function init2()
{
	var sorterUserLeads = tsorter.create('leadsList',0,null);
}
function sortInitPayment()
{
	var sorterSessions = tsorter.create('paymentsList', 0, {
		time: function(row){
			var x = this.getCell(row);
			var timeval = $(x).attr("data-time");
			return parseFloat( timeval, 10 );
		},
		rating: function(row){
			var x = this.getCell(row);
			var ratingval = $(x).attr("data-rating");
			return parseFloat( ratingval, 10 );
		},
		diff: function(row){
			var x = this.getCell(row);
			var ratingval = $(x).attr("data-difference");
			return parseFloat( ratingval, 10 );
		}
	});
}
//Function for calling calcMean function with filled data objects and appending response to a div.
function callCalcMean(args)
{
	$('.summTab tr').not(':first-child').detach();
	
	var tabData = calcMean({"countNSess": countNSess, "completed":countComplete, "meanDev" : meanDev, "countDev" : countDev, "meanDur" : meanDur, "countDur" : countDur, "meanCoachRat" : meanCoachRat, "countCoachRat" : countCoachRat,"countCanc":countCanc, "sSessArray":sSessArray, "countCoachArray":countCoachArray,  "meanUserRat" : meanUserRat, "countUserRat" : countUserRat, "meanWeight": meanWeight, "countWeight": countWeight, "meanWater": meanWater, "countWater":countwater, "meanSleep": meanSleep, "countSleep": countSleep, "countDemo": countDemo, "countDemoExec":countDemoExec});
	
	$('.summTab').append(tabData);
}
//Function to calculate summary data from page.
function calcMean(args)
{
	tabD = '<tr id ="anaRow" class = "overallRow">';
	
	if (args['countNSess'])
	{
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="total">'+args['countNSess']+'</a></td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}
	
	if (args['countCanc'])
	{
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="cancels">'+args['countCanc']+'</a></td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	if (args['completed'])
	{
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="completed">'+args['completed']+'</a></td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	if (args['countDemo'])
	{
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="demo">'+args['countDemo']+'</a></td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	if (args['countDemoExec'])
	{
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="executed">'+args['countDemoExec']+'</a></td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}
	
	if (args['sSessArray'])
	{
		var result = uniqueIdentify(args['sSessArray']);
		var max = result[1][0];
		var maxIndex = 0;
		for (var i = 1; i < result[1].length; i++) {
		    if (result[1][i] > max) {
			maxIndex = i;
			max = result[1][i];
		    }
		}
		var peakTime = result[0][maxIndex];
		var noSessions = max;
		tabD += '<td class ="overallColVal">'+peakTime+' ('+max+')</td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}
	
	if (args['meanDev'])
	{
		var avgDev = Math.abs(args['meanDev']/args['countDev']);
		var meanDiffMinutes = Math.floor(avgDev/60);
		var meanDiffSeconds = Math.floor(avgDev % 60);
		var meanDiffHour = Math.floor(meanDiffMinutes/60);
		/*if(meanDiffHour > 0)
		{
			meanDiffMinutes = meanDiffMinutes % 60;
		}*/
		var validcountDeviation = args['countDev'];
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="deviation">' +meanDiffMinutes + ' mins, ' + meanDiffSeconds +' secs ('+ validcountDeviation +')</a></td>';

	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	
	if (args['meanDur'])
	{
		var avgDur = Math.abs(args['meanDur']/args['countDur']);
		meanDurMinutes = Math.floor(avgDur/60);
		meanDurSeconds = Math.floor(avgDur%60);
		meanDurHour = Math.floor(meanDurMinutes/60);
		/*if(meanDurHour > 0)
		{
			meanDurMinutes = meanDurMinutes % 60;
		}*/
		var validcountDuration = args['countDur'];
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="duration">' + meanDurMinutes + ' mins, ' + meanDurSeconds +' secs ('+ validcountDuration +')</a></td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	
	if(args['meanCoachRat'])
	{
		var avgCoachRat = args['meanCoachRat']/args['countCoachRat'];
		avgCoachRat = parseFloat(avgCoachRat);
		var validcountCrating = parseInt(args['countNSess']) - window.uncountedCoachrat;
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="cRating">'+parseFloat(avgCoachRat).toFixed(3)+' ('+ validcountCrating +')</a></td>';	
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	if(args['meanUserRat'])
	{
		
		var avgUserRat = args['meanUserRat']/args['countUserRat'];
		avgUserRat = parseFloat(avgUserRat);
		var validcountUrating = parseInt(args['countNSess']) - window.uncountedUserrat;
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="uRating">'+parseFloat(avgUserRat).toFixed(3)+' ('+ validcountUrating +')</a></td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}
	
	if (args['countCoachArray'])
	{
		var result = uniqueIdentify(args['countCoachArray']);
		tabD += '<td class ="overallColVal">'+result[1].length+'</td>';
		
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	if(window.countedData)
	{
		tabD += '<td class ="overallColVal"><a href="#" class="uiLink" data-href="hasData">'+ window.countedData +' sessions</a></td>';
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}
	
	if (args['meanWater'])
	{
		var avgWater = meanWater/countwater;
		avgWater = avgWater.toFixed(2);
		tabD += '<td class ="overallColVal">'+avgWater+' ltrs</td>';
		
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}
	
	if (args['meanWeight'])
	{
		
		var avgWeight = meanWeight/countWeight;
		avgWeight = avgWeight.toFixed(2);
		tabD += '<td class ="overallColVal">'+avgWeight+' kgs</td>';
		
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	
	if (args['meanSleep'])
	{
		var avgSleep = meanSleep/countSleep;
		avgSleep = avgSleep.toFixed(2);
		tabD += '<td id = "sleepTabVal" class ="overallColVal">'+avgSleep+' hrs</td>';
		
	}
	else
	{
		tabD +='<td class ="overallColVal">--</td>';
	}

	tabD += '</tr>';
	return tabD;
}

function uniqueIdentify(arr)
{
	var a = [], b = [], prev;
    
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    
    return [a, b];
}

function resetSummaryVar()
{
	meanDev = 0;
	countDev = 0;
	meanDur = 0;
	countDur = 0;
	meanCoachRat = 0;
	countCoachRat = 0;
	countCanc = 0;
	timeArray = 0;
	meanUserRat = 0;
	countUserRat = 0;
	sSessArray  = [];
	countCoachArray = []
	meanWeight = 0;
	countWeight = 0;
	meanWater = 0;
	countwater = 0;
	meanSleep = 0;
	countSleep = 0;
	countComplete = 0;
	countNSess = 0;
	countDemo = 0;
	countDemoExec = 0;
	window.uncountedDuration = null;
	window.uncountedDeviation = null;
	window.uncountedCoachrat = null;
	window.uncountedUserrat = null;
	window.countedData = null;
}
function sessionTableDefaults(trl)
{
	$('.sessionsTop').detach();
	if(!trl)
	{
		$('.sessionsList, .card').detach();
		$('.main').append(defaultcard);
		$('.sessionDatepicker .inputRangeWrap .inputRangeSlider').val(18);
		$('.sessionDatepicker .inputRangeWrap .inputRangeValue').val(500);
		$('.sessionsTop .cardTitle').text('Recent Sessions');
		var tablestr = '<table id="sessionsList" class="sessionsList sortable" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th data-tsorter="time">When</th><th>Demo</th><th data-tsorter="link">User <a class="sort"></a></th><th data-tsorter="link">Coach</i></a></th><th>Status</th><th>On way</th><th>Check-in</th><th data-tsorter="diff">Delay</th><th data-tsorter="diff">Length</th><th data-tsorter="rating"><i class="fa fa-star"></i> User</th><th data-tsorter="rating"><i class="fa fa-star"></i> Coach</th><th data-tsorter="userComment">User Feedback</th><th data-tsorter="coachComment">Coach Feedback</th><th>Weight</th><th>Water</th><th>Sleep</th></tr></thead><tbody></tbody></table>';
		$('.sessionsMain').append(tablestr);
		$('.datePickerInput input.startDate, .datePickerInput input.endDate').datetimepicker({
			timepicker:false,
			format: 'd-m-Y',
			onChangeDateTime: function(){
				$('.datePickerInput input.startDate,.datePickerInput input.endDate').datetimepicker('hide');
			}
		});
	}
}
function populateTableData(arg)
{
	var stDate = moment(arg["startDate"],"YYYY-MM-DD");
	var enDate = moment(arg["endDate"],"YYYY-MM-DD");
	if(arg["startDate"] == arg["endDate"])
	{
		$('.sessionsMain .tableRange').text(stDate.format("Do MMMM, YYYY"));
	}
	else
	{
		$('.sessionsMain .tableRange').text(stDate.format("Do MMMM, YYYY") + " to " + enDate.format("Do MMMM, YYYY"));
	}

	var sessionData = arg["sessionData"];
	tableNumber = 1; currentDate = null; previousDate = null; window.currentTable = null;

	resetSummaryVar();
	meanDev = 0;
	if(sessionData)
	{
		countNSess = sessionData['sessionAdminSROs'].length;
		var sessNumVal = 'Last ' + countNSess + ' Sessions';
		$('.sessionsTop .sessionsWhen .whenText').val(sessNumVal);
	}
	switch (arg["mode"]){
		case 'small':
			for(key in sessionData['sessionAdminSROs'])
			{
				openingTableSummary(sessionData['sessionAdminSROs'][key]);
			}
			$('.card.sessions').hide();
			callCalcMean();
		break;
		case 'large':
			for(key in sessionData['sessionAdminSROs'])
			{
				var trow = openingTableCells(sessionData['sessionAdminSROs'][key]);
				openingTableSummary(sessionData['sessionAdminSROs'][key]);
				if(window.currentTable)
				{
					$('.sessionsMain .sessionsList.date'+ window.currentTable +' tbody').append(trow);
				}
				else
				{
					$('.sessionsMain .sessionsList tbody').append(trow);
				}
			}
			callCalcMean();
		break;
		case 'toSmall':
			$('.card.sessions').hide();
		break;
		case 'toLarge':
			if($('.card.sessions .sessionsList tbody tr').length)
			{
				$('.card.sessions').show();
			}
			else
			{
				for(key in sessionData['sessionAdminSROs'])
				{
					var trow = openingTableCells(sessionData['sessionAdminSROs'][key]);
					openingTableSummary(sessionData['sessionAdminSROs'][key]);
					if(window.currentTable)
					{
						$('.sessionsMain .sessionsList.date'+ window.currentTable +' tbody').append(trow);
					}
					else
					{
						$('.sessionsMain .sessionsList tbody').append(trow);
					}
				}
				$('.card.sessions').show();
				callCalcMean();
			}
		break;
	};
	
	if($('.sessionsList').length)
	{
		markConflicts({"table":$('.sessionsList'),"conflicts":conflictingTimes});
	}
	init();
}
function loadCheckInMap(arg)
{
	var elem = arg["elem"];
	if(elem.hasClass("checkInMapLink"))
	{
		$('.sessionsMain .checkInMapModal').fadeIn(150).css("display","flex");
		
		var userLatLng = new google.maps.LatLng(elem.attr("data-ulat"), elem.attr("data-ulong"));
		var coachLatLng = new google.maps.LatLng(elem.attr("data-clat"), elem.attr("data-clong"));
		
		var mapOptions = {
			zoom: 14,
			center: userLatLng
		}
		
		var map = new google.maps.Map($('.sessionsMain .checkInMapModal .checkInMapCanvas')[0], mapOptions);

		var marker = new google.maps.Marker({
			position: userLatLng,
			map: map,
			icon: 'http://cdn.orobind.com/srv/static/imagesV2/checkin-user.png',
			title: 'User Location'
		});
		var marker2 = new google.maps.Marker({
			position: coachLatLng,
			map: map,
			icon: 'http://cdn.orobind.com/srv/static/imagesV2/checkin-coach.png',
			title: 'Coach Check-in'
		});	
	}
	else if(elem.hasClass('mapLink'))
	{
		$('.freeSessionsMain .freeSessionMap').fadeIn(150).css("display","flex");
		
		var userLatLng = new google.maps.LatLng(elem.attr("data-lat"), elem.attr("data-long"));
		var mapOptions = {
			zoom: 14,
			center: userLatLng
		}
		var map = new google.maps.Map($('.freeSessionsMain .freeSessionMap .freeSessionMapContainer')[0], mapOptions);

		var marker = new google.maps.Marker({
			position: userLatLng,
			map: map,
			icon: 'http://cdn.orobind.com/srv/static/imagesV2/checkin-user.png',
			title: 'User Location'
		});

	}
	else if(elem.hasClass('userInfoMapLink'))
	{
		popShow($('.mapDisplayModal'));
		var userLatLng = new google.maps.LatLng(elem.attr("data-lat"), elem.attr("data-long"));
		var mapOptions = {
			zoom: 14,
			center: userLatLng
		}
		var map = new google.maps.Map($('.cardRow.userInfo .mapDisplayModal .mapDisplayContainer')[0], mapOptions);

		var marker = new google.maps.Marker({
			position: userLatLng,
			map: map,
			icon: 'http://cdn.orobind.com/srv/static/imagesV2/checkin-user.png',
			title: 'User Location'
		});
	}
}
function loadLanding(arg)
{
	var landingCard = '<div class="card landing"><div class="landingTop"><h2 class="cardTitle">Welcome. What would you like to explore?</h2></div><div class="landingMain"><div class="row clearfix"><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchSessions"><i class="fa fa-clock-o linkIcon"></i><span class="linkText">Sessions</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchReports"><i class="fa fa-pie-chart linkIcon"></i><span class="linkText">Reports</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchInvoices"><i class="fa fa-file-text-o linkIcon"></i><span class="linkText">Invoices</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchPayments"><i class="fa fa-rupee linkIcon"></i><span class="linkText">Payments</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchGroups"><i class="fa fa-cubes linkIcon"></i><span class="linkText">Session Groups</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchReschedules"><i class="fa fa-history linkIcon"></i><span class="linkText">Reschedules</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchCancels"><i class="fa fa-calendar-times-o linkIcon"></i><span class="linkText">Cancellations</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchLeads"><i class="fa fa-users linkIcon"></i><span class="linkText">User Leads</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchDiet"><i class="fa fa-newspaper-o linkIcon"></i><span class="linkText">Diet Plans</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner launchStats"><i class="fa fa-bar-chart linkIcon"></i><span class="linkText">Business Stats</span></div></div></div></div></div>';
	$('.sessionsTop, .sessionsList, .card').detach();
	$('.main').append(landingCard);
}
function loadOpsDefault(arg)
{
	var startDate = arg["startDate"], endDate = arg["endDate"];
	var trl = $('.sessionsList tbody td').length;
	sessionTableDefaults(trl);	
	if(arg["mode"] == "small" || arg["mode"] == "large")
	{
		var sessionData = getSessionsDate(startDate,endDate,0,500);
	}
	else if(!trl && arg["mode"] == "toLarge")
	{
		var sessionData = getSessionsDate(startDate,endDate,0,500);
	}
	
	sessionData['sessionAdminSROs'].sort(function(a,b) { return parseFloat(moment(a["startTime"],"MMM D, YYYY hh:mm:ss a").format("X")) - parseFloat(moment(b["startTime"],"MMM D, YYYY hh:mm:ss a").format("X")) } );
	
	coachTemp = {};
	conflictingTimes = {};
	arg["sessionData"] = sessionData;
	populateTableData(arg);
	window.loadedTable = "default";
	//loadCheckInMap();
	return true;
}
//Function for creating the ops landing page
function loadOpsDateSize(arg)
{
	if(arg && arg["startDate"] && arg["endDate"] && arg["maxSize"])
	{
		var startDate = arg["startDate"], endDate = arg["endDate"], maxSize = arg["maxSize"];
	}
	else if (arg["maxSize"])
	{
		var startDate = '2014-01-01', endDate = xToday, maxSize = arg["maxSize"];
	}
	else
	{
		showModalMessage({"message":"Please specify the result count and the start and end dates optionally"})
	}
	var trl = $('.sessionsList tbody td').length;
	sessionTableDefaults(trl);
	if(arg["mode"] == "small" || arg["mode"] == "large")
	{
		var sessionData = getSessionsDate(startDate,endDate,0,maxSize);
	}
	else if(!trl && arg["mode"] == "toLarge")
	{
		var sessionData = getSessionsDate(startDate,endDate,0,maxSize);
	}
	coachTemp = {};
	conflictingTimes = {};
	arg["sessionData"] = sessionData;
	populateTableData(arg);
	window.loadedTable = "dateSize";
	window.tableStartDate = startDate;
	window.tableEndDate = endDate;
	window.tableMaxSize = maxSize;
	return true;
}
//Function for creating the user results
function loadbyUser(arg)
{
	var userName = arg["userName"];
	var trl = $('.sessionsList tbody td').length;
	sessionTableDefaults(trl);
	if(arg["mode"] == "small" || arg["mode"] == "large")
	{
		var sessionData = getSessionsUser(userName,0,500);
	}
	else if(!trl && arg["mode"] == "toLarge")
	{
		var sessionData = getSessionsUser(userName,0,500);
	}
	coachTemp = {};
	conflictingTimes = {};
	arg["sessionData"] = sessionData;
	populateTableData(arg);
	window.loadedTable = "user";
	return true;
}
//Function for creating the user results based on email, date-range and size
function loadbyUserDateSize(arg)
{
	var userName = arg["userName"], startDate = arg["startDate"], endDate = arg["endDate"], start = arg["start"], count = arg["count"];
	var trl = $('.sessionsList tbody td').length;
	sessionTableDefaults(trl);
	$('.sessionsTop .sessionsWhen').hide();
	if(arg["mode"] == "small" || arg["mode"] == "large")
	{
		var sessionData = getSessionsUserDate(userName,startDate,endDate,start,count);
	}
	else if(!trl && arg["mode"] == "toLarge")
	{
		var sessionData = getSessionsUserDate(userName,startDate,endDate,start,count);
	}
	coachTemp = {};
	conflictingTimes = {};
	arg["sessionData"] = sessionData;
	populateTableData(arg);
	window.loadedTable = "userDateSize";
	window.tableStartDate = startDate;
	window.tableUserName = userName;
	window.tableEndDate = endDate;
	window.tableStart = start;
	window.tableCount = count;
	return true;
}
//Function for creating the coach results based on email, date-range and size
function loadbyCoachDateSize(arg)
{
	var userName = arg["coachName"], startDate = arg["startDate"], endDate = arg["endDate"], start = arg["start"], count = arg["count"];
	var trl = $('.sessionsList tbody td').length;
	sessionTableDefaults(trl);
	$('.sessionsTop .cardTitle').text('Coach Sessions');
	$('.sessionsTop .sessionsWhen').hide();
	
	if(arg["mode"] == "small" || arg["mode"] == "large")
	{
		var sessionData = getSessionsCoachDate(coachName,startDate,endDate,start,count);
	}
	else if(!trl && arg["mode"] == "toLarge")
	{
		var sessionData = getSessionsCoachDate(coachName,startDate,endDate,start,count);
	}
	coachTemp = {};
	conflictingTimes = {};
	arg["sessionData"] = sessionData;
	populateTableData(arg);
	window.loadedTable = "coachDateSize";
	window.tableStartDate = startDate;
	window.tableCoachName = coachName;
	window.tableEndDate = endDate;
	window.tableStart = start;
	window.tableCount = count;
	return true;
}
//Function for creating the user results with result size
function loadbyUserSize(arg)
{
	var userName = arg["userName"], start = arg["start"], size = arg["count"];
	var trl = $('.sessionsList tbody td').length;
	sessionTableDefaults(trl);
	$('.sessionsTop .sessionsWhen').hide();
	if(arg["mode"] == "small" || arg["mode"] == "large")
	{
		var sessionData = getSessionsUser(userName,start,size);
	}
	else if(!trl && arg["mode"] == "toLarge")
	{
		var sessionData = getSessionsUser(userName,start,size);
	}
	coachTemp = {};
	conflictingTimes = {};
	arg["sessionData"] = sessionData;
	populateTableData(arg);
	window.loadedTable = "userSize";
	window.tableUserName = userName;
	window.tableStart = start;
	window.tableCount = size;
	return true;
}
//Function for creating the coach results
function loadbyCoach(arg)
{
	var coachName = arg["coachName"];
	var trl = $('.sessionsList tbody td').length;
	sessionTableDefaults(trl);
	$('.sessionsTop .cardTitle').text('Coach Sessions');
	$('.sessionsTop .sessionsWhen').hide();
	
	if(arg["mode"] == "small" || arg["mode"] == "large")
	{
		var sessionData = getSessionsCoach(coachName,0,500);
	}
	else if(!trl && arg["mode"] == "toLarge")
	{
		var sessionData = getSessionsCoach(coachName,0,500);
	}
	coachTemp = {};
	conflictingTimes = {};
	arg["sessionData"] = sessionData;
	populateTableData(arg);
	window.loadedTable = "coach";
	window.tableCoachName = coachName;
	return true;
}
//Function for creating the coach results with result size
function loadbyCoachSize(arg)
{
	var userName = arg["coachName"], size = arg["count"];
	var trl = $('.sessionsList tbody td').length;
	sessionTableDefaults(trl);
	$('.sessionsTop .cardTitle').text('Coach Sessions');
	$('.sessionsTop .sessionsWhen').hide();
	
	if(arg["mode"] == "small" || arg["mode"] == "large")
	{
		var sessionData = getSessionsCoach(coachName,0,size);
	}
	else if(!trl && arg["mode"] == "toLarge")
	{
		var sessionData = getSessionsCoach(coachName,0,size);
	}
	coachTemp = {};
	conflictingTimes = {};
	arg["sessionData"] = sessionData;
	populateTableData(arg);
	window.loadedTable = "coachSize";
	window.tableCoachName = coachName;
	window.tableCount = size;
	return true;
}
//Function for loading the received payments list
function loadReceivedPayments(arg)
{
	window.lastCardState = $('.sessionsTop, .sessionsList, .card').detach();
	var receivedCard = '<div class="card received"><div class="cardRow receivedTop"><h2 class="cardTitle">Payments Received</h2><div class="receivedWhen dateControlWidget"><div class="receivedWhenSelect dropDown"><input class="whenText" value="Today" type="text"><button class="whenToggle"><i class="fa fa-chevron-down"></i></button></div><form class="receivedDatepicker controlForm"><div class="datePickerInput dateInput">From <input class="startDate" placeholder="DD-MM-YYYY" type="text"> To <input class="endDate" placeholder="DD-MM-YYYY" type="text"><button data-module="receivedPayments" class="datePickerSubmit dateControlSubmit">Fetch Payments</button></div></form></div></div><div class="cardRow receivedMain"><table class="receivedList"><thead><tr><th>When</th><th>User</th><th>Transaction Code</th><th>Mode</th><th>Payment (<i class="fa fa-rupee"></i>)</th><th>Offer (<i class="fa fa-rupee"></i>)</th><th>Promo (<i class="fa fa-rupee"></i>)</th><th>Social (<i class="fa fa-rupee"></i>)</th><th>Referral (<i class="fa fa-rupee"></i>)</th><th>Credited (<i class="fa fa-rupee"></i>)</th></tr></thead><tbody></tbody></table></div></div>';
	$('.main').append(receivedCard);
	$('.received .dateInput .startDate, .received .dateInput .endDate').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.received .dateInput .startDate, .received .dateInput .endDate').datetimepicker('hide');
		}
	});
	var receivedPaymentData = getReceivedPayments(arg);
	if(receivedPaymentData && receivedPaymentData["responseCode"] && receivedPaymentData["responseCode"] == 1000)
	{
		for(var ii in receivedPaymentData["userIndividualPaymentSRO"])
		{
			var trw = '<tr>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["txnDate"] + '</td>';
			trw += '<td><a class="clickable" data-type="userNameLink" data-useremail="' + receivedPaymentData["userIndividualPaymentSRO"][ii]["userEmail"] + '">' + receivedPaymentData["userIndividualPaymentSRO"][ii]["userName"] + '</a></td>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["transactionCode"] + '</td>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["paymentMode"] + '</td>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["paymentAmout"] + '</td>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["offerAmount"] + '</td>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["promoAmount"] + '</td>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["socAmount"] + '</td>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["refAmount"] + '</td>';
			trw += '<td>' + receivedPaymentData["userIndividualPaymentSRO"][ii]["amount"] + '</td>';
			trw += '</tr>';
			$('.receivedMain .receivedList tbody').append(trw);
		}
	}
}
//Function for creating the diet module base
function loadDietModule(arg)
{
	window.lastCardState = $('.sessionsTop, .sessionsList, .card').detach();
	var dietBaseCard = '<div class="card diet"><div class="cardRow dietTop"><h2 class="cardTitle">Diet Plans</h2><div class="dietTopAction"><form class="fetchPlan"><button class="uploadCta"><i class="fa fa-plus-circle"></i> Upload New Plan</button><input type="text" placeholder="email@domain.com" class="fetchEmail"><button class="fetchPlanCta">Find Plan</button></form></div></div><div class="cardRow dietMain"><h3 class="sectionTitle">Upload a new plan</h3><form class="uploadPlan"><h4 class="stepTitle">Step 1: Enter the user\'s registered email address</h4><input type="text" placeholder="email@domain.com" class="uploadEmail"><h4 class="stepTitle">Step 2: Choose the CSV file containing the diet plan</h4><input type="file" class="uploadFile"><h4 class="stepTitle">Step 3: Upload plan</h4><button class="uploadPlanCta">Submit <i class="fa fa-chevron-right"></i></button></form></div></div>';
	$('.main').append(dietBaseCard);
}
//Function for creating the diet plan based on email
function loadDietPlanTable(arg)
{
	$('.diet .dietMain').hide();
	var dietPlanRow = '<div class="cardRow dietTable"><button class="sendPlanEmailCta">Send plan to user <i class="fa fa-envelope"></i></button><table class="dietPlan" cellpadding="0" cellspacing="0"><thead><tr class="firstRow"><th class="firstColumn">When</th><th class="what">What to eat</th><th class="options">Meal Options</th><th class="supplements">Supplements</th><th class="instructions">Special Instructions</th></tr></thead><tbody></tbody></table><ul class="dietsMain"></ul><div class="dietInfo"><h3 class="dietInfoTitle">Basic guidelines for wellness</h3><ul class="infoList"><li class="infoListItem">Drink minimum 3-4 liters of water a day.</li><li class="infoListItem">Every day, eat 3 meals + 2-3 healthy snacks so that you don’t overeat at meals.</li><li class="infoListItem">Never skip meals or snacks. Eat at the same time every day to ensure a healthy metabolism.</li><li class="infoListItem">Do not watch TV / Read while having your meals. Chew your food well before swallowing.</li><li class="infoListItem">Exercise for at least 45 minutes to 1 hour a day .</li><li class="infoListItem">Reduce oil consumption at home to just ½ L per person over the age of 14 yrs per month.  </li><li class="infoListItem">Have salads instead of snacks. A variety of vegetables can be used, this adds taste and color, making the salad more appetizing, egg whites or even boiled chole (chickpeas) can be added to add lean protein to the salad. Olive oil (along with vinegar or fresh lemon) can be drizzled over the salad as an alternative to high fat dressings.</li><li class="infoListItem">It may seem hard to resist those chaats, burgers, pizzas, masala dosas, samosas, chips, sweets, chocolates, desserts and ice creams. However they are unhealthy if you eat them more than once a week. Choose healthy snacks instead.</li><li class="infoListItem">Avoid foods with high salt content as this will lead to high blood pressure. Check food labels for salt content. The RDA (Recommended Dietary Allowance) of sodium is 2000mg/ day. Deep fried snacks, bakery products and processed foods are again high in sodium. </li><li class="infoListItem">Take time to relax and enjoy life! It is a well known fact that stress is a major risk factor for chronic lifestyle related diseases.</li></ul></div><div class="dietFootNotes"><h3 class="footNoteTitle">Standard Measurements</h3><div class="footNoteWrap"><div class="footNoteText">1 cup = 200g or 200ml whichever is applicable</div><div class="footNoteText">1 teaspoon = 5g or 5ml whichever is applicable</div><div class="footNoteText">1 tablespoon = 15g or 15ml whichever is applicable</div></div></div></div>';
	$('.diet').append(dietPlanRow);
	if(arg && arg["responseCode"] && arg["responseCode"] == 1000)
	{
		var i = 1;
		var dietDataObj = JSON.parse(arg.userDietPlanDTOs);
		for(var k in dietDataObj)
		{
			var trow ='<tr>';
			trow += '<td class="firstColumn">'+ dietDataObj[k]["mealType"] +'</td>';
			trow += '<td class="what">'+ dietDataObj[k]["meal"] +'</td>';
			trow += '<td class="options">'+ dietDataObj[k]["mealOptions"] +'</td>';
			if(dietDataObj[k]["supplements"])
			{
				trow += '<td class="supplements">'+ dietDataObj[k]["supplements"] +'</td>';
			}
			else
			{
				trow += '<td class="supplements">-</td>';
			}
			if(dietDataObj[k]["note"])
			{
				trow += '<td class="instructions">'+ dietDataObj[k]["note"] +'</td>';
			}
			else
			{
				trow += '<td class="instructions">-</td>';
			}
			trow += '</tr>';
			$('.dietPlan tbody').append(trow);

			var listli = '<li class="dietListItem"><div class="dietListInner">';
			listli += '<h2 class="dietListTitle step'+i+'">'+ dietDataObj[k]["mealType"] +'</h2>';
			listli += '<h3 class="category what">What to eat</h3><p class="content what">'+ dietDataObj[k]["meal"] +'</p>';
			listli += '<h3 class="category options">What are the options</h3><p class="content options">'+ dietDataObj[k]["mealOptions"] +'</p>';
			if(dietDataObj[k]["supplements"])
			{
				listli += '<h3 class="category options">Supplements</h3><p class="content options">'+ dietDataObj[k]["supplements"] +'</p>';
			}
			else
			{
				listli += '<h3 class="category options">Supplements</h3><p class="content options">-</p>';
			}
			if(dietDataObj[k]["note"])
			{
				listli += '<h3 class="category options">Special Instructions</h3><p class="content options">'+ dietDataObj[k]["note"] +'</p>';
			}
			else
			{
				listli += '<h3 class="category options">Special Instructions</h3><p class="content options">-</p>';
			}
			listli += '</div></li>';
			$('.dietsMain').append(listli);
			i++;
		}
	}
}
window.currentFocus = null;
window.previousFocus = null;
//Function for creating the new business reports
function loadNewReports(arg)
{
	var newReportCard = '<div class="card newReports"><div class="cardRow newReportsTop"><h2 class="cardTitle">Business Report</h2><div class="newReportsWhen"><div class="newReportsWhenSelect"><input class="whenText" value="Last 7 days" type="text"><button class="whenToggle"><i class="fa fa-chevron-down"></i></button></div><form class="newReportsDatepicker"><div class="datePickerInput">From <input class="startDate" placeholder="DD-MM-YYYY" type="text"> To <input class="endDate" placeholder="DD-MM-YYYY" type="text"><button class="datePickerSubmit">Fetch Report</button></div></form></div><button class="addNew">+ Add New Date</button></div><div class="cardRow newReportsMain"><div class="modal addReportDateModal wide"><div class="inner addReportDateInner"><a href="#" class="close">X</a><h3>Add new date to report</h3><form class="addReportForm"><div class="row clearfix"><div class="col-md-6 leftCol"><div class="dataInputWrap"><label class="addReportLabel newDateLabel">Date</label><input class="addReportInput date" name="date" type="text" placeholder="YYYY-MM-DD"></div></div><div class="col-md-6 rightCol"><div class="dataInputWrap"></div></div></div><button class="addReportCta">Add new date <i class="fa fa-angle-right"></i></button></form></div></div><table class="reportDataList"></table></div></div>';
	window.lastCardState = $('.sessionsTop, .sessionsList, .card').detach();
	$('.main').append(newReportCard);

	$('.newReports .addReportDateModal .date').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.newReports .addReportDateModal .date').datetimepicker('hide');
			checkReportForDate($('.newReports .addReportDateModal .date').val());
		}
	});

	function checkReportForDate(date)
	{
		var existing = checkBusinessReportForDate(date);
		if(existing && existing["responseCode"] && existing["responseCode"] == 1000)
		{
			$('.addReportDateModal .newDateLabel').html('Date <span class="statusOk"><i class="fa fa-check prim"></i></span>');
		}
		else if(existing && existing["responseCode"])
		{
			$('.addReportDateModal .newDateLabel').html('Date <span class="statusFail"><i class="fa fa-times prim"></i></span>')
			var errorMsg = "Error Code " + existing["responseCode"] + ": " + existing["response"];
			showModalMessage({"message":errorMsg});
		}
	}

	$('.newReportsDatepicker .datePickerInput .startDate, .newReportsDatepicker .datePickerInput .endDate').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.newReportsDatepicker .datePickerInput .startDate, .newReportsDatepicker .datePickerInput .endDate').datetimepicker('hide');
		}
	});

	if(arg && arg["fromDate"] && arg["toDate"])
	{
		var dateToday = arg["toDate"];
		var dateLastWeek = arg["fromDate"];
	}
	else
	{
		var dateToday = moment().format("YYYY-MM-DD");
		var dateLastWeek = moment().subtract(6,"days").format("YYYY-MM-DD");
	}
	window.currentReportedDates = {"fromDate":dateLastWeek,"toDate":dateToday}
	var newReportData = getNewReports({"fromDate":dateLastWeek,"toDate":dateToday});

	if(newReportData && newReportData["responseCode"] && newReportData["responseCode"] == 1000)
	{
		var trow = '<tr><th>&nbsp;</th>';
		var flg = true;
		for (var d in newReportData["visibleKeyMapping"])
		{
			var key = d; var val = newReportData["visibleKeyMapping"][d];
			reportVisibleKeys[key.replace("visibleKey","")] = val;
		}
		for(var xx in reportVisibleKeys)
		{
			trow += '<th data-key="'+ xx +'">'+ reportVisibleKeys[xx] +'</th>';
			var datafield = '<label class="addReportLabel">'+ reportVisibleKeys[xx] +'</label><input type="text" class="addReportInput '+ xx +'" name="'+ xx +'">';
			if(flg)
			{
				$('.addReportDateModal .rightCol .dataInputWrap').append(datafield);
			}
			else
			{
				$('.addReportDateModal .leftCol .dataInputWrap').append(datafield);
			}
			flg = !flg;
		}
		trow += '</tr>';
		$('.reportDataList').append(trow);
		var nrData = newReportData["businessReportSROs"];
		nrData.sort(function(a, b){return moment(b["reportDate"],"YYYY-MM-DD hh:mm:ss").format("X") - moment(a["reportDate"],"YYYY-MM-DD hh:mm:ss").format("X")});
		//moment(nrData[ind]["reportDate"],"DD MMM, YYYY hh:mm:ss a").format("DD-MM-YYYY")
		for (var ind in nrData)
		{
			var dataForDate = nrData[ind]["reportInfoMap"];
			var dt = moment(nrData[ind]["reportDate"],"YYYY-MM-DD hh:mm:ss");
			var newRow = '<tr><td data-date="'+ dt.format("YYYY-MM-DD") +'">'+ dt.format("Do MMM, YYYY") +'</td>';
			for (var currentKey in reportVisibleKeys)
			{
				newRow += '<td data-key="'+ currentKey +'">'+ dataForDate[currentKey] +'</td>';
			}
			newRow += '</tr>';
			$('.reportDataList').append(newRow);
		}
	}

	swapRowsCols($(".reportDataList")[0]);
}
//Function to populate the new date modal by the key value pairs from the server
function populateNewDateModal(arg)
{
	//
}
//Function to change the rows into columns for a table
function swapRowsCols(arg)
{
	$(arg).each(function() {
        var $this = $(this);
        var newrows = [];
        $this.find("tr").each(function(){
            var i = 0;
            $(this).find("td, th").each(function(){
                i++;
                if(newrows[i] === undefined) { newrows[i] = $("<tr></tr>"); }
                newrows[i].append($(this));
            });
        });
        $this.find("tr").remove();
        $.each(newrows, function(){
            $this.append(this);
        });
    });
}

//Function for creating the data-sample for performance tab
function loadPerfUser(arg)
{
	if(arg && arg["email"])
	{
		if(arg["startDate"] && arg["endDate"])
		{
			var perfDataSet = getPerfUserDate(arg);
		}
		else
		{
			var perfDataSet = getPerfUser(arg["email"]);
		}
		if(perfDataSet && perfDataSet["responseCode"] == 1000)
		{
			var perfData = [];
			for (var indx in perfDataSet["sessionAdminSROs"])
			{
				if(perfDataSet["sessionAdminSROs"][indx]["weight"])
				{
					if(perfDataSet["sessionAdminSROs"][indx]["actualStartTime"])
					{
						var sessionDatePre = moment(perfDataSet["sessionAdminSROs"][indx]["actualStartTime"],"MMM DD, YYYY hh:mm:ss a");
					}
					else
					{
						var sessionDatePre = moment(perfDataSet["sessionAdminSROs"][indx]["scheduledStartTime"],"MMM DD, YYYY hh:mm:ss a");
					}
					var sessionDateAbs = sessionDatePre.format("X");
					var sessionDate = sessionDatePre.format("YYYY-MM-DD");
					var sessionDateLbl = sessionDatePre.format("MMM DD");
					perfData.push({"dateAbs":sessionDateAbs,"label":sessionDateLbl,"date":sessionDate,"weight":perfDataSet["sessionAdminSROs"][indx]["weight"],"water":perfDataSet["sessionAdminSROs"][indx]["waterIntake"],"sleep":perfDataSet["sessionAdminSROs"][indx]["hoursSlept"]});
				}
			}
			perfData.sort(function(a, b){return a["dateAbs"] - b["dateAbs"]});
			return perfData;
		}
	}
}
//Function to create the free session requests table
function loadFreeRequests(arg)
{
	window.lastCardState = $('.sessionsTop, .sessionsList, .card').detach();
	var userLeadsCard = '<div class="card freeSessions"><div class="cardRow freeSessionsTop"><h2 class="cardTitle">Free Sessions Request</h2><div class="freeSessionsWhen"><div class="freeSessionsWhenSelect"><input class="whenText" value="Last 7 days" type="text"><button class="whenToggle"><i class="fa fa-chevron-down"></i></button></div><form class="freeSessionsDatepicker"><div class="datePickerInput">From <input class="startDate" placeholder="DD-MM-YYYY" type="text"> To <input class="endDate" placeholder="DD-MM-YYYY" type="text"><button class="datePickerSubmit">Fetch Requests</button></div></form></div></div><div class="cardRow freeSessionsMain"><div class="modal freeSessionMap"><div class="inner freeSessionMapInner"><a class="close" href="#">X</a><div class="freeSessionMapContainer"></div></div></div><div class="modal freeSessionsModal small"><div class="inner freeSessionsInner"><a class="close" href="#">X</a><div class="infoBlock"><p class="infoRow when"><span class="infoTitle">Time: </span><span class="infoValue"></span></p><p class="infoRow name"><span class="infoTitle">Name: </span><span class="infoValue"></span></p><p class="infoRow mobile"><span class="infoTitle">Mobile: </span><span class="infoValue"></span></p><p class="infoRow email"><span class="infoTitle">Email: </span><span class="infoValue"></span></p><p class="infoRow where"><span class="infoTitle">Address: </span><span class="infoValue"></span></p></div><form class="fulfillForm"><input type="text" placeholder="Coach Code" class="fulfillInput coachCode"><br><input type="text" placeholder="Timings" class="fulfillInput timing"><br><button class="fulfillCta cta">Approve Request</button><button class="cancelCta cta">Deny Request</button></form></div></div></div></div>';
	var tableCard = '<h3 class="tableTitle tableTitle1"></h3><table class="freeSessionsList freeSessionsList1"><thead><tr><th>When</th><th>Where</th><th>Map</th><th>Who</th><th>Mobile</th><th>Email</th><th>Action</th+></tr></thead><tbody></tbody></table>';
	$('.main').append(userLeadsCard);
	$('.freeSessionsMain').append(tableCard);
	$('.freeSessions .freeSessionsDatepicker .startDate, .freeSessions .freeSessionsDatepicker .endDate').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.freeSessions .freeSessionsDatepicker .startDate, .freeSessions .freeSessionsDatepicker .endDate').datetimepicker('hide');
		}
	});
	$('.freeSessionsMain .freeSessionsModal .inner').find('.fulfillInput.timing').datetimepicker({
		format: 'd-m-Y h:i a',
		step: 15,
		onChangeDateTime: function(){
			$('.freeSessionsMain .freeSessionsModal .inner').find('.fulfillInput.timing').datetimepicker('hide');
		}
	});
	var startDateTime = arg["startDate"] + " 00:00:00";
	var endDateTime = arg["endDate"] + " 23:59:59";
	var freeRequestsData = getFreeSessions({"startDate":startDateTime,"endDate":endDateTime});
	window.latestFreeSessionDate = null;
	tableNumber = 1;
	if(freeRequestsData && freeRequestsData["responseCode"] && freeRequestsData["responseCode"] == 1000)
	{
		for(var indx in freeRequestsData["freeSessionRequestSROs"])
		{
			var xczxczxcz = freeRequestsData["freeSessionRequestSROs"][indx];
			var sT = moment(freeRequestsData["freeSessionRequestSROs"][indx]["startTime"],"DD MMM, YYYY hh:mm:ss a");
			if(!window.latestFreeSessionDate)
			{
				window.latestFreeSessionDate = sT.format("MMMM Do, YYYY");
				$('.freeSessionsMain .tableTitle1').text(window.latestFreeSessionDate);
			}
			if(sT.format("MMMM Do, YYYY") != window.latestFreeSessionDate)
			{
				tableNumber++;
				window.latestFreeSessionDate = sT.format("MMMM Do, YYYY");
				tableCard = '<h3 class="tableTitle tableTitle'+tableNumber+'"></h3><table class="freeSessionsList freeSessionsList'+tableNumber+'"><thead><tr><th>When</th><th>Where</th><th>Map</th><th>Who</th><th>Mobile</th><th>Email</th><th>Action</th+></tr></thead><tbody></tbody></table>';
				$('.freeSessionsMain').append(tableCard);
				$('.freeSessionsMain .tableTitle'+tableNumber+'').text(window.latestFreeSessionDate);
			}
			var trow = '<tr>';
			trow += '<td>' + sT.format("h:mm a") + '</td>';
			trow += '<td class="venue">' + freeRequestsData["freeSessionRequestSROs"][indx]["venue"] + '</td>';
			trow += '<td><a href="#" data-lat="' + freeRequestsData["freeSessionRequestSROs"][indx]["latitude"] + '" data-long="' + freeRequestsData["freeSessionRequestSROs"][indx]["longitude"] + '" class="mapLink"><i class="fa fa-map-marker fa-2x"></i></a></td>';
			trow += '<td>' + freeRequestsData["freeSessionRequestSROs"][indx]["userName"] + '</td>';
			trow += '<td>' + freeRequestsData["freeSessionRequestSROs"][indx]["userMobile"] + '</td>';
			trow += '<td>' + freeRequestsData["freeSessionRequestSROs"][indx]["userEmail"] + '</td>';
			trow += '<td><button data-email="' + freeRequestsData["freeSessionRequestSROs"][indx]["userEmail"] + '" data-mobile="' + freeRequestsData["freeSessionRequestSROs"][indx]["userMobile"] + '" data-name="' + freeRequestsData["freeSessionRequestSROs"][indx]["userName"] + '" data-address="' + freeRequestsData["freeSessionRequestSROs"][indx]["venue"] + '" data-lat="' + freeRequestsData["freeSessionRequestSROs"][indx]["latitude"] + '" data-long="' + freeRequestsData["freeSessionRequestSROs"][indx]["longitude"] + '" data-time="' + sT.format("X") + '" class="fulfillRequest">Fulfill / Cancel</button></td>';
			trow += '</tr>';
			$('.freeSessionsMain .freeSessionsList'+ tableNumber +' tbody').append(trow);
		}
	}
}
//Function for creating the list of cancellation requests bound by time
function loadCancelRequests(arg)
{
	$('.sessionsTop').detach();
	var cancelsCard = '<div class="card cancels"><div class="cardRow cancelsTop"><h2 class="cardTitle">Recent Cancellations</h2><div class="cancelsWhen"><div class="cancelsWhenSelect"><input type="text" class="whenText" value="Today\'s cancels"><button class="whenToggle"><i class="fa fa-chevron-down"></i></button></div><form class="cancelsDatepicker"><p>cancels by date</p><div class="datePickerInput">From<input type="text" class="startDate" placeholder="DD-MM-YYYY"> To<input type="text" class="endDate" placeholder="DD-MM-YYYY"><button class="datePickerSubmit">Refresh Table</button></div></form></div></div><div class="cardRow cancelsMain"><div class="stepIn modal"><div class="stepInAction inner"><a class="stepInClose close">X</a><h3 class="stepInTitle"><span class="userName">Shubhanshu</span> wants to cancel the session</h3><div class="status">Coach: <span class="coachName">Satya Vyas</span></div><form class="stepInForm"><input type="hidden" class="sessCodeHolder"><textarea class="stepInReason" placeholder="Reason for accepting or rejecting"></textarea><button class="stepInButton" id="stepInDeny"><i class="fa fa-close"></i> Deny</button><button class="stepInButton" id="stepInAccept"><i class="fa fa-check"></i> Accept</button></form></div></div></div></div>';
	$('.sessionsList, .card').detach();
	$('.main').append(cancelsCard);
	$('.cancels .cancelsDatepicker .startDate, .cancels .cancelsDatepicker .endDate').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.cancels .cancelsDatepicker .startDate, .cancels .cancelsDatepicker .endDate').datetimepicker('hide');
		}
	});
	var startDate = arg["startDate"];
	var endDate = arg["endDate"];
	var cancelsTable = '<table class="cancelsList" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th>User</th><th>Coach</th><th>Status</th><th>Comment</th><th>Action</th></tr></thead><tbody></tbody></table>';
	$('.cancelsMain').append(cancelsTable);

	window.cancelsMode = null;
	if(arg && arg["email"])
	{
		var email = arg["email"];
		if(arg["mode"] && arg["mode"] === 'user')
		{
			var cancelsData = getCancels({"mode":"user","email":email,"startDate":startDate,"endDate":endDate});
			window.cancelsMode = "user";
		}
		else if(arg["mode"] && arg["mode"] === 'coach')
		{
			var cancelsData = getCancels({"mode":"coach","email":email,"startDate":startDate,"endDate":endDate});
			window.cancelsMode = "coach";
		}
		window.cancelEmail = email;
	}
	else if(arg)
	{
		var cancelsData = getCancels({"mode":"none","startDate":startDate,"endDate":endDate});
	}
	if(cancelsData && cancelsData["responseCode"] && cancelsData["responseCode"] == 1000)
	{
		window.cancelsList = {};
		var i = 0;
		if(cancelsData && cancelsData["sessionCancelRequestSROs"])
		{
			for (var ind in cancelsData["sessionCancelRequestSROs"])
			{
				var rowText = '<tr>';
				rowText += '<td><a href="#" class="clickable cancelUser" data-type="cancelUserLink" data-email="'+cancelsData["sessionCancelRequestSROs"][ind]["userEmail"]+'">'+cancelsData["sessionCancelRequestSROs"][ind]["userName"]+'</a></td>';
				rowText += '<td><a href="#" class="clickable cancelCoach" data-type="cancelCoachLink" data-email="'+cancelsData["sessionCancelRequestSROs"][ind]["coachEmail"]+'">'+cancelsData["sessionCancelRequestSROs"][ind]["coachName"]+'</a></td>';

				switch (cancelsData["sessionCancelRequestSROs"][ind]["status"])
				{
					case 'INI':
						rowText += '<td class="requestStatus">Pending</td>';
					break;
					case 'ACP':
						rowText += '<td class="requestStatus">Accepted <i class="fa fa-check positive"></i></td>';
					break;
					case 'REJ':
						rowText += '<td class="requestStatus">Rejected <i class="fa fa-close negative"></i></td>';
					break;
				}

				rowText += '<td class="aggregateComment">'+cancelsData["sessionCancelRequestSROs"][ind]["comment"]+'</td>';

				if(cancelsData && cancelsData["sessionCancelRequestSROs"] && cancelsData["sessionCancelRequestSROs"][ind] && cancelsData["sessionCancelRequestSROs"][ind]["status"] == 'INI')
				{
					rowText += '<td class="cancelAction"><button class="cancelItemCta" data-sessioncode="'+cancelsData["sessionCancelRequestSROs"][ind]["sessionCode"]+'">Step In</button></td>';
				}
				else 
				{
					rowText += '<td>&nbsp;</td>';
				}
				var sCode = cancelsData["sessionCancelRequestSROs"][ind]["sessionCode"];

				window.cancelsList[i] = {"sessionCode":sCode,"userName":cancelsData["sessionCancelRequestSROs"][ind]["userName"],"userEmail":cancelsData["sessionCancelRequestSROs"][ind]["userEmail"],"coachName":cancelsData["sessionCancelRequestSROs"][ind]["coachName"],"coachEmail":cancelsData["sessionCancelRequestSROs"][ind]["coachEmail"]};
				$('.cancelsList tbody').append(rowText);
				i++;
			}
		}
	}
	else
	{
		var alertText = requestsData['response']+'. Response Code:'+requestsData['responseCode'];
		showModalMessage({"message":alertText,"duration":5000});
	}
}
//Function for loading the list of reschedule requests bound by time
function loadRescheduleRequests(arg)
{
	$('.sessionsTop').detach();
	var rescheduleCard = '<div class="card requests"><div class="cardRow requestsTop"><h2 class="cardTitle">Recent Requests</h2><div class="requestsWhen"><div class="requestsWhenSelect"><input type="text" class="whenText" value="Today\'s Requests"><button class="whenToggle"><i class="fa fa-chevron-down"></i></button></div><form class="requestDatepicker"><p>Requests by date</p><div class="datePickerInput">From <input type="text" class="startDate" placeholder="DD-MM-YYYY"> To <input type="text" class="endDate" placeholder="DD-MM-YYYY"><button class="datePickerSubmit">Refresh Table</button></div></form></div></div><div class="cardRow requestsMain"><div class="stepIn modal"><div class="stepInAction inner"><a class="stepInClose close">X</a><h3 class="stepInTitle"><span class="userName">Shubhanshu</span> wants to reschedule the session from</h3><div class="fromDate">22 Feb, 2015 12:00:00 AM</div> to <div class="toDate">22 Feb, 2015 12:00:00 AM</div><div class="status">Coach: <span class="coachName">Satya Vyas</span></div><form class="stepInForm"><input type="hidden" class="sessCodeHolder"><textarea class="stepInReason" placeholder="Reason for accepting or rejecting"></textarea><button class="stepInButton" id="stepInDeny"><i class="fa fa-close"></i> Deny</button><button class="stepInButton" id="stepInAccept"><i class="fa fa-check"></i> Accept</button></form></div></div></div></div>';
	$('.sessionsList, .card').detach();
	$('.main').append(rescheduleCard);
	$('.requests .requestDatepicker .startDate, .requests .requestDatepicker .endDate').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.requests .requestDatepicker .startDate, .requests .requestDatepicker .endDate').datetimepicker('hide');
		}
	});
	var startDate = arg["startDate"];
	var endDate = arg["endDate"];
	var requestsTable = '<table class="requestsList" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th>User &amp; Coach</th><th>Change in Time</th><th>Type</th><th>Status</th><th>Comment</th><th>Action</th></tr></thead><tbody></tbody></table>';
	$('.requestsMain').append(requestsTable);
	if(arg && arg["email"])
	{
		var email = arg["email"];
		if(arg["mode"] && arg["mode"] === 'user')
		{
			var requestsData = getRequestsUserEmail(startDate,endDate,email);
		}
		else if(arg["mode"] && arg["mode"] === 'coach')
		{
			var requestsData = getRequestsCoachEmail(startDate,endDate,email);
		}
	}
	else
	{
		var requestsData = getRequests(startDate,endDate);
	}
	if(requestsData && requestsData["responseCode"] && requestsData["responseCode"] == 1000)
	{
		window.rescheduleList = {};
		var i = 0;
		if(requestsData && requestsData["sessionRescheduleRequestSROs"])
		{
			for (var ind in requestsData["sessionRescheduleRequestSROs"])
			{
				var rowText = '<tr>';
				//var datOrig = moment(requestsData["sessionRescheduleRequestSROs"][ind]["oldScheduledTime"],"DD MMM, YYYY hh:mm:ss a");
				var datOrigStr = requestsData["sessionRescheduleRequestSROs"][ind]["oldScheduledDate"];
				//var datNew = moment(requestsData["sessionRescheduleRequestSROs"][ind]["newScheduledTime"],"DD MMM, YYYY hh:mm:ss a");
				var datNewStr = requestsData["sessionRescheduleRequestSROs"][ind]["newScheduledTime"];
				rowText += '<td><a href="#" class="clickable rescheduleUser" data-type="rescheduleUserLink" data-email="'+requestsData["sessionRescheduleRequestSROs"][ind]["userEmail"]+'">'+requestsData["sessionRescheduleRequestSROs"][ind]["userName"]+'</a><span class="subtext"><a href="#" class="clickable rescheduleCoach" data-type="rescheduleCoachLink" data-email="'+requestsData["sessionRescheduleRequestSROs"][ind]["coachEmail"]+'">'+requestsData["sessionRescheduleRequestSROs"][ind]["coachName"]+'</a></span></td>';
				rowText += '<td>To: '+requestsData["sessionRescheduleRequestSROs"][ind]["newScheduledTime"]+'<span class="subtext">From: '+requestsData["sessionRescheduleRequestSROs"][ind]["oldScheduledDate"]+'</span></td>';
				//<i class="fa fa-lg fa-check positive"></i>
				switch (requestsData["sessionRescheduleRequestSROs"][ind]["typeRequest"])
				{
					case 'DOT':
						rowText += '<td class="typeRequest">Do it later</td>';
					break;
					case 'RSD':
						rowText += '<td class="typeRequest">Reschedule</td>';
					break;
				}
				switch (requestsData["sessionRescheduleRequestSROs"][ind]["status"])
				{
					case 'INI':
						rowText += '<td class="requestStatus">Pending</td>';
					break;
					case 'ACP':
						rowText += '<td class="requestStatus">Accepted <i class="fa fa-check positive"></i></td>';
					break;
					case 'REJ':
						rowText += '<td class="requestStatus">Rejected <i class="fa fa-close negative"></i></td>';
					break;
				}
				rowText += '<td class="aggregateComment">'+requestsData["sessionRescheduleRequestSROs"][ind]["comment"]+'</td>';
				if(requestsData && requestsData["sessionRescheduleRequestSROs"] && requestsData["sessionRescheduleRequestSROs"][ind] && requestsData["sessionRescheduleRequestSROs"][ind]["status"] == 'INI')
				{
					rowText += '<td class="requestAction"><button class="requestItemCta" data-sessioncode="'+requestsData["sessionRescheduleRequestSROs"][ind]["sessionCode"]+'">Step In</button></td>';
				}
				else 
				{
					rowText += '<td>&nbsp;</td>';
				}
				var sCode = requestsData["sessionRescheduleRequestSROs"][ind]["sessionCode"];
				window.rescheduleList[i] = {"sessionCode":sCode,"userName":requestsData["sessionRescheduleRequestSROs"][ind]["userName"],"userEmail":requestsData["sessionRescheduleRequestSROs"][ind]["userEmail"],"coachName":requestsData["sessionRescheduleRequestSROs"][ind]["coachName"],"coachEmail":requestsData["sessionRescheduleRequestSROs"][ind]["coachEmail"],"toDate":datNewStr,"fromDate":datOrigStr};
				$('.requestsList tbody').append(rowText);
				i++;
			}
		}
	}
	else
	{
		var alertText = requestsData['response']+'. Response Code:'+requestsData['responseCode'];
		showModalMessage({"message":alertText,"duration":5000});
	}
}
window.currentUserGroup = null;
//Function for loading user info
function loadUserInfo(email)
{
	$('.sessionsTop').detach();
	var userdata = getUserInfo(email);
	window.lastCardState = $('.card').detach();
	var card = '<div class="card users"><div class="cardRow userTop"><h2 class="cardTitle">'+userdata['sessionGroupDetails']["userName"]+'</h2><ul class="userTabs"><li><a href="#" class="tabPerformance">Performance</a></li><li><a href="#" class="tabPayments">Payment</a></li><li><a href="#" class="current tabSessions">Sessions</a></li><li><a href="#" class="tabInfo">User Info</a></li></ul></div><div class="cardRow userPerformance"><h4>Performance</h4><div class="chartControlWidget"><form class="typeControl"><select class="chartTypeSelect"><option data-val="1">Weight change over time</option><option data-val="2">Sleep pattern over time</option><option data-val="3">Water consumption over time</option><option data-val="4">Weight change vs Water consumed over Time</option><option data-val="5">Weight change vs Sleep pattern over Time</option></select></form><form class="dateControl"><span class="fieldLabel">From</span><input type="text" placeholder="DD-MM-YYYY" class="chartStartDate"><span class="fieldLabel">To</span><input type="text" placeholder="DD-MM-YYYY" class="chartEndDate"><button class="chartRefresh"><i class="fa fa-refresh"></i></button></form></div><div class="chartWrap"><div class="summaryDiv"></div><div id="chartdiv" style="width: 100%; height: 400px; background-color: #FFFFFF;" ></div></div></div><div class="cardRow userPayments"></div><div class="cardRow userSessions"><div class="modal sendSMSCheck small"><div class="inner sendSMSCheckInner" style="text-align:center"><p>Send SMS to user about rescheduling?</p><br><button class="affirmCta bg-prim white" style="margin-right:10px">Yes</button><button class="rejectCta bg-hard white">No</button></div></div><div class="row clearfix"><div class="col-md-6 calContainer"></div><div class="col-md-6 sessioninfo"><h4>To add sessions, click on the appropriate dates</h4><div class="dataInputWrap modal small"><div class="dataInfo inner"><a class="dataInputClose close">X</a>Please enter the data to be added<form class="dataAddForm"><input type="text" name="dataFormWeight" placeholder="Weight (Kg)"><input type="text" name="dataFormWater" placeholder="Water (L)"><input type="text" name="dataFormSleep" placeholder="Sleep (Hrs)"><input type="text" name="dataFormMeals" placeholder="No of meals had"><p name="timeTitle">Time Started</p><div class="timeHolder"><input type="text" name="dataFormStartDate" placeholder="DD-MM-YYYY"><input type="text" name="dataFormStartTime" placeholder="HH:MM"></div><p name="timeTitle">Time Ended</p><div class="timeHolder"><input type="text" name="dataFormEndDate" placeholder="DD-MM-YYYY"><input type="text" name="dataFormEndTime" placeholder="HH:MM"></div><button class="dataSubmit">Submit Data</button></form></div></div><div class="doneSession"><i class="fa fa-check prim"></i> Session has ended and data has been already added. Pick another date</div><div class="existInfo">Session exists on this date. <br><div class="timeInfo"><span  class="reschdate"></span> at <span class="reschTime"></span></div><br> You can add data, reschedule or cancel this session. <div class="rescheduleInfo"><h4>Reschedule to:</h4><form class="rescheduleInput"><input type="text" class="rescheduleDate" placeholder="DD-MM-YYYY"><input type="text" class="rescheduleTime" placeholder="HH:MM"><textarea class="rescheduleComment" placeholder="Your Comments"></textarea></form></div></div><div class="addInfo"><div class="overallTime">Set time for new session - <input type="text" class="commonTime" placeholder="16:30"></div> <div class="selectedDates"></div></div><div class="sessionError"></div><button class="rescheduleCta">Reschedule</button><button class="cancelCta">Cancel</button><button class="dataCta">Add Data</button><button class="addCta">Add Sessions</button></div></div></div><div class="cardRow userInfo"></div>';
	$('.main').append(card);
	//dataFormStartDate,dataFormEndDate
	$('.overallTime input.commonTime').datetimepicker({
		datepicker:false,
		format: 'H:i',
		step: 15,
		onChangeDateTime: function(){
			$('.overallTime input.commonTime').datetimepicker('hide');
			var overAllTime = $('.overallTime input.commonTime').val();
			$('.selectedDates .dateChangeInput').val(overAllTime);
		}
	});
	$('.rescheduleInfo input.rescheduleDate').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.rescheduleInfo input.rescheduleDate').datetimepicker('hide');
		}
	});
	$('.rescheduleInfo input.rescheduleTime').datetimepicker({
		datepicker:false,
		format: 'H:i',
		step: 15,
		onChangeDateTime: function(){
			$('.rescheduleInfo input.rescheduleTime').datetimepicker('hide');
		}
	});
	$('.dataAddForm input[name="dataFormStartTime"], .dataAddForm input[name="dataFormEndTime"]').datetimepicker({
		datepicker:false,
		format: 'H:i',
		step: '1',
		onChangeDateTime: function(){
			$('.dataAddForm input[name="dataFormStartTime"], .dataAddForm input[name="dataFormEndTime"]').datetimepicker('hide');
		}
	});
	$('.chartControlWidget input.chartStartDate, .chartControlWidget input.chartEndDate').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.chartControlWidget input.chartStartDate, .chartControlWidget input.chartEndDate').datetimepicker('hide');
		}
	});
	$('.dataInputWrap input[name="dataFormStartDate"], .dataInputWrap input[name="dataFormEndDate"]').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.dataInputWrap input[name="dataFormStartDate"], .dataInputWrap input[name="dataFormEndDate"]').datetimepicker('hide');
		}
	});
	var userSessionGroup = '<h3 class="groupTitle sessGrpTableTitle">User Session Group <button class="substituteCta">Substitute Coach</button> <button class="updateGrpCta">Edit Session Group</button> <!--<button class="migrateCta">Migrate Session Group</button>--></h3><div class="modal mapDisplayModal"><div class="inner mapDisplayInner"><a href="#" class="close">X</a><div class="mapDisplayContainer"></div></div></div><div class="modal convertGroupModal small"><div class="inner convertGroupInner"><a href="#" class="close">X</a><p>Are you sure?</p><button class="convertAffirmCta">Convert now</button><button class="convertDenyCta">Not now</button></div></div><div class="modal pauseGroupModal small"><div class="inner pauseGroupInner"><a href="#" class="close">X</a><p>Are you sure?</p><button class="pauseAffirmCta">Pause the sessions</button><button class="pauseDenyCta">Not now</button></div></div><div class="modal editInfoModal small"><div class="inner editInfoInner"><a href="#" class="close">X</a> <h3 class="modalTitle">Edit Information</h3> <form class="editInfoForm"> <p class="label">User Name</p><input type="text" class="editInfoName" placeholder="Name"> <p class="label">Mobile</p><input type="text" class="editInfoMobile" placeholder="10 digit mobile num"> <p class="label">Date of birth</p><input type="text" class="editInfoDob" placeholder="Date of birth"> <div class="formRow"> <input type="radio" name="gender" data-val="ml" class="editInfoGender" id="editInfoMale"> <label for="editInfoMale">Male</label> <input type="radio" name="gender" data-val="fl" class="editInfoGender" id="editInfoFemale"> <label for="editInfoFemale">Female</label> </div><p class="label">Height</p><input type="text" class="editInfoHeight" placeholder="in cm"> <p class="label">Weight</p><input type="text" class="editInfoWeight" placeholder="in Kg"> <button class="editInfoSubmitCta">Update Information</button> </form></div></div><div class="modal small substituteCoachModal"> <div class="inner substituteCoachInner"><a href="#" class="close">X</a> <h3 class="modalTitle">Substitute Coach</h3> <form class="substituteCoachForm"> <input type="text" placeholder="New coach name" class="substitueFormCode autoSuggest"> <input type="checkbox" class="substituteCoachMode" checked id="substituteCoachMode"> <label for="substituteCoachMode">Change is permanent</label> <br><button class="substitueFormCta">Submit</button> </form> </div></div><div class="modal updateSessionGroupModal"> <div class="inner updateSessionGroupInner"><a href="#" class="close">X</a> <h3 class="modalTitle">Update Session Group</h3> <p class="currentValues days"><span class="label">Current Days</span>: <span class="value"></span></p><p class="currentValues timeslot"><span class="label">Current Timeslot</span>: <span class="value"></span></p><h4>New values</h4> <form class="updateSessionGroupForm"> <div class="updateFormRow toggleDays"><input type="radio" checked name="daysScheme" id="daysOld"><label for="daysOld">Old scheme</label> <input type="radio" name="daysScheme" id="daysNew"><label for="daysNew">New scheme</label></div> <div class="updateFormRow newDaysRow"><span class="label">Choose Days:</span><div class="daysOfWeek"><span class="weekdays" data-day="mon">Mo</span> <span class="weekdays" data-day="tue">Tu</span> <span class="weekdays" data-day="wed">We</span> <span class="weekdays" data-day="thu">Th</span> <span class="weekdays" data-day="fri">Fr</span> <span class="weekdays" data-day="sat">Sa</span> <span class="weekdays" data-day="sun">Su</span></div> </div> <div class="updateFormRow newTimeRow"><span class="label">Timeslots:</span> <div class="timeSlotsMap"><div class="timeSlotContainer mon"><span class="timeSlotLabel">Monday</span><input type="text" class="updateFormInput timeSlotDay" id="mon" value="06:30"></div><div class="timeSlotContainer tue"><span class="timeSlotLabel">Tuesday</span><input type="text" class="updateFormInput timeSlotDay" id="tue" value="06:30"></div><div class="timeSlotContainer wed"><span class="timeSlotLabel">Wednesday</span><input type="text" class="updateFormInput timeSlotDay" id="wed" value="06:30"></div><div class="timeSlotContainer thu"><span class="timeSlotLabel">Thursday</span><input type="text" class="updateFormInput timeSlotDay" id="thu" value="06:30"></div><div class="timeSlotContainer fri"><span class="timeSlotLabel">Friday</span><input type="text" class="updateFormInput timeSlotDay" id="fri" value="06:30"></div><div class="timeSlotContainer sat"><span class="timeSlotLabel">Saturday</span><input type="text" class="updateFormInput timeSlotDay" id="sat" value="06:30"></div><div class="timeSlotContainer sun"><span class="timeSlotLabel">Sunday</span><input type="text" class="updateFormInput timeSlotDay" id="sun" value="06:30"></div></div></div> <select class="updateFormDays oldDaysRow"> <option data-slot="MON">MON - Mon Wed Fri</option> <option data-slot="WKS">WKS - Weekdays + Sat</option> <option data-slot="WKK">WKK - Weekdays</option> <option data-slot="MWS">MWS - Mon Wed Sat</option> <option data-slot="TUE">TUE - Tue Thu Sat</option> <option data-slot="TTS">TTS - Tue Thu Sun</option> <option data-slot="TSS">TSS - Tue Thu Sat Sun</option> <option data-slot="TTH">TTH - Tue Thu</option> <option data-slot="WKN">WKN - Weekends</option> <option data-slot="xxx">xxx - Misc</option> </select> <div class="updateFormRow oldTimeRow"> <select class="updateFormInput hours"> <option>01</option> <option>02</option> <option>03</option> <option>04</option> <option>05</option> <option selected>06</option> <option>07</option> <option>08</option> <option>09</option> <option>10</option> <option>11</option> <option>12</option> </select> <select class="updateFormInput minutes"> <option>00</option> <option>15</option> <option selected>30</option> <option>45</option> </select> <select class="updateFormInput ampm"> <option>AM</option> <option>PM</option> </select> </div><span class="label">Latitude</span> <input type="text" placeholder="Latitude" class="updateFormInput latitude"> <span class="label">Longitude</span> <input type="text" placeholder="Longitude" class="updateFormInput longitude"> <button class="updateFormCta">Update Session Group</button> </form> </div></div><div class="modal migrateModal small"> <div class="inner migrateInner"><a class="close" href="#">X</a> <p>Migrate user\'s session group for future sessions?</p><button class="migrateAffirm">Migrate</button> <button class="migrateDeny">Not Now</button> </div></div><table class="userSessionTable">';
	if(userdata && userdata['sessionGroupDetails'])
	{
		for(var keys in userdata['sessionGroupDetails'])
		{
			userSessionGroup += userInfoCells(userdata['sessionGroupDetails'][keys],keys);
		}
		userSessionGroup += '</table>';
		window.currentUserGroup = userdata['sessionGroupDetails'];
		$('.cardRow.userInfo').append(userSessionGroup);
		$('.timeSlotDay').datetimepicker({
			datepicker:false,
			format: 'H:i',
			step: 15,
			onChangeDateTime: function(){
				$('.timeSlotDay').datetimepicker('hide');
			}
		});
		if(window.isPaused)
		{
			$('.pauseGroupModal .pauseAffirmCta').text('Resume Sessions');
		}
		else
		{
			$('.pauseGroupModal .pauseAffirmCta').text('Pause Sessions');
		}
		window.newSchemeTimings = null;
		if(userdata['sessionGroupDetails']["wrktDays"])
		{
			window.newSchemeTimings = [];
			var workoutDays = userdata['sessionGroupDetails']["wrktDays"].split("::");
			for (j in workoutDays)
			{
				var temp = workoutDays[j].split("-");
				var tempobj = {};
				tempobj[temp[0]] = temp[1];
				window.newSchemeTimings.push(tempobj);
			}
			$('.updateSessionGroupModal .updateFormInput.latitude').val(userdata['sessionGroupDetails']["latitude"]);
			$('.updateSessionGroupModal .updateFormInput.longitude').val(userdata['sessionGroupDetails']["longitude"]);
		}
		else
		{
			for(var keys in userdata['sessionGroupDetails'])
			{
				$('.updateSessionGroupModal .updateFormInput.latitude').val(userdata['sessionGroupDetails']["latitude"]);
				$('.updateSessionGroupModal .updateFormInput.longitude').val(userdata['sessionGroupDetails']["longitude"]);

				if(keys == "timings")
				{
					$('.updateSessionGroupModal .currentValues.timeslot .value').text(userdata['sessionGroupDetails'][keys]);
					var exactTime = moment(userdata['sessionGroupDetails']["exactTime"],"YYYY-MM-DD hh:mm:ss");
					var hr = exactTime.format("hh");
					var mm = exactTime.format("mm");
					if(hr >= 12)
					{
						if(hr > 12)
						{
							hr -= 12;
						}
						var noon = "PM";
					}
					else
					{
						var noon = "AM";
					}
					$('.updateSessionGroupModal .updateFormInput.hours option').each(function(){
						if($(this).text() == hr)
						{
							$(this).attr("selected","selected");
						}
						else
						{
							$(this).removeAttr("selected");
						}
					});
					$('.updateSessionGroupModal .updateFormInput.minutes option').each(function(){
						if($(this).text() == mm)
						{
							$(this).attr("selected","selected");
						}
						else
						{
							$(this).removeAttr("selected");
						}
					});
					$('.updateSessionGroupModal .updateFormInput.ampm option').each(function(){
						if($(this).text() == noon)
						{
							$(this).attr("selected","selected");
						}
						else
						{
							$(this).removeAttr("selected");
						}
					});
				}
				if(keys == "slotType")
				{
					var typeslot = userdata['sessionGroupDetails'][keys];
					$('.updateSessionGroupModal .currentValues.days .value').text(typeslot);
					$('.updateSessionGroupModal .updateFormDays option').each(function(){
						if($(this).attr("data-slot") == typeslot)
						{
							$(this).attr("selected","selected");
						}
						else
						{
							$(this).removeAttr("selected");
						}
					});
				}
			}	//
		}
		populateModalForms(userdata);
	}
	$('.editInfoModal .editInfoDob').datetimepicker({
		timepicker:false,
		format: 'd-m-Y',
		onChangeDateTime: function(){
			$('.editInfoModal .editInfoDob').datetimepicker('hide');
		}
	});

	var userInfoTable = '<h3 class="groupTitle">User Info <button class="editInfoCta"><i class="fa fa-pencil"></i> Edit</button></h3><table class="userDataTable">';
	if(userdata)
	{
		for(key in userdata)
		{
			if(userdata[key])
			{
				userInfoTable += userInfoCells(userdata[key],key);
				if(key == 'userEmail')
				{
					window.userEmail = userdata[key];
				}
			}
		}
		userInfoTable += '</table>';
		$('.cardRow.userInfo').append(userInfoTable);
	}
	var userSessionObject = getUserSessionInfo(email);
	if(userSessionObject)
	{
		var sessList = '';
		sessList += makeDateList(userSessionObject);
		var donelist = '';
		donelist += makeDoneList(userSessionObject);
		$('.calContainer').makeCal({"restricted":sessList, "done":donelist});
	}
	
	//Code to create the payment table for the user
	var userPaymentTable = '<div class="modal referralCreditsModal small"><div class="inner referralCreditsInner"><a class="close" href="#">X</a><h3 class="modalTitle">Add referral</h3><form class="referralCreditsForm"><span class="label">Referred by</span><input type="text" disabled class="referralCreditsInput referralCreditsFromEmail" value="'+email+'"><span class="label">Referred To</span><input type="text" class="referralCreditsInput referralCreditsToEmail" placeholder="email@domain.com"><button class="referralCreditsCta">Add Referral</button></form></div></div><div class="modal socialCreditsModal small"><div class="inner socialCreditsInner"><a class="close" href="#">X</a><h3 class="modalTitle">Add social credits</h3><form class="socialCreditsForm"><span class="label">Referred by</span><input type="text" disabled class="socialCreditsInput socialCreditsFromEmail" value="'+email+'"><span class="label">Amount</span><input type="text" class="socialCreditsInput socialCreditsAmount" placeholder="How many rupees"><button class="socialCreditsCta">Add social credits</button></form></div></div><div class="modal offlinePaymentModal small"><div class="inner offlinPaymentInner"><a class="close" href="#">X</a><h3 class="modalTitle">Add offline payment</h3><form class="offlinePaymentForm"><input type="text" class="offlinePaymentQty" placeholder="Amount (in rupees)"><input type="text" class="offlinePaymentRef" placeholder="Referral Credits (rupees)"><input type="text" class="offlinePaymentSoc" placeholder="Social Credits (rupees)"><input type="text" class="offlinePaymentPromo" placeholder="Promo Credits (rupees)"><input type="text" class="offlinePaymentAdv" placeholder="Advance Payment (rupees)"><input type="radio" data-mode="cash" class="offlinePaymentMethod" name="offlinePaymentMethod" id="offlinePaymentCash"><label for="offlinePaymentCash">Cash</label><input type="radio" data-mode="cheque" class="offlinePaymentMethod" name="offlinePaymentMethod" id="offlinePaymentCheque"><label for="offlinePaymentCheque">Cheque</label><textarea class="offlinePaymentComment" placeholder="Cheque Number / Denomination of cash etc"></textarea><button class="offlinePaymentSubmit">Add Transaction</button></form></div></div><h3 class="subtitle">Payment history</h3><div class="invoiceConfirmation"><div class="invoiceConfirmationInner"><a class="close">X</a><h3>Confirm action</h3><p>What kind of user do you want to send the invoice to?</p><p class="message"></p><input type="text" placeholder="Promo Code" class="invoiceConfirmationCode"><button class="returning">Returning User</button><button class="newuser">New User</button></div></div><div class="actionRow"><p><button class="invoiceCta" data-email="'+window.userEmail+'">Send Invoice <i class="fa fa-envelope"></i></button><button class="offlinePaymentCta" data-email="'+window.userEmail+'">Add Offline Payment <i class="fa fa-rupee"></i></button><button class="addReferralCta" data-email="'+window.userEmail+'">Add Referral Credits</button></button><button class="addSocialCta" data-email="'+window.userEmail+'">Add Social Credits</button></p></div><table class="paymentList" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th>Date</th><th>Amount (<i class="fa fa-rupee"></i>)</th><th>Promo (<i class="fa fa-rupee"></i>)</th><th>Offer (<i class="fa fa-rupee"></i>)</th><th>Referral (<i class="fa fa-rupee"></i>)</th><th>Social (<i class="fa fa-rupee"></i>)</th><th>Amount Paid (<i class="fa fa-rupee"></i>)</th><th>Transaction Code</th><th>Status</th><th>Source</th></tr></thead><tbody>';
	var userPaymentData = getUserPaymentData(email);
	if(userPaymentData && userPaymentData["userIndividualPaymentSRO"])
	{
		for(var ind in userPaymentData["userIndividualPaymentSRO"])
		{
			var rowText = '<tr>';
			rowText += '<td>'+userPaymentData["userIndividualPaymentSRO"][ind]["txnDate"]+'</td>';
			rowText += '<td>'+userPaymentData["userIndividualPaymentSRO"][ind]["amount"]+'</td>';
			rowText += '<td>-'+userPaymentData["userIndividualPaymentSRO"][ind]["promoAmount"]+'</td>';
			rowText += '<td>-'+userPaymentData["userIndividualPaymentSRO"][ind]["offerAmount"]+'</td>';
			rowText += '<td>-'+userPaymentData["userIndividualPaymentSRO"][ind]["refAmount"]+'</td>';
			rowText += '<td>-'+userPaymentData["userIndividualPaymentSRO"][ind]["socAmount"]+'</td>';
			rowText += '<td>'+userPaymentData["userIndividualPaymentSRO"][ind]["paymentAmout"]+'</td>';
			rowText += '<td>'+userPaymentData["userIndividualPaymentSRO"][ind]["transactionCode"]+'</td>';
			rowText += '<td>'+userPaymentData["userIndividualPaymentSRO"][ind]["status"]+'</td>';
			rowText += '<td>'+userPaymentData["userIndividualPaymentSRO"][ind]["paymentMode"]+'</td></tr>';
			userPaymentTable += rowText;
		}
		userPaymentTable += '</tbody></table>';
		$('.userPayments').append(userPaymentTable);
		$('.userTabs a.tabSessions').click();
	}

	//Code to create the referral credits history for the user
	var userReferralTable = '<h3 class="subtitle">Referral History</h3><table class="referralsList" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th>Type</th><th>When</th><th>Source</th><th>Referral Code</th><th>Is Enabled?</th><th>Available (<i class="fa fa-rupee"></i>)</th><th>Consumed (<i class="fa fa-rupee"></i>)</th><th>Status</th></tr></thead><tbody></tbody></table>';
	$('.userPayments').append(userReferralTable);
	var userReferralData = getReferralData(email);
	if(userReferralData && userReferralData["responseCode"] == 1000 && userReferralData["userTransactionCredits"])
	{
		for(var indx in userReferralData["userTransactionCredits"])
		{
			var rowText = '<tr>';
			rowText += '<td>'+userReferralData["userTransactionCredits"][indx]["referralType"]+'</td>';
			rowText += '<td>'+userReferralData["userTransactionCredits"][indx]["created"]+'</td>';
			if(userReferralData["userTransactionCredits"][indx]["referralSourceMail"])
			{
				rowText += '<td><a class="clickable" data-type="userNameLink" data-useremail="'+userReferralData["userTransactionCredits"][indx]["referralSourceMail"]+'">'+userReferralData["userTransactionCredits"][indx]["referralSource"]+'</a></td>';	
			}
			else
			{
				rowText += '<td>-</td>'
			}
			rowText += '<td>'+userReferralData["userTransactionCredits"][indx]["refCode"]+'</td>';
			rowText += '<td>'+userReferralData["userTransactionCredits"][indx]["isEnabled"]+'</td>';
			rowText += '<td>'+userReferralData["userTransactionCredits"][indx]["availableAmount"]+'</td>';
			rowText += '<td>'+userReferralData["userTransactionCredits"][indx]["consumedAmount"]+'</td>';
			rowText += '<td>'+userReferralData["userTransactionCredits"][indx]["status"]+'</td>';
			rowText += '</tr>';
			$('.referralsList tbody').append(rowText);
		}
	}

	//Code to create the credit usage history for the user
	var userCreditTable = '<h3 class="subtitle">Credit usage history</h3><table class="creditList" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th>Session Start Time</th><th>Credits Consumed (<i class="fa fa-rupee"></i>)</th><th>Session Code</th></tr></thead><tbody></tbody></table>';
	$('.userPayments').append(userCreditTable);
	var userCreditData = getUserCreditData(email);
	if(userCreditData && userCreditData["responseCode"] == 1000 && userCreditData["sessionCreditComsumptionSROs"])
	{
		for (var indx in userCreditData["sessionCreditComsumptionSROs"])
		{
			var rowText = '<tr>';
			rowText += '<td>'+userCreditData["sessionCreditComsumptionSROs"][indx]["startTime"]+'</td>';
			rowText += '<td>'+userCreditData["sessionCreditComsumptionSROs"][indx]["credit"]+'</td>';
			rowText += '<td>'+userCreditData["sessionCreditComsumptionSROs"][indx]["sessionCode"]+'</td>';
			rowText += '</tr>';
			$('.creditList tbody').append(rowText);
		}
	}

	var completedSessions = donelist.split(",");
	var sortedCompSess = [];
	for (var count in completedSessions)
	{
		var abs = moment(completedSessions[count],"YYYY-MM-DD").format("X");
		var act = completedSessions[count];
		sortedCompSess.push({"abs":abs,"act":act});
	}
	sortedCompSess.sort(function(a, b){return a["abs"] - b["abs"]});
	completedSessions = [];
	for (var count in sortedCompSess)
	{
		completedSessions.push(sortedCompSess[count]["act"]);
	}
	var clipLength = completedSessions.length - 7;
	if(clipLength > 0)
	{
		var lastSeven = completedSessions.slice(clipLength);
	}
	else
	{
		var lastSeven = completedSessions;
	}
	var strtDate = lastSeven[0];
	var ndDate = lastSeven[6];
	window.dataPerfAll = loadPerfUser({"email":window.userEmail,"startDate":strtDate,"endDate":ndDate});
}
function populateModalForms(data)
{
	var edituserform = $('.editInfoModal .editInfoForm');

	edituserform.find('.editInfoName').val(data["sessionGroupDetails"]["userName"]);
	edituserform.find('.editInfoMobile').val(data["mobile"]);
	if(data["dateOfBirth"])
	{
		edituserform.find('.editInfoDob').val(moment(data["dateOfBirth"],"YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY"));	
	}
	if(data["height"])
	{
		edituserform.find('.editInfoHeight').val(data["height"]);
	}
	if(data["weight"])
	{
		edituserform.find('.editInfoWeight').val(data["weight"]);
	}
	if(data["gender"])
	{
		if(data["gender"] == "ml")
		{
			edituserform.find('#editInfoMale').attr("checked","checked");
			edituserform.find('#editInfoFemale').removeAttr("checked");
		}
		else if(data["gender"] == "fl")
		{
			edituserform.find('#editInfoMale').removeAttr("checked");
			edituserform.find('#editInfoFemale').attr("checked","checked");
		}
	}
}
function populateEditCoachInfo(data)
{
	var editcoachform = $('.editInfoModal .editInfoForm');

	editcoachform.find('.editInfoName').val(data["allSessionGroupDetails"][0]["coachName"]);
	editcoachform.find('.editInfoMobile').val(data["mobile"]);
	if(data["dateOfBirth"])
	{
		editcoachform.find('.editInfoDob').val(moment(data["dateOfBirth"],"YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY"));
	}
	if(data["height"])
	{
		editcoachform.find('.editInfoHeight').val(data["height"]);
	}
	if(data["weight"])
	{
		editcoachform.find('.editInfoWeight').val(data["weight"]);
	}
	if(data["gender"] == "ml")
	{
		editcoachform.find('#editInfoMale').attr("checked","checked");
		editcoachform.find('#editInfoFemale').removeAttr("checked");
	}
	else if(data["gender"] == "fl")
	{
		editcoachform.find('#editInfoMale').removeAttr("checked");
		editcoachform.find('#editInfoFemale').attr("checked","checked");
	}
}
//Function for loading email data templates
function loadEmailData()
{
	$('.sessionsTop').detach();
	var emailData = getEmailInfo();
	window.lastCardState = $('.card').detach();
	var card = '<div class="card emailUsers"><div class="cardRow emailUsersTop"><h2 class="cardTitle">Existing Emails</h2><ul class="emailUsersTabs"><li><a href="#" class="current tabPerformance">Email</a></li><li><a href="#" class="tabSms tabSessions">SMS</a></li></ul></div><div class = "col-md emailContainer"><table class="emailNameTab"><tr><th>Active</th><th>Name</th><th>Reciepient</th><th>Sender</th><th>Subject</th><th>Actions</th></tr></table></div>';
	$('.main').append(card);
	if (emailData && emailData["responseCode"] && emailData["responseCode"] == 1000)
	{
		for (var ind in emailData["sessionGroupDetailedSRO"]) 
		{
			var tableRow = '<tr class = "callRow">';
			var name = emailData["sessionGroupDetailedSRO"][ind]['name'];
			var bodyTemplate = emailData["sessionGroupDetailedSRO"][ind]['bodyTemplate'];
			var subjectTemplate = emailData["sessionGroupDetailedSRO"][ind]['subjectTemplate'];
			var sender = emailData["sessionGroupDetailedSRO"][ind]['from'];
			var receiptent = emailData["sessionGroupDetailedSRO"][ind]['to'];
			var cc = emailData["sessionGroupDetailedSRO"][ind]['cc'];
			var bcc = emailData["sessionGroupDetailedSRO"][ind]['bcc'];
			var replyTo = emailData["sessionGroupDetailedSRO"][ind]['replyTo'];
			var enabled = emailData["sessionGroupDetailedSRO"][ind]['enabled'];
			var emailChannelId = emailData["sessionGroupDetailedSRO"][ind]['emailChannelId'];
			tableRow += '<td><input id = "checkBx2" type="checkbox" /></td><td>'+name+'</td><td>'+receiptent+'</td><td>'+sender+'</td><td>'+subjectTemplate+'</td><td class="toggleMyDiv" data-type="emailLink" data-userName ="'+ emailData["sessionGroupDetailedSRO"][ind]['name']+'" data-bodyTemplate ="'+ emailData["sessionGroupDetailedSRO"][ind]['bodyTemplate']+'" data-subjectTemplate ="'+ emailData["sessionGroupDetailedSRO"][ind]['subjectTemplate']+'" data-from ="'+ emailData["sessionGroupDetailedSRO"][ind]['from']+'" data-to ="'+ emailData["sessionGroupDetailedSRO"][ind]['to']+'" data-cc ="'+ emailData["sessionGroupDetailedSRO"][ind]['cc']+'" data-bcc ="'+ emailData["sessionGroupDetailedSRO"][ind]['bcc']+'" data-replyTo ="'+ emailData["sessionGroupDetailedSRO"][ind]['replyTo']+'" data-enabled ="'+ emailData["sessionGroupDetailedSRO"][ind]['enabled']+'" data-emailChannelId ="'+ emailData["sessionGroupDetailedSRO"][ind]['emailChannelId']+'"><Button class="moreEmailInfo" style = "" ><i class="fa fa-pencil"></i>&nbsp;Edit / See more</Button></td></tr>';
			$('.emailNameTab').append(tableRow);
			if (enabled == 'false')
			{
				
				$('#checkBx2').prop('checked', true);
			}
			else
			{
				$('#checkBx2').prop('checked', true);
			}
		}
	}
}
//Function fires when user clicks on update email option and updates only the changed data to the server.
function uploadEmail(load)
{
	var emaildata = "";
	var toVal = document.getElementById('toField').value;
	var ccVal = document.getElementById('ccField').value;
	var bccVal = document.getElementById('bccField').value;
	var bccVal = document.getElementById('bccField').value;
	var repVal = document.getElementById('replyTo').value;
	var subVal = document.getElementById('subject').value;
	var chnlVal = document.getElementById('channel').value;
	var fromVal = document.getElementById('from').value;
	var bodyData = CKEDITOR.instances.messageField.getData();
	if (load['enabled'])
	{
		
		var checkedEmail = false;
		if (document.getElementById('checkBx1').checked)
		{
			checkedEmail = "true";
		}
		else
		{
			checkedEmail = "false";
		}
		
		if (load['enabled'] == checkedEmail)
		{
			
		}
		else
		{
			emaildata+= '{"enabled":"'+checkedEmail+'"}';	
		}
		
	}
	
	
	if (load['to'])
	{
		if (load['to'] != toVal )
		{
			emaildata += '{"to":"'+toVal+'"}';
		}
	}
	
	if (load['cc'])
	{
		if (load['cc'] != ccVal )
		{
			emaildata += '{"cc":"'+ccVal+'"}';
		}
	}
	
	if (load['bcc'])
	{
		if (load['bcc'] != bccVal )
		{
			emaildata += '{"bcc":"'+bccVal+'"}';
		}
	}
	
	if (load['replyTo'])
	{
		if (load['replyTo'] != repVal )
		{
			emaildata += '{"replyTo":"'+repVal+'"}';
		}
	}
	
	if (load['channelId'])
	{
		if (load['channelId'] != chnlVal )
		{
			emaildata += '{"channelId":"'+chnlVal+'"}';
		}
	}
	
	if (load['bodyTemp'])
	{
		if (load['bodyTemp'] != bodyData)
		{
			//emaildata += '{"bodyTemp":"'+bodyData+'"}';
		}
	}
	
	if (load['subjTemp'])
	{
		if (load['subjTemp'] != subVal)
		{
			alert(load['subjTemp']+', '+subVal);
			emaildata += '{"subjTemp":"'+subVal+'"}';
		}
	}
	
	if (load['from'])
	{
		if (load['from'] != fromVal)
		{
			emaildata += '{"from":"'+fromVal+'"}';
		}
	}
	
	return emaildata;
}
//Function shows the complete details of the selected email tempelate.
function loadDetailedEmail(arg)
{
	window.lastCardState = $('.card').detach();
	var card = '<div class="card emailUsers"><div class="cardRow emailUsersTop"><button class = "emailUsersTabs backButton"><i class="fa fa-backward"></i>&nbsp;Back</button><h2 class="cardTitle">'+arg["name"]+'</h2></div><br /><br/><div class="emailDetailsTop"><div class="bodyTemp"><h5 class = "leftPane">Message:</h5><textarea name="message" id = "messageField" cols="30" wrap="virtual" rows="5"></textarea></div><Table class="emailNameTab2"><tr><td><h5 class = "leftPane">To:</h5></td><td><input id = "toField"><p></td></tr><tr><td><h5 class = "leftPane">cc:</h5></td><td><input id = "ccField"><p></td></tr><tr><td><h5 class = "leftPane">bcc:</b></td><td><input id = "bccField"><p></td></tr><td><h5 class = "leftPane">Reply to:</h5></td><td><input id = "replyTo"><p></td><tr><td><h5  class = "leftPane">Subject:</b></td><td><input id = "subject"><p></td></tr><tr><td><h5  class = "leftPane">From:</b></td><td><input id = "from"><p></td></tr><td><h5  class = "leftPane">Enabled:</b></td><td><input id = "checkBx1" type="checkbox" id="isEnabled"/><p></td></tr><tr><td><h5 class = "leftPane">Channel-Id:</h5></td><td><input id = "channel"><p></td></tr><tr></table><button class = "saveEmails UpdateEmail"  data-type="emailDataComp" data-userName ="'+arg["name"]+'" data-bodyTemplate ="'+arg["bodyTemp"]+'" data-subjectTemplate ="'+arg["subjTemp"]+'"data-from ="'+ arg["from"]+'" data-to ="'+arg["to"]+'" data-cc ="'+ arg["cc"]+'" data-bcc ="'+ arg["bcc"]+'" data-replyTo ="'+arg["replyTo"]+'" data-enabled ="'+ arg["enabled"]+'"  data-emailChannelId ="'+ arg["channelId"]+'"><i class="fa fa-upload"></i>&nbsp;Update</button><br /><br /></div></div>';
	$('.main').append(card);
	var userName = arg["name"];
	$( 'textarea#messageField' ).ckeditor();
	var userName = arg["name"];
	var bTemp = arg["bodyTemp"];
	var frm = arg["name"];
	var to = arg["to"];
	var cc = arg["cc"];
	var bcc = arg["bcc"];
	var subj = arg["subjTemp"];
	var frm = arg["from"];
	var replyTo = arg["replyTo"];
	var chnlId = arg['channelId'];
	var enabled = arg["enabled"];
	if (enabled == 'false')
	{
		$('#checkBx1').prop('checked', false);
	}
	else
	{
		$('#checkBx1').prop('checked', true);
	}
	document.getElementById("toField").value = to;
	document.getElementById('ccField').value = cc;
	document.getElementById('bccField').value = bcc;
	document.getElementById('replyTo').value = replyTo;
	document.getElementById('subject').value = subj;
	document.getElementById('from').value = frm;
	document.getElementById('channel').value = chnlId;
	$('#messageField').val(bTemp);
}
//Function gets the sms template data and show it.
function loadSmsData()
{
	var smsData = getSmsInfo();
	window.lastCardState = $('.card').detach();
	var card = '<div class="card emailUsers"><div class="cardRow emailUsersTop"><h2 class="cardTitle">Existing Sms Templates</h2><ul class="emailUsersTabs"><li><a href="#" class="tabEmail">Email</a></li><li><a href="#" class="tabSms current">SMS</a></li></ul></div><div class = "col-md emailContainer"><Table class = "smsNameTab"><tr><th>Name</th><th>Content</th><th>Channel Id</th><th>Actions</th></tr></table></div>';
	$('.main').append(card);
	if (smsData && smsData["responseCode"] && smsData["responseCode"] == 1000)
	{
		for (var ind in smsData["smsData"]) 
		{
			var tabRow ='<tr class = "callRow">';
			var smsName =  smsData["smsData"][ind]['name'];
			var smsBTemp = smsData["smsData"][ind]['bodyTemplate'];
			var smsChanId = smsData["smsData"][ind]['smsChannelId'];
			tabRow += '<td class="smsName">'+smsName+'</td><td><textarea  class="smsCont" placeholder="Your content here" readonly>'+smsBTemp+'</textarea></td><td><textarea id = "smsChnlInp" readonly>'+smsChanId+'</textarea></td><td class="actionForSms"><button class = "smsEdit"><i class="fa fa-pencil"></i>&nbsp;Edit</button>&nbsp; &nbsp;<button class = "smsSave" data-type = "smsDetails" data-smsContent = "'+smsData["smsData"][ind]['bodyTemplate']+'" data-smsChanId = "'+smsData["smsData"][ind]['smsChannelId']+'"><i class="fa fa-upload"></i>&nbsp;Update</button></td></tr>';
			$('.smsNameTab').append(tabRow);
		}
	}

}
//Function for loading orders for all users
function loadOrderData()
{
	$('.sessionsTop').detach();
	var orderTableData = getOrderData();
	window.lastCardState = $('.card').detach();
	var card = '<div class="card products"><div class="cardRow productsTop"><h2 class="cardTitle">Orders Received</h2></div><div class="cardRow productsMain"><div class="orderActions modal small"><div class="orderActionsInner inner"><a class="close" href="#">X</a><h3>Choose your action</h3><textarea class="orderActionComment" placeholder="Your comment here"></textarea><button class="orderActionCancel"><i class="fa fa-close"></i> Cancel</button><button class="orderActionAuthorize"><i class="fa fa-rupee"></i> Authorize</button><button class="orderActionFulfill"><i class="fa fa-check"></i> Fulfilled</button></div></div></div></div>';
	$('.main').append(card);
	var orderTable = '<table class="productsList" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th>Order Placed</th><th>Username</th><th>Phone</th><th>Order Updated</th><th>Order Code</th><th>Product</th><th>Quantity</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody></tbody></table>';
	$('.productsMain').append(orderTable);
	if(orderTableData && orderTableData["responseCode"] && orderTableData["responseCode"] == 1000)
	{
		for (var ind in orderTableData["productItemRequestSROs"])
		{
			var tableRow = '<tr>';
			var datPlaced = moment(orderTableData["productItemRequestSROs"][ind]["orderPlacedAt"],"MMM DD, YYYY hh:mm:ss a");
			var datUpdated = moment(orderTableData["productItemRequestSROs"][ind]["orderUpdatedAt"],"MMM DD, YYYY hh:mm:ss a");
			var datPlacedStr = datPlaced.format("DD-MM-YY | h:mm a");
			var datUpdatedStr = datUpdated.format("DD-MM-YY | h:mm a");
			tableRow += '<td>'+datPlacedStr+'</td>';
			tableRow += '<td><a href="#" class="clickable" data-type="userNameLink" data-useremail="'+orderTableData["productItemRequestSROs"][ind]["userEmail"]+'">'+orderTableData["productItemRequestSROs"][ind]["userName"]+'</a></td>';
			tableRow += '<td>'+orderTableData["productItemRequestSROs"][ind]["userMobile"]+'</td>';
			tableRow += '<td>'+datUpdatedStr+'</td>';
			tableRow += '<td>'+orderTableData["productItemRequestSROs"][ind]["orderCode"]+'</td>';
			tableRow += '<td>'+orderTableData["productItemRequestSROs"][ind]["productName"]+'</td>';
			tableRow += '<td>'+orderTableData["productItemRequestSROs"][ind]["quantity"]+'</td>';
			tableRow += '<td>'+orderTableData["productItemRequestSROs"][ind]["amount"]+'</td>';
			tableRow += '<td>'+orderTableData["productItemRequestSROs"][ind]["status"]+'</td>';
			tableRow += '<td><button class="orderCta" data-code="'+orderTableData["productItemRequestSROs"][ind]["orderCode"]+'" data-subcode="'+orderTableData["productItemRequestSROs"][ind]["suborderCode"]+'" data-useremail="'+orderTableData["productItemRequestSROs"][ind]["userEmail"]+'">Update</button></td>';
			tableRow += '</tr>';
			$('.productsList tbody').append(tableRow);
		}
	}
}
function paginate(arg)
{
	if(arg && arg["parentDiv"])
	{
		var pDiv = $(arg["parentDiv"]);
	}
	if(arg && arg["count"])
	{
		pDiv.find('.pageResultCount').val(arg["count"]);
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
			if((arg["data"]["totalCount"] % 30) > 0)
			{
				pages++;
			}
		}
		var currentPage = (arg["start"]/arg["count"]) + 1;
		pDiv.find('.which').text(currentPage);
		pDiv.find('.totalCount').text(pages);
	}
	try {
		window.paymentPagination = {"start":arg["start"],"current":currentPage,"count":arg["count"],"pages":pages};
	}
	catch(e)
	{
		console.log(e);
	}
	if(arg["data"] && window.paymentPagination)
	{
		if(arg["start"] == 0)
		{
			pDiv.find('.numberNavLink.first, .numberNavLink.previous').hide();
		}
		if(currentPage == window.paymentPagination["pages"])
		{
			pDiv.find('.numberNavLink.last, .numberNavLink.next').hide();
		}
	}
}
//Function for loading payment data for all users
function loadPaymentData(arg)
{
	$('.sessionsTop').detach();
	var paymentTableData = getPaymentData(arg);
	window.lastCardState = $('.card').detach();
	var card = '<div class="card payments"><div class="cardRow paymentsTop"><div class="leftHuddle"><h2 class="cardTitle">Payment Status</h2><p class="resultLabel">Results per page</p><input type="text" value="30" class="pageResultCount"><button class="pageCountCta"><i class="fa fa-refresh"></i></button></div><div class="rightHuddle"><div class="numberNav"><a href="#" class="numberNavLink first"><i class="fa fa-angle-double-left"></i></a><a href="#" class="numberNavLink previous"><i class="fa fa-angle-left"></i></a></div><p class="status">Showing <span class="which">1</span> of <span class="totalCount">1</span></p><div class="numberNav"><a href="#" class="numberNavLink next"><i class="fa fa-angle-right"></i></a><a href="#" class="numberNavLink last"><i class="fa fa-angle-double-right"></i></a></div><input type="text" placeholder="Page" class="paginationInput"><button class="pageNavCta">Go</button></div></div><div class="cardRow paymentsMain"><div class="invoiceConfirmation"><div class="invoiceConfirmationInner"><a class="close">X</a><h3>Confirm action</h3><p>What kind of user do you want to send the invoice to?</p><p class="message"></p><input type="text" placeholder="Promo Code" class="invoiceConfirmationCode"><button class="returning">Returning User</button><button class="newuser">New User</button></div></div></div></div>';
	$('.main').append(card);
	paginate({"start":arg["start"],"count":arg["count"],"data":paymentTableData,"parentDiv":$('.paymentsTop')});
	var paymentTable = '<table class="paymentsList sortable" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th data-tsorter="link">User name</th><th data-tsorter="link">Coach name</th><th>Credits</th><th>Last Recharged</th><th>Sessions Left</th><th>Session Price</th><th>Action</th></tr></thead><tbody></tbody></table>';
	$('.paymentsMain').append(paymentTable);
	if(paymentTableData && paymentTableData["responseCode"] && paymentTableData["responseCode"] == 1000)
	{
		for (var ind in paymentTableData["paymentUserStatusSRO"])
		{
			var tableRow = '<tr>';
			tableRow +=  '<td><a href="#" class="clickable" data-type="userNameLink" data-useremail="'+paymentTableData["paymentUserStatusSRO"][ind]["userEmail"]+'">'+paymentTableData["paymentUserStatusSRO"][ind]["userName"]+'</a></td>';
			tableRow += '<td><a href="#" class="clickable" data-type="coachNameLink" data-coachemail="'+paymentTableData["paymentUserStatusSRO"][ind]["coachEmail"]+'">'+paymentTableData["paymentUserStatusSRO"][ind]["coachName"]+'</a></td>'
			tableRow += '<td>'+paymentTableData["paymentUserStatusSRO"][ind]["credits"]+'</td>';
			tableRow += '<td>'+paymentTableData["paymentUserStatusSRO"][ind]["lastRecharged"]+'</td>';
			tableRow += '<td>'+paymentTableData["paymentUserStatusSRO"][ind]["sessionLeft"]+'</td>';
			tableRow += '<td>'+paymentTableData["paymentUserStatusSRO"][ind]["sessionPrice"]+'</td>';
			tableRow += '<td><button class="invoiceCta" data-email="'+paymentTableData["paymentUserStatusSRO"][ind]["userEmail"]+'">Send Invoice <i class="fa fa-envelope"></i></button></td>';
			tableRow += '</tr>';
			$('.paymentsList tbody').append(tableRow);
		}
	}
	sortInitPayment();
}
//Function to create the date list from the alreadySessions array
function makeDateList(obj)
{
	window.datelistobj = {};
	datereturn = '';
	try{
	var listArray = obj['alreadySessions'].split(',');
	i = 0;
	for(var s in listArray)
	{
		var param = listArray[s].split('::');
		for (var m in param)
		{
			window.datelistobj[i] = {};
			if(param[m] == '')
			{
				datestring = ''; timestring = '';
			}
			else if(param[m].indexOf('-') < 6 && param[m].length == 10)
			{
				datestring = param[m];
			}
			else if(param[m].indexOf('AM') > 0 || param[m].indexOf('PM') >0)
			{
				timestring = param[m];
			}
			else if(param[m].indexOf("-") > 0 && param[m].length > 10)
			{
				codestring = param[m];
			}
			else
			{
				var totalstring = {"date":datestring, "time":timestring, "code":codestring, "status":param[m]};
				$.extend(window.datelistobj[i],totalstring);
				if(datereturn !== '')
				{
					datereturn += ',';
				}
				datereturn += datestring;
			}
		}
		i++;
	}
	return datereturn;
	}
	catch(er){
		return '';
	}
}
//Function to create the list of sessions which already have data input done
function makeDoneList(obj)
{
	donereturn = '';
	try {
	var doneArray = obj['alreadySessions'].split(',');
	i = 0;
	for(var l in doneArray)
	{
		var param = doneArray[l].split('::');
		for (var m in param)
		{
			if(param[m] === '')
			{
				var datestr = ''; var timestr = ''; var codestr = '';
			}
			else if(param[m].indexOf('-') < 6 && param[m].length === 10)
			{
				datestr = param[m];
			}
			else if(param[m].indexOf('AM') > 0 || param[m].indexOf('PM') > 0 || param[m].indexOf('pm') > 0 || param[m].indexOf('am') > 0)
			{
				timestr = param[m];
			}
			else if(param[m].indexOf("-") > 0 && param[m].length > 10)
			{
				codestr = param[m];
			}
			else
			{
				if(param[m] === "DNE")
				{
					if(donereturn !== '')
					{
						donereturn += ',';
					}
					donereturn += datestr;
				}
			}
		}
	}
	}
	catch(e)
	{
	}
	return donereturn;
}
var userinfotemp1,userinfotemp2;
//Function to create the table cells for userInfo
function userInfoCells(value,key)
{
	if(key === 'allSessionGroupDetails' || key === 'sessionGroupDetails')
	{
		return '';
	}
	if(key == 'isPause')
	{
		window.isPaused = value;
		if(value == false)
		{
			return '<tr><td>isPause</td><td>False<button class="pauseCta">Pause Sessions</button></td></tr>';
		}
		else
		{
			return '<tr><td>isPause</td><td>True<button class="pauseCta">Resume Sessions</button></td></tr>';
		}
	}
	if(key == 'isTrial')
	{
		window.isTrial = value;
		if(value == false)
		{
			return '<tr><td>isTrial</td><td>False</td></tr>';
		}
		else
		{
			return '<tr><td>isTrial</td><td>True<button class="activateTrialCta">Convert to paid</button></td></tr>';
		}
	}
	if(key == 'latitude')
	{
		userinfotemp1 = value;
		return '';
	}
	if(key == 'longitude')
	{
		userinfotemp2 = value;
		return '<tr><td>location</td><td>Lat: '+userinfotemp1+', Long: '+userinfotemp2+' - <a href="#" class="userInfoMapLink" data-lat="'+userinfotemp1+'" data-long="'+userinfotemp2+'"><i class="fa fa-map-marker fa-lg prim"></i></a></td></tr>';
	}
	// start to create the return string
	var returnstr = '<tr>';
	returnstr += '<td>'+key+'</td><td>'+value+'</td></tr>';
	return returnstr;
}
//Function for loading the initial view of the user campaign leads page
function loadUserLeadsInitial(arg)
{
	$('.sessionsTop').detach();
	window.lastCardState = $('.card').detach();
	var card = '<div class="card leads"><div class="userHistoryModal modal wide modalWrap"><div class="userHistoryInner inner"><a class="close" href="#">X</a><h3 class="userHistoryTitle">Username</h3><p class="userNameField"><span class="label">Name:</span><span class="value"></span></p><p class="userMobileField"><span class="label">Mobile:</span><span class="value"></span></p><p class="userEmail"><span class="label">Email:</span><span class="value"></span></p><p class="userSource"><span class="label">Source:</span><span class="value"></span></p><p class="userStatus"><span class="label">Status:</span><span class="value"></span></p><h4>Notes</h4><div class="notesWrap"></div></div></div><div class="userCommentModal small modal modalWrap"><div class="userCommentInner inner"><a class="close" href="#">X</a><h3 class="userCommentTitle">Add a note for user</h3><p class="userNameField"><span class="label">Name:</span><span class="value"></span></p><p class="userMobileField"><span class="label">Mobile:</span><span class="value"></span></p><p class="userSource"><span class="label">Source:</span><span class="value"></span></p><form class="userCommentForm"><textarea class="userStatusComment" placeholder="Your Comment"></textarea><button class="userCommentCta">Submit</button></form></div></div><div class="userStatusModal modal small modalWrap"><div class="userStatusInner inner"><a class="close" href="#">X</a><h3 class="userStatusTitle">Update user status</h3><p class="userNameField"><span class="label">Name:</span><span class="value"></span></p><p class="userMobileField"><span class="label">Mobile:</span><span class="value"></span></p><p class="userSource"><span class="label">Source:</span><span class="value"></span></p><form class="userStatusForm"><input type="radio" name="userStatusType" id="userStatusTypeCallback" data-type="CLBK"><label for="userStatusTypeCallback">Call Back</label><br><br><input type="radio" name="userStatusType" id="userStatusTypeDemo" data-type="DEMS"><label for="userStatusTypeDemo">Demo Scheduled</label><br><br><input type="radio" name="userStatusType" id="userStatusTypeDemoEnd" data-type="DEME"><label for="userStatusTypeDemoEnd">Demo Ended</label><br><br><input type="radio" name="userStatusType" id="userStatusTypeConverted" data-type="USER"><label for="userStatusTypeConverted">User Converted</label><br><br><input type="radio" name="userStatusType" id="userStatusTypeDropped" data-type="DROP"><label for="userStatusTypeDropped">User Dropped</label><br><br><button class="userStatusCta">Submit</button></form></div></div><div class="cardRow leadsTop"><div class="leftHuddle"><h2 class="cardTitle">User Leads</h2><select class="campaignChoice"></select></div><div class="searchLeads"><form class="searchLeadsOptions"><input type="hidden" placeholder="Campaign Code" class="searchLeadsCampaign"><input type="text" placeholder="Start Date" class="searchLeadsStart"><input type="text" placeholder="End Date" class="searchLeadsEnd"><input type="range" value="15" class="searchLeadsCountRange"><input type="text" value="25" class="searchLeadsCountValue"><select class="searchLeadsType"><option selected disabled data-type="null">User Type</option><option data-type="LEAD">Lead</option><option data-type="CLBK">Callback</option><option data-type="DEMS">Demo Scheduled</option><option data-type="DEME">Demo Done</option><option data-type="USER">Converted</option><option data-type="DROP">Dropped</option><option data-type="TBCD">To be called</option></select><button class="searchLeadsCta"><i class="fa fa-refresh"></i></button></form></div></div><div class="cardRow leadsMain"><table class="leadsList" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th data-tsorter="link"><div class="inner">Name</div></th><th><div class="inner">Mobile</div></th><th><div class="inner"><a href="#" class="toggle"><i class="fa fa-minus-circle"></i></a> Email</div></th><!--<th><div class="inner"><a href="#" class="toggle"><i class="fa fa-minus-circle"></i></a> Source</div></th>--><th><div class="inner"><a href="#" class="toggle"><i class="fa fa-minus-circle"></i></a> Source<!-- <i class="fa fa-chevron-down"></i>--></div></th><th><div class="inner">Status<!-- <i class="fa fa-chevron-down"></i>--></div></th><th><div class="inner">Callback Time</div></th><th><div class="inner">Notes</div></th><!--<th>Action</th>--></tr></thead><tbody></tbody></table></div></div>';
	$new = $('.main').append(card);
	$new.find('.leads .searchLeadsCountRange').val(17);
	$new.find('.leads .searchLeadsCountValue').val(500);
	$new.find('.leads .searchLeadsEnd').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$new.find('.leads .searchLeadsEnd').datetimepicker('hide');
		}
	});
	$new.find('.leads .searchLeadsStart').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$new.find('.leads .searchLeadsStart').datetimepicker('hide');
		}
	});
	if(arg)
	{
		if(arg["list"])
		{
			var optlist = "";
			for (var mm in arg["list"])
			{
				if(arg["list"][mm] == "demosessionfb")
				{
					optlist += '<option selected="selected">'
				}
				else
				{
					optlist += '<option>';
				}
				optlist += arg["list"][mm];
				optlist += '</option>';
			}
			$('.leads .campaignChoice option').detach();
			$('.leads .campaignChoice').append(optlist);
		}
		else
		{
			$('.searchLeads .campaignChoice').detach();
		}
		$('.searchLeads .searchLeadsCampaign').val(arg["code"]);
		$('.searchLeads .searchLeadsStart').val(arg["startDate"]);
		$('.searchLeads .searchLeadsEnd').val(arg["endDate"]);
		$('.searchLeads .searchLeadsCta').click();
	}
}
function loadUserStatusChangeModal(arg)
{
	var par = window.chosenLead.parents('tr');
	var uid = par.attr("data-id");
	if(!$('.leadsMain .userStatusChangeModal').length)
	{
		var userStatusChangeModal = '<div class="modal userStatusChangeModal small"><div class="inner"><a href="#" class="close">X</a></div>"</div>';
		$('.leadsMain').prepend(userStatusChangeModal);
		switchChoice();
	}
	else
	{
		switchChoice();
	}
	function switchChoice() {
		switch (arg["code"]) {
			case 'LEAD':
				showModalMessage({"message":"\'Lead\' is the default state for all user leads. You cannot change any other state to \'Lead\'"});
			break;
			case 'CLBK':
				$('.leadsMain .userStatusChangeModal').fadeIn(100).css("display","flex");
				$('.userStatusChangeModal .innerContainer').detach();
				var innerForm = '<div class="innerContainer callback"><h3 class="userStatusTitle">Callback</h3><form class="statusChangeForm"><input class="callBackWhen" type="hidden" placeholder="Date & Time"><input class="callBackCalendar" type="text" placeholder="Date & Time"><div class="ladyCoach"><input type="checkbox" id="needsLadyCoach"><label for="needsLadyCoach">User wants lady coach</label></div><div class="ladyCoach"><input type="checkbox" id="needsYogaCoach"><label for="needsYogaCoach">User wants yoga coach</label></div><div class="ladyCoach"><input type="checkbox" id="wrongNumber"><label for="wrongNumber">Wrong number</label></div><div class="unresponsive"><input type="checkbox" id="unresponsiveUser"><label for="unresponsiveUser">User did not pick up call</label></div><div class="sendSMS disabled"><input checked type="checkbox" id="notifySMS"><label for="notifySMS">Notify user through SMS</label></div><textarea placeholder="Notes"></textarea><button class="statusChangeCta">Submit</button></form></div>';
				$('.leadsMain .userStatusChangeModal .inner').append(innerForm);
				$('.leadsMain .userStatusChangeModal .inner').find('.callBackCalendar').datetimepicker({
					format: 'd-m-Y H:i',
					inline:true,
					step: 15,
					onGenerate: function(currentTime, $input)
					{
						$('.leadsMain .userStatusChangeModal .inner').find('.callBackWhen').val(currentTime.dateFormat('d-m-Y H:i'))
					},
					onChangeDateTime: function(currentTime, $input)
					{
						$('.leadsMain .userStatusChangeModal .inner').find('.callBackWhen').val(currentTime)
					}
				});
				$('.leadsMain .userStatusChangeModal .inner').find('.callBackWhen').change(function() {
					$('.leadsMain .userStatusChangeModal .inner').find('.callBackCalendar').datetimepicker({
						value: $(this).val()
					});
				});
			break;
			case 'DEMS':
				var par = window.chosenLead.parents('tr');
				var checkUser = getPostDatabyEmail({"userEmail":par.attr("data-email")});
				if(checkUser && checkUser["responseCode"] == 1000)
				{
					if(checkUser["sessionGroupDetailedSRO"] && checkUser["sessionGroupDetailedSRO"]["isTrial"]==false)
					{
						showModalMessage({"message":"User already exists and has session group"});
						return false;
					}
				}
				else
				{
					var addState = addNewUser({"name":par.attr("data-name"),"email":par.attr("data-email"),"mobile":par.attr("data-phone")});
					if(!addState || !addState["responseCode"] || !addState["responseCode"] == 1000)
					{
						showModalMessage({"message":"User could not be added."});
						return false;
					}
				}
				$.getScript(window.locationpickerurl, function() {
					window.addedUserEmail = par.attr("data-email");
					window.addedUserName = par.attr("data-name");
					createLeadDemo({"elem":$('.statusChangeForm')});
					campaignPostStatus(uid,null,"DEMS");
				});
			break;
			case 'DEMC':
				$('.leadsMain .userStatusChangeModal').fadeIn(100).css("display","flex");
				$('.userStatusChangeModal .innerContainer').detach();
				var innerForm = '<div class="innerContainer democanceled"><h3 class="userStatusTitle">Demo Canceled</h3><form class="statusChangeForm"><div class="inputRow informedCancel"><input id="informed" type="radio" name="cancelationType"><label for="informed">Cancelation was informed in advance</label> <i class="fa fa-minus-circle"></i>'+ getInformedCauses() +'</div><div class="inputRow suddenCancel"><input id="sudden" type="radio" name="cancelationType"><label for="sudden">Unexpected Cancelation</label> <i class="fa fa-minus-circle"></i>'+ getSuddenCauses() +'</div><textarea placeholder="Comments"></textarea><button class="statusChangeCta">Submit</button></form></div>';
				$('.leadsMain .userStatusChangeModal .inner').append(innerForm);
			break;
			case 'DEME':
				$('.leadsMain .userStatusChangeModal').fadeIn(100).css("display","flex");
				$('.userStatusChangeModal .innerContainer').detach();
				var innerForm = '<div class="innerContainer demofinished"><h3 class="userStatusTitle">Demo Finished</h3><form class="statusChangeForm"><textarea placeholder="Notes"></textarea><button class="statusChangeCta">Submit</button></form></div>';
				$('.leadsMain .userStatusChangeModal .inner').append(innerForm);
			break;
			case 'DROP':
				$('.leadsMain .userStatusChangeModal').fadeIn(100).css("display","flex");
				$('.userStatusChangeModal .innerContainer').detach();
				var innerForm = '<div class="innerContainer dropped"><h3 class="userStatusTitle">User not interested</h3><form class="statusChangeForm"><div class="inputRow altPrices"><input type="checkbox" id="affordability"><label for="affordability">Not within user\'s budget</label> <i class="fa fa-minus-circle"></i><p>User\'s expected price range is: </p>'+ getPrices() +'</div><div class="inputRow ladyCoachWrap"><input class="ladyCoach" type="checkbox" id="ladyCoachCheck"><label for="ladyCoachCheck">Lady Coach Needed</label></div><div class="inputRow altCities"><input type="checkbox" id="otherCity"><label for="otherCity">Different City</label> <i class="fa fa-minus-circle"></i><br>'+ getCities() +'</div><div class="inputRow altServices"><input type="checkbox" id="otherService"><label for="otherService">Different service expected</label> <i class="fa fa-minus-circle"></i>'+ getServices() +'</div><textarea placeholder="Any other reason"></textarea><button class="statusChangeCta">Submit</button></form></div>';
				$('.leadsMain .userStatusChangeModal .inner').append(innerForm);
			break;
			case 'USER':
				var par = window.chosenLead.parents('tr');
				$.getScript(window.locationpickerurl, function(){
					var checkSessGrp = getPostDatabyEmail({"userEmail":par.attr("data-email")});
					if(checkSessGrp && checkSessGrp["responseCode"] && checkSessGrp["responseCode"] == 1000)
					{
						if(checkSessGrp["sessionGroupDetailedSRO"]["isTrial"]==false)
						{
							showModalMessage({"message":"User already has a sessiongroup."})
							return false;
						}
						window.addedUserName = par.attr("data-name");
						window.addedUserEmail = par.attr("data-email");
						leadSessionGroup({"mode":"USER"});
					}
					else
					{
						var addState = addNewUser({"name":par.attr("data-name"),"email":par.attr("data-email"),"mobile":par.attr("data-phone")});
						if(!addState || !addState["responseCode"] || !addState["responseCode"] == 1000)
						{
							window.addedUserName = par.attr("data-name");
							window.addedUserEmail = par.attr("data-email");
							leadSessionGroup({"mode":"USER"});
						}
					}
				});
			break;
		};
		$('.leadsMain .userStatusDropDown').slideToggle(150);
	}
}
function getInformedCauses()
{
	var retStr = '';
	for (var cnt in informedCauses)
	{
		retStr += '<div class="subRow informedRow">';
		retStr += '<input type="radio" name="informedSelect" class="informedSelect" id="informed'+informedCauses[cnt].replace(/\s+/g, '')+'"> <label for="informed'+informedCauses[cnt].replace(/\s+/g, '')+'">'+informedCauses[cnt]+'</label>';
		retStr += '</div>';
	}
	return retStr;
}
function getSuddenCauses()
{
	var retStr = '';
	for (var cnt in suddenCauses)
	{
		retStr += '<div class="subRow suddenRow">';
		retStr += '<input type="radio" name="suddenSelect" class="suddenSelect" id="sudden'+suddenCauses[cnt].replace(/\s+/g, '')+'"> <label for="sudden'+suddenCauses[cnt].replace(/\s+/g, '')+'">'+suddenCauses[cnt]+'</label>';
		retStr += '</div>';
	}
	return retStr;
}
function getCities()
{
	var retStr = '';
	for (var cnt in altCities)
	{
		retStr += '<div class="subRow cityRow">';
		retStr += '<input type="radio" name="citySelect" class="citySelect" id="city'+altCities[cnt].replace(/\s+/g, '')+'"> <label for="city'+altCities[cnt].replace(/\s+/g, '')+'">'+altCities[cnt]+'</label>';
		retStr += '</div>';
	}
	return retStr;
}
function getServices()
{
	var retStr = '';
	for (var cnt in altServices)
	{
		retStr += '<div class="subRow serviceRow">';
		retStr += '<input type="radio" name="serviceSelect" class="serviceSelect" id="service'+altServices[cnt].replace(/\s+/g, '')+'"> <label for="service'+altServices[cnt].replace(/\s+/g, '')+'">'+altServices[cnt]+'</label>';
		retStr += '</div>';
	}
	return retStr;
}
function getPrices()
{
	var retStr = '';
	for (var cnt in altPrices)
	{
		retStr += '<div class="subRow priceRow">';
		retStr += '<input type="radio" name="priceSelect" class="priceSelect" id="price'+altPrices[cnt].replace(/\s+/g, '')+'"> <label for="price'+altPrices[cnt].replace(/\s+/g, '')+'">'+altPrices[cnt]+'</label>';
		retStr += '</div>';
	}
	return retStr;
}
function createLeadDemo(arg)
{
	leadSessionGroup({"mode":"DEMS"});
}
window.newLeadAdd = [];
function leadSessionGroup(arg)
{
	$('.addUserGroupModal').detach();
	var newSessGrpModal = '<div class="addUserGroupModal modal xxlwide" data-mode="'+ arg["mode"] +'"> <div class="addUserGroupModalInner inner"><a class="close" href="#">X</a> <h3>Add session group for <span class="titleUserName">Shubhanshu Srivastava</span></h3> <div class="layout"> <div class="mapsCol"> <div class="addressWrap"> <input type="text" class="mapInput address" placeholder="Location"> </div><div class="mapWrap"></div><div class="radiusWrap">Radius(meters) : <input type="text" class="mapInput radius" placeholder="200"> </div><div class="co-ords"><span class="label">Latitude:</span> <input type="text" placeholder="23.23423423" class="addUserGroupInput latitude"><span class="label">Longitude:</span> <input type="text" placeholder="23.23423423" class="addUserGroupInput longitude"> </div></div><div class="dataCol"> <form class="newSessionGroupForm"> <div class="formRow"><span class="label">Preferred Days:</span> <select class="addUserGroupInput days"> <option data-slot="xxx">Misc</option> <option selected="selected" data-slot="MON">Mon Wed Fri</option> <option data-slot="WKS">Weekdays + Sat</option> <option data-slot="WKK">Weekdays</option> <option data-slot="MWS">Mon Wed Sat</option> <option data-slot="TUE">Tue Thu Sat</option> <option data-slot="TTS">Tue Thu Sun</option> <option data-slot="TSS">Tue Thu Sat Sun</option> <option data-slot="TTH">Tue Thu</option> <option data-slot="WKN">Weekends</option> </select> </div><div class="formRow"><span class="label">Timeslot:</span> <select class="addUserGroupInput hours"> <option>01</option> <option>02</option> <option>03</option> <option>04</option> <option>05</option> <option selected>06</option> <option>07</option> <option>08</option> <option>09</option> <option>10</option> <option>11</option> <option>12</option> </select> <select class="addUserGroupInput minutes"> <option>00</option> <option>15</option> <option selected>30</option> <option>45</option> </select> <select class="addUserGroupInput ampm"> <option>AM</option> <option>PM</option> </select> </div><div class="formRow"><span class="label">Date:</span> <input type="text" placeholder="YYYY-MM-DD" class="addUserGroupInput date"> </div><div class="formRow"><span class="label">Service Type:</span> <select class="addUserGroupInput typeService"> <option data-val="wtls">Weight Loss</option> <option data-val="wtgn">Weight Gain</option> <option data-val="msbl">Muscle Building</option> <option data-val="injr">Injury Management</option> <option data-val="yoga">Yoga</option> <option data-val="mrtn">Marathon Training</option> </select> </div><div class="formRow"><span class="label">Address:</span> <textarea class="addUserGroupInput userAddress"> </textarea> </div><div class="formRow"><span class="label">User OS:</span> <select class="addUserGroupInput platform"> <option data-val="AND">Android</option> <option data-val="NAND">Not Android</option> </select> </div><input type="hidden" class="addUserGroupInput sessionGroupCode"> <input type="hidden" class="addUserGroupInput coachCode"> <input type="hidden" class="addUserGroupInput latitude"> <input type="hidden" class="addUserGroupInput longitude"> <div class="formRow"><span class="label">Demo User?</span> <input type="checkbox" class="addUserGroupInput type" id="trialCheck"> <label for="trialCheck">Yes</label> </div><div class="formRow"><span class="label"><button class="fetchCoach">Find a Coach <i class="fa fa-search"></i></button></span> <div class="fetchedCoachResult"> <div class="resultItem"><span class="coachName">Nisar Khan</span><span class="userCount">21</span> users</div></div></div><div class="formRow"><span class="label">Or</span> <input type="text" class="addUserGroupInput cCode autoSuggest" placeholder="Enter coach name manually"> </div><button class="createCta">Create Sessions <i class="fa fa-angle-double-right"></i></button> </form> </div></div></div></div>';
	$('.leadsMain').append(newSessGrpModal);
	window.clickedCoachResult = null;
	$('.addUserGroupModal').find('.addUserGroupModalInner').each(function(){
		$(this).find('.addUserGroupInput.date').val('');
		if(arg && arg["mode"] == "DEMS")
		{
			$(this).find('.addUserGroupInput.type').prop('checked', true);
		}
		else
		{
			$(this).find('.addUserGroupInput.type').prop('checked', false);
		}
	});
	$('.mapWrap').locationpicker({
        location: {latitude: 12.97262, longitude: 77.64009},
        radius: 50,
        inputBinding: {
            latitudeInput: $('.addUserGroupInput.latitude'),
            longitudeInput: $('.addUserGroupInput.longitude'),
            radiusInput: $('.mapInput.radius'),
            locationNameInput: $('.mapInput.address')
        },
        enableAutocomplete: true
    });
	$('.newSessionGroupForm .addUserGroupInput.date').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.newSessionGroupForm .addUserGroupInput.date').datetimepicker('hide');
		}
	});
	$('.addUserGroupModal h3 .titleUserName').text(window.addedUserName);
	$('.addUserGroupModal').fadeIn(150).css("display","flex");
}
function loadUserStatusDropDown(arg)
{
	if(!$('.leadsMain .userStatusDropDown').length)
	{
		var menu = '<div class="userStatusDropDown"><ul class="statusDropDownMenu"><li class="choice" data-type="LEAD">Lead <i class="fa fa-check"></i></li><li class="choice" data-type="CLBK">Callback <i class="fa fa-check"></i></li><li class="choice" data-type="DEMS">Demo Scheduled <i class="fa fa-check"></i></li><li class="choice" data-type="DEME">Demo Finished <i class="fa fa-check"></i></li><li class="choice" data-type="DEMC">Demo Cancelled <i class="fa fa-check"></i></li><li class="choice" data-type="USER">Converted <i class="fa fa-check"></i></li><li class="choice" data-type="DROP">Not Interested <i class="fa fa-check"></i></li></ul></div>';
		$('.leadsMain').prepend(menu);
		if(arg && arg["elem"])
		{
			var lft = arg["elem"].offset().left + "px";
			var tp = parseFloat(arg["elem"].offset().top + 42) + "px";
			var thisType = $(arg["elem"]).parents('tr').attr("data-type");
			var thisTypeCode = getType(thisType);
			$('.leadsMain .userStatusDropDown').find('li').removeClass('active');
			$('.leadsMain .userStatusDropDown').find('li[data-type="'+ thisTypeCode +'"]').addClass('active');
			$('.leadsMain .userStatusDropDown').css({"left":lft,"top":tp});
		}
		$('.leadsMain .userStatusDropDown').slideToggle(100);
	}
	else
	{
		if(arg && arg["elem"])
		{
			var lft = arg["elem"].offset().left + "px";
			var tp = parseFloat(arg["elem"].offset().top + 42) + "px";
			var thisType = $(arg["elem"]).parents('tr').attr("data-type");
			var thisTypeCode = getType(thisType);
			$('.leadsMain .userStatusDropDown').find('li').removeClass('active');
			$('.leadsMain .userStatusDropDown').find('li[data-type="'+ thisTypeCode +'"]').addClass('active');
			$('.leadsMain .userStatusDropDown').css({"left":lft,"top":tp});
		}
		$('.leadsMain .userStatusDropDown').slideToggle(100);
	}
}
function loadCampaignUserTable(arg)
{
	var campaignUserTableData = getUserLeads(arg);
	window.campaignUserData = {};
	$('.leadsList tbody').find('tr').detach();
	if(campaignUserTableData && campaignUserTableData["subscribers"])
	{
		for (var indx in campaignUserTableData["subscribers"])
		{
			var id = campaignUserTableData["subscribers"][indx]["identificationCode"];
			var usrobj = {};
			usrobj[id] = campaignUserTableData["subscribers"][indx];
			$.extend(window.campaignUserData,usrobj);
			var clEmail = campaignUserTableData["subscribers"][indx]["email"] ? campaignUserTableData["subscribers"][indx]["email"] : "";
			var clName = campaignUserTableData["subscribers"][indx]["name"] ? campaignUserTableData["subscribers"][indx]["name"] : "User";
			var tableRow = '<tr data-email="'+clEmail+'" data-name="'+clName+'" data-phone="'+campaignUserTableData["subscribers"][indx]["mobile"]+'" data-source="'+campaignUserTableData["subscribers"][indx]["source"]+'" data-campaign="'+campaignUserTableData["subscribers"][indx]["campaign"]+'" data-id="'+campaignUserTableData["subscribers"][indx]["identificationCode"]+'" data-type="'+getType(campaignUserTableData["subscribers"][indx]["userStatus"])+'">';
			tableRow += '<td><a class="clickable leadUserLink" data-type="leadUser">'+clName+'</a> ' + ifSpecial(campaignUserTableData["subscribers"][indx]) + '</td>';
			tableRow += '<td>'+campaignUserTableData["subscribers"][indx]["mobile"]+'</td>';
			tableRow += '<td><div class="inner">'+clEmail+'</div></td>';
			//tableRow += '<td><div class="inner">'+campaignUserTableData["subscribers"][indx]["source"]+'</div></td>';
			tableRow += '<td><div class="inner">'+campaignUserTableData["subscribers"][indx]["source"] + "-" + campaignUserTableData["subscribers"][indx]["campaign"]+'</div></td>';
			tableRow += '<td><div class="userStatusSelect">'+getType(campaignUserTableData["subscribers"][indx]["userStatus"])+'</div></td>';
			if(campaignUserTableData["subscribers"][indx]["callbackTime"] && campaignUserTableData["subscribers"][indx]["callbackTime"].length > 0){
				tableRow += '<td><span class="callbackIndicator"><span class="time">'+moment(campaignUserTableData["subscribers"][indx]["callbackTime"],"YYYY-MM-DD hh:mm").format("h:mm a, MMM Do")+'</span></span></td>';
			}
			else{
				tableRow += '<td style="text-align:center">-</td>';
			}
			tableRow += '<td><button class="leadsCommentCta"><i class="fa fa-plus"></i>&nbsp;&nbsp;&nbsp;Note</button></td>';
			//tableRow += '<td><button class="leadsUserCta">Change to <i class="fa fa-angle-right"></i></button></td>';
			tableRow += '</tr>';
			$('.leadsList tbody').append(tableRow);
		}
	}
	//init2();
}
function ifSpecial(obj)
{
	data = obj["subscriberTrackerDTOs"];
	if(data.length)
	{
		var possibles = [];
		for (var ind in data)
		{
			var ts = moment(data[ind]["created"],"MMM DD, YYYY h:mm:ss a").format("X");
			try{
				var commObj = JSON.parse(decodeURIComponent(data[ind]["comment"]));
				if(commObj["type"] == "CLBK")
				{
					possibles.push({"ts":ts,"type":"CLBK","obj":commObj});
				}
			}
			catch(e)
			{
			}
		}
		possibles.sort(function(a,b) { return b["ts"] - a["ts"] });
	}
	if(possibles && possibles.length)
	{
		var hp = 0;
		if(possibles[hp]["type"] != obj["userStatus"])
		{
			var highestPossible = possibles[hp];
		}
		else
		{
			hp++;
		}
		for (var hp = 0; hp < possibles.length; possibles++)
		{
			if(possibles[hp]["type"] == obj["userStatus"])
			{
				var highestPossible = possibles[hp];
				break;
			}
			if(hp == possibles.length - 1)
			{
				var highestPossible = possibles[0];
			}
		}
		switch(highestPossible["type"])
		{
			case "CLBK":
				if(highestPossible["obj"]["content"]["ladyCoach"])
				{
					if(highestPossible["obj"]["content"]["yogaCoach"])
					{
						var cbstr = '<span class="callbackIndicator">Callback: <span class="ladyCoach">Lady Coach</span>&nbsp;<span class="yogaCoach">Yoga Coach</span></span>';
					}
					else
					{
						var cbstr = '<span class="callbackIndicator">Callback: <span class="ladyCoach">Lady Coach</span></span>';
					}
				}
				else if(highestPossible["obj"]["content"]["yogaCoach"])
				{
					var cbstr = '<span class="callbackIndicator">Callback: <span class="yogaCoach">Yoga Coach</span></span>';
				}
				else if(highestPossible["obj"]["content"]["wrongNumber"])
				{
					var cbstr = '<span class="callbackIndicator">Callback: <span class="wrongNumber">Wrong Number</span></span>';
				}
				else
				{
				/*	var cbstr = '<span class="callbackIndicator">Callback: <span class="time">'+moment(highestPossible["obj"]["content"]["when"],"YYYY-MM-DD hh:mm").format("h:mm a, MMM Do")+'</span></span>'; */
					var cbstr = '';
				}
			break;
		}
		
		return cbstr;
	}
	else
	{
		return '';
	}
}
function getType(status)
{
	switch (status)
	{
		case 'LEAD':
			return 'Lead';
		break;
		case 'Lead':
			return 'LEAD';
		break;
		case 'CLBK':
			return 'Callback';
		break;
		case 'Callback':
			return 'CLBK';
		break;
		case 'DEMS':
			return 'Demo Scheduled';
		break;
		case 'Demo Scheduled':
			return 'DEMS';
		break;
		case 'DEME':
			return 'Demo Finished';
		break;
		case 'Demo Finished':
			return 'DEME';
		break;
		case 'USER':
			return 'Converted';
		break;
		case 'Converted':
			return 'USER';
		break;
		case 'DROP':
			return 'Not Interested';
		break;
		case 'Not Interested':
			return 'DROP';
		break;
		case 'DEMC':
			return 'Demo Cancelled';
		break;
		case 'Demo Cancelled':
			return 'DEMC';
		break;
	}
}
//Function for loading coach info
function loadCoachInfo(email)
{
	$('.sessionsTop').detach();
	var coachdata = getCoachInfo(email);
	var date = new Date();
	var formattedDate = moment(date).format("YYYY-MM-DD");
	var scheduleData = getCoachSchedule(email, formattedDate);
	window.lastCardState = $('.card').detach();
	var card = '<div class="card coach"><div class="cardRow coachTop"><h2 class="cardTitle">'+coachdata['allSessionGroupDetails'][0]['coachName']+'</h2><ul class="coachTabs"><li><a href="#" class="current tabSchedule">Schedule</a></li><li><a href="#" class="tabSessions">Session Groups</a></li><li><a href="#" class="tabInfo">Info</a></li></ul></div><div class="cardRow coachSchedule"></div><div class="cardRow coachSessions"></div><div class="cardRow coachInfo"><div class="modal editInfoModal small"><div class="inner editInfoInner"><a href="#" class="close">X</a><h3 class="modalTitle">Edit Information</h3><form class="editInfoForm"><p class="label">Coach Name</p><input type="text" class="editInfoName" placeholder="Name"><p class="label">Mobile</p><input type="text" class="editInfoMobile" placeholder="10 digit mobile num"><p class="label">Date of birth</p><input type="text" class="editInfoDob" placeholder="Date of birth"><div class="formRow"><input type="radio" name="gender" data-val="ml" class="editInfoGender" id="editInfoMale"><label for="editInfoMale">Male</label><input type="radio" name="gender" data-val="fl" class="editInfoGender" id="editInfoFemale"><label for="editInfoFemale">Female</label></div><p class="label">Height</p><input type="text" class="editInfoHeight" placeholder="in cm"><p class="label">Weight</p><input type="text" class="editInfoWeight" placeholder="in Kg"><button class="editInfoSubmitCta" data-mode="coach">Update Information</button></form></div></div><div class="coachSessionsTop"><button class="editCoachInfo"><i class="fa fa-pencil"></i> Edit Info</div></div></div>';
	$('.main').append(card);
	var coachInfoTable = '<table class="coachDataTable">';
	if(coachdata)
	{
		for(key in coachdata)
		{
			coachInfoTable += coachInfoCells(coachdata[key],key);
			if(key == "userEmail")
			{
				window.userEmail = coachdata[key];
			}
		}
		populateEditCoachInfo(coachdata);
	}
	coachInfoTable += '</table>';
	$('.cardRow.coachInfo').append(coachInfoTable);
	
	for(var i=0; i < coachdata['allSessionGroupDetails'].length; i++)
	{
		var coachSessionGroup = '<h4 class="sessionGroupTitle">User : '+coachdata['allSessionGroupDetails'][i]['userName']+'</h4><table class="coachDataTable">';
		for(var k in coachdata['allSessionGroupDetails'][i])
		{
			coachSessionGroup += coachInfoCells(coachdata['allSessionGroupDetails'][i][k],k);
		}
		coachSessionGroup += '</table>';
		$('.cardRow.coachSessions').append(coachSessionGroup);
	}

	var coachScheduleHtml = '<div class="coachScheduleTop"><div class="leftHuddle"><span>Date - </span><input type="text" value="'+formattedDate+'" class="scheduleDate" placeholder="YYYY-MM-DD" /><button class="fetchSchedule"> Fetch</button></div></div><div class="coachScheduleMain"><table class="coachScheduleList"><thead><tr><th>Timing</th><th>User Name</th><th>Status</th></tr></thead><tbody class="coachScheduleContent"></tbody></table></div>';

	$('.cardRow.coachSchedule').append(coachScheduleHtml);
	$('.cardRow.coachSchedule input.scheduleDate').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.cardRow.coachSchedule input.scheduleDate').datetimepicker('hide');
		}
	});

	renderCoachSchedule(scheduleData);

	$('.coachTabs a.tabInfo').click();
}

//Function to render coach schedule
function renderCoachSchedule(scheduleData){
	var contentHtml = '';
	if(scheduleData && scheduleData['statusCode'] && scheduleData['statusCode'] == '1000'){
		var coachSessionsInADay = scheduleData['coachSessionsInADay'];
		if(coachSessionsInADay && coachSessionsInADay.length > 0){
			for(var i=0; i<coachSessionsInADay.length; i++){
				contentHtml += '<tr>';
				contentHtml += '<td>'+coachSessionsInADay[i]['timings']+'</td>';
				contentHtml += '<td>'+coachSessionsInADay[i]['userName']+'</td>';
				var status = coachSessionsInADay[i]['status'];
				var statusStr = '';
				if(status == 'INI'){
					statusStr = 'Scheduled';
				}
				else if(status == 'CAN'){
					statusStr = 'Cancelled';
				}
				else if(status == 'DNE'){
					statusStr = 'Completed';
				}
				else{
					statusStr = status;
				}
				contentHtml += '<td>'+statusStr+'</td>';
				contentHtml += '</tr>';
			}
		}
		else{
			contentHtml += '<tr><td colspan="3">No sessions available.</td></tr>';
		}
	}
	else{
		contentHtml += '<tr><td colspan="3">An error occurred. Please check the schedule manually.</td></tr>';
	}
	$('.cardRow.coachSchedule .coachScheduleContent').html(contentHtml);
}

//Function to create the table cells for userInfo
function coachInfoCells(value,key)
{
	if(key == 'allSessionGroupDetails' || key == 'sessionGroupDetails')
	{
		return '';
	}
	// start to create the return string
	var returnstr = '<tr>';
	returnstr += '<td>'+key+'</td><td>'+value+'</td></tr>';
	return returnstr;
}
function markConflicts(arg)
{
	if(arg && arg["table"])
	{
		var elem = arg["table"];
	}
	if(arg && arg["conflicts"])
	{
		for (var c in arg["conflicts"])
		{
			$(elem).find('td.listCoachName a[data-coachemail="'+ c +'"]').parents('tr').find('td.listStartTime').each(function(){
				var tim = $(this).attr("data-time");
				if(tim == arg["conflicts"][c])
				{
					var alertIcon = '<i class="fa fa-exclamation-circle prim"></i>&nbsp;';
					$(this).find(".timeString").prepend(alertIcon);
				}
			});
		}
	}
}
window.finalList = '';
//Create the table cells for session summary table 
function openingTableSummary(obj)
{
	if (obj['coachName']) {
		countCoachArray.push(obj['coachName']+'~'+obj['coachEmail']);
	}	
	if (obj['startTime'])
	{
		var dat = moment(obj["startTime"],"MMM DD, YYYY hh:mm:ss a");
		var datActual = moment(obj["actualStartTime"],"MMM DD, YYYY hh:mm:ss a");
		var datActualEnd = moment(obj["actualEndTime"],"MMM DD, YYYY hh:mm:ss a");

		sSessArray.push(dat.format("h:mm a"));
	}
	if(obj['actualStartTime'])
	{
		countComplete += 1;

		var diff = datActual.format("X") - dat.format("X");
		diffSeconds = Math.abs(diff);

		var diffDuration = datActualEnd.format("X") - datActual.format("X");
		diffDSeconds = Math.abs(diffDuration);

		if(diffDSeconds <= 180  || diffDSeconds > 4200)
		{
			if(window.uncountedDuration)
			{
				window.uncountedDuration += 1;
			}
			else
			{
				window.uncountedDuration = 1;
			}
		}
		if(diffSeconds <= 180 || diffSeconds > 1800)
		{
			if(window.uncountedDeviation)
			{
				window.uncountedDeviation += 1;
			}
			else
			{
				window.uncountedDeviation = 1;
			}
		}
		if (diffDSeconds > 180  && diffDSeconds <= 4200 && diffSeconds > 180 && diffSeconds <= 1800)
		{
		if(obj['isTrial'] && obj['isTrial'] == '1')
			{
				countDemoExec += 1;
			}
			countDev += 1;
			meanDev += Math.abs(diff);
			countDur += 1;
			meanDur += diffDuration;	
			window.finalList += obj['userName'] + ", duration: " + Math.abs(diffDuration/60) + ", deviation: " + Math.abs(diff/60) + '\t\n ---------- \t\n';
		}
	}
	if(obj['isTrial'] && obj['isTrial'] == '1')
	{
		countDemo += 1;
	}
	if(obj['statusCode'] == 'CAN')
	{
		countCanc += 1;
	}
	if (obj['userRating']) {
		countUserRat += 1; 
		meanUserRat += obj['userRating'];
	}
	else
	{
		if(window.uncountedUserrat)
		{
			window.uncountedUserrat += 1;
		}
		else
		{
			window.uncountedUserrat = 1;
		}
	}
	if (obj['coachRating']) {
		countCoachRat += 1; 
		meanCoachRat += obj['coachRating'];
	}
	else
	{
		if(window.uncountedCoachrat)
		{
			window.uncountedCoachrat += 1;
		}
		else
		{
			window.uncountedCoachrat = 1;
		}
	}
	if (obj['weight']) {
		if (obj['weight'] <= 180 && obj['weight'] > 35)
		{
			countWeight += 1;
			meanWeight += obj['weight']; 
		}
	}
	if (obj['waterIntake']) {
		if (obj['waterIntake'] <= 10)
		{
			countwater += 1;
			meanWater += obj['waterIntake'];
		}
	}
	if (obj['hoursSlept']) {
		if (obj['hoursSlept'] <= 12)
		{
			countSleep +=1;
			meanSleep += obj['hoursSlept'];	
		}
	}
	if(obj['hoursSlept'] && obj['waterIntake'] && obj['weight'])
	{
		if(window.countedData)
		{
			window.countedData += 1;
		}
		else
		{
			window.countedData = 1;
		}
	}
}
currentDate = '', previousDate = '', tableNumber = 1, window.currentTable = null;
//Create the table cells for session report on landing page
function openingTableCells(obj)
{
	// start to create the return string
	var returnstr = '<tr class="listSessionGroup">';
	
	// if session has a start-time, insert the start time into the cell
	if (obj['startTime'])
	{
		var dat = moment(obj["startTime"],"MMM DD, YYYY hh:mm:ss a");
		returnstr += '<td class="listStartTime" data-time="'+dat.format("X")+'" class="listSchedule"><div class="timeWrap">';
		returnstr += '<div class="timeString">' + dat.format("h:mm a")+'</div><!--<div class="calView"><span class="month">'+ dat.format("MMM") +'</span><span class="date">'+ dat.format("DD") +'</div>--></div></td>';
		var sStartTime = dat.format("X");
		
		previousDate = currentDate;
		currentDate = dat.format("D");
		
		var cEmail = obj['coachEmail'];
		if(coachTemp[cEmail])
		{
			if( coachTemp[cEmail].some(function(item){return (new RegExp(item)).test(sStartTime)}) )
			{
				if( conflictingTimes[cEmail] && conflictingTimes[cEmail].some(function(item){return (new RegExp(item)).test(sStartTime)}) && obj['statusCode'] != 'CAN' )
				{
					conflictingTimes[cEmail].push(sStartTime);
				}
				else
				{
					conflictingTimes[cEmail] = [sStartTime];
				}
			}
			else
			{
				coachTemp[cEmail].push(sStartTime);
			}
		}
		else
		{
			coachTemp[cEmail] = [sStartTime];
		}
	}
	else {
		returnstr += '<td data-time="0">&nbsp;</td>';
	}

	//if session is trial, state that
	if(obj['isTrial'] && obj['isTrial'] == '1')
	{
		returnstr += '<td class="listTrial hasTrial" data-trial="1"><i class="fa fa-check prim"></i></td>';
	}
	else
	{
		returnstr += '<td data-trial="0">&nbsp;</td>';
	}
	
	// if session has a username, insert it into the cell
	if (obj['userName']) {
		returnstr += '<td class="listUserName">';
		returnstr += '<a class="clickable" data-type="userNameLink" data-useremail="'+obj['userEmail']+'">'+obj['userName']+'</a></td>';
	}
	else {
		returnstr += '<td>&nbsp;</td>';
	}
	
	// if session has a coachname, insert it into the cell
	if (obj['coachName']) {
		returnstr += '<td class="listCoachName">';
		returnstr += '<a class="clickable" data-type="coachNameLink" data-coachemail="'+obj['coachEmail']+'">'+obj['coachName']+'</td>';
	}
	else {
		returnstr += '<td>&nbsp;</td>';
	}

	var status = 'Scheduled';
	if(obj['statusCode'] == 'NSW'){
		status = 'No Show';
	}
	else if(obj['statusCode'] == 'CAN'){
		status = 'Cancelled';
	}
	else{
		if(obj['onTheWaynotificationTime']){
			status = 'On the way';
		}
		if(obj['checkInNotificationTime']){
			status = 'Checked-in';
		}
		if(obj['isCompleted'] && obj['isCompleted'] == true){
			status = 'Completed';
		}
	}
	returnstr += '<td>'+status+'</td>';

	// if session has an "on my way" time
	if (obj['onTheWaynotificationTime']) {
		returnstr += '<td class="listOnTheWay">';
		var omwTime = moment(obj['onTheWaynotificationTime'],"MMM DD, YYYY hh:mm:ss a");
		returnstr += omwTime.format("h:mm a")+'</td>';
	}
	else {
		returnstr += '<td>&nbsp;</td>';
	}
	
	// if session has an "on my way" time
	if (obj['checkInNotificationTime']) {
		returnstr += '<td class="listCheckin">';
		var checkinTime = moment(obj['checkInNotificationTime'],"MMM DD, YYYY hh:mm:ss a");
		returnstr += checkinTime.format("h:mm a");
		
		if(obj['checkInLatitude'] && obj['checkInLongitude'] && obj['userLatitude'] && obj['userLongitude'])
		{
			returnstr += '&nbsp;&nbsp;<a href="#" class="checkInMapLink" data-clat="'+obj['checkInLatitude']+'" data-clong="'+obj['checkInLongitude']+'" data-ulat="'+obj['userLatitude']+'" data-ulong="'+obj['userLongitude']+'"><i class="fa fa-map-marker fa-2x prim"></i></a>';
		}
		else
		{
			returnstr += '</td>';
		}
	}
	else {
		returnstr += '<td>&nbsp;</td>';
	}
	
	if (obj['actualStartTime']) {
		var datActual = moment(obj["actualStartTime"],"MMM DD, YYYY hh:mm:ss a");
		var datActualEnd = moment(obj["actualEndTime"],"MMM DD, YYYY hh:mm:ss a");
		var aStartTime = datActual.format("X");
		var diff = Math.abs((aStartTime - sStartTime));
		var diffMinutes = Math.floor(diff/60);
		var diffSeconds = diff % 60;
		var diffHour = Math.floor(diffMinutes/60);
		/*if(diffHour > 0)
		{
			diffMinutes = diffMinutes % 60;
		}*/
		if(aStartTime > sStartTime)
		{
			if(diffMinutes > 3 && diffMinutes < 30)
			{
				returnstr += '<td data-difference="-'+diff+'" class="hasDeviation listDelta">' + diffMinutes + 'm ' + zeroPrefix(diffSeconds) +'s</td>';
			}
			else
			{
				returnstr += '<td data-difference="-'+diff+'" class="hasStarted listDelta">' + diffMinutes + 'm ' + zeroPrefix(diffSeconds) +'s</td>';
			}
		}
		else
		{
			if(diffMinutes > 3 && diffMinutes < 30)
			{
				returnstr += '<td data-difference="'+diff+'" class="hasDeviation listDelta"><span class="positive">-' + diffMinutes + 'm ' + zeroPrefix(diffSeconds) +'s</span></td>';
			}
			else
			{
				returnstr += '<td data-difference="'+diff+'" class="hasStarted listDelta"><span class="positive">-' + diffMinutes + 'm ' + zeroPrefix(diffSeconds) +'s</span></td>';
			}
		}
	}
	else {
		if(obj['statusCode'] == 'CAN')
		{
			returnstr += '<td class="hasCanceled listCanceled" data-difference="10000000"><span class="prim"><i class="fa fa-close"></i> Canceled</span></td>';
		}
		else
		{
			returnstr += '<td data-difference="100000000">&nbsp;</td>';
		}
	}
	if (obj['actualEndTime']) {
		
		var datActualEnd = moment(obj["actualEndTime"],"MMM DD, YYYY hh:mm:ss a");
		var diffDuration = datActualEnd.format("X") - datActual.format("X");
		diffMinutes = Math.floor(diffDuration/60);
		diffSeconds = diffDuration % 60;
		diffHour = Math.floor(diffMinutes/60);
		returnstr += '<td data-difference="'+diffDuration+'" class="hasDuration listDuration">';
		/*if(diffHour > 0)
		{
			diffMinutes = diffMinutes % 60;
		}*/
		returnstr += diffMinutes + 'm ' + zeroPrefix(diffSeconds) + 's</td>';
	}
	else {
		returnstr += '<td data-difference="0">&nbsp;</td>';
	}
	
	// if session has user's rating, insert it into the cell
	if (obj['userRating']) {
		returnstr += '<td data-rating="'+obj['userRating']+'" class="hasUrating listRatingUser">';
		returnstr += makeStars(obj['userRating'])+'</td>';
	}
	else {
		returnstr += '<td data-rating="10">&nbsp;</td>';
	}
	
	// if session has coach's rating, insert it into the cell
	if (obj['coachRating']) {
		returnstr += '<td data-rating="'+obj['coachRating']+'" class="hasCrating listRatingCoach">';
		returnstr += makeStars(obj['coachRating'])+'</td>';
	}
	else {
		returnstr += '<td data-rating="0">&nbsp;</td>';
	}
	
	// if session has coach's comment, insert it into the cell
	if (obj['userComment']) {
		returnstr += '<td class="listFeedbackUser"><div class="userComment">';
		returnstr += obj['userComment']+'</div></td>';
	}
	else {
		returnstr += '<td>&nbsp;</td>';
	}
	
	// if session has coach's comment, insert it into the cell
	if (obj['coachComment']) {
		returnstr += '<td class="listFeedbackCoach"><div class="coachComment">';
		returnstr += obj['coachComment']+'</div></td>';
	}
	else {
		returnstr += '<td>&nbsp;</td>';
	}
	
	// if session has user's current weight, insert it into the cell
	if (obj['weight']) {
		returnstr += '<td class="hasWeight listWeight">';
		returnstr += obj['weight']+'</td>';
	}
	else {
		returnstr += '<td>&nbsp;</td>';
	}
	
	// if session has user's water intake, insert it into the cell
	if (obj['waterIntake']) {
		returnstr += '<td class="hasWater listWater">';
		returnstr += obj['waterIntake']+'</td>';
	}
	else {
		returnstr += '<td>&nbsp;</td>';
	}
	
	// if session has user's sleep duration, insert it into the cell
	if (obj['hoursSlept']) {
		returnstr += '<td class="hasSleep listSleep">';
		returnstr += obj['hoursSlept']+'</td></tr>';
	}
	else {
		returnstr += '<td>&nbsp;</td></tr>';
	}
	if(currentDate && previousDate && currentDate != previousDate)
	{
		tableNumber++;
		var newCard = '<h3 class="tableRange">'+ dat.format("MMM DD, YYYY") +'</h3><table class="sessionsList date'+ tableNumber +' sortable" width="100%" cellpadding="15" cellspacing="0"><thead><tr><th data-tsorter="time">When</th><th data-tsorter="link">User <a class="sort"></a></th><th data-tsorter="link">Coach</i></a></th><th>On Way</th><th>Check-in</th><th data-tsorter="diff">Delay</th><th data-tsorter="diff">Length</th><th data-tsorter="rating"><i class="fa fa-star"></i> User</th><th data-tsorter="rating"><i class="fa fa-star"></i> Coach</th><th data-tsorter="userComment">User Feedback</th><th data-tsorter="coachComment">Coach Feedback</th><th>Weight</th><th>Water</th><th>Sleep</th></tr></thead><tbody></tbody></table>';
		$('.sessionsMain').append(newCard);
		window.currentTable = tableNumber;
	}
	return returnstr;
}
function makeStars(num) {
	var returnText = '<span class="prim">';
	for (var i = 0; i < 5; i++)
	{
		if (i < parseInt(num))
		{
			returnText += '<i class="fa fa-star"></i>';
		}
	}
	if(parseInt(num) !== num)
	{
		returnText += '<i class="fa fa-star-half-empty"></i>';
	}
	returnText +='</span>';
	return returnText;
}

//Function to call generic Get call function for email tempelates.
function getEmailInfo()
{
	var url = urlUserInfo;
	var x = getData(url);
	return x;
}

//Function to call generic Get call function for sms tempelates.
function getSmsInfo()
{
	var url = urlUserInfo;
	var x = getData(url);
	return x;
}

// get user info based on user email
function getUserInfo(userEmail)
{
	var url = urlUserInfo + '&email=' + userEmail;
	var x = getData(url);
	return x;
}

// get user session info based on user email
function getUserSessionInfo(userEmail)
{
	var url = urlUserSessionInfo + '&email=' + userEmail;
	var x = getData(url);
	return x;
}

// add offline payment for user
function submitOfflinePayment(arg)
{
	var url = urlOfflinePayment + 'email='+ arg["email"] +'&amount='+ arg["amount"] +'&type='+ arg["mode"] +'&comment=' + arg["comment"] + '&promoAmount=' + arg['promoAmount'] + '&socDiscount=' + arg["socDiscount"] + '&refDiscount=' + arg["refDiscount"] + '&advpayDiscount=' + arg["advpayDiscount"];
	var x = getData(url);
	return x;
}

// get coach info based on coach email
function getCoachInfo(coachEmail)
{
	var url = urlCoachInfo + '&email=' + coachEmail;
	var x = getData(url);
	return x;
}

// get coach schedule based on coach email
function getCoachSchedule(coachEmail, date)
{
	var url = urlCoachSchedule + 'email=' + coachEmail + '&date=' + date;
	var x = getData(url);
	return x;
}

//Type 1 - load sessions based on start and end dates
function getSessionsDate(startDate,endDate,countStart,countEnd)
{
	var url = urlMain + 'typeParam=1' + '&startDate=' + startDate + '&endDate=' + endDate + '&start=' + countStart + '&count=' + countEnd;
	var x = getData(url);
	return x;
}
//Type 2 - load sessions based on user email
function getSessionsUser(userEmail,countStart,countEnd)
{
	var url = urlMain + 'typeParam=2' + '&email=' + userEmail + '&start=' + countStart + '&count=' + countEnd;
	var x = getData(url);
	return x;
}
//Type 3 - load sessions based on user email, start and end dates
function getSessionsUserDate(userEmail,startDate,endDate,countStart,countEnd)
{
	var url = urlMain + 'typeParam=3' + '&email=' + userEmail + '&startDate=' + startDate + '&endDate=' + endDate + '&start=' + countStart + '&count=' + countEnd;
	var x = getData(url);
	return x;
}
//Type 4 - load sessions based on coach email
function getSessionsCoach(coachEmail,countStart,countEnd)
{
	var url = urlMain + 'typeParam=4' + '&coachEmail=' + coachEmail + '&start=' + countStart + '&count=' + countEnd;
	var x = getData(url);
	return x;
}
//Type 5 - load sessions based on coach email, start and end dates
function getSessionsCoachDate(coachEmail,startDate,endDate,countStart,countEnd)
{
	var url = urlMain + 'typeParam=5' + '&coachEmail=' + coachEmail + '&startDate=' + startDate + '&endDate=' + endDate + '&start=' + countStart + '&count=' + countEnd;
	var x = getData(url);
	return x;
}
// Function to add sessions for a user
function addSessionsUser(arg)
{
	var url = urlUserAddSession + 'email=' + arg["email"] + '&dates=' + arg["dates"];
	if(arg["time"])
	{
		url += '&time=' + arg["time"];
	}
	var x = addSessions({"url":url,"email":arg["email"]});
	return x;
}
// Function to reschedule an existing session for a user
function userSessionReschedule(code,newDate,newTime,comment,userEmail,com)
{
	if(com)
	{
		var url = urlUserModSession + 'sessionCode=' + code + '&status=RSD' + '&comment=' + comment + '&newTime=' + newTime + '&newDate=' + newDate + '&com=Y';	
	}
	else
	{
		var url = urlUserModSession + 'sessionCode=' + code + '&status=RSD' + '&comment=' + comment + '&newTime=' + newTime + '&newDate=' + newDate;
	}
	var x = editSession(url,userEmail);
	return x;
}
// Function to cancel an existing session for a user
function userSessionCancel(code,comment,userEmail,opt)
{
	if(opt)
	{
		var url = urlUserModSession + 'sessionCode=' + code + '&status=CAN' + '&comment=' + comment +'&com=Y';
	}
	else
	{
		var url = urlUserModSession + 'sessionCode=' + code + '&status=CAN' + '&comment=' + comment;
	}
	var x = editSession(url,userEmail);
	return x;
}
//Fetch the user sessions for performance tab
function getPerfUser(userEmail)
{
	var url = urlMain + 'typeParam=2' + '&email=' + userEmail + '&start=0&count=10000';
	var x = getData(url);
	return x;
}
//Fetch the user sessions based on date for performance tab
function getPerfUserDate(arg)
{
	var url = urlMain + 'typeParam=3' + '&email=' + arg["email"] + '&startDate=' + arg["startDate"] + '&endDate=' + arg["endDate"] + '&start=0&count=10000';
	var x = getData(url);
	return x;
}
// Function to fetch the payment data
function getPaymentData(arg)
{
	if(arg && arg["count"] && arg["start"])
	{
		var count = arg["count"]; var start = arg["start"];
	}
	else if(arg && arg["count"] && !arg["start"])
	{
		var count = arg["count"]; var start = 0;
	}
	else
	{
		var count = 30; var start = 0;
	}
	var url = urlGetPayment + "count=" + count + "&start=" + start;
	var x = getData(url);
	return x;
}
// Function to fetch the common order history data
function getOrderData()
{
	var url = urlOrderHistory;
	var x = getData(url);
	return x;
}
// Function to fetch the user specific payment data
function getUserPaymentData(email)
{
	var url = urlUserPayment + email;
	var x = getData(url);
	return x;
}
// Function to fetch credit consumption data for specific user
function getUserCreditData(email)
{
	var url = urlUserCreditHistory + 'email=' +email;
	var x = getData(url);
	return x;
}
//Function to update the reschedule request status
function updateRsdRequests(arg)
{
	var url = encodeURI(urlUpdateRescheduleRequests + 'sessionCode=' + arg["sessionCode"] + '&statusCode=' + arg["statusCode"] + '&comment=' + arg["comment"]);
	var x = getData(url);
	return x;
}
//Function to update the cancel request status
function updateCanRequests(arg)
{
	var url = encodeURI(urlUpdateCancelRequests + 'sessionCode=' + arg["sessionCode"] + '&statusCode=' + arg["statusCode"] + '&comment=' + arg["comment"]);
	var x = getData(url);
	return x;
}
// Function to get the reschedule requests based on date and user email
function getRequestsUserEmail(startDate,endDate,email)
{
	var url = urlRescheduleRequests + 'startTime=' + startDate + '&endTime=' + endDate + '&email=' + email + '&mode=user';
	var x = getData(url);
	return x;
}
// Function to get the reschedule requests based on date and coach email
function getRequestsCoachEmail(startDate,endDate,email)
{
	var url = urlRescheduleRequests + 'startTime=' + startDate + '&endTime=' + endDate + '&email=' + email + '&mode=coach';
	var x = getData(url);
	return x;
}
// Function to get the reschedule requests based on date
function getRequests(startDate,endDate)
{
	var url = urlRescheduleRequests + 'startTime=' + startDate + '&endTime=' + endDate;
	var x = getData(url);
	return x;
}
// Function to get the list for user lifecycles
function getUserLeads(arg)
{
	var count = arg["count"];
	var startDate = arg["startDate"];
	var endDate = arg["endDate"];
	var campaign = arg["campaign"];
	var start = arg["start"];
	var status = arg["status"];
	if(!arg || !arg["status"])
	{
		var url = urlUserLeads + 'count=' + count + '&startTime=' + startDate + '&endTime=' + endDate + '&campaign=' + campaign + '&start=' + start;
	}
	else
	{
		if(status == 'TBCD'){
			var url = urlUserLeadsWithCallback + 'count=' + count + '&startTime=' + startDate + '&endTime=' + endDate + '&campaign=' + campaign + '&start=' + start + '&status=CLBK';
		}
		else{
			var url = urlUserLeads + 'count=' + count + '&startTime=' + startDate + '&endTime=' + endDate + '&campaign=' + campaign + '&start=' + start + '&status=' + status;
		}
	}
	var x = getData(url);
	return x;
}
// Function to fetch the payment data
function triggerInvoiceSend(userEmail,triggeredCell,type)
{
	if(type == "returning")
	{
		var url = urlSendInvoice + 'email=' + userEmail;
	}
	else
	{
		var url = urlSendInvoice + 'email=' + userEmail + '&mode=new';
	}
	var x = postInvoiceSend(url,triggeredCell);
	return x;
}
function triggerInvoiceSendPromo(userEmail,triggeredCell,type,code)
{
	if(type == "returning")
	{
		var url = urlSendInvoice + 'email=' + userEmail + '&promo=' + code + '-USC';
	}
	else
	{
		var url = urlSendInvoice + 'email=' + userEmail + '&promo=' + code + '-USC' + '&mode=new';
	}
	var x = postInvoiceSend(url,triggeredCell);
	return x;
}
// Function to add data to an existing session and mark it as done
function addSessionData(formdata,userEmail,sessionCode)
{
	var stTime = formdata["dataFormStartDate"].split("-").reverse().join("-") + " " + formdata["dataFormStartTime"] + ":00";
	var endTime = formdata["dataFormEndDate"].split("-").reverse().join("-") + " " + formdata["dataFormEndTime"] + ":00";
	var url = urlAddData + 'userEmail=' + userEmail + '&noOfHoursSlept=' + formdata["dataFormSleep"] + '&amountOfWaterDrankLt=' + formdata["dataFormWater"] + '&mealAdded=' + formdata["dataFormMeals"] + '&currentWeight=' + formdata["dataFormWeight"] + '&startTime=' + stTime + '&endTime=' + endTime + '&sessionCode=' + sessionCode;
	var x = editSession(url,userEmail);
	return x;
}
// Function to post the update to order status
function updateOrderStatus(code,subCode,status,comment)
{
	var url = encodeURI(urlOrderUpdate + 'orderCode=' + code + '&suborderCode=' + subCode + '&status=' + status + '&comment=' + comment);
	var x = postOrderUpdate(url);
	return x;
}
// Function to post a comment to the user campaign module
function campaignPostComment(id,time,comment)
{
	var url = encodeURI(urlPostComment + 'comment=' + comment + '&identificationCode=' + id + '&time=' + time);
	var x = postCampaign(url);
	return x;
}
// Function to send sms to user to notify about callback
function sendSmsUserCallback(arg)
{
	if(arg && arg["mobile"] && arg["name"])
	{
		var url = urlCallbackSms + "name=" + arg["name"] + "&mobile=" + arg["mobile"];
			var x = getData(url);
		return x;
	}
}
// Function to post a status change to the user campaign module
function campaignPostStatus(id,callback,type)
{
	if(callback){
		var url = encodeURI(urlPostStatus + 'status=' + type + '&callback=' + callback + '&identificationCode=' + id);
	}
	else{
		var url = encodeURI(urlPostStatus + 'status=' + type + '&identificationCode=' + id);
	}
	var x = postCampaign(url);
	return x;
}
// Function to get the list of free session requests
function getFreeSessions(arg)
{
	if(arg && arg["startDate"] && arg["endDate"])
	var url = encodeURI(urlGetFreeSessions + 'startDate=' + arg["startDate"] + ".000" + "&endDate=" + arg["endDate"] + ".000");
	var x = getData(url);
	return x;
}
// Function to commit a free session request
function editFreeSessions(arg)
{
	if(arg && arg["startDate"] && arg["endDate"])
	var url = encodeURI(urlEditFreeSessions + '&userCode=' + arg["userCode"] + "&location=" + arg["location"] + "&latitude=" + arg["latitude"] + "&longitude=" + arg["longitude"] + "&exactTime=" + arg["exactTime"]);
	var x = getData(url);
	return x;
}
// Function to assign a coach for a free session request
function freeSessionsCoach(arg)
{
	if(arg && arg["startDate"] && arg["endDate"])
	var url = encodeURI(urlFreeSessionsCoach + '&userCode=' + arg["userCode"] + "&trainerUserCode=" + arg["trainerUserCode"] + "&latitude=" + arg["latitude"] + "&longitude=" + arg["longitude"] + "&exactTime=" + arg["exactTime"]);
	var x = getData(url);
	return x;
}
function postDietplan(fileData)
{
	if(fileData)
	{
		var url = urlDietplanUpload;
		var x = postFile({"url":url,"data":fileData});
	}
	return x;
}
function getDietData(arg)
{
	if(arg)
	{
		var url = urlDietplanFetch + "email=" + arg;
		var x =getData(url);
		return x;
	}
}
function sendDietEmail(arg)
{
	if(arg)
	{
		var url = urlSendDietEmail + "email=" + arg;
		var x =getData(url);
		return x;
	}
}
function getReceivedPayments(arg)
{
	if(arg)
	{
		var url = urlReceivedPayments + "start=" + arg["startDate"] + "&end=" + arg["endDate"];
			var x =getData(url);
		return x;
	}
}
function getReferralData(email)
{
	if(email)
	{
		var url = urlUserReferrals + "email=" + email;
			var x =getData(url);
		return x;
	}
}
function addUserReferral(arg)
{
	if(arg)
	{
		var url = urlAddReferralCredits + "referredBy=" + arg["fromEmail"] + "&referredTo=" + arg["toEmail"];
			var x = getData(url);
		return x;
	}
}

function addUserSocial(arg)
{
	if(arg)
	{
		var url = urlAddSocialCredits + "referredBy=" + arg["fromEmail"] + "&amount=" + arg["amount"] + "&refCode=ADMN" ;
			var x = getData(url);
		return x;
	}
}

function pauseGroup(arg)
{
	if(arg)
	{
		var url = urlPauseGroup + 'email=' + arg["email"] + '&isPause=' + arg["flag"];
			var x = getData(url);
		return x;
	}
}

function convertTrialUser(arg)
{
	if(arg)
	{
		var url = urlConvertTrial + 'email=' + arg["email"];
			var x = getData(url);
		return x;
	}
}

function updateUserInfo(arg)
{
	if(arg)
	{
		var url = urlUpdateUser + "?" + arg;
		var x = getData(url);
	}
	return x;
}

function substituteCoach(arg)
{
	if(arg)
	{
		if(arg["mode"] == "perm")
		{
			var url = urlSubstituteCoach + "newCoachCode=" + arg["coachCode"] + "&email=" + arg["email"] + "&mode=perm" ;
		}
		else
		{
			var url = urlSubstituteCoach + "newCoachCode=" + arg["coachCode"] + "&email=" + arg["email"];
		}
			var x = getData(url);
		return x;
	}
}

function getNewReports(arg)
{
	var url = urlGetNewReports + "fromDate=" + arg["fromDate"] + "&toDate=" + arg["toDate"];
	var X = getData(url);
	return X;
}

function addReportDate(arg)
{
	var url = encodeURI(urlAddReportDate + "date=" + arg["date"] + "&jsonString=" + JSON.stringify(arg["data"]));
	var X = getData(url);
	return X;
}

function checkBusinessReportForDate(date)
{
	var url = urlCheckReportDate + "&date=" + date;
	var x = getData(url);
	return x;
}

function postCellContent(arg)
{
	var url = urlUpdateReportCell + "date=" + arg["date"] + "&key=" + arg["key"] + "&value=" + arg["value"];
	var X = getData(url);
	return X;
}

function updateSessionGroup(arg)
{
	var url = urlUpdateSessGroup;
	var x = loadUsingPost({"url":url,"data":arg});
	return x;
}

function getTimeForSession(arg)
{
	var url = urlSessTime + "sessionCode=" + arg["code"];
	var x = getData(url);
	return x;
}

function getUserLeadsCampaigns()
{
	var url = urlUserCampaigns;
	var x = getData(url);
	return x;
}

//Function to get the cancellation requests based on multiple input parameters
function getCancels(arg)
{
	if(arg && arg["mode"])
	{
		switch(arg["mode"])
		{
			case "user":
				var url = urlCancelRequests + "startTime=" + arg["startDate"] + "&endTime=" + arg["endDate"] + "&mode=user" + "&email=" + arg["email"];
			break;
			case "coach":
				var url = urlCancelRequests + "startTime=" + arg["startDate"] + "&endTime=" + arg["endDate"] + "&mode=coach" + "&email=" + arg["email"];
			break;
			case "none":
				var url = urlCancelRequests + "startTime=" + arg["startDate"] + "&endTime=" + arg["endDate"];
			break;
		}
			var x = getData(url);
		return x;
	}
	//{"mode":"user","email":email,"startDate":startDate,"endDate":endDate}
}

// Base AJAX function for getting the json from the server
function getData(url) {
    var result = null;
    attachLoader();
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
			result = data;
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown});
			detachLoader();
		}
    });
    return result;
}
// Base AJAX function for uploading diet files
function postFile(arg) {
    var result = null;
    attachLoader();
    $.ajax({
        url: arg["url"],
        type: 'POST',
        dataType: 'json',
        data: arg["data"],
        async: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function(data) {
			result = data;
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown});
			detachLoader();
		}
    });
    return result;
}
// Base AJAX function for posting the query for adding sessions for user;
function addSessions(arg) {
	var result = null;
    attachLoader();
	$.ajax({
		url:arg["url"],
		type: 'post',
		dataType: 'json',
		async: false,
		success: function(data) {
			if(data && data['statusCode'] && data['statusCode'] == 1000)
			{
				setTimeout(function(){
					$('table.cal').remove();
					loadUserInfo(arg["email"]);
					$('.tabSessions').click();
				},200);
			}
			else
			{
				$('.sessionError').html('<i class="fa fa-close"></i> '+data['response']+'. Response Code:'+data['statusCode']).show(100);
			}
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown});
			detachLoader();
		}
	});
}

//Base AJAX function for posting the send invoice function
function postInvoiceSend(url,triggeredCell) {
	var result = null;
    attachLoader();
	$.ajax({
		url:url,
		type: 'post',
		dataType: 'json',
		async: false,
		success: function(data) {
			if(data && data['responseCode'] && data['responseCode'] == 1000)
			{
				setTimeout(function(){
					invoiceSentAnimation(triggeredCell);
					$('.invoiceConfirmation p.message').text(data['response']).show(100);
				},200);
				setTimeout(function(){
					$('.invoiceConfirmation').fadeOut(100);
				},5000);
			}
			else
			{
				setTimeout(function(){
					var alertText = data['response']+'. Response Code:'+data['responseCode'];
					$('.invoiceConfirmation p.message').text(alertText);
				},200);
			}
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown});
			detachLoader();
		}
	});
}

//Base AJAX function for posting the update order url
function postOrderUpdate(url) {
	var result = null;
    attachLoader();
	$.ajax({
		url:url,
		type: 'post',
		dataType: 'json',
		async: false,
		success: function(data) {
			if(data && data['responseCode'] && data['responseCode'] == 1000)
			{
				setTimeout(function(){
					loadOrderData();
				},200);
			}
			else
			{
				var alertText = data['response']+'. Response Code:'+data['responseCode'];
				showModalMessage({"message":alertText});
			}
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown});
			detachLoader();
		}
	});
}

//Base AJAX function for posting the update order url
function postCampaign(url) {
	var result = null;
    attachLoader();
	$.ajax({
		url:url,
		type: 'post',
		dataType: 'json',
		async: false,
		success: function(data) {
			result = data;
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			var xyz = {"responseCode":"1000"};
			result = xyz;
			showModalMessage({"message":thrown});
			detachLoader();
		}
	});
	return result;
}

// Base AJAX function for posting the query for canceling/rescheduling a session for user;
function editSession(url,email) {
	var result = null;
    attachLoader();
	$.ajax({
		url:url,
		type: 'post',
		dataType: 'json',
		async: false,
		success: function(data) {
			if(data && data['responseCode'] && data['responseCode'] == 1000)
			{
				setTimeout(function(){
					$('table.cal').remove();
					loadUserInfo(email);
					$('.tabSessions').click();
				},200);
			}
			else
			{
				$('sessionError').html('<i class="fa fa-close"></i> '+data['response']+'. Response Code:'+data['responseCode']).show(100);
			}
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown});
			detachLoader();
		}
	});
}
// Base AJAX function for retrieving autosuggest results for input parameter
function fetchSuggestions(param)
{
	var result = null;
    attachLoader();
	url = urlAutoSuggest + param;
	$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
			result = data;
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown});
			detachLoader();
		}
    });
	return result;
}
function fetchCoachSuggestions(param)
{
	var result = null;
    	attachLoader();
	url = urlAutoSuggestCoach + param;
	$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
			result = data;
			detachLoader();
		},
		error: function(xhr, status, thrown)
		{
			showModalMessage({"message":thrown});
			detachLoader();
		}
    });
	return result;
}
//function to show the animated UI effect when invoice has been sent succesfully
function invoiceSentAnimation(triggeredCell)
{
	$(triggeredCell).find('.animtext').remove();
	var animtext = '<p class="animtext">Sent Succesfully <i class="fa fa-envelope"></i></p>';
	$(triggeredCell).css({position:'relative',overflow:'hidden'}).append(animtext);
	setTimeout(function(){
		$('.animtext').animate({
			bottom:"100px",
			opacity:"0",
		},500);
	},500);
}