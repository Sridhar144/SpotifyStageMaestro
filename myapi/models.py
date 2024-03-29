import string
import random
from django.db import models
def generate_code():
    length=6
    while True:
        code=''.join(random.choices(string.ascii_uppercase,k=length))
        if Room.objects.filter(code=code).count()==0:
            break
        return code
# Create your models here.
class Room(models.Model):
    code=models.CharField(max_length=8, default=generate_code, unique=True)
    host=models.CharField(max_length=50, unique=True)
    pause=models.BooleanField(null=False, default=False)
    votes=models.IntegerField(null=False, default=1)
    creation=models.DateTimeField(auto_now_add=True)
    current_song=models.CharField(max_length=50, default="Admin's Favorites")
