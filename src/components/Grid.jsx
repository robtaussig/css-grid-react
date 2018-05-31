const React = require('react');
const { Provider } = require('./GridContext.jsx');
const {
  ensureTypeArray,
  getInformationFromChildren,
  getRowTemplateFromChildren,
  getColumnTemplateFromChildren,
  deepMergeObject
} = require('../helpers/');

let storeCache = {};

module.exports = class Grid extends React.Component {
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

    return this.props.columns ? `${columns} / ${rows}` : `${rows} / ${columns}`;
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
};