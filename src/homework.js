const { homework: config } = require("../config.json");

const startTime = new Date().getTime();
const settings = config.settings;

module.exports = {
  setPresence(rpc) {
    return rpc.setActivity({
      details: settings.details,
      state: settings.state,
      startTimestamp: startTime,
      largeImageKey: settings.large_image,
      largeImageText: settings.large_text,
      smallImageKey: settings.small_image,
      smallImageText: settings.small_text,
      instance: false
    }).catch((error) => console.log(error));
  }
}