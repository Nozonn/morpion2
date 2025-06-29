`

document.getElementById('settings-close').addEventListener('click', () => {
      settingsContainer.style.display = 'none';
      window.location.href = '/';
    });
    
`

const updateInputs = () => {
  player1name.value = localStorage.getItem('player1Name') || '';
  player2name.value = localStorage.getItem('player2Name') || '';
  boardSizeInput.value = localStorage.getItem('boardSize') || 3;
}

const showSettingsContainer = () => {
  settingsContainer.classList.add('visible');
  updateInputs();
  settingsButton.parentNode.classList.add('activeButtons');
  settingsButton.onclick = hideSettingsContainer;
}

const hideSettingsContainer = () => {
  settingsContainer.classList.remove('visible');
  settingsButton.parentNode.classList.remove('activeButtons');
  settingsButton.onclick = showSettingsContainer;

}

const saveSettings = () => {
  const name1 = player1name.value.trim();
  const name2 = player2name.value.trim();
  const boardSize = parseInt(boardSizeInput.value, 10);

  if (name1 && name2 && boardSize >= 3 && boardSize <= 10) {
    localStorage.setItem('player1Name', name1);
    localStorage.setItem('player2Name', name2);
    localStorage.setItem('boardSize', boardSize);
    hideSettingsContainer();
    loaded(null);
    // window.location.href = '/';
  } else {
    alert('Please fill in all fields correctly.');
  }
}

const resetScore = () => {
  localStorage.setItem('player1Score', '0');
  localStorage.setItem('player2Score', '0');
  document.getElementById('player1-score').textContent = '0';
  document.getElementById('player2-score').textContent = '0';
}



const settingsButton = document.getElementById('settings');
const settingsContainer = document.getElementById('settings-container');

const player1name = document.getElementById('player1-name');
const player2name = document.getElementById('player2-name');
const boardSizeInput = document.getElementById('board-size');
