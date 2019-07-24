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

    let string = ""; //通知用string
    favList.forEach(async username => {
        const ratedHistoryData = (await getHistoryData(username)).filter(x => x.IsRated);
        if (ratedHistoryData.length === 0) return;

        const latestHistory = ratedHistoryData.pop();
        console.log(latestHistory);
        if (latestHistory.ContestScreenName.split('.')[0] !== latestContestScreenName) return;

        let preRate = latestHistory.OldRating;
        let nowRate = latestHistory.NewRating;

        //Rateを色に変換する
        preRate = Math.min(8, Math.floor(preRate / 400));
        nowRate = Math.min(8, Math.floor(nowRate / 400));

        //前の色よりも今の色のほうが高い場合通知。
        if (preRate < nowRate) {
            string += username + 'さんのレートが' + color[nowRate] + '色に変わりました！<br>';
        }
    });

    notie.alert(3, string, 20); //20秒後、またはクリックで消える
})();

function getLatestContestScreenName() {
    //TODO:URLのabc123みたいな奴をとってくる
    return "agc036";
}

async function getHistoryData(userScreenName) {
    return await $.ajax(`https://atcoder.jp/users/${userScreenName}/history/json`)
}

