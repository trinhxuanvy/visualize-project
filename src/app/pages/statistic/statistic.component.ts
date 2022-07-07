import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { cloneDeep } from 'lodash';
import {
  Category,
  OrderDetail,
  Product,
  ImportDetail,
} from '../../database/index';

interface DataItem {
  month: string;
  value: number;
  color?: string;
}

interface DataAnalyze {
  openingInventory: Array<DataItem>;
  received: Array<DataItem>;
  delivered: Array<DataItem>;
  closingInventory: Array<DataItem>;
}

enum DataAnalyzeEnum {
  openingInventory = 0,
  received = 1,
  delivered = 2,
  closingInventory = 3,
}

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
  year = [2019, 2020, 2021];
  yearChose = 2019;
  openingInventory = {};
  received = {};
  delivered = {};
  closingInventory = {};
  dataList: Array<any> = [];
  displayedColumns: string[] = [
    'Name',
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
    'Year',
  ];
  displayedColumnsChart: string[] = [
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
  displayChart0 = true;
  displayChart1 = true;
  displayChart2 = true; // 0: closing, 1: received, 2: delivered
  private svg: any;
  private margin = 50;
  private width = 1300 - this.margin * 2;
  private height = 400 - this.margin * 2;
  private createSvg(): void {
    this.svg = d3.select('figure#bar').selectChildren('svg').remove();
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
    this.svg
      .append('text')
      .attr('transform', 'rotate(0)')
      .attr('x', -30)
      .attr('y', -20)
      .text(this.typeChoseText);
  }
  private drawBars(
    posDraw: any,
    width: number,
    height: number,
    data: DataItem[],
    xKey: any,
    yLocation: 'left' | 'right',
    color: string,
    display: boolean,
    minY: number,
    maxY: number,
    nameTooltip: string
  ): void {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Create the X-axis band scale
    const x = d3.scaleBand().range([0, width]).domain(xKey).padding(0.2);

    // Draw the X-axis on the DOM
    posDraw
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([minY, maxY]).range([height, 0]);

    var g = posDraw.append('g');
    // Draw the Y-axis on the DOM
    if (yLocation === 'left') {
      g.call(d3.axisLeft(y));
    } else {
      g.call(d3.axisRight(y)).attr('transform', `translate(${width}, 0)`);
    }

    // Create and fill the bars
    posDraw
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', `${display ? '' : 'd-none'}`)
      .attr('x', (d: any) => x(d.month))
      .attr('y', (d: any) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', color)
      .attr('style', 'cursor: pointer')
      .attr('height', (d: any) => height - y(d.value))
      .on('mousemove', (e: any, d: any) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${nameTooltip}: <span>${d.value}</span>`)
          .style('left', `${e.offsetX}px`)
          .style('top', `${e.offsetY + 460}px`);
      })
      .on('mouseout', () =>
        tooltip.transition().duration(500).style('opacity', 0)
      );
  }
  private drawLines(
    posDraw: any,
    width: number,
    height: number,
    data: DataItem[],
    xKey: any,
    yLocation: 'left' | 'right',
    color: string,
    display: boolean,
    minY: number,
    maxY: number,
    nameTooltip: string
  ): void {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    const x = d3.scaleBand().range([0, width]).domain(xKey).padding(0.2);
    // Draw the X-axis on the DOM
    posDraw
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)')
      .style('text-anchor', 'end');
    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([minY, maxY]).range([height, 0]);

    // Draw the Y-axis on the DOM

    var g = this.svg.append('g');
    if (yLocation === 'left') {
      g.append('g').call(d3.axisLeft(y));
    } else {
      g.append('g')
        .call(d3.axisRight(y))
        .attr('transform', `translate(${width}, 0)`);
    }
    // Create and fill the lines
    posDraw
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => x(d.month))
      .attr('cy', (d: any) => y(d.value))
      .attr('r', 5)
      .attr('transform', 'translate(' + 40 + ',' + 0 + ')')
      .attr('fill', color)
      .attr('stroke', 'none')
      .attr('style', 'cursor: pointer; z-index: 9999999')
      .attr('class', `line ${display ? '' : 'd-none'}`)
      .on('mousemove', (e: any, d: any) => {
        console.log(g.node());
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${nameTooltip}: <span>${d.value}</span>`)
          .style('left', `${e.offsetX}px`)
          .style('top', `${e.offsetY + 460}px`);
      })
      .on('mouseout', () =>
        tooltip.transition().duration(500).style('opacity', 0)
      );

    var line = d3
      .line()
      .x((d: any) => x(d.month) as any)
      .y((d: any) => y(d.value) as any)
      .curve(d3.curveMonotoneX);

    posDraw
      .append('path')
      .datum(data)
      .attr('class', `line ${display ? '' : 'd-none'}`)
      .attr('x', (d: any) => x(d.month))
      .attr('y', (d: any) => y(d.value))
      .attr('transform', 'translate(' + 40 + ',' + 0 + ')')
      .attr('style', 'cursor: pointer; z-index: 9999999')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', color)
      .style('stroke-width', '2');
  }
  dataToAnalize: DataAnalyze = {
    openingInventory: [],
    received: [],
    delivered: [],
    closingInventory: [],
  };
  colorList: string[] = [
    '#D84B20',
    '#FAD201',
    '#75151E',
    '#6C6960',
    '#EE6494',
    '#4C9141',
    '#20214F',
    '#A03472',
    '#FF5C5C',
    '#1ABC9C',
    '#FE0000',
    '#C2B078',
    '#9D9101',
  ];
  colorLines: string[] = ['#DF6B06', '#19DEAD'];
  colorBars: string[] = ['#A03472'];
  range = {
    min: 0,
    max: 0,
  };

  constructor() {}

  ngOnInit(): void {
    this.typeChoseText = this.typeDisplays[0].name;
    this.typeChoseKey = this.typeDisplays[0].type;
    this.yearChose = this.year[0];
    this.handleAnalyzeData();
    this.handleMergeData();
    this.handleConvertData(this.dataList[1], 1);
    this.handleConvertData(this.dataList[3], 3);
    this.handleConvertData(this.dataList[2], 2);
    this.createSvg();
    this.handleAddChart();
  }

  handleAddChart() {
    this.drawBars(
      this.svg,
      this.width,
      this.height,
      this.dataToAnalize.closingInventory,
      this.displayedColumnsChart,
      'left',
      this.colorBars[0],
      this.displayChart0,
      this.range.min,
      this.range.max,
      this.typeChoseText
    );
    this.handleConvertData(this.dataList[1], 1);
    this.drawLines(
      this.svg,
      this.width,
      this.height,
      this.dataToAnalize.received,
      this.displayedColumnsChart,
      'left',
      this.colorLines[0],
      this.displayChart1,
      this.range.min,
      this.range.max,
      this.typeChoseText
    );
    this.handleConvertData(this.dataList[2], 2);
    this.drawLines(
      this.svg,
      this.width,
      this.height,
      this.dataToAnalize.delivered,
      this.displayedColumnsChart,
      'left',
      this.colorLines[1],
      this.displayChart2,
      this.range.min,
      this.range.max,
      this.typeChoseText
    );
  }

  handleChangeDisplay(value: number) {
    this.typeChoseText = this.typeDisplays.find((item) => item.type === value)
      ?.name as string;
    this.typeChoseKey = value;

    this.handleAnalyzeData();
    this.handleMergeData();
    this.handleConvertData(this.dataList[1], 1);
    this.handleConvertData(this.dataList[3], 3);
    this.handleConvertData(this.dataList[2], 2);
    this.createSvg();
    this.handleAddChart();
  }

  handleChangeYear(value: number) {
    this.yearChose = value;

    this.handleAnalyzeData();
    this.handleMergeData();
    this.handleConvertData(this.dataList[1], 1);
    this.handleConvertData(this.dataList[3], 3);
    this.handleConvertData(this.dataList[2], 2);
    this.createSvg();
    this.handleAddChart();
  }

  handleMergeData() {
    this.dataList = [];
    this.dataList.push(this.openingInventory);
    this.dataList.push(this.received);
    this.dataList.push(this.delivered);
    this.dataList.push(this.closingInventory);
  }

  handleClickRow(row: number) {
    this.handleConvertData(this.dataList[row], row);
  }

  handleGetItemDateType(item: number) {
    return (
      (item === DataAnalyzeEnum.openingInventory && 'openingInventory') ||
      (item === DataAnalyzeEnum.delivered && 'delivered') ||
      (item === DataAnalyzeEnum.closingInventory && 'closingInventory') ||
      'received'
    );
  }

  handleConvertData(data: any, item: number) {
    this.dataToAnalize[this.handleGetItemDateType(item)] = [];
    for (let i = 0; i < Object.keys(data).length; i++) {
      if (i !== 0 && i !== Object.keys(data).length - 1) {
        this.dataToAnalize[this.handleGetItemDateType(item)].push({
          month: this.handleGetMonth(i),
          value: data[`month_${i}`],
        });
      }
    }
    console.log(this.dataToAnalize);
  }

  handleGetMonth(month: number) {
    const date = new Date();
    date.setMonth(month - 1);

    return date.toLocaleString('en-US', { month: 'short' });
  }

  handleHideShowChart(chartId: number) {
    if (chartId === 0) {
      this.displayChart0 = !this.displayChart0;
    } else if (chartId === 1) {
      this.displayChart1 = !this.displayChart1;
    } else {
      this.displayChart2 = !this.displayChart2;
    }

    this.createSvg();
    this.handleAddChart();
  }

  handleAnalyzeData() {
    const getHistory: any = localStorage.getItem('analyze');
    let pa = [];
    if (getHistory) {
      pa = JSON.parse(getHistory);
    }

    const a = pa.find(
      (i: any) => i.type === this.typeChoseKey && i.year === this.yearChose - 1
    );

    console.log(a);
    //const getIn = getHistory.fo;
    let openStart: any = {
      name: 'Opening Inventory',
      month_1: a?.total || 0,
      month_2: 0,
      month_3: 0,
      month_4: 0,
      month_5: 0,
      month_6: 0,
      month_7: 0,
      month_8: 0,
      month_9: 0,
      month_10: 0,
      month_11: 0,
      month_12: 0,
      year: 0,
    };
    let receivedCal: any = {
        name: 'Received',
        month_1: 0,
        month_2: 0,
        month_3: 0,
        month_4: 0,
        month_5: 0,
        month_6: 0,
        month_7: 0,
        month_8: 0,
        month_9: 0,
        month_10: 0,
        month_11: 0,
        month_12: 0,
        year: 0,
      },
      deliveredCal: any = {
        name: 'Delivered',
        month_1: 0,
        month_2: 0,
        month_3: 0,
        month_4: 0,
        month_5: 0,
        month_6: 0,
        month_7: 0,
        month_8: 0,
        month_9: 0,
        month_10: 0,
        month_11: 0,
        month_12: 0,
        year: 0,
      },
      closeCal: any = {
        name: 'Closing Inventory',
        month_1: 0,
        month_2: 0,
        month_3: 0,
        month_4: 0,
        month_5: 0,
        month_6: 0,
        month_7: 0,
        month_8: 0,
        month_9: 0,
        month_10: 0,
        month_11: 0,
        month_12: 0,
        year: 0,
      };
    const receivedData = ImportDetail.filter(
      (item) => new Date(item.orderDate).getFullYear() === this.yearChose
    );
    const deliveredData = OrderDetail.filter(
      (item) => new Date(item.orderDate).getFullYear() === this.yearChose
    );
    const monthNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    if (this.typeChoseKey === 2) {
      monthNumber.forEach((i) => {
        receivedData.forEach((item) => {
          let m: any = item.orderDate.split('/');
          if (parseInt(m[1]) === i) {
            receivedCal[`month_${i}`] += item.quantity;
          }
        });
        deliveredData.forEach((item) => {
          let m: any = item.orderDate.split('/');
          if (parseInt(m[1]) === i) {
            deliveredCal[`month_${i}`] += item.quantity;
          }
        });

        closeCal[`month_${i}`] =
          openStart[`month_${i}`] +
          receivedCal[`month_${i}`] -
          deliveredCal[`month_${i}`];
        if (i !== 12) {
          openStart[`month_${i + 1}`] = closeCal[`month_${i}`];
        }
      });
    } else {
      monthNumber.forEach((i) => {
        receivedData.forEach((item) => {
          let m: any = item.orderDate.split('/');
          if (parseInt(m[1]) === i) {
            receivedCal[`month_${i}`] += item.quantity * item.price;
          }
        });
        deliveredData.forEach((item) => {
          let m: any = item.orderDate.split('/');
          if (parseInt(m[1]) === i) {
            deliveredCal[`month_${i}`] += item.quantity * item.price;
          }
        });

        closeCal[`month_${i}`] =
          openStart[`month_${i}`] +
          receivedCal[`month_${i}`] -
          deliveredCal[`month_${i}`];
        if (i !== 12) {
          openStart[`month_${i + 1}`] = closeCal[`month_${i}`];
        }
      });
    }

    let totalRec = 0,
      totalDev = 0,
      totalClose = closeCal.month_12,
      totalOpen;
    monthNumber.forEach((i) => {
      totalRec += receivedCal['month_' + i];
      totalDev += deliveredCal['month_' + i];
    });
    totalOpen = totalDev + totalClose - totalRec;
    this.openingInventory = cloneDeep({ ...openStart, year: totalOpen });
    this.received = cloneDeep({ ...receivedCal, year: totalRec });
    this.delivered = cloneDeep({ ...deliveredCal, year: totalDev });
    this.closingInventory = cloneDeep({ ...closeCal, year: totalClose });

    const openSave = [];
    const openIndex = pa.findIndex(
      (i: any) => i.year === this.yearChose && i.type === this.typeChoseKey
    );
    if (openIndex > -1) {
      //pa[openIndex].total = closeCal.month_12;
      //localStorage.setItem('analyze', JSON.stringify(pa));
    } else {
      pa.push({
        type: this.typeChoseKey,
        year: this.yearChose,
        total: closeCal.month_12,
      });
      localStorage.setItem('analyze', JSON.stringify(pa));
    }

    const rec: any = {},
      dev: any = {},
      open: any = {},
      close: any = {};
    monthNumber.forEach((i) => {
      rec[`month_${i}`] = receivedCal[`month_${i}`];
      dev[`month_${i}`] = deliveredCal[`month_${i}`];
      open[`month_${i}`] = openStart[`month_${i}`];
      close[`month_${i}`] = closeCal[`month_${i}`];
    });

    const rangeRec = this.getMinMaxObj(rec);
    const rangeDev = this.getMinMaxObj(dev);
    const rangeOpen = this.getMinMaxObj(open);
    const rangeClose = this.getMinMaxObj(close);

    console.log(rangeClose);

    this.range = {
      min: 0,
      max: this.createMaxNumber(
        Math.max(rangeRec.max, rangeClose.max, rangeDev.max)
      ),
    };
  }

  getMinMaxObj(obj: Object) {
    console.log(Math.min(...Object.values(obj)), 'min');
    console.log(Math.max(...Object.values(obj)), 'max');
    return {
      min: Math.min(...Object.values(obj)),
      max: Math.max(...Object.values(obj)),
    };
  }

  createMaxNumber(value: number) {
    const cvt = value.toString();
    const len = value.toString().length;
    return Math.round(value * 1.5); //this.leftPadWithZeros(parseInt(cvt[0]), len);
  }

  leftPadWithZeros(number: number, length: number) {
    var str = '' + number;
    while (str.length <= length) {
      str = str + '0';
    }
    return parseInt(str);
  }
}
