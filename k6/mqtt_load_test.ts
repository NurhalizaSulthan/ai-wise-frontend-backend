
import { Client } from "k6/x/mqtt";

export const options = {
  vus: 1,
  duration: "30s"
};

const topic = "telemetry/d5:23:6a:16:fb:82";

export default function () {
  const client = new Client();

  const data = {
    x: 0.4,
    y: 0.4,
    z: 9.4,
    gx: -0.4,
    gy: 0.4,
    gz: 1.4,
    roll: -1.4,
    pitch: 0.4,
    yaw: 232.4,
    total: 1.0,
    status: "AMAN"
  };

  client.on("connect", async () => {
    console.log("Connected to MQTT broker");

    const intervalID = setInterval(() => {
      client.publish(topic, JSON.stringify(data))
      console.log("Telemetry published");
    }, 250)

    setTimeout(() => {
      clearInterval(intervalID)
      client.end()
    }, 31000)
  });

  client.on("error", (error) => {
    console.error("MQTT error:", error);
  });

  client.on("end", () => {
    console.log("Disconnected from MQTT broker");
  });

  client.connect(
    // __ENV.MQTT_BROKER_ADDRESS || 
    "mqtt://localhost:1883"
  );
}