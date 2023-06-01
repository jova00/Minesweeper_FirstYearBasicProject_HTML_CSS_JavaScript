const $board = $('#board');
//size of table
const ROWS = 10; 
const COLS = 10;
//1. for meaking table 
function createBoard(rows, cols) {
  $board.empty();
//col and rows
  for (let i = 0; i < rows; i++) {
    const $row = $('<div>').addClass('row');
    for (let j = 0; j < cols; j++) {
      const $col = $('<div>')
        .addClass('col hidden') //hidden fields
        .attr('data-row', i) //*jqueri implementacije
        .attr('data-col', j);
      if (Math.random() < 0.1) { //new class mine
        $col.addClass('mine');
      }
      $row.append($col);
    }
    $board.append($row);
  }
}

function restart() { //restar, using createboard 
  createBoard(ROWS, COLS);
}
//3. end game 
function gameOver(isWin) { //isWin, are we win, some mess, vice versa
  let message = null;
  let icon = null;
  if (isWin) {
    message = 'HOW UNEXPECTED, YOU WIN!'; //win mess
    icon = 'fa fa-flag'; //if win flags on bombs
  } else {
    message = 'DISAPPOINTING AS USUAL, YOU LOST!'; //loss mess
    icon = 'fa fa-bomb'; //icon bomb if lose
  }
//at end show fileds with bombs  
  $('.col.mine').append(
    $('<i>').addClass(icon)
  );  
//open fields with their num  
  $('.col:not(.mine)') //hidden stuf, no bombs
    .html(function() {
      const $cell = $(this);
      const count = getMineCount(
        $cell.data('row'),
        $cell.data('col'),
      );
      return count === 0 ? '' : count; //not showing 0, shows bomb
    })
  $('.col.hidden').removeClass('hidden');
  setTimeout(function() { //restart
    alert(message); //popup mess
    restart(); //metod resstart
  }, 1000);
}
//4.showing fields
function reveal(oi, oj) {
  const seen = {};
//4.1 help func, show zero fileds
  function helper(i, j) { //floodFill
    if (i >= ROWS || j >= COLS || i < 0 || j < 0) return; 
    const key = `${i} ${j}` //location
    if (seen[key]) return; 
    const $cell = 
      $(`.col.hidden[data-row=${i}][data-col=${j}]`); 
    const mineCount = getMineCount(i, j); //counting mnies
    if (
      !$cell.hasClass('hidden') || 
      $cell.hasClass('mine')
    ) {
      return;
    }

    $cell.removeClass('hidden');
//how many mines around field
    if (mineCount) { //count
      $cell.text(mineCount); //value
      return;
    }
   
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        helper(i + di, j + dj); 
      }      
    }
  }

  helper(oi, oj); //rekurzivna funkcija
}
//5. count num of mines around fields
function getMineCount(i, j) {
  let count = 0;
  for (let di = -1; di <= 1; di++) { 
    for (let dj = -1; dj <= 1; dj++) {
      const ni = i + di;
      const nj = j + dj;     
      if (ni >= ROWS || nj >= COLS || nj < 0 || ni < 0) continue;
      const $cell =
        $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
      if ($cell.hasClass('mine')) count++; //if mine plus
    }      
  }
  return count;
}
//2. on click
$board.on('click', '.col.hidden', function() { 
  const $cell = $(this);
  const row = $cell.data('row'); //*jquery implimentacije 
  const col = $cell.data('col');
  
  if ($cell.hasClass('mine')) { //if mine, end game
    gameOver(false);
  } else { 
    reveal(row, col); //show fierlds
    const isGameOver = $('.col.hidden').length === $('.col.mine').length 
    if (isGameOver) gameOver(true); //if,ends
  }
})

restart(); //restar
