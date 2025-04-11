from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
# from django.contrib.auth.models import User
from .models import CustomUser as User
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger(__name__)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    try:
        # Get username and password from request
        username = request.data.get("username")
        password = request.data.get("password")
        
        if not username or not password:
            return Response(
                {"error": "Please provide both username and password"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try to get the user
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check password
        if not user.check_password(password):
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate or get token
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        
        return Response(
            {"token": token.key, "user": serializer.data}, 
            status=status.HTTP_200_OK  # Changed to 200 OK
        )
        
    except Exception as e:
        return Response(
            {"error": f"Login failed: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # The create method in serializer will handle password hashing
        user = serializer.save()
        
        # Create token for the new user
        token = Token.objects.create(user=user)
        return Response(
            {"token": token.key, "user": serializer.data},
            status=status.HTTP_201_CREATED,
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """
    Get the authenticated user's profile details
    """
    try:
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception(f"Error retrieving profile: {str(e)}")
        return Response(
            {"error": f"Failed to retrieve profile: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update the authenticated user's profile
    
    PUT: Replace all fields (requires complete data)
    PATCH: Update only the provided fields
    """
    try:
        user = request.user
        partial = request.method == "PATCH"
        
        # Remove password from direct update if present
        data = request.data.copy()
        password = data.pop('password', None)
        
        serializer = UserSerializer(user, data=data, partial=partial)
        
        if serializer.is_valid():
            # Save the user instance with updated fields
            user = serializer.save()
            
            # Handle password update separately if provided
            if password:
                user.set_password(password)
                user.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.exception(f"Error updating profile: {str(e)}")
        return Response(
            {"error": f"Failed to update profile: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_account(request):
    """
    Delete the authenticated user's account
    """
    try:
        user = request.user
        username = user.username
        
        # Delete the user
        user.delete()
        
        return Response(
            {"message": f"User account '{username}' was successfully deleted"},
            status=status.HTTP_204_NO_CONTENT
        )
    except Exception as e:
        logger.exception(f"Error deleting account: {str(e)}")
        return Response(
            {"error": f"Failed to delete account: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change the authenticated user's password
    
    Requires both old_password and new_password in request data
    """
    try:
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        # Validate input
        if not old_password or not new_password:
            return Response(
                {"error": "Both old_password and new_password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if old password is correct
        if not user.check_password(old_password):
            return Response(
                {"error": "Current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        # Update token to force logout on other devices
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        
        return Response({
            "message": "Password changed successfully",
            "token": token.key  # Return new token
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Error changing password: {str(e)}")
        return Response(
            {"error": f"Failed to change password: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# For admin users only - manage other users
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_user(request, user_id):
#     """
#     Get a specific user's profile (admin only)
#     """
#     if not request.user.is_staff:
#         return Response(
#             {"error": "You do not have permission to access this resource"},
#             status=status.HTTP_403_FORBIDDEN
#         )
    
#     try:
#         user = get_object_or_404(User, id=user_id)
#         serializer = UserSerializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Exception as e:
#         logger.exception(f"Error retrieving user: {str(e)}")
#         return Response(
#             {"error": f"Failed to retrieve user: {str(e)}"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
    


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({"message": f"auth is working for {request.user.username}"})
