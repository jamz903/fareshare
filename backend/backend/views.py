from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView

@method_decorator(csrf_protect, name='dispatch')
class EndpointTestView(APIView):
    def get(self, request, format=None):
        return Response({'success': 'Endpoint test successful!'})
