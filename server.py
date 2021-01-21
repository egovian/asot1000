from flask import Flask, render_template, request, make_response
import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime, timedelta
import json
import urllib.parse as urlparse
from flask.json import jsonify
import requests as req


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

def update_times():
    now = datetime.now()
    date = None
    res = req.get('https://nitter.net/asot/rss')

    text = str(res.content)
    if len(text.split("<item>")) > 1:
        item = text.split("<item>")[1].split('<title>')[1]
        if item.startswith('#'):
            number = item.split('#')[1].split(" ")[0]
            print(number)
            datetxt = item.split('<pubDate>')[1].split('</pubDate>')[0]
            date = datetime.strptime(datetxt, "%a, %d %b %Y %H:%M:%S GMT")
            update_time = {"number":number, "time":date.isoformat(), "update":"yes"}
            return update_time
        else:
            return {"number":0, "time":datetime.now().isoformat(), "update":"no"}
    else:
        return {"number":0, "time":datetime.now().isoformat(), "update":"no"}



@app.route('/')
def index():
    update_time = update_times()
    return render_template('main.html', update_time=json.dumps(update_time))

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