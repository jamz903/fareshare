# fareshare

## For Developers
to begin developing the frontend, do (in the frontend directory):

_(please make sure you have yarn installed)_

```
yarn start
```

for the django backend, do (in the backend directory):

_(please make sure you have django installed)_

```
python3 manage.py runserver
```

for the tesseract model dependencies, they are installed in virtual env _venv_
use this command to activate the virutal environment to install more dependencies:

_(please make sure you have virtualenv installed)_

```
cd backend
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

to update the requirements.txt after more packages are installed (in the backend directory):

```
pip freeze > requirements.txt
deactivate
```
_note: remember to run these commands while you are still in the virtual env_

## Milestone 1

### Tech Stack
#### Frameworks
1. React & Redux (Frontend)
2. Django (Backend)
#### Others
1. Javascript (with React & Redux)
2. Python (with Django & OCR Scripts)
3. Tesseract (OCR Model)

### Project Log
| S/n | Task              | Date | Hours | Remarks | Done By |
| :----: | ----------------- | :----: | :----: | ------- | :----: |
|1|Idealization|10/5|4|Refined the features we would like to develop and sorting out the core features to be developed first, and came up with ideas on what technologies we should use|Both|
|2|Poster & Video|11/5|2|Completed poster with canva + wrote script and filmed our 1 min pitch|Both|
|3|Learning React Basics|13/5|4|2 hour orbital workshop + 2 hours of exploring additional content|Both|
|4|Learning Django Basics|17/5|2|Reading some guides and learning the MTV model that django follows|Both|
|5|Set up of Dependencies & Stack|17/5|4|Setting up our environment to start working|Both|
|6|Baseline OCR Python Script|17/5|2|Learnt how to use tesseract with python and implemented a basic script to read text from receipts|Jamie|
|7|Learning how to link Django with React|17/5|5|Learning advanced Django and React for our Tech Stack|Both|
|8|Further developing OCR model|22/5|6|Testing EAST OpenCV Model, Edge Detection, Data Cleaning Methods|Jamie|
|9|Learning Rest API|22/5|4|Setting up API endpoints with Django authentication and Django REST API|Jason|
|10|Learning and Implementing Redux|26/5|6|Setting up Redux to work with Django Authentication|Jason|
|11|Linking OCR model to backend|26/5|4|Cleaning the text produced by tesseract and making it an API with Django|Jamie|

Total hours per member: 31
