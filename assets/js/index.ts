
/**
 * Main JS file for GhostScroll behaviours
 */
/* Globals jQuery, document */
(function ($) {
    "use strict";
    const nav = document.querySelector('.navbar');
    const first_section = $(".c-band");
    const navHeight = nav.offsetHeight;

    function srcTo(el) {
        $("html, body").animate(
            {
                //  Scroll to the element minus nav hieght§
                //  https://stackoverflow.com/questions/11365091/jquery-scroll-to-anchor-minus-set-amount-of-pixels

                scrollTop: el.offset().top - navHeight,
            },
            1000
        );
    }

    $("#header-arrow").click(function () {
        srcTo(first_section);
    });
})(jQuery);
