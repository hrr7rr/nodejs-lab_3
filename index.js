import {Command} from 'commader';
import {readFileSync} from 'node:fs';

const program = new Command();
program
  .name('menu')
  .description('Програма для роботи з меню ресторану')
  .version('1.0.0')
  .option('-f, --file <path>', 'Шлях до JSON-файлу', 'datamenu.json');

function loadData (filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function getDishes(data) {
  return data.menuCategories.flatMap(category => category.categoryDishes);
}

function getFieldValue(object, path) {
   const parts = path.split('.');
   let value = object;

   for (const part of parts) {
     if (value === null) {
        return {exists: true, value:null};
}
     if (typeof value !== 'object' || !(part in value)) {
         return {exists: false};
}
    value = value[part];
}
   return {exists: true, value};
}

program
.command('list')
 .description('Показати стислий список страв')
  .option ('-l, --limit <number>', 'Максимальна кількість страв')
  .action ((options) => {
    const data = loadData( program.opts().file);
    const dishes = getDishes(data);

     const limit = options.limit
      ? Number(options.limit)
      : dishes.length;

    dishes.slice(0, limit).forEach((dish, index) => {
      console.log(`${index}. ${dish.dishName} — ${dish.dishPrice} грн`);
 });
});


program
  .command('get <index>')
  .description('Показати одну страву повністю')
  .action((index) => {
    const data  =  loadData(program.opts().file);
    const dishes = getDishes(data);
    const dishIndex = Number(index);

    if (!Number.isInteger(dishIndex) || dishIndex < 0 || dishIndex >= dishes.length) {
      console.error('Помилка: неправильний індекс страви');
      process.exitCode = 1;
      return;
   }

   console.log(JSON.stringify(dishes[dishIndex], null, 2));
});


program
      .command('field <index> <path>')
.description('Показати окреме поле страви')
      .action((index, path) => {
       const data = loadData(program.opts().file);
       const dishes = getDishes(data);
       const dishIndex = Number(index);

       if (!Number.isInteger(dishIndex) || dishIndex<0 || dishIndex >= dishes.length) {
         console.error('Помилка: неправильний індекс страви');
         process.exitCode =1;
}

const result = getFieldValue(dishes[dishIndex], path);

      if (!result.exists) {
        console.error('Помилка: такого поля не існує');
      process.exitCode = 1;
      return;
}

     if (result.value === null) {
      console.log('null');
} else { console.log(result.value);
}
});
