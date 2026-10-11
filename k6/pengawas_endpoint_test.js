import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 100 },
    // { duration: "1m", target: 200 },
    { duration: "1m", target: 300 },
    // { duration: "1m", target: 400 },
    // { duration: "3m", target: 500 },
    // { duration: "1m", target: 400 },
    { duration: "1m", target: 300 },
    // { duration: "1m", target: 200 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 0 },
  ],
};

export default function () {
  let res = http.get("https://rikub.vpspenelitian.com/api/v1/pengawas");
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}
