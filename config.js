module.exports = {
    botName: "🤖 CHUYPILUPY BOT",
    ownerName: "Chuypilupy",
    prefix: "!",
    numeroOwner: "1234567890@s.whatsapp.net",

    // Imagen o video del menú
    menuMedia: {
        type: "image", // "image" o "video"
        url: "https://i.imgur.com/your-image.jpg"
        // puedes poner un video mp4 también
    }
};

if (cmd === "!setname") {
    if (from !== config.numeroOwner) return "❌ Solo el owner";

    const nuevo = args.slice(1).join(" ");
    if (!nuevo) return "⚠️ Escribe un nombre";

    config.botName = nuevo;

    return "✅ Nombre cambiado a: " + nuevo;
}