// The theme choices available on the website
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

        // Keep the bottom GIF that is already in the HTML
        bottomGif: null
    },

    dark: {
        name: "Dark + Red",

        pageBackground: "#000000",

        // Replace this with the path to your dark theme background image.
        pageImage: 'url("images/dark-background.jpg")',

        headerImage:
            'url("copy_343ABA05-15B9-43E9-93F7-6299D6457447.gif")',
        headerText: "#ffffff",

        boxBackground: `
            linear-gradient(
                135deg,
                #000000 70%,
                #ff0000 30%
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

        // Replace this with the path to your dark theme bottom GIF.
        bottomGif: "https://ik.imagekit.io/2p4y4oqkx/IMG_2894.gif"
    }
};



  

// Find the page's root element
const themeRoot = document.documentElement;

// Find the bottom GIF already present on the page
const bottomGifElement = document.querySelector(".bottom-gif");

// Remember the original GIF so the Default theme can restore it
const originalBottomGif = bottomGifElement
    ? bottomGifElement.getAttribute("src")
    : null;


function applyTheme(themeName) {
    // Find the requested theme
    const theme = themes[themeName];

    // Stop if the theme name is not recognized
    if (!theme) {
        return;
    }

    // Apply the theme's settings as CSS variables
    themeRoot.style.setProperty(
        "--page-background",
        theme.pageBackground
    );

    themeRoot.style.setProperty(
        "--page-image",
        theme.pageImage
    );

    themeRoot.style.setProperty(
        "--header-image",
        theme.headerImage
    );

    themeRoot.style.setProperty(
        "--header-text",
        theme.headerText
    );

    themeRoot.style.setProperty(
        "--box-background",
        theme.boxBackground
    );

    themeRoot.style.setProperty(
        "--box-outline",
        theme.boxOutline
    );

    themeRoot.style.setProperty(
        "--text-color",
        theme.textColor
    );

    themeRoot.style.setProperty(
        "--secondary-text-color",
        theme.secondaryTextColor
    );

    themeRoot.style.setProperty(
        "--link-color",
        theme.linkColor
    );

    themeRoot.style.setProperty(
        "--button-background",
        theme.buttonBackground
    );

    themeRoot.style.setProperty(
        "--button-text",
        theme.buttonText
    );

    themeRoot.style.setProperty(
        "--button-hover",
        theme.buttonHover
    );

    themeRoot.style.setProperty(
        "--accent-color",
        theme.accentColor
    );

    themeRoot.style.setProperty(
        "--rating-background",
        theme.ratingBackground
    );

    themeRoot.style.setProperty(
        "--rating-text",
        theme.ratingText
    );


    // Change the bottom GIF, if the theme specifies one
    if (bottomGifElement) {
        if (theme.bottomGif) {
            bottomGifElement.src = theme.bottomGif;
        } else if (originalBottomGif) {
            bottomGifElement.src = originalBottomGif;
        }
    }


    // Highlight the currently selected theme
    document.querySelectorAll(".theme-option").forEach(button => {
        button.classList.toggle(
            "selected",
            button.dataset.themeChoice === themeName
        );
    });


    // Save the visitor's choice in their browser
    localStorage.setItem("selectedTheme", themeName);
}




const themeMenuButton =
    document.getElementById("theme-menu-button");

const themeCloseButton =
    document.getElementById("theme-close-button");

const themeDrawer =
    document.getElementById("theme-drawer");

const themeOverlay =
    document.getElementById("theme-overlay");


function openThemeMenu() {
    themeDrawer.classList.add("is-open");
    themeOverlay.classList.add("is-open");

    themeDrawer.setAttribute("aria-hidden", "false");
    themeMenuButton.setAttribute("aria-expanded", "true");
}


function closeThemeMenu() {
    themeDrawer.classList.remove("is-open");
    themeOverlay.classList.remove("is-open");

    themeDrawer.setAttribute("aria-hidden", "true");
    themeMenuButton.setAttribute("aria-expanded", "false");
}


// Open the drawer
themeMenuButton.addEventListener("click", openThemeMenu);

// Close it with the X button
themeCloseButton.addEventListener("click", closeThemeMenu);

// Close it by clicking outside the drawer
themeOverlay.addEventListener("click", closeThemeMenu);

// Close it by pressing Escape
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeThemeMenu();
    }
});


// Apply the theme chosen by the visitor
document.querySelectorAll(".theme-option").forEach(button => {
    button.addEventListener("click", () => {
        const themeName = button.dataset.themeChoice;

        applyTheme(themeName);
    });
});




// Get the visitor's saved theme, or use Default
const savedTheme = localStorage.getItem("selectedTheme") || "default";

// Apply it when the page loads
applyTheme(savedTheme);
