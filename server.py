from flask import Flask, render_template, request, make_response
import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime
import json
import urllib.parse as urlparse
from flask.json import jsonify


url = urlparse.urlparse(os.environ['DATABASE_URL'])
dbname = url.path[1:]
user = url.username
password = url.password
host = url.hostname
port = url.port

conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
            cursor_factory=RealDictCursor
            )

c = conn.cursor()

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    nowiso = datetime.now().isoformat()

    c.execute('select * from songs where time <= %s order by time desc', (nowiso,))
    row = c.fetchone()
    song = {}
    song['number'] = row['number']
    song['orden'] = row['orden']
    song['artist'] = row['artist'].upper()
    song['title'] = row['title'].upper()
    time = datetime.fromisoformat(row['time'])
    song['time'] = time.strftime('%a %d %H:%M').upper()
    color = 220 + song['orden']*360/969
    if song['number'].startswith('YM'):
        color = 330 + song['orden']*360/16
    song['color'] = color

    return render_template('main.html', currentsong=song)

@app.route('/data',methods=["POST"])
def getData():
    if request.method == "POST":
        nowiso = datetime.now().isoformat()
        c.execute('select * from songs where time >= %s order by time', (nowiso,))
        rows = c.fetchall()
        songs = []
        for row in rows:
            song = {}
            song['number'] = row['number']
            song['orden'] = row['orden']
            song['artist'] = row['artist'].upper()
            song['title'] = row['title'].upper()
            song['time'] = row['time']
            color = 220 + song['orden']*360/969
            if song['number'].startswith('YM'):
                color = 330 + song['orden']*360/16
            
            song['color'] = color
            songs.append(song)
        resp = make_response(json.dumps(songs), 200)
        resp.headers['Content-Type'] = 'application/json'
        return resp
        

if __name__ == '__main__':
    app.run(threaded=True, debug=True, host='0.0.0.0')