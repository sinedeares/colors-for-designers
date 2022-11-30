const columns = document.querySelectorAll('.column');
const colorParts = "0123456789ABCDEF";

//флаг-показатель закрытости
let isColumnLocked = {
    isLocked: false,
};

let setUrlSearchParams = (columnId, color) => {
    let currentUrl = new URL(window.location);
    currentUrl.searchParams.set(columnId, color);
    history.replaceState(null, null, currentUrl);
}

let getUrlSearchParams = () => {
    return new URL(window.location).searchParams;
}

let generateColor = () => {
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += colorParts[Math.floor(Math.random() * colorParts.length)];
    }
    return color;
};


let hashCopy = async (target) => {
    const colorId = target.querySelector('.color-id');
    console.log(colorId);
    await window.navigator.clipboard.writeText(colorId.value);
}

let setBackgroundColor = (target, color, colorId) => {
    target.style.backgroundColor = color;
    colorId.value = color;
}

let setTextColor = (color, colorId, lockedColor) => {
    const hsl = rgb2hsl(color);
    if (
        (hsl[0] < 0.55 && hsl[2] >= 0.5) ||
        (hsl[0] >= 0.55 && hsl[2] >= 0.75)
    ) {
        colorId.style.color = "#000000";
        lockedColor.style.fill = "#000000";
    } else {
        colorId.style.color = "#FFFFFF";
        lockedColor.style.fill = "#FFFFFF";
    }
};

let onLoad = () => {
    for(let [loadColumn, loadColor] of getUrlSearchParams()) {
        let target = document.getElementById(loadColumn);
        changeColor(target, loadColumn, loadColor)
    }
}
let changeColor = (target = event.target, loadColumn = null, loadColor = null) => {
    const lockedColor = target.querySelector('.color-locked');
    const colorId = target.querySelector('.color-id');
    const svgLocked = target.querySelector('.svg-locked');
    const svgUnlocked = target.querySelector('.svg-unlocked');

    console.log(loadColumn)
    if (!isColumnLocked.isLocked && loadColumn === null) {
        console.log(loadColumn)
        let color = generateColor();
        setUrlSearchParams(target.id, color)
        setBackgroundColor(target, color, colorId);
        setTextColor(color, colorId, lockedColor);
    }
    if(loadColumn !== null) {
        setBackgroundColor(target, loadColor, colorId);
        setTextColor(loadColor, colorId, lockedColor);
    }

};

columns.forEach((column) => {
    const lockedColor = column.querySelector('.color-locked');
    const svgLocked = column.querySelector('.svg-locked');
    const svgUnlocked = column.querySelector('.svg-unlocked');
    let locked = false;

    //смена цвета по нажатию на пробел
    window.addEventListener('keydown', function (event) {
        if (event.code === 'Space' && !locked) {
                changeColor(column);
        }
    });

    lockedColor.addEventListener("click", (event) => {
        //для остановки дальнейших событий
        locked = !locked;
        svgUnlocked.classList.toggle('color-svg-show');
        svgLocked.classList.toggle('color-svg-show');
        event.stopPropagation();
    });

    column.addEventListener("click", async (event) => {
        console.log(event.target);
        if (!locked) changeColor();

        if (locked) await hashCopy(event.target);
    });
});



function rgb2hsl(HTMLcolor) {
    let r = parseInt(HTMLcolor.substring(1, 3), 16) / 255;
    let g = parseInt(HTMLcolor.substring(3, 5), 16) / 255;
    let b = parseInt(HTMLcolor.substring(5, 7), 16) / 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l]; // H - цветовой тон, S - насыщенность, L - светлота
}


onLoad();



