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

## Milestone 3
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

#### July (Milestone 3)
##### UI + Core Features (Completed Features)
1. Authentication
- store user data in MySQL database
- Sign Up & Login

2. Adding of Friends

3. Receipt Analysis System
- preprocessing / cleaning of data
- OCR with Tesseract / PyTesseract
- Parsing data with custom script

4. Ability to Edit & Save Receipts
- stored in the database
- allows users to return and edit

5. Spending History
- Shows your total expenditure from your labelled receipts on the Home Page
- Auto updates when you label new receipts

#### July (Milestone 3)
##### Additional Features & Enhancements, Bug Fixes
1. Bug fixes
- Several major bugs with respect to the https connection, saving data, rendering, etc. were resolved.

2. Loading and Error Handling Enhancement
- Enhance UX by showing loading spinners and errors (if any)

3. HTTPS Connection
- Enhance security and trust by obtaining a domain and serving the webpage over https

4. OCR Model Enhancement
- Separation between physical and online receipts
- Employs two different ocr text recognition algorithms

5. One-tap Bill Splitting
- Improved UI for receipt history
- Added option to show a popup summary of how much each user needs to pay
- Copy button allows easy transfer over to messaging services such as Telegram

### User Stories
1. As a student, I want to be able to register for the system to ensure that my transactions are securely stored. [Register/Login]
2. As a student who wants to split a receipt, I want the app to be able to identify what items I purchased in the bill. [OCR Model]
3. As a student, I want to be able to upload any type of receipt. [OCR + User Interface]
4. As a student who wants to split a bill, I want a quick way to determine who needs to pay for each item when I buy for others. [Data Cleaning]
5. As a student who is on a tight budget, I want a quick way to view the categories I am spending on. [User Interface]
6. As a student who does not want to spend time tracing how much I've spent through transfers to other people, I want an expenditure tracker that does that for me. [User Interface + Processing]
7. As a student who is extremely busy, I want an expenditure tracker that requires as little effort as possible [User Flow]

### Proposed Core Features (unchanged)
1. Analysis of receipts using Optical Character Recognition (OCR) Model
2. Automatic sorting into categories, tracking recurring expenses
3. Summarises previous expenditures
4. Allow splitting of bill with other users
5. Show expenditure history
6. Authentication

### Proposed Bonus Features (unchanged)
1. Browser extension to make capturing receipts more convenient
2. Integration with existing solutions (e.g. supper jio telegram bot)

### Tech Stack
#### Frameworks
1. React & Redux (Frontend)
2. Axios (Middleware)
3. Django (Backend)
4. MySQL (Database)
5. Nginx & Gunicorn (HTTPS Connection)
5. Amazon Web Services (Server)
#### Others
1. Javascript (with React & Redux)
2. Python (with Django & OCR Scripts)
3. Tesseract (OCR Model)
4. Tailwind CSS (Styling)

### Project Log (For Milestone 3)
| S/n | Task              | Date | Hours | Remarks | Done By |
| :----: | ----------------- | :----: | :----: | ------- | :----: |
|1| make receipts UI better and fix some issues with the receipt json parser                | July 2, 2023  | 8 hours  | parser had some incompatibilities with browsers which required fixing. added better ui and delete button to receipts screen.                                                                | Jason Lee        |
|2| learn gunicorn & nginx to work with django                                              | July 2, 2023  | 6 hours  | learning how to use gunicorn & nginx to tunnel traffic from the django http server                                                                                                          | jamie            |
|3| make ui more responsive, conduct testing                                                | July 4, 2023  | 6 hours  | Add error handling for all current ui elements, add spinners for all loading elements, add debouncers where necessary to ensure only sending 1 request, testing to make sure all this works | Jason Lee        |
|4| update receipts ui to be able to split bill and show how much assignees need to pay     | July 22, 2023 | 12 hours | update receipts screen with new UI so that it is clearer, and able to give a birds eye view of how much each user spent                                                                     | Jason Lee        |
|5| implement saving for new receipt model to save more data                                | July 20, 2023 | 12 hours | updated saving receipts to work with new database changes, this affects both creating and editing receipts                                                                                  | Jason Lee        |
|6| separation of physical / online receipts                                                | July 11, 2023 | 8 hours  | provide more support for online receipts by curating a separate workflow (OCR preprocessing done for physical receipts is now omitted if it is an online receipt that is uploaded)          | jamie            |
|7| enhance OCR model                                                                       | July 22, 2023 | 6 hours  | updating code to do better line by line OCR detection so that it works better with the parser                                                                                               | jamie            |
|8| figure out and create new model for receipt item                                        | July 11, 2023 | 4 hours  | updated ER diagram with new modifications and made changes to the backend                                                                                                                   | Jason Lee        |
|9| configure domain & ec2 to work with domain                                              | July 3, 2023  | 12 hours | configure the domain (fareshare.ninja) to work with our aws ec2 container so that the http requests will successfully go through                                                            | jamie            |
|10| figuring out & fixing the web bug that caused website to not render on certain browsers | July 10, 2023 | 10 hours | slowly went through our code to look for the issue & found the issue with a feature we used in our JsonParser, the lookforward regex function that is not compatible with all browsers.     | jamie, Jason Lee |
|11| troubleshooting issues with https server                                                | July 4, 2023  | 8 hours  | faced some CORS & http 500 errors that was fixed after some tweaks to nginx and django configurations                                                                                       | jamie            |
|12| create poster and other relevant materials for milestone 3 submission                   | July 23, 2023 | 3 hours  |                                                                                                                                                                                             | Jason Lee, jamie |

Total hours for Milestone 3: \
Jason: 55 \
Jamie: 53

Total hours for Milestones 1, 2, 3: \
Jason: 151 \
Jamie: 151
