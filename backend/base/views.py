from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


from .models import Product
from .products import products
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken
# Create your views here.



@api_view(['GET'])
def getRoutes(request):
    routes=['/api/products',
            'api/products/create',
            'api/products/upload',
            'api/products/<id>/reviews',
            'api/products/top', 
            'api/products/<id>',
            'api/products/delete/<id>',
              'api/products/<update>/<id>',
            ]
    return Response(routes)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for key, value in serializer.items():
            data[key]=value
        return data
 
    # @classmethod (not using it, but leave it for reference)
    # def get_token(cls, user):
    #     token = super().get_token(user)

    #     # Add custom claims
    #     token['username'] = user.username
    #     token['message'] = 'hello world'
    #     # ...
    #     return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
@api_view(['GET'])
def getUserProfile(request):
    user = request.user #pulling data from token b/c of decorator (not same user as admin panel)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all() 
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(id = pk) 
    serializer = ProductSerializer(product, many=False)
    for p in products:
        if p['id']== pk:
            product = p
            break
    return Response(serializer.data )




