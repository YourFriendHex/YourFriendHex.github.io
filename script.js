async function loadLevels() {

    // Get the raw level data from Google Sheets
    const levelRows = await getSheet("Levels");

    // Get player data from Google Sheets
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
            thumbnail: row[6],
            status: row[7]
        };

    });
    
    // Sort levels from highest rank to lowest rank
    levels.sort((a, b) => a.rank - b.rank);

    // Separate levels by their status
    const rankedLevels = levels.filter(level =>
    level.status === "Ranked"
    );

    const upcomingLevels = levels.filter(level =>
    level.status === "Upcoming"
    );

    const impossibleLevels = levels.filter(level =>
    level.status === "Impossible"
    );
    
    // Find the list on the webpage
    const list = document.getElementById("level-list");

    // Create the Ranked Levels section
const rankedTitle = document.createElement("h2");
rankedTitle.textContent = "Ranked Levels";
list.appendChild(rankedTitle);

// Create an entry for every ranked level
rankedLevels.forEach(level => {

    const levelElement = document.createElement("div");

    levelElement.classList.add("level");

    levelElement.innerHTML = `
        <a href="level.html?id=${level.levelID}" class="level-link">

            <img
                src="${level.thumbnail}"
                alt="${level.name} thumbnail"
                class="level-thumbnail"
            >

            <div class="rank">#${level.rank}</div>

            <div class="level-info">
                <div class="level-name">${level.name}</div>
                <div class="creator">by <a href="playerdata.html?name=${encodeURIComponent(level.creator)}" class="creator-link">${level.creator}
                    </a> ${createTagHTML(players.find(player => player.name === level.creator))}
</div>
            </div>

            <div class="points">
                ${level.points} pts
            </div>

            <div class="verifier">

                Verified by

                <a href="playerdata.html?name=${encodeURIComponent(level.verifier)}" class="verifier-link">
                    ${level.verifier}
                </a>    

                ${createTagHTML(players.find(player => player.name === level.verifier))}

            </div>

        </a>
    `;

    list.appendChild(levelElement);

});


// Create the Upcoming Levels section
const upcomingTitle = document.createElement("h2");
upcomingTitle.textContent = "Upcoming Levels";
list.appendChild(upcomingTitle);

// Check if there are any upcoming levels
if (upcomingLevels.length === 0) {

    const message = document.createElement("p");

    message.textContent = "There are currently no upcoming levels.";

    list.appendChild(message);

} else {

    // Create an entry for every upcoming level
    upcomingLevels.forEach(level => {

        const levelElement = document.createElement("div");

        levelElement.classList.add("level");

        levelElement.innerHTML = `
            <a href="level.html?id=${level.levelID}" class="level-link">

                <img
                    src="${level.thumbnail}"
                    alt="${level.name} thumbnail"
                    class="level-thumbnail"
                >

                <div class="level-info">
                    <div class="level-name">${level.name}</div>
                    <div class="creator">by ${level.creator} • To be verified by ${level.verifier}</div>
                </div>

            </a>
        `;

        list.appendChild(levelElement);

    });

}


// Create the Impossible Levels section
const impossibleTitle = document.createElement("h2");
impossibleTitle.textContent = "Impossible Levels";
list.appendChild(impossibleTitle);

// Check if there are any impossible levels
if (impossibleLevels.length === 0) {

    const message = document.createElement("p");

    message.textContent = "There are currently no impossible levels.";

    list.appendChild(message);

} else {

    // Create an entry for every impossible level
    impossibleLevels.forEach(level => {

        const levelElement = document.createElement("div");

        levelElement.classList.add("level");

        levelElement.innerHTML = `
            <a href="level.html?id=${level.levelID}" class="level-link">

                <img
                    src="${level.thumbnail}"
                    alt="${level.name} thumbnail"
                    class="level-thumbnail"
                >

                <div class="level-info">
                    <div class="level-name">${level.name}</div>
                    <div class="creator">by ${level.creator}</div>
                </div>

            </a>
        `;

        list.appendChild(levelElement);

    });

}
}

loadLevels();
