from rest_framework import serializers 
from.models import User
from django.core.mail import EmailMessage

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
    otp = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('otp', 'password', 'password2','email')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"error": "Password fields didn't match."})
        email = attrs['email']
        otp = attrs['otp']
        user = User.objects.get(email = email)
        user_found = user.forget_password_otp 
        return attrs

    def update(self, instance, validated_data):
            instance.set_password(validated_data['password'])
            instance.save()
            # send Email here
            
            return ({'recovered':True})