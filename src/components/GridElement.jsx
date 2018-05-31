const React = require('react');
const { Consumer } = require('./GridContext.jsx');
const Grid = require('./Grid.jsx');
const {
  getElementInfoFromStore,
  getElementStyle,
  elementHasGridChildren
} = require('../helpers/');

const defaultStyle = {
  border: '1px solid black',
  margin: '-1px'
};

module.exports = class GridElement extends React.Component {
  constructor(props) {
    super(props);
    this.generateStyle = this.generateStyle.bind(this);
  }

  applyPropertyModifiers() {
    const styles = {};
    if (this.props.centered) {
      styles.display = 'flex';
      styles.justifyContent = 'center';
      styles.alignItems = 'center';
    }
    return styles;
  }

  generateStyle(store) {
    const elementInfo = getElementInfoFromStore(store, this.props);
    // console.log(store, this.props);
    if (elementInfo) {
      const elementStyle = getElementStyle(elementInfo);
      const propertyModifiers = this.applyPropertyModifiers();
      return Object.assign({}, defaultStyle, elementStyle, propertyModifiers);
    }

    return defaultStyle;
  }

  render() {
    const hasGridChildren = elementHasGridChildren(this.props);
    return (
      <Consumer>
        {({ store, receiveStore }) => hasGridChildren ?
          (<div style={this.generateStyle(store)}>
            <Grid columns={Boolean(this.props.columns)} propogateStore={receiveStore}>
              {this.props.children}
            </Grid>
          </div>) : 
          (
            <div style={this.generateStyle(store)}>
              {this.props.children}
            </div>
          )
        }
      </Consumer>
    );
  }
};
