var index = 0;

function filter(topic, category) {
    var products_container = $('.products-container');
    $('#see-more').remove();

    $.ajax({
        type: "GET",
        url: "/api/",
        data: {
            "view": "plist",
            "topic": topic,
            "category": category,
            "index": index
        },
        dataType: "json",
        success: function(result) {
            var products_row;
            for (var i = 0; i < result.products.length; i++) {
                if (i % 3 == 0) {
                    products_container.append(`<div class="row"></div>`);
                    products_row = $('.products-container .row').last();
                }
                var product = "";
                if (result.products[i].sale_off == 0) {
                    product = `<div class="col-6 col-md-4">
                        <div class="product-wrapper text-center ${(result.products[i].quantity) == 0 ? 'soldout' : ''}">
                            <a href="/products/${result.products[i].name}"><img width="300" height="365" src="/media/${result.products[i].thumbnail}" alt="product"></a>
                            <a href="/products/${result.products[i].name}"><h3>${result.products[i].name}</h3></a>
                            <span>${result.products[i].price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>`;
                } else {
                    product = `<div class="col-6 col-md-4">
                        <div class="product-wrapper product-saleoff text-center ${(result.products[i].quantity) == 0 ? 'soldout' : ''}">
                            <div class="saleoff-wrapper" style="position: absolute; right: 0;">
                                <div class="saleoff-percent">sale&nbsp;${result.products[i].sale_off}%</div>
                            </div>
                            <a href="/products/${result.products[i].name}"><img width="300" height="365" src="/media/${result.products[i].thumbnail}" alt="product"></a>
                            <a href="/products/${result.products[i].name}"><h3>${result.products[i].name}</h3></a>
                            <span>${((1 - result.products[i].sale_off / 100) * result.products[i].price).toLocaleString()} VNĐ</span>
                            <br class="d-block d-lg-none">
                            <span class="price-root">${result.products[i].price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>`;
                }
                products_row.append(product);
            }
            index = result.next_index;

            if (result.more) {
                products_container.append(`<button id="see-more" class="d-block m-auto rounded-pill px-4 py-2 border border-info">See More</button>`);
                $('#see-more').click(function(){
                    filter($('#filter-topic ul .active').text(), $('#filter-category ul .active').text());
                });
            }
        }
    });
}

$(document).ready(function() {
    $('.products-container').empty();
    filter($('#filter-topic ul .active').text(), $('#filter-category ul .active').text());

    $('.filter-list a').click(function(){
        $('.products-container').empty();

        var options = $(this).parent().parent().children();
        for (var option of options) {
            $(option).removeClass('active');
        }
        $(this).parent().addClass('active');

        index = 0;
        filter($('#filter-topic ul .active').text(), $('#filter-category ul .active').text());
    });
});
