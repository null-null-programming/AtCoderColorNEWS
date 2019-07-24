// ==UserScript==
// @name         Atcoder__
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       nullnull
// @match        https://atcoder.jp
// @require      https://cdn.rawgit.com/jaredreich/notie.js/a9e4afbeea979c0e6ee50aaf5cb4ee80e65d225d/notie.js
// ==/UserScript==

(function () {
    //お気に入りリストを取得
    let favList = JSON.parse(localStorage.fav);

    //レートを色に変換するリスト
    let color = ['灰', '茶', '緑', '水', '青', '黄', '橙', '赤', '自由'];

    let string = ""; //通知用string
    for (let i = 0; i < favList.length; i++) {
        //favList[i]:=お気に入りの人のusername

        let preRate = 1000;
        let nowRate = 2500;
        let joinFlag = true;
        /*
            TODO:
            ・前回のコンテストのレートpreRateと今回のコンテストのレートnowRateを取得する
            ・今回のコンテストに参加していない場合joinFlagをfalseにする
        */

        //参加していないのでcontinue
        if (!joinFlag) continue;

        //Rateを色に変換する
        preRate = Math.min(8, Math.floor(preRate / 400));
        nowRate = Math.min(8, Math.floor(nowRate / 400));

        //前の色よりも今の色のほうが高い場合通知。
        if (preRate < nowRate) {
            string += favList[i] + 'さんのレートが' + color[nowRate] + '色に変わりました！<br>';
        }
    }

    notie.alert(3, string, 20); //20秒後、またはクリックで消える
})();
