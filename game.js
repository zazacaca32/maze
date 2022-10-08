const COLUMNS_SIZE = 50 // количество колонок в лабиринте
const ROWS_SIZE = 50 // количество строк в лабиринте
const FIELD_SIZE = 10 // размер клетки в лабиринте
const PADDING = 10 // рамка (отступ внутри канваса)
// количество тракторов, которые должны быть на поле
const TRACTORS_NUMBER = 1

const ENEMYS = 4
let ENEMYS_ARR = []

const canvas = document.querySelector('canvas')
const healthText = document.querySelector('#health')
const playerhealthBar = document.querySelector('#playerhealth')
const img = document.querySelector('#win')
const img_end = document.querySelector('#end')
const prbar = document.querySelector('#prbar')
const end_text = document.querySelector('#end_text')
const context = canvas.getContext('2d')
const map = new generatMaze(COLUMNS_SIZE, ROWS_SIZE, TRACTORS_NUMBER)
var player = new Player();



window.onkeydown = function (e){player.processKey(e)}



let isAnswer = false

let isGameEnd = false

let tmpTime = 0;


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
	if (isGameEnd) return;
	clearCanvas()
	drawMap()
	
	if (isAnswer){
		var way = getWay(map, {x: player.x, y: player.y})
		drawWay(way)
	}
	

	drawPlayer();
	if (player.health >= 0)
	drawHealth();

	for (var i = 0; i < ENEMYS_ARR.length; i++) {
		drawEnemy(ENEMYS_ARR[i].x, ENEMYS_ARR[i].y);
	}

	if (player.x == ROWS_SIZE-2 && player.y == COLUMNS_SIZE-2)
		drawWin();

	if (player.health < 0) 
		drawLose();
	
	if (time > tmpTime){
		for (var i = 0; i < ENEMYS_ARR.length; i++) {
		runEnemy(i);
	}
		tmpTime = time+500;
	}

	requestAnimationFrame(tick)
}

// функция инициализирует стартовые данные
function init () {
	// размеры канваса
	canvas.width = PADDING * 2 + COLUMNS_SIZE * FIELD_SIZE
	canvas.height = PADDING * 2 + ROWS_SIZE * FIELD_SIZE

	while (ENEMYS_ARR.length != ENEMYS) {
		var x = getRandomInt(5, COLUMNS_SIZE);
		var y = getRandomInt(5, ROWS_SIZE)
		console.log(x,y,ENEMYS_ARR.length , ENEMYS)
		if (getField(x, y) === 'space') 
			ENEMYS_ARR.push({x: x, y: y})
	}

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
		context.fillStyle = 'yellow'
		context.beginPath()
		context.rect(PADDING + x * FIELD_SIZE, PADDING + y * FIELD_SIZE, FIELD_SIZE, FIELD_SIZE)
		context.fill()
	}
}

// функция рисует игрока
function drawPlayer () {
		context.fillStyle = 'lime'
		context.beginPath()
		context.rect(PADDING + player.x * FIELD_SIZE, PADDING + player.y * FIELD_SIZE, FIELD_SIZE, FIELD_SIZE)
		context.fill()

}

function drawEnemy (x, y) {
		context.fillStyle = 'red'
		context.beginPath()
		context.rect(PADDING + x * FIELD_SIZE, PADDING + y * FIELD_SIZE, FIELD_SIZE, FIELD_SIZE)
		context.fill()

}

function runEnemy (id) {
		if (ENEMYS_ARR[id].x == player.x && ENEMYS_ARR[id].y == player.y) {
			player.health -= 10;
			return;
		}
		var enemyWay = getWay(map, {x: ENEMYS_ARR[id].x, y: ENEMYS_ARR[id].y}, {x: player.x, y: player.y});
		ENEMYS_ARR[id].x = enemyWay[enemyWay.length-2][0]
		ENEMYS_ARR[id].y = enemyWay[enemyWay.length-2][1]
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
	end_text.style.display = ''
	prbar.style.display = 'none'
	isGameEnd = true;
}

function drawHealth() {
	healthText.innerText = player.health+"%";
	playerhealthBar.value = player.health;
}


function drawLose () {
	canvas.style.display = 'none'
	img_end.style.display = ''
	end_text.style.display = ''
	isGameEnd = true;
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



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}