function getCart() {
    $.ajax({
        type: "GET",
        url: "/getcart/",
        success: function(result) {
            var quantity_total = 0;
            var price_total = 0;
            var tbody = $('#items-table tbody');
            tbody.empty();
            for (item of result.items) {
                quantity_total += item.quantity;
                price_total += (item.price * item.quantity);

                tbody.append(`<tr>
                    <td class="img-product-cell" data-title="thumb"><a href="/products/${item.product}"><img src="/media/${item.thumbnail}" class="img-fluid" height="120px" width="120px"></a></td>
                    <td class="text-product-cell item-name" data-title="product">${item.product}</td>
                    <td class="text-product-cell" data-title="price">${item.price.toLocaleString()} vnđ</td>
                    <td class="quantity-product-cell item-quantity" data-title="quantity">
                        <input type="number" required value="${item.quantity}" min="1" max="100">
                        <div class="mt-2" style="font-size: 14px;">SKU: ${item.sku}</div>
                        ${(item.sku == 0) ? '<div class="text-danger" style="font-size: 14px;">Out of stock</div>' : ''}
                        ${(item.sku != 0 && item.quantity > item.sku) ? '<div class="text-danger" style="font-size: 14px;">Not enough</div>' : ''}
                    </td>
                    <td class="text-product-cell" data-title="total">${(item.price * item.quantity).toLocaleString()} vnđ</td>
                    <td class="delete-product-cell text-product-cell" data-title="Remove"><a href="javascript:void(0)" class="item-link item-remove"><i class="material-icons">remove_shopping_cart</i></a></td>
                </tr>`);
            }

            $('#quantity-total').text(quantity_total);
            $('#price-total').text(price_total.toLocaleString() + " VNĐ");
            $('.cart-subtotal td').text((price_total / 1000).toLocaleString() + "K VNĐ");
            $('.cart-order-total td').text((price_total / 1000).toLocaleString() + "K VNĐ");

            $('.item-remove').click(function() {
                $(this).parent().parent().find('.quantity-product-cell input').val(0);
            });
        }
    });
}

function updateCart() {
    $('#update-cart').attr('disabled', true);

    items = [];
    var trs = $('#items-table tbody tr');
    for (tr of trs) {
        var item = {}
        item['name'] = $(tr).find('.item-name').text();
        item['quantity'] = $(tr).find('.item-quantity input').val();
        items.push(item);
    }

    $.ajax({
        type: "POST",
        url: "/updatecart/",
        data: {
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
            'items': JSON.stringify(items)
        },
        dataType: "json",
        success: function(result) {
            if (result.status == "Ok") {
                getCart();
                $('.cart-number').text(result.cart_count);
            }
            
            $('#update-cart').removeAttr('disabled');
        }
    });
}

$(document).ready(function () {
    getCart();
    
    $(document).on('submit', '#form-update-cart', function(e) {
        e.preventDefault();
        updateCart();
    });

    $('#proceed-to-checkout').click(function() {
        getCart();
        $.ajax({
            type: "GET",
            url: "/checkcart/",
            success: function(result) {
                if (result == 'valid') {
                    window.location.href = "/checkout/";
                }
                else {
                    var btn = $('#proceed-to-checkout');
                    $(btn).attr('disabled', true);
                    $(btn).parent().append(`<div id="error" class="alert alert-danger mt-3" style="display: none;">
                        Your cart contains invalid item(s), please Update Cart and try again.</div>`);
                    $(btn).parent().find('#error').fadeIn(1000, function() {
                        var temp = $(btn);
                        window.setTimeout(function() {
                            $(temp).parent().find('#error').fadeOut(1000, function() {
                                $(temp).parent().find('#error').remove();
                                $(btn).removeAttr('disabled');
                            });
                        }, 1000);
                    });
                }
            }
        });
    });
});