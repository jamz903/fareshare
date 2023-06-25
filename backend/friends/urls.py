from django.urls import path
from .views import SendFriendRequestView, GetFriendRequestsView, AcceptFriendRequestView, GetFriendsView, RemoveFriendView, RejectFriendRequestView

urlpatterns = [
    path('send-request', SendFriendRequestView.as_view()),
    path('get-requests', GetFriendRequestsView.as_view()),
    path('accept-request', AcceptFriendRequestView.as_view()),
    path('reject-request', RejectFriendRequestView.as_view()),
    path('get-friends', GetFriendsView.as_view()),
    path('remove-friend', RemoveFriendView.as_view()),
]