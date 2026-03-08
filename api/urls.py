from django.urls import path
from .views import list_items, create_item, get_item, update_item, delete_item

urlpatterns = [

    path('items/', list_items),
    path('items/create/', create_item),
    path('items/<int:id>/', get_item),
    path('items/<int:id>/update/', update_item),
    path('items/<int:id>/delete/', delete_item),

]