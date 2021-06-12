function handleSliderValue(value) {

    var max = parseInt($(this).parent().attr("range-max"))

    if (value > 0 && value < max) {
        $(this).addClass('changed');
    }
    else {
        $(this).removeClass('changed');
    }
    $(this).text(parseInt(value));
}

function getRangeQuery(id, type) {

    var q = '';
    var rp = $("#" + id)
    if (rp.length > 0) {

        var f = rp.children("#" + id + "-from");
        var t = rp.children("#" + id + "-to");

        if (f.prop("tagName") == "INPUT") {
            if (!isNaN(parseInt(f.val()))) {
                q += 'from' + type + '=' + f.val() + "&";
            }
            if (!isNaN(parseInt(t.val()))) {
                q += 'to' + type + '=' + t.val() + "&";
            }
        }
        else {

            if (f.hasClass("changed")) {
                q += 'from' + type + '=' + f.text() + "&";
            }
            if (t.hasClass("changed")) {
                q += 'to' + type + '=' + t.text() + "&";
            }
        }
    }

    return q;
}

function rangeSliderPrice() {
    var rc = $(".range-price-container");
    if (rc.length > 0) {
        rc.each(function () {
            var o = $(this);

            if (o.children("#range-price-slider").length > 0) {
                var max = parseInt(o.attr("range-max"));

                var from = parseInt(o.children("#range-price-from").text().replace(/,/g, ""));
                var to = parseInt(o.children("#range-price-to").text().replace(/,/g, ""));

                if (!from) from = 0;
                if (!to) to = max;

                var rs = o.children("#range-price-slider");

                rs.on({
                    slide: function () {
                    },
                    set: function () {
                    },
                    change: function () {
                        doSearch();
                    }
                });

                rs.noUiSlider({
                    range: {
                        'min': [0],
                        'max': [max]
                    },
                    step: 10000,
                    start: [from, to]
                });

                rs.Link('lower').to($("#range-price-from"), handleSliderValue);
                rs.Link('upper').to($("#range-price-to"), handleSliderValue);


            }

        });
    }

}

function bindFilter(ul, v) {
    if (v > 0) {
        var ms = ul.hasClass("check");
        ul.find("li").each(function () {
            var code = Number($(this).attr("code"));
            if (code == v || (ms && (code & v) == code)) {
                $(this).addClass("active");
                var label = ul.prev("label");
                //if (label.length > 0) {
                //  ul.prev("label").append(": " + $(this).text());
                //}
            }
        });
    }
}

function bindFilters(o, V) {

    o.find(".filter-item ul.check li.active").each(function () {
        $(this).removeClass("active");
    });

    if (V && V.length > 0) {
        var arr = V.split('~');
        //    for (var i = 0; i < arr.length; i++) {
        //        bindFilter(O.find("ul").eq(i), Number(arr[i]));
        //    }
        arr.forEach(function (item, index) {
            if (item && item.length > 0 && item != "") {
                var itemResult = item.split("-");
                if (itemResult && itemResult.length > 0) {
                    var tagGroupId = itemResult[0];
                    o.find(".filter-item ul.check").each(function () {
                        var ulElement = $(this);
                        if ($(ulElement).attr("data-tagGroupId") === tagGroupId) {
                            var tagIds = itemResult[1].split(",");
                            if (tagIds && tagIds.length > 0) {
                                tagIds.forEach(function (tagId, index) {
                                    if (tagId && tagId.length > 0 && tagId != "") {
                                        $(ulElement).find("li[code='" + tagId + "']").addClass("active");
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }

}

function getFilter(o) {
    //var f = [0, 0, 0, 0, 0, 0, 0, 0];
    //var p = '';
    //o.find(".filter-item ul").each(function () {
    //    var no = $(this).attr("id").slice(-1);
    //    var v = 0;
    //    $(this).find("li").each(function () {
    //        if ($(this).hasClass("active")) {
    //            v |= Number($(this).attr("code"));
    //        }
    //    });
    //    f[no - 1] = v;
    //});
    //for (var i = 0; i < f.length; i++) {
    //    p += "~" + f[i];
    //}
    //return p.substr(1);
    var result = "";
    o.find(".filter-item ul").each(function () {
        var tagGroupId = $(this).attr("data-tagGroupId");
        if (result.length > 0) {
            result += "~";
        }
        if ($(this).find("li.active").length > 0) {
            var selectedTags = "";
            $(this).find("li.active").each(function () {
                if (selectedTags && selectedTags.length > 0) {
                    selectedTags += ",";
                }
                selectedTags += $(this).attr("code");
            });
            result += tagGroupId + "-" + selectedTags;
        }
        else {
            result += tagGroupId + "-0";
        }
    });

    return result;
}

function setFilter(O, V) {
    if (V.length > 0) {
        var arr = V.split('~');
        for (var i = 0; i < arr.length; i++) {
            var b = O.find("ul").eq(i);
            var v = Number(arr[i]);
            b.find("li").each(function () {
                var code = Number($(this).attr("code"));
                if ((code & v) == code) {
                    $(this).addClass("active show");
                }
                else {
                    $(this).css("display", "none");
                }
            });
        }
    }
}

function doSearch() {
    var psort = '';
    if ($("#psort").length > 0 && $("#psort li.active").attr("code")) {
        psort = "sort=" + $("#psort li.active").attr("code") + "&";
    }

    var psize = '';
    if ($("#psize").length > 0 && $("#psize li.active").attr("code")) {
        psize = "psize=" + $("#psize li.active").attr("code") + "&";
    }

    var filter = '';
    if ($("#cms-filter").length > 0) {
        filter = "filter=" + getFilter($("#cms-filter")) + "&";
    }
    var exist = '';
    if ($("#cms-exist").length > 0) {
        if ($("#cms-exist").hasClass("active")) {
            exist = "exist=true&";
        } else {
            exist = "exist=false&";
        }
    }
    var url = $('#cms-filter').attr("data-url") + "?" + getRangeQuery("range-price", 'Price') + psort + exist + psize + filter;
    if (url.substr(-1) === "&") { url = url.substr(0, url.length - 1); }
    window.location.href = url;

}

$(document).ready(function () {

    rangeSliderPrice();


    $(".searchnav .filter-item").hover(function () {
        $(this).find("ul").slideDown();
        $(this).find("label").addClass('hover');
    }, function () {
        $(this).find("ul").hide();
        $(this).find("label").removeClass('hover');
    });

    $("#cms-exist").click(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
        else {
            $(this).addClass("active");
        }
        doSearch();
    });

    bindFilters($("#cms-filter"), $("#cms-filter").attr("data-filter"));
    bindFilter($("#psort"), $("#psort").attr("data-filter"));
    bindFilter($("#psize"), $("#psize").attr("data-filter"));


    $(".filter-view").each(function () {
        var filter = Number($(this).attr("filter"));
        if ($(this).children("ul").length == 1) {
            var ul = $(this).children("ul");
            ul.find("li").each(function () {
                var code = Number($(this).attr("code"));
                if ((code & filter) == code) {
                    $(this).addClass("active");
                }
            });
        }
    });

    $(document).on("click", ".filter-item li", function () {
        var li = $(this);
        var p = li.parent();
        var no = p.attr("id").slice(-1);
        var code = Number(li.attr("code"));
        var f = $("#UtilField" + no);
        var ucode = Number(f.val());
        if (p.hasClass("check")) {
            if (li.hasClass("active")) {
                li.removeClass("active");
                if (ucode >= code) {
                    f.val(ucode - code);
                }
            }
            else {
                li.addClass("active")
                f.val(ucode | code);
            }
        }
        else {

            p.find("li").removeClass("active");
            if (li.hasClass("active")) {
                f.val('0');
            }
            else {
                li.addClass("active")
                f.val(code);
            }
        }
        if (li.parents("#filters").length < 1) {
            doSearch();
        }
    });

    $('#cms-filter .filter-item .show-more').click(function (event) {
        event.preventDefault();
        if ($(this).text() === 'بیشتر...') {
            $(this).parents('#cms-filter .filter-item').find('ul').animate({ maxHeight: "+=1000px" }, 1000);
            $(this).text('بستن');
        }
        else {
            $(this).parents('#cms-filter .filter-item').find('ul').animate({ maxHeight: "-=1000px" }, 1000);
            $(this).text('بیشتر...');
            $('html, body').animate({ scrollTop: ($(this).parents('#cms-filter .filter-item').offset().top - 100) }, 1000);
        }
    });

});
