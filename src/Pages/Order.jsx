import { React, useEffect, useState } from 'react';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { Header } from '../Components';
import { useStateContext } from "../Contexts/ContextProvider";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import moment from 'moment';

const Order = () => {
  const { currentColor } = useStateContext();
  const positionDialog = { X: "center", Y: 18 };
  const [visibility, setVisibility] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [productsDataOrder, setProductsDataOrder] = useState([]);

  // input data order
  const [productOrder, setProductOrder] = useState();
  const [quantity, setQuantity] = useState();
  const [inputPrice, setInputPrice] = useState();
  const [buyPrice, setBuyPrice] = useState();
  const [note, setNote] = useState();

  const [indexItem, setIndexItem] = useState(0);
  const [isOldPrice, setIsOldPrice] = useState(false);
  const [dataOldPrice, setDataOldPrice] = useState('');
  const [totalInputPrice, setTotalInputPrice] = useState(0);
  const [totalBuyPrice, setTotalBuyPrice] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  let grid;

  useEffect(() => {
    retriveData();
  }, [])

  function retriveData() {
    axios.get('/products')
      .then((res) => {
        setProductsData(res.data);
      })
      .catch((error) => {
        toast.error('Lỗi truy vấn thông tin sản phẩm !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }

  function handleOrderProduct() {
    if (!quantity || !productOrder || !inputPrice || !buyPrice) {
      toast.error('Vui lòng nhập đầy đủ thông tin !', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    let obj = getProductById(productOrder);
    obj['id'] = obj.id;
    obj['product_code'] = obj.product_code;
    obj['product_name'] = obj.product_name;
    obj['quantity'] = quantity;
    obj['input_price'] = inputPrice;
    obj['buy_price'] = buyPrice;
    obj['note'] = note;
    obj['index'] = indexItem;
    obj['total_input_item'] = quantity * inputPrice;
    obj['total_output_item'] = quantity * buyPrice;
    productsDataOrder.push(obj);
    setProductsDataOrder(productsDataOrder);
    grid.refresh();
    let nextIndex = indexItem + 1;
    setIndexItem(nextIndex);
    clearOrder();

    let totalInp = fcTotalInputPrice(productsDataOrder);
    setTotalInputPrice(totalInp);
    let totalBuyPr = fcTotalBuyPrice(productsDataOrder);
    setTotalBuyPrice(totalBuyPr);
    let totalProfitPrice = totalBuyPr - totalInp;
    setTotalProfit(totalProfitPrice);
  }

  function getProductById(productId) {
    for (var i = 0; i < productsData.length; i++) {
      if (productsData[i].id == productId) {
        return productsData[i];
      }
    }
  }

  function clearOrder() {
    setProductOrder(null);
    setQuantity('');
    setInputPrice('');
    setBuyPrice('');
    setNote('');
  }

  function checkOldPrice(productId) {
    if (!productId) {
      toast.error('Vui lòng chọn sản phẩm !', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    // call api check price

    axios.get('/old_price/' + productId)
      .then((res) => {
        let dataPrice = res.data;
        if (dataPrice.length > 0) {
          setIsOldPrice(true);
        }
        let listPrice = [];
        dataPrice.forEach((item) => {
          listPrice.push(new Intl.NumberFormat('en-DE').format(item.price) + ' (' + moment(item.input_date).format('DD-MM-YYYY') + ')');
        });
        let tmp = "Giá cũ: ";
        setDataOldPrice(tmp + listPrice.join(' , '));
      })
      .catch((error) => {
        toast.error('Lỗi truy vấn dữ liệu !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
    setVisibility(true);
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

  function fcTotalInputPrice(listData) {
    if (listData.length > 0) {
      let totalInput = 0;
      listData.forEach(item => {
        totalInput = totalInput + (item.input_price * item.quantity);
      })
      return totalInput;
    }
  }

  function fcTotalBuyPrice(listData) {
    if (listData.length > 0) {
      let totalBuyPrice = 0;
      listData.forEach(item => {
        totalBuyPrice = totalBuyPrice + (item.buy_price * item.quantity);
      })
      return totalBuyPrice;
    }
  }

  const deleteTemplate = (props) => {
    return (
      <div>
        <button className='e-icons e-trash e-medium' onClick={() => deleteOrderProduct(props.id)} ></button>
      </div>
    );
  };

  function deleteOrderProduct(id) {
    let newArr = removeObjectWithId(productsDataOrder, id);
    setProductsDataOrder(newArr);
    if (newArr.length > 0) {
      let totalIp = fcTotalInputPrice(newArr);
      setTotalInputPrice(totalIp);

      let totalBuy = fcTotalBuyPrice(newArr);
      setTotalBuyPrice(totalBuy);

      let totalPt = totalBuy - totalIp;
      setTotalProfit(totalPt);
    } else {
      setTotalInputPrice(0);
      setTotalBuyPrice(0);
      setTotalProfit(0);
    }
  }

  function removeObjectWithId(arr, id) {
    return arr.filter((obj) => obj.id !== id);
  }
  const exportExcel = () => {
    toast.error('Chức năng đang phát triển', {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  const saveOrder = () => {
    toast.error('Chức năng đang phát triển', {
      position: toast.POSITION.TOP_RIGHT
    });
  }
  // setting gird data
  const sortSettings = {
    columns: [
      { field: 'index', direction: 'descending' }
    ]
  };
  const fields = { text: 'product_name', value: 'id' };
  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl">
        <Header category="" title="Order sản phẩm" />
        <ComboBoxComponent showClearButton={true} floatLabelType="Auto" value={productOrder} width={'60%'}
          onChange={e => setProductOrder(e.value)} fields={fields} dataSource={productsData}
          allowCustom={true} placeholder="Chọn sản phẩm" />
        <button className='ml-10 btn-add-product' style={{ backgroundColor: currentColor, marginLeft: '40px' }}
          onClick={() => { checkOldPrice(productOrder) }}>Xem giá cũ</button>
        <br></br>
        <NumericTextBoxComponent floatLabelType="Auto" value={quantity} width={'30%'}
          validateDecimalOnType={true} decimals={0} format='n0'
          onChange={e => setQuantity(e.value)} min={0} max={10000} placeholder="Số lượng" />
        <br></br>
        <NumericTextBoxComponent floatLabelType="Auto" value={inputPrice} width={'30%'} min={0}
          validateDecimalOnType={true} decimals={0} format='n0'
          onChange={e => setInputPrice(e.value)} placeholder="Giá nhập" />
        <br></br>
        <NumericTextBoxComponent floatLabelType="Auto" value={buyPrice} width={'30%'} min={0}
          validateDecimalOnType={true} decimals={0} format='n0'
          onChange={e => setBuyPrice(e.value)} placeholder="Giá bán" />
        <br></br>
        <TextBoxComponent floatLabelType="Auto" value={note} onChange={e => setNote(e.value)} placeholder="Note" />
        <br></br>
        <button style={{ backgroundColor: currentColor, marginTop: '10px' }} className='btn-add-product'
          onClick={() => { handleOrderProduct() }}>Thêm</button>
      </div>
      <div className="md:m-8 md:p-8 bg-white rounded-2xl">
        <div className='mb-5'>
          <label className='text-2xl font-extrabold tracking-tight text-slate-900'>
            Danh sách orders
          </label>
          <button style={{ backgroundColor: currentColor, float: 'right' }} className='btn-add-product' onClick={() => saveOrder()}>Lưu order</button>
          <button style={{ backgroundColor: currentColor, float: 'right', marginRight: '10px' }} className='btn-add-product' onClick={() => exportExcel()}>Export Excel</button>
        </div>
        <GridComponent
          dataSource={productsDataOrder} allowPaging allowSorting toolbar={['Delete']} ref={g => grid = g} sortSettings={sortSettings}
          editSettings={{ allowDeleting: true, allowEditing: true }} width='auto'>
          {/*  */}
          <ColumnsDirective>
            <ColumnDirective field='id' width='20' headerText='' template={deleteTemplate} textAlign="Center" />
            <ColumnDirective field='index' width='0' headerText='' textAlign="Center" />
            <ColumnDirective field='product_code' width='60' headerText='Mã sản phẩm' textAlign="Left" />
            <ColumnDirective field='product_name' clipMode='EllipsisWithTooltip' width='100' headerText='Tên sản phẩm' textAlign="Left" />
            <ColumnDirective field='quantity' width='40' headerText='Số lượng' textAlign="Center" />
            <ColumnDirective field='input_price' width='50' headerText='Giá nhập' textAlign="Center" />
            <ColumnDirective field='buy_price' width='50' headerText='Giá bán' textAlign="Center" />
            <ColumnDirective field='total_input_item' width='50' headerText='Tiền nhập' textAlign="Center" />
            <ColumnDirective field='total_output_item' width='50' headerText='Tiền bán' textAlign="Center" />
            <ColumnDirective field='note' width='100' headerText='Nơi nhập' textAlign="Left" />
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
        </GridComponent>
        <div className='text-right mt-2'>
          <span className='font-bold' style={{ paddingRight: '50px' }}>Tổng tiền nhập: <span style={{ color: 'red' }}>{new Intl.NumberFormat('en-DE').format(totalInputPrice)}</span> VND</span>
        </div>
        <div className='text-right mt-2'>
          <span className='font-bold' style={{ paddingRight: '50px' }}>Tổng tiền bán: <span style={{ color: 'red' }}>{new Intl.NumberFormat('en-DE').format(totalBuyPrice)}</span> VND</span>
        </div>
        <div className='text-right mt-2'>
          <span className='font-bold' style={{ paddingRight: '50px' }}>Tổng tiền lãi: <span style={{ color: 'lawngreen' }}>{new Intl.NumberFormat('en-DE').format(totalProfit)}</span> VND</span>
        </div>
      </div>

      {/* Dialog Check Information price */}
      <DialogComponent width="600px" isModal={true} visible={visibility}
        close={dialogClose} overlayClick={onOverlayClick} showCloseIcon={true} header='Thông tin giá sản phẩm' closeOnEscape={false}
        buttons={buttonDialogCheckPrice} position={positionDialog}>
        <div>
          {isOldPrice ?
            <span className='font-bold'>
              {dataOldPrice}
            </span>
            : 'Không có thông tin giá cũ của sản phẩm !'}
        </div>
      </DialogComponent>
    </>
  )
};
export default Order;