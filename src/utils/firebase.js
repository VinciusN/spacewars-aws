import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

export async function saveScore(nickname, score) {
    if (!nickname || score <= 0) return;

    try {
        await addDoc(collection(db, COLLECTION), {
            nickname,
            score,
            timestamp: serverTimestamp(),
        });

    } catch (error) {
        console.error("Erro ao salvar score: ", error);
    }
}

export async function isNicknameTaken(nickname) {
    try {
        const q = query(
            collection(db, COLLECTION),
            where("nickname", "==", nickname),
            limit(1)
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;

    } catch (error) {
        console.error("Erro ao verificar nickname: ", error);
        return false;
    }
}

export async function getTopScores(period) {
    const startDate = getPeriodStart(period);
    const startTimestamp = Timestamp.fromDate(startDate);

    try {
        const q = query(
            collection(db, COLLECTION),
            where("timestamp", ">=", startTimestamp),
            orderBy("timestamp", "desc"),
            limit(200)
        );

        const snapshot = await getDocs(q);

        const bestByNickname = {};
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const existing = bestByNickname[data.nickname];

            if (!existing || data.score > existing.score) {
                bestByNickname[data.nickname] = {
                    nickname: data.nickname,
                    score: data.score,
                };
            }
        });

        return Object.values(bestByNickname)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

    } catch (error) {
        console.error("Erro ao buscar scores: ", error);
        return [];
    }
}