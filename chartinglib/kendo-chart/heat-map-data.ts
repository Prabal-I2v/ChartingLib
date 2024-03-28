// interface DataObject {
//   xField: string;
//   yField: string;
//   data: any[];
// }

// export function makeDataObjects(rows: number, cols: number): DataObject[] {
//   const heatMapdata: DataObject[] = [];
//   for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
//     Array.from(Array(cols)).map((_, colIndex) => {
//       var datalist=[];
//       datalist.push(cols + rowIndex * colIndex);
//       heatMapdata.push({
//         xField: `xField${rowIndex + 1}`,
//         yField: `yField${colIndex + 1}`,
//         data: datalist,
//       });
//     });
//   }

//   return heatMapdata;
// }
interface DataObject {
  xAxis: string;
  yAxis: string;
  value: number;
}

export function makeDataObjects(rows: number, cols: number): DataObject[] {
  const mapdata: DataObject[] = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    Array.from(Array(cols)).map((_, colIndex) => {
      mapdata.push({
        xAxis: `X${rowIndex + 1}`,
        yAxis: `Y${colIndex + 1}`,
        value: cols + rowIndex * colIndex,
      });
    });
  }

  return mapdata;
}
