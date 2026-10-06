async function loadPlayer() {

    // Get the player's name from the URL
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get("name");

    // Get all of our data
    const players = await getPlayers();
    const completions = await getCompletions();
    const levelRows = await getSheet("Levels");

    // Turn the level rows into level objects
    const levels = levelRows.map(row => {

        return {
            levelID: row[0],
            name: row[1],
            rank: Number(row[2]),
            points: Number(row[3]),
            creator: row[4],
            verifier: row[5],
            thumbnail: row[6],
            status: row[7]
        };

    });

    // Find this player
    const player = players.find(player =>
        player.name === playerName
    );

    // Create the HTML for this player's tags
    const tagHTML = createTagHTML(player);

    // Find the tag container
    const tagContainer = document.getElementById("player-tags");

    // Display the player's tags
    tagContainer.innerHTML = tagHTML;

    // Find this player's completed levels
    const playerCompletions = completions.filter(completion =>
        completion.player === playerName
    );

   const completedLevels = playerCompletions.map(completion => {

    return levels.find(level =>
        level.levelID === completion.levelID
    );

}).filter(level =>
    level !== undefined &&
    level.verifier !== playerName
);

    // Find ranked levels that this player verified
    const verifiedLevels = levels.filter(level =>
    level.verifier === playerName &&
    level.status === "Ranked"
    );
    

    // Calculate the player's total points
    let totalPoints = 0;

    completedLevels.forEach(level => {
        totalPoints += level.points;
    });

    // Display the player's name
    document.getElementById("player-name").textContent = player.name;

    // Display their total points
    document.getElementById("player-points").textContent =
        `${totalPoints} points`;

    // Find the completed levels section
    const list = document.getElementById("completed-levels");

    // Check if the player has no completed levels
    if (completedLevels.length === 0) {

        list.textContent =
            "This player has not completed any levels yet.";

    }

   // Create an entry for every completed level
   completedLevels.forEach(level => {

    // Find this completion
    const completion = playerCompletions.find(completion =>
        completion.levelID === level.levelID
    );

    // Decide what to display for the completion
    let completionButton;

    if (completion.proof) {

        completionButton = `
            <a
                href="${completion.proof}"
                target="_blank"
                class="completion-button"
            >
                Completion
            </a>
        `;

    } else {

        completionButton = `
            <span class="completion-button live-completion">
                Live Completion
            </span>
        `;

    }

    // Create the level element
    const levelElement = document.createElement("div");

    levelElement.classList.add("completed-level");

    // Create the HTML for the level
    levelElement.innerHTML = `
        <a href="level.html?id=${level.levelID}" class="completed-level-link">

            <img
                src="${level.thumbnail}"
                alt="${level.name} thumbnail"
                class="level-thumbnail"
            >

            <div class="rank">
                #${level.rank}
            </div>

            <div class="level-info">
                <div class="level-name">
                    ${level.name}
                </div>
            </div>

            <div class="points">
                ${level.points} pts
            </div>

        </a>

        ${completionButton}
    `;

    list.appendChild(levelElement);

});

    // Find the verified levels section
const verifiedList = document.getElementById("verified-levels");

// Check if the player has verified any levels
if (verifiedLevels.length === 0) {

    verifiedList.textContent =
        "This player has not verified any levels yet.";

} else {

    // Create an entry for every verified level
    verifiedLevels.forEach(level => {

        const levelElement = document.createElement("div");

        levelElement.classList.add("level");

        levelElement.innerHTML = `
            <a href="level.html?id=${level.levelID}" class="level-link">

                <img
                    src="${level.thumbnail}"
                    alt="${level.name} thumbnail"
                    class="level-thumbnail"
                >

                <div class="rank">
                    #${level.rank}
                </div>

                <div class="level-info">
                    <div class="level-name">
                        ${level.name}
                    </div>
                </div>

                <div class="points">
                ${level.points} pts
                </div>

            </a>
        `;

        verifiedList.appendChild(levelElement);

    });

}
    
}

loadPlayer();
