from django.urls import path
from . import views

urlpatterns = [

    path('add/', views.create_book, name='create_book'),
    path('add_to_favorites/<str:id>/', views.add_to_favorites, name="add_to_favorites"),
    path('remove_from_favorites/<str:id>/', views.remove_from_favorites, name="remove_from_favorites"),
    path('favorites', views.favorites_books, name="favorites_books"),
    path('getAuthors/', views.get_authors, name='get_authors'),
    path('getCategory/', views.get_category, name='get_category'),


]