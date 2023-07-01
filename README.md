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
##### Additional Features, Bug Fixes
1. Bug Fixes
2. Improvement of UX (Loading Speed, UI Design)
3. Tracking of Recurring Expenses
4. Browser Extension / Widget
5. Integration with Telegram Bots

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
5. Amazon Web Services (Server)
#### Others
1. Javascript (with React & Redux)
2. Python (with Django & OCR Scripts)
3. Tesseract (OCR Model)
4. Tailwind CSS (Styling)

### Project Log (For Milestone 2)
| S/n | Task              | Date | Hours | Remarks | Done By |
| :----: | ----------------- | :----: | :----: | ------- | :----: |
| 1   | planning for next milestone + complete all 3 peer reviews                                          | May 30, 2023  | 2 hours | mapping out features that we need to develop in detail for the next milestone and completing peer reviews                                                                                                                                                                                 | Both      |
| 2   | planning out UI/UX through figma                                                                   | June 5, 2023  | 6 hours | mapped out how our UI would look like in figma, and what components we should make for the UI to be presentable                                                                                                                                                                           | Both      |
| 3   | hosting our website on AWS EC2 + hosting the database on AWS RDS                                   | June 5, 2023  | 4 hours | configuring AWS to host our django project and database                                                                                                                                                                                                                                   | Both      |
| 4   | add styling to splash, login and signup pages, and Navbar component                                | June 6, 2023  | 4 hours | styling components and pages with tailwind, includes setting up fonts, colors, icons in tailwind config                                                                                                                                                                                   | Jason Lee |
| 5   | create frontend UI to upload receipts and link it with django backend                              | June 7, 2023  | 4 hours | learnt how to create forms with react and how to pass images from the frontend to the backend through FormData and how to receive images in the django backend using serialisers                                                                                                          | jamie     |
| 6   | fix bugs with axios and cors                                                                       | June 7, 2023  | 4 hours | faced issues with getting the POST requests through because of CORS and AXIOS used in the react frontend. spent time fixing bugs and permission issues                                                                                                                                    | jamie     |
| 7   | link up OCR python scripts with new django code                                                    | June 7, 2023  | 1 hour  | linked existing python scripts to the uploading receipts workflow, to return a json object to the frontend so that it can be parsed                                                                                                                                                       | jamie     |
| 8   | Built a drawer hamburger menu & added an icon                                                      | June 7, 2023  | 3 hours | learnt how to make hamburger menu and created one                                                                                                                                                                                                                                         | Jason Lee |
| 9   | Created a parser to parse the receipt json data output by the ocr algorithm                        | June 7, 2023  | 3 hours | created a preliminary parsing algorithm for the json files outputted by the ocr algorithm. Will probably need further improvement.                                                                                                                                                        | Jason Lee |
| 10  | fixing errors with data passed to django + further refinements to OCR                              | June 8, 2023  | 4 hours | fixed bug that caused undefined name of receipt to be pushed to MySQL database, and optimised output of OCR model so that it is more consistent when given to the parser (i.e. consistently passing name + price of items)                                                                | jamie     |
| 11  | Refine parser                                                                                      | June 8, 2023  | 7 hours | Parser now 1. obtains other values such as subtotal, paid amount, change, etc. 2. obtains quantity of item if possible. 3. cleans name of item. 4. detects and filters out invalid items in the receipt better 5. validates output using totals, subtotals and paid amounts, if possible. | Jason Lee |
| 12  | learn how to make unit tests for front end elements (React Testing Library, Enzyme, Jest)          | June 9, 2023  | 4 hours | learning how to use the three libraries listed to create unit tests for react components, and how to successfully recreate scenarios that involve dependencies such as redux states                                                                                                       | jamie     |
| 13  | creating unit tests for front end elements                                                         | June 9, 2023  | 4 hours | creating unit tests for react component used + spent time debugging issues with retrieving redux state for drawer unit tests                                                                                                                                                              | jamie     |
| 14  | create receipt data screen which takes in data from the parser                                     | June 9, 2023  | 8 hours | designed and created general layout for receipt data screen                                                                                                                                                                                                                               | Jason Lee |
| 15  | creating unit tests for backend (django)                                                           | June 15, 2023 | 8 hours | learning how to create unit tests for backend to test models & views with django’s inbuilt testing tool (django.Test) and using htmlcov to check overall code coverage                                                                                                                    | jamie     |
| 16  | store receipts under users in the database & allow users to access receipts that they have created | June 20, 2023 | 4 hours | update django model & database through migrations, and learning how to pass data to react through axios get requests                                                                                                                                                                      | jamie     |
| 17  | refine ui for camera, uploading, and receipt data                                            | June 20, 2023 | 4 hours | added ‘add item’ and ‘delete item’ functionality for receipt data screen                                                                                          | Jason Lee |
| 18  | create friends list ui                                                                             | June 21, 2023 | 4 hours | designed and created friends list ui                                                                                                                                                                                                                                                      | Jason Lee |
| 19  | store processed receipt data and allow ability to update receipt model                             | June 22, 2023 | 4 hours | create get & post requests in django to be able to retrieve all receipts under user & edit the selected receipt data, use axios to pass updated data to the backend                                                                                                                       | jamie     |
20  | allow users to edit the processed receipt data and update the database respectively                | June 26, 2023 | 6 hours | debug problems with data being passed to axios & create js page with tailwindcss to display the receipts that the user has created and allow them to click it to edit the data that has been saved in the databsae                                                                        | jamie     |
| 21  | connected friends list to backend                                                            | June 24, 2023 | 4 hours | created database models for friends list, general backend work to make friend requests and friends list work                                                      | Jason Lee |
| 22  | connected friends list to receipt data screen and added expenses totalling, fixed a few bugs | June 25, 2023 | 4 hours | receipt data screen now pulls friends list from the server. able to assign ‘me’ as an assignee to total personal expenses, fixed some bugs with the logout button | Jason Lee |
| 23  | poster & video for milestone 2                                                               | June 26, 2023 | 2 hours | -                                                                                                                                                                 | Both      |
