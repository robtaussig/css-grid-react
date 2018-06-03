const React = require('react');
const PropTypes = require('prop-types');
const { Consumer } = require('./GridContext.jsx');
const Grid = require('./Grid.jsx');
const {
  getElementInfoFromStore,
  getElementStyle,
  elementHasGridChildren
} = require('../helpers/');

class GridElement extends React.Component {
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
}

GridElement.propTypes = {
  gridKey: PropTypes.any.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node.isRequired,
  outlined: PropTypes.bool,
  centered: PropTypes.bool,
  columns: PropTypes.bool,
};

GridElement.defaultProps = {
  children: '',
  width: '1fr',
  height: '1fr',
  outlined: false,
  centered: true,
  columns: false,
};

module.exports = GridElement;