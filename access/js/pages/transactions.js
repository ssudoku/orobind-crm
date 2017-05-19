var transactions_start_date = xToday;
var transactions_end_date = xToday;
var transactions_start = 0;
var transactions_count = 30;
var transactions_optional_filters = {};
var transactions_filter_descriptions = {};
// Optional, ignore if using relative URLs
var transactions_base_url = window.location.protocol+'//'+window.location.host+'/';
var transactions_url = transactions_base_url+'panel/access/gettransaction?';
function loadTransactions(){
	var basicPageContentHtml = '<div class="page card transactions" id="transactionsPage"><div class="cardRow transactionsTop"><div class="leftHuddle"><h2 class="cardTitle">Transactions</h2><div class="transactionsWhen dateControlWidget"><div class="transactionsWhenSelect dropDown"><input type="text" value="Today" class="whenText"><button class="whenToggle"><i class="fa fa-chevron-down fa-lg"></i></button></div><form class="transactionsDatepicker controlForm" style="display: none;"><input type="radio" id="today" name="listtype" checked=""><label for="today">Today</label><br><hr class="sessionDivider"><input type="radio" id="bydate" name="listtype"><label for="bydate">Between dates</label><div class="datePickerInput dateInput">From <input type="text" placeholder="DD-MM-YYYY" class="startDate"> To <input type="text" placeholder="DD-MM-YYYY" class="endDate"><button class="datePickerSubmit dateControlSubmit" data-module="transactions">Fetch Transactions</button></div></form></div><p class="resultLabel">Results per page</p><input type="text" value="30" class="pageResultCount"><button class="pageCountCta"><i class="fa fa-refresh"></i></button><button class="moreFiltersCta" style="margin-left:15px"><i class="fa fa-filter"></i></button></div><div class="rightHuddle"><div class="numberNav"><a href="#" class="numberNavLink first"><i class="fa fa-angle-double-left"></i></a><a href="#" class="numberNavLink previous"><i class="fa fa-angle-left"></i></a></div><p class="status">Showing <span class="which">1</span> of <span class="totalCount">1</span></p><div class="numberNav"><a href="#" class="numberNavLink next"><i class="fa fa-angle-right" data-attr="email"></i></a><a href="#" class="numberNavLink last"><i class="fa fa-angle-double-right"></i></a></div><input type="text" placeholder="Page" class="paginationInput"><button class="pageNavCta">Go</button></div></div><div class="cardRow optionalFilters"><ul></ul></div><div class="cardRow transactionsMain"><table class="transactionsList"><thead><tr><th>Amount (<i class="fa fa-rupee"></i>)</th><th>Payment Amount (<i class="fa fa-rupee"></i>)</th><th>Offer Amount (<i class="fa fa-rupee"></i>)</th><th>Transaction Code</th><th>Transaction Date</th><th>Status</th><th>Payment Mode</th><th>Username</th><th>User Email</th></tr></thead><tbody class="transactionsContent"></tbody></table></div></div>';
	$('.main').append(basicPageContentHtml);
	$('.transactions .dateInput .startDate, .transactions .dateInput .endDate').datetimepicker({
		timepicker:false,
		format: 'Y-m-d',
		onChangeDateTime: function(){
			$('.transactions .dateInput .startDate, .transactions .dateInput .endDate').datetimepicker('hide');
		}
	});
	renderTransactionsHtml(null);
}

function renderTransactionsHtml(obj){
	if(obj){
		if(obj['startDate']){
			transactions_start_date = obj['startDate'];
		}
		if(obj['endDate']){
			transactions_end_date = obj['endDate'];
		}
		if(obj['start'] || obj['start'] == 0){
			transactions_start = obj['start'];
		}
		if(obj['count']){
			transactions_count = obj['count'];
		}
	}
	var url = transactions_url+'startDate='+transactions_start_date+'&endDate='+transactions_end_date+'&count='+transactions_count+'&start='+transactions_start;
	for(var x in Object.keys(transactions_optional_filters)){
		url += '&'+Object.keys(transactions_optional_filters)[x]+'='+transactions_optional_filters[Object.keys(transactions_optional_filters)[x]];
	}
	console.log(url);
	var x =getData(url);
	if(x){
		paginateTransactions({"start":transactions_start,"count":transactions_count,"data":x,"parentDiv":$('.transactionsTop')});
		var tbodyHtml = '';
		if(x["responseCode"] && x["responseCode"] == 1000 && x['accessUserTransactionDTO'] && x['accessUserTransactionDTO'].length > 0){
			for(var i=0; i<x['accessUserTransactionDTO'].length; i++){
				tbodyHtml += '<tr>';
				tbodyHtml += '<td>'+x['accessUserTransactionDTO'][i]['amount']+'</td>';
				tbodyHtml += '<td>'+x['accessUserTransactionDTO'][i]['paymentAmount']+'</td>';
				tbodyHtml += '<td>'+x['accessUserTransactionDTO'][i]['offerAmount']+'</td>';
				tbodyHtml += '<td>'+x['accessUserTransactionDTO'][i]['transactionCode']+'</td>';
				tbodyHtml += '<td>'+x['accessUserTransactionDTO'][i]['txnDate']+'</td>';
				tbodyHtml += '<td>'+x['accessUserTransactionDTO'][i]['status']+'</td>';
				tbodyHtml += '<td>'+x['accessUserTransactionDTO'][i]['paymentMode']+'</td>';
				tbodyHtml += '<td>'+x['accessUserTransactionDTO'][i]['userName']+'</td>';
				tbodyHtml += '<td><a href="mailto:'+x['accessUserTransactionDTO'][i]['userEmail']+'" target="_top">'+x['accessUserTransactionDTO'][i]['userEmail']+'</a></td>';
				tbodyHtml += '</tr>';
			}
		}
		else{
			tbodyHtml = '<tr><td colspan="9">No entries available.</td></tr>';
		}
		$('.transactionsContent').html(tbodyHtml);
	}
	else{
		$('.transactionsTop .rightHuddle').hide();
	}
	
}

function paginateTransactions(arg)
{
	window.transactionsPagination = null;
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
			window.transactionsPagination = {"start":arg["start"],"current":currentPage,"count":arg["count"],"pages":pages};
		}
		catch(e)
		{
			console.log(e);
		}
	}
	if(arg["data"] && window.transactionsPagination)
	{
		if(currentPage == 1 && currentPage == window.transactionsPagination["pages"])
		{
			pDiv.find('.numberNavLink.first, .numberNavLink.previous, .numberNavLink.last, .numberNavLink.next').hide();
		}
		else if(currentPage == 1 && currentPage != window.transactionsPagination["pages"])
		{
			pDiv.find('.numberNavLink.first, .numberNavLink.previous').hide();
			pDiv.find('.numberNavLink.last, .numberNavLink.next').show();
		}
		else if(currentPage != 1 && currentPage == window.transactionsPagination["pages"])
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

$(document).on("click", ".transactions .pageCountCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var countVal = $(this).siblings('.pageResultCount').val();
	if(countVal && parseInt(countVal)){
		renderTransactionsHtml({"count":parseInt(countVal), "start":0});
	}
});

// Function on click of the pagination cta on the transactions page
$(document).on("click", ".transactions .pageNavCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$(this).siblings('.paginationInput').removeClass('error');
	var countVal = $(this).parents('.transactionsTop').find('.pageResultCount').val();
	if($(this).siblings('.paginationInput').val() !== '')
	{
		if(parseInt($(this).siblings('.paginationInput').val()) <= window.transactionsPagination['pages']){
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
	renderTransactionsHtml({"count":countVal, "start":startVal});
});

// Function for the clicks on page number links on transactions page
$(document).on("click", ".transactions .numberNavLink", function(e){
	e.preventDefault(); e.stopPropagation();
	if($(this).hasClass('first'))
	{
		renderTransactionsHtml({"count":transactions_count,"start":0});
	}
	else if($(this).hasClass('previous'))
	{
		if(window.transactionsPagination["current"] === 0)
		{
			return false;
		}
		else
		{
			var startVal = (window.transactionsPagination["current"] - 2)*transactions_count;
			renderTransactionsHtml({"count":transactions_count,"start":startVal});
		}
	}
	else if($(this).hasClass('next'))
	{
		if(window.transactionsPagination["current"] == window.transactionsPagination["pages"])
		{
			return false;
		}
		else
		{
			var startVal = window.transactionsPagination["current"] * transactions_count;
			renderTransactionsHtml({"count":transactions_count,"start":startVal});
		}
	}
	else if($(this).hasClass('last'))
	{
		var startVal = (window.transactionsPagination["pages"] - 1) * transactions_count;
		renderTransactionsHtml({"count":transactions_count,"start":startVal});
	}
});

$(document).on("click", ".transactions .moreFiltersCta", function(e){
	e.preventDefault(); e.stopPropagation();
	var det = $('.transactionsModal').detach();
	var modalCard = '<div class="transactionsModal"><div class="transactionsModalInner">User email: <input type="text" class="userEmail" placeholder="User email" name="email" description="User email" /><br><br>By status: <select class="status" name="status" description="Status"><option selected>Status</option><option value="INI">Initiated</option><option value="AUT">Authenticated</option></select><br><br><button class="applyMoreFilters">Apply filters</button><button class="modalCta" style="margin-left:15px">Close <i class="fa fa-close"></i></button></div></div>';
	$('body').append(modalCard);
	$('.transactionsModal').fadeIn(150).css("display","flex");
});
$(document).on("click", ".transactionsModal .modalCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.transactionsModal').fadeOut(150);
});
$(document).on("click", ".transactionsModal .applyMoreFilters", function(e){
	e.preventDefault(); e.stopPropagation();
/*	var userEmail = $(this).siblings('.userEmail').val();
	var status = $(this).siblings('.status').val();
	if(!userEmail && status == 'Status'){
		$(this).siblings('.userEmail').addClass('error');
		$(this).siblings('.status').addClass('error');
		return false;
	}
	else{
		$('.transactionsModal .modalCta').click();
		if(userEmail && status != 'Status'){
			renderTransactionsHtml({"userEmail":userEmail, "status":status, "start":0});
		}
		else if(userEmail && status == 'Status'){
			renderTransactionsHtml({"userEmail":userEmail, "start":0});
		}
		else{
			renderTransactionsHtml({"status":status, "start":0});
		}
	} */
	var formElement = $('.transactionsModalInner input, .transactionsModalInner select');
	for(var i=0; i<formElement.length; i++){
		if(formElement[i] && formElement[i].value && formElement[i].value.length > 0 && formElement[i].value != 'Status'){
			transactions_optional_filters[formElement[i].name] = formElement[i].value;
			transactions_filter_descriptions[formElement[i].name] = $(formElement[i]).attr("description");
		}
	}
	if(Object.keys(transactions_optional_filters).length == 0){
		formElement.addClass('error');
		return false;
	}
	else{
		setOptionalFiltersHtml(transactions_optional_filters, '.transactions', transactions_filter_descriptions);
		renderTransactionsHtml({"start":0});
		$(this).siblings('.modalCta').click();
	}
});
$(document).on("click", '.transactions .cardRow.optionalFilters li i', function(e){
	e.preventDefault(); e.stopPropagation();
	delete transactions_optional_filters[$(this).attr("data-attr")];
	$(this).parent().remove();
	if(Object.keys(transactions_optional_filters).length == 0){
		$('.transactions .optionalFilters').hide();
	}
	renderTransactionsHtml();
});