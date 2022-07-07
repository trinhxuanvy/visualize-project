import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { cloneDeep } from 'lodash';
import { Category, OrderDetail, Product } from '../../database/index';

interface DataItem {
  type: string;
  value: number;
  color?: string;
  rating?: number;
}

interface DataAnalyze {
  quantityOrdered: Array<DataItem>;
  avgPrice: Array<DataItem>;
}

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss'],
})
export class AnalyzeComponent implements OnInit {
  catogories = Category;
  typeChoseText = '';
  typeChoseKey = 1;
  year = [2019, 2020, 2021];
  yearChose = 2000;
  dataList: Array<any> = [];
  displayedColumnsChart: string[] = [];
  colorList: string[] = ['#D52028', '#FB6837', '#FFAE38', '#87D44B', '#26B53A'];
  quantityOrdered: DataItem[] = [];
  avgPrice: DataItem[] = [];
  displayChart0 = true;
  displayChart1 = true;
  private svg: any;
  private margin = 50;
  private width = 1300 - this.margin * 2;
  private height = 400 - this.margin * 2;
  colorLines: string[] = ['#52AFC0', '#19DEAD'];
  colorBars: string[] = ['#A03472'];
  private createSvg(): void {
    this.svg = d3.select('figure#bar').selectChildren('svg').remove();
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + 50 + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
    this.svg
      .append('text')
      .attr('transform', 'rotate(0)')
      .attr('x', -30)
      .attr('y', -20)
      .text('Quantity Ordered')
      .style('font-size', '12px');
    this.svg
      .append('text')
      .attr('transform', 'rotate(0)')
      .attr('x', this.width - 20)
      .attr('y', -20)
      .text('Price')
      .style('font-size', '12px');
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
    maxY: number
  ): void {
    console.log(data);
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
      .attr('transform', 'translate(15,0) rotate(-15)')
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
      .attr('x', (d: any) => x(d.type))
      .attr('y', (d: any) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', (d: any) => d.color)
      .attr('style', 'cursor: pointer')
      .attr('height', (d: any) => height - y(d.value))
      .on('mousemove', (e: any, d: any) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`Quantity Ordered: <span>${d.value}</span>`)
          .style('left', `${e.offsetX}px`)
          .style('top', `${e.offsetY + 220}px`);
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
    maxY: number
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
      .attr('transform', 'translate(15,0) rotate(-15)')
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
      .attr('cx', (d: any) => x(d.type))
      .attr('cy', (d: any) => y(d.value))
      .attr('r', 5)
      .attr('transform', 'translate(' + 60 + ',' + 0 + ')')
      .attr('fill', color)
      .attr('stroke', 'none')
      .attr('style', 'cursor: pointer; z-index: 9999999')
      .attr('class', `line ${display ? '' : 'd-none'}`)
      .on('mousemove', (e: any, d: any) => {
        console.log(g.node());
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`Price: <span>${d.value}</span>`)
          .style('left', `${e.offsetX}px`)
          .style('top', `${e.offsetY + 220}px`);
      })
      .on('mouseout', () =>
        tooltip.transition().duration(500).style('opacity', 0)
      );

    var line = d3
      .line()
      .x((d: any) => x(d.type) as any)
      .y((d: any) => y(d.value) as any)
      .curve(d3.curveMonotoneX);

    posDraw
      .append('path')
      .datum(data)
      .attr('class', `line ${display ? '' : 'd-none'}`)
      .attr('x', (d: any) => x(d.type))
      .attr('y', (d: any) => y(d.value))
      .attr('transform', 'translate(' + 60 + ',' + 0 + ')')
      .attr('style', 'cursor: pointer; z-index: 9999999')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', color)
      .style('stroke-width', '2');
  }
  constructor() {}

  ngOnInit(): void {
    this.typeChoseText = this.catogories[0].categoryName;
    this.typeChoseKey = this.catogories[0].categoryId;
    this.yearChose = this.year[0];
    this.handleGetQuantityOrder();
    this.createSvg();
    this.handleAddChart();
  }

  handleAddChart() {
    this.drawBars(
      this.svg,
      this.width,
      this.height,
      this.quantityOrdered,
      this.displayedColumnsChart,
      'left',
      this.colorBars[0],
      this.displayChart0,
      0,
      1000
    );
    this.drawLines(
      this.svg,
      this.width,
      this.height,
      this.avgPrice,
      this.displayedColumnsChart,
      'right',
      this.colorLines[0],
      this.displayChart1,
      0,
      100
    );
  }

  handleChangeDisplay(value: number) {
    this.typeChoseText = this.catogories.find(
      (item) => item.categoryId === value
    )?.categoryName as string;
    this.typeChoseKey = value;
    this.handleGetQuantityOrder();
    this.createSvg();
    this.handleAddChart();
  }

  handleGetQuantityOrder() {
    const product = Product.filter(
      (item) => item.categoryId === this.typeChoseKey
    );
    const orderDetail = OrderDetail.filter(
      (item) =>
        item.categoryId === this.typeChoseKey &&
        new Date(item.orderDate).getFullYear() === this.yearChose
    );
    const resutlAvgPrice: DataItem[] = [];
    const resultQuantityOrder: DataItem[] = [];
    this.displayedColumnsChart = [];
    let sum = 0,
      rating = 0,
      count = 0,
      avgPriveSum = 0;
    if (product.length && orderDetail.length) {
      product.forEach((p) => {
        orderDetail.forEach((o) => {
          if (p.productId === o.productId) {
            sum += o.quantity;
            rating += o.rating;
            count += 1;
            avgPriveSum += o.price;
          }
        });
        let finalRating = Math.round(rating / count);
        resultQuantityOrder.push({
          type: p.productName,
          value: sum,
          color: this.colorList[finalRating - 1],
          rating: finalRating,
        });
        resutlAvgPrice.push({
          type: p.productName,
          value: avgPriveSum / count,
        });
        console.log(resutlAvgPrice);
        avgPriveSum = 0;
        sum = 0;
        rating = 0;
        count = 0;
        this.displayedColumnsChart.push(p.productName);
      });
    }

    this.quantityOrdered = resultQuantityOrder;
    this.avgPrice = resutlAvgPrice;
  }

  handleChangeYear(value: number) {
    this.yearChose = value;
    this.handleGetQuantityOrder();
    this.createSvg();
    this.handleAddChart();
  }

  handleHideShowChart(chartId: number) {
    if (chartId === 0) {
      this.displayChart0 = !this.displayChart0;
    } else if (chartId === 1) {
      this.displayChart1 = !this.displayChart1;
    }

    this.createSvg();
    this.handleAddChart();
  }
}
