from django.shortcuts import render,redirect
from django.http import HttpResponse
from . import database
from django.conf import settings

# Init
db = database.main_db()

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

    return render(request,'page.html',{'title':page[lang]['title'],'content':page[lang]['content']})

# FAQ View
def faq(request):
    lang = request.session.get("lang")
    con = db.connect()
    col = con['faq']
    faqs = list(col.find())

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
    request.session['lang'] = "fa"
    con = db.connect()
    col = con['news']
    news = list(col.find())
    result = []
    for item in news:
        result.append({
            "title": item[request.session.get('lang')]['title'],
            "content": item[request.session.get('lang')]['content'],
            "date": item[request.session.get('lang')]['date'],
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
    article = col.find_one({"_id": db.object_id(nid)})
    context = {
        "title": article[request.session.get('lang')]['title'],
        "content": article[request.session.get('lang')]['content'],
        "date": article[request.session.get('lang')]['date'],
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
        if filter_list[1] == "1015-86665":
            duration_limit = 1
        if filter_list[1] == "1015-86669":
            duration_limit = 1
        if filter_list[1] == "1015-86670":
            duration_limit = 3
        if filter_list[1] == "1015-86671":
            duration_limit = 7
        if filter_list[1] == "1015-86672":
            duration_limit = 15
        if filter_list[1] == "1015-86673":
            duration_limit = 30
        if filter_list[1] == "1015-86674":
            duration_limit = 60
        if filter_list[1] == "1015-86675":
            duration_limit = 90
        if filter_list[1] == "1015-86676":
            duration_limit = 120
        if filter_list[1] == "1015-86677":
            duration_limit = 180
        if filter_list[1] == "1015-86678":
            duration_limit = 365

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
    col = con['packages']

    packages = col.find({"category_id": db.object_id(cid)})
    result = []
    for item in packages:
        if int(item['price']) >= min_range and int(item['price']) <= max_range and int(item['duration']) <= duration_limit and int(item['size']) >= min_size and int(item['size']) <= max_size:
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
    # if cid == "60b795e4941c3d6e1fe66217":
    #     aside = False


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

    simcard = col.find_one({"_id":db.object_id(sid)})

    context = {
        "card": simcard[lang]
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

    # Slides
    col = con['slides']
    slides = list(col.find({"active":1,"section": db.object_id("60bb3d18543cdbdae3377bec")}))
    for i in range(0,len(slides)):
        if lang == "en":
            slides[i]['title'] = slides[i]['en_title']

    context = {
        "slides": slides
    }

    return render(request,'enterprise.html',context)


# Areas View
def areas(request):
    return render(request,'areas.html',{})


# Test view
def test(request):
    return HttpResponse(settings.BASE_DIR)
