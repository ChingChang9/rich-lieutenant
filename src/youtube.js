const applescript = require("applescript");
const getArtistTitle = require("get-artist-title");

const applescriptInfo = `set youtubeData to "validPayload"
    tell application "Google Chrome"
	repeat with t in tabs of windows
		tell t
			if URL starts with "https://www.youtube.com/watch?v=" then
				set youtubeData to execute JavaScript "var text = 'textContent' in document.body ? 'textContent' : 'innerText';
var yttitle = document.querySelector('#container > h1')[text]
var ytpElapsed = document.querySelector('.ytp-time-current')[text]
var ytpState = document.querySelector('.ytp-play-button').ariaLabel
validPayload = [ yttitle, ytpElapsed, ytpState ]"
				exit repeat
			end if
		end tell
	end repeat
end tell
return youtubeData`;

module.exports = {
  setPresence(rpc) {
    applescript.execString(applescriptInfo, async (error, result) => {
      let [ artist, songName ] = await getArtistTitle(result[0], {
        defaultArtist: "Unknown Artist"
      });
      songName = songName.replace(/[[(].*?[)\]]/g, "").trim();

      const timestamp = getTimestamp(result[1]);
      const startTime = new Date().getTime() - Math.floor(timestamp * 1000);

      const playerState = result[2].split(" ")[0];

      return rpc.setActivity({
        details: songName,
        state: `by ${ artist }`,
        startTimestamp: playerState === "Pause" ? startTime : undefined,
        largeImageKey: "youtube",
        largeImageText: "Youtube",
        smallImageKey: playerState === "Pause" ? "play" : "pause",
        smallImageText: playerState === "Pause" ? "Playing" : "Paused",
        instance: false
      }).catch((error) => console.log(error));
    });
  }
};

function getTimestamp(elapsed) {
  if (elapsed.split(":").length === 1) {
    return elapsed;
  } else if (elapsed.split(":").length === 2) {
    return parseInt(elapsed.split(":")[0] * 60) + parseInt(elapsed.split(":")[1]);
  } else if (elapsed.split(":").length === 3) {
    return parseInt(elapsed.split(":")[0] * 3600) + parseInt(elapsed.split(":")[1] * 60) + parseInt(elapsed.split(":")[2]);
  }
}