import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

    col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
        return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
    }

    doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
        return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
    }

    col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
        return this.col(ref, queryFn).valueChanges();
    }

    doc$<T>(ref: DocPredicate<T>): Observable<T> {
        return this.doc(ref).valueChanges();
    }

    /// Firebase Server Timestamp
    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    get currentUser() {
        return this.afAuth.currentUser;
    }

    set<T>(ref: DocPredicate<T>, data: any) {
        const timestamp = this.timestamp;
        return this.doc(ref).set({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp
        });
    }

    setWithMerge<T>(ref: DocPredicate<T>, data: any) {
        const timestamp = this.timestamp;
        return this.doc(ref).set({
            ...data,
            updatedAt: timestamp,
        }, { merge: true });
    }

    update<T>(ref: DocPredicate<T>, data: any) {
        return this.doc(ref).update({
            ...data,
            updatedAt: this.timestamp,
        });
    }

    delete<T>(ref: DocPredicate<T>) {
        return this.doc(ref).delete();
    }

    add<T>(ref: CollectionPredicate<T>, data) {
        const timestamp = this.timestamp;
        return this.col(ref).add({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
        });
    }

    geopoint(lat: number, lng: number) {
        return new firebase.firestore.GeoPoint(lat, lng);
    }

    /// If doc exists update, otherwise set
    async upsert<T>(ref: DocPredicate<T>, data: any) {
        const doc = await this.doc(ref)
            .snapshotChanges()
            .pipe(take(1))
            .toPromise();

        return doc.payload.exists ? this.update(ref, data) : this.set(ref, data);
    }

    /// with Ids
    colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
        return this.col(ref, queryFn).valueChanges({ idField: 'id' });
    }

    docWithRefs$<T>(ref: DocPredicate<T>) {
        return this.doc$(ref).pipe(
            map(doc => {
                for (const k of Object.keys(doc)) {
                    if (doc[k] instanceof firebase.firestore.DocumentReference) {
                        doc[k] = this.doc(doc[k].path);
                    }
                }
                return doc;
            })
        );
    }

    batchSet<T>(ref: DocPredicate<T>, arr: Array<T>) {
        const batch = this.afs.firestore.batch();
        arr.map((item: any) => {
            let id: string = null;
            if (item.id) {
                id = item.id;
            } else {
                id = this.afs.createId();
            }
            const docRef = this.doc(`${ref}/${id}`).ref;
            batch.set(docRef, item);
        });
        return batch.commit();
    }

    async batchUpdate<T>(ref: DocPredicate<T>, arr: any[]) {
        const batch = this.afs.firestore.batch();

        arr.map(item => {
            const docRef = this.doc(`${ref}/${item.id}`).ref;
            batch.update(docRef, { ...item, updatedAt: this.timestamp, });
        });
        await batch.commit();
    }

    batchDelete<T>(ref: DocPredicate<T>, arr: any[]) {
        const batch = this.afs.firestore.batch();
        arr.map(item => {
            let docRef;
            if (item.id) {
                docRef = this.doc(`${ref}/${item.id}`).ref;
            } else {
                docRef = this.doc(`${ref}/${item}`).ref;
            }

            batch.delete(docRef);
        });
        batch.commit();
    }
}
