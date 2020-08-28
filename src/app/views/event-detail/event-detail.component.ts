import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, debounceTime } from 'rxjs/operators';
import { EventService } from 'src/app/shared/services/event.service';
import { of } from 'rxjs';
import { WowService } from 'src/app/shared/services/wow.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharacterService } from 'src/app/shared/services/character.service';
import algoliasearch from 'algoliasearch/lite';
import { MatDialog } from '@angular/material/dialog';
import { DialogEventSettingsComponent } from 'src/app/shared/components/dialog-event-settings/dialog-event-settings.component';

const searchClient = algoliasearch(
    '65JWFT4M6M',
    '2e5b57a7d961b5962b42a28ddccff0f7'
);

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
    id: string;
    event: any = null;
    loading = false;

    findPlayerControl = new FormControl('');
    classList = null;

    addCharForm: FormGroup;

    config = {
        indexName: 'characters',
        searchClient
    }

    constructor(
        private route: ActivatedRoute,
        private eventService: EventService,
        private router: Router,
        private wowService: WowService,
        private fb: FormBuilder,
        private characterService: CharacterService,
        private dialog: MatDialog
    ) { }

    async ngOnInit() {
        this.addCharForm = this.fb.group({
            name: [null, Validators.required],
            class: [null, Validators.required]
        })
        this.classList = await this.wowService.getWoWclasses('alliance');

        this.route.params.pipe(
            switchMap(({ id }) => {
                this.loading = true;
                if (id) {
                    this.id = id;
                    return this.eventService.getEvent(id);
                } else {
                    return of(null);
                }
            })
        ).subscribe(data => {
            this.loading = false;
            console.log(data)
            this.event = data;
        });

        const response = await this.wowService.searchWoWItem('Accuria');
        console.log(response);
        /* this.findPlayerControl.valueChanges.pipe(
            debounceTime(500), 
            switchMap(value => )).subscribe(name => {

        }); */
    }

    ifFeature(feature: string): boolean {
        return this.event?.features?.includes(feature);
    }

    async deleteEvent() {
        await this.eventService.deleteEvent(this.id);
        this.router.navigate(['/events']);
    }

    async addCharacter() {
        this.characterService.addCharacter(this.addCharForm.value);
        this.addCharForm.reset();
    }

    openSettings() {
        this.dialog.open(DialogEventSettingsComponent, { data: { ...this.event, id: this.id } });
    }

}
