import { React, useEffect, useState } from 'react';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { productsGrid, productsData, productsOrderGrid } from '../Data/dummy';
import { Header } from '../Components';
import { useStateContext } from "../Contexts/ContextProvider";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
const Order = () => {
  const { currentColor } = useStateContext();
  const positionDialog = { X: "center", Y: 18 };
  const [visibility, setVisibility] = useState(false);
  const fields = { text: 'product_name', value: 'Id' };
  const [productsDataOrder, setproductsDataOrder] = useState([]);
  const [quantity, setQuantity] = useState();
  const [currentPrice, setCurrentPrice] = useState();
  const [note, setNote] = useState();
  const [productOrder, setProductOrder] = useState();
  const [indexItem, setIndexItem] = useState(0);
  const [listPrice, setListPrice] = useState([]);
  let grid;

  function handleOrderProduct() {
    if (!quantity || !productOrder) {
      alert("Vui lòng nhập đầy đủ thông tin order !")
      return;
    }
    let obj = getProductById(productOrder);
    obj['quantity'] = quantity;
    var totalPrice = quantity * obj.price;
    obj['total_price'] = totalPrice;
    obj['index'] = indexItem;
    //console.log(obj)
    productsDataOrder.push(obj);
    setproductsDataOrder(productsDataOrder);
    console.log(productsDataOrder)
    clearOrder();
    grid.refresh();
    let nextIndex = indexItem + 1;
    setIndexItem(nextIndex);
  }

  function getProductById(productId) {
    for (var i = 0; i < productsData.length; i++) {
      if (productsData[i].Id == productId) {
        return productsData[i];
      }
    }
  }

  function clearOrder() {
    setProductOrder('');
    setQuantity('');
    setCurrentPrice('');
    setNote('');
  }

  function getProductOrder(productId) {
    if (!productId) {
      return;
    }
    setProductOrder(productId);
    // call api get price
    const product = {
      prices: [
        {
          id: 1,
          price: 30000,
          input_date: '2023-02-08'
        },
        {
          id: 2,
          price: 32000,
          input_date: '2023-02-10'
        },
        {
          id: 3,
          price: 31500,
          input_date: '2023-02-08'
        }
      ]
    }
    if (product.prices.length > 0) {
      for (var i = 0; i < product.prices.length; i++) {
        listPrice.push(product.prices[i]);
        setListPrice(listPrice);
      }
    }
  }

  function checkOldPrice(productId) {
    if (!productId) {
      return;
    }
    setVisibility(true);
    console.log("xxx", productId);
  }

  function onOverlayClick() {
    setVisibility(false);
  }

  function dialogClose() {
    setVisibility(false);
  }

  const buttonDialogCheckPrice = [
    {
      buttonModel: {
        content: "Đóng",
        cssClass: 'e-flat',
      },
      click: () => {
        setVisibility(false);
      },
    }
  ];


  // setting gird data
  const sortSettings = {
    columns: [
      { field: 'index', direction: 'descending' }
    ]
  };
  return (
    <>
      <div className="md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl">
        <Header category="" title="Order sản phẩm" />
        <ComboBoxComponent floatLabelType="Auto" value={productOrder} width={'60%'} onChange={e => getProductOrder(e.target.value)} id="comboelement"
          fields={fields} dataSource={productsData} allowCustom={true} placeholder="Chọn sản phẩm" />
        <button className='ml-10 btn-add-product e-icons e-circle-info e-medium' style={{ backgroundColor: currentColor, marginLeft: '30px' }}
          onClick={() => { checkOldPrice(productOrder) }}></button>
        <br></br>
        <NumericTextBoxComponent floatLabelType="Auto" value={quantity} width={'30%'}
          validateDecimalOnType={true} decimals={0} format='n0'
          onChange={e => setQuantity(e.target.value)} min={0} max={1000} placeholder="Số lượng" />
        <br></br>
        <NumericTextBoxComponent floatLabelType="Auto" value={currentPrice} width={'30%'} min={0}
          validateDecimalOnType={true} decimals={0} format='n0'
          onChange={e => setCurrentPrice(e.target.value)} placeholder="Đơn giá" />
        <br></br>
        <TextBoxComponent floatLabelType="Auto" value={note}
          onChange={e => setNote(e.target.value)} placeholder="Note" />
        <br></br>
        <button style={{ backgroundColor: currentColor }} className='btn-add-product'
          onClick={() => { handleOrderProduct() }}> Thêm</button>
      </div>
      <div className="md:m-8 md:p-8 bg-white rounded-2xl">
        <Header category="" title="Danh sách orders" />
        <GridComponent
          dataSource={productsDataOrder}
          allowPaging
          allowSorting
          toolbar={['Delete']}
          editSettings={{ allowDeleting: true, allowEditing: true }}
          width='auto'
          ref={g => grid = g}
          sortSettings={sortSettings}
        >
          <ColumnsDirective>
            {productsOrderGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
        </GridComponent>
      </div>

      {/* Dialog Check Information price */}
      <DialogComponent width="600px" isModal={true} visible={visibility}
        close={dialogClose} overlayClick={onOverlayClick}
        showCloseIcon={true} header='Thông tin giá sản phẩm' closeOnEscape={false}
        buttons={buttonDialogCheckPrice} position={positionDialog}
      >
      </DialogComponent>
    </>
  )
};
export default Order;