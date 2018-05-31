const React = require('react');
const { Consumer } = require('./GridContext.jsx');
const Grid = require('./Grid.jsx');
const {
  getElementInfoFromStore,
  getElementStyle,
  elementHasGridChildren
} = require('../helpers/');

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
    if (this.props.outlined) {
      styles.border = '1px solid black';
      styles.margin = '-1px';
    }
    return styles;
  }

  generateStyle(store) {
    const elementInfo = getElementInfoFromStore(store, this.props);
    if (elementInfo) {
      const elementStyle = getElementStyle(elementInfo);
      const propertyModifiers = this.applyPropertyModifiers();
      return Object.assign({}, elementStyle, propertyModifiers);
    }

    return {};
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
