import { Route } from '@angular/router';
import { AnalyzeComponent } from './pages/analyze/analyze.component';
import { StatisticComponent } from './pages/statistic/statistic.component';

export const routing: Route[] = [
  {
    path: 'statistic',
    component: StatisticComponent,
  },
  {
    path: 'analyze',
    component: AnalyzeComponent,
  },
];
