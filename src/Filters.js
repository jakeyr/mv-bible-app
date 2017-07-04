import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Platform,
} from 'react-native';
import { InstantSearch } from 'react-instantsearch/native';
import {
  connectCurrentRefinements,
  connectRange,
  connectRefinementList,
  connectSearchBox,
} from 'react-instantsearch/connectors';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    flexGrow: 1,
    ...Platform.select({
      ios: {
        marginTop: 30,
      },
      android: { marginTop: 25 },
    }),
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  clearAll: {
    color: 'blue',
    fontWeight: 'bold',
    padding: 10,
    alignSelf: 'center',
  },
});

class Filters extends Component {
  static displayName = 'Filters page';
  constructor(props) {
    super(props);
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
    this.state = {
      searchState: this.props.searchState,
    };
  }
  onSearchStateChange(nextState) {
    const searchState = { ...this.state.searchState, ...nextState };
    this.setState({ searchState });
    this.props.onSearchStateChange(searchState);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <InstantSearch
          appId="R80XXCZCBX"
          apiKey={this.props.searchKey}
          indexName="active-mutts"
          onSearchStateChange={this.onSearchStateChange}
          searchState={this.state.searchState}
        >
          <ConnectedRefinements
              searchKey={this.props.searchKey}
              searchState={this.state.searchState}
              onSearchStateChange={this.onSearchStateChange}
          />
          <VirtualRefinementList attributeName="breed" />
          <VirtualRefinementList attributeName="size" />
          <VirtualRange attributeName="weight" />
          <VirtualRange attributeName="age" />
          <VirtualSearchBox />
        </InstantSearch>
      </View>
    );
  }
}

Filters.propTypes = {
  searchState: PropTypes.object,
  onSearchStateChange: PropTypes.func.isRequired,
  searchKey: PropTypes.string.isRequired
};

class Refinements extends React.Component {
  constructor(props) {
    super(props);
    this._renderRow = this._renderRow.bind(this);
    this.mapping = {
      Size: {
        attributeName: 'size',
          value: item => {
              const values = item.items.map(i => i.label).join(' - ');
              return values;
          },
      },
      Breed: {
        attributeName: 'breed',
        value: item => {
          const values = item.items.map(i => i.label).join(' - ');
          return values;
        },
      },
      Weight: {
        attributeName: 'weight',
        value: item =>
          `From ${item.currentRefinement.min} lbs to ${item.currentRefinement.max} lbs`,
      },
      Age: {
        attributeName: 'age',
        value: item =>
          `From ${item.currentRefinement.min} years to ${item.currentRefinement.max} years`,
      },
      ClearAll: {
        attributeName: 'clearAll',
      },
    };
  }

  _renderRow = refinement => {
    const item = this.props.items.find(
      i => i.attributeName === this.mapping[refinement].attributeName
    );
    // const refinementValue = (this.props.length > 0) ? this.props.items[0].attributeName : 'newp';
    const refinementValue = item ? this.mapping[refinement].value(item) : '-';
    const filtersRow = refinement !== 'ClearAll'
      ? <TouchableHighlight
          onPress={() => {
            Actions[refinement]({
              searchKey: this.props.searchKey,
              searchState: this.props.searchState,
              onSearchStateChange: this.props.onSearchStateChange,
            });
          }}
        >
          <View style={styles.filtersRow}>
            <View style={{ flex: 4 }}>
              <Text style={{ fontWeight: 'bold' }}>
                {refinement}
              </Text>
              <Text style={{ paddingTop: 5 }}>
                {refinementValue}
              </Text>
            </View>
            <View>
              <Icon name="pencil" size={20} />
            </View>
          </View>
        </TouchableHighlight>
      : <TouchableHighlight onPress={() => this.props.refine(this.props.items)}>
          <View>
            <Text style={styles.clearAll}>
              CLEAR ALL
            </Text>
          </View>
        </TouchableHighlight>;
    return <View>{filtersRow}</View>;
  };

  _renderSeparator = (sectionID, rowId, adjacentRowHighlighted) =>
    <View
      key={`${sectionID}-${rowId}`}
      style={{
        height: adjacentRowHighlighted ? 4 : 1,
        backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
      }}
    />;
  render() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    return (
      <View>
        <ListView
          dataSource={ds.cloneWithRows([
            'Size',
            'Breed',
            'Weight',
            'Age',
            'ClearAll',
          ])}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          keyboardShouldPersistTaps={'always'}
          style={styles.mainContainer}
        />
      </View>
    );
  }
}

Refinements.propTypes = {
  searchState: PropTypes.object.isRequired,
  refine: PropTypes.func.isRequired,
  onSearchStateChange: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

const ConnectedRefinements = connectCurrentRefinements(Refinements);
const VirtualRefinementList = connectRefinementList(() => null);
const VirtualSearchBox = connectSearchBox(() => null);
const VirtualRange = connectRange(() => null);

export default Filters;
