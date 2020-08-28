import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BookingService, BookingEvent, BookingTime } from 'src/app/shared/services/booking.service';
import { forkJoin, combineLatest, Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MdePopoverTrigger } from '@material-extended/mde';
import * as BallonEditor from '@ckeditor/ckeditor5-build-balloon';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'app-booking-detail',
    templateUrl: './booking-detail.component.html',
    styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {
    @ViewChild('bookBtn') bookBtn: MdePopoverTrigger;
    @ViewChild('description') desc;

    descControl = new FormControl(null);
    bookGroup: FormGroup;

    public Editor = BallonEditor;
    id: string;
    booking: BookingEvent;
    times: { time: string, note: string, children: BookingTime[] }[] = [];
    allTimes: any[] = [];
    loading = false;

    services$: Observable<any>;

    constructor(
        private route: ActivatedRoute,
        private bookingService: BookingService,
        private authService: AuthService,
        private snackbar: MatSnackBar,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.bookGroup = this.fb.group({
            name: [null, Validators.required],
            service: [null, Validators.required]
        });

        this.route.params.pipe(
            switchMap(({ id }) => {
                this.id = id;
                this.loading = true;
                return this.bookingService.getBooking(id)
            })
        ).subscribe(booking => {
            if (!this.services$) {
                this.services$ = this.bookingService.getServices(booking.services);
            }

            this.booking = booking;
            this.times = [];
            this.allTimes = [];

            this.descControl.setValue(booking.description ? booking.description : 'Click to edit description!');

            Object.keys(booking.times).map(item => {
                let object = { time: item, note: booking.times[item].note, children: [] }
                Object.keys(booking.times[item].slots).map(child => {
                    object.children.push(booking.times[item]['slots'][child]);
                    this.allTimes.push(booking.times[item]['slots'][child]);
                });
                this.times.push(object);
            });

            this.times = this.times.sort((a, b) => a.time.localeCompare(b.time));
            this.loading = false;
        });
    }

    get ipFound() {
        return this.allTimes.find(time => time.ip === this.authService.currentIP);
    }

    get isAdmin() {
        return true
    }

    bookTime(item: { time: string, children: BookingTime[] }) {
        let available = item.children.find(el => !el.occupied);
        if (available && item.time) {
            available.name = this.bookGroup.value.name;
            available.service = this.bookGroup.value.service;
            available.occupied = true;
            available.ip = this.authService.currentIP;
            this.bookBtn.closePopover();
            this.bookingService.bookTime(this.id, item.time, available);
            this.bookGroup.reset();
        } else {
            this.snackbar.open('This timeslot is full!', 'Dismiss', { duration: 1000 })
        }
    }

    unbookTime(item: BookingTime) {
        this.bookingService.unbookTime(this.id, item);
    }

    openSnackbar() {
        this.snackbar.open('Copied to clipboard!', 'Dismiss', { duration: 1000 })
    }

    setDescription() {
        this.bookingService.setBookingDesc(this.id, this.descControl.value)
    }

}
