const React = require('react');
const { Provider } = require('./GridContext.jsx');
const PropTypes = require('prop-types');
const {
  ensureTypeArray,
  getInformationFromChildren,
  getRowTemplateFromChildren,
  getColumnTemplateFromChildren,
  deepMergeObject
} = require('../helpers/');

let storeCache = {};

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      store: {
        
      }
    };
    
    this.generateStyle = this.generateStyle.bind(this);
    this.handleReceiveStore = this.handleReceiveStore.bind(this);
    this.handleStorePropogation = this.handleStorePropogation.bind(this);
  }

  componentDidMount() {    
    if (this.props.propogateStore) {
      const nextGridStore = this.generateGridStore(true);
      this.handleStorePropogation(nextGridStore);
    } else {
      this.generateGridStore();
    }
  }

  generateStyle() {
    const gridTemplate = this.getGridTemplateFromChildren();
    return {
      display: 'grid',
      gridTemplate: gridTemplate,
      height: '100%',
      width: '100%',
      gap: this.props.gap,
      gridAutoFlow: this.props.columns ? 'column' : 'row',
    };
  }

  handleReceiveStore(nextGridStore) {
    storeCache = deepMergeObject(storeCache, nextGridStore);
    this.setState({
      store: storeCache
    });
  }

  handleStorePropogation(nextGridStore) {    
    this.props.propogateStore(nextGridStore);
  }

  generateGridStore(simulateOnly = false) {    
    const children = ensureTypeArray(this.props.children);
    const nextGridStore = getInformationFromChildren(children, this.props.columns);
    
    if (simulateOnly) return nextGridStore;

    storeCache = deepMergeObject(storeCache, nextGridStore);
    this.setState({
      store: storeCache
    });
  }

  getGridTemplateFromChildren() {
    const children = ensureTypeArray(this.props.children);
    const rows = getRowTemplateFromChildren(children);
    const columns = getColumnTemplateFromChildren(children);

    return `${rows} / ${columns}`;
  }

  render() {
    if (this.props.propogateStore) {
      return (
        <div style={this.generateStyle()}>
          {this.props.children}
        </div>
      );
    }
    return (
      <Provider value={{
        store: this.state.store,
        receiveStore: this.handleReceiveStore
      }}>
        <div style={this.generateStyle()}>
          {this.props.children}
        </div>
      </Provider>      
    );
  }
}

Grid.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
  columns: PropTypes.bool,
  rows: PropTypes.bool,
  gap: PropTypes.string,  
};

Grid.defaultProps = {
  rows: true,
  columns: false,
};

module.exports = Grid;