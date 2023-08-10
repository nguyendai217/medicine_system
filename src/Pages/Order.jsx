import { React, useEffect, useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { Header } from '../Components';
import { useStateContext } from "../Contexts/ContextProvider";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Toolbar, Sort, Filter, Resize } from '@syncfusion/ej2-react-grids';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import moment from 'moment';
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

const Order = () => {
  const { currentColor } = useStateContext();
  const positionDialog = { X: "center", Y: 18 };
  const [visibility, setVisibility] = useState(false);
  // const [productsData, setProductsData] = useState([]);
  const [productsDataOrder, setProductsDataOrder] = useState([]);

  // input data order
  const [productOrder, setProductOrder] = useState();
  const [quantity, setQuantity] = useState();
  const [inputPrice, setInputPrice] = useState();
  const [buyPrice, setBuyPrice] = useState();
  const [note, setNote] = useState();

  const [indexItem, setIndexItem] = useState(1);
  const [dataOldPrice, setDataOldPrice] = useState('');
  const [totalInputPrice, setTotalInputPrice] = useState(0);
  const [totalBuyPrice, setTotalBuyPrice] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  let grid;
  const [totalItem, setTotalItem] = useState(0);

  function handleOrderProduct() {
    if (!productOrder || !quantity || !inputPrice || !buyPrice) {
      toast.error('Vui lòng nhập đầy đủ thông tin !', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }

    // call api get product by product_code
    axios.get('/products/productCode/' + productOrder)
      .then((res) => {
        if (res.data) {
          let obj = {};
          obj['id'] = res.data.id;
          obj['product_code'] = res.data.product_code;
          obj['product_name'] = res.data.product_name;
          obj['unit_name'] = res.data.unit_name;
          obj['quantity'] = quantity;
          obj['input_price'] = inputPrice;
          obj['buy_price'] = buyPrice;
          obj['note'] = note;
          obj['idx'] = indexItem;
          obj['total_input_item'] = quantity * inputPrice;
          obj['total_output_item'] = quantity * buyPrice;

          productsDataOrder.push(obj);
          setProductsDataOrder(productsDataOrder);
          grid.refresh();
          let nextIndex = indexItem + 1;
          setIndexItem(nextIndex);
          clearOrder();
          setTotalItem(totalItem + 1);
        } else {
          toast.error('Không có thông tin mã sp !', {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      })
      .catch((error) => {
        alert(error);
        toast.error('Lỗi truy vấn dữ liệu !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }

  function clearOrder() {
    setProductOrder(null);
    setQuantity('');
    setInputPrice('');
    setBuyPrice('');
    setNote('');
  }

  function checkOldPrice() {
    if (!productOrder) {
      toast.error('Vui lòng chọn sản phẩm !', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }

    // call api check price
    axios.get('/old_price/productCode/' + productOrder)
      .then((res) => {
        let tmp = '';
        let dataPrice = res.data;
        if (dataPrice.length <= 0) {
          tmp = 'Không có thông tin giá cũ !'
        } else {
          let listPrice = [];
          dataPrice.forEach((item) => {
            listPrice.push(new Intl.NumberFormat('en-DE').format(item.price) + ' (' + moment(item.input_date).format('DD-MM-YYYY') + ')');
          });
          tmp = "Giá cũ: " + listPrice.join(' , ');
        }
        setDataOldPrice(tmp);
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
    let totalInput = 0;
    listData.forEach(item => {
      totalInput = totalInput + (item.input_price * item.quantity);
    })
    return totalInput;
  }

  function fcTotalBuyPrice(listData) {
    let totalBuyPrice = 0;
    listData.forEach(item => {
      totalBuyPrice = totalBuyPrice + (item.buy_price * item.quantity);
    })
    return totalBuyPrice;
  }

  const deleteTemplate = (props) => {
    return (
      <div>
        <button className='e-icons e-trash e-medium' onClick={() => deleteOrderProduct(props.id)} ></button>
      </div>
    );
  };

  const deleteOrderProduct = (id) => {
    let listData = [];
    for (var i = 0; i < productsDataOrder.length; i++) {
      if (productsDataOrder[i].id !== id) {
        listData.push(productsDataOrder[i]);
      }
    }
    setTotalItem(totalItem - 1);
    setProductsDataOrder(listData);
  }

  useEffect(() => {
    if (productsDataOrder.length > 0) {
      let totalInp = fcTotalInputPrice(productsDataOrder);
      setTotalInputPrice(totalInp);
      let totalBuyPr = fcTotalBuyPrice(productsDataOrder);
      setTotalBuyPrice(totalBuyPr);
      let totalProfitPrice = totalBuyPr - totalInp;
      setTotalProfit(totalProfitPrice);
    } else {
      setTotalInputPrice(0);
      setTotalBuyPrice(0);
      setTotalProfit(0);
    }
    //grid.refresh();
  }, [totalItem])

  const exportExcel = () => {
    if (productsDataOrder.length <= 0) {
      toast.error('Không có dữ liệu để export !', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }

    let newArrayData = [];
    for (var i = 0; i < productsDataOrder.length; i++) {
      let object = {};
      let objData = productsDataOrder[i];
      object['stt'] = i + 1;
      object['product_code'] = objData['product_code'];
      object['product_name'] = objData['product_name'];
      object['quantity'] = objData['quantity'];
      object['unit_name'] = objData['unit_name'];
      object['price'] = objData['input_price'];
      object['total_input_item'] = objData['total_input_item'];
      newArrayData.push(object);
    }

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    var fileName = 'Data' + Math.floor(Date.now() / 1000);
    const ws = XLSX.utils.json_to_sheet(newArrayData);
    /* custom headers */
    XLSX.utils.sheet_add_aoa(ws, [["STT", "Mã sản phẩm", "Tên sản phẩm", "Số lượng", "Đơn vị", "Đơn giá", "Tổng tiền"]], { origin: "A1" });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const saveOrder = () => {
    var objOrder = {};
    objOrder['customer_id'] = 1;
    objOrder['total_price'] = totalBuyPrice;
    objOrder['note'] = note;
    objOrder['total_product'] = productsDataOrder.length;
    objOrder['profit'] = totalProfit;
    objOrder['phone_customer'] = '0336518254';

    // call api insert data
    axios.post('/order', objOrder)
      .then(resp => {
        if (resp.status == '201') {
          toast.success(resp.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });

          var orderId = resp.data.insertId;
        }
      })
      .catch(error => {
        console.log(error);
        toast.error('Thêm mới order thất bại !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }
  // setting gird data
  const sortSettings = {
    columns: [
      { field: 'idx', direction: 'descending' }
    ]
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl">
        <Header category="" title="Order sản phẩm" />
        <TextBoxComponent floatLabelType="Auto" value={productOrder} width={'30%'} onChange={e => setProductOrder(e.target.value)} placeholder="Mã sản phẩm" />
        <button className='ml-10 btn-add-product' style={{ backgroundColor: currentColor, marginLeft: '40px' }}
          onClick={() => { checkOldPrice() }}>Xem giá cũ</button>
        <br></br>
        <NumericTextBoxComponent floatLabelType="Auto" value={quantity} width={'30%'}
          validateDecimalOnType={true} decimals={0} format='n0'
          onChange={e => setQuantity(e.target.value)} min={0} max={10000} placeholder="Số lượng" />
        <br></br>
        <NumericTextBoxComponent floatLabelType="Auto" value={inputPrice} width={'30%'} min={0}
          validateDecimalOnType={true} decimals={0} format='n0'
          onChange={e => setInputPrice(e.target.value)} placeholder="Giá nhập" />
        <br></br>
        <NumericTextBoxComponent floatLabelType="Auto" value={buyPrice} width={'30%'} min={0}
          validateDecimalOnType={true} decimals={0} format='n0'
          onChange={e => setBuyPrice(e.target.value)} placeholder="Giá bán" />
        <br></br>
        <TextBoxComponent floatLabelType="Auto" value={note} onChange={e => setNote(e.target.value)} placeholder="Note" />
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
          dataSource={productsDataOrder} allowPaging allowSorting ref={g => grid = g} sortSettings={sortSettings}
          width='auto' allowResizing={true}>
          <ColumnsDirective>
            <ColumnDirective field='id' width='20' headerText='' template={deleteTemplate} textAlign="Center" />
            <ColumnDirective field='idx' width='0' headerText='' textAlign="Center" />
            <ColumnDirective field='product_code' width='60' headerText='Mã SP' textAlign="Left" />
            <ColumnDirective field='product_name' clipMode='EllipsisWithTooltip' width='100' headerText='Tên SP' textAlign="Left" />
            <ColumnDirective field='quantity' width='40' headerText='SL' textAlign="Center" />
            <ColumnDirective field='unit_name' width='30' headerText='ĐV' textAlign="Center" />
            <ColumnDirective field='input_price' width='50' headerText='Giá nhập' textAlign="Center" />
            <ColumnDirective field='buy_price' width='50' headerText='Giá bán' textAlign="Center" />
            <ColumnDirective field='total_input_item' width='50' headerText='Tiền nhập' textAlign="Center" />
            <ColumnDirective field='total_output_item' width='50' headerText='Tiền bán' textAlign="Center" />
            <ColumnDirective field='note' width='80' headerText='Note' textAlign="Left" />
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, Selection, Sort, Filter, Resize]} />
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
          <span className='font-bold'>
            {dataOldPrice}
          </span>
        </div>
      </DialogComponent>
    </>
  )
};
export default Order;