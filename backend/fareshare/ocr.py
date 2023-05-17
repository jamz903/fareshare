#using the tesseract library to convert image to text
#baseline code, to be enhanced later

#imports
#PIL - Python Imaging Library (basic image processing)
from PIL import Image
#pytesseract - is a wrapper for Google's Tesseract-OCR Engine
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/Cellar/tesseract/5.3.0_1/bin/tesseract'
import argparse
import cv2
import os
# from delocate.fuse import fuse_wheels
# fuse_wheels('Pillow-9.4.0-2-cp39-cp39-macosx_10_10_x86_64.whl', 'Pillow-9.4.0-cp39-cp39-macosx_11_0_arm64.whl', 'Pillow-9.4.0-cp39-cp39-macosx_11_0_universal2.whl')

#construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="path to input image to be OCR'd")
ap.add_argument("-p", "--preprocess", type=str, default="thresh", help="type of preprocessing to be done")
args = vars(ap.parse_args())

#load the image and convert it to grayscale, then apply thresholding to preprocess the image
image = cv2.imread(args["image"])
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#check if we should apply thresholding to preprocess image
#thresholding: segementing images into foreground and background
if args["preprocess"] == "thresh":
	gray = cv2.threshold(gray, 0, 255,
		cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

#make a check to see if we should remove noise from the image
#median blurring: central element of image replaced by median of all pixels in kernel area
elif args["preprocess"] == "blur":
    gray = cv2.medianBlur(gray, 3)

filename = "{}.png".format(os.getpid())
cv2.imwrite(filename, gray)

#load the image as a PIL/Pillow image, apply OCR, and then delete the temporary file
text = pytesseract.image_to_string(Image.open(filename))
os.remove(filename)
print(text)

#show the output images
cv2.imshow("Image", image)
cv2.imshow("Output", gray)
cv2.waitKey(0)


#currently can only be ran as a script, not made a function yet
# if you run on macbook, you need to install tesseract in your local machine
# brew install tesseract
# Step 1: navigate to backend directory
# Step 2: activate virtual env
# source env/bin/activate
# Step 3: run script
# python3 ocr.py --image images/sample1.jpg --preprocess thresh
# python3 ocr.py --image images/sample1.jpg --preprocess blur