import { Text } from "react-native"

const Address = ({ address }: { address: string }) => {
    return (
        <Text
            style={{ color: 'blue', height: 40 }}
        >
            {address}
        </Text>
    )
}

export default Address