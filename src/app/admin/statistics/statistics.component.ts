import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DatabaseService } from 'src/app/services/database.service';
import { Card } from 'src/app/structures/card.structure';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  subscriptionPlans: Card[];

  constructor(private databaseService: DatabaseService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.databaseService.getAllCard().then((data) => {
      this.subscriptionPlans = [];
      data.forEach((doc) => {
        this.subscriptionPlans.push({ id: doc.id, ...doc.data() } as Card);
      });
    });

    const pricingGraph = document.getElementById(
      'pricing-graph'
    ) as HTMLCanvasElement;
    if (pricingGraph) {
      const lineChart = new Chart(pricingGraph, {
        type: 'line',
        data: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
          datasets: [
            {
              label: 'Bookings',
              data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40],
              borderColor: '#4E8CE8',
              tension: 0.2,
            },
            {
              label: 'Cancelled',
              data: [45, 29, 40, 41, 26, 15, 10, 45, 29, 40, 41, 26, 15, 10],
              borderColor: '#E25454',
              tension: 0.2,
            },
          ],
        },
      });
    }
  }
}
