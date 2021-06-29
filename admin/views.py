from django.shortcuts import render,redirect
from django.conf import settings
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import database
from . import functions
import bcrypt

# Db class object
db = database.main_db()
auth = functions.auth()
main_functions = functions.main_functions()

# Views
# Media Upload
@csrf_exempt
def mediaUpload(request):
        file = request.FILES['image']
        address = settings.MAIN_URL + settings.STATIC_URL + main_functions.media_upload(file)
        return JsonResponse({"url": address,"status": 1 })


# Login View
def login(request):
    if auth.authenticated(request.session.get('auth_token')):
        return redirect("/admin")

    # init
    error = False

    if request.POST:
        username = request.POST.get("username",0)
        password = request.POST.get("password",0)
        remember = request.POST.get("remember",0)
        if username == 0 or password == 0:
            error = True
        else:
            auth_res = auth.login(username,password)
            if auth_res:
                request.session['auth_token'] = auth_res['token']
                request.session['admin_full_name'] = auth_res['full_name']
                return redirect("/admin")
            else:
                error = True

    context = {
        "error": error,
    }
    return render(request,'login.html',context)


# Logout View
def logout(request):
    request.session['auth_token'] = None
    return redirect('/admin/login')


# Index View
def index(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")
    return render(request,'admin_index.html',{})


# News View
def news(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['news']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        try:
            fa = {
                "title": request.POST['fa_news_title'],
                "date": request.POST['fa_date'],
                "content": request.POST['fa_content']
            }
            en = {
                "title": request.POST['en_news_title'],
                "date": request.POST['en_date'],
                "content": request.POST['en_content']
            }
            image = main_functions.media_upload(request.FILES['media'])
            col.insert_one({
                "fa": fa,
                "en": en,
                "image": image,
                "views": 0
            })
            new_one = True
        except:
            new_one = False

    news = list(col.find())
    for i in range(0,len(news)):
        news[i]['id'] = news[i]['_id']

    context = {
        'news': news,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_news.html',context)


# Add news view
def add_news(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    return render(request,'admin_add_news.html',{})


# Edit news view
def edit_news(request,aid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['news']
    edit_status = None

    # Post Check
    if request.POST:
        # try:
            fa = {
                "title": request.POST['fa_news_title'],
                "date": request.POST['fa_date'],
                "content": request.POST['fa_content']
            }
            en = {
                "title": request.POST['en_news_title'],
                "date": request.POST['en_date'],
                "content": request.POST['en_content']
            }
            if request.FILES:
                if request.FILES['media'].name and not request.FILES['media'].name == "":
                    image = main_functions.media_upload(request.FILES['media'])
                    set = {
                        "fa":fa,
                        "en":en,
                        "image":image
                    }
            else:
                set = {
                    "fa":fa,
                    "en":en,
                }
            col.update_one({"_id":db.object_id(aid)},{"$set":set})
            edit_status = True
        # except:
        #     edit_status = False

    article = col.find_one({'_id':db.object_id(aid)})
    article['id'] = article['_id']

    context = {
        "article": article,
        "edit_status": edit_status
    }

    return render(request,'admin_edit_news.html',context)


# Packages View
def packages(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['packages']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        try:
            fa = {
                "name": request.POST['fa_name'],
                "short_description": request.POST['fa_short_description'],
                "image": ""
            }
            en = {
                "name": request.POST['en_name'],
                "short_description": request.POST['en_short_description'],
                "image": ""
            }
            category_id = db.object_id(request.POST['category'])
            card_type = request.POST['card_type']
            price = request.POST['price']
            i_network = request.POST['i_network']
            o_network = request.POST['o_network']
            size = request.POST['size']
            duration = request.POST['duration']
            col.insert_one({
                "fa": fa,
                "en": en,
                "category_id": category_id,
                "card_type": card_type,
                "price": price,
                "i_network": i_network,
                "o_network": o_network,
                "size": size,
                "duration": duration
            })
            new_one = True
        except:
            new_one = False

    packages = list(col.find())
    col = con['product_categories']
    for i in range(0,len(packages)):
        packages[i]['id'] = packages[i]['_id']
        packages[i]['cat'] = col.find_one({"_id":packages[i]['category_id']})

    context = {
        'packages': packages,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_packages.html',context)


# Add package view
def add_package(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    return render(request,'admin_add_package.html',{})


# Edit package view
def edit_package(request,pid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['packages']
    edit_status = None

    # Post Check
    if request.POST:
        try:
            fa = {
                "name": request.POST['fa_name'],
                "short_description": request.POST['fa_short_description'],
                "image": ""
            }
            en = {
                "name": request.POST['en_name'],
                "short_description": request.POST['en_short_description'],
                "image": ""
            }
            category_id = db.object_id(request.POST['category'])
            card_type = request.POST['card_type']
            price = request.POST['price']
            i_network = request.POST['i_network']
            o_network = request.POST['o_network']
            size = request.POST['size']
            duration = request.POST['duration']
            col.update_one({"_id":db.object_id(pid)},{"$set":{
                "fa": fa,
                "en": en,
                "category_id": category_id,
                "card_type": card_type,
                "price": price,
                "i_network": i_network,
                "o_network": o_network,
                "size": size,
                "duration": duration
            }})
            edit_status = True
        except:
            edit_status = False

    package = col.find_one({'_id':db.object_id(pid)})
    package['id'] = package['_id']
    col = con['product_categories']
    package['cat'] = col.find_one({"_id":package['category_id']})

    context = {
        "package": package,
        "edit_status": edit_status
    }

    return render(request,'admin_edit_package.html',context)


# Cards View
def cards(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['simcards']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        try:
            fa = {
                "title": request.POST['fa_title'],
                "introduction": request.POST['fa_introduction'],
                "manual": request.POST['fa_manual'],
                "fees": request.POST['fa_fees'],
            }
            if request.FILES:
                if request.FILES['fa_media'].name and not request.FILES['fa_media'].name == "":
                    fa["image"]= main_functions.media_upload(request.FILES['fa_media'])
            en = {
                "title": request.POST['en_title'],
                "introduction": request.POST['en_introduction'],
                "manual": request.POST['en_manual'],
                "fees": request.POST['en_fees'],
            }
            col.insert_one({
                "fa": fa,
                "en": en,
            })
            new_one = True
        except:
            new_one = False

    cards = list(col.find())
    for i in range(0,len(cards)):
        cards[i]['id'] = cards[i]['_id']

    context = {
        'cards': cards,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_cards.html',context)


# Add card view
def add_card(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    return render(request,'admin_add_card.html',{})


# Edit card view
def edit_card(request,pid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['simcards']
    edit_status = None
    card = col.find_one({'_id':db.object_id(pid)})

    # Post Check
    if request.POST:
        try:
            fa = {
                "title": request.POST['fa_title'],
                "introduction": request.POST['fa_introduction'],
                "manual": request.POST['fa_manual'],
                "fees": request.POST['fa_fees'],
                "image": card['fa']['image']
            }
            if request.FILES:
                if request.FILES['fa_media'].name and not request.FILES['fa_media'].name == "":
                    fa["image"] = main_functions.media_upload(request.FILES['fa_media'])
            en = {
                "title": request.POST['en_title'],
                "introduction": request.POST['en_introduction'],
                "manual": request.POST['en_manual'],
                "fees": request.POST['en_fees'],
            }
            col.update_one({"_id":db.object_id(pid)},{"$set":{
                "fa": fa,
                "en": en,
            }})
            edit_status = True
        except:
            edit_status = False

    card = col.find_one({'_id':db.object_id(pid)})
    card['id'] = card['_id']

    context = {
        "card": card,
        "edit_status": edit_status
    }

    return render(request,'admin_edit_card.html',context)


# Slides View
def slides(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['slides']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        # try:
            data = {
                "title": request.POST['fa_title'] if request.POST.get('fa_title',False) else "",
                "link": request.POST['link'],
                "en_title": request.POST['en_title'] if request.POST.get('en_title',False) else "",
                "section": db.object_id(request.POST['section']),
                "active": int(request.POST.get("active",0))
            }
            if request.FILES:
                #data['test'] = "Hey"
                en_file = request.FILES.get('en_media',False)
                if en_file:
                    data["en_image"] = main_functions.media_upload(en_file)
                fa_file = request.FILES.get('fa_media',False)
                if fa_file:
                    data["fa_image"] = main_functions.media_upload(fa_file)
            col.insert_one(data)
            new_one = request.FILES
        # except Exception as error:
            # new_one = data

    slides = list(col.find())
    col = con['sections']
    for i in range(0,len(slides)):
        slides[i]['id'] = slides[i]['_id']
        slides[i]['sec'] = col.find_one({"_id":slides[i]['section']})

    context = {
        'slides': slides,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_slides.html',context)


# Add slide view
def add_slide(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    return render(request,'admin_add_slide.html',{})


# Edit slide view
def edit_slide(request,sid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['slides']
    edit_status = None

    # Post Check
    if request.POST:
        try:
            data = {
                "title": request.POST['fa_title'],
                "link": request.POST['link'],
                "en_title": request.POST['en_title'],
                "section": db.object_id(request.POST['section']),
                "active": int(request.POST.get("active",0))
            }
            if request.FILES:
                if request.FILES['en_media'] and not request.FILES['en_media'].name == "":
                    data["en_image"]= main_functions.media_upload(request.FILES['en_media'])
                if request.FILES['fa_media'] and not request.FILES['fa_media'].name == "":
                    data["fa_image"]= main_functions.media_upload(request.FILES['fa_media'])
            col.update_one({"_id":db.object_id(sid)},{"$set":data})
            edit_status = True
        except:
            edit_status = False

    slide = col.find_one({'_id':db.object_id(sid)})
    slide['id'] = slide['_id']
    col = con['sections']
    slide['sec'] = col.find_one({"_id":slide['section']})

    context = {
        "slide": slide,
        "edit_status": edit_status
    }

    return render(request,'admin_edit_slide.html',context)


# Admins View
def admins(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['admins']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        try:
            full_name = request.POST['full_name']
            username = request.POST['username']
            password = request.POST['password']
            access_level = request.POST['access_level']
            auth.register(username,password,access_level,full_name)
            new_one = True
        except:
            new_one = False

    admins = list(col.find())
    for i in range(0,len(admins)):
        admins[i]['id'] = admins[i]['_id']

    context = {
        'admins': admins,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_admins.html',context)


# Add admin view
def add_admin(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    return render(request,'admin_add_admin.html',{})


# Edit admin view
def edit_admin(request,aid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['admins']
    edit_status = None

    # Post Check
    if request.POST:
        try:
            full_name = request.POST['full_name']
            username = request.POST['username']
            access_level = request.POST['access_level']
            col.update_one({"_id":db.object_id(aid)},{"$set":{
                "full_name": full_name,
                "username": username,
                "access_level": access_level
            }})
            edit_status = True
        except:
            edit_status = False

    admin = col.find_one({'_id':db.object_id(aid)})
    admin['id'] = admin['_id']

    context = {
        "admin": admin,
        "edit_status": edit_status
    }

    return render(request,'admin_edit_admin.html',context)


# Pages View
def pages(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['pages']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        try:
            fa = {
                "title": request.POST['fa_title'],
                "content": request.POST['fa_content']
            }
            en = {
                "title": request.POST['en_title'],
                "content": request.POST['en_content']
            }
            access_id = request.POST['access_id']
            col.insert_one({
                "fa":fa,
                "en":en,
                "access_id":access_id
            })
            new_one = True
        except:
            new_one = False

    pages = list(col.find())
    for i in range(0,len(pages)):
        pages[i]['id'] = pages[i]['_id']

    context = {
        'pages': pages,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_pages.html',context)


# Add page view
def add_page(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    return render(request,'admin_add_page.html',{})


# Edit page view
def edit_page(request,pid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['pages']
    edit_status = None

    # Post Check
    if request.POST:
        # try:
            fa = {
                "title": request.POST['fa_title'],
                "content": request.POST['fa_content']
            }
            en = {
                "title": request.POST['en_title'],
                "content": request.POST['en_content']
            }
            access_id = request.POST['access_id']
            data = {
                "fa":fa,
                "en":en,
                "access_id":access_id
            }
            col.update_one({"_id":db.object_id(pid)},{"$set":data})
            edit_status = True
        # except:
            # edit_status = False

    page = col.find_one({'_id':db.object_id(pid)})
    page['id'] = page['_id']

    context = {
        "page": page,
        "edit_status": edit_status
    }

    return render(request,'admin_edit_page.html',context)


# Faqs View
def faqs(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['faq']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        try:
            fa = {
                "question": request.POST['fa_title'],
                "answer": request.POST['fa_content']
            }
            en = {
                "question": request.POST['en_title'],
                "answer": request.POST['en_content']
            }
            col.insert_one({
                "fa":fa,
                "en":en,
            })
            new_one = True
        except:
            new_one = False

    faqs = list(col.find())
    for i in range(0,len(faqs)):
        faqs[i]['id'] = faqs[i]['_id']

    context = {
        'faqs': faqs,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_faqs.html',context)


# Add faq view
def add_faq(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    return render(request,'admin_add_faq.html',{})


# Edit faq view
def edit_faq(request,qid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['faq']
    edit_status = None

    # Post Check
    if request.POST:
        try:
            fa = {
                "question": request.POST['fa_title'],
                "answer": request.POST['fa_content']
            }
            en = {
                "question": request.POST['en_title'],
                "answer": request.POST['en_content']
            }
            data = {
                "fa":fa,
                "en":en,
            }
            col.update_one({"_id":db.object_id(qid)},{"$set":data})
            edit_status = True
        except:
            edit_status = False

    question = col.find_one({'_id':db.object_id(qid)})
    question['id'] = question['_id']

    context = {
        "question": question,
        "edit_status": edit_status
    }

    return render(request,'admin_edit_faq.html',context)


# Main Menus View
def main_menu(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['menu_items']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        try:
            data = {
                "name": request.POST['fa_name'],
                "en_name": request.POST['en_name'],
                "parent": db.object_id(request.POST['section'])
            }
            col.insert_one(data)
            new_one = True
        except:
            new_one = False

    items = list(col.find())
    col = con['sections']
    for i in range(0,len(items)):
        items[i]['id'] = items[i]['_id']
        items[i]['section'] = col.find_one({"_id":items[i]['parent']})

    context = {
        'items': items,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_main_menu.html',context)


# Add menu item view
def add_menu_item(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    return render(request,'admin_add_menu.html',{})


# Edit menu item view
def edit_menu_item(request,mid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['menu_items']
    edit_status = None

    # Post Check
    if request.POST:
        try:
            data = {
                "name": request.POST['fa_name'],
                "en_name": request.POST['en_name'],
                "parent": db.object_id(request.POST['section'])
            }
            col.update_one({"_id":db.object_id(mid)},{"$set":data})
            edit_status = True
        except:
            edit_status = False

    menu = col.find_one({'_id':db.object_id(mid)})
    menu['id'] = menu['_id']
    col = con['sections']
    menu['sec'] = col.find_one({"_id":menu['parent']})

    context = {
        "menu": menu,
        "edit_status": edit_status
    }

    return render(request,'admin_edit_menu.html',context)


# Sub Menus View
def sub_menu(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['category_items']
    new_one = None
    delete_status = None

    if request.GET:
        delete_id = request.GET.get("delete",False)
        if delete_id:
            try:
                col.delete_one({'_id':db.object_id(delete_id)})
                delete_status = True
            except:
                delete_status = False

    if request.POST:
        try:
            data = {
                "name": request.POST['fa_name'],
                "en_name": request.POST['en_name'],
                "parent": db.object_id(request.POST['parent']),
                "sub": bool(int(request.POST.get("sub",0))),
                "link": request.POST['link']
            }
            col.insert_one(data)
            new_one = True
        except:
            new_one = False

    items = list(col.find())
    for i in range(0,len(items)):
        items[i]['id'] = items[i]['_id']

    context = {
        'items': items,
        "new_one": new_one,
        "delete_status": delete_status
    }

    return render(request,'admin_sub_menu.html',context)


# Add sub menu item view
def add_sub_item(request):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['menu_items']
    menu_items = list(col.find())
    for i in range(0,len(menu_items)):
        menu_items[i]['id'] = menu_items[i]['_id']
    col = con['category_items']
    cat_items = list(col.find({"sub": False}))
    for i in range(0,len(cat_items)):
        cat_items[i]['id'] = cat_items[i]['_id']


    return render(request,'admin_add_sub.html',{
        "menu_items": menu_items,
        "cat_items": cat_items
    })


# Edit sub menu item view
def edit_sub_item(request,mid):
    if not auth.authenticated(request.session.get('auth_token')):
        return redirect("admin/login")

    # init
    con = db.connect()
    col = con['category_items']
    edit_status = None

    # Post Check
    if request.POST:
        try:
            data = {
                "name": request.POST['fa_name'],
                "en_name": request.POST['en_name'],
                "parent": db.object_id(request.POST['parent']),
                "sub": bool(int(request.POST.get("sub",0))),
                "link": request.POST['link']
            }
            col.update_one({"_id":db.object_id(mid)},{"$set":data})
            edit_status = True
        except:
            edit_status = False

    menu = col.find_one({'_id':db.object_id(mid)})
    menu['id'] = menu['_id']

    col = con['menu_items']
    menu_items = list(col.find())
    for i in range(0,len(menu_items)):
        menu_items[i]['id'] = menu_items[i]['_id']
    col = con['category_items']
    cat_items = list(col.find({"sub": False}))
    for i in range(0,len(cat_items)):
        cat_items[i]['id'] = cat_items[i]['_id']

    context = {
        "menu": menu,
        "edit_status": edit_status,
        "menu_items": menu_items,
        "cat_items": cat_items
    }

    return render(request,'admin_edit_sub.html',context)
