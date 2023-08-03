import { React } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { productsData, productsGrid, unitData } from '../Data/dummy';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Header } from '../Components';
import { useState } from 'react';
import ProductDetail from './ProductDetail';
import { useStateContext } from "../Contexts/ContextProvider";

const Products = () => {
  const { currentColor } = useStateContext();
  const positionDialog = { X: "center", Y: 18 }
  const [headerDialog, setHeaderDialog] = useState('');
  const [labelButton, setLabelButton] = useState('');
  const [visibility, setDialogVisibility] = useState(false);

  // product information
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState();
  const [productId, setProductId] = useState();

  // dialog confirm delete product
  const [visibilityDelete, setVisibilityDelete] = useState(false);


  function onOverlayClick() {
    setDialogVisibility(false);
    setVisibilityDelete(false);
  }

  function dialogClose() {
    clearData();
    setDialogVisibility(false);
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
          alert("Vui lòng nhập đầy đủ thông tin sản phẩm !");
          return;
        }
        if (!productId) {
          alert('add new product');
        } else {
          alert('update product');
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

  const pageOptions = {
    pageSize: 10, pageSizes: true
  };

  function clearData() {
    setProductCode('');
    setProductName('');
    setDescription('');
  }

  const editTemplate = (props) => {
    const productId = props.Id;
    return (
      <div>
        <button className='e-icons e-edit-2 e-medium' onClick={() => editProduct(productId)} ></button>
      </div>
    );
  };

  function editProduct(productId) {
    setProductId(productId);

    // call api with product ID = 2
    const product = {
      id: 2,
      product_name: '15B With Ginseng (Hộp 10 vỉ x 10 viên).Việt Pháp',
      product_code: '017766',
      description: 'TPCN giúp bồi bổ sức khỏe, kích thích tiêu hóa ăn ngon miệng, phòng suy dinh dưỡng,tăng cường hệ miễn dịch của cơ thể, nâng cao thể lực, trí lực.',
      unit: '1'
    }
    setHeaderDialog("Cập nhật sản phẩm");
    setLabelButton('Cập nhật');
    setProductCode(product.product_code);
    setProductName(product.product_name);
    setDescription(product.description);
    setUnit(product.unit);
    setDialogVisibility(true);
  }

  // Delete item product
  const deleteTemplate = (props) => {
    const productId = props.Id;
    return (
      <div>
        <button className='e-icons e-trash e-medium' onClick={() => deleteProduct(productId)} ></button>
      </div>
    );
  };

  function deleteProduct(productId) {
    setProductId(productId);
    setVisibilityDelete(true);
  }

  function closeDialogDelete() {
    setVisibilityDelete(false);
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
        alert("call api delete product Id: " + productId);
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
        setVisibilityDelete(false);
      },
    },
  ];

  const fieldUnit = { text: 'unit_name', value: 'id' };
  return (
    <div className="m-2 md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl" id='dialog-target'>
      {/* <Header category="" title="Danh sách sản phẩm" /> */}
      <div className='mb-5'>
        <label className='text-2xl font-extrabold tracking-tight text-slate-900'>
          Danh sách sản phẩm
        </label>
        <button style={{ backgroundColor: currentColor, float: 'right' }} className='btn-add-product' onClick={() => addProduct()}>Thêm sản phẩm</button>
      </div>

      <GridComponent
        dataSource={productsData}
        allowPaging
        allowSorting
        toolbar={['Search']}
        //editSettings={{ allowDeleting: true, allowEditing: true }}
        width='auto'
        pageSettings={pageOptions}
      >
        <ColumnsDirective>
          <ColumnDirective field='product_code' width='70' headerText='Mã sản phẩm' textAlign="Left" />
          <ColumnDirective field='product_name' width='300' headerText='Tên sản phẩm' textAlign="Left" />
          <ColumnDirective field='unit' width='50' headerText='Đơn vị' textAlign="Center" />
          <ColumnDirective field='Id' width='20' headerText='' template={editTemplate} textAlign="Center" />
          <ColumnDirective field='Id' width='20' headerText='' template={deleteTemplate} textAlign="Center" />
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
      </GridComponent>

      {/* Dialog Component add product */}
      <DialogComponent width="600px" isModal={true} visible={visibility}
        close={dialogClose} overlayClick={onOverlayClick}
        showCloseIcon={true} header={headerDialog} closeOnEscape={false}
        buttons={buttonDialog} position={positionDialog}
      >
        <TextBoxComponent placeholder="Mã sản phẩm" floatLabelType="Auto" value={productCode} input={(e) => setProductCode(e.value)}></TextBoxComponent>
        <TextBoxComponent placeholder="Tên sản phẩm" floatLabelType="Auto" value={productName} style={styleInput} input={(e) => setProductName(e.value)}></TextBoxComponent>

        <DropDownListComponent onChange={e => setUnit(e.target.value)} dataSource={unitData}
          fields={fieldUnit} style={styleInput}
          floatLabelType="Auto" placeholder="Đơn vị tính"
        />
        <TextBoxComponent multiline={true} placeholder="Mô tả sản phẩm" floatLabelType="Auto" style={styleInput}></TextBoxComponent>
      </DialogComponent>


      {/* Dialog confirm delete */}
      <DialogComponent width="600px" isModal={true} visible={visibilityDelete}
        close={closeDialogDelete} overlayClick={onOverlayClick}
        showCloseIcon={true} header='Xoá sản phẩm' closeOnEscape={false}
        buttons={buttonDialogDelete} position={positionDialog}
      >
        <h2>Bạn có chắc chắn muốn xoá sản phẩm không ?</h2>
      </DialogComponent>


    </div >
  )
}

export default Products