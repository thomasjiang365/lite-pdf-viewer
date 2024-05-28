import { SAVE_FILE_KEY } from '../renderer/config';

export interface IRecentFile {
  name: string;
  path: string;
}

export type StoreType = {
  SAVE_FILE_KEY: IRecentFile[];
};
