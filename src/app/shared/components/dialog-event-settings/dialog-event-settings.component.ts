import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from '../../services/event.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';

@Component({
    selector: 'app-dialog-event-settings',
    templateUrl: './dialog-event-settings.component.html',
    styleUrls: ['./dialog-event-settings.component.scss']
})
export class DialogEventSettingsComponent implements OnInit, AfterViewInit {
    @ViewChild('features') features: MatSelectionList;
    form: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) private event: any,
        private eventService: EventService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            public: [false],
            allowEdit: [false]
        })

        this.form.patchValue(this.event);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            let options = this.features.options;
            for (let event of this.event?.features) {
                let option = options.find(item => item.value === event)
                this.features.selectedOptions.select(option);
            }
        }, 0);
        //this.features.selectedOptions.select('softres');

    }

    update() {
        this.eventService.updateEvent(this.event, { features: this.features.selectedOptions.selected.map(item => item.value), ...this.form.value });
    }

    deleteEvent() {

    }

}
