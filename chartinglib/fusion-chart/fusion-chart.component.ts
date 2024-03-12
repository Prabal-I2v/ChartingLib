import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fusion-chart',
  templateUrl: './fusion-chart.component.html',
  styleUrls: ['./fusion-chart.component.scss']
})
export class FusionChartComponent implements OnInit {
  dataSource: Object;
  mslineDataSource : Object;
  donutDataSource : Object;
  singledonutDataSource : Object;
  stackeddataSource : Object;
  scrollStackedSource : Object;
  heatmapSource : Object;
  worldDataSource : Object;
  constructor() {
    //STEP 2 - Chart Data
    const chartData = [
      {
        label: "Venezuela",
        value: "290"
      },
      {
        label: "Saudi",
        value: "260"
      },
      {
        label: "Canada",
        value: "180"
      },
      {
        label: "Iran",
        value: "140"
      },
      {
        label: "Russia",
        value: "115"
      },
      {
        label: "UAE",
        value: "100"
      },
      {
        label: "US",
        value: "30"
      },
      {
        label: "China",
        value: "30"
      }
    ];
    // STEP 3 - Chart Configuration
    const dataSource = {
      chart: {
        //Set the chart caption
        caption: "Countries With Most Oil Reserves [2017-18]",
        //Set the chart subcaption
        subCaption: "In MMbbl = One Million barrels",
        //Set the x-axis name
        xAxisName: "Country",
        //Set the y-axis name
        yAxisName: "Reserves (MMbbl)",
        numberSuffix: "K",
        //Set the theme for your chart
        theme: "gammel"
      },
      // Chart Data - from step 2
      data: chartData
    };
    this.dataSource = dataSource;

    const mslineData = {
      chart: {
        caption: "Reach of Social Media Platforms amoung Adults",
        yaxisname: "% of Adults on this platform",
        subcaption: "2018-2023",
        showhovereffect: "1",
        numbersuffix: "%",
        drawcrossline: "1",
        plottooltext: "<b>$dataValue</b> of Adults were on $seriesName",
        theme: "fusion"
      },
      categories: [
        {
          category: [
            {
              label: "2018"
            },
            {
              label: "2019"
            },
            {
              label: "2021"
            },
            {
              label: "2023"
            }
          ]
        }
      ],
      dataset: [
        {
          seriesname: "Facebook",
          data: [
            {
              value: "68"
            },
            {
              value: "69"
            },
            {
              value: "69"
            },
            {
              value: "68"
            }
          ]
        },
        {
          seriesname: "Instagram",
          data: [
            {
              value: "35"
            },
            {
              value: "37"
            },
            {
              value: "40"
            },
            {
              value: "47"
            },
            {
              value: "29"
            }
          ]
        },
        {
          seriesname: "LinkedIn",
          data: [
            {
              value: "25"
            },
            {
              value: "27"
            },
            {
              value: "28"
            },
            {
              value: "30"
            }
          ]
        },
        {
          seriesname: "Twitter",
          data: [
            {
              value: "24"
            },
            {
              value: "22"
            },
            {
              value: "23"
            },
            {
              value: "22"
            }
          ]
        }
      ]
    };

    this.mslineDataSource = mslineData;

    const donutdata = {
      chart: {
        caption: "Android Distribution for our app",
        subcaption: "For all users in 2023",
        showpercentvalues: "1",
        defaultcenterlabel: "Android Distribution",
        aligncaptionwithcanvas: "0",
        captionpadding: "0",
        decimals: "1",
        plottooltext:
          "<b>$percentValue</b> of our Android users are on <b>$label</b>",
        centerlabel: "# Users: $value",
        theme: "fusion"
      },
      data: [
        {
          label: "Ice Cream Sandwich",
          value: "1067550000"
        },
        {
          label: "Jelly Bean",
          value: "572550000"
        },
        {
          label: "Kitkat",
          value: "544500000"
        },
        {
          label: "Lollipop",
          value: "290760000"
        },
        {
          label: "Marshmallow",
          value: "197670000"
        }
      ]
    };

    this.donutDataSource = donutdata;

    const singledonutdata = {
      chart: {
        caption: "<p>Hello</p>Android Distribution for our app",
        subcaption: "For all users in 2023",
        showpercentvalues: "1",
        defaultcenterlabel: "Android Distribution",
        aligncaptionwithcanvas: "0",
        captionpadding: "0",
        decimals: "1",
        plottooltext:
          "<b>$percentValue</b> of our Android users are on <b>$label</b>",
        centerlabel: "# Users: $value",
        theme: "fusion"
      },
      data: [
        {
          label: "Ice Cream Sandwich",
          value: "1067550000"
        },
        {
          label: "Not Ice Cream Sandwich",
          value: "572550000"
        }
      ]
    };

    this.singledonutDataSource = singledonutdata;

    const stackeddata = {
      chart: {
        caption: "Yearly Energy Production Rate",
        subcaption: " Top 5 Developed Countries",
        numbersuffix: " TWh",
        showsum: "1",
        plottooltext:
          "$label produces <b>$dataValue</b> of energy from $seriesName",
        theme: "gammel",
        drawcrossline: "1"
      },
      categories: [
        {
          category: [
            {
              label: "Canada"
            },
            {
              label: "China"
            },
            {
              label: "Russia"
            },
            {
              label: "Australia"
            },
            {
              label: "United States"
            },
            {
              label: "France"
            }
          ]
        }
      ],
      dataset: [
        {
          seriesname: "Coal",
          data: [
            {
              value: "400"
            },
            {
              value: "830"
            },
            {
              value: "500"
            },
            {
              value: "420"
            },
            {
              value: "790"
            },
            {
              value: "380"
            }
          ]
        },
        {
          seriesname: "Hydro",
          data: [
            {
              value: "350"
            },
            {
              value: "620"
            },
            {
              value: "410"
            },
            {
              value: "370"
            },
            {
              value: "720"
            },
            {
              value: "310"
            }
          ]
        },
        {
          seriesname: "Nuclear",
          data: [
            {
              value: "210"
            },
            {
              value: "400"
            },
            {
              value: "450"
            },
            {
              value: "180"
            },
            {
              value: "570"
            },
            {
              value: "270"
            }
          ]
        },
        {
          seriesname: "Gas",
          data: [
            {
              value: "180"
            },
            {
              value: "330"
            },
            {
              value: "230"
            },
            {
              value: "160"
            },
            {
              value: "440"
            },
            {
              value: "350"
            }
          ]
        },
        {
          seriesname: "Oil",
          data: [
            {
              value: "60"
            },
            {
              value: "200"
            },
            {
              value: "200"
            },
            {
              value: "50"
            },
            {
              value: "230"
            },
            {
              value: "150"
            }
          ]
        }
      ]
    };

    this.stackeddataSource = stackeddata

    const scrollStacked = {
      chart: {
        caption: "Deaths reported because of insect bites in India",
        yaxisname: "Number of deaths reported",
        subcaption: "(As per government records)",
        flatscrollbars: "0",
        scrollheight: "12",
        numvisibleplot: "8",
        plottooltext:
          "<b>$dataValue</b> people died because of $seriesName in $label",
        theme: "fusion"
      },
      categories: [
        {
          category: [
            {
              label: "1994"
            },
            {
              label: "1995"
            },
            {
              label: "1996"
            },
            {
              label: "1997"
            },
            {
              label: "1998"
            },
            {
              label: "1999"
            },
            {
              label: "2000"
            },
            {
              label: "2001"
            },
            {
              label: "2002"
            },
            {
              label: "2003"
            },
            {
              label: "2004"
            },
            {
              label: "2005"
            },
            {
              label: "2006"
            },
            {
              label: "2007"
            },
            {
              label: "2008"
            },
            {
              label: "2009"
            },
            {
              label: "2010"
            },
            {
              label: "2011"
            },
            {
              label: "2012"
            },
            {
              label: "2013"
            },
            {
              label: "2014"
            },
            {
              label: "2015"
            },
            {
              label: "2016"
            },
            {
              label: "2017"
            }
          ]
        }
      ],
      dataset: [
        {
          seriesname: "Hymenoptera",
          data: [
            {
              value: "15622"
            },
            {
              value: "10612"
            },
            {
              value: "15820"
            },
            {
              value: "26723"
            },
            {
              value: "35415"
            },
            {
              value: "25555"
            },
            {
              value: "81803"
            },
            {
              value: "47950"
            },
            {
              value: "42396"
            },
            {
              value: "19435"
            },
            {
              value: "9780"
            },
            {
              value: "23243"
            },
            {
              value: "28619"
            },
            {
              value: "8477"
            },
            {
              value: "3503"
            },
            {
              value: "14278"
            },
            {
              value: "30522"
            },
            {
              value: "61518"
            },
            {
              value: "24819"
            },
            {
              value: "16437"
            },
            {
              value: "21171"
            },
            {
              value: "1690"
            },
            {
              value: "2418"
            },
            {
              value: "11253"
            }
          ]
        },
        {
          seriesname: "Diptera",
          data: [
            {
              value: "3622"
            },
            {
              value: "2612"
            },
            {
              value: "5820"
            },
            {
              value: "6723"
            },
            {
              value: "5415"
            },
            {
              value: "5555"
            },
            {
              value: "1803"
            },
            {
              value: "7950"
            },
            {
              value: "2396"
            },
            {
              value: "9435"
            },
            {
              value: "2780"
            },
            {
              value: "3243"
            },
            {
              value: "8619"
            },
            {
              value: "1477"
            },
            {
              value: "1503"
            },
            {
              value: "4278"
            },
            {
              value: "9522"
            },
            {
              value: "2518"
            },
            {
              value: "4819"
            },
            {
              value: "6437"
            },
            {
              value: "6171"
            },
            {
              value: "2690"
            },
            {
              value: "1418"
            },
            {
              value: "1253"
            }
          ]
        }
      ]
    };
    this.scrollStackedSource = scrollStacked;

    const heatmapdata = {
      colorrange: {
        gradient: "1",
        minvalue: "0",
        startlabel: "Poor",
        endlabel: "Outstanding"
      },
      dataset: [
        {
          data: [
            {
              rowid: "JA",
              columnid: "EN",
              value: "3.7"
            },
            {
              rowid: "JA",
              columnid: "PY",
              value: "4.3"
            },
            {
              rowid: "JA",
              columnid: "MT",
              value: "4.0"
            },
            {
              rowid: "JA",
              columnid: "HS",
              value: "3.3"
            },
            {
              rowid: "JA",
              columnid: "EC",
              value: "3.1"
            },
            {
              rowid: "EM",
              columnid: "EN",
              value: "3.6"
            },
            {
              rowid: "EM",
              columnid: "PY",
              value: "4.0"
            },
            {
              rowid: "EM",
              columnid: "MT",
              value: "3.2"
            },
            {
              rowid: "EM",
              columnid: "HS",
              value: "2.6"
            },
            {
              rowid: "EM",
              columnid: "EC",
              value: "3.2"
            },
            {
              rowid: "JY",
              columnid: "EN",
              value: "3.8"
            },
            {
              rowid: "JY",
              columnid: "PY",
              value: "4.1"
            },
            {
              rowid: "JY",
              columnid: "MT",
              value: "3.9"
            },
            {
              rowid: "JY",
              columnid: "HS",
              value: "2.6"
            },
            {
              rowid: "JY",
              columnid: "EC",
              value: "2"
            },
            {
              rowid: "WL",
              columnid: "EN",
              value: "3.4"
            },
            {
              rowid: "WL",
              columnid: "PY",
              value: "3.2"
            },
            {
              rowid: "WL",
              columnid: "MT",
              value: "4"
            },
            {
              rowid: "WL",
              columnid: "HS",
              value: "2.5"
            },
            {
              rowid: "WL",
              columnid: "EC",
              value: "3.1"
            }
          ]
        }
      ],
      columns: {
        column: [
          {
            id: "EN",
            label: "English"
          },
          {
            id: "MT",
            label: "Maths"
          },
          {
            id: "PY",
            label: "Physics"
          },
          {
            id: "HS",
            label: "History"
          },
          {
            id: "EC",
            label: "Economics"
          }
        ]
      },
      rows: {
        row: [
          {
            id: "JA",
            label: "Jacob"
          },
          {
            id: "EM",
            label: "Emma"
          },
          {
            id: "JY",
            label: "Jayden"
          },
          {
            id: "WL",
            label: "William"
          }
        ]
      },
      chart: {
        theme: "candy",
        caption: "Distribution of Marks for Students",
        subcaption: "Bell Curve Grading",
        xaxisname: "Subjects",
        yaxisname: "Student Name",
        showvalues: "1",
        valuefontcolor: "#ffffff",
        plottooltext: "$rowlabel's $columnlabel grading score: <b>$value</b>"
      }
    };
 
    this.heatmapSource = heatmapdata;

    const worldData = {
      chart: {
        caption: "Average Annual Population Growth",
        subcaption: "Click on a continent to see trend from 1955-2015",
        numbersuffix: "%",
        includevalueinlabels: "1",
        labelsepchar: ": ",
        entityfillhovercolor: "#FFF9C4",
        theme: "candy"
      },
      colorrange: {
        minvalue: "0",
        code: "#FFE0B2",
        gradient: "1",
        color: [
          {
            minvalue: "0.5",
            maxvalue: "1.0",
            color: "#FFD74D"
          },
          {
            minvalue: "1.0",
            maxvalue: "2.0",
            color: "#FB8C00"
          },
          {
            minvalue: "2.0",
            maxvalue: "3.0",
            color: "#E65100"
          }
        ]
      },
      data: [
        {
          id: "NA",
          value: ".82",
          showlabel: "1",
          link: "newchart-json-NAM"
        },
        {
          id: "SA",
          value: "2.04",
          showlabel: "1",
          link: "newchart-json-SAM"
        },
        {
          id: "AS",
          value: "1.78",
          showlabel: "1",
          link: "newchart-json-ASI"
        },
        {
          id: "EU",
          value: ".40",
          showlabel: "1",
          link: "newchart-json-EUP"
        },
        {
          id: "AF",
          value: "2.58",
          showlabel: "1",
          link: "newchart-json-AFC"
        },
        {
          id: "AU",
          value: "1.30",
          showlabel: "1",
          link: "newchart-json-AUS"
        }
      ],
      linkeddata: [
        {
          id: "NAM",
          linkedchart: {
            chart: {
              caption: "Average Annual Population Growth - North America",
              subcaption: "1955 - 2015",
              yaxisname: "Growth",
              numbersuffix: "%",
              palettecolors: "FFD74D",
              theme: "candy"
            },
            data: [
              {
                label: "1955",
                value: "1.5078"
              },
              {
                label: "1960",
                value: "1.5502"
              },
              {
                label: "1965",
                value: "1.3121"
              },
              {
                label: "1970",
                value: "0.8648"
              },
              {
                label: "1975",
                value: "0.6402"
              },
              {
                label: "1980",
                value: "0.62"
              },
              {
                label: "1985",
                value: "0.6748"
              },
              {
                label: "1990",
                value: "0.6882"
              },
              {
                label: "1995",
                value: "0.6804"
              },
              {
                label: "2000",
                value: "0.5627"
              },
              {
                label: "2005",
                value: "0.5373"
              },
              {
                label: "2010",
                value: "0.5536"
              },
              {
                label: "2015",
                value: "0.4291"
              }
            ]
          }
        },
        {
          id: "SAM",
          linkedchart: {
            chart: {
              caption: "Average Annual Population Growth - South America",
              subcaption: "1955 - 2015",
              yaxisname: "Growth",
              numbersuffix: "%",
              palettecolors: "E65100",
              theme: "candy"
            },
            data: [
              {
                label: "1955",
                value: "2.6275"
              },
              {
                label: "1960",
                value: "2.6995"
              },
              {
                label: "1965",
                value: "2.757"
              },
              {
                label: "1970",
                value: "2.5376"
              },
              {
                label: "1975",
                value: "2.3431"
              },
              {
                label: "1980",
                value: "2.3261"
              },
              {
                label: "1985",
                value: "2.2036"
              },
              {
                label: "1990",
                value: "1.9611"
              },
              {
                label: "1995",
                value: "1.7184"
              },
              {
                label: "2000",
                value: "1.5965"
              },
              {
                label: "2005",
                value: "1.4482"
              },
              {
                label: "2010",
                value: "1.2031"
              },
              {
                label: "2015",
                value: "1.0698"
              }
            ]
          }
        },
        {
          id: "ASI",
          linkedchart: {
            chart: {
              caption: "Average Annual Population Growth - Asia",
              subcaption: "1955 - 2015",
              yaxisname: "Growth",
              numbersuffix: "%",
              theme: "candy",
              palettecolors: "FB8C00"
            },
            data: [
              {
                label: "1955",
                value: "1.9075"
              },
              {
                label: "1960",
                value: "1.8842"
              },
              {
                label: "1965",
                value: "2.1082"
              },
              {
                label: "1970",
                value: "2.4554"
              },
              {
                label: "1975",
                value: "2.3036"
              },
              {
                label: "1980",
                value: "1.9889"
              },
              {
                label: "1985",
                value: "1.9683"
              },
              {
                label: "1990",
                value: "2.0176"
              },
              {
                label: "1995",
                value: "1.6823"
              },
              {
                label: "2000",
                value: "1.3682"
              },
              {
                label: "2005",
                value: "1.2435"
              },
              {
                label: "2010",
                value: "1.1661"
              },
              {
                label: "2015",
                value: "1.0731"
              }
            ]
          }
        },
        {
          id: "EUP",
          linkedchart: {
            chart: {
              caption: "Average Annual Population Growth - Europe",
              subcaption: "1955 - 2015",
              yaxisname: "Growth",
              numbersuffix: "%",
              theme: "candy",
              palettecolors: "FFE0B2"
            },
            data: [
              {
                label: "1955",
                value: "1.026"
              },
              {
                label: "1960",
                value: "1.0652"
              },
              {
                label: "1965",
                value: "0.9381"
              },
              {
                label: "1970",
                value: "0.6925"
              },
              {
                label: "1975",
                value: "0.54"
              },
              {
                label: "1980",
                value: "0.4218"
              },
              {
                label: "1985",
                value: "0.354"
              },
              {
                label: "1990",
                value: "0.2971"
              },
              {
                label: "1995",
                value: "0.0276"
              },
              {
                label: "2000",
                value: "-0.1301"
              },
              {
                label: "2005",
                value: "-0.1558"
              },
              {
                label: "2010",
                value: "-0.0576"
              },
              {
                label: "2015",
                value: "-0.0292"
              }
            ]
          }
        },
        {
          id: "AFC",
          linkedchart: {
            chart: {
              caption: "Average Annual Population Growth - Africa",
              subcaption: "1955 - 2015",
              yaxisname: "Growth",
              numbersuffix: "%",
              theme: "candy",
              palettecolors: "E65100"
            },
            data: [
              {
                label: "1955",
                value: "2.1242"
              },
              {
                label: "1960",
                value: "2.338"
              },
              {
                label: "1965",
                value: "2.5075"
              },
              {
                label: "1970",
                value: "2.5947"
              },
              {
                label: "1975",
                value: "2.7175"
              },
              {
                label: "1980",
                value: "2.8398"
              },
              {
                label: "1985",
                value: "2.8857"
              },
              {
                label: "1990",
                value: "2.8243"
              },
              {
                label: "1995",
                value: "2.6172"
              },
              {
                label: "2000",
                value: "2.5072"
              },
              {
                label: "2005",
                value: "2.4853"
              },
              {
                label: "2010",
                value: "2.5593"
              },
              {
                label: "2015",
                value: "2.6001"
              }
            ]
          }
        },
        {
          id: "AUS",
          linkedchart: {
            chart: {
              caption: "Average Annual Population Growth - Oceania",
              subcaption: "1955 - 2015",
              yaxisname: "Growth",
              numbersuffix: "%",
              theme: "candy",
              palettecolors: "FB8C00"
            },
            data: [
              {
                label: "1955",
                value: "1.511"
              },
              {
                label: "1960",
                value: "1.6045"
              },
              {
                label: "1965",
                value: "1.5578"
              },
              {
                label: "1970",
                value: "1.455"
              },
              {
                label: "1975",
                value: "1.4727"
              },
              {
                label: "1980",
                value: "1.2404"
              },
              {
                label: "1985",
                value: "1.2398"
              },
              {
                label: "1990",
                value: "1.1853"
              },
              {
                label: "1995",
                value: "1.2006"
              },
              {
                label: "2000",
                value: "1.1244"
              },
              {
                label: "2005",
                value: "1.0724"
              },
              {
                label: "2010",
                value: "1.1255"
              },
              {
                label: "2015",
                value: "1.0397"
              }
            ]
          }
        }
      ]
    };

    this.worldDataSource = worldData;
  }

  ngOnInit(): void {
    
  }
}