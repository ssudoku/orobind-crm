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