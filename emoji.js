// Emoji Dictionary

const customEmojis = {
    creator_points: "./emojis/GJ_hammerIcon_001-uhd.png",
    ball: "./emojis/gj_ballBtn_off_001-uhd.png",
    ufo: "./emojis/gj_birdBtn_off_001-uhd.png",
    wave: "./emojis/gj_dartBtn_off_001-uhd.png",
    cube: "./emojis/gj_iconBtn_off_001-uhd.png",
    robot: "./emojis/gj_robotBtn_off_001-uhd.png",
    ship: "./emojis/gj_shipBtn_off_001-uhd.png",
    spider: "./emojis/gj_spiderBtn_off_001-uhd.png",
    swing: "./emojis/gj_swingBtn_off_001-uhd.png",
    discord: "./emojis/gj_discordIcon_001-uhd.png",
    youtube: "./emojis/gj_ytIcon_001-uhd.png",
};


function parseCustomEmojis(html) {
    return html.replace(/:([a-zA-Z0-9_]+):/g, (match, emojiName) => {
        const imagePath = customEmojis[emojiName];

        if (!imagePath) {
            return match;
        }

        return `<img
            src="${imagePath}"
            alt=":${emojiName}:"
            title=":${emojiName}:"
            class="custom-emoji"
        >`;
    });
}


