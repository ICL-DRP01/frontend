import { Text, View } from "react-native";
import { PRIMARY_COLOUR, SECONDARY_COLOUR } from './Constants.ts';

const SeatInfo = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 20, height: 20, backgroundColor: PRIMARY_COLOUR, borderRadius: 5 }} />
            <Text> Occupied  </Text>

            <View style={{ width: 20, height: 20, backgroundColor: 'white', borderColor: PRIMARY_COLOUR, borderRadius: 5, borderWidth: 3 }} />
            <Text> Vacant  </Text>

            <View style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: SECONDARY_COLOUR }} />
            <Text> Away</Text>
        </View>
    );
}

export default SeatInfo;
