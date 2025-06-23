import {enterMatrix, printSeparator, renderMatrix, renderTwoMatrix} from "./utils.js";

export async function revertMatrix() {
    console.log('Вычисление определителя матрицы методом Гаусса');

    let {matrixA, size} = await enterMatrix(false);

    printSeparator();

    console.log(`Демонстрация введённых данных:`);

    renderMatrix(matrixA);

    console.log('Начинаем преобразования...');

    printSeparator(true);

    console.log('Создадим единичную матрицу и отобразим единичную справа от основной::');

    const identityMatrix = Array.from({length: size}, (_, i) =>
        Array.from({length: size}, (_, j) => (i === j ? 1 : 0))
    );

    renderTwoMatrix(matrixA, identityMatrix);

    printSeparator(true);

    console.log('Пошагово приводим строки матрицы к верхне-треугольному виду.');

    printSeparator(true);

    for (let i = 0; i < size - 1; i++) {
        if (i < size - 1 && matrixA[i][i] === 0) {
            console.log(`Ведущий элемент в строке #${i + 1} равен нулю. Найдём строку ниже на замену...`);
            for (let j = i + 1; j < size; j++) {
                if (matrixA[j][i] !== 0) {
                    console.log(`Меняем строки #${i + 1} и #${j + 1} местами.`);

                    [matrixA[i], matrixA[j]] = [matrixA[j], matrixA[i]];
                    [identityMatrix[i], identityMatrix[j]] = [identityMatrix[j], identityMatrix[i]];

                    renderTwoMatrix(matrixA, identityMatrix);

                    break;
                }
            }

            if (matrixA[i][i] === 0) {
                console.log('Не удалось найти строку с ненулевым первым элементом. Прекращаем выполнение.');
                return;
            }
        }

        console.log(`Приводим элементы столбца #${i + 1} ниже строчки #${i + 1} к нулю`);

        for (let j = i + 1; j < size; j++) {
            if (matrixA[j][i] !== 0) {
                const factor = matrixA[j][i] / matrixA[i][i];

                console.log(`Умножаем строку #${i + 1} на ${factor.toFixed(2)} (${matrixA[j][i].toFixed(2)} / ${matrixA[i][i].toFixed(2)}) и вычитаем из строки #${j + 1}.`);

                for (let k = 0; k < size; k++) {
                    matrixA[j][k] -= factor * matrixA[i][k];
                    identityMatrix[j][k] -= factor * identityMatrix[i][k];
                }

                renderTwoMatrix(matrixA, identityMatrix);
            }
        }
    }

    console.log(`После приведения к верхне-треугольному виду матрица выглядит так:`);

    renderTwoMatrix(matrixA, identityMatrix);

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

        renderTwoMatrix(matrixA, identityMatrix);
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

                renderTwoMatrix(matrixA, identityMatrix);
            }
        }
    }

    console.log('\nКонец решения.\n');
}