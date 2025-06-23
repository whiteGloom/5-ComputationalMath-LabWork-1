import * as readline from "node:readline/promises";
import {dichotomyIntro} from "./6.1/index.js";
import {gauss} from "./6.2/6.2.1.js";
import {determinant} from "./6.2/6.2.2.js";
import {revertMatrix} from "./6.2/6.2.3.js";

async function main() {
    console.log('Вычислительная математика.')
    console.log('Лабораторная работа №1');

    console.log('');
    console.log('Доступные задания:');
    console.log('1) 6.1 Решение уравнений с одной переменной (методом дихотомии)');
    console.log('2) 6.2.1 Решение системы линейных уравнений (методом Гаусса)');
    console.log('3) 6.2.2 Вычисление определителя матрицы (методом Гаусса)');
    console.log('4) 6.2.3 Вычисление обратной матрицы (методом Гаусса)');
    console.log('6) Закончить работу и выйти из программы');
    console.log('');


    taskLoop: while (true) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const task = parseInt(await rl.question('Выберите номер задания: '));
        rl.close();

        switch (task) {
            case 1:
                console.log('');
                await dichotomyIntro();
                break;
            case 2:
                console.log('');
                await gauss();
                break;
            case 3:
                console.log('');
                await determinant();
                break;
            case 4:
                console.log('');
                await revertMatrix();
                break;
            case 6:
                break taskLoop;
            default:
                console.log('Неверный номер задания. Пожалуйста, попробуйте снова.\n');
        }
    }
}

main().catch(err => {
    console.error('Произошла ошибка:', err);
});