import generatorCellNumber from '../../commons/generatorCellNumber';

export default (index, value, rowIndex, style) => {
  let cell = `<c r="${generatorCellNumber(index, rowIndex)}"`;

  if (style) {
    cell += ` s="${style}"`;
  }

  cell += `><v>${value}</v></c>`;

  return cell;
};
