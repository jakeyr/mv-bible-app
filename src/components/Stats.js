import React from 'react';
import { Button, View, Platform, Dimensions } from 'react-native';
import { connectStats } from 'react-instantsearch/connectors';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from './Spinner';
import globalVariables from '../../globals'

const { height, width } = Dimensions.get('window');
const styles = {
    stats: {
        position: 'absolute',
        height: 100,
        left: 0,
        ...Platform.select({
            ios: {
                top: height - 100,
            },
            android: {
                top: height - 120,
                paddingLeft: 10,
                paddingRight: 10,
            },
        }),
        width,
    },
};
export default connectStats(({ nbHits, searchKey, searchState, onSearchStateChange }) =>
    <View style={styles.stats}>
      <Button
          title={`See ${nbHits} mutts`}
          onPress={() => {
              console.info(searchState);
              Actions.Home({type: ActionConst.RESET, searchKey: searchKey})
          }}
          color={globalVariables.textColor}
      />
      <Spinner
          left={Platform.OS === 'ios' ? 100 : 210}
          bottom={Platform.OS === 'ios' ? 597 : 530}
      />
    </View>
);