const React = require('react');
const { Consumer } = require('./GridContext');

const defaultStyle = {
  border: '1px solid black'
};

module.exports = class GridElement extends React.Component {
  constructor(props) {
    super(props);
    this.generateStyle = this.generateStyle.bind(this);
  }

  generateStyle(store) {
    const { gridKey } = this.props;
    const elementInfo = store[gridKey];
    if (elementInfo) {
      const elementStyle = {};
      if (elementInfo.column) {
        elementStyle.gridColumn = elementInfo.column.col;
        elementStyle.rowColumn = elementInfo.column.row;
      }
      if (elementInfo.row) {
        elementStyle.gridRow = elementInfo.row.row;
        if (elementInfo.row.numChildren === 1) {
          elementStyle.gridColumn = '1 / -1';
        }
      }
      return Object.assign({}, defaultStyle, elementStyle);
    } else {
      return defaultStyle;
    }
  }

  setPositionInGrid(col, row) {
    this.setState({ col, row });
  }

  render() {
    const isRow = Boolean(this.props.row);
    const hasChildren = typeof this.props.children !== 'string' && this.props.children && this.props.children.length > 0;
    return (
      <Consumer>
        {store => isRow && hasChildren ? this.props.children : (
          <div style={this.generateStyle(store)}>
            {this.props.children}
          </div>
        )}
      </Consumer>      
    );
  }
};
