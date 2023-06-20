from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User

#run this test file specifically
#coverage run ./manage.py test accounts -v 2
#run all tests
#coverage run ./manage.py test
#coverage html --omit="*/test*"
# Create your tests here.
class testView(TestCase):
    def test_register(self):
        c = Client()
        response = c.post('/accounts/register', {'username': 'test', 'password': 'testing123', 're_password': 'testing123'}, format='json')
        self.assertEqual(response.status_code, 200)
    
    def test_user_exists(self):
        User.objects.create_user(username="testing", password="testing123")
        c = Client()
        response = c.post('/accounts/register', {'username': 'testing', 'password': 'helloworld123', 're_password': 'helloworld123'}, format='json')
        self.assertEqual(response.status_code, 404)

    def test_password_mismatch(self):
        c = Client()
        response = c.post('/accounts/register', {'username': 'test', 'password': 'testing123', 're_password': 'test'}, format='json')
        self.assertEqual(response.status_code, 404)
    
    def test_password_too_short(self):
        c = Client()
        response = c.post('/accounts/register', {'username': 'test', 'password': 'test', 're_password': 'test'}, format='json')
        self.assertEqual(response.status_code, 404)
    
    def test_check_authentication(self):
        user = User.objects.create_user(username="testuser")
        user.set_password("testpassword123")
        user.save()
        c = Client()
        c.login(username="testuser", password="testpassword123")
        response = c.get('/accounts/authenticated', format='json')
        self.assertEqual(response.data['is_authenticated'], True)
    
    def test_check_authentication_fail(self):
        c = Client()
        c.login(username="testfail", password="testpassword123")
        response = c.get('/accounts/authenticated', format='json')
        self.assertEqual(response.data['is_authenticated'], False)
    
    def test_check_login(self):
        user = User.objects.create_user(username="userlogin")
        user.set_password("testing123")
        user.save()
        c = Client()
        response = c.post("/accounts/login", {'username': 'userlogin', 'password': 'testing123'}, format='json')
        self.assertEqual(response.status_code, 200)
    
    def test_check_login_fail(self):
        c = Client()
        response = c.post("/accounts/login", {'username': 'wronguser', 'password': 'wrongpassword123'}, format='json')
        self.assertEqual(response.status_code, 404)
    
    def test_check_logout(self):
        c = Client()
        c.login(username="testing", password="testing123")
        response = c.post("/accounts/logout", format='json')
        self.assertEqual(response.status_code, 200)
    
    def test_check_delete_account(self):
        user = User.objects.create_user(username="userdelete")
        user.set_password("testpassword123")
        user.save()
        c = Client()
        c.login(username="userdelete", password="testpassword123")
        response = c.delete("/accounts/delete", {'username': 'userdelete', 'password': 'testpassword123'}, format='json')
        self.assertEqual(response.status_code, 200)
    
    def test_check_delete_account_fail(self):
        c = Client()
        response = c.delete("/accounts/delete", {'username': 'wronguser', 'password': 'wrongpassword123'}, format='json')
        self.assertEqual(response.status_code, 404)
    
    def test_CSRF(self):
        c = Client()
        response = c.get("/accounts/csrf_cookie", format='json')
        self.assertEqual(response.status_code, 200)