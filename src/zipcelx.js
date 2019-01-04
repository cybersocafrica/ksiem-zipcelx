import JSZip from 'jszip';
import FileSaver from 'file-saver';

import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';

import workbookXML from './statics/workbook.xml';
import workbookXMLRels from './statics/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './statics/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

import defaultStyles from './statics/default_styles.xml';
import styleTemplate from './templates/styles.xml';


export const generateXMLWorksheet = (rows, styles) => {
  const XMLRows = generatorRows(rows, styles);
  return templateSheet.replace('{placeholder}', XMLRows);
};

export default (config) => {
  if (!validator(config)) {
    throw new Error('Validation failed.');
  }

  const zip = new JSZip();
  const xl = zip.folder('xl');
  xl.file('workbook.xml', workbookXML);
  xl.file('_rels/workbook.xml.rels', workbookXMLRels);
  zip.file('_rels/.rels', rels);
  zip.file('[Content_Types].xml', contentTypes);

  const styles = [];

  const worksheet = generateXMLWorksheet(config.sheet.data, styles);
  xl.file('worksheets/sheet1.xml', worksheet);

  if (styles.length === 0) {
    const styleFile = styleTemplate.replace('{placeholder}', defaultStyles);
    xl.file('styles.xml', styleFile);
  }

  return zip.generateAsync({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }).then((blob) => {
    FileSaver.saveAs(blob, `${config.filename}.xlsx`);
  });
};
