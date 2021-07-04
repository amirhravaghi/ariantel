from django.shortcuts import render,redirect
from django.http import HttpResponse
from . import database
from django.conf import settings
from django.core.mail import send_mail
from . import functions

# Init
db = database.main_db()
funcs = functions.main_functions()

# index view
def index(request):

    # Init
    request.session['section'] = "personal"
    con = db.connect()
    lang = request.session.get('lang')
    if lang is None:
        lang = "fa"

    # Slides
    col = con['slides']
    slides = list(col.find({"active":1,"section":db.object_id("60bb3d18543cdbdae3377bed")}))
    for i in range(0,len(slides)):
        if lang == "en":
            slides[i]['title'] = slides[i]['en_title']
            if 'en_image' in slides[i]:
                slides[i]['image'] = slides[i]['en_image']
        else:
            if 'fa_image' in slides[i]:
                slides[i]['image'] = slides[i]['fa_image']
                

    # Packages
    col = con['product_categories']
    packages = list(col.find())
    packages_result = []
    for item in packages:
        packages_result.append({
            "id": str(item['_id']),
            "name": item[lang]['name'],
            "image": item[lang]['image']
        })

    # Simcards
    col = con['simcards']
    cards = list(col.find())
    cards_result = []
    for item in cards:
        cards_result.append({
            "id": str(item['_id']),
            "name": item[lang]['title'],
            "image": item["fa"]['image']
        })

    # Context
    context = {
        "slides": slides,
        "packages": packages_result,
        "cards": cards_result
    }

    return render(request,'index.html',context)


# Lang View
def lang(request,lng):
        lng = lng.lower()
        if lng == "en" or lng == "fa":
            request.session['lang'] = lng
        return redirect('/')


# Custom page view
def page(request,aid):
    # Get page from db
    con = db.connect()
    col = con['pages']
    page = col.find_one({'access_id':aid})
    lang = request.session.get("lang")
    if lang is None:
        lang = "fa"

    return render(request,'page.html',{'title':page[lang]['title'],'content':page[lang]['content']})

# FAQ View
def faq(request):
    lang = request.session.get("lang")
    con = db.connect()
    col = con['faq']
    faqs = list(col.find())
    if lang is None:
        lang = "fa"
    faq_result = []
    for item in faqs:
        faq_result.append({
            "question": item[lang]['question'],
            "answer": item[lang]['answer']
        })

    context = {
        'faqs': faq_result
    }

    return render(request,'faq.html',context)

# News View
def news(request):
    con = db.connect()
    col = con['news']
    news = list(col.find())
    lang = request.session.get('lang')
    if lang is None:
        lang = "fa"
    result = []
    for item in news:
        result.append({
            "title": item[lang]['title'],
            "content": item[lang]['content'],
            "date": item[lang]['date'],
            "image": item['image'],
            "id": str(item['_id'])
        })
    context = {
        'news': result
    }
    return render(request,'news.html',context)

# Article view
def article(request,nid):
    con = db.connect()
    col = con['news']
    col.update({"_id": db.object_id(nid)},{"$inc":{ "views": 1 }})
    lang = request.session.get('lang')
    if lang is None:
        lang = "fa"
    article = col.find_one({"_id": db.object_id(nid)})
    context = {
        "title": article[lang]['title'],
        "content": article[lang]['content'],
        "date": article[lang]['date'],
        "views": article['views'],
        "image": article['image'],
    }
    return render(request,'article.html',context)


# Packages view
def packages(request,cid):
    card_type = False
    min_range = 0
    max_range = 1000000
    duration_limit = 365
    min_size = 0
    max_size = 999999999999999999999999999999999
    duration_filter = False
    if request.GET:
        min_range = int(request.GET.get("fromPrice",0))
        max_range = int(request.GET.get("toPrice",1000000))
        filter = request.GET.get("filter",0)
        filter_list = filter.split('~')

        # Simcard type filter
        if filter_list[0] == "1014-86664":
            card_type = "postpaid"
        if filter_list[0] == "1014-86663":
            card_type = "prepaid"
        if filter_list[0] == "1014-0":
            card_type = False

        # Duration filter
        duration_filter = False
        if filter_list[1] == "1015-0":
            duration_filter = False
        if filter_list[1] == "1015-86665":
            duration_limit = 1
            duration_filter = True
        if filter_list[1] == "1015-86669":
            duration_limit = 1
            duration_filter = True
        if filter_list[1] == "1015-86670":
            duration_limit = 3
            duration_filter = True
        if filter_list[1] == "1015-86671":
            duration_limit = 7
            duration_filter = True
        if filter_list[1] == "1015-86672":
            duration_limit = 15
            duration_filter = True
        if filter_list[1] == "1015-86673":
            duration_limit = 30
            duration_filter = True
        if filter_list[1] == "1015-86674":
            duration_limit = 60
            duration_filter = True
        if filter_list[1] == "1015-86675":
            duration_limit = 90
            duration_filter = True
        if filter_list[1] == "1015-86676":
            duration_limit = 120
            duration_filter = True
        if filter_list[1] == "1015-86677":
            duration_limit = 180
            duration_filter = True
        if filter_list[1] == "1015-86678":
            duration_limit = 365
            duration_filter = True

        # Size filter
        if filter_list[2] == "1016-86680":
            max_size = 100
        if filter_list[2] == "1016-86681":
            min_size = 100
            max_size = 500
        if filter_list[2] == "1016-86682":
            min_size = 500
            max_size = 2000
        if filter_list[2] == "1016-86683":
            min_size = 2000
            max_size = 10000
        if filter_list[2] == "1016-86684":
            min_size = 10000

    con = db.connect()
    lang = request.session.get('lang')
    if lang is None:
        lang = "fa"
    col = con['packages']

    packages = col.find({"category_id": db.object_id(cid)})
    result = []
    for item in packages:
        if int(item['price']) >= min_range and int(item['price']) <= max_range and int(item['size']) >= min_size and int(item['size']) <= max_size:
                
            if duration_filter:
                if not int(item['duration']) == duration_limit:
                    continue          

            if not card_type:
                result.append({
                    "name": item[lang]['name'],
                    "image": item[lang]['image'],
                    "short_description": item[lang]['short_description'],
                    "price": item['price'],
                    "i_network": item['i_network'],
                    "o_network": item['o_network'],
                    "category_id": cid,
                    "card_type": item['card_type'],
                    "duration": item['duration'],
                    "size": item['size']
                })
            else:
                if item['card_type'] == card_type:
                    result.append({
                        "name": item[lang]['name'],
                        "image": item[lang]['image'],
                        "short_description": item[lang]['short_description'],
                        "price": item['price'],
                        "i_network": item['i_network'],
                        "o_network": item['o_network'],
                        "category_id": cid,
                        "card_type": item['card_type'],
                        "duration": item['duration'],
                        "size": item['size']
                    })

    col = con['product_categories']
    cat = col.find_one({"_id":db.object_id(cid)})

    aside = True
    if cid == "60b795e4941c3d6e1fe66215" or cid == "60b795e4941c3d6e1fe66216":
        aside = False


    context = {
        "packages": result,
        "category": {
            "id": cid,
            "name": cat[lang]['name'],
            "image": cat[lang]['image']
        },
        "aside": aside,
        "filter":{
            "min_range": min_range,
            "max_range": max_range
        }
    }

    return render(request,'packages.html',context)

# Simcard product view
def simcard(request,sid):

    # init
    con = db.connect()
    col = con['simcards']
    lang = request.session.get('lang')
    if lang is None:
        lang = "fa"

    simcard = col.find_one({"_id":db.object_id(sid)})

    context = {
        "card": simcard[lang],
        "image": simcard['fa']['image']
    }

    return render(request,'simcard.html',context)

# Enterprise Section
def enterprise(request):

    # Set session
    request.session['section'] = "enterprise"

    # init
    con = db.connect()
    col = con['slides']
    lang = request.session.get('lang')
    if lang is None:
        lang = "fa"

    # Slides
    col = con['slides']
    slides = list(col.find({"active":1,"section": db.object_id("60bb3d18543cdbdae3377bec")}))
    for i in range(0,len(slides)):
        if lang == "en":
            slides[i]['title'] = slides[i]['en_title']
            if 'en_image' in slides[i]:
                slides[i]['image'] = slides[i]['en_image']
        else:
            if 'fa_image' in slides[i]:
                slides[i]['image'] = slides[i]['fa_image']

    context = {
        "slides": slides
    }

    return render(request,'enterprise.html',context)


# Areas View
def areas(request):
    return render(request,'areas.html',{})

# Employments View
def employments(request):

    # init
    error = None
    error_message = ""

    if request.POST:
        if not request.POST['cur_captcha'] == request.POST['captcha']:
            error = True
            if request.session['lang'] == 'en':
                error_message = "Wrong Captcha"
            else:
                error_message = "عبارت متن کنترلی صحیح نمی باشد"
        else:
            try:
                if request.FILES['resume'] and not request.FILES['resume'].name == "":
                    resume = settings.MAIN_URL + settings.STATIC_URL + funcs.file_upload(request.FILES['resume'])
                else:
                    resume = ""
                subject = "درخواست جدید همکاری با ما"    
                text = 'فرم همکاری با ما<br/><br/>نام: ' + request.POST['name'] + '<br/>نام خانوادگی: ' + request.POST['last_name'] + '<br/>کد ملی: ' + request.POST['national_code'] + '<br/>میزان تحصیلات: ' + request.POST['education'] + '<br/>رشته تحصیلی: ' + request.POST['field'] + '<br/>تلفن همراه: ' + request.POST['phone'] + '<br/>وضعیت نظام وظیفه: ' + request.POST['military'] + '<br/>سابقه کاری در زمینه یو پی اس: <br/>' + request.POST['ups_record'] + '<br/>نوع همکاری: ' + request.POST['type'] + "<br/>تاریخ همکاری به سال: " + request.POST['date'] + "<br/>نام شرکت: " + request.POST['company'] + "<br/>لینک رزومه: " + resume
                email_from = settings.EMAIL_HOST_USER
                recipient_list = ["info@ariantel.ir", ]
                send_mail( subject, text, email_from, recipient_list )
                error = False
                if request.session['lang'] == 'en':
                    error_message = "Your request has been sent successfully"
                else:
                    error_message = "درخواست شما با موفقیت ارسال شد"
            except:
                error = True
                if request.session['lang'] == 'en':
                    error_message = "An unknown error happened"
                else:
                    error_message = "متاسفانه خطایی رخ داد"

    context = {
        "error": error,
        "message": error_message,
    }

    return render(request,'employments.html',context)

# Test view
def test(request):
    return HttpResponse(settings.BASE_DIR)
