export const ensureTypeArray = (element) => {
  return Array.isArray(element) ? element : [element];
};

export const getInformationFromChildren = (children) => {
  const columns = [];
  const rows = [];
  const nextGridStore = {};
  const columnCount = {};
  let maxColumns = 0;
  
  children.forEach((child, rowIdx) => {
    if (child.props && child.props.row) {
      const grandChildren = ensureTypeArray(child.props.children);
      rows.push({
        key: child.props.gridKey,
        row: rowIdx + 1
      });
      columnCount[rowIdx + 1] = grandChildren.length;

      grandChildren.forEach((grandChild, colIdx) => { 
        if (grandChild.props && grandChild.props.column) {
          columns.push({
            key: grandChild.props.gridKey,
            row: rowIdx + 1,
            col: colIdx + 1
          });
          nextGridStore[grandChild.props.gridKey] = {};
          maxColumns = maxColumns + 1 > colIdx ? maxColumns : colIdx + 1;
        }
      });
      nextGridStore[child.props.gridKey] = {};
    }
  });
  columns.forEach(column => {
    nextGridStore[column.key].column = Object.assign({}, column, {
      numColumns: maxColumns,
      numSiblings: columnCount[column.row]
    });
  });
  rows.forEach(row => {
    nextGridStore[row.key].row = Object.assign({}, row, {
      numRows: children.length,
      numChildren: columnCount[row.row]
    });
  });
  return nextGridStore;
};

export const getRowTemplateFromChildren = (children) => {
  return children
    .map(child => child.props.height || '1fr')
    .join(' ');
};

export const getColumnTemplateFromChildren = (children) => {
  return children
    .reduce((acc, child) => {
      const grandChildren = ensureTypeArray(child.props.children);
      return grandChildren.length > acc.length ? grandChildren : acc;
    }, [])
    .map(child => child.props.width || '1fr')
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

  if (elementInfo.column) {
    elementStyle.gridColumn = elementInfo.column.col;
    elementStyle.gridRow = elementInfo.column.row;
  }
  
  if (elementInfo.row) {
    elementStyle.gridRow = elementInfo.row.row;
    if (rowHasOwnChild()) {
      elementStyle.gridColumn = '1 / -1';
    }
  }

  return elementStyle;
};

export const elementHasChildren = (props) => {
  return typeof props.children !== 'string' && props.children && props.children.length > 0;
};