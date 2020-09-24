$(function(){
    $('#id_login').removeAttr('placeholder');
    $('#id_email').removeAttr('placeholder');
    $('#id_password').removeAttr('placeholder');
    $('#id_password1').removeAttr('placeholder');
    $('#id_password2').removeAttr('placeholder');

    if ($("#id_login").val() != "") {
        $("#id_login").parent().parent().addClass('focus');
    }
    $("#id_login").blur();

    if ($("#id_email").val() != "") {
        $("#id_email").parent().parent().addClass('focus');
    }
    $("#id_email").blur();
});

$('.textbox input').focus(function () {
    $(this).parent().parent().addClass('focus');
}).blur(function () {
    if($(this).val() == "")
    {
        $(this).parent().parent().removeClass('focus');
        $(this).parent().parent().children('.notice').removeClass('show');
        $(this).parent().parent().children('.notice').children('.tooltip-text').html("");
    }
});
