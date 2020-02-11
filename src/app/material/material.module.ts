import { NgModule } from '@angular/core';
import { MatButtonModule, MatRadioButton, MatInputModule, MatFormField, MatOptionModule, MatSelectModule, MatCardModule, MatAutocompleteModule } from '@angular/material';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatCardModule,
  MatAutocompleteModule
];
@NgModule({
  imports: materialModules,
  exports: materialModules
})

export class MaterialModule { }
