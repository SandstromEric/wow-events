import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WowService } from 'src/app/shared/services/wow.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-user-armory',
    templateUrl: './user-armory.component.html',
    styleUrls: ['./user-armory.component.scss']
})
export class UserArmoryComponent implements OnInit {
    armoryControl = new FormControl(null);
    constructor(private wowService: WowService, public authService: AuthService) { }

    ngOnInit(): void {
    }

    importArmory() {
        const value = JSON.parse(this.armoryControl.value);
        this.wowService.importArmory(value);
    }
}
