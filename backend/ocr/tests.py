from django.test import TestCase
from ocr.models import Receipt
from django.test import Client
# Create your tests here.

class ReceiptTestCase(TestCase):
    def create_receipt(self, name="testing", image="ocr/images/img1.jpg"):
        return Receipt.objects.create(name=name, image=image)
    
    def test_receipt_creation(self):
        r = self.create_receipt()
        self.assertTrue(isinstance(r, Receipt))
        self.assertEqual(r.__str__(), r.name)
    
    def test_receipt_get(self):
        c = Client()
        c.post('/accounts/register', {'username': 'test', 'password': 'testing123', 're_password': 'testing123'}, format='json')
        c.login(username='test', password='testing123')
        response = c.get('/ocr/upload/', format='json')
        self.assertEqual(response.status_code, 200)
    
