import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogEventCreateComponent } from 'src/app/shared/components/dialog-event-create/dialog-event-create.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(public authService: AuthService, private dialog: MatDialog) { }

    ngOnInit(): void {
    }

    openEventDialog() {
        this.dialog.open(DialogEventCreateComponent)
    }
}
