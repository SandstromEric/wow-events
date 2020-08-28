import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BnetStrategy } from 'passport-bnet';
import { Observable, of } from 'rxjs';


interface MediaPayload {
    assets: { key: string, value: string }[]
}

interface ClassPayload {
    classes: any[]
}

@Injectable({
    providedIn: 'root'
})
export class WowService {
    baseUrl = 'https://us.api.blizzard.com/data/wow';
    token = null;

    constructor(private http: HttpClient, private fs: AngularFirestore, private authService: AuthService) {
    }

    getToken(): Observable<string> {
        return this.token ? of(this.token) : this.fs.doc('site/data').valueChanges().pipe(take(1), map((data: any) => {
            this.token = data.token;
            return this.token;
        }));
    }

    getWoWAPI<T>(url: string, options?): Observable<T> {
        let headers = '';
        if (options) {
            for (let option in options) {
                headers += `&${option}=${options[option]}`;
            }
        }

        return this.getToken().pipe(switchMap(() => {
            return this.http.get<T>(`${this.baseUrl}/${url}?namespace=static-classic-us&locale=en_US&access_token=${this.token}${headers}`)
        }))
    }

    get wishlistItems$() {
        return this.fs.collection('items').valueChanges();
    }

    searchWoWItem(term: string) {
        return this.getWoWAPI('/search/item', { 'name.en_US': term }).toPromise();
    }

    getWoWitem(itemId: string) {
        return this.getWoWAPI(`item/${itemId}`).toPromise();
    }

    getWoWitemIcon(itemId: string) {
        return this.getWoWAPI<MediaPayload>(`media/item/${itemId}`).pipe(
            map(payload => payload.assets[0].value)
        ).toPromise();
    }

    getWoWclasses(faction: 'alliance' | 'horde' = null) {
        return this.getWoWAPI<ClassPayload>(`playable-class/index`).pipe(
            map(payload => payload.classes.filter(clazz => {
                if (faction) {
                    return faction === 'alliance' ? (clazz.id === 7 ? false : true) : (clazz.id === 2 ? false : true);
                } else {
                    return true;
                }
            }))
        ).toPromise();
    }

    getWoWroles() {
        return [
            { name: 'Tank', classes: ['Warrior', 'Paladin', 'Druid'] },
            { name: 'Healer', classes: ['Priest', 'Paladin', 'Druid', 'Shaman'] },
            { name: 'DPS', classes: ['Hunter', 'Rogue', 'Paladin', 'Priest', 'Warrior', 'Shaman', 'Druid', 'Mage', 'Warlock'] },
        ]
    }

    importArmory(armory) {
        this.authService.user$.pipe(take(1)).subscribe(data => {
            this.fs.doc(`users/${data.uid}`).update({ armory });
        });
    }

    getCharArmory() {

    }

    async addItem(item: any) {
        return this.fs.doc<any>(`items/${item.id}`).set(item, { merge: true });
    }


}
