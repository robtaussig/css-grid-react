import merge from 'deepmerge';

export const ensureTypeArray = (element) => {
  return Array.isArray(element) ? element : [element];
};

const processGrandChild = (grandChild, rowIdx, colIdx) => {
  return {
    key: grandChild.props.gridKey,
    row: rowIdx + 1,
    col: colIdx + 1
  };
};

const iterateGrandChildren = (children, parentGridKey, rowIdx) => {
  const grandChildren = ensureTypeArray(children);
  const childrenCount = { [rowIdx + 1]: grandChildren.length };
  const columnsInfo = [];
  const nextGridStore = {};
  let maxChildCount = 0;
  nextGridStore[parentGridKey] = {};

  grandChildren.forEach((grandChild, colIdx) => {
    if (grandChild.props) {
      nextGridStore[grandChild.props.gridKey] = {};
      const grandChildInfo = processGrandChild(grandChild, rowIdx, colIdx);
      columnsInfo.push(grandChildInfo);
      maxChildCount = maxChildCount + 1 > colIdx ? maxChildCount : colIdx + 1;
    }
  });

  return {
    nextGridStore,
    columnsInfo,
    maxChildCount,
    childrenCount,
  };
};

const processChild = (child, rowIdx) => {
  const rowInfo = {
    key: child.props.gridKey,
    row: rowIdx + 1
  };
  const {
    nextGridStore,
    columnsInfo,
    maxChildCount,
    childrenCount
  } = iterateGrandChildren(child.props.children, child.props.gridKey, rowIdx);

  return {
    rowInfo,
    childrenCount,
    maxChildCount,
    nextGridStore,
    columnsInfo
  };
};

const iterateChildren = (children) => {
  let rows = [];
  let columns = [];
  let gridStore = {};
  let columnCount = {};
  let maxColumns = 0;

  children.forEach((child, rowIdx) => {
    if (child.props) {
      const {
        rowInfo,
        childrenCount,
        maxChildCount,
        nextGridStore,
        columnsInfo
      } = processChild(child, rowIdx);

      rows.push(rowInfo);
      columnCount = Object.assign({}, columnCount, childrenCount);
      maxColumns = maxColumns > maxChildCount ? maxColumns : maxChildCount;
      gridStore = Object.assign({}, gridStore, nextGridStore);
      columns = columns.concat(columnsInfo);
    }    
  });

  return {
    columns,
    rows,
    gridStore,
    columnCount,
    maxColumns,
  };
};

const getColumnInformation = ({ nextGridStore, column, startsAsColumns, children, columnCount, maxColumns }) => {
  const columnInformation = Object.assign({}, nextGridStore[column.key]);

  if (startsAsColumns) {
    columnInformation.row = Object.assign({}, columnInformation.row, column, {
      numRows: children.length,
      numChildren: columnCount[column.row],
      col: column.row,
      row: column.col,
      asColumn: true
    });
  } else {
    columnInformation.column = Object.assign({}, columnInformation.column, column, {
      numColumns: maxColumns,
      numSiblings: columnCount[column.row],
      col: column.col,
      row: column.row,
    });
  }

  return columnInformation;
};

const getRowInformation = ({ nextGridStore, row, startsAsColumns, children, maxColumns, columnCount }) => {
  const rowInformation = Object.assign({}, nextGridStore[row.key]);

  if (startsAsColumns) {
    rowInformation.column = Object.assign({}, rowInformation.column, row, {
      numColumns: maxColumns,
      numSiblings: columnCount[row.row],
      col: row.row,
      row: 1,
      asColumn: true
    });
  } else {
    rowInformation.row = Object.assign({}, rowInformation.row, row, {
      numRows: children.length,
      numChildren: columnCount[row.row],
    });
  }

  return rowInformation;
};

const mergeInformation = (options) => {
  const { children, columns, rows, gridStore, columnCount, maxColumns, startsAsColumns } = options;
  const nextGridStore = Object.assign({}, gridStore);

  columns.forEach(column => {
    nextGridStore[column.key] = getColumnInformation({
      nextGridStore,
      column,
      startsAsColumns,
      children,
      columnCount,
      maxColumns 
    });
  });

  rows.forEach(row => {
    nextGridStore[row.key] = getRowInformation({
      nextGridStore,
      row,
      startsAsColumns,
      children,
      maxColumns,
      columnCount
    });
  });

  return nextGridStore;
};

export const getInformationFromChildren = (children, startsAsColumns = false) => {
  const {
    columns,
    rows,
    gridStore,
    columnCount,
    maxColumns
  } = iterateChildren(children);

  const nextGridStore = mergeInformation({ children, columns, rows, gridStore, columnCount, maxColumns, startsAsColumns });
  
  return nextGridStore;
};

export const getRowTemplateFromChildren = (children) => {
  return children
    .map(child => child.props && child.props.height || '1fr')
    .join(' ');
};

export const getColumnTemplateFromChildren = (children) => {
  return children
    .reduce((acc, child) => {
      const grandChildren = ensureTypeArray(child.props.children);
      return grandChildren.length > acc.length ? grandChildren : acc;
    }, [])
    .map(child => child.props && child.props.width || '1fr')
    .join(' ');
};

export const getElementInfoFromStore = (store, props) => {
  const { gridKey } = props;

  return store[gridKey];
};

export const getElementStyle = (elementInfo) => {
  const elementStyle = {};
  const rowHasOwnChild = () => {
    return elementInfo.row.numChildren === 1;
  };
  const startsAsColumn = () => {
    return elementInfo.column.asColumn;
  };

  if (elementInfo.column) {
    elementStyle.gridColumn = elementInfo.column.col;
    if (startsAsColumn()) {
      elementStyle.gridRow = '1 / -1';
    } else {
      elementStyle.gridRow = elementInfo.column.row;
    }
  }
  
  if (elementInfo.row) {    
    elementStyle.gridRow = elementInfo.row.row;
    elementStyle.gridColumn = '1 / -1';    
  }

  return elementStyle;
};

export const elementHasGridChildren = (props) => {
  return typeof props.children !== 'string' && props.children && props.children.length > 0;
};

export const deepMergeObject = (left, right) => {
  const merged = merge(left, right);
  return merged;
};