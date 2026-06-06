import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  const color = focused ? COLORS.tabActive : COLORS.tabInactive;
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.emoji, { opacity: focused ? 1 : 0.5 }]}>{icon}</Text>
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
          tabBarIcon: ({ focused }) => <TabIcon icon="⊞" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="active"
        options={{
          title: 'Active',
          tabBarIcon: ({ focused }) => <TabIcon icon="○" label="Active" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabIcon icon="◷" label="History" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', gap: 3 },
  emoji:    { fontSize: 20 },
  label:    { fontSize: FONTS.tiny, fontWeight: '600' },
});
