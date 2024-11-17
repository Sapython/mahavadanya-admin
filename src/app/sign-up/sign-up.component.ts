import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertsAndNotificationsService } from '../services/alerts-and-notifications.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../authentication.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
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
}
