class Player {
	constructor() { 
	this.x = 0
	this.y = 0
	this.health = 100;
	}

	processKey(e) {
		console.log(this)
	var _playerX = this.x;
	var _playerY = this.y;
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
  	this.x = _playerX;
	this.y = _playerY;
  }
}
}