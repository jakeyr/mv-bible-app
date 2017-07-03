import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TextInput,
    Image,
    StatusBar,
    Button,
    Platform,
    Dimensions,
    TouchableHighlight,
    AsyncStorage,
    Alert

} from 'react-native';
import { InstantSearch } from 'react-instantsearch/native';
import {
    connectSearchBox,
    connectInfiniteHits,
    connectRefinementList,
    connectStats,
    connectSortBy,
    connectRange,
    connectCurrentRefinements,
} from 'react-instantsearch/connectors';
import globalVariables from '../globals.js'
import Highlight from './components/Highlight';
import Spinner from './components/Spinner';
import IosIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Actions, ActionConst } from 'react-native-router-flux';
import AwesomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    maincontainer: {
        ...Platform.select({
            ios: {
                marginTop: 63,
            },
            android: { marginTop: 50 },
        }),
        flex: 1,
    },
    items: {
        ...Platform.select({
            ios: {
                height: height - 170,
            },
            android: { height: height - 185 },
        }),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    options: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 5,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    sortBy: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 8,
    },
    sortByArrow: {
        paddingLeft: 3,
    },
    searchBoxContainer: {
        backgroundColor: globalVariables.muttvilleGold,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBox: {
        backgroundColor: 'white',
        height: 40,
        borderWidth: 1,
        padding: 10,
        margin: 10,
        flexGrow: 1,
        ...Platform.select({
            ios: {
                borderRadius: 5,
            },
            android: {},
        }),
    },
    itemContent: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        justifyContent: 'flex-start',
    },
    itemNameContainer : {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
    },
    itemName: {
        fontSize: 22,
        fontWeight: '800',
        color: globalVariables.textColor,
    },
    itemArn: {
        fontSize: 18,
        fontWeight: '200',
        color: globalVariables.textColor,
    },
    itemType: {
        // fontSize: 13,
        // fontWeight: '200',
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        marginTop: 5,
        width: width - 120,
        flexWrap: 'wrap',
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingTop: 5,
        paddingBottom: 5,
        color: globalVariables.textColor,
    },
    itemInfo: {
        fontSize: 10,
        paddingLeft: 2,
        fontWeight: '200',
        color: globalVariables.textColorLight,
    },
    itemAttributes: {
        flexDirection: 'row',
        alignItems : 'center',
        paddingRight: 10,
        paddingBottom: 5,
    },
    starRating: { alignSelf: 'flex-start' },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

class Home extends Component {
    static displayName = 'React Native example';

    constructor(props) {
        super(props);
        this.onSearchStateChange = this.onSearchStateChange.bind(this);
        this.state = {
            searchState: this.props.searchState ? this.props.searchState : {},
        };
    }

    componentWillReceiveProps() {}

    onSearchStateChange(nextState) {
        this.setState({ searchState: { ...this.state.searchState, ...nextState } });
    }

    render() {
        return (
            <View style={styles.maincontainer}>
                <InstantSearch
                    appId="R80XXCZCBX"
                    apiKey={this.props.searchKey}
                    indexName="active-mutts"
                    searchState={this.state.searchState}
                    onSearchStateChange={this.onSearchStateChange}
                >
                    <StatusBar backgroundColor={globalVariables.muttvilleGold} barStyle="light-content" />
                    <ConnectedSearchBox />
                    <View style={styles.options}>
                        <ConnectedStats />
                        <ConnectedSortBy
                            items={[
                                { value: 'active-mutts', label: 'Featured' },
                                { value: 'active-mutts-age-desc', label: 'Age desc' },
                                { value: 'active-mutts-age-asc', label: 'Age asc' },
                            ]}
                            defaultRefinement={'active-mutts'}
                        />
                        <Filters
                            searchKey={this.props.searchKey}
                            searchState={this.state.searchState}
                            onSearchStateChange={this.onSearchStateChange}
                        />
                        </View>
                    <ConnectedHits searchKey={this.props.searchKey} />
                    <VirtualRefinementList attributeName="breed" />
                    <VirtualRange attributeName="age" />
                    <VirtualRefinementList attributeName="size" />
                    <VirtualRange attributeName="weight" />
                </InstantSearch>
            </View>
        );
    }
}

Home.propTypes = {
    searchState: PropTypes.object,
};

export default Home;

class SearchBox extends Component {
    render() {
        return (
            <View style={styles.searchBoxContainer}>
                <Spinner left={60} />
                <TextInput
                    style={styles.searchBox}
                    onChangeText={text => this.props.refine(text)}
                    value={this.props.currentRefinement}
                    placeholder={'Search a mutt...'}
                    clearButtonMode={'always'}
                    underlineColorAndroid={'white'}
                    spellCheck={false}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                />
            </View>
        );
    }
}

SearchBox.propTypes = {
    refine: PropTypes.func.isRequired,
    currentRefinement: PropTypes.string,
};

const ConnectedSearchBox = connectSearchBox(SearchBox);

class Hits extends Component {
    construct(props) {
        this._renderRow = this.bind._renderRow(this);
    }

    onEndReached() {
        if (this.props.hasMore) {
            this.props.refine();
        }
    }

    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        const hits = this.props.hits.length > 0
            ? <View style={styles.items}>
                <ListView
                    dataSource={ds.cloneWithRows(this.props.hits)}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    onEndReached={this.onEndReached.bind(this)}
                />
            </View>
            : null;
        return hits;
    }

    _renderRow = (hit, sectionId, rowId) =>
        <TouchableHighlight
            onPress={() => {
                Actions.Result({
                    searchState: this.props.searchState,
                    onSearchStateChange: this.props.onSearchStateChange,
                    hit: hit,
                    searchKey: this.props.searchKey,
                });
            }}
        >
            <View style={styles.item} key={rowId}>
                <Image style={{ height: 120, width: 100 }} source={{ uri: hit.images ? hit.images[0] : globalVariables.placeHolderImage }} />
                <View style={styles.itemContent}>
                    <View style={styles.itemNameContainer}>
                        <Text style={styles.itemName}>
                            <Highlight
                                attributeName="name"
                                hit={hit}
                                highlightProperty="_highlightResult"
                            />
                        </Text>
                        <Text style={styles.itemArn}>
                            &nbsp;(<Highlight
                            attributeName="arn"
                            hit={hit}
                            highlightProperty="_highlightResult"
                        />)
                        </Text>
                    </View>
                    <View
                        style={{
                            borderBottomColor: '#f1f1f1',
                            borderBottomWidth: 1,
                            // marginLeft: 20,
                            marginRight: 20,
                        }}
                    />
                    <View style={styles.itemType}>
                        {[
                            ["size", "", "paw"],
                            ["age", "years", "clock"],
                            ["weight", "lbs", "scale-bathroom"],
                        ].map((tuple) => {
                            return hit[tuple[0]]
                                ? <View style={styles.itemAttributes} key={tuple[0]}>
                                    <AwesomeIcon name={tuple[2]} size={15} color={globalVariables.textColorLight} />
                                    <Text style={styles.itemInfo}>{hit[tuple[0]]} {tuple[1]}</Text>
                                  </View>
                                : <Text key={tuple[0]}/>
                        })}
                        <View style={styles.itemAttributes}>
                            <AwesomeIcon name={"gender-" + hit.gender.toLowerCase()} size={15} color={globalVariables.textColorLight} />
                            <Text style={styles.itemInfo}>{hit.gender}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderBottomColor: '#f1f1f1',
                            borderBottomWidth: 1,
                            // marginLeft: 20,
                            marginRight: 20,
                        }}
                    />
                    <Text style={styles.itemPrice}>
                        {hit.breed}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>

    _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) =>
        <View
            key={`${sectionID}-${rowID}`}
            style={{
                height: adjacentRowHighlighted ? 4 : 1,
                backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
            }}
        />;
}

Hits.propTypes = {
    hits: PropTypes.array.isRequired,
    refine: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
};

const ConnectedHits = connectInfiniteHits(Hits);
const ConnectedStats = connectStats(({ nbHits }) =>
    <Text style={{ paddingLeft: 8 }}>{nbHits} mutts found</Text>
);

const ConnectedSortBy = connectSortBy(
    ({ refine, items, currentRefinement }) => {
        const icon = Platform.OS === 'ios'
            ? <IosIcon
                size={13}
                name="ios-arrow-down"
                color="#000"
                style={styles.sortByArrow}
            />
            : <MaterialIcon
                size={20}
                name="arrow-drop-down"
                color="#000"
                style={styles.sortByArrow}
            />;
        return (
            <View style={styles.sortBy}>
                <ModalDropdown
                    animated={false}
                    defaultValue={
                        items.find(item => item.value === currentRefinement).label
                    }
                    onSelect={(index, value) =>
                        refine(items.find(item => item.label === value).value)}
                    options={items.map(item => item.label)}
                    renderRow={item => {
                        const itemValue = items.find(i => i.label === item).value;
                        return (
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: itemValue === currentRefinement ? 'bold' : '200',
                                    padding: 10,
                                }}
                            >
                                {item}
                            </Text>
                        );
                    }}
                    dropdownStyle={{
                        width: 200,
                        height: 110,
                    }}
                    textStyle={{ fontSize: 15 }}
                />
                {icon}
            </View>
        );
    }
);

const Filters = connectCurrentRefinements(
    ({ items, searchState, onSearchStateChange, searchKey }) =>
        <Button
            onPress={() =>
                Actions.Filters({
                    searchState,
                    searchKey,
                    onSearchStateChange,
                })}
            title={`Filters (${items.length})`}
            color="#162331"
        />
);
const VirtualRange = connectRange(() => null);
const VirtualRefinementList = connectRefinementList(() => null);