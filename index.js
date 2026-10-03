import {Command} from 'commader';
import {readFileSync} from 'node:fs';

const program = new Command();
program
  .name('menu')
  .description('Програма для роботи з меню ресторану')
  .version('1.0.0')
  .option('-f, --file <path>', 'Шлях до JSON-файлу', 'datamenu.json');

