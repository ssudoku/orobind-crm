$(document).on("click",".dateControlWidget .dropDown input, .dateControlWidget .dropDown button", function(){
	$('.dateControlWidget .controlForm').slideToggle(150);
});
$(document).on("click",".dateControlWidget .dateControlSubmit", function(e){
	e.preventDefault(); e.stopPropagation();
	var mod = $(this).attr("data-module");
	switch(mod) {
		case 'transactions':
			$('.transactions .error').removeClass('error');
			var isFormValid = false;
			var whenText = '';
			var checkedValue = $('.transactions input[type=radio][name=listtype]:checked').attr('id');
			var stDt = $(this).siblings('.startDate').val();
			var enDt = $(this).siblings('.endDate').val();
			if(checkedValue == 'today'){
				stDt = xToday;
				enDt = xToday;
				isFormValid = true;
				whenText = 'Today';
			}
			else{
				if(!stDt || !enDt){
					if(!stDt && !enDt){
						$(this).siblings('.startDate').addClass('error');
						$(this).siblings('.endDate').addClass('error');
					}
					else if(!stDt){
						$(this).siblings('.startDate').addClass('error');
					}
					else{
						$(this).siblings('.endDate').addClass('error');
					}
				}
				else{
					isFormValid = true;
					whenText = 'Between dates';
				}
			}
			if(isFormValid){
				$('.dateControlWidget .controlForm').slideToggle(150);
				$('.transactionsWhenSelect input.whenText').val(whenText);
				renderTransactionsHtml({"startDate":stDt,"endDate":enDt});
			}
		break;
		case 'accessRequests':
			$('.accessRequests .error').removeClass('error');
			var isFormValid = false;
			var whenText = '';
			var checkedValue = $('.accessRequests input[type=radio][name=listtype]:checked').attr('id');
			var stDt = $(this).siblings('.startDate').val();
			var enDt = $(this).siblings('.endDate').val();
			if(checkedValue == 'today'){
				stDt = xToday;
				enDt = xToday;
				isFormValid = true;
				whenText = 'Today';
			}
			else{
				if(!stDt || !enDt){
					if(!stDt && !enDt){
						$(this).siblings('.startDate').addClass('error');
						$(this).siblings('.endDate').addClass('error');
					}
					else if(!stDt){
						$(this).siblings('.startDate').addClass('error');
					}
					else{
						$(this).siblings('.endDate').addClass('error');
					}
				}
				else{
					isFormValid = true;
					whenText = 'Between dates';
				}
			}
			if(isFormValid){
				$('.dateControlWidget .controlForm').slideToggle(150);
				$('.accessRequestsWhenSelect input.whenText').val(whenText);
				renderAccessRequestsHtml({"startDate":stDt,"endDate":enDt});
			}
		break;
	}
});

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

function attachLoader()
{
	var loaderCard = '<div class="loader"><h4 class="loaderText">Waiting</h4><img class="loaderImg" src="http://cdn.orobind.com/srv/static/imagesV2/orobind-spinning-clock.gif"></div>';
	$('body').append(loaderCard);
}
function detachLoader()
{
	$('.loader').detach();
}

function showModalMessage(arg)
{
	var det = $('.messageModal').detach();
	if(arg["width"]) // small, wide, xl, xxl
	{
		var modalCard = '<div class="messageModal '+ arg["width"] +'"><div class="messageModalInner"><p class="modalText"></p><button class="modalCta">Close <i class="fa fa-close"></i></button></div></div>';
	}
	else
	{
		var modalCard = '<div class="messageModal"><div class="messageModalInner"><p class="modalText"></p><button class="modalCta">Close <i class="fa fa-close"></i></button></div></div>';
	}
	var message = arg["message"];
	var duration = parseInt(arg["duration"])|| 3000 ;
	$('body').append(modalCard);
	$('.messageModal .modalText').html(message);
	$('.messageModal').fadeIn(150).css("display","flex");
	setTimeout(function(){
		$('.messageModal .modalCta').click();
	},duration);
}
$(document).on("click", ".messageModal .modalCta", function(e){
	e.preventDefault(); e.stopPropagation();
	$('.messageModal').fadeOut(150);
});

function setOptionalFiltersHtml(obj, mainClass, obj1){
	var keys = Object.keys(obj);
	if(keys.length > 0){
		var normalKeys = new Array();
		var coupledKeys = new Array();
		for(var x in keys){
			if(keys[x] == 'accessStartDate' || keys[x] == 'accessEndDate' || keys[x] == 'consumptionStartDate' || keys[x] == 'consumptionEndDate'){
				coupledKeys.push(keys[x]);
			}
			else{
				normalKeys.push(keys[x]);
			}
		}
		var contentDOM = $(mainClass+' .cardRow.optionalFilters ul');
		contentDOM.html('');
		$(mainClass+' .cardRow.optionalFilters').css('display','flex');
		if($.inArray('accessStartDate', coupledKeys) >= 0){
			contentDOM.append('<li class="optionalFilterItem">'+obj1['accessStartDate']+' - \''+obj['accessStartDate']+'\', '+obj1['accessEndDate']+' - \''+obj['accessEndDate']+'\'<i class="fa fa-times" data-attr="accessStartDate"></i></li>');
		}
		if($.inArray('consumptionStartDate', coupledKeys) >= 0){
			contentDOM.append('<li class="optionalFilterItem">'+obj1['consumptionStartDate']+' - \''+obj['consumptionStartDate']+'\', '+obj1['consumptionEndDate']+' - \''+obj['consumptionEndDate']+'\'<i class="fa fa-times" data-attr="consumptionStartDate"></i></li>');
		}
		for(var x in normalKeys){
			if(normalKeys[x] == 'status' || normalKeys[x] == 'isFulfilled'){
				contentDOM.append('<li class="optionalFilterItem">'+obj1[normalKeys[x]]+' - \''+inputDescriptionsMapping[obj[normalKeys[x]]]+'\'<i class="fa fa-times" data-attr="'+normalKeys[x]+'"></i></li>');
			}
			else{
				contentDOM.append('<li class="optionalFilterItem">'+obj1[normalKeys[x]]+' - \''+obj[normalKeys[x]]+'\'<i class="fa fa-times" data-attr="'+normalKeys[x]+'"></i></li>');
			}
		}
	}
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