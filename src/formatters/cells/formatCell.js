import { validTypes, CELL_TYPE_STRING, WARNING_INVALID_TYPE } from '../../commons/constants';
import generatorStringCell from './generatorStringCell';
import generatorNumberCell from './generatorNumberCell';

export default (cell, index, rowIndex, styles) => { // eslint-disable-line
  if (validTypes.indexOf(cell.type) === -1) {
    console.warn(WARNING_INVALID_TYPE);
    cell.type = CELL_TYPE_STRING;
  }

  // let styleIndex = null;

  // if (cell.style && styles !== undefined) {
  //   styleIndex = styles.indexOf(cell.style);
  //
  //   if (styleIndex === -1) {
  //     styles.push(cell.style);
  //     styleIndex = 1;
  //   } else if (styleIndex === 0) {
  //     styleIndex = 1;
  //   }
  // }

  return (
    cell.type === CELL_TYPE_STRING
    ? generatorStringCell(index, cell.value, rowIndex, cell.style ? cell.style.toString() : '')
    : generatorNumberCell(index, cell.value, rowIndex, cell.style ? cell.style.toString() : '')
  );
};
