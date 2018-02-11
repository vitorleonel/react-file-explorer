import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Components
import History from './components/History';
import Node from './components/Node';

// Style
import './index.css';

class FileExplorer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
      nodes: [],
      selected: '',
    };

    // History Methods
    this.goToUpperLevel = this.goToUpperLevel.bind(this);

    // Node Methods
    this.handleSingleClick = this.handleSingleClick.bind(this);
    this.goToDeeperLevel = this.goToDeeperLevel.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }

  componentDidMount() {
    const history = [{
      id: '/',
      name: this.props.rootLabel,
      children: this.props.data,
    }];

    this.setState({
      history,
      nodes: this.props.data,
    });

    document.addEventListener('click', this.hideMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideMenu);
  }

  // History Methods
  goToUpperLevel(node) {
    const index = this.state.history.findIndex(level => level.id === node.id);
    const history = this.state.history.slice(0, (index + 1));

    this.setState({
      history,
      nodes: node.children,
      selected: '',
    });
  }

  // Node Methods
  handleSingleClick(key) {
    this.setState({
      selected: key,
    });
  }

  goToDeeperLevel(currentNode) {
    const history = this.state.history;
    history.push(currentNode);

    const nodes = currentNode.children;

    this.setState({
      history,
      nodes,
    });
  }

  handleRightClick() {
    this.setState({
      visibleMenu: true,
    });
  }

  hideMenu() {
    this.setState({
      visibleMenu: false,
    });
  }

  render() {
    const { showHistory } = this.props;

    const classes = classNames({
      'nodes-container': true,
      'no-history': !showHistory,
    });

    return (
      <div className='container'>
        {
          showHistory &&
          <History
            nodes={this.state.history}
            goToUpperLevel={this.goToUpperLevel} />
        }

        <div className={classes}>
          {
            this.state.nodes.map((node, index) => {
              const selected = node.id === this.state.selected;

              return (
                <Node key={node.id}
                  data={node}
                  onSingleClick={this.handleSingleClick}
                  goToDeeperLevel={this.goToDeeperLevel}
                  selected={selected}
                  handleRightClick={this.handleRightClick} />
              );
            })
          }
        </div>

        {
          this.state.visibleMenu &&
          <div className='menu'>test</div>
        }
      </div>
    );
  }
}

FileExplorer.propTypes = {
  data: PropTypes.array,
  showHistory: PropTypes.bool,
  rootLabel: PropTypes.string,
};

FileExplorer.defaultProps = {
  showHistory: true,
  rootLabel: 'Home',
};

export default FileExplorer;
