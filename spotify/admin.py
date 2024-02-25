from django.contrib import admin
from .models import SkipVotes,SpotifyToken
# Register your models here.
admin.site.register(SpotifyToken)
admin.site.register(SkipVotes)