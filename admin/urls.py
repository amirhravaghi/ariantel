from django.contrib import admin
from django.urls import path,include
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = "admin"

urlpatterns = [
    path('', views.index, name = "index"),
    path('/api/mediaUpload',views.mediaUpload,name = "media_upload"),
    path('/login',views.login,name = "login"),
    path('/news',views.news,name = "news"),
    path('/addNews',views.add_news,name = "add_news"),
    path('/editNews/<str:aid>',views.edit_news,name = "edit_news"),
    path('/packages',views.packages,name = "packages"),
    path('/editPackage/<str:pid>',views.edit_package,name = "edit_package"),
    path('/addPackage',views.add_package,name = "add_package"),
    path('/cards',views.cards,name = "cards"),
    path('/editCards/<str:pid>',views.edit_card,name = "edit_card"),
    path('/addCard',views.add_card,name = "add_card"),
    path('/slides',views.slides,name = "slides"),
    path('/editSlide/<str:sid>',views.edit_slide,name = "edit_slide"),
    path('/addSlide',views.add_slide,name = "add_slide"),
    path('/admins',views.admins,name = "admins"),
    path('/addAdmin',views.add_admin,name = "add_admin"),
    path('/editAdmin/<str:aid>',views.edit_admin,name = "edit_admin"),
    path('/pages',views.pages,name = "pages"),
    path('/addPage',views.add_page,name = "add_page"),
    path('/editPage/<str:pid>',views.edit_page,name = "edit_page"),
    path('/faqs',views.faqs,name = "faqs"),
    path('/addFaq',views.add_faq,name = "add_faq"),
    path('/editFaq/<str:qid>',views.edit_faq,name = "edit_faq"),
    path('/mainMenu',views.main_menu,name = "main_menu"),
    path('/addMenuItem',views.add_menu_item,name = "add_menu_item"),
    path('/editMenuItem/<str:mid>',views.edit_menu_item,name = "edit_menu_item"),
    path('/subMenu',views.sub_menu,name = "sub_menu"),
    path('/addSubMenu',views.add_sub_item,name = "add_sub_item"),
    path('/editSubMenu/<str:mid>',views.edit_sub_item,name = "edit_sub_item"),
    path('/logout',views.logout,name = "logout")
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
