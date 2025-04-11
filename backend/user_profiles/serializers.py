from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'tests_taken', 'average_score']
        
    def create(self, validated_data):
        # Remove password from validated data to handle separately
        password = validated_data.pop('password', None)
        # Create user instance
        user = CustomUser.objects.create_user(**validated_data)
        # Set password if provided
        if password:
            user.set_password(password)
            user.save()
        return user
