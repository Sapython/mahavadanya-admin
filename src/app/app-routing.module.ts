import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: 'check-your-mail',
    loadChildren: () =>
      import('./check-your-mail/check-your-mail.module').then(
        (m) => m.CheckYourMailModule
      ),
  },
  {
    path: 'set-new-password',
    loadChildren: () =>
      import('./set-new-password/set-new-password.module').then(
        (m) => m.SetNewPasswordModule
      ),
  },
  {
    path: 'password-reset-confirmation',
    loadChildren: () =>
      import(
        './password-reset-confirmation/password-reset-confirmation.module'
      ).then((m) => m.PasswordResetConfirmationModule),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    // canActivate: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
