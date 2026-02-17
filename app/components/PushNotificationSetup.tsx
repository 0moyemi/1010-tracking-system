import { useRegisterServiceWorker } from "../lib/useRegisterServiceWorker";
import { usePushSubscription } from "../lib/usePushSubscription";

export function PushNotificationSetup({ vapidPublicKey }: { vapidPublicKey: string }) {
    useRegisterServiceWorker();
    const { subscription, permission } = usePushSubscription(vapidPublicKey);

    // You can POST subscription to your backend here for later use
    // Example: fetch('/api/push/subscribe', { method: 'POST', body: JSON.stringify({ subscription }) })

    return null;
}
