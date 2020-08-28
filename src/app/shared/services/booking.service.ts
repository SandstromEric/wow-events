import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BookingEvent {
    id?: string;
    name: string;
    description: string;
    date: Date;
    from: string;
    to: string;
    slotsPerTime: number;
    timeEvery: number;
    services: string[];
    times: {
        [key: string]: {
            slots: {
                [key: string]: BookingTime
            };
            note: string;
        }
    }
}

export interface BookingTime {
    id: string;
    ip: string;
    time: string;
    name: string;
    occupied: boolean;
    service: {
        name: string;
        shortCode: string;
        gold: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    constructor(private fs: FirestoreService) { }

    async addEvent(data: BookingEvent) {

        let from = data.from.split(':').map(t => parseInt(t));
        let to = data.to.split(':').map(t => parseInt(t));

        let times = {};
        for (let i = from[0]; i < to[0]; i++) {

            for (let j = 0; j < 59; j += (data.timeEvery)) {
                let id = (i < 10 ? `0${i}` : `${i}`) + ':' + (j === 0 ? '00' : `${j}`)
                times[id] = {
                    note: null,
                    slots: {}
                };

                for (let k = 0; k < data.slotsPerTime; k++) {
                    times[id]['slots'][k] = {
                        time: id,
                        occupied: false,
                        name: null,
                        service: null,
                        ip: null,
                        id: k
                    }
                }
            }
        }

        return await this.fs.add('rightmate-bookings', { ...data, times });
    }

    getBookings(): Observable<BookingEvent[]> {
        return this.fs.colWithIds$('rightmate-bookings');
    }

    getBooking(id: string): Observable<BookingEvent> {
        return this.fs.doc$(`rightmate-bookings/${id}`);
    }

    getBookingTimes(id: string): Observable<BookingTime[]> {
        return this.fs.colWithIds$(`rightmate-bookings/${id}/times`);
    }

    bookTime(timeId: string, timeSlot: string, { ip, id, time, name, occupied, service }) {
        return this.fs.setWithMerge(`rightmate-bookings/${timeId}`, {
            times: {
                [timeSlot]: {
                    slots: {
                        [id]: {
                            ip, id, time, name, occupied, service
                        }
                    }
                }
            }
        });
    }

    setTimeNote(timeId: string, timeSlot: string, note: string) {
        return this.fs.setWithMerge(`rightmate-bookings/${timeId}`, {
            times: {
                [timeSlot]: {
                    note
                }
            }
        });
    }

    setBookingDesc(timeId: string, description: string) {
        return this.fs.setWithMerge(`rightmate-bookings/${timeId}`, {
            description
        });
    }

    unbookTime(timeId: string, { id, time }) {
        return this.fs.setWithMerge(`rightmate-bookings/${timeId}`,
            {
                times: {
                    [time]: {
                        slots: {
                            [id]: {
                                id, ip: null, name: null, occupied: false, service: null
                            }
                        }
                    }
                }
            }
        );
    }

    addService(data) {
        return this.fs.setWithMerge(`site/rightmate-services`, { services: { ...data } })
    }

    getServices(included: string[] = []) {
        return this.fs.doc$(`site/rightmate-services`).pipe(map(({ services }: any) => {
            let arr = [];
            for (let service in services) {
                if (included.length && !included.includes(service)) { }
                else arr.push(services[service]);
            }
            return arr;
        }));
    }
}
