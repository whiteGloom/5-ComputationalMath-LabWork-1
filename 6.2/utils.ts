import * as readline from "node:readline/promises";

export type Vec = number[];

export type Matrix = Vec[];

export function printSeparator(emptyLine: boolean = false) {
    if (emptyLine) {
        console.log('');
        return;
    }

    console.log('...');
}

export async function askForDataInputType(onCustomMatrix: () => void, onTaskData: () => void) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const answer = await rl.question('Вы хотите ввести матрицу вручную (1) или использовать данные из задания (2)?: ');

        if (answer === '1') {
            rl.close();
            return onCustomMatrix();
        } else if (answer === '2') {
            rl.close();
            return onTaskData();
        } else {
            console.log('Некорректный ввод. Пожалуйста, введите 1 или 2.');
        }
    }
}

export async function askForMatrixSize(): Promise<number> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const answer = +await rl.question('Введите порядок системы: ');
        if (Number.isInteger(answer) && answer > 0) {
            rl.close();
            return answer;
        } else {
            console.log('Некорректный ввод. Пожалуйста, введите положительное целое число.');
        }
    }
}

export async function askForCustomMatrix(size: number): Promise<Matrix> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const matrixA: Matrix = [];

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

    rl.close();
    return matrixA;
}

export async function askForBVec(size: number): Promise<Vec> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const bVec: Vec = [];


    for (let i = 0; i < size; i++) {
        const value = +await rl.question(`Введите значение правой части системы b #${i + 1}: `);

        if (Number.isNaN(value)) {
            console.log('Некорректный ввод. Пожалуйста, введите число.');
            i--;
        } else {
            bVec.push(value);
        }
    }

    rl.close();
    return bVec;
}

export function getTaskData(): {
    bVec: Vec,
    matrixA: Matrix,
    size: number
} {
    return {
        size: 3,
        matrixA: [
            [6, -1, -1],
            [-1, 6, -1],
            [-1, -1, 6]
        ],
        bVec: [-11.33, 32, 42]
    };
}

export function vecToMatrix(vec: Vec): Matrix {
    return vec.map(value => [value]);
}

export function concatMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
    const result: Matrix = [];

    for (let i = 0; i < matrixA.length; i++) {
        result[i] = matrixA[i].concat(matrixB[i]);
    }

    return result;
}

export function renderMatrices(matrixA: Matrix, title: string = 'Матрица:\n') {
    const size = matrixA.length;

    let result = matrixA.map(row => {
        let rowStr = '';

        for (let i = 0; i < row.length; i++) {
            const value = row[i];

            if (i > 0 && i % size === 0) {
                rowStr += (' | ');
            }

            rowStr += `${value.toFixed(2)}`.padEnd(8);
        }

        return rowStr;
    }).join('\n');

    console.log(`${title}${result}`);
}

export function printAsFunctions(matrixA: Matrix, bVec: Vec) {
    console.log(`{
  ${matrixA.map((row, ri) => `${row.map((c, i) => `${c >= 0 && i > 0 ? '+' : ''}${c}X${i + 1}`).join('')}=${bVec[ri]}`).join('\n  ')}
}
`);
}

export function convertToUpperTriangle(matrixA: Matrix): Matrix {
    const size = matrixA.length;

    for (let i = 0; i < size - 1; i++) {
        if (i < size - 1 && matrixA[i][i] === 0) {
            console.log(`Ведущий элемент в строке #${i + 1} равен нулю. Найдём строку ниже на замену...`);
            for (let j = i + 1; j < size; j++) {
                if (matrixA[j][i] !== 0) {
                    console.log(`Меняем строки #${i + 1} и #${j + 1} местами.`);

                    [matrixA[i], matrixA[j]] = [matrixA[j], matrixA[i]];

                    renderMatrices(matrixA);

                    break;
                }
            }

            if (matrixA[i][i] === 0) {
                throw 'Не удалось найти строку с ненулевым первым элементом. Прекращаем выполнение.'
            }
        }

        console.log(`Приводим элементы столбца #${i + 1} ниже строчки #${i + 1} к нулю`);

        for (let j = i + 1; j < size; j++) {
            if (matrixA[j][i] !== 0) {
                const factor = matrixA[j][i] / matrixA[i][i];

                console.log(`Умножаем строку #${i + 1} на ${factor.toFixed(2)} (${matrixA[j][i].toFixed(2)} / ${matrixA[i][i].toFixed(2)}) и вычитаем из строки #${j + 1}.`);

                for (let k = 0; k < matrixA[j].length; k++) {
                    matrixA[j][k] -= factor * matrixA[i][k];
                }

                renderMatrices(matrixA);
            }
        }
    }

    return matrixA;
}

export function deConcatMatrices(matrix: Matrix): [Matrix, Matrix] {
    const result: [Matrix, Matrix] = [[], []];
    const size = matrix.length;

    for (let i = 0; i < size; i++) {
        const row = matrix[i];

        result[0][i] = row.slice(0, size);
        result[1][i] = row.slice(size);
    }

    return result;
}