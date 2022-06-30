import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit {
  typeDisplays = [
    {
      type: 1,
      name: 'Value',
    },
    {
      type: 2,
      name: 'Quantity',
    },
  ];
  typeChoseText = '';
  typeChoseKey = 1;
  year = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007];
  yearChose = 2000;
  openingInventory = {
    month_1: 1177,
    month_2: 3525,
    month_3: 6101,
    month_4: 2587,
    month_5: 5329,
    month_6: 4413,
    month_7: 2531,
    month_8: 4905,
    month_9: 6187,
    month_10: 4800,
    month_11: 5726,
    month_12: 5941,
  };
  recieved = {
    month_1: 1177,
    month_2: 3525,
    month_3: 6101,
    month_4: 2587,
    month_5: 5329,
    month_6: 4413,
    month_7: 2531,
    month_8: 4905,
    month_9: 6187,
    month_10: 4800,
    month_11: 5726,
    month_12: 5941,
  };
  delivered = {
    month_1: 1177,
    month_2: 3525,
    month_3: 6101,
    month_4: 2587,
    month_5: 5329,
    month_6: 4413,
    month_7: 2531,
    month_8: 4905,
    month_9: 6187,
    month_10: 4800,
    month_11: 5726,
    month_12: 5941,
  };
  closingInventory = {
    month_1: 1177,
    month_2: 3525,
    month_3: 6101,
    month_4: 2587,
    month_5: 5329,
    month_6: 4413,
    month_7: 2531,
    month_8: 4905,
    month_9: 6187,
    month_10: 4800,
    month_11: 5726,
    month_12: 5941,
  };
  dataList: Array<any> = [];
  displayedColumns: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  rowChose = 0;
  private svg: any;
  private margin = 50;
  private width = 1300 - this.margin * 2;
  private height = 400 - this.margin * 2;
  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }
  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(this.displayedColumns)
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 10000]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.month))
      .attr('y', (d: any) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.value))
      .attr('fill', '#d04a35');
  }
  dataToAnalize: Array<any> = [];

  constructor() {}

  ngOnInit(): void {
    this.typeChoseText = this.typeDisplays[0].name;
    this.typeChoseKey = this.typeDisplays[0].type;
    this.yearChose = this.year[0];
    this.handleMergeData();
    this.handleConvertData(this.dataList[this.rowChose]);
    this.createSvg();
    this.drawBars(this.dataToAnalize);
  }

  handleChangeDisplay(value: number) {
    this.typeChoseText = this.typeDisplays.find((item) => item.type === value)
      ?.name as string;
  }

  handleChangeYear(value: number) {
    this.yearChose = value;
  }

  handleMergeData() {
    this.dataList.push(this.openingInventory);
    this.dataList.push(this.recieved);
    this.dataList.push(this.delivered);
    this.dataList.push(this.closingInventory);
  }

  handleClickRow(row: number) {
    this.rowChose = row;
  }

  handleConvertData(data: any) {
    for (let i = 0; i < Object.keys(data).length; i++) {
      this.dataToAnalize.push({
        month: this.handleGetMonth(i + 1),
        value: data[`month_${i + 1}`],
      });
    }
  }

  handleGetMonth(month: number) {
    const date = new Date();
    date.setMonth(month - 1);

    return date.toLocaleString('en-US', { month: 'short' });
  }
}
