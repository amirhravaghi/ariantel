$(document).ready(function () {
    if ($('.page-banner img').length > 0) {
        $('#cnt-inner').css('margin-top', '0');
    }
    $('#select > a').click(function (event) {
        event.preventDefault();
        $('#select ul').slideDown();

    });
    $('#selectbox').click(function (event) {
        event.preventDefault();
        $('#tab-list ul').slideDown();

    });
    $('#f-q .item > a').click(function (event) {
        event.preventDefault();
        $(this).parent().find('.reply').slideToggle();
        $(this).parent().toggleClass('act');
        //$('.question-item .question.active').not(this).removeClass('active');
        $('#f-q .item.act a').not(this).parent().find('.reply').slideUp()
        $('#f-q .item.act a').not(this).parent().removeClass('act');


    });
    if ($(window).width() > 992) {
        $('#top-nav').booNavigation({
            slideSpeed: 400
        });
    }
    if ($('#detail-product .owl-carousel').length > 0) {
        $("#detail-product .owl-carousel").owlCarousel({
            rtl: true,
            loop: false,
            autoplay: false,
            margin: 0,
            nav: false,
            items: 1,
            touchDrag: false,
            mouseDrag: false
        });
    }

    if ($('#top-slider.owl-carousel').length > 0) {
        //$('#top-slider .item').each(function () {
        //    if ($(this).find('img').length > 0) {
        //        src = $(this).find('img').attr('src');
        //    }
        //    if ($(this).find('video source').attr('src').length > 0) {
        //        src = $(this).find('video source').attr('src');
        //        if (src.indexOf('mp4') != -1) {
        //            $(this).find('video').css('display', 'block');
        //        }
        //        else {
        //            $(this).find('img').css('display', 'block');
        //        }
        //    }
        //});

        $("#top-slider.owl-carousel").owlCarousel({
            rtl: true,
            loop: true,
            autoplay: true,
            margin: 0,
            nav: false,
            items: 1,
            fallbackEasing: 'fade'
        });
        var n = 1;
        $('#top-slider .owl-dots .owl-dot').each(function () {
            $(this).find('span').text(n);
            n++;
        });
        var left_pos = $('#top-header .container').offset().left;
        if ($('#lang').val() == 'en') {
            $('#top-slider .owl-dots').css('right', left_pos + 'px');
        }
        else {
            $('#top-slider .owl-dots').css('left', left_pos + 'px');
        }
        $("#top-slider").on('changed.owl.carousel', function (event) {
            document.querySelector('video').pause();
        })
    }

    if ($('#home-tab .owl-carousel').length > 0) {
        if ($('#lang').val() == 'en') {
            $("#home-tab .owl-carousel").owlCarousel({
                rtl: false,
                loop: true,
                autoplay: false,
                margin: 0,
                nav: true,
                center: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    767: {
                        items: 2
                    },
                    991: {
                        items: 3
                    },
                    1200: {
                        items: 3
                    }
                }
            });
        }
        else {
            $("#home-tab .owl-carousel").owlCarousel({
                rtl: true,
                loop: true,
                autoplay: false,
                margin: 0,
                nav: true,
                center: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    767: {
                        items: 2
                    },
                    991: {
                        items: 3
                    },
                    1200: {
                        items: 3
                    }
                }
            });
        }

    }
    $('#home-tab .item-tab').css('display', 'none');
    $('#home-tab .item-tab.active').fadeIn();
    $('#home-tab #tab-list li a').click(function (event) {
        event.preventDefault();
        if (!($(this).parents('li').hasClass('active'))) {
            $('#home-tab #tab-list li.active').removeClass('active');
            $(this).parents('li').addClass('active');
            $('#home-tab .item-tab.active').removeClass('active').css('display', 'none');;
            $($(this).attr('href')).addClass('active').fadeIn('1000');
        }
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $('#home-tab').offset().top;
        var elemBottom = elemTop + $('#home-tab').height();
        if (((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) == false) {
            $('html, body').animate({
                scrollTop: $("#home-tab").offset().top - 100
            }, 800)
        }
        if ($(window).width() < 601) {
            $('#home-tab #tab-list ul').css('display','none');
        }
    });


    /********/
    $('.tab-det li a').click(function (event) {
        event.preventDefault();
        if (!($(this).parent().hasClass('active'))) {
            i = $(this).parent().index();
            $('#detail-product .owl-carousel').trigger('to.owl.carousel', i);
            $('.tab-det li.active').removeClass('active');
            $(this).parent().addClass('active');
            if ($(window).width() < 768) {
                $('html, body').animate({
                    scrollTop: $("#detail-product .bg .owl-carousel").offset().top - 100
                }, 800)
            }
        }

    });

});
