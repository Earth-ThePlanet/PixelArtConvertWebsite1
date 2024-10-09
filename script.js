document.getElementById('upload').addEventListener('change', handleImage, false);
document.getElementById('convert').addEventListener('click', convertToPixelArt);

let img = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

function handleImage(event) {
    let reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
    }
    reader.readAsDataURL(event.target.files[0]);
}

function convertToPixelArt() {
    let pixelSize = parseInt(document.getElementById('pixelSize').value, 10);
    let width = canvas.width;
    let height = canvas.height;

    // 이미지를 픽셀 크기 단위로 샘플링
    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;

    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            // 해당 픽셀의 평균 색상을 구함
            let red = 0, green = 0, blue = 0, alpha = 0, count = 0;
            for (let dy = 0; dy < pixelSize; dy++) {
                for (let dx = 0; dx < pixelSize; dx++) {
                    let pixelX = x + dx;
                    let pixelY = y + dy;
                    if (pixelX < width && pixelY < height) {
                        let index = (pixelY * width + pixelX) * 4;
                        red += data[index];
                        green += data[index + 1];
                        blue += data[index + 2];
                        alpha += data[index + 3];
                        count++;
                    }
                }
            }
            red = Math.floor(red / count);
            green = Math.floor(green / count);
            blue = Math.floor(blue / count);
            alpha = Math.floor(alpha / count);

            // 샘플링한 픽셀 크기만큼의 영역을 해당 색상으로 채움
            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }
}
