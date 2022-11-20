// Logic for the "Notify all" functionality.
const pushTitle = document.getElementById("push-title");
const pushBody = document.getElementById("push-body");
const pushUrl = document.getElementById("push-url");

async function onNotifyAll() {
  const response = await fetch("/notify-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: pushTitle.value,
      body: pushBody.value,
      url: pushUrl.value,
    }),
  });
  if (response.status === 409) {
    document.getElementById("notification-status-message").textContent =
      "There are no subscribed endpoints to send messages to, yet.";
  }
}
