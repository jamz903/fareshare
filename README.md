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

remember to build frontend files with (in the frontend directory):

_this ensures that when you run the backend server the frontend is updated._
```
yarn run build
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

## Milestone 2
#### Level of Achievement: Apollo 11

### The Problem
Splitting bills is part and parcel of our **student life**. When we eat meals together, it is more convenient for one person to pay first, and the rest to split the bill later. As a result, our expenditure is often represented as a series of monetary transfers. This makes it very difficult to track what the money is actually being spent on.

We have found existing expenditure trackers available to be too generic and inconvenient for us students. As a result, even though we may want to track our expenditure in detail, we do not follow through. This causes overspending and bad monetary decisions.

### Our Solution
FareShare is a bill splitting app that helps **students** automatically **split bills** and at the same time **track their expenditure** in the most efficient way possible.

### Project Scope
#### May (Milestone 1)
##### Proof of Concept, Baseline Code
1. OCR Model
- be able to preprocess bad images and transform them
- extract text from receipt with >80% accuracy

2. Authentication
- be able to create a user
- be able to login

#### June (Milestone 2)
##### UI + Core Features
1. Database
- store user data in MySQL database

2. Be able to submit photos of receipts
- UI for photo taking

3. Receipt Analysis System
- clean data
- track recurring expenses

4. Bill Splitting
- be able to indicate which expenses are not yours
- bill your friends

5. Expenditure Summary Screen
- Show all categories of expenses

#### July (Milestone 3)
##### Additional Features, Bug Fixes
1. Browser Extension / Widget
2. Integration with Telegram Bots

### User Stories
1. As a student, I want to be able to register for the system to ensure that my transactions are securely stored. [Register/Login]
2. As a student who wants to split a receipt, I want the app to be able to identify what items I purchased in the bill. [OCR Model]
3. As a student, I want to be able to upload any type of receipt. [OCR + User Interface]
4. As a student who wants to split a bill, I want a quick way to determine who needs to pay for each item when I buy for others. [Data Cleaning]
5. As a student who is on a tight budget, I want a quick way to view the categories I am spending on. [User Interface]
6. As a student who does not want to spend time tracing how much I've spent through transfers to other people, I want an expenditure tracker that does that for me. [User Interface + Processing]
7. As a student who is extremely busy, I want an expenditure tracker that requires as little effort as possible [User Flow]

### Proposed Core Features
1. Analysis of receipts using Optical Character Recognition (OCR) Model
2. Automatic sorting into categories, tracking recurring expenses
3. Summarises previous expenditures
4. Allow splitting of bill with other users
5. Show expenditure history
6. Authentication

### Proposed Bonus Features
1. Browser extension to make capturing receipts more convenient
2. Integration with existing solutions (e.g. supper jio telegram bot)

### Tech Stack
#### Frameworks
1. React & Redux (Frontend)
2. Django (Backend)
3. MySQL (Database)
4. Amazon Web Services (Server)
#### Others
1. Javascript (with React & Redux)
2. Python (with Django & OCR Scripts)
3. Tesseract (OCR Model)
4. Tailwind CSS (Styling)

### Project Log
| S/n | Task              | Date | Hours | Remarks | Done By |
| :----: | ----------------- | :----: | :----: | ------- | :----: |
|1|Idealization|10/5|4|Refined the features we would like to develop and sorting out the core features to be developed first, and came up with ideas on what technologies we should use|Both|
|2|Poster & Video|11/5|4|Completed poster with canva + wrote script and filmed our 1 min pitch|Both|
|3|Learning React Basics|13/5|4|2 hour orbital workshop + 2 hours of exploring additional content|Both|
|4|Learning Django Basics|17/5|4|Reading some guides and learning the MTV model that django follows|Both|
|5|Set up of Dependencies & Stack|17/5|4|Setting up our environment to start working|Both|
|6|Baseline OCR Python Script|17/5|6|Learnt how to use tesseract with python and implemented a basic script to read text from receipts|Jamie|
|7|Learning how to link Django with React|17/5|5|Learning advanced Django and React for our Tech Stack|Both|
|8|Further developing OCR model|22/5|6|Testing EAST OpenCV Model, Edge Detection, Data Cleaning Methods|Jamie|
|9|Learning Rest API|22/5|4|Setting up API endpoints with Django authentication and Django REST API|Jason|
|10|Learning and Implementing Redux|26/5|6|Setting up Redux to work with Django Authentication|Jason|
|11|Linking OCR model to backend|26/5|4|Cleaning the text produced by tesseract and making it an API with Django|Jamie|
|12|Finish implementing Django authentication with frontend|28/5|6|Fully implement authentication workflow on frontend (register, login, logout). Added utility components for redirecting, in case user is not logged in.|Jason|

Total hours per member: 41
