import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TextInput,
    Platform,
    TouchableHighlight,
} from 'react-native';
import { InstantSearch } from 'react-instantsearch/native';
import {
    connectRefinementList,
    connectSearchBox,
    connectRange,
} from 'react-instantsearch/connectors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Stats from './components/Stats';
import Highlight from './components/Highlight';

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        flex: 1,
        ...Platform.select({
            ios: {
                marginTop: 63,
            },
            android: { marginTop: 50 },
        }),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        minHeight: 41,
        padding: 11,
    },
    itemRefined: {
        fontWeight: 'bold',
    },
    searchBoxContainer: {
        backgroundColor: '#162331',
    },
    searchBox: {
        backgroundColor: 'white',
        height: 40,
        borderWidth: 1,
        padding: 10,
        margin: 10,
        ...Platform.select({
            ios: {
                borderRadius: 5,
            },
            android: {},
        }),
    },
});

class Filters extends Component {
    static displayName = 'React Native example';
    constructor(props) {
        super(props);
        this.onSearchStateChange = this.onSearchStateChange.bind(this);
        this.state = {
            searchState: props.searchState,
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
                    <ConnectedRefinementList attributeName="size" />
                    <Stats
                        searchState={this.state.searchState}
                        onSearchStateChange={this.props.onSearchStateChange}
                        searchKey={this.props.searchKey}
                    />
                    <VirtualRefinementList attributeName="breed" />
                    <VirtualRange attributeName="weight" />
                    <VirtualRange attributeName="age" />
                </InstantSearch>
            </View>
        );
    }
}

Filters.propTypes = {
    searchState: PropTypes.object,
    onSearchStateChange: PropTypes.func.isRequired,
    searchKey: PropTypes.string,
};

export default Filters;

class RefinementList extends Component {
    constructor(props) {
        super(props);
        this.saveQuery = this.saveQuery.bind(this);
        this.state = {
            query: '',
        };
    }
    saveQuery(text) {
        this.setState({ query: text });
    }
    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        const { items } = this.props;
        const facets = items.length > 0
            ? <ListView
                enableEmptySections={true}
                dataSource={ds.cloneWithRows(items)}
                renderRow={this._renderRow}
                renderSeparator={this._renderSeparator}
                keyboardShouldPersistTaps={'always'}
            />
            : null;
        return (
            <View style={styles.searchBoxContainer}>
                {facets}
            </View>
        );
    }

    _renderRow = (refinement, sectionId, rowId) => {
        const icon = refinement.isRefined
            ? <Icon name="check-square-o" color="#e29b0b" />
            : <Icon name="square-o" color="#000" />;
        return (
            <TouchableHighlight
                onPress={() => {
                    this.saveQuery('');
                    this.props.refine(refinement.value);
                }}
                key={rowId}
            >
                <View style={styles.item}>
                    <Text style={refinement.isRefined ? styles.itemRefined : {}}>
                        {refinement.label}
                    </Text>
                    {icon}
                </View>
            </TouchableHighlight>
        );
    };

    _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) =>
        <View
            key={`${sectionID}-${rowID}`}
            style={{
                height: adjacentRowHighlighted ? 4 : 1,
                backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
            }}
        />;
}

RefinementList.propTypes = {
    query: PropTypes.string,
    saveQuery: PropTypes.func,
    searchForItems: PropTypes.func,
    refine: PropTypes.func,
    items: PropTypes.array,
    isFromSearch: PropTypes.bool,
};

const ConnectedRefinementList = connectRefinementList(RefinementList);
const VirtualSearchBox = connectSearchBox(() => null);
const VirtualRange = connectRange(() => null);
const VirtualRefinementList = connectRefinementList(() => null);
