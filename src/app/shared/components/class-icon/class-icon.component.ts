import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'class-icon',
    templateUrl: './class-icon.component.html',
    styleUrls: ['./class-icon.component.scss']
})
export class ClassIconComponent implements OnInit {
    @Input() icon: string;
    @Input() type: string;

    constructor(private sanitize: DomSanitizer) { }

    ngOnInit(): void {
    }

    get resource() {
        return this.sanitize.bypassSecurityTrustResourceUrl(`assets/${this.type}_icons/${this.icon}.${this.type === 'role' ? 'webp' : 'png'}`);
    }

}
