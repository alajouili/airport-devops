import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20},
        { duration: '1m', target: 20},
        { duration: '30s', target: 0},
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
    },
};
const BASE = __ENV.BASE_URL;

export default function () {
    const res = http.get(`${BASE}/api/vols`);
    check(res, { 'status 200': (r) => r.status === 200 });
    sleep(1);
}
