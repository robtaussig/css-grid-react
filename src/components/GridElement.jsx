const React = require('react');
const { Consumer } = require('./GridContext');
const {
  getElementInfoFromStore,
  getElementStyle,
  elementHasChildren
} = require('../helpers/');

const defaultStyle = {
  border: '1px solid black'
};

module.exports = class GridElement extends React.Component {
  constructor(props) {
    super(props);
    this.generateStyle = this.generateStyle.bind(this);
  }

  generateStyle(store) {
    const elementInfo = getElementInfoFromStore(store, this.props);

    if (elementInfo) {
      const elementStyle = getElementStyle(elementInfo);
      return Object.assign({}, defaultStyle, elementStyle);
    }

    return defaultStyle;
  }

  setPositionInGrid(col, row) {
    this.setState({ col, row });
  }

  render() {
    const isRow = Boolean(this.props.row);
    const hasChildren = elementHasChildren(this.props);
    const shouldNotWrap = isRow && hasChildren;

    return (
      <Consumer>
        {store => shouldNotWrap ? this.props.children : (
          <div style={this.generateStyle(store)}>
            {this.props.children}
          </div>
        )}
      </Consumer>
    );
  }
};
