import {
    askForCustomMatrix,
    askForDataInputType,
    askForMatrixSize,
    convertToUpperTriangle,
    getTaskData,
    Matrix,
    printSeparator,
    renderMatrices
} from "./utils.js";

export async function determinant() {
    console.log('Вычисление определителя матрицы методом Гаусса');

    let matrixA: Matrix;

    await askForDataInputType(async () => {
        const size = await askForMatrixSize();
        matrixA = await askForCustomMatrix(size);
    }, () => {
        matrixA = getTaskData().matrixA;
    });

    matrixA = matrixA!;

    printSeparator();

    console.log(`Демонстрация введённых данных:`);

    renderMatrices(matrixA);

    printSeparator(true);

    console.log('Начинаем преобразование матрицы методом Гаусса...');

    printSeparator(true);

    convertToUpperTriangle(matrixA);

    console.log('Находим определитель матрицы, перемножая элементы главной диагонали:');

    console.log(`Определитель = ${matrixA.map((_, i) => matrixA[i][i].toFixed(2)).join(' * ')}`);

    const determinant = matrixA.reduce((acc, row, i) => acc * row[i], 1);

    console.log(`Определитель = ${determinant.toFixed(4)}`);

    console.log('\nКонец решения.\n');
}