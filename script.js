async function loadLevels() {

    // Get the raw level data from Google Sheets
    const levelRows = await getSheet("Levels");

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
    
    // Find the list on the webpage
    const list = document.getElementById("level-list");

    // Create an entry for every level
    levels.forEach(level => {

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
                    <div class="creator">by ${level.creator}</div>
                </div>

                <div class="points">
                    ${level.points} pts
                </div>

                <div class="verifier">
                    Verified by ${level.verifier}
                </div>

            </a>
        `;

        list.appendChild(levelElement);
    });
}

loadLevels();
