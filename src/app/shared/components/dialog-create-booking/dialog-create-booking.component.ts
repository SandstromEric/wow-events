import { Component, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MdePopoverTrigger } from '@material-extended/mde';

@Component({
    selector: 'app-dialog-create-booking',
    templateUrl: './dialog-create-booking.component.html',
    styleUrls: ['./dialog-create-booking.component.scss'],
    providers: [DatePipe]
})
export class DialogCreateBookingComponent implements OnInit {
    @ViewChild('addServiceTrigger') addServiceTrigger: MdePopoverTrigger
    formGroup: FormGroup;
    serviceGroup: FormGroup;

    loading = false;

    services$: Observable<any>;

    constructor(
        private bookingService: BookingService,
        private fb: FormBuilder,
        private router: Router,
        private dialogRef: MatDialogRef<DialogCreateBookingComponent>,
        private datePipe: DatePipe) { }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            name: ['Summons for ' + this.datePipe.transform(new Date()), Validators.required],
            description: [null],
            date: [new Date(), Validators.required],
            from: ['15:00', Validators.required],
            to: ['18:00', Validators.required],
            slotsPerTime: [5, Validators.required],
            timeEvery: [15, Validators.required],
            services: [null, Validators.required],
            archived: [false]
        });

        this.serviceGroup = this.fb.group({
            name: [null, Validators.required],
            shortCode: [null, Validators.required],
            gold: [null, Validators.required]
        });

        this.services$ = this.bookingService.getServices();
    }

    async createEvent() {
        this.loading = true;
        const response = await this.bookingService.addEvent(this.formGroup.value)
        //this.router.navigate(['/rightmate', response.id]);
        this.dialogRef.close();
        this.loading = false;
    }

    async addService() {
        const obj = {
            [this.serviceGroup.value.shortCode]: this.serviceGroup.value
        }

        await this.bookingService.addService(obj);
        this.addServiceTrigger.closePopover();
        this.serviceGroup.reset();
    }

}
