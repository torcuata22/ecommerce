from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from django.contrib.auth.models import User

from rest_framework import status


from base.models import Product, Order, OrderItem, ShippingAddress 

from base.serializers import ProductSerializer, OrderSerializer

from datetime import datetime


@api_view(['POST'])
@permission_classes([IsAuthenticated]) #this is an import, not a string!
def addOrderItems(request):
    user = request.user
    data = request.data
    
    orderItems = data['orderItems'] #sent from front end, JSON objects
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
            product = Product.objects.get(id = i['product']) #this connects to Product model (relationship)
            
            item = OrderItem.objects.create(
                product= product, #product we just queried from database
                order= order,
                name= product.name,
                qty= i['qty'],
                price=i['price'],
                image= product.image.url, 
            )
         #update stock (still inside the loop)
            product.countInStock -= item.qty
            product.save()
        #serialize data so we can use it in react:
        serializer = OrderSerializer(order, many = False)
        return Response(serializer.data)
    

@api_view(['GET']) 
@permission_classes([IsAuthenticated])   
def getOrderById(request, pk):
    user = request.user #we get this from the token
    
     #to make sure order exists, wrap it all in this try statement
    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail':'Not authorized to view this order'}, status = status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status = status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT']) 
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
     order = Order.objects.get(id = pk)
     order.is_Paid = True
     order.paidAt = datetime.now() #takes snapshot of when the order was paid
     order.save()
     
     return Response('Order was paid')
 
# @api_view(['PUT']) 
# @permission_classes([IsAuthenticated])
# def updateOrderToDelivered(request, pk):
#      order = Order.objects.get(id = pk)
#      order.isDelivered = True
#      order.deliveredAt = datetime.now() #takes snapshot of when the order was paid
#      order.save()
     
#      return Response('Order was delivered')