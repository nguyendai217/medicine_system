import { React, useState } from "react";
import { DialogComponent } from '@syncfusion/ej2-react-popups';
const ProductDetail = (props) => {
  console.log("props", props);
  const [visible, setVisible] = useState(props.showDetail);
  console.log(props.showDetail);
  //const productId = props.productId;
  // call API
  //Mock data;
  const product = {
    id: 2,
    product_name: '15B With Ginseng (Hộp 10 vỉ x 10 viên).Việt Pháp',
    product_code: '017766',
    description: 'TPCN giúp bồi bổ sức khỏe, kích thích tiêu hóa ăn ngon miệng, phòng suy dinh dưỡng,tăng cường hệ miễn dịch của cơ thể, nâng cao thể lực, trí lực.',
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

  const dialogClose = () => {
    setVisible(false);
  };

  const buttonDialog = [
    {
      buttonModel: {
        content: 'OK',
        cssClass: 'e-flat'
      },
      click: () => {
        setVisible(false);
      }
    }];

  return (
    <div id='dialog-target'>
      <DialogComponent width='500px' target='#dialog-target' close={() => dialogClose()}
        header='Thông tin sản phẩm' visible={visible}
        showCloseIcon={true} buttons={buttonDialog}>
        <h2>Mã sản phẩm:</h2> {product.product_code}<br></br>
        <h2>Tên sản phẩm:</h2> {product.product_name}<br></br>
        <h2>Mô tả sản phẩm:</h2> {product.description}<br></br>
      </DialogComponent>
    </div>
  );
};
export default ProductDetail;