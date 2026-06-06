import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

function TabIcon({
  name,
  label,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  focused: boolean;
}) {
  const color = focused ? COLORS.tabActive : COLORS.tabInactive;
  return (
    <View style={styles.iconWrap}>
      <Ionicons name={name} size={22} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor:  '#222222',
          borderTopWidth:  1,
          height:          80,
          paddingBottom:   16,
          paddingTop:      10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} label="Home" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="active"
        options={{
          title: 'Active',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'navigate' : 'navigate-outline'} label="Active" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'time' : 'time-outline'} label="History" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', gap: 3 },
  label:    { fontSize: FONTS.tiny, fontWeight: '600' },
});