import { Text, View } from "react-native";

const SeatInfo = () => {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: 20, height: 20, backgroundColor: '#173d70', borderRadius: 5}} />
            <Text> Occupied  </Text>

            <View style={{width: 20, height: 20, backgroundColor: 'white', borderColor: '#173d70', borderRadius: 5, borderWidth: 3}} />
            <Text> Vacant  </Text>

            <View style={{width: 20, height: 20, borderRadius: 5, backgroundColor: '#7aaaff'}} />
            <Text> Away</Text>
        </View>
    );
}

export default SeatInfo;
