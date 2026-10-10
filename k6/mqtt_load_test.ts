
import { Client } from "k6/x/mqtt";

export const options = {
  scenarios: {
    first_device: {
      executor: 'constant-vus',
      exec: 'firstDevice',
      vus: 1,
      duration: '120s'
    },
    second_device: {
      executor: 'constant-vus',
      exec: 'secondDevice',
      vus: 1,
      duration: '120s'
    },
    third_device: {
      executor: 'constant-vus',
      exec: 'thirdDevice',
      vus: 1,
      duration: '120s'
    }
  }
  // vus: 1,
  // duration: "30s"
};

const topics = [
  "telemetry/d5:23:6a:16:fb:82",
  "telemetry/d5:8c:68:5d:5c:2f",
  "telemetry/64:00:01:8b:8e:8e",
  // "telemetry/9c:be:eb:a9:f1:d0",
]

export function firstDevice() {
  const client = new Client();

  const topic = "telemetry/d5:23:6a:16:fb:82"

  const data = {
    x: 0.1,
    y: 0.1,
    z: 9.1,
    gx: -0.1,
    gy: 0.1,
    gz: 1.1,
    roll: -1.1,
    pitch: 0.1,
    yaw: 232.1,
    total: 1.0,
    status: "AMAN"
  };

  client.on("connect", async () => {
    console.log("Connected to MQTT broker");

    const intervalID = setInterval(() => {
      client.publish(topic, JSON.stringify(data))
      console.log("Telemetry published");

    }, 10)

    setTimeout(() => {
      clearInterval(intervalID)
      client.end()
    }, 121000)
  });

  client.on("error", (error) => {
    console.error("MQTT error:", error);
  });

  client.on("end", () => {
    console.log("Disconnected from MQTT broker");
  });

  client.connect(
    // __ENV.MQTT_BROKER_ADDRESS || 
    "mqtt://13.229.227.127:1884"
  );
}

export function secondDevice() {
  const client = new Client();

  const topic = "telemetry/d5:8c:68:5d:5c:2f"

  const data = {
    x: 0.2,
    y: 0.2,
    z: 9.2,
    gx: -0.2,
    gy: 0.2,
    gz: 1.2,
    roll: -1.2,
    pitch: 0.2,
    yaw: 232.2,
    total: 1.0,
    status: "JATUH!"
  };

  client.on("connect", async () => {
    console.log("Connected to MQTT broker");

    const intervalID = setInterval(() => {
      client.publish(topic, JSON.stringify(data))
      console.log("Telemetry published");

    }, 10)

    setTimeout(() => {
      clearInterval(intervalID)
      client.end()
    }, 121000)
  });

  client.on("error", (error) => {
    console.error("MQTT error:", error);
  });

  client.on("end", () => {
    console.log("Disconnected from MQTT broker");
  });

  client.connect(
    // __ENV.MQTT_BROKER_ADDRESS || 
    "mqtt://13.229.227.127:1884"
  );
}

export function thirdDevice() {
  const client = new Client();

  const topic = "telemetry/64:00:01:8b:8e:8e"

  const data = {
    x: 0.3,
    y: 0.3,
    z: 9.3,
    gx: -0.3,
    gy: 0.3,
    gz: 1.3,
    roll: -1.3,
    pitch: 0.3,
    yaw: 232.3,
    total: 1.0,
    status: "AMAN"
  };

  client.on("connect", async () => {
    console.log("Connected to MQTT broker");

    const intervalID = setInterval(() => {
      client.publish(topic, JSON.stringify(data))
      console.log("Telemetry published");

    }, 10)

    setTimeout(() => {
      clearInterval(intervalID)
      client.end()
    }, 121000)
  });

  client.on("error", (error) => {
    console.error("MQTT error:", error);
  });

  client.on("end", () => {
    console.log("Disconnected from MQTT broker");
  });

  client.connect(
    // __ENV.MQTT_BROKER_ADDRESS || 
    "mqtt://13.229.227.127:1884"
  );
}