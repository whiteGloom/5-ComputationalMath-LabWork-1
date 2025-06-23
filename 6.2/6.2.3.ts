import {
    askForCustomMatrix,
    askForDataInputType,
    askForMatrixSize,
    concatMatrices,
    convertToUpperTriangle,
    deConcatMatrices,
    getTaskData,
    Matrix,
    printSeparator,
    renderMatrices
} from "./utils.js";

export async function revertMatrix() {
    console.log('Вычисление определителя матрицы методом Гаусса');

    let matrixA: Matrix;

    await askForDataInputType(async () => {
        const size = await askForMatrixSize();
        matrixA = await askForCustomMatrix(size);
    }, () => {
        matrixA = getTaskData().matrixA;
    });

    matrixA = matrixA!;
    const originalMatrix = matrixA;
    const size = matrixA.length;

    printSeparator();

    console.log(`Демонстрация введённых данных:`);

    renderMatrices(matrixA);

    console.log('Начинаем преобразования...');

    printSeparator(true);

    console.log('Создадим единичную матрицу и отобразим единичную справа от основной::');

    let identityMatrix: Matrix = Array.from({length: size}, (_, i) =>
        Array.from({length: size}, (_, j) => (i === j ? 1 : 0))
    );

    renderMatrices(concatMatrices(matrixA, identityMatrix));

    printSeparator(true);

    console.log('Пошагово приводим строки матрицы к верхне-треугольному виду.');

    printSeparator(true);

    [matrixA, identityMatrix] = deConcatMatrices(convertToUpperTriangle(concatMatrices(matrixA, identityMatrix)));

    console.log(`После приведения к верхне-треугольному виду матрица выглядит так:`);

    renderMatrices(concatMatrices(matrixA, identityMatrix));

    console.log('Приведём главную диагональ основной матрицы к единичному виду');

    for (let i = 0; i < size; i++) {
        if (matrixA[i][i] === 0) {
            console.log(`Найден нулевой элемент на главной диагонали в строке #${i + 1}. Прекращаем выполнение.`);
            return;
        }

        const factor = matrixA[i][i];
        console.log(`Делим строку #${i + 1} на ${factor.toFixed(2)} для получения единицы на главной диагонали.`);

        for (let j = 0; j < size; j++) {
            matrixA[i][j] /= factor;
            identityMatrix[i][j] /= factor;
        }

        renderMatrices(concatMatrices(matrixA, identityMatrix));
        printSeparator(true);
    }

    console.log('Пошагово приводим строки матрицы к нижне-треугольному виду.');

    printSeparator(true);

    for (let i = size - 1; i > 0; i--) {
        console.log(`Приводим элементы столбца #${i + 1} выше строчки #${i + 1} к нулю`);

        for (let j = i - 1; j >= 0; j--) {
            if (matrixA[j][i] !== 0) {
                const factor = matrixA[j][i] / matrixA[i][i];

                console.log(`Умножаем строку #${i + 1} на ${factor.toFixed(2)} (${matrixA[j][i].toFixed(2)} / ${matrixA[i][i].toFixed(2)}) и вычитаем из строки #${j + 1}.`);

                for (let k = size - 1; k >= 0; k--) {
                    matrixA[j][k] -= factor * matrixA[i][k];
                    identityMatrix[j][k] -= factor * identityMatrix[i][k];
                }

                renderMatrices(concatMatrices(matrixA, identityMatrix));
                printSeparator(true);
            }
        }
    }

    console.log('Преобразования завершены.');
    printSeparator(true);

    renderMatrices(originalMatrix, 'Оригинальная матрица:\n');
    printSeparator(true);

    renderMatrices(identityMatrix, 'Обратная матрица:\n');
    printSeparator(true);

    console.log('Проверим результат, умножив исходную матрицу на обратную:');
    const resultMatrix: Matrix = [];

    for (let i = 0; i < size; i++) {
        resultMatrix[i] = [];

        for (let j = 0; j < size; j++) {
            resultMatrix[i][j] = 0;
            for (let k = 0; k < size; k++) {
                resultMatrix[i][j] += originalMatrix[i][k] * identityMatrix[k][j];
            }
        }
    }

    renderMatrices(resultMatrix, 'Результат перемножения оригинальной и обратной матрицы:\n');

    printSeparator(true);
    console.log('Выведем значение невязки (разница между единичной матрицей и результатом перемножения оригинальной и обратной матрицы):');

    const diffMatrix: Matrix = [];
    for (let i = 0; i < size; i++) {
        diffMatrix[i] = [];

        for (let j = 0; j < size; j++) {
            diffMatrix[i][j] = (i === j ? 1 : 0) - resultMatrix[i][j];
        }
    }

    renderMatrices(diffMatrix, 'Матрица невязки:\n');

    console.log('\nКонец решения.\n');
}