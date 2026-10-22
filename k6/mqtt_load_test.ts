
import { Client } from "k6/x/mqtt";

export const options = {
  scenarios: {
    first_device: {
      executor: 'constant-vus',
      exec: 'firstDevice',
      vus: 1,
      duration: '30s'
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
    },
    fourth_device: {
      executor: 'constant-vus',
      exec: 'fourthDevice',
      vus: 1,
      duration: '120s'
    },
    fifth_device: {
      executor: 'constant-vus',
      exec: 'fifthDevice',
      vus: 1,
      duration: '120s'
    },
    sixth_device: {
      executor: 'constant-vus',
      exec: 'sixthDevice',
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

  const topic = "telemetry/90:70:69:12:e6:d4";

  const startTime = Date.now();
  let intervalID: number;
  let isClosing = false;

  const roundTo = (value: number, decimals: number) => {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  };

  // Generate small, natural variations in sensor readings.
  const randomBetween = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const generateTelemetry = () => {
    const elapsed = Date.now() - startTime;

    // Simulate a short impact every 10 seconds.
    // The impact lasts 500 ms.
    const impactCycle = elapsed % 10000;
    const isImpact = impactCycle < 500 && elapsed >= 5000;

    let x, y, z;
    let gx, gy, gz;

    if (isImpact) {
      // Simulate a sudden movement / fall impact.
      x = randomBetween(17, 19);
      y = randomBetween(4, 6);
      z = randomBetween(11, 13);

      gx = randomBetween(100, 180);
      gy = randomBetween(-150, -80);
      gz = randomBetween(50, 100);
    } else {
      // Simulate a stationary worker wearing the device.
      x = randomBetween(-0.3, 0.3);
      y = randomBetween(-0.3, 0.3);
      z = randomBetween(9.0, 9.3);

      gx = randomBetween(-1.5, 1.5);
      gy = randomBetween(-1.5, 1.5);
      gz = randomBetween(-1.5, 1.5);
    }

    // Same magnitude calculation used for the mock acceleration.
    const totalAcc = Math.sqrt(x * x + y * y + z * z);

    // Match the ESP32 status threshold.
    const status = totalAcc > 20.0 ? "JATUH" : "AMAN";

    // Mock orientation values.
    const roll = isImpact
      ? randomBetween(35, 70)
      : randomBetween(-2, 2);

    const pitch = isImpact
      ? randomBetween(-60, -25)
      : randomBetween(-2, 2);

    const yaw = (232 + elapsed / 1000 * 2 + randomBetween(-1, 1)) % 360;

    return {
      time: elapsed,
      x: roundTo(x, 2),
      y: roundTo(y, 2),
      z: roundTo(z, 2),
      gx: roundTo(gx, 2),
      gy: roundTo(gy, 2),
      gz: roundTo(gz, 2),
      total: roundTo(totalAcc, 2),
      roll: roundTo(roll, 1),
      pitch: roundTo(pitch, 1),
      yaw: roundTo(yaw, 1),
      status,
    };

  };

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    console.log(`Publishing mock telemetry to ${topic}`);

    intervalID = setInterval(() => {
      const data = generateTelemetry();
      const payload = JSON.stringify(data);

      client.publish(topic, payload, (error) => {
        if (error) {
          console.error("Failed to publish telemetry:", error);
        }
      });

      // Uncomment to inspect each payload.
      // console.log(payload);
    }, 100);

    // Stop after 30 seconds, as in the original test.
    setTimeout(() => {
      if (intervalID) {
        clearInterval(intervalID);
      }

      isClosing = true;
      client.end();
    }, 30000);

  });

  client.on("error", (error) => {
    console.error("MQTT error:", error);

    if (intervalID) {
      clearInterval(intervalID);
    }

  });

  client.on("end", () => {
    console.log("Disconnected from MQTT broker");
  });

  client.connect("mqtt://13.229.227.127:1884");
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
    }, 120000)
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
    }, 120000)
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

export function fourthDevice() {
  const client = new Client();

  const topic = "telemetry/9c:be:eb:a9:f1:d0"

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
    }, 120000)
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

export function fifthDevice() {
  const client = new Client();

  const topic = "telemetry/68:fe:71:0c:b4:48"

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
    }, 120000)
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

export function sixthDevice() {
  const client = new Client();

  const topic = "telemetry/68:ee:8f:4d:8c:bc"

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
    }, 120000)
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