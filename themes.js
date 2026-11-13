
// =============================
// LOAD THE SHARED THEME MENU
// =============================

async function loadThemeMenu() {
    try {
        const response = await fetch("theme-menu.html");

        if (!response.ok) {
            throw new Error("Could not load theme-menu.html");
        }

        const html = await response.text();

        document.body.insertAdjacentHTML("beforeend", html);

        initializeThemeMenu();

    } catch (error) {
        console.error("Error loading theme menu:", error);
    }
}


// =============================
// THEME DEFINITIONS
// =============================

const themes = {
    default: {
        name: "Default",

        pageBackground: "#f2f2f2",
        pageImage: "none",

        headerImage:
            'url("copy_343ABA05-15B9-43E9-93F7-6299D6457447.gif")',
        headerText: "#ffffff",

        boxBackground: `
            linear-gradient(
                135deg,
                #ffffff 0%,
                #e3feff 100%
            )
        `,
        boxOutline: "#e5e5e5",

        textColor: "#222222",
        secondaryTextColor: "#666666",
        linkColor: "#4a78d0",

        buttonBackground: "#222222",
        buttonText: "#ffffff",
        buttonHover: "#444444",

        accentColor: "#4a78d0",

        ratingBackground: "#dddddd",
        ratingText: "#222222",

        bottomGif: "https://ik.imagekit.io/2p4y4oqkx/IMG_2891.gif"
    },

    dark: {
        name: "Slaughterhouse",

        pageBackground: "#000000",
        pageImage: 'url("images/dark-background.jpg")',

        headerImage:
            'url("copy_343ABA05-15B9-43E9-93F7-6299D6457447.gif")',
        headerText: "#ffffff",

        boxBackground: `
            linear-gradient(
                135deg,
                #7a0000 0%,
                #000000 100%
            )
        `,
        boxOutline: "#c00000",

        textColor: "#c00000",
        secondaryTextColor: "#900000",
        linkColor: "#8ab4ff",

        buttonBackground: "#383838",
        buttonText: "#ffffff",
        buttonHover: "#505050",

        accentColor: "#8ab4ff",

        ratingBackground: "#444444",
        ratingText: "#eeeeee",

        bottomGif: "https://ik.imagekit.io/2p4y4oqkx/IMG_2899.gif"
    }
};


// =============================
// APPLY A THEME
// =============================

function applyTheme(themeName) {
    const theme = themes[themeName];

    if (!theme) return;

    const themeRoot = document.documentElement;

    themeRoot.style.setProperty("--page-background", theme.pageBackground);
    themeRoot.style.setProperty("--page-image", theme.pageImage);
    themeRoot.style.setProperty("--header-image", theme.headerImage);
    themeRoot.style.setProperty("--header-text", theme.headerText);
    themeRoot.style.setProperty("--box-background", theme.boxBackground);
    themeRoot.style.setProperty("--box-outline", theme.boxOutline);
    themeRoot.style.setProperty("--text-color", theme.textColor);
    themeRoot.style.setProperty("--secondary-text-color", theme.secondaryTextColor);
    themeRoot.style.setProperty("--link-color", theme.linkColor);
    themeRoot.style.setProperty("--button-background", theme.buttonBackground);
    themeRoot.style.setProperty("--button-text", theme.buttonText);
    themeRoot.style.setProperty("--button-hover", theme.buttonHover);
    themeRoot.style.setProperty("--accent-color", theme.accentColor);
    themeRoot.style.setProperty("--rating-background", theme.ratingBackground);
    themeRoot.style.setProperty("--rating-text", theme.ratingText);

    // Change the bottom GIF
    const bottomGifElement = document.querySelector(".bottom-gif");

    if (bottomGifElement && theme.bottomGif) {
        bottomGifElement.src = theme.bottomGif;
    }

    // Highlight the selected theme
    document.querySelectorAll(".theme-option").forEach(button => {
        button.classList.toggle(
            "selected",
            button.dataset.themeChoice === themeName
        );
    });

    // Save the visitor's choice
    localStorage.setItem("selectedTheme", themeName);
}


// =============================
// INITIALIZE THE THEME MENU
// =============================

function initializeThemeMenu() {

    const themeMenuButton =
        document.getElementById("theme-menu-button");

    const themeCloseButton =
        document.getElementById("theme-close-button");

    const themeDrawer =
        document.getElementById("theme-drawer");

    const themeOverlay =
        document.getElementById("theme-overlay");


    // Open the drawer
    function openThemeMenu() {
        themeDrawer.classList.add("is-open");
        themeOverlay.classList.add("is-open");

        themeDrawer.setAttribute("aria-hidden", "false");
        themeMenuButton.setAttribute("aria-expanded", "true");
    }


    // Close the drawer
    function closeThemeMenu() {
        themeDrawer.classList.remove("is-open");
        themeOverlay.classList.remove("is-open");

        themeDrawer.setAttribute("aria-hidden", "true");
        themeMenuButton.setAttribute("aria-expanded", "false");
    }


    // Attach button listeners
    themeMenuButton.addEventListener("click", openThemeMenu);

    themeCloseButton.addEventListener("click", closeThemeMenu);

    themeOverlay.addEventListener("click", closeThemeMenu);


    // Close with Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeThemeMenu();
        }
    });


    // Apply a selected theme
    document.querySelectorAll(".theme-option").forEach(button => {
        button.addEventListener("click", () => {
            applyTheme(button.dataset.themeChoice);
        });
    });


    // Restore the visitor's saved theme
    const savedTheme =
        localStorage.getItem("selectedTheme") || "default";

    applyTheme(savedTheme);
}


// =============================
// START
// =============================

loadThemeMenu();
