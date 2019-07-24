// ==UserScript==
// @name         Atcoder__
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       nullnull
// @match        https://atcoder.jp
// @require      https://cdn.rawgit.com/jaredreich/notie.js/a9e4afbeea979c0e6ee50aaf5cb4ee80e65d225d/notie.js
// ==/UserScript==

(async function () {
    //お気に入りリストを取得
    let favList = JSON.parse(localStorage.fav);

    //レートを色に変換するリスト
    let color = ['灰', '茶', '緑', '水', '青', '黄', '橙', '赤', '自由'];

    //直近のコンテスト
    const latestContestScreenName = getLatestContestScreenName();
    //直近コンテストの結果一覧
    const latestContestResult = await getContestResultData(latestContestScreenName);

    //直近コンテストの結果一覧を辞書型に変換
    let contestResultDic = {};
    latestContestResult.forEach(res => contestResultDic[res.UserScreenName] = res);

    let string = ""; //通知用string
    //favlistのそれぞれの要素からstringを返すようにして、それをjoin
    string = favList.map(username => {
        //個人の結果
        const result = contestResultDic[username];

        //個人の結果がない場合だめ
        if (!result) return "";

        //Rateを取得し、色に変換する
        const preRate = getColorIndex(result.OldRating);
        const nowRate = getColorIndex(result.NewRating);

        //前の色よりも今の色のほうが高くない場合だめ
        if (preRate >= nowRate) return "";

        //繋げる文字列を返す
        return `${E(username)}さんのレートが${color[nowRate]}色に変わりました！<br>`;
    }).join("");

    notie.alert(3, string, 20); //20秒後、またはクリックで消える
})();

//Rateを色に変換する
function getColorIndex(rate){
    return Math.min(8, Math.floor(rate / 400));
}

function getLatestContestScreenName() {
    //TODO:URLのabc123みたいな奴をとってくる
    return "agc036";
}

async function getContestResultData(contestScreenName) {
    return await $.ajax(`https://atcoder.jp/contests/${contestScreenName}/results/json`);
}

