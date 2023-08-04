import { React } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FiCreditCard, FiHome, FiInbox, FiTrello } from 'react-icons/fi';
import { BsCurrencyDollar, BsShield } from 'react-icons/bs';
import { IoMdContacts } from 'react-icons/io';

import avatar from './avatar.png';

export const gridOrderImage = (props) => (
  <div>
    <img
      className="rounded-xl h-20 md:ml-3"
      src={props.ProductImage}
      alt="order-item"
    />
  </div>
);

export const gridOrderStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.Status}
  </button>
);

export const links = [
  {
    title: '',
    links: [
      {
        name: 'home',
        display_name: 'Trang chủ',
        icon: <FiHome />,
      },
      {
        name: 'products',
        display_name: 'Sản phẩm',
        icon: <FiInbox />,
      },
      {
        name: 'order',
        display_name: 'Order SP',
        icon: <AiOutlineShoppingCart />,
      },
      {
        name: 'order-manager',
        display_name: 'Quản lý order',
        icon: <FiTrello />,
      },
      {
        name: 'customers',
        display_name: 'Quản lý KH',
        icon: <IoMdContacts />,
      },

    ],
  },
];

export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
  },
  {
    icon: <BsShield />,
    title: 'My Inbox',
    desc: 'Messages & Emails',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
  },
  {
    icon: <FiCreditCard />,
    title: 'My Tasks',
    desc: 'To-do and Daily Tasks',
    iconColor: 'rgb(255, 244, 229)',
    iconBg: 'rgb(254, 201, 15)',
  },
];

export const contextMenuItems = [
  'AutoFit',
  'AutoFitAll',
  'SortAscending',
  'SortDescending',
  'Copy',
  'Edit',
  'Delete',
  'Save',
  'Cancel',
  'PdfExport',
  'ExcelExport',
  'CsvExport',
  'FirstPage',
  'PrevPage',
  'LastPage',
  'NextPage',
];
