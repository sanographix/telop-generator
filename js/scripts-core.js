/*!
https://github.com/sanographix/telop-generator
Licensed under MIT license
https://github.com/sanographix/telop-generator/blob/gh-pages/LICENSE.md
*/

// フレーズ1のテロップ
var jimakuText = document.querySelectorAll('.js-jimaku-text');
// フレーズ2のテロップ
var jimakuTextSecondary = document.querySelectorAll('.js-jimaku-text-secondary');
// 背景画像
var jimakuBackground = document.querySelector('.js-jimaku-content-background');
var jimakuTextarea = document.getElementById("jimaku-textarea");

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
                jimakuBackground.style.backgroundImage= 'url(' + data + ')';
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}
// 画像を挿入したらjimakuImageInsertを実行する
document.getElementById('jimaku-image-input').addEventListener('change', jimakuImageInsert, false);

document.getElementById('jimaku-image-input').addEventListener('change', function(e) {
    EXIF.getData(e.target.files[0], function() {
        var orientaion = EXIF.getTag(this, "Orientation");
        // 画像の向きが定義されてなかったら1にする
        if (orientaion == null) {
          orientaion = 1;
        }
        console.log("画像の向きは" + orientaion);
        // 既に方向を表すclassが含まれていたら消す（3番目にくるclassを消す）
        jimakuBackground.classList.remove(jimakuBackground.classList[2]);
        // 既に方向を表すclassが含まれていたら消す（3番目にくるclassを消す）
        jimakuBackground.classList.add("orientation-" + orientaion);
    });
});

// サンプル画像から画像をランダムで挿入
var bgRandomBtn = document.getElementById('bg-random-btn');
bgRandomBtn.addEventListener("click", function() {
    // 既に方向を表すclassが含まれていたら消す（3番目にくるclassを消す）
    jimakuBackground.classList.remove(jimakuBackground.classList[2]);
    // 画像リスト
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
    jimakuBackground.style.backgroundImage='url(' + bgRandom + ')';
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
    // ツイート用の文言を置き換える
    jimakuTextarea.innerText = "「" + document.jimakuForm.inputJimaku.value + document.jimakuForm.inputJimakuSecondary.value + "」 #テロップ作成君 http://sanographix.github.io/telop-generator/ ";
    jimakuTextarea.textContent = "「" + document.jimakuForm.inputJimaku.value + document.jimakuForm.inputJimakuSecondary.value + "」 #テロップ作成君 http://sanographix.github.io/telop-generator/ ";
});
