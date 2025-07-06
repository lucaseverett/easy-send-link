// Background service worker

// Helper function to update the extension icon
function updateIcon(theme) {
  chrome.action.setIcon({ path: getIconPath(theme) });
}

// Handle messages from options page and offscreen document
chrome.runtime.onMessage.addListener((message) => {
  const { theme } = message;
  updateIcon(theme);
});

// Handle messages from other extensions
chrome.runtime.onMessageExternal.addListener((message) => {
  const { theme } = message;
  updateIcon(theme);
});

// Create offscreen document for theme detection
async function createOffscreenDocument() {
  if (await chrome.offscreen.hasDocument()) {
    return;
  }
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["MATCH_MEDIA"],
    justification: "Detect system theme changes",
  });
}

createOffscreenDocument();

// Helper function to get the appropriate icon for the theme
function getIconPath(theme) {
  return theme === "dark" ? "mail_C7C7C7.png" : "mail_474747.png";
}

// Handle toolbar icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    const subject = tab.title || "Check out this link";
    const body = tab.url;

    await chrome.tabs.create({
      active: false,
      url: `mailto:?subject=${subject}&body=${body}`,
    });
  } catch (error) {
    console.error("Error creating mailto link:", error);
  }
});
