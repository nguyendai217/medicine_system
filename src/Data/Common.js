export const templateInputPrice = (props) => {
  return new Intl.NumberFormat().format(props.input_price);
};

export const templateBuyPrice = (props) => {
  return new Intl.NumberFormat().format(props.buy_price);
};

export const templateTotalInputPrice = (props) => {
  return new Intl.NumberFormat().format(props.total_input_item);
};

export const templateTotalOutputPrice = (props) => {
  return new Intl.NumberFormat().format(props.total_output_item);
};