from datetime import datetime, timedelta
import requests as req


res = req.get('https://nitter.net/asot/rss')

text = str(res.content)
in_item = False
item = text.split("<item>")[1].split('<title>')[1]
if item.startswith('#'):
    number = item.split('#')[1].split(" ")[0]
    print(number)
    datetxt = item.split('<pubDate>')[1].split('</pubDate>')[0]
    date = datetime.strptime(datetxt, "%a, %d %b %Y %H:%M:%S GMT")
    print(date)