import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonModule} from 'primeng/button';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {AccordionModule} from "primeng/accordion";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {InputSwitchModule} from "primeng/inputswitch";
import {MultiSelectModule} from "primeng/multiselect";
import {FileUploadModule} from "primeng/fileupload";
import {HttpClientModule} from "@angular/common/http";
import {GraphsComponent} from './components/graphs/graphs.component';
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {TooltipModule} from 'primeng/tooltip';
import {MatSliderModule} from '@angular/material/slider';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {SliderModule} from 'primeng/slider';
import {ScrollerModule} from 'primeng/scroller';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {FilesTabComponent} from './components/sidenav/files-tab/files-tab.component';
import {ContactPointTabComponent} from './components/sidenav/contact-point-tab/contact-point-tab.component';
import { FiltersTabComponent } from './components/sidenav/filters-tab/filters-tab.component';
import { ForceIndTabComponent } from './components/sidenav/force-ind-tab/force-ind-tab.component';
import { ElisticitySpectraTabComponent } from './components/sidenav/elisticity-spectra-tab/elisticity-spectra-tab.component';
import { CustomCodeTabComponent } from './components/sidenav/custom-code-tab/custom-code-tab.component';
import { BottomnavComponent } from './components/bottomnav/bottomnav.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    GraphsComponent,
    FilesTabComponent,
    ContactPointTabComponent,
    FiltersTabComponent,
    ForceIndTabComponent,
    ElisticitySpectraTabComponent,
    CustomCodeTabComponent,
    BottomnavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    AccordionModule,
    BrowserAnimationsModule,
    InputNumberModule,
    FormsModule,
    InputSwitchModule,
    MultiSelectModule,
    FileUploadModule,
    HttpClientModule,
    CardModule,
    TooltipModule,
    ChartModule,
    MatSliderModule,
    InputTextareaModule,
    SliderModule,
    ScrollerModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
