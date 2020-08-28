import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(private fs: FirestoreService, private authService: AuthService) { }

    getEvents() {
        return this.fs.colWithIds$('events');
    }

    getEvent(id: string) {
        return this.fs.doc$(`events/${id}`);
    }

    getMyEvents() {
        return this.fs.colWithIds$('events', ref => ref.where('owner', '==', this.authService?.user?.uid));
    }

    addEvent(data) {
        const userId = this.authService?.user?.uid ? this.authService?.user?.uid : null;
        return this.fs.add('events', { ...data, owner: userId });
    }

    updateEvent({ id }, data) {
        console.log(data)
        return this.fs.setWithMerge(`events/${id}`, data);
    }

    deleteEvent(id: string) {
        return this.fs.delete(`events/${id}`);
    }

    getEventRoster(id: string) {
        return this.fs.colWithIds$(`events/${id}/roster`);
    }

    upsertPlayer(id: string, player: any) {
        return this.fs.upsert(`events/${id}/roster`, player);
    }

    getEventReserves(id: string) {
        return this.fs.colWithIds$(`events/${id}/reserves`);
    }

    upsertReserve(id: string, reserve: any) {
        return this.fs.upsert(`events/${id}/reserves`, reserve);
    }
}
