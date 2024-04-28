import React from "react";
import PropTypes from 'prop-types';

const globalNumberSystem = [
  {
    value: 1,
    symbol: "",
  },
  {
    value: 1e3,
    symbol: "K",
  },
  {
    value: 1e6,
    symbol: "M",
  },
  {
    value: 1e9,
    symbol: "B",
  },
  {
    value: 1e12,
    symbol: "T",
  },
  {
    value: 1e15,
    symbol: "Q",
  }
];

const indianNumberSystem = [
  {
    value: 1,
    symbol: "",
  },
  {
    value: 1e3,
    symbol: "K",
  },
  {
    value: 1e5,
    symbol: "Lac",
  },
  {
    value: 1e7,
    symbol: "Cr",
  },
];

const AdaptiveFormat = (props) => {
  const { isIndianNumeric, children, precisionValue } = props;
  const value = Number(children);
  const precisionValueDigit = Number(precisionValue);
  const numberSystem = isIndianNumeric ? indianNumberSystem : globalNumberSystem;

  function formatToAdaptive(num, digits) {
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = numberSystem.length - 1; i > 0; i--) {
      if (num >= numberSystem[i].value) {
        break;
      }
    }
    return (num / numberSystem[i].value).toFixed(digits).replace(rx, "$1") + numberSystem[i].symbol;
  }
  return <>{isNaN(children) ? children : formatToAdaptive(value, precisionValueDigit)}</>;
};

AdaptiveFormat.defaultProps = {
  isIndianNumeric: false,
  precisionValue: 0
};

AdaptiveFormat.propTypes = {
  isIndianNumeric: PropTypes.bool,
  precisionValue: PropTypes.number
};


export default AdaptiveFormat;