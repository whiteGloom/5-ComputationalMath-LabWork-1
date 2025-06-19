import * as readline from "node:readline/promises";


export function printSeparator(emptyLine: boolean = false) {
    if (emptyLine) {
        console.log('');
        return;
    }

    console.log('...');
}

export async function enterMatrixFromTask(isBVecRequired: boolean): Promise<{
    bVec?: number[],
    matrixA: number[][],
    size: number
}> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let size: number;
    let matrixA: number[][] = [];
    let bVec: number[] = [];

    let customTableOrFromTask: number;
    while (true) {
        customTableOrFromTask = +await rl.question('Вы хотите ввести матрицу вручную (1) или использовать данные из задания (2)?: ');
        if ([1, 2].includes(customTableOrFromTask)) break;
        console.log('Некорректный ввод. Пожалуйста, введите 1 или 2.');
    }

    if (customTableOrFromTask === 1) {
        console.log('Вы выбрали ввод матрицы вручную.');
        size = +await rl.question('Введите порядок системы: ');
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const value = +await rl.question(`Введите значение элемента матрицы A[${i + 1}][${j + 1}]: `);

                if (Number.isNaN(value)) {
                    console.log('Некорректный ввод. Пожалуйста, введите число.');
                    j--; // Повторяем ввод для текущего элемента
                } else {
                    if (!matrixA[i]) {
                        matrixA[i] = [];
                    }

                    matrixA[i][j] = value;
                }
            }
        }

        if (isBVecRequired) {
            for (let i = 0; i < size; i++) {
                const value = +await rl.question(`Введите значение правой части системы b #${i + 1}: `);

                if (Number.isNaN(value)) {
                    console.log('Некорректный ввод. Пожалуйста, введите число.');
                    i--;
                } else {
                    bVec.push(value);
                }
            }
        }
    } else {
        console.log('Вы выбрали данные из задания.');
        size = 3;

        matrixA = [
            [6, -1, -1],
            [-1, 6, -1],
            [-1, -1, 6]
        ];

        bVec = [-11.33, 32, 42];
    }

    rl.close();

    if (isBVecRequired) {
        return {bVec, matrixA, size};
    }

    return {matrixA, size};
}


export function renderMatrix(matrixA: number[][], bVec?: number[]) {
    if (!bVec) {
        console.log(`Матрица A
${matrixA.map(row => `${row.map(value => `${value.toFixed(2)}`.padEnd(8)).join('')}`).join('\n')}
`);
        return;
    }

    console.log(`Матрица A и вектор b:
${matrixA.map((row, ri) => `${row.map(value => `${value.toFixed(2)}`.padEnd(8)).join('')} | ${bVec[ri].toFixed(2)}`).join('\n')}
`);
}

export function printMatrixAsFunctions(matrixA: number[][], bVec: number[]) {
    console.log(`{
  ${matrixA.map((row, ri) => `${row.map((c, i) => `${c >= 0 && i > 0 ? '+' : ''}${c}X${i + 1}`).join('')}=${bVec[ri]}`).join('\n  ')}
}
`);
}

export function convertToUpperTriangle(matrixA: number[][], size: number, bVec?: number[]) {
    console.log('Убедимся, что в первой строке матрицы нет нулевого элемента в первом столбце...');

    if (matrixA[0][0] === 0) {
        console.log('Найден нулевой элемент в первой строке. Поменяем строки местами, чтобы избежать этого.');
        for (let i = 1; i < size; i++) {
            if (matrixA[i][0] !== 0) {
                console.log(`Меняем строки #1 и #${i + 1} местами.`);

                [matrixA[0], matrixA[i]] = [matrixA[i], matrixA[0]];

                if (bVec) {
                    [bVec[0], bVec[i]] = [bVec[i], bVec[0]];
                }

                renderMatrix(matrixA, bVec);

                break;
            }
        }
        if (matrixA[0][0] === 0) {
            console.log('Не удалось найти строку с ненулевым первым элементом. Прекращаем выполнение.');
            return;
        }
    } else {
        console.log('В первой строке матрицы нет нулевого элемента в первом столбце.');
    }

    printSeparator(true);

    console.log('Пошагово приводим строки матрицы к верхне-треугольному виду.');

    printSeparator(true);

    for (let i = 0; i < size - 1; i++) {
        console.log(`Приводим элементы столбца #${i + 1} ниже строчки #${i + 1} к нулю`);

        for (let j = i + 1; j < size; j++) {
            if (matrixA[j][i] !== 0) {
                const factor = matrixA[j][i] / matrixA[i][i];

                console.log(`Умножаем строку #${i + 1} на ${factor.toFixed(2)} (${matrixA[j][i].toFixed(2)} / ${matrixA[i][i].toFixed(2)}) и вычитаем из строки #${j + 1}.`);

                for (let k = i; k < size; k++) {
                    matrixA[j][k] -= factor * matrixA[i][k];
                }

                if (bVec) {
                    bVec[j] -= factor * bVec[i];
                }

                renderMatrix(matrixA, bVec);
            }
        }
    }

    console.log(`После приведения к верхне-треугольному виду матрица выглядит так:`);

    renderMatrix(matrixA, bVec);
}