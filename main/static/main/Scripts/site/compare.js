function toCompare(id, st, name, url, image, callBack) {
    var o = $(this);
    o.addClass("loading");
    $.ajax({
        type: "POST",
        url: "/do/cms/addtocompare",
        data: "{id:" + id + ",st:" + st + ",name:'" + name + "',url:'" + url + "',image:'" + image + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (r) {
            if (callBack) {
                callBack();
            }
            else {
                var data = r.d != undefined ? Number(r.d) : Number(r);
                if (data > -1) {
                    if (data == '0') {
                        $("#compare").slideUp();
                    }
                    else {
                        var count = $("#compare #compare-bar > li").size();
                        $("#compare").slideDown();                        
//                        if (count == 1) {
//                            $('html, body').animate({
//                                scrollTop: ($('#compare').offset().top) - 60
//                            }, 1000);
                        //                        }
                        $('html, body').animate({
                            scrollTop: ($('#compare').offset().top) - 60
                        }, 1000);
                    }
                    $("#compareCount").text(data);
                }
                o.removeClass("loading");
            }
        },
        dataType: "json",
        error: function (err) { }
    });
}
$(document).ready(function () {
    $(".cms-compare .table .df-selection").each(function () {
        //$(this).html(getCurrency($(this).text()));
        if (($(this).text() == 'false')) {
            $(this).parent().addClass('unchecked');
        }
        else if (($(this).text() == 'true')) {
            $(this).parent().addClass('checked');
        }
    });
    $(document).on("click", ".compare-add", function () {
        var o = $(this);
        var id = o.attr("data-id");
        toCompare(Number(id), 1, o.attr("data-name"), o.attr("data-url"), o.attr("data-image"));
        if ($("#compare-bar li#" + id).length < 1) {
            var center = $("<div class='border-licom'/>");
            var a = $("<a class='img-com'/>");
            var name = $("<a class='name-com'/>");
            a.attr("href", o.attr("data-url"));
            name.attr("href", o.attr("data-url"));
            a.html("<img src='" + o.attr("data-image") + "'/>");
            name.text(o.attr("data-name"));
            var li = $("<li class='col-md-3 col-sm-3 col-xs-6'><div></div></li>");
            var div = li.find('> div');
            div.append(a);
            div.append(name);
            li.attr("id", id);
            div.append($("<a class='compare-remove' data-id='" + id + "'><i class='icon-remove'></i></a>"));
            li.hide();
            $("#compare-bar").append(li);
            li.fadeIn();
        }
    });
    $(document).on("click", ".compare-remove", function () {
        var o = $(this);
        var id = o.attr("data-id");
        toCompare(Number(id), 2);
        $("#compare-bar li#" + id).remove();
    });
    $("#compare-clear").click(function () {
        toCompare(0, 0);
        $("#compare-bar li").remove();
    });


    $('#btnToggleCompare').click(function () {
        $('#compare-slide').slideToggle("slow", function () {
            $('#btnToggleCompare').toggleClass('font0');
            $('#btnToggleCompare i').toggleClass('fa-angle-up fa-angle-down');
        });
    });

    $("#compare-search").keypress(function () {
        var o = $(this);
        o.addClass("loading");
        $.ajax({
            type: "POST",
            url: "/do/CMS/CompareSearch",
            data: "{title:'" + $("#compare-search").val() + "',catid:'" + o.attr("data-id") + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                o.removeClass("loading");
                if (o.val() == '') {
                    $("#compare-search-result").hide();
                }
                else {
                    $("#compare-search-result").show();
                    $("#compare-search-result").html(data);
                    $("#compare-search-result").mCustomScrollbar({
                        scrollButtons: {
                            enable: true
                        }
                    });
                }
            },
            dataType: "html",
            error: function () { }
        });
    });
    $(document).on("click", ".compare-add-redirect", function () {
        var o = $(this);
        var id = o.attr("data-id");
        toCompare(Number(id), 1, o.attr("data-name"), o.attr("data-url"), o.attr("data-image"), function () { window.location = "/compare"; });
    });
    $(document).on("click", ".compare-remove-redirect", function () {
        var o = $(this);
        var id = o.attr("data-id");
        toCompare(Number(id), 2, undefined, undefined, undefined, function () { window.location.reload(); });
    });
});
