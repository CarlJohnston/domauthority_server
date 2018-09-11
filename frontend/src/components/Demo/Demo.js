import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery.tipsy';

import SiteGraph from 'mixins/SiteGraph';

import Data from './Data';

import 'jquery.tipsy/src/jquery.tipsy.css';

window.$ = window.jQuery = $;

const CONTAINER_ID = 'd3-graph';


class Demo extends Component {
  componentDidMount() {
    this.siteGraph = new SiteGraph(CONTAINER_ID);

    const initialData = JSON.parse(JSON.stringify(Data.data));

    const currentData = JSON.parse(JSON.stringify(initialData));

    this.siteGraph.update(initialData);

    Date.isLeapYear = function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) ||
              (year % 400 === 0));
    };

    Date.getDaysInMonth = function (year, month) {
      return [
        31,
        (Date.isLeapYear(year) ? 29 : 28),
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
      ][month];
    };

    Date.prototype.isLeapYear = function () {
      return Date.isLeapYear(this.getFullYear());
    };

    Date.prototype.getDaysInMonth = function () {
      return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
    };

    Date.prototype.addMonths = function (value) {
      let n = this.getDate();
      this.setDate(1);
      this.setMonth(this.getMonth() + value);
      this.setDate(Math.min(n, this.getDaysInMonth()));
      return this;
    };

    const max = 50;
    const interval = 2300;

    let counter = 0;
    this.timer = setInterval(() => {
      if (counter++ >= max) {
        return;
      }

      for (let i = 0; i < 4; i++) {
        const currentSite = currentData[`Site${parseInt(i + 1, 10)}`];

        const lastItemObject = currentSite[currentSite.length - 1];

        let newNumber;
        if (lastItemObject.da === 100) {
          newNumber = this.getRandomInt(85,90);
        } else if (lastItemObject.da === 0) {
          newNumber = this.getRandomInt(10,15);
        } else {
          newNumber = this.valBetween(lastItemObject.da + this.getRandomInt(-10, 10), 0, 100);
        }

        const previousDate = lastItemObject.date;
        const previousYear = previousDate.toString().slice(0, 4, 10);
        const previousMonth = parseInt(previousDate.toString().slice(5, 7), 10);
        const previousDay = parseInt(previousDate.toString().slice(8, 10), 10);

        const currentDate = new Date(
          previousYear,
          previousMonth - 1,
          previousDay,
        );
        currentDate.addMonths(1);

        currentData[`Site${parseInt(i + 1, 10)}`].push({
          da: newNumber,
          date: currentDate.toISOString().slice(0, 10),
        });
      }

      const copiedData = JSON.parse(JSON.stringify(currentData));

      this.siteGraph.update(copiedData);
    }, interval);

    const chart = $('#chart');
    const aspect = chart.width() / chart.height();
    const container = chart.parent();

    $(window).on('resize', () => {
      const targetWidth = container.width();
      chart.attr('width', targetWidth);
      chart.attr('height', Math.round(targetWidth / aspect));
    }).trigger('resize');
  }

  componentWillUnmount() {
    clearInterval(this.timer);

    $(window).off('resize');
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  valBetween(v, min, max) {
    return (Math.min(max, Math.max(min, v)));
  }

  render() {
    return (
      <div id={CONTAINER_ID}>
      </div>
    );
  }
}

export default Demo;
