$(window).load(function(){
	underline();
	var x = window.location.search.replace("?", "");
	if (x.length > 0)
	{
		tmp = x.split('=');
		str = '#' + tmp[1];
		for (var key in checkPoints)
		{
			console.log(checkPoints[key]);
			if (checkPoints[key]['href'] == str)
			{
				$(checkPoints[key]['elem']).click();
			}
		}
	}
});
$(document).ready(function(){
	$('.callbackCTA').click(function(e){
		e.preventDefault(); e.stopPropagation();
		var x = $(this).parent('form');
		if(validate(x))
		{
			$(x).submit();
		}
	});
	$('.callback, .secondary').click(function(){
		$('.modal').fadeIn(100);
		$('.callbackModal').fadeIn(250);
	});
	$('.closeCallback, button.hit').click(function(){
		closeCallback();
	});
	$('.modal').click(function(){
		closeCallback()
	});
	$('.menutoggle').click(function(){
		$('.wrapper, .sidenav').toggleClass('active');
	});
	$('.sidenavlist a').click(function(){
		$('.wrapper, .sidenav').toggleClass('active');
	});
	$('.mediaThumb img').hover(function(){
		var x = $(this).attr('data-switch');
		var y = $(this).attr('src');
		$(this).attr({'src': x, 'data-switch':y});
	},
	function(){
		var x = $(this).attr('data-switch');
		var y = $(this).attr('src');
		$(this).attr({'src': x, 'data-switch':y});
	});
	if($(window).scrollTop() > 600)
	{
		stick();
	}
	else {
		window.scrollFlag = 0;
	}
	checkPoints = {}; i = 0;
	$('.topNav').find('a').each(function(){
		var href = $(this).attr('href');
		var elem = this;
		if(href.indexOf('#') == 0 && href.length > 1)
		{
			var st = parseInt($(""+href+"").offset().top);
			var ste = parseInt($(""+href+"").offset().top + $(""+href+"").height());
			checkPoints[i+1] = {"elem" : elem, "href" : href, "scrollStart" : st, "scrollEnd" : ste};
			i++;
		}
	});
	$(window).scroll(function(e){
		underline(e);
		if($(window).scrollTop() > 500 && window.scrollFlag == 0)
		{
			stick();
		}
		else if($(window).scrollTop() < 500 && window.scrollFlag == 1)
		{
			nonstick();
		}
		
	});
	$('.indicator img').click(function(){
		var t = $('section.home').height();
		$("html, body").animate({scrollTop:t}, 800, 'swing');
	});
	$('.sectionCTA').click(function(){
		toggleHidden(this);
	});
	$(function() {
	function filterPath(string) {
		return string
		.replace(/^\//,'')
		.replace(/(index|default).[a-zA-Z]{3,4}$/,'')
		.replace(/\/$/,'');
	}
	var locationPath = filterPath(location.pathname);
	var scrollElem = scrollableElement('html', 'body');
	// Any links with hash tags in them (can't do ^= because of fully qualified URL potential)
	$('a[href*=#]').not('.callback, .secondary').each(function() {
	// Ensure it's a same-page link
	var thisPath = filterPath(this.pathname) || locationPath;
	if (  locationPath == thisPath
		&& (location.hostname == this.hostname || !this.hostname)
		&& this.hash.replace(/#/,'') ) {
			// Ensure target exists
			var $target = $(this.hash), target = this.hash;
			if (target) {
				// Find location of target
				var targetOffset = $target.offset().top;
				targetOffset -= (this.hash == '#how') ? 100 : 50;
				$(this).click(function(event) {
					// Prevent jump-down
					event.preventDefault();
					event.stopPropagation();
					// Animate to target
					$(scrollElem).animate({scrollTop: targetOffset}, 800);
				});
			}
		}
	});
	// Use the first element that is "scrollable"  (cross-browser fix?)
	function scrollableElement(els) {
		for (var i = 0, argLength = arguments.length; i <argLength; i++) {
			var el = arguments[i],
			$scrollElement = $(el);
			if ($scrollElement.scrollTop()> 0) {
				return el;
			} else {
				$scrollElement.scrollTop(1);
				var isScrollable = $scrollElement.scrollTop()> 0;
				$scrollElement.scrollTop(0);
				if (isScrollable) {
					return el;
				}
			}
		}
		return [];
	}
});
});
function closeCallback()
{
	$('.callbackModal').fadeOut(100);
	$('.modal').fadeOut(250);
	$('.callbackModal').removeClass('hit miss');
}
function underline(eventobj)
{
	for (var indx in checkPoints)
	{
		if($(window).scrollTop() >= checkPoints[indx]["scrollStart"]-200 && $(window).scrollTop() <= checkPoints[indx]["scrollEnd"]-200)
		{
			$('.topNav a').removeClass('current');
			$(checkPoints[indx]["elem"]).addClass('current');
		}
		else if($(window).scrollTop() <= checkPoints[1]["scrollStart"]-200)
		{
			$('.topNav a').removeClass('current');
		}
	}
}
var logo = $('.topLogo img');
function stick(){
	$('.topNav').addClass('sticky');
	window.scrollFlag = 1;
	var x = $(logo).attr('data-switch');
	var y = $(logo).attr('src');
	$(logo).attr({'src': x, 'data-switch':y});
}
function nonstick(){
	$('.topNav').removeClass('sticky');
	window.scrollFlag = 0;
	var x = $(logo).attr('data-switch');
	var y = $(logo).attr('src');
	$(logo).attr({'src': x, 'data-switch':y});
}
function toggleHidden(obj){
	$(obj).parents('section.pageBlocks').find('.hidden').toggle(300);
	var fin = ($(obj).text() == 'View More') ? 'View Less' : 'View More';
	$(obj).text(fin);
}
function validate(formobj){
	var nameobj = $(formobj).find('input').eq(0);
	var emailobj = $(formobj).find('input').eq(1);
	var mobileobj = $(formobj).find('input').eq(2);
	var namestr = nameobj.val();
	if (nameobj.val() == '' || nameobj.val().length < 3)
	{
		nameobj.addClass('error').focus();
		return false;
	}
	else if (/^[a-zA-Z ]*$/.test(namestr) == false)
	{
		nameobj.addClass('error').focus();
		return false;
	}
	else if (emailobj.val() == '' || emailobj.val().length < 6 || !isNaN(emailobj.val()) || emailobj.val().indexOf('@') == -1 || emailobj.val().indexOf('.') == -1)
	{
		nameobj.removeClass('error');
		emailobj.addClass('error').focus();
		return false;
	}
	else if (mobileobj.val() == '' || mobileobj.val().length < 10)
	{
		emailobj.removeClass('error');
		mobileobj.addClass('error').focus();
		return false;
	}
	else
	{
		$(formobj).find('input').each(function(){
			$(this).removeClass('error');
		});
		return true;
	}
}