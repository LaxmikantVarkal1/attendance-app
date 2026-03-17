import {
  deleteAttendanceRecord,
  deleteSubjectFolder,
  type AttendanceRecord,
} from '@/services/attendance-file-service';
import { CalendarDays, Clock3, FolderClosed, Users2 } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Collapsible } from './ui/collapsible';

type FolderRowProps = {
  subjectName: string;
  items: AttendanceRecord[];
  onDeleted?: () => void | Promise<void>;
};

export default function FolderRow({ subjectName, items, onDeleted }: FolderRowProps) {
  const theme = useColorScheme() ?? 'light';

  const confirmDeleteSubject = () => {
    Alert.alert('Delete subject', `Delete ${subjectName} folder and all entries?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            deleteSubjectFolder(subjectName);
            await onDeleted?.();//load the all subject after action performed.
          } catch {
            Alert.alert('Delete failed', 'Unable to delete the subject folder.');
          }
        },
      },
    ]);
  };

  const confirmDeleteEntry = (item: AttendanceRecord) => {
    Alert.alert('Delete entry', `Delete attendance for ${item.date} ${item.time}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAttendanceRecord({
              subjectName,
              dateTime: item.dateTime,
            });
            await onDeleted?.(); //load the all subject after action performed.
          } catch {
            Alert.alert('Delete failed', 'Unable to delete the attendance entry.');
          }
        },
      },
    ]);
  };

  return (
    <ThemedView style={[styles.wrapper, { backgroundColor: Colors[theme].background }]}>
      <Collapsible
        title={subjectName}
        icon={<FolderClosed size={16} color={Colors[theme].icon} />}
        onLongPress={confirmDeleteSubject}>
        {items.map((item) => (
          <Pressable
            key={`${subjectName}-${item.dateTime}`}
            onLongPress={() => confirmDeleteEntry(item)}
            style={[styles.row, { backgroundColor: Colors[theme].background, borderColor: Colors[theme].lightBG }]}>
            <View style={styles.rowLeft}>
              <CalendarDays size={15} color={Colors[theme].activeIcon} />
              <ThemedText type="captions">{item.date}</ThemedText>
              <Clock3 size={12} color={Colors[theme].icon} />
              <ThemedText type="captions">{item.time}</ThemedText>
            </View>

            <View style={styles.rowRight}>
              <Users2 size={12} color={Colors[theme].icon} />
              <ThemedText type="captions">{item.attendanceCount}</ThemedText>
            </View>
          </Pressable>
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
  row: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    marginTop: 10,
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
  },
});
