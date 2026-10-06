// Load all levels from Google Sheets
async function getSheet(sheetName) {

    // The ID of the Google spreadsheet
    const spreadsheetID = "1gg5hyZiUSGLVQuIhOqh3FOI9iR0oO2zdQwefgqPkvaE";

    // Ask Google Sheets for the Levels sheet
    const url =
        `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    // Get information from the spreadsheet
    const response = await fetch(url);

    // Turn the response into text
    const data = await response.text();

    // Split the spreadsheet into rows
    const rows = data.split("\n");

    // Turn the rows into level objects
  const rowsWithoutHeader = rows.slice(1);

  const sheetData = rowsWithoutHeader.map(row => {

    const columns = [];
    let currentValue = "";
    let insideQuotes = false;

    // Look at every character in the row
    for (let i = 0; i < row.length; i++) {

        const character = row[i];

        // Toggle whether we are inside a quoted cell
        if (character === '"') {
            insideQuotes = !insideQuotes;
        }

        // A comma outside quotes means we found the end of a column
        else if (character === "," && !insideQuotes) {
            columns.push(currentValue);
            currentValue = "";
        }

        // Otherwise, add the character to the current value
        else {
            currentValue += character;
        }
    }

    // Add the final column
    columns.push(currentValue);

    return columns;

});

return sheetData;

    // Give the levels back to whatever called this function
    return levels;
}

// Get Players data from sheets
async function getPlayers() {

    // Get the raw data from the Players sheet
    const rows = await getSheet("Players");

    // Turn each row into a player object
    const players = rows.map(row => {

        return {
            name: row[0],
            tags: row[1],
            gradient: row[2]
        };

    });

    return players;
}

// Get Comepletions data from sheets
async function getCompletions() {

    // Get the raw data from the Completions sheet
    const rows = await getSheet("Completions");

    // Turn each row into a completion object
    const completions = rows.map(row => {

        return {
            player: row[0],
            levelID: row[1],
            proof: row[2]
            
        };

    });

    return completions;
}

//  
async function getPlayerScores() {

    // Get all of the data
    const levels = await getSheet("Levels");
    const players = await getPlayers();
    const completions = await getCompletions();

    // Convert the level rows into useful objects
    const levelData = levels.map(row => {

        return {
            levelID: row[0],
            points: Number(row[3])
        };

    });

    // Calculate each player's score
    const playerScores = players.map(player => {

        // Find this player's completions
        const playerCompletions = completions.filter(completion =>
            completion.player === player.name
        );

        // Start their score at zero
        let points = 0;

        // Look at every level they completed
        playerCompletions.forEach(completion => {

            // Find the level they completed
            const level = levelData.find(level =>
                level.levelID === completion.levelID
            );

            // Add that level's points
            if (level) {
                points += level.points;
            }

        });

        return {
            name: player.name,
            points: points,
            gradient: player.gradient,
            tags: player.tags
        };

    });

    return playerScores;
}

// Get colors for player tags
function tagColor(tag) {

    function tagGradient(colors) {

    // Turn the color string into an array
    const colorList = colors
        .split(",")
        .map(color => color.trim())
        .filter(color => color !== "");

    // Create a CSS gradient from the colors
    return `linear-gradient(to right, ${colorList.join(", ")})`;
    }
    
    let hash = 0;

    for (let i = 0; i < tag.length; i++) {

        hash = tag.charCodeAt(i) + ((hash << 5) - hash);

    }

    const color = Math.abs(hash).toString(16).substring(0, 6);

    return "#" + color.padStart(6, "0");
}

function createTagHTML(player) {

    // If the player has no tags, return nothing
    if (!player || !player.tags) {
        return "";
    }

    // Turn the tag string into an array
    const tags = player.tags
        .split(",")
        .map(tag => tag.trim());

    // Turn the gradient string into an array
    const gradientColors = player.gradient
        ? player.gradient.split(",").map(color => color.trim())
        : [];

    // Create the HTML for every tag
    const tagHTML = tags.map((tag, index) => {

        // Get the three colors belonging to this tag
        const colors = gradientColors.slice(
            index * 3,
            index * 3 + 3
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

    return tagHTML;
}
