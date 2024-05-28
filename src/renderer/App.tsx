import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useState } from 'react';
import type Electron from 'electron';
import { useMount } from 'ahooks';

import PDFViewer from './components/pdf-viewer';

import icon from '../../assets/icon.svg';
import './App.css';

import ROUTES_DATA from './routes';

import { OPEN_FILE_DIALOG_CONFIG, SAVE_FILE_KEY } from './config';
import { IRecentFile } from '../models';

function HomePage() {
  const [recentFiles, setRecentFiles] = useState<IRecentFile[]>([]);
  const navigate = useNavigate();

  useMount(() => {
    const recentFilesInStorage =
      window.electron.ipcRenderer.getStoreValue(SAVE_FILE_KEY.RECENT_FILES) ||
      [];
    setRecentFiles(recentFilesInStorage);
  });

  const onOpenFile = () => {
    window.electron
      .openDialog('showOpenDialog', OPEN_FILE_DIALOG_CONFIG)
      .then((result: Electron.OpenDialogReturnValue) => {
        if (!result.canceled && result.filePaths[0]) {
          const filePath = result.filePaths[0];
          const fileName = filePath.split('/').pop() || '';
          const recentFile = {
            name: fileName,
            path: filePath,
          };
          const newRecentFiles = [recentFile, ...recentFiles];
          window.electron.ipcRenderer.setStoreValue(
            SAVE_FILE_KEY.RECENT_FILES,
            newRecentFiles,
          );
          navigate(`${ROUTES_DATA.PDF_VIEWER.path}?path=${filePath}`);
        }
      })
      .catch(console.log);
  };

  const onOpenRecentFile = (path: string) => {
    navigate(`${ROUTES_DATA.PDF_VIEWER.path}?path=${path}`);
  };

  return (
    <>
      <div className="home-header">
        <button type="button" onClick={onOpenFile}>
          Open File
        </button>
      </div>
      <br />
      <div className="recent-files">
        <li>Recent Files</li>
        {recentFiles.map((file: IRecentFile, index: number) => {
          return (
            <div
              key={index}
              onClick={() => {
                onOpenRecentFile(file.path);
              }}
            >
              {file.name}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES_DATA.HOME.path} element={<HomePage />} />
        <Route path={ROUTES_DATA.PDF_VIEWER.path} element={<PDFViewer />} />
      </Routes>
    </Router>
  );
}
