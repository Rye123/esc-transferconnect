/**
 * Service Worker that handles push notifications
 * Source: https://www.section.io/engineering-education/push-notification-in-nodejs-using-service-worker/
 */

self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(
        data.title,
        {
            body: data.body || "" 
        }
    )
})