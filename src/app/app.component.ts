import { Component, OnInit } from '@angular/core';
import { WowService } from './shared/services/wow.service';
import { AuthService } from './shared/services/auth.service';
import { Observable } from 'rxjs';
import { fadeAnimation } from './route.animation';
import { MatDialog } from '@angular/material/dialog';
import { DialogEventCreateComponent } from './shared/components/dialog-event-create/dialog-event-create.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [fadeAnimation]
})
export class AppComponent implements OnInit {

    navLinks = [
    ];

    init = false;
    user = null;

    constructor(private wowService: WowService, public authService: AuthService, private dialog: MatDialog) {

    }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.init = true;
            this.user = user;
        })
    }

    public getRouterOutletState(outlet) {
        return outlet.isActivated ? outlet.activatedRoute : '';
    }

    openEventDialog() {
        this.dialog.open(DialogEventCreateComponent)
    }
}
