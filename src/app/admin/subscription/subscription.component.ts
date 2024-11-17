import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from 'src/app/providers/data.provider';
import { AlertsAndNotificationsService } from 'src/app/services/alerts-and-notifications.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Card } from 'src/app/structures/card.structure';
declare const UIkit: any;
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  subscriptionPlans: Card[];
  planToEdit: any;
  planToDelete: any;
  subscriptionForm: FormGroup = new FormGroup({
    timePeriod: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    features: new FormArray([], [Validators.required]),
    missingFeatures: new FormArray([]),
  });

  constructor(
    public databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService
  ) {}

  ngOnInit(): void {
    this.databaseService.getAllCard().then((data) => {
      this.subscriptionPlans = [];
      data.forEach((doc) => {
        this.subscriptionPlans.push({ id: doc.id, ...doc.data() } as Card);
      });
    });
  }

  editPlan(plan: Card) {
    this.planToEdit = plan;

    this.subscriptionForm.patchValue({
      timePeriod: plan.timePeriod,
      price: plan.price,
    });
    plan.features?.forEach((feature) => {
      this.addFeature(feature);
    });
    plan.missingFeatures?.forEach((missingFeature) => {
      this.addMissingFeature(missingFeature);
    });
  }
  resetSubscriptionModal() {
    this.subscriptionForm.reset();
    (this.subscriptionForm.get('features') as FormArray).clear();
    (this.subscriptionForm.get('missingFeatures') as FormArray).clear();
    this.planToEdit = null;
  }
  getFeatureControls() {
    return (this.subscriptionForm.get('features') as FormArray).controls;
  }

  addFeature(feature: string = '') {
    (this.subscriptionForm.get('features') as FormArray).push(
      new FormControl(feature, [Validators.required])
    );
  }

  deleteFeature(feature: any) {
    (this.subscriptionForm.get('features') as FormArray).removeAt(
      (this.subscriptionForm.get('features') as FormArray).controls.indexOf(
        feature
      )
    );
  }
  deletePlan() {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteCard(this.planToDelete.id).then(async () => {
      UIkit.modal(document.getElementById('delete-confirm-modal')).hide();
      this.dataProvider.pageSetting.blur = false;
      this.alertService.presentToast('Plan deleted successfully');
      this.ngOnInit();
    });
  }
  getMissingFeatureControls() {
    return (this.subscriptionForm.get('missingFeatures') as FormArray).controls;
  }

  addMissingFeature(feature: string = '') {
    (this.subscriptionForm.get('missingFeatures') as FormArray).push(
      new FormControl(feature, [Validators.required])
    );
  }

  deleteMissingFeature(feature: any) {
    (this.subscriptionForm.get('missingFeatures') as FormArray).removeAt(
      (
        this.subscriptionForm.get('missingFeatures') as FormArray
      ).controls.indexOf(feature)
    );
  }

  async submit() {
    if (this.subscriptionForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      const card = {
        timePeriod: this.subscriptionForm.get('timePeriod')?.value,
        price: this.subscriptionForm.get('price')?.value,
        features: this.subscriptionForm.get('features')?.value,
        missingFeatures: this.subscriptionForm.get('missingFeatures')?.value,
      };
      console.log(this.planToEdit);
      if (this.planToEdit) {
        await this.databaseService.editCard(this.planToEdit.id, card);
        UIkit.modal(document.getElementById('subscription-modal')).hide();
      } else {
        await this.databaseService.addCard(card);
        UIkit.modal(document.getElementById('subscription-modal')).hide();
      }
      this.dataProvider.pageSetting.blur = false;
      if (this.planToEdit) {
        this.alertService.presentToast('Plan edited successfully');
      } else {
        this.alertService.presentToast('Plan added successfully');
      }
      this.ngOnInit();
    }
  }
}
