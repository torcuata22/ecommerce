from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status


from base.models import Product, Order, OrderItem, ShippingAddress 

from base.serializers import ProductSerializer, OrderSerializer

@api_view(['POST'])
@permission_classes(['IsAuthenticated'])
def addOrderItems(request):
    user = request.user
    data = request.data
    
    orderItems = data['orderItems']
    if orderItems and len (orderItems) == 0:
        return Response({'detail':'No Order Items'}, status = status.HTTP_400_BAD_REQUEST)
    
    else:
        #Create order
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice']
        )
        
        #create shipping address
        shipping = ShippingAddress.objects.create (
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode= data['shippingAddress']['zipCode'],
            country= data['shippingAddress']['country']
        )
        #create order items by iterating through list 
        for i in orderItems:
            product = Product.objects.get(id = i['product'])
            
            item = OrderItem.objects.create(
                product= product,
                order= order,
                name= product.name,
                qty= i['qty'],
                price=i['price'],
                image= product.image.url, 
            )
         #update stock (still inside the loop)
            product.countInStock -= item.qty
            product.save()
        
    serializer = OrderSerializer(order, many = True)
    return Response(serializer.data)