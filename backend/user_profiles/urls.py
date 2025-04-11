from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('test-token/', views.test_token, name='test_token'),
    
    # User profile management
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/delete/', views.delete_account, name='delete_account'),
    path('profile/change-password/', views.change_password, name='change_password'),
    
    # Admin only
    # path('users/<int:user_id>/', views.get_user, name='get_user'),
]