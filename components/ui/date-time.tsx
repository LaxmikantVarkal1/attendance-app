import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, Platform, View } from 'react-native';

export default function App() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <View>
      <Button onPress={() => setShow(true)} title="Show Picker" />
      {show && (
        <DateTimePicker
          value={date}
          mode="date" // or "time"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}
