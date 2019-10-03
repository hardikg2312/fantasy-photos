$(document).ready(function () {
    // $('#dropdown-menu select, #dropdown-menu-catg select').selectize();
    var count = 0;
    $(".alert").delay(5000).fadeOut(1500);

    $(window).on('shown.bs.modal', function() {
        count += 1;
        if(count < 1){
            $('select').after('<i class="fa fa-caret-down select-arrow" aria-hidden="true"></i>');
        }
    });
    $('#edit_user_form').on("submit", function () {
        if($(this).find('.is-empty').length == 0 && $(this).find('.error').length == 0 ){
            $('#sign-in.loader').show();
        }

    })
    $(document).on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    });

    $('#forgotPasswordForm').on('hidden.bs.modal', function () {
        $('#forgotPasswordForm').find('label.error').remove();
        $('#forgotPasswordForm').find('#forgotPasswordFormErrors').text('');
    });

    $('#new_topic #typeOfDeal_offer').on("change", function (argument) {
        var dealValue = $(this).val();
        if (dealValue == 'Popular-Deal' || dealValue == 'Featured-Deal') {
            $(this).parents('form').find('.deal-url').removeClass('hide');
        }else{
            $(this).parents('form').find('.deal-url').addClass('hide');
        }
    });
    $("#forgotPasswordForm").submit(function(){
        setTimeout(function(){
            $('#forgotPasswordFormErrors').text('');
        },3000)
    });
    $('#merchantImageUpload').on('show.bs.modal', function (e) {
        $('input[type="file"]').on('change', function(event) {
            CheckFileName($(this));
        });
    });
    function CheckFileName(file) {
        var fileValue = file.val().split(".").pop().toUpperCase();
        if (fileValue == "PNG" || fileValue == "JPEG" || fileValue == "GIF" || fileValue == "JPG")
            return true;
        else {

            file.after('<label class="error">Upload a valid file with png/jpeg/gif extensions only.</label>')
            $(file).val('');
            setTimeout(function(){
		$(file).next('label').remove();
            },2500);
            return false;
        }
        return true;
    }
    $('input[type="file"]').on('change', function(event) {
        CheckFileName($(this));
    });

    $('.notification-main .notifications-group').each(function(index, el) {
	$(this).find('.inner-content div').each(function(index, el) {
            if (index % 2 != 0) {
		$(this).addClass('odd-section');
            }
	});
    });

    $(document).on('click', '.faq-back', function(event) {
        event.preventDefault();
        window.history.back();
    });
    $('.userMainMenu ul.nav .dropdown').hover(function() {
        $(this).addClass('open');
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function() {
        $(this).removeClass('open');
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );
    $('#accordion .collapse').on('shown.bs.collapse', function(){
        $(this).parent().find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
    }).on('hidden.bs.collapse', function(){
        $(this).parent().find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
    });



    $(".new_user_payment").validate({

        rules: {
            "user_payment[amount]":{
                min: 1,
                number: true,
                required: true
            }
        }

    });

    $(".new_topic").validate({

        rules: {
            "topic[price]":{
                maxlength: 15,
                required: true,
                number: true
            },
            "topic[mrp]":{
                maxlength: 15,
                required: true,
                number: true
            },
            "topic[shipping_cost]":{
                maxlength: 15,
                required: true,
                number: true
            },
            "topic[percent_off]":{
                maxlength: 5,
                required: true,
                number: true
            },
            "topic[deal_url]" : {
                required: true,
                url: true
            }
        },messages: {

            "topic[deal_url]" : {
                required: "Please add ‘http://’ followed by your website url. Example:http://www.yourdomain.com"

            }
        }

    });

    $("#user_form, .edit_user").validate({
        rules: {
            "user[login]":{
                required: true,
                minlength: 3
            },
            "user[email]":{
                required: true,
                email: true
            },
            "user[password]":{
                minlength: 8
            },
            "user[password_confirmation]":{
                minlength: 8,
                equalTo: "#user_password"
            },
            "user[phone_number]" : {
                required: true,
                maxlength: 15,
                minlength: 10,
                number: true
            },
            "user[company_url]" : {
                required: true,
                url: true
            },
            "user[address]" : {
                required: true,
                minlength: 10
            },
            "user[company_name]" : {
                required: true,
            },
            "user[reg_company_name]" : {
                required: true,
                minlength: 10
            }
        },
        messages: {
            "user[login]":{
                required: "Required.",
                minlength: "Min Length is 3 characters"
            },
            "user[email]":{
                required: "Required.",
                email: "A valid email address is required"
            },
            "user[password]":{
                required: "Required.",
                minlength: "Min Length is 8 characters"
            },
            "user[company_url]" : {
                required: "Please add ‘http://’ followed by your website url. Example:http://www.yourdomain.com"
            },
            "user[company_name]" : {
                required: "Required."
            },
            "user[reg_company_name]" : {
                required: "Required.",
                minlength: "Min Length is 10 characters"
            },
            "user[address]" : {
                required: "Required.",
                minlength: "Min Length is 10 characters"
            },
            "user[password_confirmation]":{
                required: "Required.",
                minlength: "Min Length is 8 characters",
                equalTo: "Password Confirmation Doesn't Match"
            }
        }

    });
    $(".edit_merchant,.new_merchant").validate({

        rules: {

            "merchant[email]":{
                required: true,
                email: true
            },

            "merchant[merchant_phone_number]" : {
                maxlength: 15  ,
                minlength: 8,
                number: true,
                required: true
            },
            "merchant[merchant_url]" : {
                required: true,
                url: true
            },
            "merchant[merchant_email]" : {
                required: true,
                email: true
            }

        },
        messages: {

            "merchant[email]":{
                required: "This field is required.",
                email: "A valid email address is required"
            },
            "merchant[merchant_email]":{
                required: "This field is required.",
                email: "A valid email address is required"
            },
            "merchant[merchant_url]" : {
                required: "Please add ‘http://’ followed by your website url. Example:http://www.yourdomain.com"

            }
        }

    });
    $("#edit_user_form").validate({

        rules: {

            "password":{
                minlength: 8
            },

            "password_confirmation":{
                minlength: 8,
                equalTo: "#password"
            }
        },
        messages: {
            "old_password": {
                required: "Required"
            },
            "password":{
                required: "Required",
                minlength: "Min Length is 8 characters"
            },
            "password_confirmation":{
                required: "Required",
                minlength: "Min Length is 8 characters",
                equalTo: "Password Doesn't Match"
            }
        }

    });
    $("#passwordReset").validate({

        rules: {

            "password":{
                minlength: 8
            },

            "password_confirmation":{
                minlength: 8,
                equalTo: "#reset_password"
            }
        },
        messages: {
            "old_password": {
                required: "Required"
            },
            "password":{
                required: "Required",
                minlength: "Min Length is 8 characters"
            },
            "password_confirmation":{
                required: "Required",
                minlength: "Min Length is 8 characters",
                equalTo: "Password Doesn't Match"
            }
        }

    });
    $("#forgotFormMain").validate({

        rules: {

            "email":{
                required: true,
                email: true
            }
        },
        messages: {
            "email":{
                required: "This field is required.",
                email: "A valid email address is required"
            }
        }

    });



    $(".edit_payout_group_amount").validate({

        rules: {

            "payout_group_amount[amount]":{
                number: true
            }

        }

    });

    $('[data-toggle="modal"]').click(function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        if (url.indexOf('#') == 0) {
            $(url).modal('open');
        } else {
            $.get(url, function(data) {
                $('<div class="modal hide fade">' + data + '</div>').modal();
            }).success(function() { $('input:text:visible:first').focus(); });
        }
    });

    var selectedDeal = $('.selectSpot #typeOfDeal').val();
    $('div.'+selectedDeal).show();

    $('.selectSpot #typeOfDeal').on("change",function(){
	$('.datepicker').datepicker('setDate', null);
	$('.hidden-layer').hide();
	// $("#price_start_date").removeAttr('disabled');
	$('#price_end_date').attr('disabled', true);
	$('.control-group .form-control').val('');
	$('#select_spot_form input[type="submit"]').addClass('disabled');
	$('#select_spot_form input[type="submit"]').attr('disabled', true);
	$('#spotErrors').text('');
	$('#price').text('0');
	$('div.dealDetails').hide();
	$('div.'+$(this).val()).show();
    });

    $('.headerSection').on("click","a",function (event) {
        event.preventDefault();
        switch($(this).attr('href').replace('#','')){
        case "editPersonalInfo":
            if($('#personalInfo').hasClass('active')){
                $('#personalInfo').removeClass('active in');
                $('#editPersonalInfo').addClass('active in');
            }
        case "changePassword":
            $('.editPersonalInfo').fadeOut();
            break;
        default:{
            $('.editPersonalInfo').fadeIn();
        }
        }
    });


    jQuery.extend(jQuery.validator.messages, {
        required: "Required.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please add ‘http://’ followed by your website url. Example:http://www.yourdomain.com",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Please enter a valid number. Characters are not allowed",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        accept: "Please enter a value with a valid extension.",
        maxlength: jQuery.validator.format("Please enter no more than {0} numbers."),
        minlength: jQuery.validator.format("Please enter at least {0} numbers."),
        rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
        range: jQuery.validator.format("Please enter a value between {0} and {1}."),
        max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
        min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
    });



});
