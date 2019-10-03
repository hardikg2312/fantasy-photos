// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//

















$(document).ready(function(){
    var nowDate = new Date();
    var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
    $('#approveModal, #newPayoutGroupAmount').on('show.bs.modal', function (e) {
        $("#dropdown-menu select").dropdown();
        $.material.init();
        // $('.datepicker').datepicker();
    });
    $.material.init();

    $('.datepicker').datepicker({
    	format: "yyyy-mm-dd",
	autoclose: true,
	startDate: '0d',
	endDate: '+29d'
    });


    $("#dropdown-menu select, #dropdown-menu-deal select, #dropdown-menu-catg select").dropdown();
    $("#dropdown-menu-banking select, #merchantHubReports_length select").dropdown();
    $("#dropdown-menu-cod select").dropdown();

    $('#typeOfDeal').on('change', function (event) {
    	var deal_type = $(this).val();
    	$('#typeOfDeal_offer').val(deal_type);
    });
    $('#create_deal').on('click', function (event) {
	// $('#select_spot_form').submit();
	// $('#create_deal').attr('disabled', true);
    	var start_date = $('#price_start_date').datepicker('getDate');
    	var end_date = $('#price_end_date').datepicker('getDate');
    	$('#topic_create_flow').html();
    });
    $('#price_start_date').datepicker().on('changeDate', function (event) {
    	var start_date = $(this).datepicker('getDate');
    	$('#price_start_date_offer').datepicker('setDate', start_date);
	$("#price_end_date").removeAttr("disabled");
    });
    $('#price_end_date').datepicker().on('changeDate', function (event) {
    	var end_date = $(this).datepicker('getDate');
    	$('#price_end_date_offer').datepicker('setDate', end_date);
        $('.hidden-layer').show();
    });
    $('#price_end_date').datepicker().on('changeDate', function (event) {
        $(".price_container").hide();
        
    	var end_date = $(this).datepicker('getDate');
	if (end_date){
        $(".price_loader").show();
	    $.ajax({
		url: '/get_price',
		type: 'GET',
		data: $('#select_spot_form').serialize(),
		success: function(result) {
		    $(".price_loader").hide();
                    $(".price_container").show();
		}
	    });
	}
    });
    $(document).on('click', '#offer_details_form_submit', function() {
    	// $.ajax({
	//        url: $('#offer_details_form').attr("action"),
	//        type: 'POST',
	//        data: $('#offer_details_form').serialize(),
	//        success: function(result) {
    	// 	// ... Process the result ...
	//        }
    	// });
        // $('.loader').show();
        var that = $(this);
        setTimeout(function(){

            if(that.parents('form').find('.error').length < 1 ){

                $('.loader').show();
            }
        },0)


    });

    $('#add_money_to_wallet').on('click', function (event) {
	$.ajax({
            url: $('#payment_form').attr("action"),
            type: 'POST',
            data: $('#payment_form').serialize(),
            success: function(result) {
		// ... Process the result ...
            }
	});
    })
    $(document).on('click', '#new_payout_group_amount_11111', function() {
	var payout_group_id = $('.payout_group .active a').attr('data-type');
	$.ajax({
            url: '/admin/payout_groups/'+ payout_group_id + '/payout_group_amounts/new',
            type: 'GET',
            success: function(result) {
	        $(".new_payout_group_amount").validate({

                    rules: {

                        "payout_group_amount[amount]":{
                            number: true
                        }

                    }

                });
            }
	});
    });
    $(document).on('click', '#payout_group_basic, #payout_group_premium, #payout_group_super_premium', function() {
	var payout_group_id = $('.payout_group .active a').attr('data-type');
	$.ajax({
            url: '/admin/payout_groups/'+ payout_group_id + '/payout_group_amounts',
            type: 'GET',
            success: function(result) {
		// ... Process the result ...
            }
	});
    });
    $('#topic_start_date').on('changeDate', function(event) {
	var start_date = $(this).val();
	var start_date = $(this).datepicker('getDate');
	var deal_type = $('#topic_deal_type :selected').text();
	if (deal_type == "Thread" || deal_type == "Popular-Deal") {
    	    var end_days = 1;
	}
	else if (deal_type == "Featured-Deal") {
    	    var end_days = 14;
	}
	start_date.setDate(start_date.getDate() + end_days);
	$('#topic_end_date').datepicker('setDate', start_date);
    });

    jQuery.fn.dataTableExt.oApi.fnSetFilteringDelay = function ( oSettings, iDelay ) {
	/*
	 * Inputs: object:oSettings - dataTables settings object - automatically given
	 * integer:iDelay - delay in milliseconds
	 * Usage: $('#example').dataTable().fnSetFilteringDelay(250);
	 * Author: Zygimantas Berziunas (www.zygimantas.com) and Allan Jardine
	 * License: GPL v2 or BSD 3 point style
	 * Contact: zygimantas.berziunas /AT\ hotmail.com
	 */
	var
	_that = this,
	iDelay = (typeof iDelay == 'undefined') ? 250 : iDelay;

	this.each( function ( i ) {
            $.fn.dataTableExt.iApiIndex = i;
            var
            $this = this,
            oTimerId = null,
            sPreviousSearch = null,
            anControl = $( 'input', _that.fnSettings().aanFeatures.f );

            anControl.unbind( 'keyup' ).bind( 'keyup', function() {
		var $$this = $this;

		if (sPreviousSearch === null || sPreviousSearch != anControl.val()) {
                    window.clearTimeout(oTimerId);
                    sPreviousSearch = anControl.val();
                    oTimerId = window.setTimeout(function() {
			$.fn.dataTableExt.iApiIndex = i;
			_that.fnFilter( anControl.val() );
                    }, iDelay);
		}
            });

            return this;
	} );
	return this;
    }

    $('#merchantHubReports').dataTable({
        sPaginationType: "full_numbers",
        iDisplayLength: 25,
        bProcessing: true,
        bServerSide: true,
        sAjaxSource: $('#merchantHubReports').data('source'),
	"order": [[ 2, "desc" ]],
        "oLanguage": {
            "sSearch": "",
            "search": "Search..."
        },
        "initComplete": function () {
            var api = this.api();
            $('.dataTables_filter label').append('<button class="btn search-btn"><i class="fa search-icon"></i></button>')
        },
	"processing": true,
        "serverSide": true,
        aaSorting: [[2, 'asc']]
        //  null]
    }).fnSetFilteringDelay(1000);

    $('#topic_admin_list').dataTable({
	sPaginationType: "full_numbers",
	iDisplayLength: 25,
	bProcessing: true,
	bServerSide: true,
	// "order": [[ 5, "desc" ]],
	"oLanguage": {
            "sSearch": "",
            "search": "Search..."
	},
	"initComplete": function () {
            var api = this.api();
            $('.dataTables_filter label').append('<button class="btn search-btn"><i class="fa search-icon"></i></button>')
	},
	"processing": true,
        "serverSide": true,
	aaSorting: [[ 3, "desc" ]],
        "ajax": {
	    "url": "/admin/topics/",
	    "type": "get",
	    "data": function ( d ) {
                d.myKey = $('.topic_type .active a').attr('data-type');
            }
        }
    }).fnSetFilteringDelay(500);

    $('#merchant_admin_list').dataTable({
	sPaginationType: "full_numbers",
	iDisplayLength: 25,
	bProcessing: true,
	bServerSide: true,

	sAjaxSource: $('#merchant_admin_list').data('source'),
	aaSorting: [[ 3, "desc" ]],
	"oLanguage": {
            "sSearch": "",
            "search": "Search..."
	},
	"initComplete": function () {
            var api = this.api();
            $('.dataTables_filter label').append('<button class="btn search-btn"><i class="fa search-icon"></i></button>')
	}
    }).fnSetFilteringDelay(500);

    $('#users_admin_list').dataTable({
	sPaginationType: "full_numbers",
	iDisplayLength: 25,
	bProcessing: true,
	bServerSide: true,
    	aaSorting: [[ 3, "desc" ]],
    	"oLanguage": {
            "sSearch": "",
            "search": "Search..."
    	},
    	"initComplete": function () {
            var api = this.api();
            $('.dataTables_filter label').append('<button class="btn search-btn"><i class="fa search-icon"></i></button>')
    	},
    	"processing": true,
        "serverSide": true,

        "ajax": {
    	    "url": "/admin/users/",
    	    "type": "get",
    	    "data": function ( d ) {
                d.myKey = $('.user_type .active a').attr('data-type');
            }
        }
    }).fnSetFilteringDelay(500);

    $(document).on('click', '#email_verified_user, #approved_user, #registered_user, #rejected_user', function() {
        $('#users_admin_list').DataTable().draw();
    });
    $(document).on('click', '#pending_topic, #published_topic, #rejected_topic, #approved_topic, #charge_failed_topic', function() {
        $('#topic_admin_list').DataTable().draw();
    });
    $('.dataTables_filter input[type="search"]').attr('placeholder','Search').css({'display':'inline-block'});

    setTimeout(function () {
        // $(".dataTables_length select").dropdown();
        $('.control-label').append('<sup> * </sup>');
        $('select').after('<i class="fa fa-caret-down select-arrow" aria-hidden="true"></i>');
        $('#tag_list').prev('label').find('sup').remove();
    }, 0)
    $(document).on('change', '#typeOfDeal_offer', function() {
	var deal_type = $('#typeOfDeal_offer').val();
	if (deal_type == "Featured-Deal" || deal_type == "Popular-Deal") {
	    $('#imageUpload').show();
	}
	else {
	    $('#imageUpload').hide();
	}
    });
});
