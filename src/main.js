const simplifyUrl = (url) => {
    return url.replace('https://', '')
      .replace('http://', '')
      .replace('www.', '')
      .replace(/\/.*/, '') // 正则表达式：删除 / 开头的所有内容
}

const xString = localStorage.getItem('myLovingSite');
const xObject = JSON.parse(xString);
// let iosAdd = document.getElementsByClassName("globalMain")[0];

let currentWeb = xObject || [
    {logo: 'B', url: 'https://www.baidu.com/'},
    {logo: 'W', url: 'https://www.w3.org/'}
  ]

const render = () => {
    $(`.siteList`).find(`li:not(.lastLi)`).remove();//每次执行渲染函数前先清空除了添加按钮外的所有网站
    currentWeb.forEach(function (node, index) {
            $(`
        <li>
            <div class="site" title="${simplifyUrl(node.url)}">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class="delete">
                    <svg class="icon">
                        <use xlink:href="#icon-delete"></use>
                    </svg>
                </div>
            </div>
        </li>
        `).insertBefore(`.lastLi`)
                .on('click', () => { window.open(node.url); })
                .on('click', '.delete', (e) => {
                    e.stopPropagation(); //阻止冒泡以防点击delete父元素的时候也被监听到该事件
                    currentWeb.splice(index, 1); //用户点击delete后，用Array的splice方法删除该网页
                    render(); //每删除一个网页就得重新渲染整个网页
                });

        })
}

render();

$('.addButton').on('click', () => {
    
    let url = window.prompt('新增导航网址:');
    if (url.indexOf('http') !== 0) {
      url = 'https://' + url
    }
    console.log(url)
    currentWeb.push({
        logo: simplifyUrl(url)[0].toUpperCase(),//我们取新增网站的logo为用户输入url经过simplify之后的第一个字母（大写）
        url: url
    });
    render();
})



//监听"窗口即将被关闭"事件
window.onbeforeunload = () => {
    const string = JSON.stringify(currentWeb);
    localStorage.setItem('myLovingSite', string);
  }
  
/*debug疑点其一：该语句运行以后在PC窗口有作用，在移动端无效：
    document.getElementsByClassName("text")[0].remove();
*这个现象使得“无法监听移动端的touchstart事件”直接多出了很多种可能，毕竟一个简单的remove函数在PC和移动端生效结果都不同*/

//   document.getElementsByClassName("addButton")[0].ontouchstart = () => {
//     console.log("i am in IOS now")
//     let url = window.prompt('新增导航网址:');
//     if (url.indexOf('http') !== 0) {
//       url = 'https://' + url
//     }
//     console.log(url)
//     currentWeb.push({
//         logo: simplifyUrl(url)[0].toUpperCase(),//我们取新增网站的logo为用户输入url经过simplify之后的第一个字母（大写）
//         url: url
//     });
//     render();
// }