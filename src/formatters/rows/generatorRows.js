import formatRow from './formatRow';

export default (rows, styles) => (
  rows
  .map((row, index) => formatRow(row, index, styles))
  .join('')
);
