$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/api/",
        data: {
            "view": "home"
        },
        dataType: "json",
        success: function(result) {
            var blogs_container = $(".swiper-wrapper");
            for (blog of result.blogs) {
                blogs_container.append(`<div class="swiper-slide">
                    <div class="blog-slide-wrapper">
                        <div class="blog-item text-center" style="background-image: url('/media/${blog.background}');">
                            <div class="blog-item-title">From our latest blog</div>
                            <div class="blog-slide-title">${blog.title}</div>
                            <div class="blog-content">${blog.brief}</div>
                            <a class="blog-see-more" href="/blogs/${blog.title}/">discover now</a>
                        </div>
                    </div>
                </div>`);
            }

            var blogSwiper = new Swiper('.blog-container', {
                loop: true,
                //effect: "cube",
                // If we need pagination
                pagination: {
                    el: '.blog-pagination'
                },
            
                // Navigation arrows
                navigation: {
                    nextEl: '.blog-button-next',
                    prevEl: '.blog-button-prev',
                }
            });

            //-----------------------------------------------

            var topics_container = $(".topics-container");
            for (var i = 0; i < result.topics.length; i++) {
                var topic = ``;
                if (i % 2 != 0) {
                    topic = `<div class="blog-row">
                        <div class="row text-center">
                            <div class="col-sm-6 blog-col mb-3 mb-sm-0">
                                <img width="268" height="168" src="/media/${result.topics[i].image}" alt="">
                            </div>
                            <div class="col-sm-6 blog-col">
                                <div>Start from ${result.topics[i].min_price.toLocaleString()} VNĐ</div>
                                <div class="blog-col-title">${result.topics[i].name}</div>
                                <div><a href="/products/?topic=${result.topics[i].name}&category=all">Shop collections >></a></div>
                            </div>
                        </div>
                    </div>`;
                } else {
                    topic = `<div class="blog-row">
                        <div class="row text-center">
                            <div class="col-12 blog-col d-block d-sm-none mb-3 mb-sm-0">
                                <img width="268" height="168" src="/media/${result.topics[i].image}" alt="">
                            </div>
                            <div class="col-sm-6 blog-col">
                                <div>Start from ${result.topics[i].min_price.toLocaleString()} VNĐ</div>
                                <div class="blog-col-title">${result.topics[i].name}</div>
                                <div><a href="/products/?topic=${result.topics[i].name}&category=all">Shop collections >></a></div>
                            </div>
                            <div class="col-sm-6 blog-col d-none d-sm-block">
                                <img width="268" height="168" src="/media/${result.topics[i].image}" alt="">
                            </div>
                        </div>
                    </div>`;
                }
                topics_container.append(topic);
            }

            //-----------------------------------------------
            
            var new_products_container = $('.new-arrival-wrapper');
            var new_products_row;
            for (var i = 0; i < result.new_products.length; i++) {
                if (i % 4 == 0) {
                    new_products_container.append(`<div class="row"></div>`);
                    new_products_row = $('.new-arrival-wrapper .row').last();
                }
                var new_product = "";
                if (result.new_products[i].sale_off == 0) {
                    new_product = `<div class="col-6 col-md-3">
                        <div class="product-wrapper ${(result.new_products[i].quantity) == 0 ? 'soldout' : ''}">
                            <a href="/products/${result.new_products[i].name}"><img width="255" height="262" src="/media/${result.new_products[i].thumbnail}" alt="product"></a>
                            <a href="/products/${result.new_products[i].name}"><h3>${result.new_products[i].name}</h3></a>
                            <span>${result.new_products[i].price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>`;
                } else {
                    new_product = `<div class="col-6 col-md-3">
                        <div class="product-wrapper product-saleoff ${(result.new_products[i].quantity) == 0 ? 'soldout' : ''}">
                            <div class="saleoff-wrapper" style="position: absolute; right: 0;">
                                <div class="saleoff-percent">sale&nbsp;${result.new_products[i].sale_off}%</div>
                            </div>
                            <a href="/products/${result.new_products[i].name}"><img width="255" height="262" src="/media/${result.new_products[i].thumbnail}" alt="product"></a>
                            <a href="/products/${result.new_products[i].name}"><h3>${result.new_products[i].name}</h3></a>
                            <span>${((1 - result.new_products[i].sale_off / 100) * result.new_products[i].price).toLocaleString()} VNĐ</span>
                            <br class="d-block d-lg-none">
                            <span class="price-root">${result.new_products[i].price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>`;
                }
                new_products_row.append(new_product);
            }

            //-----------------------------------------------
            
            var onsale_products_container = $('.on-sale-wrapper');
            var onsale_products_row;
            for (var i = 0; i < result.onsale_products.length; i++) {
                if (i % 4 == 0) {
                    onsale_products_container.append(`<div class="row"></div>`);
                    onsale_products_row = $('.on-sale-wrapper .row').last();
                }
                var onsale_product = "";
                if (result.onsale_products[i].sale_off == 0) {
                    onsale_product = `<div class="col-6 col-md-3">
                        <div class="product-wrapper ${(result.onsale_products[i].quantity) == 0 ? 'soldout' : ''}">
                            <a href="/products/${result.onsale_products[i].name}"><img width="255" height="262" src="/media/${result.onsale_products[i].thumbnail}" alt="product"></a>
                            <a href="/products/${result.onsale_products[i].name}"><h3>${result.onsale_products[i].name}</h3></a>
                            <span>${result.onsale_products[i].price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>`;
                } else {
                    onsale_product = `<div class="col-6 col-md-3">
                        <div class="product-wrapper product-saleoff ${(result.onsale_products[i].quantity) == 0 ? 'soldout' : ''}">
                            <div class="saleoff-wrapper" style="position: absolute; right: 0;">
                                <div class="saleoff-percent">sale&nbsp;${result.onsale_products[i].sale_off}%</div>
                            </div>
                            <a href="/products/${result.onsale_products[i].name}"><img width="255" height="262" src="/media/${result.onsale_products[i].thumbnail}" alt="product"></a>
                            <a href="/products/${result.onsale_products[i].name}"><h3>${result.onsale_products[i].name}</h3></a>
                            <span>${((1 - result.onsale_products[i].sale_off / 100) * result.onsale_products[i].price).toLocaleString()} VNĐ</span>
                            <br class="d-block d-lg-none">
                            <span class="price-root">${result.onsale_products[i].price.toLocaleString()} VNĐ</span>
                            
                        </div>
                    </div>`;
                }
                onsale_products_row.append(onsale_product);
            }
        }
    });
});