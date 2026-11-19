
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
    youtube: "./emojis/gj_ytIcon_001-uhd.png"
};

function scanForEmojis(root = document.body) {

    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT
    );

    const textNodes = [];

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {

        const regex = /:([a-zA-Z0-9_]+):/g;
        const text = node.nodeValue;
        const fragment = document.createDocumentFragment();

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {

            const imagePath = customEmojis[match[1]];

            if (!imagePath) continue;

            fragment.appendChild(
                document.createTextNode(text.slice(lastIndex, match.index))
            );

            const image = document.createElement("img");
            image.src = imagePath;
            image.alt = match[0];
            image.className = "custom-emoji";

            fragment.appendChild(image);

            lastIndex = regex.lastIndex;
        }

        if (lastIndex === 0) return;

        fragment.appendChild(
            document.createTextNode(text.slice(lastIndex))
        );

        node.replaceWith(fragment);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    scanForEmojis();
});
