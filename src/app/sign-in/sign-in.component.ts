import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertsAndNotificationsService } from '../services/alerts-and-notifications.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../authentication.scss'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  redirect:boolean = false;
  constructor(
    public authService: AuthenticationService,
    private alertify: AlertsAndNotificationsService,
    private activatedRoute:ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params:any) => {
      if (params.redirect=="true") {
        this.authService= params.redirect;
        this.redirect = params.redirect;
      }
    })
  }

  ngOnInit(): void {}

  submit() {
    if (this.signInForm.valid) {
      this.authService.loginEmailPassword(
        this.signInForm.value.email,
        this.signInForm.value.password
      );
    } else {
      this.alertify.presentToast(
        'Please fill all the required fields correctly'
      );
    }
  }
}
