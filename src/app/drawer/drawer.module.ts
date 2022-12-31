import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //Gestion des formulaires
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';

import { DrawerCreateComponent } from './create/drawer-create.component';
import { DrawerListComponent } from './list/drawer-list.component';
import { DrawerViewComponent } from './view/drawer-view.component';

@NgModule({
  declarations: [
    DrawerCreateComponent,
    DrawerListComponent,
    DrawerViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    MatFormFieldModule,
    RouterModule,
    MatExpansionModule,
    MatGridListModule
  ]
})
export class DrawerModule { }
