from django.shortcuts import render
from .serializers import ProfileSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser,FormParser
from django.core.mail import EmailMessage
import random

from .models import User
from django.db.models import Q
from .authSerializers import ChangePasswordSerializer,ForgetPasswordSerializer


class RequestForgetPWDOTP(APIView):
    # we need email here 
    permission_classes=[permissions.AllowAny]
    def post(self, request,format=None):
        try :
            email = request.data.get('email')
            found = User.objects.filter(email=email)
            new_degit = random.randint(123456,987654)
            # send email here 
            if found :
                subject = "Password Recovery Password"
                message = f"""
                <div>
                    <h2>Your Account Password</h2>
                    <p>please ignore this email if you are not the one to initiate this request</p>
                    <span >
                        <h4>Your OTP is : <b>{new_degit}</b> </h4>
                    </span>
                </div>"""
                sender = "coinermk@gmail.com"
                mail = EmailMessage(
                    subject,message,sender,[email,]
                )
                mail.content_type = "html" 
                mail.send()
                
                user = User.objects.get(email=email)
                user.forget_password_otp = new_degit
                user.save()
            return Response({"email_sent" :True } if found else {"error" : "No account associated with this email"}) # either true or false
        except :
            return Response({"error" :"something went wronge"})
        
class SetNewPassword(APIView):
    permission_classes=[permissions.AllowAny]
    def get(self, request,format=None):
        # try :
            print("normal")
            serializer = ForgetPasswordSerializer(data=request.data)
            # if serializer.is_valid():
                # user_email = serializer.validated_data['email']
                # user = User.objects.get(email = user_email)
                # changed =  serializer.update(user, serializer.validated_data)
                # return Response(changed, status=status.HTTP_200_OK)
            return Response({"changed":"humm"}, status=status.HTTP_200_OK)
        # except :
            # return Response({"error" :"something went wronge"})

class CheckFPWOTPView(APIView):
    # we need email here 
    permission_classes=[permissions.AllowAny]
    def post(self, request,format=None):
        try :
            email = request.data.get("email")
            otp = request.data.get("otp")
            user = User.objects.get(email=email)
            user_otp = user.forget_password_otp
            verified = str(user_otp) == str(otp)
            return Response({"verified" : True} if verified else {"error" : "otp not correct"}) # either true or false
        except :
            return Response({"error" :"something went wronge"})

# updating password       
class VerifyOldPasswordView(APIView):
    def post(self, request,format=None):
        user = request.user
        old_password = request.data.get('old_password')
        correct = user.check_password(old_password)
    
class ChangeUserPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = request.user
            changed =  serializer.update(user, serializer.validated_data)
            return Response(changed, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)