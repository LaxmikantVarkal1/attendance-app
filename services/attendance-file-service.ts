import { Directory, File, Paths } from 'expo-file-system';

export type AttendanceRecord = {
  dateTime: string;
  date: string;
  time: string;
  from: number;
  to: number;
  present: number;
  total: number;
  attendanceCount: string;
  percentage: number;
};

export type SubjectAttendance = {
  subjectName: string;
  folderName: string;
  from: number;
  to: number;
  records: AttendanceRecord[];
};

const SUBJECTS_ROOT = new Directory(Paths.document, 'subjects');

const sanitizeFolderName = (name: string) =>
  name
    .trim()
    .replace(/[\/\\:*?"<>|]/g, '_')
    .replace(/\s+/g, '_') || 'Untitled_Subject';

const getSubjectPaths = (subjectName: string) => {
  const folderName = sanitizeFolderName(subjectName);
  const subjectDir = new Directory(SUBJECTS_ROOT, folderName);

  return {
    folderName,
    subjectDir,
    csvFile: new File(subjectDir, 'attendance.csv'),
  };
};

const ensureDir = (path: Directory) => {
  if (!path.exists) {
    path.create({ intermediates: true, idempotent: true });
  }
};

const readCsvRecords = async (csvFile: File): Promise<AttendanceRecord[]> => {
  if (!csvFile.exists) {
    return [];
  }

  try {
    const raw = await csvFile.text();
    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length <= 1) {
      return [];
    }

    return lines.slice(1).map((line) => {
      const [dateTime = '', date = '', time = '00:00', from = '', to = '', present = '0', total = '0', attendanceCount = '', percentage = '0'] =
        line.split(',');
      const parsedTotal = Number(total);
      const parsedFrom = from !== '' ? Number(from) : 1;
      const parsedTo = to !== '' ? Number(to) : parsedFrom + parsedTotal - 1;

      return {
        dateTime,
        date,
        time,
        from: parsedFrom,
        to: parsedTo,
        present: Number(present),
        total: parsedTotal,
        attendanceCount: attendanceCount || `${Number(present)}/${parsedTotal}`,
        percentage: Number(percentage),
      };
    });
  } catch {
    return [];
  }
};

const writeCsvRecords = (csvFile: File, records: AttendanceRecord[]) => {
  const header = 'dateTime,date,time,from,to,present,total,attendanceCount,percentage';
  const rows = records.map(
    (record) =>
      `${record.dateTime},${record.date},${record.time},${record.from},${record.to},${record.present},${record.total},${record.attendanceCount},${record.percentage}`
  );

  if (!csvFile.exists) {
    csvFile.create({ intermediates: true, overwrite: true });
  }

  csvFile.write([header, ...rows].join('\n'));
};

export const saveAttendanceForSubject = async (input: {
  subjectName: string;
  date: string;
  time: string;
  from: number;
  to: number;
  present: number;
  total: number;
}) => {
  const { subjectName, date, time, from, to, present, total } = input;
  const { subjectDir, csvFile } = getSubjectPaths(subjectName);

  ensureDir(SUBJECTS_ROOT);
  ensureDir(subjectDir);

  const records = await readCsvRecords(csvFile);
  const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;
  const dateTime = `${date}T${time}`;

  if (records.some((record) => record.dateTime === dateTime)) {
    throw new Error('Attendance already exists for this subject at the selected date and time.');
  }

  const nextRecord: AttendanceRecord = {
    dateTime,
    date,
    time,
    from,
    to,
    present,
    total,
    attendanceCount: `${present}/${total}`,
    percentage,
  };

  records.push(nextRecord);
  records.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  writeCsvRecords(csvFile, records);
};

export const attendanceRecordExists = async (input: {
  subjectName: string;
  date: string;
  time: string;
}) => {
  const { subjectName, date, time } = input;
  const { csvFile } = getSubjectPaths(subjectName);
  const records = await readCsvRecords(csvFile);
  return records.some((record) => record.dateTime === `${date}T${time}`);
};

export const deleteSubjectFile = (subjectName: string) => {
  const { csvFile } = getSubjectPaths(subjectName);
  if (csvFile.exists) {
    csvFile.delete();
  }
};

export const deleteAttendanceRecord = async (input: {
  subjectName: string;
  dateTime: string;
}) => {
  const { subjectName, dateTime } = input;
  const { csvFile } = getSubjectPaths(subjectName);

  if (!csvFile.exists) {
    return;
  }

  const records = await readCsvRecords(csvFile);
  const nextRecords = records.filter((record) => record.dateTime !== dateTime);

  if (nextRecords.length === records.length) {
    return;
  }

  if (nextRecords.length === 0) {
    csvFile.delete();
    return;
  }

  writeCsvRecords(csvFile, nextRecords);
};

export const deleteSubjectFolder = (subjectName: string) => {
  const { subjectDir } = getSubjectPaths(subjectName);
  if (subjectDir.exists) {
    subjectDir.delete();
  }
};

export const loadAllSubjectsAttendance = async (): Promise<SubjectAttendance[]> => {
  ensureDir(SUBJECTS_ROOT);
  const entries = SUBJECTS_ROOT.list().filter((entry) => entry instanceof Directory);

  const subjects = await Promise.all(
    entries.map(async (subjectDir) => {
      const folderName = subjectDir.name;
      const records = await readCsvRecords(new File(subjectDir, 'attendance.csv'));

      return {
        subjectName: folderName.replace(/_/g, ' '),
        folderName,
        from: records[0]?.from ?? 1,
        to: records[0]?.to ?? (records[0]?.total ?? 0),
        records,
      };
    })
  );

  return subjects
    .filter((subject) => subject.records.length > 0)
    .sort((a, b) => a.subjectName.localeCompare(b.subjectName));
};
