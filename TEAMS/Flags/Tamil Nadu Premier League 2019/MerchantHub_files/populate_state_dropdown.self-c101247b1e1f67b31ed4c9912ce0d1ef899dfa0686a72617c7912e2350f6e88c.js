$(document).ready(function(){

  $("#user_country_id").on("change", function(){
    var country_id = $(this).val();
    $.ajax({
      url: "/users/load_states",
      type: "get",
      dataType: 'script',
      data: { country_id: country_id },
    });
  });
});
