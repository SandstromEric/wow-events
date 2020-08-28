import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { WowService } from 'src/app/shared/services/wow.service';
import { debounceTime } from 'rxjs/operators'
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
    form: FormGroup;
    currentItem = null;
    access_key = null;

    dataSource = new MatTableDataSource([]);
    displayedColumns = ['icon', 'name', 'raid', 'availableFor', 'external'];
    filterControl = new FormControl(null);

    classControl = new FormControl(null, Validators.required);
    roleControl = new FormControl(null, Validators.required);

    classList = null;
    roleList = null;

    constructor(private fb: FormBuilder, private wowService: WowService) {
        this.access_key = this.wowService.token;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            wowhead: [null, Validators.required],
            raid: [null, Validators.required],
            availableFor: this.fb.array([]),
            notes: [null]
        });

        this.form.get('wowhead').valueChanges.pipe(debounceTime(500)).subscribe(value => {
            this.getItem(value);
        });
        setTimeout(() => {
            this.form.get('wowhead').updateValueAndValidity();
        }, 550);


        this.filterControl.valueChanges.subscribe(value => {
            this.dataSource.filter = value;
        })

        this.wowService.wishlistItems$.subscribe(data => {
            this.dataSource.data = data;
        });

        this.classControl.valueChanges.subscribe(data => {
            if (data) {
                let list = this.roleList.filter(role => role.classes.includes(data));
                if (list.length === 1) {
                    this.roleControl.setValue([list[0].name]);
                    this.roleControl.disable();
                } else {
                    this.roleControl.reset();
                    this.roleControl.enable();
                }
            }
        })

        this.getClassesAndRoles();

        this.form.updateValueAndValidity();
    }

    get array() {
        return this.form.get('availableFor') as FormArray;
    }

    async addItem() {
        let response = await this.wowService.addItem({ ...this.currentItem, ...this.form.value });
        this.form.reset();
        this.array.clear();
        this.currentItem = null;
    }

    classAdded(clazz: string): boolean {
        return this.array.value.find(item => item.class === clazz);
    }

    addClassAndRole() {
        this.array.push(
            this.fb.group({
                class: [this.classControl.value],
                roles: [this.roleControl.value]
            })
        )

        this.classControl.reset();
        this.roleControl.reset();
    }

    removeClass(i: number) {
        this.array.removeAt(i);
    }

    async getItem(value: string) {
        if (!value?.length) return this.currentItem = null;
        let regex = /(?<=item=)(.*)(?<=[0-9])/;
        let match = value.match(regex);
        if (match) {
            const response = await this.wowService.getWoWitem(match[0]);
            if (response) {
                this.currentItem = response;
                this.currentItem.icon = await this.wowService.getWoWitemIcon(match[0])
            } else {
                this.currentItem = null;
            }
        } else {
            this.currentItem = null;
        }
    }

    async getClassesAndRoles() {
        this.roleList = this.wowService.getWoWroles();
        this.classList = await this.wowService.getWoWclasses('alliance');
    }

}
