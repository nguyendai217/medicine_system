import { React, useEffect } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useState } from 'react';
import { useStateContext } from "../Contexts/ContextProvider";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Products = () => {
  const { currentColor } = useStateContext();
  const positionDialog = { X: "center", Y: 18 }
  const [headerDialog, setHeaderDialog] = useState('');
  const [labelButton, setLabelButton] = useState('');
  const [visibility, setDialogVisibility] = useState(false);

  const [productsData, setProductsData] = useState([])
  const [unitsData, setUnitsData] = useState([])
  // product information
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [productId, setProductId] = useState();

  // dialog confirm delete product
  const [visibilityDelete, setVisibilityDelete] = useState(false);

  // spinner loading
  const [loading, setLoading] = useState(true);
  const cssSpinner = {
    position: 'absolute',
    top: '45%',
    left: '60%',
    zIndex: 999,
  }

  useEffect(() => {
    retriveData();
    // call api get units
    axios.get('/units')
      .then((res) => {
        setUnitsData(res.data);
      })
      .catch((error) => {
        toast.error('Lỗi truy vấn thông tin đơn vị !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }, [])

  function retriveData() {
    axios.get('/products')
      .then((res) => {
        setProductsData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Lỗi truy vấn thông tin sản phẩm !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }

  // Dialog
  function onOverlayClick() {
    setDialogVisibility(false);
    setVisibilityDelete(false);
  }

  function dialogClose() {
    clearData();
    setDialogVisibility(false);
    setVisibilityDelete(false);
  }

  function addProduct() {
    setHeaderDialog('Thêm mới sản phẩm');
    setLabelButton('Thêm mới');
    setDialogVisibility(true);
  }

  const styleInput = {
    marginTop: '15px'
  }

  const buttonDialog = [
    {
      buttonModel: {
        content: labelButton,
        cssClass: 'e-flat',
        isPrimary: true,
      },
      click: () => {
        if (!productName || !productCode || !unit) {
          toast.error('Vui lòng nhập đầy đủ thông tin sản phẩm.', {
            position: toast.POSITION.TOP_RIGHT
          });
          return;
        }
        if (!productId) {
          var objProduct = {};
          objProduct['product_code'] = productCode;
          objProduct['product_name'] = productName;
          objProduct['description'] = description;
          objProduct['unit_id'] = unit;
          // call api insert data
          axios.post('/products', objProduct)
            .then(resp => {
              if (resp.status == '201') {
                toast.success(resp.data, {
                  position: toast.POSITION.TOP_RIGHT
                });
                retriveData();
              }
            })
            .catch(error => {
              toast.error('Thêm mới sản phẩm thất bại !', {
                position: toast.POSITION.TOP_RIGHT
              });
            });
        } else {
          //update product
          var objProduct = {};
          objProduct['product_code'] = productCode;
          objProduct['product_name'] = productName;
          objProduct['description'] = description;
          objProduct['unit_id'] = unit;
          axios.put('/products/' + productId, objProduct)
            .then(resp => {
              if (resp.status == '200') {
                toast.success(resp.data, {
                  position: toast.POSITION.TOP_RIGHT
                });
                retriveData();
              }
            })
            .catch(error => {
              toast.error('Cập nhật sản phẩm thất bại !', {
                position: toast.POSITION.TOP_RIGHT
              });
            });
        }
        setDialogVisibility(false);
        clearData();
      },
    },
    {
      buttonModel: {
        content: 'Huỷ bỏ',
        cssClass: 'e-flat',
      },
      click: () => {
        setDialogVisibility(false);
        clearData();
      },
    },
  ];

  function clearData() {
    setProductCode('');
    setProductName('');
    setDescription('');
    setUnit(null);
  }

  const editTemplate = (props) => {
    const productId = props.id;
    return (
      <div>
        <button className='e-icons e-edit-2 e-medium' onClick={() => editProduct(productId)} ></button>
      </div>
    );
  };

  function editProduct(productId) {
    setProductId(productId);
    setHeaderDialog("Cập nhật sản phẩm");
    setLabelButton('Cập nhật');
    // call api with product ID
    axios.get('/products/' + productId)
      .then((res) => {
        setProductCode(res.data.product_code);
        setProductName(res.data.product_name);
        setDescription(res.data.description);
        setUnit(res.data.unit_id);
      })
      .catch((error) => {
        toast.error('Lỗi truy vấn thông tin sản phẩm !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
    setDialogVisibility(true);
  }

  // Delete item product
  const deleteTemplate = (props) => {
    return (
      <div>
        <button className='e-icons e-trash e-medium' onClick={() => deleteProduct(props.id)} ></button>
      </div>
    );
  };

  function deleteProduct(productId) {
    setProductId(productId);
    setVisibilityDelete(true);
  }

  const buttonDialogDelete = [
    {
      buttonModel: {
        content: "Xoá",
        cssClass: 'e-flat',
        isPrimary: true,
      },
      click: () => {
        if (!productId) {
          return;
        }
        // call api delete 
        axios.delete('/products/' + productId)
          .then((res) => {
            toast.success(res.data, {
              position: toast.POSITION.TOP_RIGHT
            });
            retriveData();
          })
          .catch((error) => {
            toast.error('Lỗi xoá thông tin sản phẩm !', {
              position: toast.POSITION.TOP_RIGHT
            });
          });
        setVisibilityDelete(false);
        setProductId('');
      },
    },
    {
      buttonModel: {
        content: 'Huỷ bỏ',
        cssClass: 'e-flat',
      },
      click: () => {
        setProductId('');
        setVisibilityDelete(false);
      },
    },
  ];

  const fieldUnit = { text: 'unit_name', value: 'id' };

  const sortingOptions = {
    columns: [{ field: 'id', direction: 'descending' }]
  };

  const pageOptions = {
    pageSize: 10, pageSizes: true
  };
  return (
    <div className="m-2 md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl" id='dialog-target'>
      <ToastContainer autoClose={3000} />
      <ScaleLoader
        loading={loading} color={currentColor} height={40} margin={3} radius={2}
        speedMultiplier={1} width={5} cssOverride={cssSpinner} />
      <div className='mb-5'>
        <label className='text-2xl font-extrabold tracking-tight text-slate-900'>
          Danh sách sản phẩm
        </label>
        <button style={{ backgroundColor: currentColor, float: 'right' }} className='btn-add-product' onClick={() => addProduct()}>Thêm sản phẩm</button>
      </div>

      <GridComponent
        dataSource={productsData} sortSettings={sortingOptions} allowPaging allowSorting toolbar={['Search']} width='auto' pageSettings={pageOptions}>
        <ColumnsDirective>
          <ColumnDirective field='product_code' width='70' headerText='Mã sản phẩm' textAlign="Left" />
          <ColumnDirective field='product_name' width='300' headerText='Tên sản phẩm' textAlign="Left" />
          <ColumnDirective field='unit_name' width='50' headerText='Đơn vị' textAlign="Center" />
          <ColumnDirective field='id' width='20' headerText='' template={editTemplate} textAlign="Center" />
          <ColumnDirective field='id' width='20' headerText='' template={deleteTemplate} textAlign="Center" />
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
      </GridComponent>

      {/* Dialog Component add product */}
      <DialogComponent
        width="600px" isModal={true} visible={visibility} close={dialogClose} overlayClick={onOverlayClick}
        showCloseIcon={true} header={headerDialog} closeOnEscape={false} buttons={buttonDialog} position={positionDialog}>
        <TextBoxComponent placeholder="Mã sản phẩm" floatLabelType="Auto" value={productCode} input={(e) => setProductCode(e.value)}></TextBoxComponent>
        <TextBoxComponent placeholder="Tên sản phẩm" floatLabelType="Auto" value={productName} style={styleInput} input={(e) => setProductName(e.value)}></TextBoxComponent>
        <DropDownListComponent onChange={e => setUnit(e.target.value)} dataSource={unitsData}
          value={unit} showClearButton={true} fields={fieldUnit} style={styleInput} floatLabelType="Auto" placeholder="Đơn vị tính" />
        <TextBoxComponent multiline={true} placeholder="Mô tả sản phẩm" floatLabelType="Auto"
          style={styleInput} value={description} input={(e) => setDescription(e.value)}>
        </TextBoxComponent>
      </DialogComponent>

      {/* Dialog confirm delete */}
      <DialogComponent width="600px" isModal={true} visible={visibilityDelete}
        close={dialogClose} overlayClick={onOverlayClick}
        showCloseIcon={true} header='Xoá sản phẩm' closeOnEscape={false}
        buttons={buttonDialogDelete} position={positionDialog}>
        <h2>Bạn có chắc chắn muốn xoá sản phẩm không ?</h2>
      </DialogComponent>
    </div >
  )
}

export default Products