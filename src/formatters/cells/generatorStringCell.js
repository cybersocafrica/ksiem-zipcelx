import escape from 'lodash.escape';
import generatorCellNumber from '../../commons/generatorCellNumber';

export default (index, value, rowIndex, style) => {
  let cell = `<c r="${generatorCellNumber(index, rowIndex)}"`;

  if (style) {
    cell += ` s="${style}"`;
  }

  cell += ` t="inlineStr"><is><t>${escape(value)}</t></is></c>`;

  return cell;
};
