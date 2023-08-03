import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { Header } from '../Components';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ordersData, ordersGrid } from '../Data/dummy';
const Orders = () => {
  let grid;
  const toolbar = ['ExcelExport'];
  const toolbarClick = (args) => {
    if (grid && args.item.id === 'grid_excelexport') {
      grid.excelExport();
    }
  };
  return (
    <div className="m-2 md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl">
      <Header category="" title="Orders" />
      <GridComponent
        id="gridcomp"
        dataSource={ordersData}
        allowPaging
        allowSorting
        toolbar={toolbar}
        allowExcelExport={true} toolbarClick={toolbarClick} ref={g => grid = g}
      >
        <ColumnsDirective>
          {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, Toolbar, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};
export default Orders;