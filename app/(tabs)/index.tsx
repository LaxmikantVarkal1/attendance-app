import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import FolderRow from '@/components/folder-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import {
  SubjectAttendance,
  loadAllSubjectsAttendance,
} from '@/services/attendance-file-service';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const theme = useColorScheme() ?? "dark"

  const loadSubjects = useCallback(async () => {
    const data = await loadAllSubjectsAttendance();
    setSubjects(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSubjects();
    }, [loadSubjects])
  );

  return (
    <SafeAreaView>
      <ThemedView style={[styles.listContainer,{backgroundColor:Colors[theme].background}]}>
        {subjects.length === 0 ? (
          <ThemedText type="subtitle">No subject folders found yet.</ThemedText>
        ) : (
          subjects.map((subject) => (
            <FolderRow
              key={subject.folderName}
              subjectName={subject.subjectName}
              items={subject.records}
              onDeleted={loadSubjects}
            />
          ))
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    padding:15
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
