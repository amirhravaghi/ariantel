from django.contrib import admin
from django.urls import path,include
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = "main"

urlpatterns = [
    path('', views.index, name = "index"),
    path('lang/<str:lng>', views.lang, name = "lang"),
    path('test',views.test,name = "test"),
    path('faq',views.faq,name = "faq"),
    path('news',views.news,name = "news"),
    path('news/<str:nid>',views.article,name = "article"),
    path('packages/<str:cid>',views.packages,name = "packages"),
    path('simcards/<str:sid>',views.simcard,name = "simcard"),
    path('areas',views.areas,name = "areas"),
    path('enterprise',views.enterprise,name = "enterprise"),
    path('<str:aid>',views.page,name = "page")
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
