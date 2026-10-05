async function loadLevel() {

    // Get the information from the URL
    const params = new URLSearchParams(window.location.search);

    // Get the level ID from the URL
    const levelID = params.get("id");

    // Get level data from Google Sheets
    const levelRows = await getSheet("Levels");

    // Get completion data from Google Sheets
    const completions = await getCompletions();

    // Get player information from Google Sheets
    const players = await getPlayers();

    // Turn the spreadsheet rows into level objects
    const levels = levelRows.map(row => {

        return {
            levelID: row[0],
            name: row[1],
            rank: Number(row[2]),
            points: Number(row[3]),
            creator: row[4],
            verifier: row[5],
            thumbnail: row[6]
        };

    });

    // Find the level that matches the ID in the URL
    const level = levels.find(level =>
        level.levelID === levelID
    );

    console.log(level);

    // Put level data onto the page
    document.getElementById("level-name").textContent = level.name;
    document.getElementById("level-creator").textContent = `By ${level.creator}`;
    document.getElementById("level-rank").textContent = level.rank;
    document.getElementById("level-points").textContent = level.points;
    document.getElementById("level-verifier").textContent = level.verifier;
    document.getElementById("level-id").textContent = level.levelID;

    // Display the thumbnail
    document.getElementById("level-thumbnail").src = level.thumbnail;

    // Find everyone who completed this level,
    // except for the verifier
    const victors = completions.filter(completion =>
        completion.levelID === levelID &&
        completion.player !== level.verifier
    );

    // Find the victor list on the page
    const victorList = document.getElementById("victor-list");

    // Check if nobody has completed the level
    if (victors.length === 0) {

        victorList.textContent = "No one has completed this level yet.";

    } else {

        // Create an entry for every victor
        victors.forEach((victor, index) => {

    // Find this victor in the Players sheet
    const player = players.find(player =>
        player.name === victor.player
    );

    // Turn the tag string into an array
    const tags = player && player.tags
        ? player.tags.split(",").map(tag => tag.trim())
        : [];

    // Turn the gradient colors into an array
    const gradientColors = player && player.gradient
        ? player.gradient.split(",").map(color => color.trim())
        : [];

    // Create the tag HTML
    const tagHTML = tags.map((tag, tagIndex) => {

        // Get the three colors belonging to this tag
        const colors = gradientColors.slice(
            tagIndex * 3,
            tagIndex * 3 + 3
        );

        // If no custom colors were specified,
        // generate a color from the tag name
        if (colors.length === 0) {
            colors.push(tagColor(tag));
        }

        // Create the CSS gradient
        const gradient =
            `linear-gradient(to right, ${colors.join(", ")})`;

        // Use the first color for the text
        const textColor = colors[0];

        return `
            <span
                class="player-tag"
                style="
                    color: ${textColor};
                    background:
                        linear-gradient(white, white) padding-box,
                        ${gradient} border-box;
                "
            >
                ${tag}
            </span>
        `;

    }).join("");

    // Create the victor element
    const victorElement = document.createElement("div");

    victorElement.classList.add("victor");

    victorElement.innerHTML = `
        <span class="victor-rank">
            #${index + 1}
        </span>

        <a href="playerdata.html?name=${encodeURIComponent(victor.player)}">
            ${victor.player}
        </a>

        ${tagHTML}
    `;

    victorList.appendChild(victorElement);

});

    // Find the copy button
    const copyButton = document.getElementById("copy-id-button");

    // Copy the level ID when the button is clicked
    copyButton.addEventListener("click", () => {

        navigator.clipboard.writeText(level.levelID);

        copyButton.textContent = "Copied!";

        setTimeout(() => {
            copyButton.textContent = "Copy ID";
        }, 1000);

    });

}

loadLevel();
