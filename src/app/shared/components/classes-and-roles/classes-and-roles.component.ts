import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'classes-and-roles',
    templateUrl: './classes-and-roles.component.html',
    styleUrls: ['./classes-and-roles.component.scss']
})
export class ClassesAndRolesComponent implements OnInit {
    @Input() list: any[];

    constructor() { }

    ngOnInit(): void {
    }
}
