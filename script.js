var data = [];
var signal = "2";
var s2;
var people_count = 0;
var enter_count = 0;
var exit_count = 0;
var timeCount;
var startTime = -1;
var loopTime;
var isStart = 0;

client = new Paho.MQTT.Client("mqtt.netpie.io", 443, "452ccdad-c097-4907-bdd6-ba1bca11f08b");
client.onMessageArrived = onMessageArrived;

function onMessageArrived(message) {
    console.log("yayyay");
    bfparse = message.payloadString;
    signal = JSON.parse(bfparse).data.signal;
    console.log(signal);
}

var options = {
  useSSL: true,
  userName : "wxmoqzRpbNUdNmujeJjbwmQSFZV41LAV",
  password : "vA_m_w9LW50EW#CZXKSt~1JPHDrfb(J#",  
  onSuccess: onConnect,
  onFailure:doFail,
}

client.connect(options);

function onConnect() {
  client.subscribe("@msg/temp");
  document.getElementById("connect").innerHTML = "connected with netpie!";
}

function doFail(e){
    console.log(e);
  }



function startOn() {
    if(isStart==1)return;
    isStart = 1;
    var d = new Date();
    timeCount = d.getTime;
    startTime = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    onAir();
}

function stop() {
    startTime = -1;
    isStart = 0;
}

function refresh() {
    location.reload();
}

function onAir() {
    if (startTime != -1) {
        if(signal == "1") enter_count += 1;
        else if(signal == "0") exit_count += 1;
        if (exit_count > enter_count) exit_count = enter_count;
        people_count = enter_count - exit_count; 
    }
    console.log(signal);
    signal = "2";   
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    const table_time = document.getElementById("run-time")
    table_time.innerHTML = `
            ${h + ":" + m + ":" + s + "\tจำนวนคน " + people_count + " คน"}
            `
    now_time = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    loopTime = document.getElementById("loop-time").value;
    if (startTime != -1 && (now_time - startTime) % loopTime == 0) {
        data.unshift([h + ":" + m + ":" + s, enter_count, exit_count ,people_count]);
        showTable();
    }
    setTimeout(onAir, 1000);
}

function showTable() {
    const table_body = document.getElementById("main-table-body")
    table_body.innerHTML = ""

    for (var i = 0; i < data.length; i++) {
        table_body.innerHTML += `
            <tr>
                <td>${data[i][0]}</td>
                <td>${data[i][1]}</td>
                <td>${data[i][2]}</td>
                <td>${data[i][3]}</td>
            </tr>
            `
    }
}

