import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing-module';
import { Login } from './login/login';
import { ShareMaterialModule } from '../../shareComponents/share-material/share-material-module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [Login],
  imports: [CommonModule, LoginRoutingModule, ShareMaterialModule, ReactiveFormsModule],
})
export class LoginModule {}
