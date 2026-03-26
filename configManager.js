const fs = require("fs");

const CONFIG_FILE = "./config.json";

function getConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_FILE));
}

function saveConfig(newConfig) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
}

module.exports = { getConfig, saveConfig };