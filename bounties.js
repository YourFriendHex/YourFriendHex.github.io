
async function loadBounties() {
    const collabList = document.getElementById("collab-list");
    const verificationList = document.getElementById("verification-list");
    const unrankedList = document.getElementById("unranked-list");

    try {
        const bounties = await getBounties();

        // Put each bounty into the section matching its type.
        const sections = {
            "collab": collabList,
            "verification": verificationList,
            "unranked": unrankedList
        };

        // Clear the sections before adding cards.
        Object.values(sections).forEach(section => {
            section.innerHTML = "";
        });

        bounties.forEach(bounty => {
            const type = bounty.type.trim().toLowerCase();
            const section = sections[type];

            // Ignore entries with an unrecognized type.
            if (!section) return;

            // Create the bounty card.
            const card = document.createElement("button");
            card.className = "bounty-card";
            card.type = "button";

            // Add the thumbnail if one was provided.
            if (bounty.thumbnail && bounty.thumbnail.trim()) {
                const thumbnail = document.createElement("img");
                thumbnail.className = "bounty-card-thumbnail";
                thumbnail.src = bounty.thumbnail;
                thumbnail.alt = "";
                card.appendChild(thumbnail);
            }

            // Create the card's text information.
            const info = document.createElement("div");
            info.className = "bounty-card-info";

            const name = document.createElement("span");
            name.className = "bounty-card-name";
            name.textContent = bounty.levelName || "Unnamed Level";

            const bountyID = document.createElement("span");
            bountyID.className = "bounty-card-id";
            bountyID.textContent = `Bounty ID: ${bounty.id || "Unknown"}`;

            const creator = document.createElement("span");
            creator.className = "bounty-card-creator";
            creator.textContent = `By ${bounty.creator || "Unknown"}`;

            
            const status = document.createElement("span");

            const statusName = (bounty.status || "Unknown").trim().toLowerCase();

            status.className = `bounty-status ${statusName}`;
            status.textContent = bounty.status || "Unknown";


            info.appendChild(name);
            info.appendChild(bountyID);
            info.appendChild(creator);
            info.appendChild(status);
            card.appendChild(info);

            // Clicking the card opens its details.
            card.addEventListener("click", () => {
                openBountyModal(bounty);
            });

            section.appendChild(card);
        });

        // Show a message in sections that have no entries.
        Object.entries(sections).forEach(([type, section]) => {
            if (section.children.length === 0) {
                const message = document.createElement("p");
                message.className = "bounty-empty";
                message.textContent = "No bounties here yet.";
                section.appendChild(message);
            }
        });

    } catch (error) {
        console.error("Error loading bounties:", error);
        [collabList, verificationList, unrankedList].forEach(section => {
            section.textContent = "Unable to load bounties.";
        });
    }
}


// =============================
// BOUNTY POP-UP
// =============================

const bountyModal = document.getElementById("bounty-modal");
const bountyModalClose = document.getElementById("bounty-modal-close");

function openBountyModal(bounty) {
    document.getElementById("modal-level-name").textContent =
        bounty.levelName || "Unnamed Level";

    document.getElementById("modal-bounty-id").textContent =
        bounty.id || "Unknown";

    document.getElementById("modal-creator").textContent =
        bounty.creator || "Unknown";

    document.getElementById("modal-description").textContent =
        bounty.description || "No description provided.";

    document.getElementById("modal-needs").textContent =
        bounty.needs || "No specific needs listed.";

    const modalStatus = document.getElementById("modal-status");
    const statusName = (bounty.status || "Unknown").trim().toLowerCase();

    modalStatus.textContent = bounty.status || "Unknown";
    modalStatus.className = `bounty-status ${statusName}`;

    document.getElementById("modal-contact").textContent =
        bounty.contact || "No contact information provided.";

    const thumbnail = document.getElementById("modal-thumbnail");

    if (bounty.thumbnail && bounty.thumbnail.trim()) {
        thumbnail.src = bounty.thumbnail;
        thumbnail.alt = `Thumbnail for ${bounty.levelName || "level"}`;
        thumbnail.style.display = "block";
    } else {
        thumbnail.removeAttribute("src");
        thumbnail.alt = "";
        thumbnail.style.display = "none";
    }

    bountyModal.classList.add("is-open");
    bountyModal.setAttribute("aria-hidden", "false");

    bountyModalClose.focus();
}

function closeBountyModal() {
    bountyModal.classList.remove("is-open");
    bountyModal.setAttribute("aria-hidden", "true");
}


// Close button.
bountyModalClose.addEventListener("click", closeBountyModal);

// Close when clicking the dark area outside the pop-up.
bountyModal.addEventListener("click", event => {
    if (event.target === bountyModal) {
        closeBountyModal();
    }
});

// Close when pressing Escape.
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && bountyModal.classList.contains("is-open")) {
        closeBountyModal();
    }
});


// Load the bounty information when the page opens.
loadBounties();

