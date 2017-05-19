var d = new Date();
var xMonth = d.getMonth()+1;
var xDay = d.getDate();
var xToday = d.getFullYear() + '-' + (xMonth<10 ? '0' : '') + xMonth + '-' + (xDay<10 ? '0' : '') + xDay;

var inputDescriptionsMapping = {"INI":"Initiated","CNF":"Confirmed","DNE":"Done","CAN":"Cancelled","AUT":"Authenticated","1":"Yes","0":"No"};
function loadLandingPage(){
	// Determine the type of landing page..
	if(true){
		loadDefaultLandingPage();
	}
}
function loadDefaultLandingPage(){
	$('.page').hide();
	if($(landingPage).length > 0){
		$(landingPage).show();
	}
	else{
		var defaultLandingPageHtml = '<div class="page card landing" id="landingPage"><div class="landingTop"><h2 class="cardTitle">Hello! What would you like to explore?</h2></div><div class="landingMain"><div class="row clearfix"><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner accessRequestsLink"><i class="fa fa-tasks linkIcon"></i><span class="linkText">Access Requests</span></div></div><div class="linkWrap col-tn-12 col-xs-6 col-sm-4 col-md-3"><div class="linkWrapInner transactionsLink"><i class="fa fa-exchange linkIcon"></i><span class="linkText">Transactions</span></div></div></div></div></div>';
		$('.main').append(defaultLandingPageHtml);
	}
}

function loadAccessRequestsPage(){
	$('.page').hide();
	if($(accessRequestsPage).length > 0){
		$(accessRequestsPage).show();
		renderAccessRequestsHtml(null);
	}
	else{
		// Fetch and render..
		loadAccessRequests();
	}
}

function loadTransactionsPage(){
	$('.page').hide();
	if($(transactionsPage).length > 0){
		$(transactionsPage).show();
		renderTransactionsHtml(null);
	}
	else{
		// Fetch and render..
		loadTransactions();
	}
}