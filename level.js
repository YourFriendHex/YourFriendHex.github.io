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
            thumbnail: row[6],
            notes: row[8]
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
    document.getElementById("level-thumbnail").src = level.thumbnail;
    document.getElementById("level-notes").textContent = level.notes || "No verifier notes have been added.";

    
    // Find all completion entries for this level
    const levelCompletions = completions.filter(completion =>
        completion.levelID === levelID

    );

    // Display an average rating and update its progress bar
    function displayRating(ratingName, propertyName) {

        // Get ratings, ignoring blank cells and invalid values
        const ratings = levelCompletions
            .map(completion => completion[propertyName])
            .filter(value =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== "" &&
                Number.isFinite(Number(value)) &&
                Number(value) >= 0 &&
                Number(value) <= 10
            )
            .map(Number);

        // Find the HTML elements for this rating
        const valueElement = document.getElementById(
            `${ratingName}-value`
        );

        const barElement = document.getElementById(
            `${ratingName}-bar`
        );

        const fillElement = document.getElementById(
            `${ratingName}-fill`
        );

        // If nobody has rated this category yet
        if (ratings.length === 0) {

            valueElement.textContent =
            `${ratingName.charAt(0).toUpperCase() + ratingName.slice(1)}: No ratings yet`;
            
            barElement.setAttribute("aria-valuenow", "0");
            fillElement.style.width = "0%";

            return;
        }

        // Calculate the average
        const total = ratings.reduce((sum, rating) =>
            sum + rating, 0
        );

        const average = total / ratings.length;

        // Convert the average out of 10 into a percentage
        
const percentage = average * 10;

valueElement.textContent =
    `${ratingName.charAt(0).toUpperCase() + ratingName.slice(1)}: ${average.toFixed(1)} / 10`;

fillElement.style.width = `${percentage}%`;
barElement.setAttribute("aria-valuenow", average.toFixed(1));

// Change the bar's color based on the average rating

    if (ratingName === "difficulty") {
        // Difficulty: green at 0, yellow at 5, red at 10
        if (average <= 5) {
            const amount = average / 5;
            const red = Math.round(76 + (255 - 76) * amount);
            const green = Math.round(175 + (255 - 175) * amount);

            fillElement.style.backgroundColor =
                `rgb(${red}, ${green}, 76)`;
        } else {
            const amount = (average - 5) / 5;
            const green = Math.round(255 * (1 - amount));

            fillElement.style.backgroundColor =
                `rgb(255, ${green}, 0)`;
        }
    } else if (ratingName === "enjoyment") {
        // Enjoyment: red at 0, yellow at 5, green at 10
        if (average <= 5) {
            const amount = average / 5;
            const green = Math.round(255 * amount);

            fillElement.style.backgroundColor =
                `rgb(255, ${green}, 0)`;
        } else {
            const amount = (average - 5) / 5;
            const red = Math.round(255 * (1 - amount));
            const blueGreen = Math.round(175 * amount);

            fillElement.style.backgroundColor =
                `rgb(${red}, 255, ${blueGreen})`;
            }    
        }
    }


    // Display both community ratings
    displayRating("difficulty", "difficulty");
    displayRating("enjoyment", "enjoyment");


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

        // Create the HTML for this player's tags
        const tagHTML = createTagHTML(player);

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

        // Add the victor to the page
        victorList.appendChild(victorElement);

    });

}

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
