#using the tesseract library to convert image to text

#imports
from PIL import Image
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/Cellar/tesseract/5.3.1/bin/tesseract'
import argparse
import cv2
import numpy as np
from receipt_detection import *
import skimage.filters as filters
from imutils.object_detection import non_max_suppression
import os
import re
import csv

#construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="path to input image to be OCR'd")
args = vars(ap.parse_args())

# read the image
img = cv2.imread(args["image"])

# convert to gray
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

# blur
smooth = cv2.GaussianBlur(gray, (95,95), 0)

# divide gray by morphology image
division = cv2.divide(gray, smooth, scale=255)


# sharpen using unsharp masking
sharp = filters.unsharp_mask(division, radius=1.5, amount=1.5, preserve_range=False)
sharp = (255*sharp).clip(0,255).astype(np.uint8)

# threshold
#thresh = cv2.threshold(sharp, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]


filename = "{}.png".format(os.getpid())
cv2.imwrite(filename, sharp)

#load the image as a PIL/Pillow image, apply OCR, and then delete the temporary file
configuration = ("-l eng --oem 1 --psm 3")
text = pytesseract.image_to_string(Image.open(filename), config=configuration)
os.remove(filename)
print(text)

#show the output images
# cv2.imshow("Output", gray)
# cv2.waitKey(0)

def clean(text):
    amounts = re.findall(r'\d+\.\d{2}\b', text)
    floats = [float(amount) for amount in amounts]
    unique = list(dict.fromkeys(floats))
    return unique

amounts = clean(text)
amounts.sort()
#print(amounts)
#print("Total price of item: ", max(amounts))

# open the file in the write mode
f = open('fareshare/ocr/text.csv', 'w')

# create the csv writer
writer = csv.writer(f)
pricePattern = r'([0-9]+\.[0-9]+)'
# write a row to the csv file
for row in text.split("\n"):
    writer.writerow([row])

# close the file
f.close()



#currently can only be ran as a script, not made a function yet
# if you run on macbook, you need to install tesseract in your local machine
# brew install tesseract
# Step 1: navigate to backend directory
# Step 2: activate virtual env
# source env/bin/activate
# Step 3: run script
# python3 ocr.py --image images/sample1.jpg --preprocess thresh
# python3 ocr.py --image images/sample1.jpg --preprocess blur