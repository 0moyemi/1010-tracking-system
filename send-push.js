const webpush = require('web-push');

const vapidKeys = {
    publicKey: 'BKhy7aT1MaawbnUnQQH8w-vyIhridDexhSGUgLLaHUDD0beQb41-xgv3dpp_61_r3ttBYodoBLtncNNODzbtGiA',
    privateKey: '_66zJFUKnDaoZUW3yzEDXCN1h882211TReH0AHHoxkI'
};

const subscription = {
    endpoint: 'https://wns2-par02p.notify.windows.com/w/?token=BQYAAAAwR3Nsu9VNHO4mzUat9deeWK46ZyPrbig3p%2fcamtlJ9cG5pUkphg1VqDAtmjr%2bls9Fv2b%2fmUFleU1gHewjPV6vELVIDtfQdRfDkBZoxKGUviy8dSHE3OlGlaNrDUGvs8PLXxa2T1c2RdDBss8jJWO4%2fsmW59gaJSf3PZZoxPgR6nrxxeN2yhjvizDYs%2b%2b9K8bReOZGd%2fb%2bTqmfynQLMHUK01ZYcNjxVQXstI%2ftckmgPd%2fHlvaaYvhgDD0NcMlnNtW2JbFFy6TwYuQI3dnJqV4PSZ0WMYwbnBSnU3cW71kqlrVQnQLpTOFkum%2b0Ec%2fTGrHtY%2f3PoKaB%2f3PPxN%2bS9Xz%2b',
    expirationTime: null,
    keys: {
        p256dh: 'BElTfVn0nZt0901GlLKFFqIzsZB8SXOaIsOrawfkQE4PiFqnqebRXmqp9ie6SGSGF4yJh5XaBRLgZcNJ-9tEdvk',
        auth: 'eylK5E_wKZorYvuhsd1xGg'
    }
};

webpush.setVapidDetails(
    'mailto:admin@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

webpush.sendNotification(subscription, JSON.stringify({
    title: 'Manual Test',
    body: 'This is a manual push test!',
    tag: 'manual-test'
})).then(() => {
    console.log('Push sent!');
}).catch(err => {
    console.error('Push failed:', err);
});
