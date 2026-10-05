async function loadPlayers() {

    // Get the player scores
    const players = await getPlayerScores();

    // Sort players from highest score to lowest score
    players.sort((a, b) => b.points - a.points);

    // Find the player list on the page
    const list = document.getElementById("player-list");

    // Create an entry for every player
    players.forEach((player, index) => {

        // Create the HTML for this player's tags
        const tagHTML = createTagHTML(player);

        // Create the player element
        const playerElement = document.createElement("div");

        playerElement.classList.add("player");

        playerElement.innerHTML = `
            <a href="playerdata.html?name=${encodeURIComponent(player.name)}" class="player-link">

                <div class="player-rank">
                    #${index + 1}
                </div>

                <div class="player-name">
                    ${player.name}
                    ${tagHTML}
                </div>

                <div class="player-points">
                    ${player.points} pts
                </div>

            </a>
        `;

        list.appendChild(playerElement);

    });
}

loadPlayers();
