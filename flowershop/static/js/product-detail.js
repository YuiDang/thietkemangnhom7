if(isMobile()) {
    document.querySelector(".tab-mobile").style.display ="block";
    document.querySelector(".tab-desktop").style.display = "none";
} else {
    document.querySelector(".tab-mobile").style.display ="none";
    document.querySelector(".tab-desktop").style.display = "block";
}

var we = new WeNumberic('.wenumberic-product-detail', {
    stepvalue: 1,
    minvalue: 1,
    maxvalue: 100
});

var we_rating = new WeRating('.we-rating-product', {
    quantity: 5,
    editable: true
});

var btn_description = document.querySelector("#btn-tab-description");
var btn_review = document.querySelector("#btn-tab-review");

var tab_description = document.querySelector(".tab-description");
var tab_review = document.querySelector(".tab-review");

btn_description.addEventListener("click", (e) => {
    btn_description.classList.remove("active");
    btn_review.classList.remove("active");

    btn_description.classList.add("active");
    tab_description.style.display = "block";
    tab_review.style.display = "none";
});

btn_review.addEventListener("click", (e) => {
    btn_description.classList.remove("active");
    btn_review.classList.remove("active");

    btn_review.classList.add("active");
    tab_description.style.display = "none";
    tab_review.style.display = "block";
});

/*TABS MOBILE SCRIPT*/
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

function addCart(pname, quantity) {
    $.ajax({
        type: "GET",
        url: "/addcart/",
        data: {
            "pname": pname,
            "quantity": quantity
        },
        dataType: "json",
        success: function(result) {
            if (result.status == "Add to cart successfully.") {
                var btn = $('.btn-add-to-cart');
                $(btn).attr('disabled', true);
                $(btn).parent().append(`<div id="success" class="alert alert-success mt-3" style="display: none;">${result.status}</div>`);
                $(btn).parent().find('#success').fadeIn(1000, function() {
                    var temp = $(btn);
                    window.setTimeout(function() {
                        $(temp).parent().find('#success').fadeOut(1000, function() {
                            $(temp).parent().find('#success').remove();
                            
                            if (result.product_quantity != 0) {
                                $(btn).removeAttr('disabled');
                            } else {
                                $(btn).parent().append(`<div id="error" class="alert alert-danger mt-3">This product is out of stock, please come back later.</div>`);
                            }

                            $('.cart-number').text(result.cart_count);
                        });
                    }, 1000);
                });
            } else {
                var btn = $('.btn-add-to-cart');
                $(btn).attr('disabled', true);
                $(btn).parent().append(`<div id="error" class="alert alert-danger mt-3" style="display: none;">${result.status}</div>`);
                $(btn).parent().find('#error').fadeIn(1000, function() {
                    window.setTimeout(function() {
                        $(btn).parent().find('#error').fadeOut(1000, function() {
                            $(btn).parent().find('#error').remove();
                            $(btn).removeAttr('disabled');
                        });
                    }, 1000);
                });
            }
        }
    });
}


$(document).ready(function() {
    var product_name = $('.banner-text h2').text();
    
    $.ajax({
        type: "GET",
        url: "/api/",
        data: {
            "view": "pdetail",
            "pname": product_name
        },
        dataType: "json",
        success: function(result) {
            var gallery_thumbs_sw = $('.gallery-thumbs .swiper-wrapper');
            for (var image of result.product.images) {
                gallery_thumbs_sw.append(`<div class="swiper-slide">
                    <img width="160" height="165" src="/media/${image}" alt="">
                </div>`);
            }
            
            var gallery_top_sw = $('.gallery-top .swiper-wrapper');
            for (var image of result.product.images) {
                gallery_top_sw.append(`<div class="swiper-slide">
                    <img width="445" height="510" src="/media/${image}" alt="">
                </div>`);
            }


            var galleryThumbs = new Swiper('.gallery-thumbs', {
                direction: 'vertical',
                spaceBetween: 10,
                slidesPerView: 3,
                freeMode: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true
            });
            
            var galleryTop = new Swiper('.gallery-top', {
                spaceBetween: 10,
            
                thumbs: {
                    swiper: galleryThumbs
                }
            });
            
            //-----------------------------------------------

            $('.detail-title').text(result.product.name);

            if (result.product.sale_off == 0) {
                $('.detail-price').append(`<span>${(result.product.price / 1000).toString()}K VNĐ</span>`);
            } else {
                $('.detail-price').append(`<span>${((result.product.price * (1 - result.product.sale_off / 100)) / 1000).toString()}K VNĐ</span>
                    <span class="root-price">${(result.product.price / 1000).toString()}K VNĐ</span>
                    <span class="text-danger">(-${result.product.sale_off}%)</span>`);
            }

            $('.detail-description').text(result.product.summary);

            //-----------------------------------------------

            $('.sku').append(result.product.quantity);

            if (result.product.quantity == 0) {
                $('.btn-add-to-cart').parent().append(`<div id="error" class="alert alert-danger mt-3">This product is out of stock, please come back later.</div>`);
                $('.btn-add-to-cart').attr('disabled', true);
            }

            var topics = $('.topics');
            for (var topic of result.product.topics) {
                topics.append(`<a href="../?topic=${topic}&category=all">${topic}</a>, `);
            }
            topics.html(topics.html().substring(0, topics.html().length - 2));

            var categories = $('.categories');
            for (var category of result.product.categories) {
                categories.append(`<a href="../?topic=all&category=${category}">${category}</a>, `);
            }
            categories.html(categories.html().substring(0, categories.html().length - 2));

            //----------------------------------------------

            $('.tab-description').html(result.product.description);
            
            //----------------------------------------------

            var related_products_sw = $('.related-products-container .swiper-wrapper');
            for (var product of result.related_products) {
                var related_product = "";
                if (product.sale_off == 0) {
                    related_product = `<div class="swiper-slide">
                        <div class="product-wrapper text-center ${(product.quantity) == 0 ? 'soldout' : ''}">
                            <a href="/products/${product.name}"><img width="300" height="365" src="/media/${product.thumbnail}" alt=""></a>
                            <a href="/products/${product.name}"><h3>${product.name}</h3></a>
                            <span>${product.price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>`;
                } else {
                    related_product = `<div class="swiper-slide">
                        <div class="product-wrapper text-center product-saleoff ${(product.quantity) == 0 ? 'soldout' : ''}">
                            <div class="saleoff-wrapper" style="position: absolute; right: 0;">
                                <div class="saleoff-percent">sale&nbsp;${product.sale_off}%</div>
                            </div>
                            <a href="/products/${product.name}"><img width="300" height="365" src="/media/${product.thumbnail}" alt=""></a>
                            <a href="/products/${product.name}"><h3>${product.name}</h3></a>
                            <span>${((1 - product.sale_off / 100) * product.price).toLocaleString()} VNĐ</span>
                            <br class="d-block d-lg-none">
                            <span class="price-root">${product.price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>`;
                }
                related_products_sw.append(related_product);
            }

            var RelatedProductsSwiper = new Swiper ('.related-products-container', {
                loop: false,
                slidesPerView: 4,
                spaceBetween: 30,
                // Navigation arrows
                navigation: {
                  nextEl: '.related-products-next',
                  prevEl: '.related-products-prev',
                },
                breakpoints: {
                    // when window width is >= 320px
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    // when window width is >= 480px
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                }
            });
        }
    });

    $('.btn-add-to-cart').click(function() {
        var pname = $(this).parent().parent().find('.detail-title').text();
        var quantity = $(this).parent().parent().find('#quantity').val();        
        addCart(pname, quantity);
    });
});