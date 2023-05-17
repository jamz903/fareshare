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