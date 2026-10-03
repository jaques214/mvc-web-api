import { createFileUploadMiddleware } from '../utils/fileUpload';

export const upload = createFileUploadMiddleware('covidTest', 'views_uploads');

export type User = {
  title: string;
  description: string;
  inputs: {
    name: string;
    type: string;
    placeholder: string;
  }[];
  keys: string[];
}

export const usersInfo: User = {
  title: 'Users', 
  description: 'list of all Users', 
  inputs: [{
    name:'username',
    type:'text',
    placeholder:'name'
  }, {
    name:'email',
    type: 'text',
    placeholder:'email'
  },
  {
    name:'covidTest',
    type: 'file',
    placeholder:'covidTest'
  }],
  keys: ['id', 'username', 'email', 'role', 'covidTest']
}