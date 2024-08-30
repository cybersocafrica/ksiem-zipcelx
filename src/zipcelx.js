import JSZip from 'jszip';
// import FileSaver from 'file-saver';

import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';
import generatorCols from './formatters/cols/generatorCols';

import workbookXML from './statics/workbook.xml';
import workbookXMLRels from './statics/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './statics/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

// import defaultStyles from './statics/default_styles.xml';
import styleTemplate from './templates/styles.xml';
import styleInnerTemplate from './templates/styles_inner_template.xml';

export const generateXMLWorksheet = (rows, cols, styles) => {
  const XMLRows = generatorRows(rows, styles);
  const XMLCols = generatorCols(cols);
  return templateSheet.replace('{placeholder}', XMLRows).replace('{colsPlaceholder}', XMLCols);
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

  const worksheet = generateXMLWorksheet(config.sheet.data, config.sheet.cols, styles);
  xl.file('worksheets/sheet1.xml', worksheet);

  // if (styles.length === 0) {
  //   const styleFile = styleTemplate.replace('{placeholder}', defaultStyles);
  //   xl.file('styles.xml', styleFile);
  // } else {
    // expand this if more than fill is needed

  const backgroundFills = [];

  for (let i = 0; i < styles.length; i++) {
    if (styles[i].indexOf('bgColor=') > -1) {
      const openingQuoteIndex = styles[i].indexOf('"', styles[i].indexOf('bgColor='));
      const closingQuoteIndex = styles[i].indexOf('"', openingQuoteIndex + 1);

      const fill = styles[i].substring(openingQuoteIndex + 1, closingQuoteIndex);
      backgroundFills.push(fill);
    }
  }

  let fillsString = `<fills count="${backgroundFills.length + 2}"><fill /><fill><patternFill patternType="gray125"/></fill>`;
  // let cellXfsString = `<cellXfs count="${backgroundFills.length + 1}"><xf />`;
  // let colorsString = '<colors><indexedColors>';

  for (let i = 0; i < backgroundFills.length; i++) {
    fillsString += `<fill><patternFill patternType="solid"><fgColor indexed="${i}"/></patternFill></fill>`;
    // colorsString += `<rgbColor rgb="${backgroundFills[i]}"/>`;
    // cellXfsString += `<xf fillId="${i + 2}" applyFill="1"/>`;
  }

  fillsString += '</fills>';
  // cellXfsString += '</cellXfs>';
  // colorsString += '</indexedColors></colors>';

  const styleData = styleInnerTemplate.replace('{fillsPlaceholder}', fillsString);
  // styleData = styleData.replace('{xfsPlaceholder}', cellXfsString + colorsString);

  const styleFile = styleTemplate.replace('{placeholder}', styleData);
  xl.file('styles.xml', styleFile);
  // }

  return zip.generateAsync({
    type: 'nodebuffer'
  }).then(blob => blob);
};
