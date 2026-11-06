const translations = {
  en: {
    pageTitle: 'ClipCut — Split videos by file size',
    pageDescription: 'Split a video into size-limited MP4 parts directly in your browser. Your file stays on your device.',
    brandHome: 'ClipCut home',
    languageLabel: 'Language',
    switchEnglish: 'Switch to English',
    switchThai: 'Switch to Thai',
    privacy: 'Private by design',
    eyebrow: 'VIDEO UTILITY / 001',
    headingFirst: 'Make a long video',
    headingSecond: 'fit anywhere.',
    intro: 'Choose a video, set the maximum file size, and download each part. Your video never leaves this browser.',
    splitterLabel: 'Video splitter',
    setupHeading: '01 / SETUP',
    formatHint: 'MP4 in · MP4 out',
    dropTitle: 'Drop your video here',
    browseFiles: 'or browse files',
    dropHelp: 'One video at a time · MP4 works best',
    removeFile: 'Remove selected video',
    limitLabel: 'Maximum size per part',
    limitHelp: 'Every downloadable part is checked against this limit.',
    splitButton: 'Split video',
    noteChoose: 'Choose a video to get started.',
    noteReading: 'Reading video details…',
    noteLimit: 'Enter a positive whole number of MB.',
    noteFits: 'This video already fits the limit. You can download it as one part.',
    noteEstimate: 'At least {count} parts · {duration} total · processed locally',
    fileReading: 'Reading duration…',
    processingHeading: '02 / PROCESSING',
    progressPreparing: 'Preparing video…',
    progressPreparingDetail: 'This can take a while for long videos.',
    cancel: 'Cancel',
    cancelling: 'Cancelling…',
    cancellingDetail: 'Releasing browser memory.',
    resultsHeading: '02 / YOUR PARTS',
    partsReady: ({ count }) => `${count} ${count === 1 ? 'PART' : 'PARTS'} READY`,
    download: 'Download ↗',
    downloadFile: 'Download {name}',
    resultsNote: 'Download the parts before closing this tab. They are held only in browser memory.',
    footerPrivacy: 'LOCAL PROCESSING · NO UPLOADS · NO ACCOUNT',
    footerTagline: "Made for the files that just won't fit.",
    errorFileType: 'Choose a video file, preferably MP4.',
    errorDuration: 'The video duration could not be read. Try an MP4 file.',
    errorRead: 'This browser could not read the video. Try an MP4 file.',
    errorLimit: 'Enter a positive whole number of MB.',
    errorNoParts: 'The video produced no playable parts.',
    errorMount: 'Could not open the selected file in the browser video engine.',
    errorProcessing: 'Video processing failed. Try a different MP4 file.',
    errorTooLarge: 'Could not make every part fit the selected limit. Try a larger limit or a shorter video.',
    errorGeneric: 'Something went wrong while splitting the video. Please try again.',
    statusLoadingTitle: 'Loading video engine…',
    statusLoadingDetail: 'The processing engine is downloaded once and cached by your browser.',
    modePreparing: 'Preparing',
    statusCopyTitle: 'Splitting without quality loss…',
    statusCopyDetail: 'Checking size limit · pass {attempt} of {maxAttempts}',
    modeCopy: 'Fast mode',
    statusEncodeTitle: 'Making smaller parts…',
    statusEncodeDetail: 'Re-encoding to meet your limit · pass {attempt} of {maxAttempts}. This may take a while.',
    modeEncode: 'Compatibility mode',
  },
  th: {
    pageTitle: 'ClipCut — แยกวิดีโอตามขนาดไฟล์',
    pageDescription: 'แยกวิดีโอเป็นไฟล์ MP4 หลายส่วนตามขนาดที่กำหนดในเบราว์เซอร์ ไฟล์ของคุณอยู่บนอุปกรณ์เท่านั้น',
    brandHome: 'หน้าแรก ClipCut',
    languageLabel: 'ภาษา',
    switchEnglish: 'เปลี่ยนเป็นภาษาอังกฤษ',
    switchThai: 'เปลี่ยนเป็นภาษาไทย',
    privacy: 'เป็นส่วนตัวตั้งแต่ต้น',
    eyebrow: 'เครื่องมือวิดีโอ / 001',
    headingFirst: 'ตัดวิดีโอยาว',
    headingSecond: 'ให้พอดีทุกที่',
    intro: 'เลือกวิดีโอ กำหนดขนาดไฟล์สูงสุด แล้วดาวน์โหลดแต่ละส่วน วิดีโอของคุณจะไม่ออกจากเบราว์เซอร์นี้',
    splitterLabel: 'เครื่องมือแยกวิดีโอ',
    setupHeading: '01 / ตั้งค่า',
    formatHint: 'นำเข้า MP4 · ส่งออก MP4',
    dropTitle: 'วางวิดีโอที่นี่',
    browseFiles: 'หรือเลือกไฟล์',
    dropHelp: 'ครั้งละ 1 ไฟล์ · แนะนำ MP4',
    removeFile: 'นำวิดีโอที่เลือกออก',
    limitLabel: 'ขนาดสูงสุดต่อส่วน',
    limitHelp: 'ตรวจสอบทุกส่วนก่อนให้ดาวน์โหลดว่าไม่เกินขนาดนี้',
    splitButton: 'แยกวิดีโอ',
    noteChoose: 'เลือกวิดีโอเพื่อเริ่มต้น',
    noteReading: 'กำลังอ่านข้อมูลวิดีโอ…',
    noteLimit: 'กรอกขนาดเป็นจำนวนเต็มบวกในหน่วย MB',
    noteFits: 'วิดีโอนี้มีขนาดไม่เกินที่กำหนด ดาวน์โหลดเป็นไฟล์เดียวได้',
    noteEstimate: 'อย่างน้อย {count} ส่วน · ความยาว {duration} · ประมวลผลบนอุปกรณ์',
    fileReading: 'กำลังอ่านความยาว…',
    processingHeading: '02 / กำลังประมวลผล',
    progressPreparing: 'กำลังเตรียมวิดีโอ…',
    progressPreparingDetail: 'วิดีโอยาวอาจใช้เวลาสักครู่',
    cancel: 'ยกเลิก',
    cancelling: 'กำลังยกเลิก…',
    cancellingDetail: 'กำลังคืนหน่วยความจำของเบราว์เซอร์',
    resultsHeading: '02 / ไฟล์ที่ได้',
    partsReady: ({ count }) => `พร้อมดาวน์โหลด ${count} ส่วน`,
    download: 'ดาวน์โหลด ↗',
    downloadFile: 'ดาวน์โหลด {name}',
    resultsNote: 'ดาวน์โหลดทุกส่วนก่อนปิดแท็บนี้ ไฟล์ที่ได้เก็บไว้ในหน่วยความจำของเบราว์เซอร์เท่านั้น',
    footerPrivacy: 'ประมวลผลบนอุปกรณ์ · ไม่อัปโหลด · ไม่ต้องสมัครบัญชี',
    footerTagline: 'สำหรับวิดีโอที่ใหญ่เกินจะส่ง',
    errorFileType: 'เลือกไฟล์วิดีโอ โดยแนะนำไฟล์ MP4',
    errorDuration: 'อ่านความยาววิดีโอไม่ได้ ลองใช้ไฟล์ MP4',
    errorRead: 'เบราว์เซอร์นี้อ่านวิดีโอไม่ได้ ลองใช้ไฟล์ MP4',
    errorLimit: 'กรอกขนาดเป็นจำนวนเต็มบวกในหน่วย MB',
    errorNoParts: 'ไม่สามารถสร้างส่วนของวิดีโอที่เล่นได้',
    errorMount: 'เปิดไฟล์ที่เลือกในเครื่องมือวิดีโอของเบราว์เซอร์ไม่ได้',
    errorProcessing: 'ประมวลผลวิดีโอไม่สำเร็จ ลองใช้ไฟล์ MP4 อื่น',
    errorTooLarge: 'ไม่สามารถทำให้ทุกส่วนมีขนาดตามที่กำหนดได้ ลองเพิ่มขนาดสูงสุดหรือใช้วิดีโอที่สั้นลง',
    errorGeneric: 'เกิดข้อผิดพลาดขณะแยกวิดีโอ โปรดลองอีกครั้ง',
    statusLoadingTitle: 'กำลังโหลดเครื่องมือวิดีโอ…',
    statusLoadingDetail: 'เบราว์เซอร์จะดาวน์โหลดเครื่องมือครั้งแรกและเก็บไว้ในแคช',
    modePreparing: 'กำลังเตรียม',
    statusCopyTitle: 'กำลังแยกโดยไม่ลดคุณภาพ…',
    statusCopyDetail: 'ตรวจสอบขนาด · รอบที่ {attempt} จาก {maxAttempts}',
    modeCopy: 'โหมดเร็ว',
    statusEncodeTitle: 'กำลังทำไฟล์ให้เล็กลง…',
    statusEncodeDetail: 'เข้ารหัสใหม่ให้ตรงตามขนาด · รอบที่ {attempt} จาก {maxAttempts} อาจใช้เวลาสักครู่',
    modeEncode: 'โหมดรองรับไฟล์',
  },
};

const STORAGE_KEY = 'clipcut-language';
let language = 'en';
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  language = saved === 'en' || saved === 'th'
    ? saved
    : navigator.language?.toLowerCase().startsWith('th') ? 'th' : 'en';
} catch {
  language = navigator.language?.toLowerCase().startsWith('th') ? 'th' : 'en';
}

export function getLanguage() {
  return language;
}

export function setLanguage(next) {
  if (next !== 'en' && next !== 'th') return;
  language = next;
  try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Storage may be unavailable. */ }
}

export function t(key, params = {}) {
  const value = translations[language][key] ?? translations.en[key];
  if (typeof value === 'function') return value(params);
  return value?.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? '')) ?? key;
}
