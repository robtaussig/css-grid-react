const React = require('react');
const { Provider } = require('./GridContext.jsx');
const {
  ensureTypeArray,
  getInformationFromChildren,
  getRowTemplateFromChildren,
  getColumnTemplateFromChildren
} = require('../helpers/');

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
      gridTemplate: gridTemplate,
      height: '100%',
      width: '100%',
    };
  }

  generateGridStore() {    
    const children = ensureTypeArray(this.props.children);
    const nextGridStore = getInformationFromChildren(children, this.props.columns);

    this.setState({
      store: nextGridStore
    });
  }

  getGridTemplateFromChildren() {
    const children = ensureTypeArray(this.props.children);
    const rows = getRowTemplateFromChildren(children);
    const columns = getColumnTemplateFromChildren(children);

    return this.props.columns ? `${columns} / ${rows}` : `${rows} / ${columns}`;
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