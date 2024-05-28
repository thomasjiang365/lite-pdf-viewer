const OPEN_FILE_DIALOG_CONFIG = {
  title: 'Select a file',
  buttonLabel: '打开',
  properties: ['openFile'],
  filters: [{ name: 'PDF', extensions: ['pdf'] }],
};

const SAVE_FILE_KEY = {
  RECENT_FILES: 'recentFiles',
};

export { OPEN_FILE_DIALOG_CONFIG, SAVE_FILE_KEY };
