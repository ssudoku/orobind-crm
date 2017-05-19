var access_requests_start_date = xToday;
var access_requests_end_date = xToday;
var access_requests_start = 0;
var access_requests_count = 30;
var access_requests_optional_filters = {};
var access_requests_filter_descriptions = {};
// Optional, ignore if using relative URLs
var access_requests_base_url = window.location.protocol+'//'+window.location.host+'/';
var access_requests_url = access_requests_base_url+'panel/access/getAccessReq?';
var access_requests_access_codes_url = access_requests_base_url+'panel/access/accessPointAutosuggest';
function loadAccessRequests(){
	var basicPageContentHtml = '<div class="page card accessRequests" id="accessRequestsPage"><div class="cardRow accessRequestsTop"><div class="leftHuddle"><h2 class="cardTitle">Access Requests</h2><div class="accessRequestsWhen dateControlWidget"><div class="accessRequestsWhenSelect dropDown"><input type="text" value="Today" class="whenText"><button class="whenToggle"><i class="fa fa-chevron-down fa-lg"></i></button></div><form class="accessRequestsDatepicker controlForm" style="display: none;"><input type="radio" id="today" name="listtype" checked=""><label for="today">Today</label><br><hr class="sessionDivider"><input type="radio" id="bydate" name="listtype"><label for="bydate">Between dates</label><div class="datePickerInput dateInput">From <input type="text" placeholder="DD-MM-YYYY" class="startDate"> To <input type="text" placeholder="DD-MM-YYYY" class="endDate"><button class="datePickerSubmit dateControlSubmit" data-module="accessRequests">Fetch Access Requests</button></div></form></div><p class="resultLabel">Results per page</p><input type="text" value="30" class="pageResultCount"><button class="pageCountCta"><i class="fa fa-refresh"></i></button><button class="moreFiltersCta" style="margin-left:15px"><i class="fa fa-filter"></i></button></div><div class="rightHuddle"><div class="numberNav"><a href="#" class="numberNavLink first"><i class="fa fa-angle-double-left"></i></a><a href="#" class="numberNavLink previous"><i class="fa fa-angle-left"></i></a></div><p class="status">Showing <span class="which">1</span> of <span class="totalCount">1</span></p><div class="numberNav"><a href="#" class="numberNavLink next"><i class="fa fa-angle-right"></i></a><a href="#" class="numberNavLink last"><i class="fa fa-angle-double-right"></i></a></div><input type="text" placeholder="Page" class="paginationInput"><button class="pageNavCta">Go</button></div></div><div class="cardRow optionalFilters"><ul></ul></div><div class="cardRow accessRequestsMain"><table class="accessRequestsList"><thead><tr><th>Access Point</th><th>Address</th><th>Location</th><th>Username</th><th>User email</th><th>Coach Name</th><th>Service Type</th><th>Access Code</th><th>Access Time</th><th>Consumption Time</th><th>Expiry Time</th><th>Consumed?</th><th>Status</th><th>Access Short Code</th><th>Rating</th><th>Comment</th></tr></thead><tbody class="accessRequestsContent"></tbody></table></div></div>';
	$('.main').append(basicPageContentHtml);
	$('.accessRequests .dateInput .startDate, .accessRequests .dateInput .endDate').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.accessRequests .dateInput .startDate, .accessRequests .dateInput .endDate').datetimepicker('hide');
		}
	});
	renderAccessRequestsHtml(null);
}

function renderAccessRequestsHtml(obj){
	if(obj){
		if(obj['startDate']){
			access_requests_start_date = obj['startDate'];
		}
		if(obj['endDate']){
			access_requests_end_date = obj['endDate'];
		}
		if(obj['start'] || obj['start'] == 0){
			access_requests_start = obj['start'];
		}
		if(obj['count']){
			access_requests_count = obj['count'];
		}
	}
	var url = access_requests_url+'startDate='+access_requests_start_date+'&endDate='+access_requests_end_date+'&count='+access_requests_count+'&start='+access_requests_start;
	for(var x in Object.keys(access_requests_optional_filters)){
		url += '&'+Object.keys(access_requests_optional_filters)[x]+'='+access_requests_optional_filters[Object.keys(access_requests_optional_filters)[x]];
	}
	console.log(url);
	var x =getData(url);
	if(x){
		paginateAccessRequests({"start":access_requests_start,"count":access_requests_count,"data":x,"parentDiv":$('.accessRequestsTop')});
		var tbodyHtml = '';
		if(x["responseCode"] && x["responseCode"] == 1000 && x['accessPointRequests'] && x['accessPointRequests'].length > 0){
			for(var i=0; i<x['accessPointRequests'].length; i++){
				tbodyHtml += '<tr>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['nameOfPlace']+'</td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['address']+'</td>';
				tbodyHtml += '<td><a onclick="showAccessRequestLoc('+x['accessPointRequests'][i]['latitude']+','+x['accessPointRequests'][i]['longitude']+');" style="left: 20px; position: relative;" href="#"><i style="color: #d44343;" class="fa fa-map-marker fa-2x"></i></a></td>';
			//	tbodyHtml += '<td>'+x['accessPointRequests'][i]['latitude']+', '+x['accessPointRequests'][i]['longitude']+'</td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['userName']+'</td>';
				tbodyHtml += '<td><a href="mailto:'+x['accessPointRequests'][i]['userEmail']+'" target="_top">'+x['accessPointRequests'][i]['userEmail']+'</a></td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['coachName']+'</td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['serviceType']+'</td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['accessCode']+'</td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['accessExactTime']+'</td>';
				tbodyHtml += '<td>'+((x['accessPointRequests'][i]['consumptionTime']) ? (x['accessPointRequests'][i]['consumptionTime']) : '-')+'</td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['expiryTime']+'</td>';
				tbodyHtml += '<td>'+(x['accessPointRequests'][i]['isConsumed'] ? 'Yes' : 'No')+'</td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['status']+'</td>';
				tbodyHtml += '<td>'+x['accessPointRequests'][i]['accessShortCode']+'</td>';
				tbodyHtml += '<td>'+((x['accessPointRequests'][i]['rating']) ? makeStars(x['accessPointRequests'][i]['rating']) : '-')+'</td>';
				tbodyHtml += '<td>'+((x['accessPointRequests'][i]['comment']) ? (x['accessPointRequests'][i]['comment']) : '-')+'</td>';
				tbodyHtml += '</tr>';
			}
		}
		else{
			tbodyHtml = '<tr><td colspan="16">No entries available.</td></tr>';
		}
		$('.accessRequestsContent').html(tbodyHtml);
	}
	else{
		$('.accessRequestsTop .rightHuddle').hide();
	}
}

function showAccessRequestLoc(latitude, longitude){
	$('.accessRequestsLocationModal').detach();
	var modalCard = '<div class="accessRequestsLocationModal"><div class="accessRequestsLocationModalInner"><i style="position:absolute;right:5px;top:5px" class="fa fa-times modalCta"></i><div class="accessRequestsLocationMapInnerWrap"></div></div></div>';
	$('body').append(modalCard);
	$('.accessRequestsLocationMapInnerWrap').locationpicker({
        location: {latitude: latitude, longitude: longitude},
        radius: 50,
        onchanged: function (currentLocation, radius, isMarkerDropped) {
            // Uncomment line below to show alert on each Location Changed event
            //alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
        }
    });
	$('.accessRequestsLocationMapInnerWrap').locationpicker('autosize');
	$('.accessRequestsLocationModal').fadeIn(150).css("display","flex");
}

function paginateAccessRequests(arg)
{
	window.accessRequestsPagination = null;
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
		try {
			window.accessRequestsPagination = {"start":arg["start"],"current":currentPage,"count":arg["count"],"pages":pages};
		}
		catch(e)
		{
			console.log(e);
		}
	}
	if(arg["data"] && window.accessRequestsPagination)
	{
		if(currentPage == 1 && currentPage == window.accessRequestsPagination["pages"])
		{
			pDiv.find('.numberNavLink.first, .numberNavLink.previous, .numberNavLink.last, .numberNavLink.next').hide();
		}
		else if(currentPage == 1 && currentPage != window.accessRequestsPagination["pages"])
		{
			pDiv.find('.numberNavLink.first, .numberNavLink.previous').hide();
			pDiv.find('.numberNavLink.last, .numberNavLink.next').show();
		}
		else if(currentPage != 1 && currentPage == window.accessRequestsPagination["pages"])
		{
			pDiv.find('.numberNavLink.first, .numberNavLink.previous').show();
			pDiv.find('.numberNavLink.last, .numberNavLink.next').hide();
		}
		else
		{
			pDiv.find('.numberNavLink.first, .numberNavLink.previous').show();
			pDiv.find('.numberNavLink.last, .numberNavLink.next').show();
		}
		pDiv.children('.rightHuddle').show();
	}
	else{
		pDiv.children('.rightHuddle').hide();
	}
}

$(document).on("click", ".accessRequests .pageCountCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var countVal = $(this).siblings('.pageResultCount').val();
	if(countVal && parseInt(countVal)){
		renderAccessRequestsHtml({"count":parseInt(countVal), "start":0});
	}
});

// Function on click of the pagination cta on the accessRequests page
$(document).on("click", ".accessRequests .pageNavCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var countVal = $(this).parents('.accessRequestsTop').find('.pageResultCount').val();
	if($(this).siblings('.paginationInput').val() !== '')
	{
		if(parseInt($(this).siblings('.paginationInput').val()) <= window.accessRequestsPagination['pages']){
			var startVal = (parseInt($(this).siblings('.paginationInput').val())-1)*countVal;
		}
		else{
			$(this).siblings('.paginationInput').addClass('error');
			return false;
		}
	}
	else
	{
		$(this).siblings('.paginationInput').focus();
		return false;
	}
	//window.paymentPagination["count"]
	renderAccessRequestsHtml({"count":countVal, "start":startVal});
});

// Function for the clicks on page number links on accessRequests page
$(document).on("click", ".accessRequests .numberNavLink", function(e){
	e.preventDefault(); e.stopPropagation();
	if($(this).hasClass('first'))
	{
		renderAccessRequestsHtml({"count":access_requests_count,"start":0});
	}
	else if($(this).hasClass('previous'))
	{
		if(window.accessRequestsPagination["current"] === 0)
		{
			return false;
		}
		else
		{
			var startVal = (window.accessRequestsPagination["current"] - 2)*access_requests_count;
			renderAccessRequestsHtml({"count":access_requests_count,"start":startVal});
		}
	}
	else if($(this).hasClass('next'))
	{
		if(window.accessRequestsPagination["current"] == window.accessRequestsPagination["pages"])
		{
			return false;
		}
		else
		{
			var startVal = window.accessRequestsPagination["current"] * access_requests_count;
			renderAccessRequestsHtml({"count":access_requests_count,"start":startVal});
		}
	}
	else if($(this).hasClass('last'))
	{
		var startVal = (window.accessRequestsPagination["pages"] - 1) * access_requests_count;
		renderAccessRequestsHtml({"count":access_requests_count,"start":startVal});
	}
});

$(document).on("click", ".accessRequests .moreFiltersCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var det = $('.accessRequestsModal').detach();
	var modalCard = '<div class="accessRequestsModal"><div class="accessRequestsModalInner">Access dates <br><div class="datePickerInput dateInput" style="margin-bottom:10px"><div>From <input type="text" placeholder="DD-MM-YYYY" class="accessStartDate" name="accessStartDate" description="Access start"></div><div>To <input type="text" placeholder="DD-MM-YYYY" class="accessEndDate" name="accessEndDate" description="Access end"></div></div><br>Consumption Dates <br><div class="datePickerInput dateInput" style="margin-bottom:10px"><div>From <input type="text" placeholder="DD-MM-YYYY" class="consumptionStartDate" name="consumptionStartDate" description="Consumption start"></div><div>To <input type="text" placeholder="DD-MM-YYYY" class="consumptionEndDate" name="consumptionEndDate" description="Consumption end"></div></div>By status: <select class="status" name="status" description="Status"><option selected>Status</option><option value="INI">Initiated</option><option value="DNE">Done</option><option value="CAN">Cancelled</option></select><br><br>By access point code: <input type="text" class="accessPointCode" placeholder="Code" name="accessPointCode" description="Access point code" id="accessPointCodeInput" style="width:426px;margin-top:4px" /><br><br>By fulfilment: <select class="isFulfilled" name="isFulfilled" description="Fulfilled"><option selected>Select</option><option value="1">Yes</option><option value="0">No</option></select><br><br><button class="applyMoreFilters">Apply filters</button><button class="modalCta" style="margin-left:15px">Close <i class="fa fa-close"></i></button></div></div>';
	$('body').append(modalCard);
	$('.accessRequestsModal .dateInput input').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.accessRequestsModal .dateInput input').datetimepicker('hide');
		}
	});
	$('#accessPointCodeInput').autocomplete({
		serviceUrl:access_requests_access_codes_url,
		minChars:3,
		dataType:'json',
		paramName: 'search',
		transformResult: function(response) {
			return {
				suggestions: $.map(response.accessMiniDTO, function(dataItem) {
					return { value: dataItem.name+'\n ('+dataItem.address+')', data: dataItem.code };
				})
			};
		},
		onSelect: function (suggestion) {
			$(this).val(suggestion['data']);
		}
	});
/*	$('#accessPointCodeInput').autocomplete({
		lookup: access_requests_access_codes_mapping,
		onSelect: function (suggestion) {
			$(this).val(suggestion['data']);
		}
	}); */
	$('.accessRequestsModal').fadeIn(150).css("display","flex");
});
$(document).on("click", ".accessRequestsModal .modalCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.accessRequestsModal').fadeOut(150);
});

$(document).on("click", ".accessRequestsLocationModal .modalCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.accessRequestsLocationModal').fadeOut(150);
});

$(document).on("click", ".accessRequestsModal .applyMoreFilters", function(e){
	e.preventDefault(); e.stopPropagation();
	var isFormValid = false;
	var formElement = $('.accessRequestsModalInner input, .accessRequestsModalInner select');
	formElement.removeClass('error');
	var selectedFilters = {};
	var selectedFiltersDescription = {};
	for(var i=0; i<formElement.length; i++){
		if(formElement[i] && formElement[i].value && formElement[i].value.length > 0 && formElement[i].value != 'Status' && formElement[i].value != 'Select'){
			selectedFilters[formElement[i].name] = formElement[i].value;
			selectedFiltersDescription[formElement[i].name] = $(formElement[i]).attr('description');
		}
	}
	var keys = Object.keys(selectedFilters);
	if(keys.length == 0){
		formElement.addClass('error');
	}
	else{
		var isFirstDateSetValid = false;
		var isSecondDateSetValid = false;
		if($.inArray('accessStartDate',keys) >= 0){
			if($.inArray('accessEndDate', keys) == -1){
				delete selectedFilters['accessStartDate'];
				$('.accessRequestsModal .accessEndDate').addClass('error');
			}
			else{
				isFirstDateSetValid = true;
			}
		}
		else{
			if($.inArray('accessEndDate', keys) >= 0){
				delete selectedFilters['accessEndDate'];
				$('.accessRequestsModal .accessStartDate').addClass('error');
			}
			else{
				isFirstDateSetValid = true;
			}
		}
		if($.inArray('consumptionStartDate',keys) >= 0){
			if($.inArray('consumptionEndDate', keys) == -1){
				delete selectedFilters['consumptionStartDate'];
				$('.accessRequestsModal .consumptionEndDate').addClass('error');
			}
			else{
				isSecondDateSetValid = true;
			}
		}
		else{
			if($.inArray('consumptionEndDate', keys) >= 0){
				delete selectedFilters['consumptionEndDate'];
				$('.accessRequestsModal .consumptionStartDate').addClass('error');
			}
			else{
				isSecondDateSetValid = true;
			}
		}
		if(isFirstDateSetValid && isSecondDateSetValid){
			isFormValid = true;
		}
	}
	if(isFormValid){
		for(var x in keys){
			access_requests_optional_filters[keys[x]] = selectedFilters[keys[x]];
			access_requests_filter_descriptions[keys[x]] = selectedFiltersDescription[keys[x]];
		}
		setOptionalFiltersHtml(access_requests_optional_filters, '.accessRequests', access_requests_filter_descriptions);
		renderAccessRequestsHtml({"start":0});
		$(this).siblings('.modalCta').click();
	}
	else{
		return false;
	}
});
$(document).on("click", '.accessRequests .cardRow.optionalFilters li i', function(e){
	e.preventDefault(); e.stopPropagation();
	var clickedElement = $(this).attr("data-attr");
	if(clickedElement == 'accessStartDate'){
		delete access_requests_optional_filters['accessStartDate'];
		delete access_requests_optional_filters['accessEndDate'];
	}
	else if(clickedElement == 'consumptionStartDate'){
		delete access_requests_optional_filters['consumptionStartDate'];
		delete access_requests_optional_filters['consumptionEndDate'];
	}
	else{
		delete access_requests_optional_filters[clickedElement];
	}
	$(this).parent().remove();
	if(Object.keys(access_requests_optional_filters).length == 0){
		$('.accessRequests .optionalFilters').hide();
	}
	renderAccessRequestsHtml();
});