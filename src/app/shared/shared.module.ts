import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { ClassIconComponent } from './components/class-icon/class-icon.component';
import { ClassesAndRolesComponent } from './components/classes-and-roles/classes-and-roles.component';
import { DialogEventCreateComponent } from './components/dialog-event-create/dialog-event-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogEventSettingsComponent } from './components/dialog-event-settings/dialog-event-settings.component';
import { MyEventListComponent } from './components/my-event-list/my-event-list.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DialogCreateBookingComponent } from './components/dialog-create-booking/dialog-create-booking.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
    declarations: [
        ClassIconComponent,
        ClassesAndRolesComponent,
        DialogEventCreateComponent,
        DialogEventSettingsComponent,
        MyEventListComponent,
        LoaderComponent,
        DialogCreateBookingComponent],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        CKEditorModule,
        FormsModule
    ],
    exports: [
        MaterialModule,
        ClassIconComponent,
        ClassesAndRolesComponent,
        ReactiveFormsModule,
        DialogEventSettingsComponent,
        MyEventListComponent,
        LoaderComponent,
        CKEditorModule,
        FormsModule
    ]
})
export class SharedModule { }
