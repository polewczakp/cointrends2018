   const daily = $("#daily");
   const monthly = $("#monthly");
   const alltime = $("#alltime");

   daily.on("click", function() {
     drawChart("daily");
   })

   monthly.on("click", function() {
     drawChart("monthly");
   })

   alltime.on("click", function() {
     drawChart("alltime");
   })

   function parseTimestamp(dateString) {
     const dateTimeParts = dateString.split(' ');
     const dateParts = dateTimeParts[0].split('-');
     const timeParts = dateTimeParts[1].split(':');
     const date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);

     dateNow = new Date();
	 const offsetFactor = -1/60; // getTimezoneOffset() returns -120 for GMT+2
     timezone = dateNow.getTimezoneOffset() * offsetFactor; 
	 const hour = 3600000; // 1 hour = 3600000 ms
     tzOffset = timezone * hour;
     return date.getTime() + tzOffset;
   }

   function drawChart(period) {
     const btcUrl = "https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=" + period + "&format=json";
     const ethUrl = "https://apiv2.bitcoinaverage.com/indices/global/history/ETHUSD?period=" + period + "&format=json";
     const ltcUrl = "https://apiv2.bitcoinaverage.com/indices/global/history/LTCUSD?period=" + period + "&format=json";

     function fetchBtc() {
       return fetch(btcUrl).then(response => response.json())
     }

     function fetchEth() {
       return fetch(ethUrl).then(response => response.json())
     }

     function fetchLtc() {
       return fetch(ltcUrl).then(response => response.json())
     }

     function fetchData() {
       return Promise.all([fetchBtc(), fetchEth(), fetchLtc()])
     }

     fetchData().then(response => {
       const [btc, eth, ltc] = response
       const mappedBtc = btc.map(item => [parseTimestamp(item.time), item.average]).reverse();
       const mappedEth = eth.map(item => [parseTimestamp(item.time), item.average]).reverse();
       const mappedLtc = ltc.map(item => [parseTimestamp(item.time), item.average]).reverse();

       const options = {
         "chart": {
           "zoomType": "x",
           "borderColor": "#616161",
           "borderWidth": 0,
           "borderRadius": 0,
           "backgroundColor": "#fff",
           "plotBorderWidth": 1,
           "plotBackgroundColor": "#fff"
         },
         "title": {
           "text": "BTC, ETH and LTC prices"
         },
         "subtitle": {
           "text": ""
         },
         "xAxis": [{
           "type": "datetime"
         }],
         "yAxis": [{
             "title": {
               "text": "BTCUSD",
               "style": {
                 "color": "orange"
               }
             },
             "labels": {
               "format": "${value}",
               "style": {
                 "color": "orange"
               }
             },
             "opposite": false,
             "type": "logarithmic"
           },

           {
             "title": {
               "text": "ETHUSD",
               "style": {
                 "color": "grey"
               }
             },
             "labels": {
               "format": "${value}",
               "style": {
                 "color": "grey"
               }
             },
             "opposite": true,
             "type": "logarithmic"
           },


           {
             "title": {
               "text": "LTCUSD",
               "style": {
                 "color": "blue"
               }
             },
             "labels": {
               "format": "${value}",
               "style": {
                 "color": "blue"
               }
             },
             "opposite": true,
             "type": "logarithmic"
           }

         ],
         "legend": {
           "enabled": true,
           "align": "center",
           "verticalAlign": "bottom",
           "y": 23,
           "floating": true
         },
         "plotOptions": {
           "area": {
             "fillColor": {
               "linearGradient": {
                 "x1": 0,
                 "y1": 0,
                 "x2": 0,
                 "y2": 1
               },
               "stops": [
                 [
                   0,
                   "#7cb5ec"
                 ],
                 [
                   1,
                   "rgba(124,181,236,0)"
                 ]
               ]
             },
             "marker": {
               "radius": 2
             },
             "lineWidth": 1,
             "states": {
               "hover": {
                 "lineWidth": 1
               }
             },
             "threshold": null
           },
           "series": {
             "dataLabels": {
               "enabled": false
             }
           }
         },
         "series": [{
             "name": "BTCUSD",
             "type": "line",
             "yAxis": 0,
             "marker": {
               "enabled": false,
               "symbol": "circle"
             },
             "dashStyle": "Solid",
             "color": "orange",
             "colorByPoint": false,
             "data": mappedBtc,
             "_colorIndex": 0
           },

           {
             "name": "ETHUSD",
             "type": "line",
             "yAxis": 1,
             "marker": {
               "enabled": false,
               "symbol": "circle"
             },
             "dashStyle": "Solid",
             "color": null,
             "colorByPoint": false,
             "data": mappedEth,
             "_colorIndex": 1
           },


           {
             "name": "LTCUSD",
             "type": "line",
             "yAxis": 2,
             "marker": {
               "enabled": false,
               "symbol": "circle"
             },
             "dashStyle": "Solid",
             "color": null,
             "colorByPoint": false,
             "data": mappedLtc,
             "_colorIndex": 2
           }

         ],
         "colors": [
           "orange",
           "grey",
           "blue",
           "green",
           "red"
         ],
         "tooltip": {
           "enabled": true,
           "shared": false
         },
         "lang": {
           "resetZoom": "Reset zoom",
           "decimalPoint": "."
         },
         "credits": {
           "enabled": true,
           "text": "Highcharts Cloud",
           "href": "https://cloud.highcharts.com",
           "style": {
             "font-size": "16px"
           }
         },
         "labels": {
           "items": [{

           }]
         },
         "pane": {
           "background": [

           ]
         },
         "responsive": {
           "rules": [

           ]
         },
         "data": {
           "rowsURL": "https://apiv2.bitcoinaverage.com/indices/global/history/LTCUSD?period=daily&format=json",
           "enablePolling": true,
           "dataRefreshRate": "30"
         }
       };
       let chart;

       if (options.yAxis && options.yAxis.length === 1) options.yAxis = options.yAxis[0];
       if (options.xAxis && options.xAxis.length === 1) options.xAxis = options.xAxis[0];
       if (options.zAxis && options.zAxis.length === 1) options.zAxis = options.zAxis[0];

       if (options && (options.lang || options.global)) {
         Highcharts.setOptions({
           global: options.global || {},
           lang: options.lang || {}
         });
       }
       new Highcharts.Chart('container', options);
       // Analytics?
       const r = new XMLHttpRequest();
       r.open('POST', 'https://cloud-api.highcharts.com:443/chart/165154/10/view', true);
       r.setRequestHeader('Content-Type', 'application/json');
       r.send();

     })
   }

   drawChart("daily");