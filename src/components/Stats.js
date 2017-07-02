import React from 'react';
import { Text, View, Platform, Dimensions } from 'react-native';
import { connectStats } from 'react-instantsearch/connectors';
import { Actions } from 'react-native-router-flux';
import Spinner from './Spinner';

const { height, width } = Dimensions.get('window');
const styles = {
  stats: {
    position: 'absolute',
      alignItems: 'center',
      flex:1,
    height: 100,
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
export default connectStats(({ nbHits, searchState, onSearchStateChange }) =>
  <View style={styles.stats}>
      <Text>{nbHits} mutts found</Text>
      <Spinner
          left={Platform.OS === 'ios' ? 100 : 210}
          bottom={Platform.OS === 'ios' ? 597 : 530}
      />
  </View>
);
