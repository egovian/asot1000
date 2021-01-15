
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


function drawTable(songs){
    var table = document.getElementById("tablesongslarge")
    var table2 = document.getElementById("tablesongsshort")
    for(var i = 0; i < songs.length; i++){
        var row = table.insertRow(-1);
        var number = row.insertCell(-1);
        var artist = row.insertCell(-1);
        var title = row.insertCell(-1);
        var time = row.insertCell(-1);
        

        var date = new Date(songs[i].time)
        var date_utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                                date.getHours(), date.getMinutes(), date.getSeconds()));

        var options = { weekday: 'short', day: '2-digit' , hour: "2-digit", minute: "2-digit", hour12:false};
        timestr = date_utc.toLocaleString(navigator.languages, options).toUpperCase()


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
}

window.addEventListener('load', askForData);