import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { MonthStats } from 'src/app/structures/month-stats.structure';
import { UserData } from 'src/app/structures/user.structure';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentMonth: string;
  stats: MonthStats;
  prevStats: MonthStats;
  rates: MonthStats;
  activeUsers: UserData[];

  constructor(
    private databaseService: DatabaseService,
    public dataProvider: DataProvider
  ) {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    this.dataProvider.pageSetting.blur = true;

    // Find out current month
    const today = new Date();
    this.currentMonth = today.toLocaleString('en-US', { month: 'long' });

    // Get this month's statistics
    await this.databaseService
      .getAnalytics(today.getMonth(), today.getFullYear())
      .then((doc) => {
        this.stats = {
          bookings: 0,
          cancelled: 0,
          users: 0,
          earnings: 0,
        };
        if (doc.exists()) {
          this.stats = { ...this.stats, ...doc.data() };
        }
      });

    // Get previous month's statistics
    await this.databaseService
      .getAnalytics(
        today.getMonth() != 0 ? today.getMonth() - 1 : 11,
        today.getMonth() != 0 ? today.getFullYear() : today.getFullYear() - 1
      )
      .then((doc) => {
        this.prevStats = {
          bookings: 0,
          cancelled: 0,
          users: 0,
          earnings: 0,
        };
        if (doc.exists()) {
          this.prevStats = { ...this.prevStats, ...doc.data() };
        }
      });

    // Calculate gains & losses
    this.rates = {
      bookings: parseFloat(
        (
          ((this.stats.bookings - this.prevStats.bookings) /
            this.prevStats.bookings) *
          100
        ).toFixed(2)
      ),
      cancelled: parseFloat(
        (
          ((this.stats.cancelled - this.prevStats.cancelled) /
            this.prevStats.cancelled) *
          100
        ).toFixed(2)
      ),
      users: parseFloat(
        (
          ((this.stats.users - this.prevStats.users) / this.prevStats.users) *
          100
        ).toFixed(2)
      ),
      earnings: parseFloat(
        (
          ((this.stats.earnings - this.prevStats.earnings) /
            this.prevStats.earnings) *
          100
        ).toFixed(2)
      ),
    };

    // Set up bookings graph
    const bookingsGraph = document.getElementById(
      'bookings-graph'
    ) as HTMLCanvasElement;
    if (bookingsGraph) {
      // Get graph labels & data
      const months = [];
      var month = today.getMonth();
      var year = today.getFullYear();
      const bookingsData: number[] = [];
      const cancelledData: number[] = [];

      for (var i = 1; i <= 12; i++) {
        // Get labels (month, year)
        months.unshift(
          new Date(year, month).toLocaleDateString('en-us', {
            month: 'short',
            year: '2-digit',
          })
        );

        // Get analytics data for this month
        await this.databaseService.getAnalytics(month, year).then((doc) => {
          var data = {
            bookings: 0,
            cancelled: 0,
          };
          if (doc.exists()) {
            data = { ...this.prevStats, ...doc.data() };
          }
          bookingsData.unshift(data.bookings);
          cancelledData.unshift(data.cancelled);
        });

        year = month == 0 ? year - 1 : year;
        month = month == 0 ? 11 : month - 1;
      }

      new Chart(bookingsGraph, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Bookings',
              data: bookingsData,
              borderColor: '#023e8a',
              tension: 0.2,
            },
            {
              label: 'Cancelled',
              data: cancelledData,
              borderColor: '#ca0b00',
              tension: 0.2,
            },
          ],
        },
      });
    }

    // Get active users
    await this.databaseService.getActiveUsers().then((docs) => {
      this.activeUsers = [];  
      docs.forEach((doc) => {
        this.activeUsers.push(doc.data() as UserData);
      });
      console.log(this.activeUsers);
    });


    this.dataProvider.pageSetting.blur = false;
  }
}
