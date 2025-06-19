import * as readline from "node:readline/promises";

export async function dichotomyIntro() {
    function targetFunc(x: number): number {
        return x * Math.sin(x) - 1;
    }

    console.log('Решение уравнений с одной переменной методом дихотомии');
    console.log('Нахождение корня функции f(x) = x * sin(x) - 1 на интервале с заданной точностью аргумента и функции');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let left = +await rl.question('Введите значение левой границы интервала: ');
    let right = +await rl.question('Введите значение правой границы интервала: ');
    let argumentAccuracy = +await rl.question('Введите точность аргумента (количество верных знаков после запятой): ');
    let functionAccuracy = +await rl.question('Введите точность функции: ');

    rl.close();

    console.log('...');


    dichotomy(targetFunc, left, right, 10 ** -argumentAccuracy, functionAccuracy);
    console.log(' ');
}

function dichotomy(targetFunc: (x: number) => number, a: number, b: number, argumentAccuracy: number, functionAccuracy: number = 0): void {
    let left = a;
    let right = b;
    let middle = a + (b - a) / 2;
    let valueAtLeft = targetFunc(left);
    let valueAtMiddle = targetFunc(middle);
    let iteration = 1;

    function showResult() {
        console.log(`Обнаружен корень функции с заданной точностью аргумента и функции на итерации № ${iteration}:`);
        console.log(`Левая граница интервала: ${left.toFixed(3)}`);
        console.log(`Правая граница интервала: ${right.toFixed(3)}`);
        console.log(`Текущая точность аргумента: ${right - left}`);
        console.log(`x = ${middle.toFixed(3)}, f(x) = ${valueAtMiddle.toFixed(3)}`);
    }

    if (valueAtLeft === 0) {
        console.log('Точный корень функции найден на левой границе.');
    }

    if (targetFunc(right) === 0) {
        console.log('Точный корень функции найден на правой границе.');
    }

    while (true) {
        if (Math.abs(valueAtMiddle) <= functionAccuracy &&
            Math.abs(right - left) <= argumentAccuracy) {
            showResult();
            return;
        }

        if (valueAtLeft * valueAtMiddle <= 0) {
            right = middle;
        } else {
            left = middle;
        }

        middle = left + (right - left) / 2;
        valueAtLeft = targetFunc(left);
        valueAtMiddle = targetFunc(middle);
        iteration += 1;

        if (iteration > 100) {
            console.log('Превышено максимальное количество итераций (100).');
            return;
        }
    }
}
