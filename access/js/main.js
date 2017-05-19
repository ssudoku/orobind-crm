var landingPage = '#landingPage';
var accessRequestsPage = '#accessRequestsPage';
var transactionsPage = '#transactionsPage';

$(document).on("click", ".sideNavToggle", function(e){
	$('.leftBar').toggleClass('active');
});

$(document).ready(function() {
	loadLandingPage();
});
$(document).on("click",'.accessRequestsLink',function(e){
	if($(this).hasClass('sideNavItems')){
		$('.sideNavToggle').click();
	}
	loadAccessRequestsPage();
});
$(document).on("click",'.transactionsLink',function(e){
	if($(this).hasClass('sideNavItems')){
		$('.sideNavToggle').click();
	}
	loadTransactionsPage();
});
$(document).on("click",'.home',function(e){
	loadLandingPage();
});
$(document).on("click",'.switchCRMCta',function(e){
	e.preventDefault(); e.stopPropagation();
	window.location.href = window.location.protocol+'//'+window.location.host+'/panel';
});