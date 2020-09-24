$(document).ready(function () {
    $('.shipping-cost-tr').hide();
    $('#order-btn').hide();   
    
        var isChecked = $('#customRadio').prop('checked');
        if(isChecked)
        {
            $('.shipping-cost-tr').show(1000)
            console.log("clicked")
            $('#order-btn').show(500);
        }
    $('#change-address-form').hide();
    $('#change-address-btn').click(function (e) { 
        e.preventDefault();
        $('#change-address-form').show(500);
        $('#profile-display').hide();
    });
    $('#close-form').click(function (e) { 
        e.preventDefault();
        $('#change-address-form').hide(500);
        $('#profile-display').show(500);
    });

    $('#change-address-form').submit(function(e) {
        e.preventDefault();
        $('#save-form').attr('disabled', true);
        
        var name = $(this).find('input[name=name]').val();
        var phone = $(this).find('input[name=phone]').val();
        var address = $(this).find('input[name=address]').val();

        $.ajax({
            type: "POST",
            url: "/updateuserinfo/",
            data: {
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
                'name': name,
                'phone': phone,
                'address': address
            },
            success: function(result) {
                if (result == "success") {
                    $('#change-address-form').hide(500);
                    $('#profile-display').show(500);
                    $('#save-form').removeAttr('disabled');
                    $('.name-text').html(`<span class="font-weight-bold">Receiver's name :</span> ${name}`);
                    $('.address-text').html(`<span class="font-weight-bold">Address :</span> ${address}`);
                    $('.phone-text').html(`<span class="font-weight-bold">Phone :</span> ${phone}`);
                }
            }
        });
    });

    $('#form-coupon').submit(function(e) {
        e.preventDefault();
        $('#apply-coupon').attr('disabled', true);
        
        $.ajax({
            type: "POST",
            url: "/checkcoupon/",
            data: {
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
                'coupon': $(this).find('input[name=coupon]').val()
            },
            success: function(result) {
                $('#form-coupon').find('#cp-detail').remove();

                if (result.status == "valid") {
                    var cp_detail = ""
                    if (result.discount_type == 0) {
                        cp_detail = result.percent + "% off, up to " + result.percent_max_amount.toLocaleString() + " VNĐ."
                    } else {
                        cp_detail = result.amount.toLocaleString() + " VNĐ off."
                    }
                    $('#form-coupon').find('input[name="coupon"]').parent().append(`<p id="cp-detail" class="text-success">${cp_detail}</p>`);



                } else {
                    $('#form-coupon').find('input[name="coupon"]').parent().append(`<p id="cp-detail" class="text-danger">Invalid Coupon.</p>`);
                }

                $('#apply-coupon').removeAttr('disabled');
            }
        });
    });
});