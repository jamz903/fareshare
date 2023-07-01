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
from .models import *
from django.contrib.auth.models import User

class OCRView(APIView):
    # allow anyone to access this endpoint
    # TODO: delete this when we can access this endpoint with authentication in the app
    #authentication_classes = [];
    #permission_classes = [];
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
        user = self.request.user
        receipt = Receipt.objects.filter(created_by=user)
        if user.is_anonymous:
            return Response({"error": "User is not logged in"})
        serializer = ReceiptSerializer(receipt, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        data = {"json path": False}
        receipt_serializer = ReceiptSerializer(data=request.data)
        if receipt_serializer.is_valid():
            try:
                user = request.user
                receipt = receipt_serializer.save(created_by=user)
            except:
                receipt = receipt_serializer.save()
            image = receipt_serializer.data['image']
            os.system("python3 ocr/model/receipt_detection.py --image " + image[1:])
            if exists("ocr/model/text.csv"):
                #grab the uploaded csv and add index
                df = pd.read_csv("ocr/model/text.csv")
                df.to_json("ocr/model/data.json")
                f = open("ocr/model/data.json")
                json_data = json.load(f)
                data.update({"json path": True, "data": json_data, "id": receipt.pk})
                return JsonResponse(data)
            else:
              data["error"] = "No csv was uploaded"
              return JsonResponse(data)
            #return Response(receipt_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', receipt_serializer.errors)
            return Response(receipt_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ReceiptDataView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        data = request.data
        receipt = Receipt.objects.get(id=data['id'])
        return JsonResponse({"processed_data": receipt.processed_data, "id": receipt.pk, "name": receipt.name})
    
    def post(self, request, *args, **kwargs):
        data = request.data
        jsonData = json.dumps(data['processed_data'])
        receipt = Receipt.objects.get(id=data['id'])
        receipt.processed_data = jsonData
        receipt.my_expenses = data['my_expenses']
        receipt.save()
        return Response(data)