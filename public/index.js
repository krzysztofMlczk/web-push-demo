// Push notification logic.

const VAPID_PUBLIC_KEY =
  "BH1s6FeM4Jb_lmHprBvPQLZQw3-68vPlWNxaBZJH0UQIAFMtMBX0esmRqTOkrnA0rXFXN1AP09RMXldnFZ0uJ4M";
const subscribeButton = document.getElementById("subscribe");
const unsubscribeButton = document.getElementById("unsubscribe");

async function subscribeButtonHandler() {
  // Prevent the user from clicking the subscribe button multiple times.
  subscribeButton.disabled = true;
  const result = await Notification.requestPermission();
  if (result === "denied") {
    console.error("The user explicitly denied the permission request.");
    return;
  }
  if (result === "granted") {
    console.info("The user accepted the permission request.");
  }

  const registration = await navigator.serviceWorker.getRegistration();
  const subscribed = await registration.pushManager.getSubscription();
  if (subscribed) {
    console.info("User is already subscribed.");
    unsubscribeButton.disabled = false;
    return;
  }
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
  });
  fetch("/add-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  unsubscribeButton.disabled = false; // unlock the button because subscription was successful
}

async function unsubscribeButtonHandler() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.getSubscription();
  fetch("/remove-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });
  const unsubscribed = await subscription.unsubscribe();
  if (unsubscribed) {
    console.info("Successfully unsubscribed from push notifications.");
    unsubscribeButton.disabled = true;
    subscribeButton.disabled = false;
  }
}

// Convert a base64 string to Uint8Array.
// This is a format required by the PushService
function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Startup logic [registering a service worker]
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then((serviceWorkerRegistration) => {
      console.info("Service worker was registered.");
      console.info({ serviceWorkerRegistration });
    })
    .catch((error) => {
      console.error("An error occurred while registering the service worker.");
      console.error(error);
    });
  subscribeButton.disabled = false;
} else {
  console.error("Browser does not support service workers or push messages.");
}

// add button event listeners
subscribeButton.addEventListener("click", subscribeButtonHandler);
unsubscribeButton.addEventListener("click", unsubscribeButtonHandler);
