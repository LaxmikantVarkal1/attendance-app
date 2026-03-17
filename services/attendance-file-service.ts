import { Directory, File, Paths } from 'expo-file-system';

export type AttendanceRecord = {
  dateTime: string;
  date: string;
  time: string;
  present: number;
  total: number;
  attendanceCount: string;
  percentage: number;
};

export type SubjectAttendance = {
  subjectName: string;
  folderName: string;
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
    jsonFile: new File(subjectDir, 'attendance.json'),
    csvFile: new File(subjectDir, 'attendance.csv'),
  };
};

const ensureDir = (path: Directory) => {
  if (!path.exists) {
    path.create({ intermediates: true, idempotent: true });
  }
};

const readJsonRecords = async (jsonFile: File): Promise<AttendanceRecord[]> => {
  if (!jsonFile.exists) {
    return [];
  }

  try {
    const raw = await jsonFile.text();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((record) => {
      const date = typeof record?.date === 'string' ? record.date : '';
      const time = typeof record?.time === 'string' ? record.time : '00:00';
      const dateTime =
        typeof record?.dateTime === 'string' && record.dateTime
          ? record.dateTime
          : `${date}T${time}`;

      return {
        dateTime,
        date,
        time,
        present: Number(record?.present ?? 0),
        total: Number(record?.total ?? 0),
        attendanceCount:
          typeof record?.attendanceCount === 'string'
            ? record.attendanceCount
            : `${Number(record?.present ?? 0)}/${Number(record?.total ?? 0)}`,
        percentage: Number(record?.percentage ?? 0),
      };
    });
  } catch {
    return [];
  }
};

const writeCsv = (csvFile: File, records: AttendanceRecord[]) => {
  const header = 'dateTime,date,time,present,total,attendanceCount,percentage';
  const rows = records.map(
    (record) =>
      `${record.dateTime},${record.date},${record.time},${record.present},${record.total},${record.attendanceCount},${record.percentage}`
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
  present: number;
  total: number;
}) => {
  const { subjectName, date, time, present, total } = input;
  const { subjectDir, jsonFile, csvFile } = getSubjectPaths(subjectName);

  ensureDir(SUBJECTS_ROOT);
  ensureDir(subjectDir);

  const records = await readJsonRecords(jsonFile);
  const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;
  const dateTime = `${date}T${time}`;

  if (records.some((record) => record.dateTime === dateTime)) {
    throw new Error('Attendance already exists for this subject at the selected date and time.');
  }

  const nextRecord: AttendanceRecord = {
    dateTime,
    date,
    time,
    present,
    total,
    attendanceCount: `${present}/${total}`,
    percentage,
  };

  records.push(nextRecord);
  records.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  if (!jsonFile.exists) {
    jsonFile.create({ intermediates: true, overwrite: true });
  }
  jsonFile.write(JSON.stringify(records, null, 2));
  writeCsv(csvFile, records);
};

export const attendanceRecordExists = async (input: {
  subjectName: string;
  date: string;
  time: string;
}) => {
  const { subjectName, date, time } = input;
  const { jsonFile } = getSubjectPaths(subjectName);
  const records = await readJsonRecords(jsonFile);
  return records.some((record) => record.dateTime === `${date}T${time}`);
};

export const loadAllSubjectsAttendance = async (): Promise<SubjectAttendance[]> => {
  ensureDir(SUBJECTS_ROOT);
  const entries = SUBJECTS_ROOT.list().filter((entry) => entry instanceof Directory);

  const subjects = await Promise.all(
    entries.map(async (subjectDir) => {
      const folderName = subjectDir.name;
      const records = await readJsonRecords(new File(subjectDir, 'attendance.json'));

      return {
        subjectName: folderName.replace(/_/g, ' '),
        folderName,
        records,
      };
    })
  );

  return subjects
    .filter((subject) => subject.records.length > 0)
    .sort((a, b) => a.subjectName.localeCompare(b.subjectName));
};
