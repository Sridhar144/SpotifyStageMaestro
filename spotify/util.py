from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get


BASE_URL = "https://api.spotify.com/v1/me/"



def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        print("Access Token:", user_tokens[0].access_token)
        print("Access Token Expiry:", user_tokens[0].expires_in)
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    print("my token", tokens)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    print(expires_in)
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)

        return True

    return False


def refresh_spotify_token(session_id):
    print("Refreshing Spotify Token for Session:", session_id)
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token)
    
def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {tokens.access_token}'}
    print("Headers:", headers)

    try:
        if post_:
            response = post(BASE_URL + endpoint, headers=headers)
        elif put_:
            response = put(BASE_URL + endpoint, headers=headers)
        else:
            response = get(BASE_URL + endpoint, headers=headers)

        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)

        return response.json()
    except Exception as e:
        print(f"Error: {e}")
        return {'error': 'An issue occurred with the Spotify API'}


def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)
def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)
def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)