const React = require('react');
const { Provider } = require('./GridContext');

module.exports = class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      store: {
        
      }
    };
    this.generateStyle = this.generateStyle.bind(this);
  }

  componentDidMount() {
    this.generateGridStore();
  }

  generateStyle() {
    const gridTemplate = this.getGridTemplateFromChildren();
    return {
      display: 'grid',
      gridTemplate: gridTemplate
    };
  }

  generateGridStore() {
    const columns = [];
    const rows = [];
    const nextGridStore = {};
    const columnCount = {};
    const children = this.props.children.forEach ? this.props.children : [this.props.children];
    let maxColumns = 0;
    children.forEach((child, rowIdx) => {
      if (child.props && child.props.row) {
        rows.push({
          key: child.props.gridKey,
          row: rowIdx + 1
        });
        const grandChildren = child.props.children.forEach ? child.props.children : [child.props.children];
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
    this.setState({
      store: nextGridStore
    });
  }

  getGridTemplateFromChildren() {
    const children = this.props.children.map ? this.props.children : [this.props.children];

    const rows = children
      .map(child => child.props.height || '1fr')
      .join(' ');

    const columns = this.props.children
      .reduce((acc, child) => {
        const grandChildren = child.props.children.map ? child.props.children : [child.props.children];
        return grandChildren.length > acc ? grandChildren : acc;
      }, [])
      .map(child => child.props.width || '1fr')
      .join(' ');

    return `${rows} / ${columns}`;
  }

  render() {
    return (
      <Provider value={this.state.store}>
        <div style={this.generateStyle()}>
          {this.props.children}
        </div>
      </Provider>      
    );
  }
};