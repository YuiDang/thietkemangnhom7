function WeRating(selector, config) {
    var elements = document.querySelectorAll(selector);

    //init
    var setting = {
        quantity: 5,
        editable: false
    };

    //private
    var render = function(element) {
        var rating = parseFloat(element.dataset.rating);

        //quantity (of stars), rating (marks)
        var renderHTMLStars = "";
        var i = 1; //index
        //config quantity in case rating greater than quantity default.
        if(rating > setting.quantity) {
            rating = setting.quantity;
        }

        for(i; i <= setting.quantity; i++) {
            if(rating >= 1) {
                //full star
                renderHTMLStars += '<a class="we-star rating-full-star" data-value="'+ i +'"></a>';
                rating--;
            } else if((rating < 1) && (rating > 0)) {
                //half star
                renderHTMLStars += '<a class="we-star rating-half-star" data-value="'+ i +'"></a>';
                rating = 0;
            } else {
                //empty star
                renderHTMLStars += '<a class="we-star" data-value="'+ i +'"></a>';
            }
        }

        element.innerHTML = renderHTMLStars;
        //add event
        if (setting.editable) {
            //add event for star
            //star
            var stars = element.querySelectorAll(".we-star");
            stars.forEach((star) => {
                star.addEventListener("mouseover", function() {
                    var max_index = parseFloat(this.dataset.value);
                    var parent = this.parentElement;
                    var childs = parent.childNodes;

                    childs.forEach((child, index) => {
                        child.classList.remove("rating-full-star", "rating-half-star", "rating-o-star");
                        if (index < max_index) {
                            child.classList.add("rating-full-star");
                        }
                    });
                });
            });

            //star click event
            stars.forEach((star) => {
               star.addEventListener("click", function() {
                   var rating = parseFloat(this.dataset.value);
                   var parent = this.parentElement;
                   parent.dataset.rating = rating;

                   render(parent);
               });
            });
        }
    };

    var init = function() {
        elements.forEach( (item) => {
            render(item);

            item.addEventListener("mouseleave", function(e) {
                render(item);
            });
        });
    };

    if (config) {
        setting.quantity = config.quantity >= 0 ? config.quantity : setting.quantity;
        setting.editable = ((config.editable != true) && (config.editable != false)) ? setting.editable : config.editable;
        init();
    }

    this.show = function() {
        alert('show ne');
    };

}





