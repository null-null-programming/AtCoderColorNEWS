// ==UserScript==
// @name         Atcoder__
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       nullnull
// @match        https://atcoder.jp
// @require      https://cdn.rawgit.com/jaredreich/notie.js/a9e4afbeea979c0e6ee50aaf5cb4ee80e65d225d/notie.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(async function () {
    //既に通知したかどうかをcookieで判定する。

    //cookieが存在するか？ 存在しない場合は今回が初使用なので通知する。
    if (document.cookie.indexOf("preContest=") >= 0) {
        //cookie_name:preContestを取得する
        let cook = document.cookie.split(';');
        
        cook.forEach(function (value) {
            //cookie名と値に分ける
            let cookie_content = value.split('=');
            
            if (cookie_content[0] === 'preContest') {
                //保存されているクッキーの名前を取得
                let cookieContestName = cookie_content[1].split(',');

                if (cookieContestName === getLatestContestScreenName()) {
                    return;//通知済み
                }

            }
        })
    }

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

    if (string.length > 0) {
        notie.alert(3, string, 20); //20秒後、またはクリックで消える
    }

    //cookieを１ヶ月保存する。今回のコンテスト名で上書きする。
    document.cookie = 'preContest=' + contestScreenName + ',max-age=60*60*24*30';
})();

//Rateを色に変換する
function getColorIndex(rate) {
    return Math.min(8, Math.floor(rate / 400));
}

function getLatestContestScreenName() {
    //HTMLの構造が変わったらバグりそう。

    //<a href="/contests/agcXXX">AtCoder Grand Contest XXX</a>
    let contestScreenName = document.getElementById("collapse-contest").getElementsByClassName("table table-default table-striped table-hover table-condensed small")[2].getElementsByTagName('small')[1].innerHTML;

    //contests/agcXXX
    contestScreenName = contestScreenName.split('"')[1];

    //agcXXX
    contestScreenName = contestScreenName.split('/').pop();

    return contestScreenName;
}

async function getContestResultData(contestScreenName) {
    return await $.ajax(`https://atcoder.jp/contests/${contestScreenName}/results/json`);
}