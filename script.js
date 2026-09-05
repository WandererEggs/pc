// Часы и дата
function updateClockAndDate() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    document.getElementById("clock").textContent = h + ":" + m;
    document.getElementById("date").textContent = `${day}.${month}.${year}`;
}
setInterval(updateClockAndDate, 1000);
updateClockAndDate();

// Почта
const mailBtn = document.getElementById('mail-btn');
const mailWindow = document.getElementById('mail-window');
const closeMail = document.getElementById('close-mail');
mailBtn.addEventListener('click', () => { 
    mailWindow.style.display='flex'; 
});
closeMail.addEventListener('click', () => mailWindow.style.display='none');

// Drag & Drop окна
let isDragging = false, offsetX = 0, offsetY = 0;
const header = mailWindow.querySelector('.window-header');

header.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = mailWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    mailWindow.style.zIndex = 100;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        mailWindow.style.left = (e.clientX - offsetX) + 'px';
        mailWindow.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    mailWindow.style.zIndex = 10;
});

// Выделение рабочего стола
const desktop = document.getElementById('desktop');
let startX = 0, startY = 0, selecting = false;

// Создаём selection-box
let selectionBox = document.getElementById('selection-box');
if (!selectionBox) {
    selectionBox = document.createElement('div');
    selectionBox.id = 'selection-box';
    selectionBox.style.position = 'absolute';
    selectionBox.style.border = '1px dashed #fff';
    selectionBox.style.background = 'rgba(0,120,215,0.3)';
    selectionBox.style.display = 'none';
    selectionBox.style.zIndex = 50;
    desktop.appendChild(selectionBox);
}

desktop.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('icon') || e.target.closest('.window')) return;

    selecting = true;
    const rect = desktop.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';

    document.querySelectorAll('.icon').forEach(icon => icon.classList.remove('selected'));
});

desktop.addEventListener('mousemove', (e) => {
    if (!selecting) return;

    const rect = desktop.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = Math.min(startX, mouseX);
    const y = Math.min(startY, mouseY);
    const w = Math.abs(mouseX - startX);
    const h = Math.abs(mouseY - startY);

    selectionBox.style.left = x + 'px';
    selectionBox.style.top = y + 'px';
    selectionBox.style.width = w + 'px';
    selectionBox.style.height = h + 'px';

    document.querySelectorAll('.icon').forEach(icon => {
        const iconRect = icon.getBoundingClientRect();
        const iconX = iconRect.left - rect.left;
        const iconY = iconRect.top - rect.top;

        if (iconX + iconRect.width > x && iconX < x + w &&
            iconY + iconRect.height > y && iconY < y + h) {
            icon.classList.add('selected');
        } else {
            icon.classList.remove('selected');
        }
    });
});

document.addEventListener('mouseup', () => {
    if (selecting) selectionBox.style.display = 'none';
    selecting = false;
});

// Валентинка — клик работает
const valentinkaItem = document.getElementById('valentinka-item');
const valentinkaView = document.getElementById('valentinka-view');

if (valentinkaItem && valentinkaView) {
    valentinkaItem.onclick = () => {
        valentinkaView.style.display = 'block';
    };
}

// "Мой Компьютер" — уведомление об обновлении Windows
const computerIcon = document.getElementById('icon-computer');
const computerNotif = document.getElementById('computer-notif');
const updateWindow = document.getElementById('update-window');
const updateYes = document.getElementById('update-yes');
const updateNo = document.getElementById('update-no');

const updateLoading = document.getElementById('update-loading');
const updateLog = document.getElementById('update-log');
const updateSubstatus = document.getElementById('update-substatus');
const updateBarFill = document.getElementById('update-bar-fill');
const restartBtn = document.getElementById('restart-btn');

if (computerIcon) {
    computerIcon.addEventListener('click', () => {
        updateWindow.style.display = 'flex';
        if (computerNotif) computerNotif.style.display = 'none';
    });
}

if (updateNo) {
    updateNo.addEventListener('click', () => {
        updateWindow.style.display = 'none';
    });
}

if (updateYes) {
    updateYes.addEventListener('click', () => {
        updateWindow.style.display = 'none';

        // Сброс состояния экрана загрузки
        restartBtn.style.display = 'none';
        updateSubstatus.style.display = 'block';
        updateSubstatus.textContent = 'Не выключайте компьютер';
        updateLog.innerHTML = '';
        if (updateBarFill) updateBarFill.style.width = '0%';
        updateLoading.style.display = 'flex';

        const lines = [
            'Поиск обновлений......................... OK',
            'Загрузка пакета обновления 1 из 3......... OK',
            'Установка обновления 1 из 3............... OK',
            'Загрузка пакета обновления 2 из 3......... OK',
            'Установка обновления 2 из 3............... OK',
            'Загрузка пакета обновления 3 из 3......... OK',
            'Установка обновления 3 из 3............... OK',
            'Завершение установки...................... OK',
        ];

        let i = 0;
        function printLine() {
            if (i < lines.length) {
                const div = document.createElement('div');
                div.innerHTML = lines[i].replace('OK', '<span class="ok">OK</span>');
                updateLog.appendChild(div);
                i++;
                if (updateBarFill) updateBarFill.style.width = Math.round((i / lines.length) * 100) + '%';
                setTimeout(printLine, 350 + Math.random() * 250);
            } else {
                setTimeout(finishUpdate, 500);
            }
        }

        function finishUpdate() {
            updateSubstatus.style.display = 'none';
            const div = document.createElement('div');
            div.style.marginTop = '10px';
            div.textContent = 'Обновления успешно установлены';
            updateLog.appendChild(div);
            restartBtn.style.display = 'inline-block';
        }

        printLine();
    });
}

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        restartBtn.style.display = 'none';
        const shutdownLine = document.createElement('div');
        shutdownLine.style.marginTop = '10px';
        shutdownLine.textContent = 'Завершение работы...';
        updateLog.appendChild(shutdownLine);
        updateLoading.style.background = '#000000';
        setTimeout(() => {
            // ЗАМЕНИТЬ ссылку ниже на нужный сайт
            window.location.href = 'https://www.youtube.com';
        }, 1200);
    });
}
