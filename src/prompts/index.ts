import { MultiSelect }  from 'enquirer';
import { nginxPrompt, nginxHealthPrompt } from './nginx/nginx';
import { apachePrompt, apacheHealthPrompt } from './apache/apache';

const servicesToMonitor: any = new MultiSelect({
  name: 'sources',
  message: 'What would you like to monitor?\n' +
           'Press: Space to select one, A to select all, and Enter to submit.',
  choices: [
    { name: 'nginx' },
    { name: 'Apache' },
    { name: 'Postgres' },
    { name: 'MongoDB' },
    { name: 'Host machine health' },
    { name: 'Custom application (other)' },
  ],
});

export {
  servicesToMonitor,
  nginxPrompt, nginxHealthPrompt,
  apachePrompt, apacheHealthPrompt,
};