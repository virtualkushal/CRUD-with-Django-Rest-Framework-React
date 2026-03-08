from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GroceryItem
from .serializers import GroceryItemSerializer


# READ ALL ITEMS
@api_view(['GET'])
def list_items(request):
    items = GroceryItem.objects.all()
    serializer = GroceryItemSerializer(items, many=True)
    return Response(serializer.data)


# CREATE ITEM
@api_view(['POST'])
def create_item(request):
    serializer = GroceryItemSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


# READ SINGLE ITEM
@api_view(['GET'])
def get_item(request, id):
    item = GroceryItem.objects.get(id=id)
    serializer = GroceryItemSerializer(item)
    return Response(serializer.data)


# UPDATE ITEM
@api_view(['PUT'])
def update_item(request, id):
    item = GroceryItem.objects.get(id=id)
    serializer = GroceryItemSerializer(instance=item, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


# DELETE ITEM
@api_view(['DELETE'])
def delete_item(request, id):
    item = GroceryItem.objects.get(id=id)
    item.delete()
    return Response("Item deleted")