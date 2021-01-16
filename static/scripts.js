
function changeTables(){
    var tablelarge = document.getElementById('tablelarge')
    var tableshort = document.getElementById('tableshort')
    if(window.innerWidth >= 960){
        tablelarge.classList.remove("hide")
        tableshort.classList.add("hide")
    }else{
        tablelarge.classList.add("hide")
        tableshort.classList.remove("hide")
    }
}

window.addEventListener('load', changeTables);
window.addEventListener('resize', changeTables);


function askForData(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        drawTable(JSON.parse(this.response));
    };

    xhr.open("POST", '/data', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        value: "value"
    }));
}


function drawTable(){
    var table = document.getElementById("tablesongslarge")
    var table2 = document.getElementById("tablesongsshort")
    table.innerHTML = ""
    table2.innerHTML = ""
    songs = data

    var currentnumber = 69420
    var currentartist = "TEST"
    var currenttitle = "TEST"
    var currentcolor = 200

    for(var i = 0; i < songs.length; i++){
        var date_utc = new Date(songs[i].time)
        var date = new Date(Date.UTC(date_utc.getFullYear(), date_utc.getMonth(), date_utc.getDate(),
                                    date_utc.getHours(), date_utc.getMinutes(), date_utc.getSeconds()));
        var now = new Date()
        
        if(now >= date){
            currentnumber = songs[i].number
            currentartist = songs[i].artist
            currenttitle = songs[i].title
            currentcolor = songs[i].color
            if(document.getElementById('showallselector').innerHTML == "show"){
                continue
            }
        }
        var options = { weekday: 'short', day: '2-digit' , hour: "2-digit", minute: "2-digit", hour12:false};
        timestr = date.toLocaleString(navigator.languages, options).toUpperCase()

        var row = table.insertRow(-1);
        var number = row.insertCell(-1);
        var artist = row.insertCell(-1);
        var title = row.insertCell(-1);
        var time = row.insertCell(-1);
        
        row.classList.add("song")

        number.classList.add("number");
        number.style.color = "hsl(" + songs[i].color + ", 63%, 64%)";
        number.innerHTML = songs[i].number;

        artist.classList.add("artist");
        artist.style.color = "hsl(" + songs[i].color + ", 63%, 64%)";
        artist.innerHTML = songs[i].artist;

        title.classList.add("title");
        title.innerHTML = songs[i].title;

        time.classList.add("time");
        time.innerHTML = timestr;



        row2 = table2.insertRow(-1);
        var shortright = row2.insertCell(-1);
        var shortleft = row2.insertCell(-1);
        
        row2.classList.add("song")

        shortright.classList.add("shortright");
        shortright.innerHTML = '<span class="number short" style="color: hsl(' + songs[i].color + ', 63%, 64%);">' + songs[i].number + '</span><br><span class="time short">' + timestr + '</span>';

        shortleft.classList.add("shortleft");
        shortleft.innerHTML = '<span class="artist short" style="color: hsl(' + songs[i].color + ', 63%, 64%);">' + songs[i].artist + '</span><br><span class="title short">' + songs[i].title + '</span>'
    }

    document.getElementById('currentnumber').innerHTML = "#" + currentnumber
    document.getElementById('currentartist').innerHTML = currentartist
    document.getElementById('currenttitle').innerHTML = currenttitle
    document.getElementById('centercurrent').style.backgroundColor = 'hsl(' + currentcolor + ', 63%, 64%)';
}

window.addEventListener('load', drawTable);


function showAll(){
    if(document.getElementById('showallselector').innerHTML == "show"){
        document.getElementById('showallselector').innerHTML = "hide"
        document.getElementById('showall').innerHTML = "Show next songs"
    }else{
        document.getElementById('showallselector').innerHTML = "show"
        document.getElementById('showall').innerHTML = "Show all songs"
    }
    drawTable()
}