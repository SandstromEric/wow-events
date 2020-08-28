import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';

@Injectable({
    providedIn: 'root'
})
export class CharacterService {

    constructor(private fs: FirestoreService) { }

    addCharacter(data) {
        return this.fs.add('characters', data);
    }
}
