from django.shortcuts import render

# imports
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from os.path import exists
import numpy as np
import urllib.request
import json
import csv
import os
from .serializers import ReceiptSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import pandas as pd
from django.http import HttpResponse
from django.shortcuts import render, redirect
from .forms import *

class OCRView(APIView):
    # allow anyone to access this endpoint
    # TODO: delete this when we can access this endpoint with authentication in the app
    authentication_classes = [];
    permission_classes = [];

    # def get(self, request):
    #     data = {"json path": False}

    #     #check to see if csv was uploaded
    #     os.system("python3 ocr/model/preprocess.py --image ocr/images/img1.jpg")
    #     os.system("python3 ocr/model/receipt_detection.py --image ocr/model/result.png")
    #     if exists("ocr/model/text.csv"):
    #         #grab the uploaded csv and add index
    #         df = pd.read_csv("ocr/model/text.csv")
    #         df.to_json("ocr/model/data.json")
    #         f = open("ocr/model/data.json")
    #         json_data = json.load(f)
    #         data.update({"json path": True, "data": json_data})
    #         return JsonResponse(data)
    #     else:
    #         data["error"] = "No csv was uploaded"
    #         return JsonResponse(data)

    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        receipt = Receipt.objects.all()
        serializer = ReceiptSerializer(receipt, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        receipt_serializer = ReceiptSerializer(data=request.data)
        if receipt_serializer.is_valid():
            receipt_serializer.save()
            return Response(receipt_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', receipt_serializer.errors)
            return Response(receipt_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
