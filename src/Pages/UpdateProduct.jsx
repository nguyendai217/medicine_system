import React from "react";
import { Header } from "../Components";
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UpdateProduct = ({ props }) => {
  const positionDialog = { X: "center", Y: 18 }
  const [visibility, setDialogVisibility] = useState(false);

  const [productCode, setProductCode] = useState();
  const [productName, setProductName] = useState();
  const [description, setDescription] = useState();
  const [unit, setUnit] = useState('');
  const [unitsData, setUnitsData] = useState([])
  const fieldUnit = { text: 'unit_name', value: 'id' };

  useEffect(() => {
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

  function onOverlayClick() {
    setDialogVisibility(false);
  }

  const dialogClose = () => {
    clearData();
    setDialogVisibility(false);
  }

  const buttonDialog = [
    {
      buttonModel: {
        content: "Cập nhật",
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
          return;
        }
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


  return (
    <>
      <ToastContainer autoClose={3000} />
      <DialogComponent
        width="600px" isModal={true} visible={visibility}
        close={dialogClose} overlayClick={onOverlayClick}
        showCloseIcon={true} header="Cập nhật sản phẩm"
        closeOnEscape={false} buttons={buttonDialog} position={positionDialog}>

        <TextBoxComponent placeholder="Mã sản phẩm" floatLabelType="Auto"
          value={productCode} input={(e) => setProductCode(e.target.value)}>
        </TextBoxComponent>

        <TextBoxComponent placeholder="Tên sản phẩm" floatLabelType="Auto"
          value={productName} style={{ marginTop: '15px' }} input={(e) => setProductName(e.value)}>
        </TextBoxComponent>

        <DropDownListComponent onChange={e => setUnit(e.target.value)} dataSource={unitsData}
          value={unit} showClearButton={true} fields={fieldUnit}
          style={{ marginTop: '15px' }} floatLabelType="Auto" placeholder="Đơn vị tính" />

        <TextBoxComponent multiline={true} placeholder="Mô tả sản phẩm" floatLabelType="Auto"
          style={{ marginTop: '15px' }} value={description} input={(e) => setDescription(e.target.value)}>
        </TextBoxComponent>
      </DialogComponent>
    </>
  );
};

export default UpdateProduct;
