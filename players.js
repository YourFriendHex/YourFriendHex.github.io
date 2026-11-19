async function loadPlayers() {

    // Get the player scores
    const players = await getPlayerScores();

    // Find the player list and tabs
    const list = document.getElementById("player-list");
    const listTab = document.getElementById("list-points-tab");
    const creatorTab = document.getElementById("creator-points-tab");

    // Display the leaderboard
    function displayLeaderboard(type) {

        // Sort players by the selected score
        const sortedPlayers = [...players].sort((a, b) => {

            if (type === "creator") {
                return b.creatorPoints - a.creatorPoints;
            }

            return b.points - a.points;

        });

        // Update which tab is active
        listTab.classList.toggle("active", type === "list");
        creatorTab.classList.toggle("active", type === "creator");

        // Clear the previous leaderboard
        list.innerHTML = "";

        // Create an entry for every player
        sortedPlayers.forEach((player, index) => {

            const tagHTML = createTagHTML(player);

            const playerElement = document.createElement("div");
            playerElement.classList.add("player");

            // Choose which score to display
            let scoreHTML;

            if (type === "creator") {

                scoreHTML = `
                    <img
                        src="emojis/GJ_hammerIcon_001-uhd.png"
                        class="custom-emoji"
                        alt=""
                    >
                    ${player.creatorPoints} pts
                `;

            } else {

                scoreHTML = `
                <img
                        src="emojis/GJ_bigStar_001-uhd.png"
                        class="custom-emoji"
                        alt=""
                    >
                    ${player.points} pts`;

            }

            playerElement.innerHTML = `
                <a
                    href="playerdata.html?name=${encodeURIComponent(player.name)}"
                    class="player-link"
                >

                    <div class="player-rank">
                        #${index + 1}
                    </div>

                    <div class="player-name-container">

                        ${player.avatar ? `
                            <img
                                src="${player.avatar}"
                                class="player-avatar"
                                alt=""
                            >
                        ` : ""}

                        <div class="player-name">
                            ${player.name}
                            ${tagHTML}
                        </div>

                    </div>

                    <div class="player-points">
                        ${scoreHTML}
                    </div>

                </a>
            `;

            list.appendChild(playerElement);

        });

    }

    // Switch between leaderboards
    listTab.addEventListener("click", () => {
        displayLeaderboard("list");
    });

    creatorTab.addEventListener("click", () => {
        displayLeaderboard("creator");
    });

    // Show List Points by default
    displayLeaderboard("list");
}

loadPlayers();
