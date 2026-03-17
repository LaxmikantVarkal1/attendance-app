import GridItem from '@/components/gridItem';
import IconButton from '@/components/icon-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import {
  attendanceRecordExists,
  loadAllSubjectsAttendance,
  saveAttendanceForSubject,
  type SubjectAttendance,
} from '@/services/attendance-file-service';
import { useFormData, useGetStatus } from '@/store/globleState';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { ArrowLeft, Book, Check, ChevronDown, Settings2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View
} from 'react-native';

export default function TabTwoScreen() {
  const theme = useColorScheme() ?? "light";
  const { list } = useFormData((state) => (state.listData));
  const updateList = useFormData((state) => (state.updateList));
  const updateForm = useFormData((state) => (state.updateForm));
  const {subjectName, date, time} = useFormData((state)=>(state.formData));
  const { present, total, att } = useGetStatus();
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const [isSubjectDrawerOpen, setIsSubjectDrawerOpen] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');

  const displayDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Select date';

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSubjects = async () => {
        const nextSubjects = await loadAllSubjectsAttendance();
        if (isActive) {
          setSubjects(nextSubjects);
        }
      };

      loadSubjects();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const selectSubject = (nextSubjectName: string) => {
    updateForm('subjectName', nextSubjectName.trim());
    setCustomSubjectName(nextSubjectName.trim());
    setIsSubjectDrawerOpen(false);
  };

  const saveCustomSubject = () => {
    const nextSubjectName = customSubjectName.trim();

    if (!nextSubjectName) {
      Alert.alert('Missing subject', 'Enter a subject name or choose one from the list.');
      return;
    }

    selectSubject(nextSubjectName);
  };

  const handleSave = async () => {
    const trimmedSubjectName = String(subjectName ?? '').trim();

    if (!trimmedSubjectName) {
      Alert.alert('Missing subject', 'Choose an existing subject or enter a new one.');
      return;
    }

    if (!total || Number(total) <= 0) {
      Alert.alert('No attendance range', 'Please configure a valid range in CONFIG.');
      return;
    }

    if (!date || !time) {
      Alert.alert('Missing date/time', 'Please configure both date and time before saving.');
      return;
    }

    try {
      const alreadyExists = await attendanceRecordExists({
        subjectName: trimmedSubjectName,
        date: String(date),
        time: String(time),
      });

      if (alreadyExists) {
        Alert.alert(
          'Duplicate timestamp',
          `Attendance for ${trimmedSubjectName} at ${date} ${time} already exists.`
        );
        return;
      }

      await saveAttendanceForSubject({
        subjectName: trimmedSubjectName,
        date: String(date),
        time: String(time),
        present: Number(present),
        total: Number(total),
      });

      Alert.alert('Saved', 'Attendance file created/updated successfully.');
      router.navigate('/');
    } catch {
      Alert.alert('Save failed', 'Unable to write attendance files.');
    }
  };


  return (
    <>
      <ThemedView style={{ flex: 1, paddingTop: 35, backgroundColor: Colors[theme].background }}>
        {/* header */}
        <ThemedView style={{ height: 100, width:"100%" }}>
          <ThemedView style={styles.header}>
             <IconButton isLabel={false} onPress={() => {
              router.back()
            }} >

              <ArrowLeft size={20} color={Colors[theme].icon} />
            </IconButton>
            <View style={{ flexDirection: "row", gap: 5,justifyContent:"center",alignItems:'center' }}>

              <IconButton
                style={{flex:'unset',marginLeft:'auto', gap:5}}
                isLabel={true}
                onPress={() => {
                  setCustomSubjectName(String(subjectName ?? ''));
                  setIsSubjectDrawerOpen(true);
                }}>
              <Book size={15} color={Colors[theme].icon} />
              <ThemedText style={{maxWidth:250,textAlign:"right"}}>
                {subjectName || 'Select subject'}
              </ThemedText>
              <ChevronDown size={15} color={Colors[theme].icon} />
              </IconButton>
              {/* <View style={styles.saparator}/> */}

              {/* <IconButton style={{flex:"unset", gap:5}} isLabel={true}>
              <Calendar size={15} color={Colors[theme].icon} />
              <ThemedText style={{maxWidth:250,textAlign:"right"}}>{displayDate}</ThemedText>
              </IconButton> */}
              {/* <View style={styles.saparator}/>
              <IconButton style={{flex:"unset", gap:5}} isLabel={true}>
              <Clock size={15} color={Colors[theme].icon} />
              <ThemedText style={{maxWidth:250,textAlign:"right"}}>{time || 'Select time'}</ThemedText>
              </IconButton> */}
            </View>
           
            {/* <IconButton onPress={() => {
              router.navigate('/modal');
            }} >

              <Settings2 size={20} color={Colors[theme].icon} />
            </IconButton> */}
          </ThemedView>

          <ThemedView style={styles.statusContainer}>
            <ThemedView style={styles.row}>
              <ThemedText type='captions'>Present</ThemedText>
              <ThemedText type='active'>{present}/{total}</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.row, { marginLeft: "auto" }]}>
              <ThemedText type='captions'>Attendance </ThemedText>
              <ThemedText type='active'>{att} %</ThemedText>
            </ThemedView>
          </ThemedView>

        </ThemedView>
        {/* body */}
        <ScrollView contentContainerStyle={{padding:5}} style={{ flex: 1, backgroundColor:Colors[theme].original }}>
          <ThemedView style={[styles.boxes]}>
            {
              (list || []).map((id: any) => (
                <GridItem key={id} id={id} theme={theme} updateList={updateList} />
              ))
            }
          </ThemedView>
        </ScrollView>
        <ThemedView style={styles.footer}>
          <IconButton onPress={handleSave}><Check size={25} color={Colors[theme].icon}/><ThemedText>SAVE</ThemedText></IconButton>
          <IconButton onPress={()=>{
            router.navigate({pathname:'/modal',params:{showScreen:"form"}});
          }}><Settings2 size={25} color={Colors[theme].icon}/><ThemedText>CONFIG</ThemedText></IconButton>
        </ThemedView>
      </ThemedView>

      <Modal
        visible={isSubjectDrawerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSubjectDrawerOpen(false)}>
        <Pressable style={styles.drawerBackdrop} onPress={() => setIsSubjectDrawerOpen(false)}>
          <Pressable
            style={[styles.drawerSheet, { backgroundColor: Colors[theme].background }]}
            onPress={(event) => event.stopPropagation()}>
            <ThemedText type="subtitle">Select Subject</ThemedText>
            <ThemedText type="captions">Choose existing or type a new subject name.</ThemedText>

            <TextInput
              value={customSubjectName}
              onChangeText={setCustomSubjectName}
              placeholder="Enter new subject"
              placeholderTextColor={Colors[theme].icon}
              style={[
                styles.subjectInput,
                {
                  borderColor: Colors[theme].lightBG,
                  color: Colors[theme].text,
                },
              ]}
            />

            <IconButton onPress={saveCustomSubject}>
              <Check size={20} color={Colors[theme].icon} />
              <ThemedText>USE THIS NAME</ThemedText>
            </IconButton>

            <ScrollView style={styles.subjectList}>
              {subjects.length === 0 ? (
                <ThemedText type="captions">No saved subjects yet.</ThemedText>
              ) : (
                subjects.map((subject) => (
                  <Pressable
                    key={subject.folderName}
                    style={[styles.subjectRow, { borderColor: Colors[theme].lightBG }]}
                    onPress={() => selectSubject(subject.subjectName)}>
                    <Book size={16} color={Colors[theme].icon} />
                    <ThemedText>{subject.subjectName}</ThemedText>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  saparator:{
    width:5,
    height:'100%',
    backgroundColor:'#e0dcdc'
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  statusContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingBottom: 5,
    gap: 10,
    marginTop: 5
  },
  footer:{
    height:80,
    flexDirection:'row',
    justifyContent:'space-between',
    width:"100%"
  },
  boxes: {
    flex: 1,
    gap: 5,
    flexWrap: "wrap", alignItems: "center", justifyContent: "center", flexDirection: 'row'
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: 'center'
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  drawerSheet: {
    minHeight: 360,
    maxHeight: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 12,
  },
  subjectInput: {
    minHeight: 48,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  subjectList: {
    marginTop: 4,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
});
