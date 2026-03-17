import { CalendarDays, Clock3, FolderClosed, Users2 } from 'lucide-react-native';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { AttendanceRecord } from '@/services/attendance-file-service';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Collapsible } from './ui/collapsible';

type FolderRowProps = {
  subjectName: string;
  items: AttendanceRecord[];
};

export default function FolderRow({ subjectName, items }: FolderRowProps) {
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView style={[styles.wrapper, { backgroundColor: Colors[theme].background }]}>
      <Collapsible
        title={subjectName}
        icon={<FolderClosed size={16} color={Colors[theme].icon} />}>
        {/* <View style={styles.metaRow}>
          <ThemedText type="captions">Entries: {items.length}</ThemedText>
          <ThemedText type="captions">Attendance: {items.length}</ThemedText>
        </View> */}

        {items.map((item) => (
          <View key={`${subjectName}-${item.dateTime}`} style={[styles.row,{ backgroundColor:Colors[theme].background, borderColor:Colors[theme].lightBG}]}>
            <View style={styles.rowLeft}>
              <CalendarDays size={15} color={Colors[theme].activeIcon} />
              <ThemedText type='captions'>{item.date}</ThemedText>
              <Clock3 size={12} color={Colors[theme].icon} />
              <ThemedText type='captions'>{item.time}</ThemedText>
            </View>

            <View style={styles.rowRight}>
              <Users2 size={12} color={Colors[theme].icon} />
              <ThemedText type='captions'>{item.attendanceCount}</ThemedText>
            </View>
          </View>
        ))}
      </Collapsible>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 0,
    marginBottom: 10,
  },
  metaRow: {
    width:'100%',
    marginBottom: 10,
    marginTop:5,
    flexDirection:"row",
    justifyContent:'space-between',
  },
  row: {
    paddingVertical: 15,
    paddingHorizontal:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:"red",
    borderWidth:.5,
    marginTop:10
  },
  rowLeft: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  }
});
