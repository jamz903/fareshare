from rest_framework.views import APIView
from django.contrib.auth.models import User # use Django's built-in user model
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from .models import FriendRequest

@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class SendFriendRequestView(APIView):
    def post(self, request, format=None):
        try:
            data = self.request.data
            targetUsername = data['username']
            user = self.request.user
            targetUserSet = User.objects.filter(username=targetUsername)
            # check if target user exists
            if not targetUserSet.exists():
                return Response({'error': 'User does not exist.'})
            # check if target user is self
            targetUser = targetUserSet[0]
            if targetUser == user:
                return Response({'error': 'Cannot send friend request to yourself.'})
            # check if friend request already exists, pretend to send a new one
            friendRequestSet = FriendRequest.objects.filter(sender=user, receiver=targetUser)
            if friendRequestSet.exists():
                return Response({'success': 'Friend request sent successfully!'})
            # check if target user is already a friend
            if targetUser in user.profile.friends.all():
                return Response({'error': 'User is already a friend.'})
            # send friend request
            friendRequest = FriendRequest(sender=user, receiver=targetUser)
            friendRequest.save()
            return Response({'success': 'Friend request sent successfully!'})
        except:
            return Response({'error': 'Something went wrong when sending friend request.'})

@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class AcceptFriendRequestView(APIView):
    def post(self, request, format=None):
        try:
            data = self.request.data
            senderUsername = data['username']
            # add friend
            receiverUser = self.request.user
            senderUser = User.objects.get(username=senderUsername)
            receiverUser.profile.friends.add(senderUser)
            senderUser.profile.friends.add(receiverUser)
            # delete friend request
            friendRequest = FriendRequest.objects.get(sender=senderUser, receiver=receiverUser)
            friendRequest.delete()
            return Response({'success': 'Friend added successfully'})
        except:
            return Response({'error': 'Something went wrong when adding friend'})
        
@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class RejectFriendRequestView(APIView):
    def post(self, request, format=None):
        try:
            data = self.request.data
            senderUsername = data['username']
            # delete friend request
            receiverUser = self.request.user
            senderUser = User.objects.get(username=senderUsername)
            friendRequest = FriendRequest.objects.get(sender=senderUser, receiver=receiverUser)
            friendRequest.delete()
            return Response({'success': 'Friend request rejected successfully'})
        except:
            return Response({'error': 'Something went wrong when rejecting friend request'})

@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class RemoveFriendView(APIView):
    def post(self, request, format=None):
        try:
            data = self.request.data
            targetUsername = data['username']
            # remove friend from current user's friend list
            user = self.request.user
            targetUser = User.objects.get(username=targetUsername)
            user.profile.friends.remove(targetUser)
            targetUser.profile.friends.remove(user)
            return Response({'success': 'Friend removed successfully'})
        except:
            return Response({'error': 'Something went wrong when removing friend'})
        
@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class GetFriendRequestsView(APIView):
    def get(self, request, format=None):
        try:
            user = self.request.user
            friendRequests = FriendRequest.objects.filter(receiver=user)
            friendRequestsList = []
            for friendRequest in friendRequests:
                friendRequestsList.append({
                    'username': friendRequest.sender.username,
                    # some dummy photo for now
                    'profilePic': 'https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
                })
            return Response({'friend_requests': friendRequestsList})
        except:
            return Response({'error': 'Something went wrong when getting friend requests'})
        
@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class GetFriendsView(APIView):
    def get(self, request, format=None):
        try:
            user = self.request.user
            friends = user.profile.friends.all()
            friendsList = []
            for friend in friends:
                friendsList.append({
                    'username': friend.username,
                    # some dummy photo for now
                    'profilePic': 'https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
                })
            return Response({'friends': friendsList})
        except:
            return Response({'error': 'Something went wrong when getting friends list'})

            