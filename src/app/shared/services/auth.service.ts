import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { AngularFirestoreDocument } from '@angular/fire/firestore/public_api';
import * as firebase from 'firebase/app';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private IP: string;
    private userSubject = new BehaviorSubject(null);
    user$: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private http: HttpClient
    ) {
        // Get the auth state, then fetch the Firestore user document or return null
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                // Logged in
                if (user) {
                    this.userSubject.next(user);
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    // Logged out
                    this.userSubject.next(null);
                    return of(null);
                }
            })
        )

        this.http.get<{ ip: string }>('https://api.ipify.org?format=json').subscribe(data => {
            if (data) {
                this.IP = data.ip
            }
        })
    }

    get currentIP() {
        return this.IP;
    }

    get user() {
        return this.userSubject.getValue();
    }

    async googleSignin() {
        const provider = new firebase.auth.GoogleAuthProvider()
        const credential = await this.afAuth.signInWithPopup(provider);
        return this.updateUserData(credential.user);
    }

    private updateUserData(user) {
        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

        const data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }

        return userRef.set(data, { merge: true })

    }

    async signOut() {
        await this.afAuth.signOut();
        this.router.navigate(['/']);
    }
}
