from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

from base.models import User
from base.serializers import  UserSerializer, UserSerializerWithToken


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
    
    
@api_view(['POST'])    
def registerUser(request):
    data=request.data
    try:
        user=User.objects.create(
            first_name = data['first_name'],
            last_name= data['last_name'],
            username = data['email'], 
            email = data['email'],
            password = make_password(data['password'])
    )
            
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message={'detail':'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all() 
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user #pulling data from token b/c of decorator (not same user as admin panel)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)