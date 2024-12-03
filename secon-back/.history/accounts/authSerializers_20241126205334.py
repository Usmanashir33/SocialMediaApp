from rest_framework import serializers 
from.models import User
from django.core.mail import EmailMessage
from rest_framework.exceptions import ValidationError

class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"error": "Password fields didn't match."})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            return({"error": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):
        if validated_data['password'] != validated_data['old_password'] :
            instance.set_password(validated_data['password'])
            instance.save()
            return ({'updated':True})
        else :
            return ({"error": "Write different from the old"})
        
class ForgetPasswordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True, required=True)
    forget_password_otp = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('forget_password_otp', 'password', 'password2','email')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"error": "Password not match"})
        email = attrs['email']
        otp = attrs['forget_password_otp']
        user = User.objects.get(email = email)
        user_found = str(user.forget_password_otp) == str(otp)
        if not user_found: 
            raise serializers.ValidationError({"error": "otp not correct"})
        return attrs

    def update(self, instance, validated_data):
            instance.set_password(validated_data['password'])
            email = validated_data['email']
            instance.save()
            # send Email here
            subject = "Password Changed"
            message = f"""
                <div>
                    <h2>Your Account is reset</h2>
                    <p>if</p>
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
            return ({'updated':True})