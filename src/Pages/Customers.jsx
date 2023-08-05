import { React, useEffect } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { useState } from 'react';
import { useStateContext } from "../Contexts/ContextProvider";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Customers = () => {
  const { currentColor } = useStateContext();
  const positionDialog = { X: "center", Y: 18 }
  const [headerDialog, setHeaderDialog] = useState('');
  const [labelButton, setLabelButton] = useState('');
  const [visibility, setDialogVisibility] = useState(false);
  const [customersData, setCustomersData] = useState([])

  // customer information
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [customerId, setCustomerId] = useState();

  // dialog confirm delete 
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
  }, [])

  function retriveData() {
    axios.get('/customers')
      .then((res) => {
        setCustomersData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Lỗi truy vấn thông tin khách hàng !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }

  // Dialog
  function onOverlayClick() {
    setDialogVisibility(false);
    setVisibilityDelete(false);
    clearData();
  }

  function dialogClose() {
    setDialogVisibility(false);
    setVisibilityDelete(false);
    clearData();
  }

  function addCustomer() {
    setHeaderDialog('Thêm mới khách hàng');
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
        if (!name || !phoneNumber || !address) {
          toast.error('Vui lòng nhập đầy đủ thông tin khách hàng.', {
            position: toast.POSITION.TOP_RIGHT
          });
          return;
        }
        if (!customerId) {
          var objCustomer = {};
          objCustomer['name'] = name;
          objCustomer['phone_number'] = phoneNumber;
          objCustomer['address'] = address;
          objCustomer['note'] = note;

          // call api insert data
          axios.post('/customers', objCustomer)
            .then(resp => {
              if (resp.status == '201') {
                toast.success(resp.data, {
                  position: toast.POSITION.TOP_RIGHT
                });
                retriveData();
              }
            })
            .catch(error => {
              toast.error('Thêm mới khách hàng thất bại !', {
                position: toast.POSITION.TOP_RIGHT
              });
              console.error("Call API POST :/customers error", error);
            });
        } else {
          //update product
          var objCustomer = {};
          objCustomer['name'] = name;
          objCustomer['phone_number'] = phoneNumber;
          objCustomer['address'] = address;
          objCustomer['note'] = note;
          axios.put('/customers/' + customerId, objCustomer)
            .then(resp => {
              if (resp.status == '200') {
                toast.success(resp.data, {
                  position: toast.POSITION.TOP_RIGHT
                });
                retriveData();
              };

            })
            .catch(error => {
              toast.error('Cập nhật thông tin khách hàng thất bại !', {
                position: toast.POSITION.TOP_RIGHT
              });
              console.error("Call API PUT :/customers/:customerId error", error);
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
    setPhoneNumber('');
    setName('');
    setNote('');
    setAddress('');
    setCustomerId('');
  }

  const editTemplate = (props) => {
    return (
      <div>
        <button className='e-icons e-edit-2 e-medium' onClick={() => editCustomer(props.id)} ></button>
      </div>
    );
  };

  function editCustomer(customerId) {
    setCustomerId(customerId);
    setHeaderDialog("Cập nhật thông tin khách hàng");
    setLabelButton('Cập nhật');

    // call api get information customer
    axios.get('/customers/' + customerId)
      .then((res) => {
        setName(res.data.name);
        setPhoneNumber(res.data.phone_number);
        setAddress(res.data.address);
        setNote(res.data.note);
      })
      .catch((error) => {
        toast.error('Lỗi truy vấn thông tin khách hàng !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });

    setDialogVisibility(true);
  }

  // Delete item product
  const deleteTemplate = (props) => {
    return (
      <div>
        <button className='e-icons e-trash e-medium' onClick={() => deleteCustomer(props.id)} ></button>
      </div>
    );
  };

  function deleteCustomer(customerId) {
    setCustomerId(customerId);
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
        if (!customerId) {
          return;
        }
        // call api delete 
        axios.delete('/customers/' + customerId)
          .then((res) => {
            toast.success(res.data, {
              position: toast.POSITION.TOP_RIGHT
            });
            retriveData();
          })
          .catch((error) => {
            toast.error('Lỗi xoá thông tin khách hàng !', {
              position: toast.POSITION.TOP_RIGHT
            });
          });
        setCustomerId('');
        setVisibilityDelete(false);
      },
    },
    {
      buttonModel: {
        content: 'Huỷ bỏ',
        cssClass: 'e-flat',
      },
      click: () => {
        setCustomerId('');
        setVisibilityDelete(false);
      },
    },
  ];

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
        width={5} cssOverride={cssSpinner}
      />
      <div className='mb-5'>
        <label className='text-2xl font-extrabold tracking-tight text-slate-900'>
          Danh sách khách hàng
        </label>
        <button style={{ backgroundColor: currentColor, float: 'right' }} className='btn-add-customer'
          onClick={() => addCustomer()}>Thêm khách hàng
        </button>
      </div>

      <GridComponent
        dataSource={customersData} sortSettings={sortingOptions} allowPaging allowSorting toolbar={['Search']} width='auto' pageSettings={pageOptions}>
        <ColumnsDirective>
          <ColumnDirective field='name' width='100' headerText='Tên khách hàng' textAlign="Left" />
          <ColumnDirective field='phone_number' width='60' headerText='Số điện thoại' textAlign="Left" />
          <ColumnDirective field='address' width='200' headerText='Địa chỉ' textAlign="Left" />
          <ColumnDirective field='id' width='20' headerText='' template={editTemplate} textAlign="Center" />
          <ColumnDirective field='id' width='20' headerText='' template={deleteTemplate} textAlign="Center" />
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
      </GridComponent>

      {/* Dialog Component add product */}
      <DialogComponent
        width="600px" isModal={true} visible={visibility} close={dialogClose} overlayClick={onOverlayClick}
        showCloseIcon={true} header={headerDialog} closeOnEscape={false} buttons={buttonDialog} position={positionDialog}>

        <TextBoxComponent placeholder="Tên khách hàng" floatLabelType="Auto" value={name} input={(e) => setName(e.value)} />
        <TextBoxComponent placeholder="Số điện thoại" floatLabelType="Auto" value={phoneNumber} style={styleInput}
          input={(e) => setPhoneNumber(e.value)} />
        <TextBoxComponent multiline={true} placeholder="Địa chỉ" floatLabelType="Auto"
          style={styleInput} value={address} input={(e) => setAddress(e.value)} />
        <TextBoxComponent multiline={true} placeholder="Note" floatLabelType="Auto"
          style={styleInput} value={note} input={(e) => setNote(e.value)}>
        </TextBoxComponent>
      </DialogComponent>

      {/* Dialog confirm delete */}
      <DialogComponent width="600px" isModal={true} visible={visibilityDelete}
        close={dialogClose} overlayClick={onOverlayClick}
        showCloseIcon={true} header='Xoá khách hàng' closeOnEscape={false}
        buttons={buttonDialogDelete} position={positionDialog}>
        <h2>Bạn có chắc chắn muốn xoá khách hàng không ?</h2>
      </DialogComponent>
    </div >
  )
}

export default Customers