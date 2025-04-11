from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.mainHomePage, name='mainHomePage'),
    path('category/all/', views.category_page, name='category_page'),
    path('books/fine-yours/', views.book_ai, name='book_ai'),
    path('user/peofile', views.user_profile, name='user_profile'),
    path('congrats/', views.congratulations_page, name='congratulations_page'),
    path('events/', views.events, name='events'),
    path('search-suggestions', views.search_items, name='search_items'),
    path('category/<int:id>', views.specific_category, name='specific_category'),
    path('reviewer/progile/<int:id>', views.reviewer_profile, name='reviewer_profile'),
]