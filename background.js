// Event listener for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "someMessageType") {
    // Handle the message and perform actions
    // For example, you might update some data or trigger other functionality
  }
});

// Example: Update data when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // Perform actions when the extension is first installed
  } else if (details.reason === "update") {
    // Perform actions when the extension is updated
  }
});
