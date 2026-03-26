const config = require("../config.js");

if (cmd === config.prefix + "menu") {

    const menu = `╔═══〔 ${config.botName} 〕═══╗
║ hola ${user} soy ${config.botName} tu asistente persona en la palma de tu mano
║    
║ 👑 Owner: ${config.ownerName}
║ ⚡ Prefijo: ${config.prefix}
║
╠═══〔 📥 DESCARGAS 〕═══╣
║ ├ ${config.prefix}yt
║ ├ ${config.prefix}tiktok
║ └ ${config.prefix}ig
║
╠═══〔 🎨 STICKERS 〕═══╣
║ └ ${config.prefix}sticker
║
╠═══〔 ⚡ GENERAL 〕═══╣
║ ├ ${config.prefix}ping
║ ├ ${config.prefix}info
║ └ ${config.prefix}owner
║
╠═══〔 🎮 DIVERSIÓN 〕═══╣
║ ├ ${config.prefix}dado
║ ├ ${config.prefix}frase
║ └ ${config.prefix}numero
║
╚═══════════════════╝`;

    // 🔥 enviar con imagen o video
    if (config.menuMedia.type === "image") {
        await sock.sendMessage(from, {
            image: { url: config.menuMedia.url },
            caption: menu
        });
    } else if (config.menuMedia.type === "video") {
        await sock.sendMessage(from, {
            video: { url: config.menuMedia.url },
            caption: menu
        });
    }

    return null;
}