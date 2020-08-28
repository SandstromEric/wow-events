import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/shared/services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogEventCreateComponent } from 'src/app/shared/components/dialog-event-create/dialog-event-create.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
    date = new Date();
    days: Array<Date> = null;
    startIndex = null;
    selectedDate = null;

    events: any[] = [];

    constructor(private eventService: EventService, private dialog: MatDialog, private router: Router, public authService: AuthService) { }

    ngOnInit(): void {
        this.days = this.getDaysInMonth(this.date.getMonth(), this.date.getFullYear());
        this.selectedDate = this.days.find(date => date.getDate() === this.date.getDate());
    }

    occupied(day: Date) {
        let d = this.events.find(event => {
            if (!event?.date) {
                return undefined;
            }

            return day.getTime() === event.date.toDate().getTime();
        });

        return d
    }

    createEvent() {
        let dialogRef = this.dialog.open(DialogEventCreateComponent, { data: this.selectedDate });

        dialogRef.afterClosed().subscribe(id => {
            if (id) {
                this.router.navigate(['/event', id])
            }
        });
    }

    getDaysInMonth(month, year) {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        this.startIndex = days[0].getDay();
        return days;
    }

    nextMonth() {
        let d = this.date;
        if (d.getMonth() === 11) {
            this.date = new Date(d.getFullYear() + 1, 0, 1);
        } else {
            this.date = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        }

        this.days = this.getDaysInMonth(this.date.getMonth(), this.date.getFullYear());
    }

    prevMonth() {
        let d = this.date;
        if (d.getMonth() === 0) {
            this.date = new Date(d.getFullYear() - 1, 11, 1);
        } else {
            this.date = new Date(d.getFullYear(), d.getMonth() - 1, 1);
        }

        this.days = this.getDaysInMonth(this.date.getMonth(), this.date.getFullYear());
    }

    selectEvent(event) {
        console.log(event)
    }

}
