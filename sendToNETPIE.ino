#include <ESP8266WiFi.h>
#include <PubSubClient.h>


const char* ssid = ".";
const char* password = "tiewhappy";
const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "46caec23-92fb-45b4-a731-a609e2b37536";
const char* mqtt_username = "9hg8vg2UydbqxbnWkQCsihxbbYjXifen";
const char* mqtt_password = "MGIQXFgtO_Q~fCK2VeEQRReI0cisj$Zt";

WiFiClient espClient;
PubSubClient client(espClient);
char msg[50];
char s;

void reconnect() {
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection…");
        if (client.connect(mqtt_Client, mqtt_username, mqtt_password)) {
            Serial.println("connected");
            client.subscribe("@msg/led");
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println("try again in 5 seconds");
            delay(5000);
        }
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");

    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    client.setServer(mqtt_server, mqtt_port);
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();
    if(Serial.available()>0){
      s = Serial.read();
      Serial.println("Received Signal :");
      Serial.println(s);
      String data = "{\"data\": {\"signal\":" + String(s) + "}}";
      Serial.println(data);
      data.toCharArray(msg, (data.length() + 1));
      client.publish("@msg/temp", msg);
      delay(100);
    }
}
