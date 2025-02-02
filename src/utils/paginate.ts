/**
 * Делит массив на меньшие массивы (страницы) заданного размера.
 *
 * @template T - Тип элементов в массиве.
 * @param {T[]} arr - Массив, который нужно разделить на страницы.
 * @param {number} startIndex - Индекс, с которого начинается пагинация.
 * @param {number} pageSize - Размер каждой страницы.
 * @returns {T[][]} - Массив массивов, где каждый подмассив является страницей заданного размера.
 */
export function paginate<T>(arr: T[], startIndex: number, pageSize: number): T[][] {
  return arr.slice(startIndex).reduce((acc, item, index) => {
    // Начинаем новую страницу, когда индекс кратен размеру страницы
    if (index % pageSize === 0) {
      // Создаем новый подмассив (страницу)
      acc.push([])
    }

    // Добавляем текущий элемент на последнюю страницу
    acc[acc.length - 1].push(item)
    return acc
  }, [] as T[][]) // Инициализируем аккумулятор как пустой массив массивов
}
