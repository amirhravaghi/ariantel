var _imgs = { down: ['fa fa-angle-down', '/images/arr_b_tnav.gif', 23], right: ['arr_r', '/images/arr_r.gif'] }
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
/**************** Add to card ********************/
$(document).on("click", ".addtocard", function () {
    var o = $(this);
    $.ajax({
        url: o.attr("data-url"),
        dataType: "json",
        type: "POST",
        data: { "cmd": o.attr("data-command"), "id": o.attr("data-id") },
        success: (function (data) {
            alert([data.basket, data.message]);

        })
    });
});
//************* Locale ***************

function autotab() {
    if ($('#topslider li').size() > 1) {
        var active = $('#content-slider').find('.select');
        $(active).css('display', 'none').removeClass('select');
        if ($(active).next().length > 0) {
            $(active).next().fadeIn('slow').addClass('select');
            $('#topslider li.act .arrow-s').remove();
            $('#topslider li.act').removeClass('act');
            $('#topslider li').eq($(active).next().index()).addClass('act');

        }
        else {
            $('#content-slider').find('.dtab').eq(0).fadeIn('slow').addClass('select');
            $('#topslider li.act .arrow-s').remove();
            $('#topslider li.act').removeClass('act');
            $('#topslider li').eq(0).addClass('act');

        }
    }
}

jQuery.fn.locale = function () {
    var o = $(this);

    function bindCities(o) {
        var pid = $(o).val();
        var $city = $(".locale-city[province=" + $(o).attr("id") + "]");
        $city.empty();
        $.ajax({
            url: "/ajax/GetCities",
            dataType: "json",
            type: "POST",
            data: { "id": pid },
            success: (function (data) {
                for (var i = 0; i < data.length; i++) {
                    $city.append("<option value=" + data[i].id + ">" + data[i].name + "</option>");

                }
                if ($city.attr("val") != undefined) {
                    $city.val($city.attr("val"));
                }
            })
        });
    }
    o.each(function () {
        var prv = $(this).attr("province");
        if ($("#" + prv).val() != "") {
            bindCities($("#" + prv));
        }
        $("#" + prv).change(function () {
            bindCities($(this));
        });
    });
};
//************************************
function LoadTotalBasket(actionUrl) {
    $.post("/do" + actionUrl, function (data) {
        $('#controlTotalBasket').load("/do/invoice/basket");
    });
}

function EditInvoiceOrder(actionUrl, OrderId, Qty) {
    selectedOrderId = OrderId;
    if (actionUrl != "" && OrderId > 0) {
        $.post("/do" + actionUrl, { 'OrderId': OrderId, 'Qty': $('#item_Qty').val() }, function (data) {
            $('#controlContainer').load("/do/invoice/basket");
        });

    }
}

function DeleteInvoiceOrder(actionUrl, OrderId) {
    selectedOrderId = OrderId;
    if (actionUrl != "" && OrderId > 0) {
        $.post("/do" + actionUrl, { 'OrderId': OrderId }, function (data) {
            $('#controlContainer').load("/do/invoice/basket");
        });

    }
}


function callback() {

};



jQuery.countdown = function (selector, time) {
    amount = time;
    if (amount < 0) {
        $(selector).html("Now!");
    }
    else {
        days = 0; hours = 0; mins = 0; secs = 0; out = "";

        days = Math.floor(amount / 86400);
        amount = amount % 86400;

        hours = Math.floor(amount / 3600);
        amount = amount % 3600;

        mins = Math.floor(amount / 60);
        amount = amount % 60;

        secs = Math.floor(amount);

        out += "<span class=\"day\">" + days + "</span>";
        out += "<span class=\"hour\">" + hours + "</span>";
        out += "<span class=\"min\">" + mins + "</span>";
        out += "<span class=\"sec\">" + secs + "</span>";
        //console.log(out);
        $(selector).html(out);

        // run it all again
        setTimeout(function () {
            $.countdown(selector, --time);
        }, 1000);

    }

};

//--> Tabs ...!
jQuery.fn.grtabs = function () {

    var o = jQuery(this);
    var l = o.find(".tbbar ul li");
    l.each(function () {
        var txt = "<div class='caption'>" + $(this).find(".hover").text() + "</div>";
        $(this).find(".hover").html(txt);
        $(this).find(".default").html(txt);
    });
    o.each(function () {
        $(this).find(".slider").hide();
        var li = $(this).find(".tbbar ul li:first");
        if (li.length > 0) {
            li.addClass("act");
            $(this).find(".slider[id=" + li.attr("bid") + "]").show();
        };
    });
    l.click(function () {
        var p = $(this).parents(".grtabs1");
        var cb = p.find(".tbbar ul li");
        if (cb.length > 0) {
            p.find(".tbbar li").removeClass("act");
            $(this).addClass("act");
            p.find(".slider").hide();
            p.find(".slider[id=" + $(this).attr("bid") + "]").show();
        }
    });
    return (this);
}

jQuery.fn.city = function (province, city) {
    var o = jQuery(this);
    var p = o.find(".province");
    var c = o.find(".city");

    p.bind("change", function () {
        var p = $(this).parent();
        var f = $(p).parents("form");
        var dd = $(this)[0].value.toString();

        f.append("<input type=\"hidden\" value=\"" + dd.toString() + "\" id=\"hfOstan\" name=\"hfOstan\" />");
        events.change($(this), p.find(".city"), $(this)[0].selectedIndex);

    });

    c.bind("change", function () {
        var c = $(this).parent();
        var f = $(c).parents("form");
        var dd = $(this)[0].value.toString();

        f.append("<input type=\"hidden\" value=\"" + dd.toString() + "\" id=\"hfCity\" name=\"hfCity\" />");

    });

    var events = {
        change: function (p, c, index) {
            if (c.length > 0) {
                while (c[0].options.length > 1) c[0].options.length = 1;
                //if (p[0].value != -1 && p[0].value != '') {
                for (i = 0; i < CD[index - 1].length; i++) {
                    var opt = document.createElement("OPTION");
                    opt.value = CD[index - 1][i];
                    opt.text = CN[index - 1][i];
                    c[0].options.add(opt);
                }
                //}
            }
        },
        init: function () {
            c.each(function () {
                $(this).append("<option value=''>انتخاب شهر</option>");
            });
            p.each(function () {
                var x = $(this);
                var p = $(this).parent();
                x.append("<option value=''>انتخاب استان</option>");
                for (var i = 0; i < PC.length; i++) {
                    x.append("<option value='" + PC[i] + "'>" + PN[i] + "</option>");
                }
                if (province != undefined && province != "") {
                    x.val(province);
                    events.change(x, p.find(".city"), x[0].selectedIndex);

                    if (city != undefined) {
                        p.find(".city").val(city);
                    }
                }
            });
        }
    };
    events.init();
    return (this);
}

function goBack() {
    window.history.back()

}
//***************** Rating *******************
jQuery.fn.rating = function (url, options) {
    if (url == null) return;
    var settings = { url: url, increment: 1, maxvalue: 5, curvalue: 0, disabled: 0, targetId: '#messageRate' };
    if (options) { jQuery.extend(settings, options); };

    jQuery.extend(settings, { cancel: (settings.maxvalue > 1) ? true : false });
    var container = jQuery(this);
    jQuery.extend(container, { averageRating: settings.curvalue, url: settings.url });
    settings.increment = (settings.increment < .75) ? .5 : 1; var s = 0;
    for (var i = 0; i <= settings.maxvalue; i++) {
        if (i == 0) {
            if (settings.cancel == true) {
                var div = '';
                container.empty().append(div);
            }
        }
        else {
            var $div = $('<div class="star"></div>').append('<a href="#' + i + '" ></a>').appendTo(container);
            if (settings.increment == .5) {
                if (s % 2) { $div.addClass('star-left'); }
                else { $div.addClass('star-right'); }
            }
        };
        i = i - 1 + settings.increment;
        s++;
    }
    if (settings.disabled == 1) {

        $('div.rating').css('cursor', 'default');
        $('.star').css('cursor', 'default');
        $('.star a').css('cursor', 'default');
        $('.star a').attr('href', '');
    }
    var stars = jQuery(container).children('.star');
    var cancel = jQuery(container).children('.cancel');
    stars.mouseover(function () {
        if (settings.disabled == 1) { return false; }
        $(this).css('background-position', ' 0 -24px');
        event.drain(); event.fill(this);
    })
    .mouseout(function () {
        $(this).css('background-position', '0 0');
        if (settings.disabled == 1) { return false; }
        event.drain(); event.reset();
    })
    .focus(function () {
        if (settings.disabled == 1) { return false; }
        event.drain(); event.fill(this);
    })
    .blur(function () {
        if (settings.disabled == 1) { return false; }
        event.drain(); event.reset();
    });
    stars.click(function () {
        if (settings.disabled == 1) { return false; }
        settings.disabled = 1;
        if (settings.cancel == true) {
            settings.curvalue = (stars.index(this) * settings.increment) + settings.increment;
            jQuery.post(settings.url + "?id=" + container.attr("recid") + "&rate=" + jQuery(this).children('a')[0].href.split('#')[1], function (result) {
                $(settings.targetId).show();
                $(settings.targetId).html(result);
                $(settings.targetId).fadeOut(3000);
            });
            return false;
        }
        else if (settings.maxvalue == 1) {
            settings.curvalue = (settings.curvalue == 0) ? 1 : 0;
            $(this).toggleClass('on');
            jQuery.post(settings.url + "?id=" + container.attr("recid") + "&rate=" + jQuery(this).children('a')[0].href.split('#')[1], function (result) {
                $(settings.targetId).show();
                $(settings.targetId).html(result);
                $(settings.targetId).fadeOut(3000);
            });
            return false;
        }
        return true;
    });
    if (cancel) {
        cancel.mouseover(function () {
            event.drain();
            jQuery(this).addClass('on');
        })
        .mouseout(function () {
            event.reset();
            jQuery(this).removeClass('on');
        })
        .focus(function () {
            event.drain();
            jQuery(this).addClass('on');
        })
        .blur(function () {
            event.reset();
            jQuery(this).removeClass('on');
        });
        cancel.click(function () {
            event.drain(); settings.curvalue = 0;
            jQuery.post(container.url, { "rate": jQuery(this).children('a')[0].href.split('#')[1], "id": jQuery(this).attr("recid") });
            return false;
        });
    };
    var event = {
        fill: function (el) {
            var index = stars.index(el) + 1;
            stars.children('a').css('width', '100%').end().slice(0, index).addClass('hover').end();
        },
        drain: function () {
            stars.filter('.on').removeClass('on').end().filter('.hover').removeClass('hover').end();
        },
        reset: function () {
            stars.slice(0, settings.curvalue / settings.increment).addClass('on').end();
        }
    };
    event.reset();
    return (this);
};

/*********************/
var selectedUserEditItemsItemID = 0;
$.ajaxSetup({
    beforeSend: function () {
        RemoveAjaxLoader();
        $('.pnlAjaxLoader').fadeIn().fadeTo(1000, '0.9');
    },
    success: function (data) {
        RemoveAjaxLoader();
    },
    error: function (jqXhr, textStatus, errorThrown) {
        RemoveAjaxLoader();
    },
    complete: function () {
        RemoveAjaxLoader();
    }
});
function RemoveAjaxLoader() {
    window.setTimeout(function () {
        $('.pnlAjaxLoader').fadeTo(200, '0', function () { $(this).remove() })
    }, 2000);
}
function OnRefreshComplete() {
    RemoveAjaxLoader();
}

function LoadAdsItemControls(actionUrl, ContentId) {
    selectedUserEditItemsItemID = ContentId;
    if (actionUrl != "" && ContentId > 0) {
        $.post(actionUrl, { 'ContentID': ContentId }, function (data) {

            $("#ContentListAds").html(data);
        });

    }
}

function DeleteAdsItemControls(o, actionUrl, ContentId) {
    selectedUserEditItemsItemID = ContentId;
    if (actionUrl != "" && ContentId > 0) {
        if (confirm(o.attr("data-confirm"))) {
            $.ajax({
                type: "POST",
                url: actionUrl,
                data: { id: o.attr("data-id") },
                success: (function (data) {
                    if (data != null) {
                        $("#ContentListAds").html(data);
                    }
                })
            });
        }


    }
}

function UpdateAdsItemControls(o, actionUrl, ContentId) {
    selectedUserEditItemsItemID = ContentId;
    if (actionUrl != "" && ContentId > 0) {

        $.ajax({
            type: "POST",
            url: actionUrl,
            data: { id: ContentId },
            success: (function (data) {
                if (data != null) {
                    $("#ContentListAds").html(data);
                    alert("به روز رسانی انجام شد");
                }
            })
        });

    }
}
/*************** Currency *******************/
function addPeriod(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function persian_digit(d) {
    d = 1632 + d;
    return "&#" + d + ";";
}

function getCurrency(p) {
    var temp = addPeriod(p);
    var list = temp.split(',');
    temp = '';
    for (var j = 0; j < list.length; j++) {
        for (var i = 0; i < list[j].length; i++) {
            temp += persian_digit(Number(list[j].substr(i, 1))) + '';
        }

        if (j < list.length - 1) {
            temp += ',';
        }
    }

    return temp;
}
/**********************************/
function getcurrencyy(price) {
    $(price).each(function (i, obj) {
        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    });
}

$(document).ready(function () {
        getcurrencyy($('.currencyy'));

    $('.range-val').each(function (i, obj) {

        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

    });



    $(".checkprice").each(function () {
        if (($(this).text() == '') || ($(this).text() == '٠')) {
            $(this).parent().html('بدون قیمت').addClass('font11');
        }
    });
    /*********scroll**********/

    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#fixsubmenu').addClass("fixed");

        }
        else {
            $('#fixsubmenu').removeClass("fixed");
        }
    });

    /******************************/
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });
    //Click event to scroll to top
    $('.scrollToTop').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });


    /*********************/
    $(".price span.currencyy").each(function () {
        //$(this).html(getCurrency($(this).text()));
        if (($(this).text() == '') || ($(this).text() == '٠')) {
            $(this).parent().html('بدون قیمت').addClass('NotExsit');
        }
    });
    $(".alt-price span.currencyy").each(function () {
        //$(this).html(getCurrency($(this).text()));
        if (($(this).text() == '') || ($(this).text() == '٠')) {
            $(this).parent().remove();
        }
    });

    if ($('.starrate').length > 0) {
        $(".starrate").each(function () {
            var no = Number($(this).attr("no"));
            no = no > 0 ? no.toFixed(1) : 0;
            $(this).addClass("star" + parseInt(no));
            /*$(this).next().text(no);*/
        });
    }

    if ($("#giftImage .gift-item > div").length > 0) {
        $('#giftImage .gift-item > div').click(function () {

            if (!($(this).hasClass('active'))) {
                $('#giftImage .gift-item > div.active').removeClass('active');
                $(this).find('input[type=radio]').prop('checked', true);
                $(this).addClass('active');
            }

        })
    }
    if ($("#allcolor .filter-view ul li").length > 0) {
        $("#allcolor .filter-view ul li").hover(
        function () {
            csswidth = -1 * (parseInt($(this).find('span').width() / 2));
            $(this).find('span').fadeIn().css('marginRight', csswidth + 'px');
        }, function () {
            $(this).find('span').fadeOut();
        }
    );
    }
    //
    if ($('.top-link-wrapper').length > 0) {


        var nav = $('.top-link-wrapper');

        $(window).scroll(function () {
            if ($(this).scrollTop() > 125) {
                nav.addClass("static").stop().animate({ top: '5px' });


            } else {
                nav.removeClass("static").stop().animate({ top: '-5px' });

            }
        });
    }

    $('#contentnav a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        $('a').each(function () {
            $(this).parent().removeClass('active');
        })
        $(this).parent().addClass('active');
        var target = this.hash,
       menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 50
        }, 500, 'swing', function () {
//            $(document).on("scroll", onScroll);
        });
    });
//    $(document).on("scroll", onScroll);
//    function onScroll(event) {
//        var scrollPos = $(document).scrollTop();
//        $('#contentnav li').each(function () {
//            var currLink = $(this).find('a');
//            var refElement = $(currLink.attr("href"));
//            if (refElement.position().top - 90 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
//                $('#contentnav li.active').removeClass('active');
//                currLink.parent().addClass("active");
//            }
//            else {
//                currLink.removeClass("active");
//            }
//        });
//    }
    //
    $('#tnav > ul > li').each(function () {
        if ($(this).find('ul').length > 0) {
            $(this).find('> a').append('<div class="arr_d"></div>');
        }
    })
    $("#pageslide").delegate(" #top-nav ul li a", "click", function (event) {
        if ($(this).parent().find('ul').length > 0) {
            event.preventDefault();



            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).parent().removeClass('act');
                $(this).parent().find('ul').slideUp();
            }
            else {
                event.stopPropagation();
                $(this).parent().siblings().find('.active').parent().find('ul').slideUp();
                $(this).parent().siblings().find('.active').removeClass('active');
                $(this).parent().siblings('.act').removeClass('act');
                $(this).addClass('active');
                $(this).parent().addClass('act');
                $(this).parent().find('> ul').slideDown();
                if ($(this).parent().find('> ul').length == 0)
                    $(this).parent().find('.navContent > ul').slideDown();


            }
        }
    });
    //$("#tnav > ul > li").hover(function () {
    //    $(this).addClass('hover');
    //}, function () {
    //    $(this).removeClass('hover');
    //});
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });
    //Click event to scroll to top
    $('.scrollToTop').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    if ($(".compare-rate > div").length > 0) {
        $(".compare-rate > div").each(function () {
            var no = Number($(this).attr("no"));
            no = no > 0 ? no.toFixed(1) : 0;
            $(this).addClass("compare-rate" + parseInt(no));
        });
    }
    $('.delivery-type label').click(function () {
        $('.delivery-type.active').removeClass('active');
        $(this).siblings('input[type=radio]').prop('checked', true);
        $(this).parents('.delivery-type').addClass('active');
    })


    $(".gallinfo").each(function () {
        var flag = $(this).attr("flag");
        if (flag != '') {
            if ((parseInt(flag) & 2) == 2) {
                $(this).find('.thumb .photo').append("<span class='new'></span>");
            }
            else if ((parseInt(flag) & 4) == 4) {
                $(this).find('.thumb .photo').append("<span class='special'></span>");
            }
        }
    });

    if ($(".item .hb-dir.prss strong").length > 0) {

        $('.item .hb-dir.prss strong').each(function () {
            if (($(this).text() == '') || ($(this).text() == ' ')) {
                $(this).parent().html('<img src="/images/notexist.png">')
            }
        })
    }
    if ($("#giftImage .col-xs-3.col-md-3 > div").length > 0) {

        $('#giftImage .col-xs-3.col-md-3 > div').click(function () {

            if (!($(this).hasClass('active'))) {
                $('#giftImage .col-xs-3.col-md-3 > div.active').removeClass('active');
                $(this).find('input[type=radio]').prop('checked', true);
                $(this).addClass('active');
            }

        })
    }

    if ($(".productlist p.price-list span").length > 0) {

        $('.productlist p.price-list span').each(function () {
            if (($(this).text() == '') || ($(this).text() == ' ')) {
                $(this).parents('.gallinfo').find('.price-list1').html('<img src="/images/notexist.png">');
                $(this).parent().html('<img src="/images/notexist.png">');
            }
        })
    }

    $('.cms-rating').each(function () {
        var o = $(this);
        o.rating('/do/common/CMSRating', { maxvalue: 5, increment: 1, curvalue: o.attr("avg"), disabled: o.attr("disabled") });
    });
    if ($(".InvoiceManageTable").length > 0) {
        $('.InvoiceManageTable tr:even').addClass('bgcolor');
    }
    if ($("#questionTabel").length > 0) {
        $('#questionTabel tr:even').addClass('bgcolor');
    }

    if ($(".cms-compare .table-striped").length > 0) {
        $('.cms-compare .table-striped tr:even').addClass('bgcolor');
        $('.cms-compare .table-striped tr td:first-child').addClass('bg1');
    }
    if ($(".locale-city").length > 0) {
        $(".locale-city").locale();
    }
    $("a.INVDELETE").on("click", function () {
        var o = $(this);
        if (confirm(o.attr("data-confirm"))) {
            $.ajax({
                type: "POST",
                url: "/do/adsusers/DeleteAds",
                data: { id: o.attr("data-id") },
                success: (function (data) {
                    if (data != null) {
                        $("#ContentListAds").html(data);
                    }
                })
            });
        }
    });
    $("#userStatusbox").mouseenter(function () {
        var o = $(this);
        o.attr("hover", "true");
        setTimeout(function () {
            if (o.attr("hover") == "true") {
                $("#usermenu").fadeIn(300);
            }
        }, 500);

    });
    $("#userStatusbox").mouseleave(function () {
        var o = $(this);
        o.attr("hover", "false");
        setTimeout(function () {
            if (o.attr("hover") == "false") {
                $("#usermenu").fadeOut();
            }
        }, 500);
    });






    $(document).on("click", "input.submit", function () {
        var btn = $(this);
        var form = btn.parents("form");
        var isValid = true;
        $(form.find('.validationMark')).remove();

        var reNumber = /^-{0,1}\d*\.{0,1}\d+$/;
        var redate = /\d{4}\/\d{2}\/\d{2}/;
        $.each(form.find('.compulsory,.number'), function (index, element) {
            if ($(this).hasClass('compulsory')) {
                if ($(this).val() == '') {
                    isValid = false;
                    $('<div class="validationMark" style="color:red;direction:rtl;padding:5px 0 0;">* الزامی می باشد</div>').insertAfter($(this));
                }
            }
            if ($(this).hasClass('number')) {
                if ($(this).val().search(reNumber) == -1) {
                    isValid = false;
                    $('<div class="validationMark" style="color:red;direction:rtl;padding:5px 0 0;">* لطفا از اعداد استفاده شود</div>').insertAfter($(this));
                }
            }
            if ($(this).hasClass('date')) {
                if ($(this).val().search(redate) == -1) {
                    isValid = false;
                    $('<div class="validationMark" style="color:red;direction:rtl;padding:5px 0 0;">* فرمت تاریخ 0000/00/00</div>').insertAfter($(this));
                }
            }
        });
        if (isValid) {
            $.ajax({
                url: form.attr("action"),
                type: "POST",
                data: form.serialize() + '&itemid=' + selectedUserEditItemsItemID,
                success: function (data) {
                    if (data.length == undefined) {
                        //submitForm(btn, form, data);
                        GotoSellStep(Number(data) + 1);
                    }
                    else {
                        form.parent().html(data);
                        $.validator.unobtrusive.parse("form");
                    }
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log("Error :" + errorThrown);
                },
                complete: function () {
                    //$("#ProgressDialog").dialog("close");
                }
            });
        }
    });



//// Search Bar
//=======================================================//
$("#qsearch #text").keydown(function (e) {
    var begin = lastBeginSearch = $(this).val();

    if (begin.length > 1) {
        $(".SearchContainer").slideDown();
    }



});

$("#qsearch #text").keyup(function (e) {
    switch (e.which) {
        case 13:
            var o = $(this);
            var p = o.parents("#qsearch").first();

            var id = p.find("li.active").attr("value")

            var title = p.find("#text").val();
            if (title && title != '') {
                title = "&title=" + title;
            }
            window.location.href = p.attr("data-url") + "?catid=" + id + title;
        case 37: // left
            return;

        case 38: // up
            if ($("#Suggestion li.mover").length == 0) {
                $("#Suggestion li").last().addClass("mover");
            }
            else {
                var mover = $("#Suggestion li.mover");
                $("#Suggestion li.mover").prev().addClass("mover");
                mover.removeClass("mover");

            }
            return;

        case 39: // right
            return;

        case 40: // down
            if ($("#Suggestion li.mover").length == 0) {
                $("#Suggestion li").first().addClass("mover");
            }
            else {
                var mover = $("#Suggestion li.mover");
                $("#Suggestion li.mover").next().addClass("mover");
                mover.removeClass("mover");

            }
            return;

        default: break; // exit this handler for other keys
    }
    if ($(this).val().length > 1) {
        GetSuggestionKeywordsPre($(this).val());
    }
    else
        $(".SearchContainer").slideUp();
});

$("body").click(function () {
    $(".SearchContainer").slideUp();
});
});

function GetSuggestionKeywordsPre(text) {
    var $this = $(this);
    clearTimeout($this.data("sbfthrottle112"));
    $this.data("sbfthrottle112", setTimeout(function () {
        GetSuggestionKeywords(text);
    }, 300))
}



function GetSuggestionKeywords(text) {

    if (lastBeginSearch == text)
        return;


    var begin = lastBeginSearch = text;
    if (begin.length < 2) {
        $("#Suggestion ul").html('');
        $("#Distincts ul").html('');
        $("#Suggestion .spanmore").html('');

        return;
    }



    $.ajax({
        type: "Get",
        url: "/do/Page/SearchAutocomplate/?title=" + encodeURIComponent(begin),

        dataType: "json",
        success: function (msg) {



            if (msg.ErrorMessage != undefined || msg.ErrorMessage == null || msg.ErrorMessage == '') {


                if (text != msg.SearchKey) {

                    return;
                }
                $("#Suggestion ul").html('');
                $("#Distincts ul").html('');
                $("#Suggestion .spanmore").html('');

                if (msg.Result != undefined && msg.Result.length > 0) {
                    $.each(msg.Result, function (i, item) {

                        $("#Suggestion ul").append('<li><a href="' + item.Url + '"><div class="desc"><p>' + item.Name + '</p></div>' + (item.ImageSrc.trim() != "" ? '<div class="img"><img src="' + item.ImageSrc + '" /></div>' : '') + '</a></li><li class="sep"></li>');
                    });


                }
                else {
                    $("#Suggestion ul").append('<li class="noresult">' + msg.Message + '</li>')
                }

                if (msg.ProductGroups != null && msg.ProductGroups.length > 0) {
                    $.each(msg.ProductGroups, function (i, item) {

                        //$("#Distincts ul").append('<li><a href="/search?catid=' + item.Id + '&title=' + msg.SearchKey + '">در ' + item.Name + '</a></li>');
                        $("#Distincts ul").append('<li><a href="/product/' + item.Id + '/product?title=' + msg.SearchKey + '">در ' + item.Name + '</a></li>');
                    });
                }
                else {
                    $("#Distincts ul").append('<li class="noresult">موردی در میان گروهه های محصولات یافت نشد!</li>')
                }

                var suggestionHeight = $("#Suggestion").height();
                var distinctsHeight = $("#Distincts").height();
                if (suggestionHeight > distinctsHeight) {
                    $("#Distincts").height(suggestionHeight);
                    //$(".SearchContainer").height(suggestionHeight);
                }
                else {
                    $("#Suggestion").height(distinctsHeight);
                    //$(".SearchContainer").height(distinctsHeight);

                }


            }
        },
        error: function () {

            alert("");

        }
    });

}

function showAlert(msg) {
    var alertHtml = '<div class="modal fade" id="alert-window"> ' +
        '<div class="modal-dialog">' +
        '    <div class="modal-content">' +
        '        <div class="modal-header">' +
        '            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
        '            <h4 class="modal-title">Modal title</h4>' +
        '        </div>' +
        '        <div class="modal-body">' +
        '            <p>One fine body…</p>' +
        '        </div>' +
        '        <div class="modal-footer">' +
        '            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
        '            <button type="button" class="btn btn-primary">Save changes</button>' +
        '        </div>' +
        '   </div>' +
        '   </div>' +
        '</div> ';

    if (('#alert-window').length == 0)
        $('body').append($(alertHtml));
}
