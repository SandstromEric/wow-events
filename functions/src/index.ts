import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import algoliasearch from 'algoliasearch';
import axios from 'axios';

admin.initializeApp();
const db = admin.firestore();

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('characters');

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const updateToken = functions.pubsub.schedule('59 23 * * *').onRun(async context => {
    const client_id = 'fc39fc48f6284d3b98ea2fc8084ae460';
    const secret_id = 'ljMjhyXk8ecbJnBIJdAkyjrDGtWSiXHA';

    let response = await axios.get(`https://us.battle.net/oauth/token?client_id=${client_id}&client_secret=${secret_id}&grant_type=client_credentials`);
    db.doc('site/data').set({ token: response.data.access_token });

    return Promise.resolve(response)
});

export const addToIndex = functions.firestore.document('characters/{characterId}').onCreate(snapshot => {
    const data = snapshot.data();
    const objectID = snapshot.id;

    return index.saveObject({ ...data, objectID });
})

export const updateIndex = functions.firestore.document('customers/{customerId}').onUpdate((change) => {
    const newData = change.after.data();
    const objectID = change.after.id;
    return index.saveObject({ ...newData, objectID });
});

export const deleteFromIndex = functions.firestore.document('customers/{customerId}').onDelete(snapshot =>
    index.deleteObject(snapshot.id)
);

