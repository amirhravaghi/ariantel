from . import functions
from . import langs
from django.shortcuts import redirect
# import functions
# import langs

# Data
def data(request):

    # init
    lang = request.session.get("lang")
    if lang == "" or lang is None:
        lang = "fa"
    section = request.session.get("section")
    if section == "":
        section = "personal"
    ltr = False
    if lang == "en":
        ltr = True

    funcs = functions.main_functions()
    menu = funcs.get_menu(section,lang)
    for i in range(0,len(menu)):
        menu[i]['sub_items'].reverse()
    # print(len(menu[0]['sub_items']))

    context = {
        "menu": menu,
        "current_lang": lang,
        "lang": langs.langs[lang],
        "ltr": ltr
    }
    return context

# data({})
