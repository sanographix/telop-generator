// フレーズ1のテロップ
var jimakuText = document.querySelectorAll('.js-jimaku-text');
// フレーズ2のテロップ
var jimakuTextSecondary = document.querySelectorAll('.js-jimaku-text-secondary');

// 最初にテロップに入れておく文言
for (i = 0; i < jimakuText.length; i++) {
    jimakuText[i].innerText = "　ファッキン ホット　";
    jimakuText[i].textContent = "　ファッキン ホット　";
}
for(i = 0; i < jimakuTextSecondary.length; i++) {
    jimakuTextSecondary[i].innerText = "　（くそ暑い）　";
    jimakuTextSecondary[i].textContent = "　（くそ暑い）　";
}

// 画像をローカルから挿入する関数
function jimakuImageInsert(evt) {
    var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
            console.log("画像以外が添付されている");
            continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                var data = e.target.result;
                // JPEGの場合には、EXIFからOrientation（回転）情報を取得
                if (data.split(',')[0].match('jpeg')) {
                    orientation = getOrientation(data);
                }
                // JPEG以外や、JPEGでもEXIFが無い場合などには、標準の値に設定
                orientation = orientation || 1;
                console.log("画像の向きは" + orientation);
                var jimakuBackground = document.querySelector('.js-jimaku-content-background');
                // 既に方向を表すclassが含まれていたら消す（3番目にくるclassを消す）
                jimakuBackground.classList.remove(jimakuBackground.classList[2]);
                // 新たに方向を表すclassを追加する
                jimakuBackground.classList.add("orientation-"+orientation);

                document.getElementById('jimaku-content-background').style.backgroundImage= 'url(' + data + ')';
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}
// 画像を挿入したらjimakuImageInsertを実行する
document.getElementById('jimaku-image-input').addEventListener('change', jimakuImageInsert, false);

// サンプル画像から画像をランダムで挿入
var bgRandomBtn = document.getElementById('bg-random-btn');
bgRandomBtn.addEventListener("click", function() {
    var bgList = [
        "images/DSC_1.jpg",
        "images/DSC_2.jpg",
        "images/DSC_3.jpg",
        "images/DSC_4.jpg",
        "images/DSC_5.jpg",
        "images/DSC_6.jpg",
        "images/DSC_7.jpg",
        "images/DSC_8.jpg",
        "images/DSC_9.jpg",
        "images/DSC_10.jpg",
        "images/DSC_11.jpg"
    ];
    var result = Math.floor(Math.random() * bgList.length);
    var bgRandom = bgList[result];
    document.getElementById('jimaku-content').style.backgroundImage='url(' + bgRandom + ')';
});

// フレーズ1と2になにか入力されたときにプレビュー画面のテキストを置き換える
document.getElementById('inputJimaku').addEventListener('input', function() {
    for (i = 0; i < jimakuText.length; i++) {
        jimakuText[i].innerText = document.jimakuForm.inputJimaku.value;
        jimakuText[i].textContent = document.jimakuForm.inputJimaku.value;
    }
});
document.getElementById('inputJimakuSecondary').addEventListener('input', function() {
    for (i = 0; i < jimakuTextSecondary.length; i++) {
        jimakuTextSecondary[i].innerText = document.jimakuForm.inputJimakuSecondary.value;
        jimakuTextSecondary[i].textContent = document.jimakuForm.inputJimakuSecondary.value;
    }
});

// チェックボックスがオンのとき文字を大きくする
document.getElementById('Checkbox1').addEventListener('change', function() {
    check1 = document.jimakuForm.Checkbox1.checked;
    if (check1 == true) {
        for (i = 0; i < jimakuText.length; i++) {
            jimakuText[i].classList.add('is-bigger');
        }
    } else {
        for (i = 0; i < jimakuText.length; i++) {
            jimakuText[i].classList.remove('is-bigger');
        }
    };
});
document.getElementById('Checkbox2').addEventListener('change', function() {
    check2 = document.jimakuForm.Checkbox2.checked;
    if (check2 == true) {
        for(i = 0; i < jimakuTextSecondary.length; i++) {
            jimakuTextSecondary[i].classList.add('is-bigger');
        }
    } else {
        for(i = 0; i < jimakuTextSecondary.length; i++) {
            jimakuTextSecondary[i].classList.remove('is-bigger');
        }
    };
});

// 画像をcanvasで生成する
document.getElementById("btn").addEventListener("click", function() {
    // 画像ダウンロードする欄を表示する
    var jimakuDownload = document.getElementById("jimaku-download");
    jimakuDownload.classList.add('is-active');

    // canvasに画像を生成
    html2canvas(document.getElementById('jimaku-content'),{
        onrendered: function(canvas){
            document.getElementById("ss").src = canvas.toDataURL("image/png");
        }
    });
});


// 画像の向きを取得する
function getOrientation(imgDataURL){
    var byteString = atob(imgDataURL.split(',')[1]);
    var orientaion = byteStringToOrientation(byteString);
    return orientaion;

    function byteStringToOrientation(img){
        var head = 0;
        var orientation;
        while (1){
            if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 218) {break;}
            if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 216) {
                head += 2;
            }
            else {
                var length = img.charCodeAt(head + 2) * 256 + img.charCodeAt(head + 3);
                var endPoint = head + length + 2;
                if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 225) {
                    var segment = img.slice(head, endPoint);
                    var bigEndian = segment.charCodeAt(10) == 77;
                    if (bigEndian) {
                        var count = segment.charCodeAt(18) * 256 + segment.charCodeAt(19);
                    } else {
                        var count = segment.charCodeAt(18) + segment.charCodeAt(19) * 256;
                    }
                    for (i=0;i<count;i++){
                        var field = segment.slice(20 + 12 * i, 32 + 12 * i);
                        if ((bigEndian && field.charCodeAt(1) == 18) || (!bigEndian && field.charCodeAt(0) == 18)) {
                            orientation = bigEndian ? field.charCodeAt(9) : field.charCodeAt(8);
                        }
                    }
                    break;
                }
                head = endPoint;
            }
            if (head > img.length){break;}
        }
        return orientation;
    }
}