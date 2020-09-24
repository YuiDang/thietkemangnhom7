/*
<div class="row">
            <div class="col-6 col-md-3">
                <div class="product-wrapper text-center">
                    <a href="/products/Violet (Pansy)"><img width="255" height="262"
                            src="/media/product_thumbnail/violet.jpg" alt="product"></a>
                    <a href="/products/Violet (Pansy)">
                        <h3>Violet (Pansy)</h3>
                    </a>
                    <span>100,000 VNĐ</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="product-wrapper text-center">
                    <a href="/products/Chamomile"><img width="255" height="262"
                            src="/media/product_thumbnail/Chamomile.jpg" alt="product"></a>
                    <a href="/products/Chamomile">
                        <h3>Chamomile</h3>
                    </a>
                    <span>170,000 VNĐ</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="product-wrapper text-center">
                    <a href="/products/Alchemilla Mollis"><img width="255" height="262"
                            src="/media/product_thumbnail/download_14.jpg" alt="product"></a>
                    <a href="/products/Alchemilla Mollis">
                        <h3>Alchemilla Mollis</h3>
                    </a>
                    <span>1,500,000 VNĐ</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="product-wrapper text-center">
                    <a href="/products/Marigold"><img width="255" height="262"
                            src="/media/product_thumbnail/download_15.jpg" alt="product"></a>
                    <a href="/products/Marigold">
                        <h3>Marigold</h3>
                    </a>
                    <span>150,000 VNĐ</span>
                </div>
            </div>
        </div>
*/

var index = 0;
var key = "";

function load() {
    var products_container = $('.products-container');
    $('#see-more').remove();    

    $.ajax({
        type: "GET",
        url: "/api/",
        data: {
            "view": "search",
            "key": key,
            "index": index
        },
        dataType: "json",
        success: function(result) {
            if (result.products.length == 0) {
                $('.search-title').html(`<strong>0</strong> results for "<strong id="key">${key}</strong>"`);
                return;
            }

            $('#results-sum').text(result.sum);
            $('#results-show').text(result.next_index);

            var products_row;
            for (var i = 0; i < result.products.length; i++) {
                if (i % 4 == 0) {
                    products_container.append(`<div class="row"></div>`);
                    products_row = $('.products-container .row').last();
                }
                var product = "";
                if (result.products[i].sale_off == 0) {
                    product = `<div class="col-6 col-md-3">
                        <div class="product-wrapper text-center ${(result.products[i].quantity) == 0 ? 'soldout' : ''}">
                            <a href="/products/${result.products[i].name}"><img width="255" height="262" src="/media/${result.products[i].thumbnail}" alt="product"></a>
                            <a href="/products/${result.products[i].name}"><h3>${result.products[i].name}</h3></a>
                            <span>${result.products[i].price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>`;
                } else {
                    product = `<div class="col-6 col-md-3">
                        <div class="product-wrapper product-saleoff text-center ${(result.products[i].quantity) == 0 ? 'soldout' : ''}">
                            <div class="saleoff-wrapper" style="position: absolute; right: 0;">
                                <div class="saleoff-percent">sale&nbsp;${result.products[i].sale_off}%</div>
                            </div>
                            <a href="/products/${result.products[i].name}"><img width="255" height="262" src="/media/${result.products[i].thumbnail}" alt="product"></a>
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
                    load();
                });
            }
        }
    });
}

$(document).ready(function() {
    key = $('#key').text();
    $('#search-box').val(key);
    load();
});