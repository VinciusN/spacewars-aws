import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ip_publico = '56.125.189.156';

const firebaseConfig = JSON.parse(atob("ew0KICAgICJhcGlLZXkiOiAiQUl6YVN5RGdGeTk1eFlKZ2tHMVdlQlN1a0M0eGF0UUwzaDBheEQ0IiwNCiAgICAiYXV0aERvbWFpbiI6ICJzcGFjZS13YXJzLTYxZDI2LmZpcmViYXNlYXBwLmNvbSIsDQogICAgInByb2plY3RJZCI6ICJzcGFjZS13YXJzLTYxZDI2IiwNCiAgICAic3RvcmFnZUJ1Y2tldCI6ICJzcGFjZS13YXJzLTYxZDI2LmZpcmViYXNlc3RvcmFnZS5hcHAiLA0KICAgICJtZXNzYWdpbmdTZW5kZXJJZCI6ICI2MzI5ODE0NzI3ODUiLA0KICAgICJhcHBJZCI6ICIxOjYzMjk4MTQ3Mjc4NTp3ZWI6MzA1ZWRiZjU5YjZhN2IzYzlmNTNiMCINCn0="));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION = "scores";

function getPeriodStart(period) {
    const now = new Date();
    const start = new Date(now);

    if (period === "daily") {
        start.setHours(0, 0, 0, 0);

    } else if (period === "weekly") {
        const dayOfWeek = now.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start.setDate(now.getDate() - diff);
        start.setHours(0, 0, 0, 0);

    } else if (period === "monthly") {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
    }

    return start;
}

export async function saveScore(
    nickname,
    score
) {

    await fetch(
        `http://${ip_publico}:5000/save-score`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nickname,
                score
            })
        }
    );

    return true;
}

export async function isNicknameTaken(
    nickname
) {

    const response =
        await fetch(
            `http://${ip_publico}:5000/nickname/${nickname}`
        );

    const data =
        await response.json();

    return data.exists;
}

export async function getTopScores() {

    const response =
        await fetch(
            `http://${ip_publico}:5000/ranking`
        );

    return await response.json();
}

