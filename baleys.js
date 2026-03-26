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

async function conectarBot() {

    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" })
    });

    // 🔥 Guardar sesión
    sock.ev.on("creds.update", saveCreds);

    // 🔥 Vinculación con número (PAIR CODE)
    if (!sock.authState.creds.registered) {

        rl.question("📱 Escribe tu número (ej: 18095551234): ", async (numero) => {

            const code = await sock.requestPairingCode(numero);
            console.log(`🔗 Código de vinculación: ${code}`);

        });
    }

    // 🔥 Conexión
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            console.log("✅ Bot conectado correctamente!");
        }

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;

            if (reason !== DisconnectReason.loggedOut) {
                console.log("🔄 Reconectando...");
                conectarBot();
            } else {
                console.log("❌ Sesión cerrada, borra /auth");
            }
        }
    });

    return sock;
}

module.exports = { conectarBot };