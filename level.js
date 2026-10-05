async function loadLevel() {

    // Get the information from the URL
    const params = new URLSearchParams(window.location.search);

    // Get the level ID from the URL
    const levelID = params.get("id");

    // Get list of levels and data from Google Sheets
    const levelRows = await getSheet("Levels");

    // Find everyone who completed this level except for the verifier
    const victors = completions.filter(completion =>
    completion.levelID === levelID &&
    completion.player !== level.verifier
    );

    const levels = levelRows.map(row => {

    return {
        levelID: row[0],
        name: row[1],
        rank: Number(row[2]),
        points: Number(row[3]),
        creator: row[4],
        verifier: row[5]
    };

});

    // Find the level that matches the ID in the URL
    const level = levels.find(level => level.levelID === levelID);

    // Find everyone who completed this level (Victors)
    const victors = completions.filter(completion =>
    completion.levelID === levelID
    );

    console.log(level);

    // Put level data onto the page
    document.getElementById("level-name").textContent = level.name;
    document.getElementById("level-creator").textContent = `By ${level.creator}`;
    document.getElementById("level-rank").textContent = level.rank;
    document.getElementById("level-points").textContent = level.points;
    document.getElementById("level-verifier").textContent = level.verifier;
    document.getElementById("level-id").textContent = level.levelID;

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

    // Find the victor list on the page
    const victorList = document.getElementById("victor-list");

    // Check if nobody has completed the level
    if (victors.length === 0) {

    victorList.textContent = "No one has completed this level yet.";

    } else {

    // Create an entry for every victor
    victors.forEach(victor => {

        const victorElement = document.createElement("div");

        victorElement.classList.add("victor");

        victorElement.innerHTML = `
            <a href="playerdata.html?name=${encodeURIComponent(victor.player)}">
                ${victor.player}
            </a>
        `;

        victorList.appendChild(victorElement);

    });

}
}

loadLevel();
