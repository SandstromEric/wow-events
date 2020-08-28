import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Route } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { WishlistComponent } from './views/wishlist/wishlist.component';
import { MembersComponent } from './views/members/members.component';
import { UserArmoryComponent } from './views/user-armory/user-armory.component';
import { EventListComponent } from './views/event-list/event-list.component';
import { EventDetailComponent } from './views/event-detail/event-detail.component';

import { NgAisModule } from 'angular-instantsearch';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { BookingComponent } from './views/booking/booking.component';
import { BookingDetailComponent } from './views/booking-detail/booking-detail.component';

const routes: Route[] = [
    { path: '', component: DashboardComponent },
    { path: 'event/list', component: EventListComponent },
    { path: 'event/:id', component: EventDetailComponent },
    { path: 'rightmate', component: BookingComponent },
    { path: 'rightmate/:id', component: BookingDetailComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
]
@NgModule({
    declarations: [
        AppComponent,
        WishlistComponent,
        MembersComponent,
        UserArmoryComponent,
        EventListComponent,
        EventDetailComponent,
        DashboardComponent,
        BookingComponent,
        BookingDetailComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAnalyticsModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        SharedModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        NgAisModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
