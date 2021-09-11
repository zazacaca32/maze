const COLUMNS_SIZE = 50 // количество колонок в лабиринте
const ROWS_SIZE = 50 // количество строк в лабиринте
const FIELD_SIZE = 7 // размер клетки в лабиринте
const PADDING = 7 // рамка (отступ внутри канваса)
// количество тракторов, которые должны быть на поле
const TRACTORS_NUMBER = 1

const canvas = document.querySelector('canvas')
const img = document.querySelector('img')
const context = canvas.getContext('2d')
const map = generatMaze(COLUMNS_SIZE, ROWS_SIZE, TRACTORS_NUMBER)

const way = getWay(map)

window.onkeydown = processKey

let playerX = 0
let playerY = 0

let isAnswer = false


init()
start()

// функция изначально регистрирует функцию tick() в requestAnimationFrame
function start () {
	// requestAnimationFrame() позволяет регистрировать функцию, которая будет вызвана перед обновлением экрана
	requestAnimationFrame(tick)

}

/*
	функция tick() принимает timestamp, потому что вызывается с помощью requestAnimationFrame
	timestamp - количество миллисекунд с момента открытия, обновления страницы
*/
function tick (time) {
	clearCanvas()
	drawMap()
	
	// Если определены начальная и конечная точки, искать путь
	if (isAnswer)
		drawWay(way)
	

	drawPlayer();

	if (playerX == ROWS_SIZE-2 && playerY == COLUMNS_SIZE-2)
		drawWin();

	requestAnimationFrame(tick)
}

// функция инициализирует стартовые данные
function init () {
	// размеры канваса
	canvas.width = PADDING * 2 + COLUMNS_SIZE * FIELD_SIZE
	canvas.height = PADDING * 2 + ROWS_SIZE * FIELD_SIZE

	/*
		по клику на лабиринт определим начальную позицию пути
		координаты стартовой позиции будут определяться совпадающими
		с координатами финишной позиции
	*/
	canvas.addEventListener('click', function (event) {
			isAnswer = !isAnswer
	})

	img.addEventListener('click', function (event) {
			location.reload();
	})
}

// функция отрисовывает карту
function drawMap () {
	for (let x = 0; x < COLUMNS_SIZE; x++) {
		for (let y = 0; y < ROWS_SIZE; y++) {
			if (getField(x, y) === 'wall') {
				context.fillStyle = 'black'
				context.beginPath()
				context.rect(PADDING + x * FIELD_SIZE, PADDING + y * FIELD_SIZE, FIELD_SIZE, FIELD_SIZE)
				context.fill()
			}
		}
	}
}

// функция рисует путь от начальной ячейки к конечной
function drawWay (way) {
	// так как каждая ячейка это по сути массив с координатами x, y,
	// то их в цикле можно сразу забрать в переменную [x, y]
	for (const [x, y] of way) {
		context.fillStyle = 'red'
		context.beginPath()
		context.rect(PADDING + x * FIELD_SIZE, PADDING + y * FIELD_SIZE, FIELD_SIZE, FIELD_SIZE)
		context.fill()
	}
}

// функция рисует игрока
function drawPlayer () {
		context.fillStyle = 'lime'
		context.beginPath()
		context.rect(PADDING + playerX * FIELD_SIZE, PADDING + playerY * FIELD_SIZE, FIELD_SIZE, FIELD_SIZE)
		context.fill()

}

// функция очищает canvas
function clearCanvas () {
	// Здесь создается рамка (черное поле, затем внутри нарисуем белое)
	// каким цветом делать заливку
	context.fillStyle = 'black'
	// создать новую элементарную геометрическую фигуру
	context.beginPath()
	// прямоугольник (верхний левый угол, ширина и высота прямоугольника)
	context.rect(0, 0, canvas.width-PADDING, canvas.height-PADDING)
	// залить фигуру выбранным для заливки цветом
	context.fill()

	// здесь создается белое поле внутри рамки
	context.fillStyle = 'white'
	context.beginPath()
	context.rect(PADDING, PADDING, canvas.width - PADDING * 2, canvas.height - PADDING * 2)
	context.fill()
}

function drawWin () {
	canvas.style.display = 'none'
	img.style.display = ''
}

// получить значение из матрицы
function getField (x, y) {
	if (x < 0 || x >= COLUMNS_SIZE || y < 0 || y >= ROWS_SIZE) {
		return null
	}

	return map[y][x]
}

// записать значение в матрицу
function setField (x, y, value) {
	if (x < 0 || x >= COLUMNS_SIZE || y < 0 || y >= ROWS_SIZE) {
		return null
	}

	map[y][x] = value
}

function processKey(e) {
	var _playerX = playerX;
	var _playerY = playerY;
  // Если нажата стрелка вверх, начинаем двигаться вверх
  if (e.keyCode == 38) { //Arrow Up
    _playerY -= 1;
  }

  // Если нажата стрелка вниз, начинаем двигаться вниз
  if (e.keyCode == 40) { // Arrow Down
    _playerY += 1;
  }

  // Если нажата стрелка влево, начинаем двигаться влево
  if (e.keyCode == 37) { // Arrow Left
    _playerX -= 1;
  }

  // Если нажата стрелка вправо, начинаем двигаться вправо
  if (e.keyCode == 39) { // Arrow Right
    _playerX += 1;
  }

  if (getField(_playerX, _playerY) === 'space') { 
  	playerX = _playerX;
	playerY = _playerY;
  }
}
