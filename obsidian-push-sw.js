// Obsidian Shopping — Web Push Service Worker
// Stage 4B.12: receive push events and show Android/PWA notifications.
//
// This service worker intentionally has NO fetch handler, so it does not
// interfere with the existing app/network/cache behavior.

const PUSH_VERSION = "obsidian-shopping-push-sw-stage-4b-step-12";

self.addEventListener("install", function(event) {
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function(event) {

  let payload = {};

  try {
    payload =
      event.data
        ? event.data.json()
        : {};
  } catch (error) {
    payload = {
      body:
        event.data
          ? event.data.text()
          : ""
    };
  }

  const title =
    String(
      payload?.title ||
      "Obsidian Shopping"
    );

  const options = {
    body:
      String(
        payload?.body ||
        "A shopping trip update is available."
      ),
    icon:
      payload?.icon ||
      "./IMG/Obsidian Shopping 192 x 192.png",
    badge:
      payload?.badge ||
      "./IMG/Obsidian Shopping 192 x 192.png",
    tag:
      String(
        payload?.tag ||
        "obsidian-shopping"
      ),
    renotify:
      Boolean(payload?.renotify),
    data: {
      url:
        payload?.url ||
        "",
      tripId:
        payload?.tripId ||
        "",
      version:
        PUSH_VERSION
    }
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});


self.addEventListener(
  "notificationclick",
  function(event) {

    event.notification.close();

    const requestedUrl =
      String(
        event.notification?.data?.url ||
        ""
      );

    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })
        .then(function(clientList) {

          for (
            const client of clientList
          ) {
            if (
              "focus" in client
            ) {
              return client.focus();
            }
          }

          if (
            requestedUrl &&
            self.clients.openWindow
          ) {
            return self.clients.openWindow(
              requestedUrl
            );
          }

          return undefined;
        })
    );
  }
);
