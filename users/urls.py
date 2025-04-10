from django.urls import path, include
from . import views
from . import api

urlpatterns = [
    path('create/', views.create_account, name = 'create_account'),
    path('is_username_available/<str:username>', api.is_username_available, name = 'is_username_available'),
    path('username/', views.update_username, name = 'update_username'),
    path('logout/', views.logout_user, name = 'logout_user'),
    path('login/', views.login_user, name = 'login_user'),
    path('upload-image/', views.upload_image, name='upload_image'),
    path('interests/', views.add_interest, name='add_interest'),
    path('add-interest/<str:interest>', api.add_interest, name='add_interest'),
    path('del-interest/<str:interest>', api.del_interest, name='del_interest'),
]