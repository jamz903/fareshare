#using the tesseract library to convert image to text

#imports
from PIL import Image
import pytesseract
#pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/Cellar/tesseract/5.3.1/bin/tesseract'
import argparse
import cv2
import numpy as np
from receipt_detection import *
import skimage.filters as filters
from imutils.object_detection import non_max_suppression
import os
import re
import csv
from textblob import TextBlob

#construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="path to input image to be OCR'd")
ap.add_argument("-t", "--type", required=True, help="type of image")
args = vars(ap.parse_args())

if (args["type"] == "online"):
    img = cv2.imread(args["image"])
    filename = "{}.png".format(os.getpid())
    cv2.imwrite(filename, img)
    configuration = ("-l eng --oem 1 --psm 4")
    text = pytesseract.image_to_string(Image.open(filename), config=configuration)

else:
    # read the image
    img = cv2.imread(args["image"])

    # scale the image
    img = cv2.resize(img, None, fx=1.2, fy=1.2, interpolation=cv2.INTER_CUBIC)

    # remove noise
    img = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 15)

    # convert to gray
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

    # blur
    #smooth = cv2.GaussianBlur(gray, (95,95), 0)
    smooth = cv2.bilateralFilter(gray,9,75,75)

    # divide gray by morphology image
    division = cv2.divide(gray, smooth, scale=255)

    # sharpen using unsharp masking
    sharp = filters.unsharp_mask(division, radius=1.5, amount=1.5, preserve_range=False)
    sharp = (255*sharp).clip(0,255).astype(np.uint8)

    # threshold
    #thresh = cv2.threshold(sharp, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    #thresh = cv2.threshold(sharp,127,255,cv2.THRESH_BINARY)
    thresh = cv2.GaussianBlur(sharp, (3,3), 0)

    filename = "{}.png".format(os.getpid())
    cv2.imwrite(filename, thresh)

    #load the image as a PIL/Pillow image, apply OCR, and then delete the temporary file
    configuration = ("-l eng --oem 1 --psm 3")
    text = pytesseract.image_to_string(Image.open(filename), config=configuration)

    #spell check
    #tb = TextBlob(text)
    #corrected = tb.correct()
    #print(corrected)


os.remove(filename)

#show the output images
# cv2.imshow("Output", gray)
# cv2.waitKey(0)

# open the file in the write mode
f = open('ocr/model/text.csv', 'w')

# create the csv writer
writer = csv.writer(f)
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