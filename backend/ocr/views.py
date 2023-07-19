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
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status
import pandas as pd
from django.http import HttpResponse
from django.shortcuts import render, redirect
from .forms import *
from .models import *
from .serializers import *
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
        if user.is_anonymous:
            return Response({"error": "User is not logged in"})
        receipts = Receipt.objects.filter(created_by=user)
        serializer = ReceiptSerializer(receipts, many=True)
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
            if (request.data['receipt_type'] == "physical"):
                os.system("python3 ocr/model/receipt_detection.py --type physical --image " + image[1:])
            else:
                os.system("python3 ocr/model/receipt_detection.py --type online --image " + image[1:])
            
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
    
    # save receipt data for a certain receipt id
    def post(self, request, *args, **kwargs):
        data = request.data
        # save receipt
        query = Receipt.objects.filter(id=data['id'])
        if len(query) == 0:
            return Response({"error": "Invalid receipt id"}, status=status.HTTP_400_BAD_REQUEST)
        receipt = query[0]
        receipt.my_expenses = data['my_expenses']
        receipt.save()
        # receipt fields
        processed_data = json.loads(data['processed_data'])
        ids_to_delete = json.loads(data['ids_to_delete'])
        receipt_items = processed_data['items'] # array containing receipt items
        other = processed_data['other'] # object containing other relevant data such as total, tax, etc.
        # delete receipt items
        ReceiptItem.objects.filter(id__in=ids_to_delete).delete()
        # save receipt items
        for receipt_item in receipt_items:
            if 'assignees' not in receipt_item:
                receipt_item['assignees'] = []
            if 'id' in receipt_item:
                # update existing receipt item
                receipt_item_id = receipt_item['id']
                receipt_item_obj = ReceiptItem.objects.get(id=receipt_item_id)
                receipt_item_obj.name = receipt_item['name']
                receipt_item_obj.price = receipt_item['price']
                receipt_item_obj.quantity = receipt_item['quantity']
                receipt_item_obj.assignees.clear()
                for username in receipt_item['assignees']:
                    query = User.objects.filter(username=username)
                    if len(query) == 0:
                        return Response({"error": "Invalid username assigned to receipt item"}, status=status.HTTP_400_BAD_REQUEST)
                    user = query[0]
                    receipt_item_obj.assignees.add(user)
                receipt_item_obj.save()
            else:
                # create new receipt item
                new_item = ReceiptItem.objects.create(
                    receipt=receipt,
                    name=receipt_item['name'],
                    price=receipt_item['price'],
                    quantity=receipt_item['quantity'],
                )
                new_item.save()
                for username in receipt_item['assignees']:
                    query = User.objects.filter(username=username)
                    if len(query) == 0:
                        return Response({"error": "Invalid username assigned to receipt item"}, status=status.HTTP_400_BAD_REQUEST)
                    user = query[0]
                    new_item.assignees.add(user)
        
        return Response({"success": "Receipt data saved successfully"}, status=status.HTTP_200_OK)
    

class ReceiptItemByReceiptView(APIView):
    # obtain receipt items for a certain receipt id
    def post(self, request, *args, **kwargs):
        data = request.data
        id  = data.get('id')
        # validate request
        if id is None:
            return Response({"error": "No receipt id provided"}, status=status.HTTP_400_BAD_REQUEST)
        # check if receipt exists
        query = Receipt.objects.filter(pk=id)
        if len(query) == 0:
            return Response({"error": "Receipt not found"}, status=status.HTTP_404_NOT_FOUND)
        # get items from receipt
        receipt = query[0]
        receipt_items = ReceiptItem.objects.filter(receipt=receipt)
        serializer = ReceiptItemSerializer(receipt_items, many=True)
        return JsonResponse(data={"items": serializer.data, "id": receipt.pk, "name": receipt.name}, status=status.HTTP_200_OK)

class ReceiptItemByUserView(APIView):
    # obtain receipt items for a certain user
    def post(self, request, *args, **kwargs):
        data = request.data
        user = User.objects.get(username=data['username'])
        receipt_items = user.receiptitem_set.all()
        serializer = ReceiptItemSerializer(receipt_items, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)