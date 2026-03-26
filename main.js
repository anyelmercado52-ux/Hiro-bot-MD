const {
    default: makeWASocket,
    useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const { getConfig, saveConfig } = require("../utils/configManager");

async function iniciarBot() {

    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection }) => {
        if (connection === "open") {
            console.log("🔥 BOT ONLINE");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;

        const config = getConfig();

        const texto =
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            "";

        const from = m.key.remoteJid;

        if (!texto.startsWith(config.prefix)) return;

        const args = texto.split(" ");
        const cmd = args[0];

        await comandos(cmd, args, sock, from, m, config);
    });
}

async function comandos(cmd, args, sock, from, m, config) {

    // 🔥 MENÚ NIVEL DIOS
    if (cmd === config.prefix + "menu") {

        const menu = `╔═══════〔 🤖 ${config.botName} 〕═══════╗
║ 👑 Owner: ${config.ownerName}
║ ⚡ Prefijo: ${config.prefix}
║ 🌐 Estado: ONLINE 24/7
║ 🔥 Modo: DIOS x2
╠══════════════════════════════╣
║ 📥 *DESCARGAS*
║ ├ ${config.prefix}yt
║ ├ ${config.prefix}tiktok
║ ├ ${config.prefix}ig
║ └ ${config.prefix}play
╠══════════════════════════════╣
║ 🎨 *STICKERS*
║ ├ ${config.prefix}sticker
║ ├ ${config.prefix}stickergif
║ └ ${config.prefix}wm
╠══════════════════════════════╣
║ 🤖 *IA*
║ ├ ${config.prefix}ia
║ ├ ${config.prefix}chat
║ └ ${config.prefix}code
╠══════════════════════════════╣
║ 👥 *GRUPOS*
║ ├ ${config.prefix}tagall
║ ├ ${config.prefix}admins
║ ├ ${config.prefix}link
║ └ ${config.prefix}grupo
╠══════════════════════════════╣
║ 🎮 *DIVERSIÓN*
║ ├ ${config.prefix}dado
║ ├ ${config.prefix}frase
║ ├ ${config.prefix}numero
║ └ ${config.prefix}ship
╠══════════════════════════════╣
║ ⚙️ *CONFIG*
║ ├ ${config.prefix}setname
║ ├ ${config.prefix}setprefix
║ └ ${config.prefix}setmenu
╠══════════════════════════════╣
║ 🛠️ *UTILIDADES*
║ ├ ${config.prefix}ping
║ ├ ${config.prefix}hora
║ └ ${config.prefix}fecha
╚══════════════════════════════╝`;

        if (config.menuType === "image") {
            await sock.sendMessage(from, {
                image: { url: config.menuMedia },
                caption: menu
            });
        } else {
            await sock.sendMessage(from, {
                video: { url: config.menuMedia },
                caption: menu
            });
        }

        return;
    }

    // 🏓 PING
    if (cmd === config.prefix + "ping") {
        return sock.sendMessage(from, { text: "🏓 Pong DIOS" });
    }

    // ⏰ HORA
    if (cmd === config.prefix + "hora") {
        return sock.sendMessage(from, {
            text: "⏰ " + new Date().toLocaleTimeString()
        });
    }

    // 📅 FECHA
    if (cmd === config.prefix + "fecha") {
        return sock.sendMessage(from, {
            text: "📅 " + new Date().toLocaleDateString()
        });
    }

    // 🎲 DADO
    if (cmd === config.prefix + "dado") {
        const num = Math.floor(Math.random() * 6) + 1;
        return sock.sendMessage(from, { text: "🎲 Resultado: " + num });
    }

    // 😂 FRASE
    if (cmd === config.prefix + "frase") {
        const frases = [
            "🔥 Nunca te rindas",
            "😎 Eres pro",
            "🚀 Sigue aprendiendo"
        ];
        return sock.sendMessage(from, {
            text: frases[Math.floor(Math.random() * frases.length)]
        });
    }

    // 🔢 NÚMERO
    if (cmd === config.prefix + "numero") {
        const num = Math.floor(Math.random() * 100);
        return sock.sendMessage(from, {
            text: "🔢 Número: " + num
        });
    }

    // 🎨 STICKER
    if (cmd === config.prefix + "sticker") {
        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return sock.sendMessage(from, {
                text: "⚠️ Responde a una imagen"
            });
        }

        const media = await sock.downloadMediaMessage(m);
        await sock.sendMessage(from, { sticker: media });
    }

    // ⚙️ CAMBIAR NOMBRE
    if (cmd === config.prefix + "setname") {
        if (from !== config.numeroOwner) return;

        config.botName = args.slice(1).join(" ");
        saveConfig(config);

        return sock.sendMessage(from, {
            text: "✅ Nombre actualizado"
        });
    }

    // ⚙️ CAMBIAR PREFIJO
    if (cmd === config.prefix + "setprefix") {
        if (from !== config.numeroOwner) return;

        config.prefix = args[1];
        saveConfig(config);

        return sock.sendMessage(from, {
            text: "✅ Prefijo cambiado"
        });
    }

    // ⚙️ CAMBIAR MEDIA
    if (cmd === config.prefix + "setmenu") {
        if (from !== config.numeroOwner) return;

        config.menuMedia = args[1];
        saveConfig(config);

        return sock.sendMessage(from, {
            text: "✅ Media del menú actualizada"
        });
    }
}

module.exports = iniciarBot;