import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-my-event-list',
    templateUrl: './my-event-list.component.html',
    styleUrls: ['./my-event-list.component.scss']
})
export class MyEventListComponent implements OnInit {
    dataSource = new MatTableDataSource([]);
    displayedColumns = ['name', 'time', 'raids'];
    loading = true;
    constructor(private eventService: EventService, private router: Router) { }

    ngOnInit(): void {
        this.eventService.getMyEvents().subscribe(data => {
            this.loading = false;
            this.dataSource.data = data;
        });
    }

    navigateToEvent(event) {
        this.router.navigate(['/event', event.id]);
    }
}
