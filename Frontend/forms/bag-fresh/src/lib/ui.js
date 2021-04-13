import 'chartist/dist/chartist.min.css';
import 'chartist-plugin-fill-donut';
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize';
import '../css/style.css';

const Chartist = require('chartist');
require('chartist-plugin-legend');
const $ = require('jquery');

const container = $('<div></div>');
container.attr('id', 'message-container');
container.prependTo($('body'));

function message(title, text, color, icon) {
  const card = $(`<div style='vertical-align: top; margin: 16px; margin-bottom: 0; background-color: ${color};' class='card wide'><div>`);
  const inner = $("<div class='card-content white-text'></div>");
  card.append(inner);
  inner.append(`<span class='card-title' style='display: flex; '><i class='material-icons' style='font-size: 32px; margin-right: 12px;'>${icon}</i>${title}</span>`);
  inner.append(`<p>${text}</p>`);
  $('body').append(card);
}

export function info(title, text) {
  message(title, text, '#03A9F4', 'info');
}

export function warning(title, text) {
  message(title, text, '#FFC107', 'warning');
}

export function error(title, text) {
  message(title, text, '#F44336', 'error');
}

export function success(title, text) {
  message(title, text, '#029900', 'info');
}

let donutCount = 0;
let plotCount = 0;

function createCard(title, text, innerId) {
  const card = $("<div style='margin: 16px; margin-bottom: 0;' class='card primary-bg wide'><div>");
  const inner = $("<div class='card-content white-text'></div>");
  card.append(inner);
  inner.append(`<span class='card-title'>${title}</span>`);
  inner.append(`<p>${text}</p>`);
  inner.append(`<div id='${innerId}' class='donut'></div><div class="legend"></div>`);
  return card;
}

export function linspace(start, stop, n) {
  const arr = [];
  const increment = (stop - start) / n;

  for (let i = 0; i < n; i += 1) {
    arr.push(i * increment + start);
  }

  return arr;
}

export function plot(
  data,
  title,
  {
    min = null,
    max = null,
    axisX = {
      labelInterpolationFnc() {
        return null;
      },
    },
  } = {},
) {
  const id = `plot_${plotCount}`;
  plotCount += 1;

  const card = createCard(title, '', id);
  $('body').append(card);

  $(`#${id}`).addClass('ct-chart ct-golden-section plot');

  Chartist.Line(`#${id}`, data, {
    axisX,
    low: min == null ? undefined : min,
    high: max == null ? undefined : max,
  });
}

export function plotxy(
  seriesX,
  seriesY,
  title,
  {
    min = null,
    max = null,
    axisX = {
      type: Chartist.FixedScaleAxis,
      divisor: 4,
      labelInterpolationFnc(v) {
        return v.toFixed(2);
      },
    },
  } = {},
) {
  const id = `plot_${plotCount}`;
  plotCount += 1;

  const card = createCard(title, '', id);
  $('body').append(card);

  $(`#${id}`).addClass('ct-chart ct-golden-section plot');

  const data = seriesX.map((v, i) => ({
    x: v,
    y: seriesY[i],
  }));

  Chartist.Line(
    `#${id}`,
    {
      name: title,
      series: [
        {
          data,
        },
      ],
    },
    {
      axisX,
      low: min == null ? undefined : min,
      high: max == null ? undefined : max,
    },
  );
}

export function multixy(
  seriesX,
  seriesY,
  title,
  titles,
  {
    min = null,
    max = null,
    axisX = {
      type: Chartist.FixedScaleAxis,
      divisor: 4,
    },
  } = {},
) {
  const id = `plot_${plotCount}`;
  plotCount += 1;

  const card = createCard(title, '', id);
  $('body').append(card);

  $(`#${id}`).addClass('ct-chart ct-golden-section plot');

  const series = [];
  seriesX.forEach((x, idx) => {
    series.push({
      name: titles[idx],
      data: x.map((v, i) => ({
        x: v,
        y: seriesY[idx][i],
      })),
    });
  });

  Chartist.Line(
    `#${id}`,
    {
      series,
    },
    {
      axisX,
      low: min == null ? undefined : min,
      high: max == null ? undefined : max,
      chartPadding: {
        right: 40,
      },
      fullWidth: true,
      plugins: [
        Chartist.plugins.legend({
          position: $('.legend', card)[0],
        }),
      ],
    },
  );
}

export function barchart(
  data,
  title,
  {
    min = null,
    max = null,
    axisX = {
      labelInterpolationFnc() {
        return null;
      },
    },
  } = {},
) {
  const id = `plot_${plotCount}`;
  plotCount += 1;

  const card = createCard(title, '', id);
  $('body').append(card);

  $(`#${id}`).addClass('bar-width ct-chart ct-golden-section plot');

  Chartist.Bar(`#${id}`, data, {
    seriesBarDistance: 20,
    axisX,
    low: min == null ? undefined : min,
    high: max == null ? undefined : max,
  });
}

export function donut(text, value, pct, icon) {
  const id = `donut_${donutCount}`;
  donutCount += 1;

  const card = createCard(text, '', id);
  $('body').append(card);

  const x1 = 220 * pct;
  const x2 = 220 * (1 - pct);

  Chartist.Pie(
    `#${id}`,
    {
      series: [x1, x2],
      labels: ['', ''],
    },
    {
      donut: true,
      donutWidth: 20,
      startAngle: 210,
      total: 260,
      showLabel: false,
      plugins: [
        Chartist.plugins.fillDonut({
          items: [
            {
              content: `<i class="material-icons">${icon}</i>`,
              position: 'bottom',
              offsetY: 10,
              offsetX: -2,
            },
            {
              content: value,
            },
          ],
        }),
      ],
    },
  );
}

export function button(text, cb = () => {}) {
  const b = $(`<a style="margin: 1.5em" class="waves-effect waves-light btn primary-bg wide">${text}</a>`);
  $('body').append(b);
  b.click(cb);
}

export function chunkArray(myArray, size) {
  const target = myArray.slice(0);
  const results = [];

  while (target.length) {
    results.push(target.splice(0, size));
  }

  return results;
}
