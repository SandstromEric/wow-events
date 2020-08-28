import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'app-dialog-event-create',
    templateUrl: './dialog-event-create.component.html',
    styleUrls: ['./dialog-event-create.component.scss'],
    providers: [DatePipe]
})
export class DialogEventCreateComponent implements OnInit {
    now = new Date();
    formGroup: FormGroup;
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: Date,
        private dialogRef: MatDialogRef<DialogEventCreateComponent>,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private eventService: EventService
    ) { }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            name: ['Event for ' + this.datePipe.transform(this.now), Validators.required],
            raids: [['Molten Core', 'Blackwing Lair'], Validators.required],
            date: [this.data],
            fromTime: [this.datePipe.transform(this.now, 'hh:mm'), Validators.required],
            toTime: [this.datePipe.transform(this.now.setHours(this.now.getHours() + 1), 'hh:mm'), Validators.required],
            notes: [''],
            features: [['hardres', 'softres']],
            public: [false]
        });
    }

    async create() {
        const response = await this.eventService.addEvent(this.formGroup.value);
        if (response) {
            this.dialogRef.close(response.id);
        }
    }

}
