import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEventCreateComponent } from 'src/app/shared/components/dialog-event-create/dialog-event-create.component';
import { DialogCreateBookingComponent } from 'src/app/shared/components/dialog-create-booking/dialog-create-booking.component';
import { BookingService, BookingEvent } from 'src/app/shared/services/booking.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
    dataSource = new MatTableDataSource<BookingEvent>([]);
    displayedColumns = ['name', 'date', 'from', 'services']
    constructor(private dialog: MatDialog, private bookingService: BookingService, private router: Router) { }

    ngOnInit(): void {
        this.bookingService.getBookings().subscribe(data => {
            this.dataSource.data = data;
        });
    }

    createEvent() {
        this.dialog.open(DialogCreateBookingComponent);
    }

    gotoEvent(event: BookingEvent) {
        this.router.navigate(['/rightmate', event.id])
    }
}
