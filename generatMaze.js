// функция построит лабиринт (процесс построения на экране виден не будет)
class generatMaze  {
	constructor(columnsNumber, rowsNumber, tractorsNumber = 1){
		this.columnsNumber = columnsNumber
		this.rowsNumber = rowsNumber
		this.tractorsNumber = tractorsNumber
	this.map = []
	// Тракторы, которые будут очищать дорожки в лабиринте
	this.tractors = []

	for (let y = 0; y < rowsNumber; y++) {
		const row = []

		for (let x = 0; x < columnsNumber; x++) {
			row.push('wall')
		}

		this.map.push(row)
	}

	const startX = this.getRandomFrom(Array(columnsNumber).fill(0).map((item, index) => index).filter(x => this.isEven(x)))
	const startY = this.getRandomFrom(Array(rowsNumber).fill(0).map((item, index) => index).filter(x => this.isEven(x)))

	// создаем тракторы
	for (let i = 0; i < tractorsNumber; i++) {
		this.tractors.push({ x: startX, y: startY })
	}

	// сделаем ячейку, в которой изначально стоит трактор, пустой
	this.setField(startX, startY, 'space')

	// если лабиринт ещё не готов, рисовать трактор и регистрировать функцию tick() ещё раз
	while (!this.isMaze()) {
		this.moveTractors()
	}

	return this.map
}

	// получить значение из матрицы
	 getField (x, y) {
		if (x < 0 || x >= this.columnsNumber || y < 0 || y >= this.rowsNumber) {
			return null
		}

		return this.map[y][x]
	}

	// записать значение в матрицу
	 setField (x, y, value) {
		if (x < 0 || x >= this.columnsNumber || y < 0 || y >= this.rowsNumber) {
			return null
		}

		this.map[y][x] = value
	}

	// функция возвращает случайный элемент из переданного ей массива
	 getRandomFrom (array) {
		// получаем случайным образом индекс элемента массива
		// число будет в диапазоне от 0 до количества элементов в массиве - 1
		const index = Math.floor(Math.random() * array.length)
		// возвращаем элемент массива с полученным случайным индексом
		return array[index]
	}

	/*
		функция проверяет четное число или нет
		если возвращает true - четное
	*/
	 isEven (n) {
		return n % 2 === 0
	}

	// функция проверяет, готов лабиринт или ещё нет
	// возвращает true, если лабиринт готов, false если ещё нет
	 isMaze () {
		for (let x = 0; x < this.columnsNumber; x++) {
			for (let y = 0; y < this.rowsNumber; y++) {
				if (this.isEven(x) && this.isEven(y) && this.getField(x, y) === 'wall') {
					return false
				}
			}
		}

		return true
	}

	/*
		функция заставляет трактора двигаться
		трактор должен двигаться на 2 клетки
		если вторая клетка со стеной, то нужно очистить первую и вторую
	*/
	 moveTractors () {
		for (const tractor of this.tractors) {
			// массив с возможными направлениями трактора
			const directs = []

			if (tractor.x > 0) {
				directs.push('left')
			}

			if (tractor.x < this.columnsNumber - 2) {
				directs.push('right')
			}

			if (tractor.y > 0) {
				directs.push('up')
			}

			if (tractor.y < this.rowsNumber - 2) {
				directs.push('down')
			}

			// случайным образом выбрать направление, в котором можно пойти
			const direct = this.getRandomFrom(directs)

			switch (direct) {
				case 'left':
					if (this.getField(tractor.x - 2, tractor.y) === 'wall') {
						this.setField(tractor.x - 1, tractor.y, 'space')
						this.setField(tractor.x - 2, tractor.y, 'space')
					}
					tractor.x -= 2
					break
				case 'right':
					if (this.getField(tractor.x + 2, tractor.y) === 'wall') {
						this.setField(tractor.x + 1, tractor.y, 'space')
						this.setField(tractor.x + 2, tractor.y, 'space')
					}
					tractor.x += 2
					break
				case 'up':
					if (this.getField(tractor.x, tractor.y - 2) === 'wall') {
						this.setField(tractor.x, tractor.y - 1, 'space')
						this.setField(tractor.x, tractor.y - 2, 'space')
					}
					tractor.y -= 2
					break
				case 'down':
					if (this.getField(tractor.x, tractor.y + 2) === 'wall') {
						this.setField(tractor.x, tractor.y + 1, 'space')
						this.setField(tractor.x, tractor.y + 2, 'space')
					}
					tractor.y += 2
					break
			}
		}
	}
}