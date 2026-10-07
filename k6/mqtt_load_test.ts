
import { Client } from "k6/x/mqtt";

export const options = {
  vus: 1,
  duration: "30s"
};

const topic = "telemetry/90585c32-4852-426f-b984-cf75981bfed3";

export default function () {
  const client = new Client();

  const data = {
    acc_x: 0.4,
    acc_y: 0.4,
    acc_z: 9.4,
    gyro_x: -0.4,
    gyro_y: 0.4,
    gyro_z: 1.4,
    roll: -1.4,
    pitch: 0.4,
    yaw: 232.4,
    latitude: -5.233134028576208,
    longitude: 119.50286355589539
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
    __ENV.MQTT_BROKER_ADDRESS || "mqtt://13.229.227.127:1884"
  );
}