import { Pressable, Text } from 'react-native';
import { useTheme } from '../hooks/themeContext.js';

export default function Button({ title, handlePress, disabled, size = 28 }) {
    const { colors, font } = useTheme();
    return (
        <Pressable
            disabled={disabled}
            onPress={handlePress}
            style={({ pressed }) => ({
                backgroundColor: pressed ? colors.secondary : colors.teritiary,
                padding: 8,
                paddingHorizontal: 20,
                marginBottom: 100,
                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 14,
                },
                shadowOpacity: 0.8,
                shadowRadius: 15.38,
                elevation: 19,
                borderColor: pressed ? colors.teritiary : colors.secondary,
                borderBottomWidth: 5,
                borderLeftWidth: 8,
            })}
        >
            <Text style={{
                fontFamily: font.primary, color: colors.primary, fontSize: size,
            }}>{title}</Text>
        </Pressable>
    )
}