const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function preguntar(texto) {
    return new Promise(resolve => rl.question(texto, resolve));
}

async function iniciarBot() {

    const { state, saveCreds } = await useMultiFileAuthState("au>
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);

    // 🔥 PAIRING
    if (!sock.authState.creds.registered) {
        let number = await preguntar("📱 Escribe tu número: ");
        number = number.replace(/[^0-9]/g, "");

        const code = await sock.requestPairingCode(number);

        console.log("✅ Código:", code);
        rl.close();
    }

    sock.ev.on("connection.update", ({ connection }) => {
        if (connection === "open") {
            console.log("🔥 BOT CONECTADO");
        }
    });

}

iniciarBot();

