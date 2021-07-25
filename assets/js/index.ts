
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

    $('.c-category:odd').addClass('js-odd');
})(jQuery);


AOS.init();
AOS.init({
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 200, // offset (in px) from the original trigger point
    delay: 50, // values from 0 to 3000, with step 50ms
    duration: 1000, // values from 0 to 3000, with step 50ms
    easing: 'ease-in-out', // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: true, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-center', // defines which position of the element regarding to window should trigger the animation
});
