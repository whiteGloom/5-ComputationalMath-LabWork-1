import {
    askForBVec,
    askForCustomMatrix,
    askForDataInputType,
    askForMatrixSize,
    concatMatrices,
    convertToUpperTriangle,
    deConcatMatrices,
    getTaskData,
    Matrix,
    printAsFunctions,
    printSeparator,
    renderMatrices,
    Vec,
    vecToMatrix
} from "./utils.js";

export async function gauss() {
    console.log('Решение системы линейных уравнений методом Гаусса');

    let matrixA: Matrix;
    let bVec: Vec;

    await askForDataInputType(async () => {
        const size = await askForMatrixSize();
        matrixA = await askForCustomMatrix(size);
        bVec = await askForBVec(size);
    }, () => {
        const data = getTaskData();
        matrixA = data.matrixA;
        bVec = data.bVec;
    });

    matrixA = matrixA!;
    bVec = bVec!;
    const size = matrixA.length;

    let bMatrix = vecToMatrix(bVec);

    printSeparator();

    console.log(`Демонстрация введённых данных:`);
    printAsFunctions(matrixA, bVec);

    renderMatrices(concatMatrices(matrixA, bMatrix));

    printSeparator(true);

    console.log('Начинаем преобразование матрицы методом Гаусса...');

    printSeparator(true);

    [matrixA, bMatrix] = deConcatMatrices(convertToUpperTriangle(concatMatrices(matrixA, bMatrix)));

    console.log(`Находим неизвестные переменные, начиная с последней строки.`);

    const x: number[] = new Array(size).fill(0);

    for (let i = size - 1; i >= 0; i--) {
        let entries: string[] = [];
        let sum = 0;
        for (let j = i + 1; j < size; j++) {
            entries.push(`(${matrixA[i][j].toFixed(2)} * ${x[j].toFixed(2)})`);
            sum += matrixA[i][j] * x[j];
        }

        x[i] = (bMatrix[i][0] - sum) / matrixA[i][i];

        if (entries.length === 0) {
            console.log(`X${i + 1} = ${bMatrix[i][0].toFixed(4)} / ${matrixA[i][i].toFixed(4)} = ${x[i].toFixed(4)}`);
        } else {
            console.log(`X${i + 1} = (${bMatrix[i][0].toFixed(4)} - ${entries.join(' + ')}) / ${matrixA[i][i].toFixed(4)} = ${x[i].toFixed(4)}`);
        }
    }

    printSeparator(true);

    console.log(`Значения переменных: ${x.map((val, i) => `X${i + 1} = ${val.toFixed(4)}`).join(', ')}`);

    printSeparator(true);

    console.log('Проверим решение и найдём значение невязки, подставив найденные значения в исходную систему:');

    for (let i = 0; i < size; i++) {
        let result = 0;
        for (let j = 0; j < size; j++) {
            result += matrixA[i][j] * x[j];
        }
        const diff = bMatrix[i][0] - result;
        console.log(`Результат для строки #${i + 1}: ${result.toFixed(4)} (ожидалось ${bMatrix[i][0].toFixed(4)}), невязка: ${diff.toFixed(4)}`);
    }

    console.log('\nКонец решения.\n');
}