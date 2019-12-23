/*!
 * cShare.js v1.0.0 (2019-12-20)
 *
 * link https://share.caohongyuan.cn/
 * auther https://caohongyuan.cn/
 */
(function (window, document) {
    "use strict";

    var image = (document.images[0] || 0).src || '';
    var site = getShareData('site') || getShareData('Site') || document.title;
    var title = getShareData('title') || getShareData('Title') || document.title;
    var description = getShareData('description') || getShareData('Description') || '';
    var defaults = {
        site: site,
        url: document.URL,
        origin: document.location.origin,
        title: title,
        description: description,
        image: image,
        source: document.location.origin,
    };

    function getShareData(name) {
        return (document.getElementsByName(name)[0] || 0).content;
    }

    var defaultNetworkName = ['qzone', 'qq', 'weibo', 'douban', 'linkedin', 'facebook', 'twitter', 'google'];
    var defaultNetworks = {
        qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}&pics={{IMAGE}}',
        qq: 'http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESCRIPTION}}&pics={{IMAGE}}',
        tencent: 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}',
        weibo: 'https://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}&appkey={{WEIBOKEY}}',
        douban: 'http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}&starid=0&aid=0&style=11',
        diandian: 'http://www.diandian.com/share?lo={{URL}}&ti={{TITLE}}&type=link',
        linkedin: 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{SUMMARY}}&source={{SOURCE}}&armin=armin',
        facebook: 'https://www.facebook.com/sharer/sharer.php?u={{URL}}&title={{TITLE}}&description={{DESCRIPTION}}&caption={{SUBHEAD}}&link={{URL}}&picture={{IMAGE}}',
        twitter: 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via={{SITE_URL}}',
        google: 'https://plus.google.com/share?url={{URL}}'
    };
    var sizes = {
        mini: '20px',
        small: '24px',
        medium: '28px',
        normal: '32px',
        large: '40px',
    };

    var shareDom = document.getElementById('cshare');
    if (shareDom === undefined || shareDom === '' || shareDom === null) {
        return false;
    }

    createHtml(shareDom);

    function template(network) {
        var size = shareDom.getAttribute('size') ? shareDom.getAttribute('size') : 'normal';
        var image = document.createElement("img");
        image.setAttribute("id", network);
        image.setAttribute("onclick", 'cShare(\'' + network + '\')');
        image.setAttribute("width", sizes[size]);
        image.setAttribute("height", sizes[size]);
        image.setAttribute("src", 'https://dev.caohongyuan.cn/images/logos/' + network + '.png');
        image.setAttribute("style", 'cursor: pointer; margin: 10px;');
        return image;
    }

    function createHtml(shareDom) {
        try {
            var network = shareDom.dataset.network;
        } catch (err) {
            var network = '';
        }
        if (network === undefined || network === '') {
            var networks = defaultNetworkName;
        } else {
            var networks = network.trim().split(" ");
        }
        if (networks.length > 0) {
            for (var i = 0; i < networks.length; i++) {
                if (defaultNetworks.hasOwnProperty(networks[i])) {
                    shareDom.appendChild(template(networks[i]));
                }
            }
        }
    }

    function createUrl(network) {
        var name = network;
        var data = defaults;
        if (!data['summary']) {
            data['summary'] = data['description'];
        }
        return defaultNetworks[name].replace(/\{\{(\w)(\w*)\}\}/g, function (m, fix, key) {
            var nameKey = name + fix + key.toLowerCase();
            key = (fix + key).toLowerCase();

            return encodeURIComponent((data[nameKey] === undefined ? data[key] : data[nameKey]) || '');
        });
    }

    function share(url, title = '') {
        var iWidth = 600;
        var iHeight = 600;
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        var iLeft = (window.screen.availWidth - iWidth) / 2;
        return window.open(url, title, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
    }

    window.cShare = function (network) {
        var url = createUrl(network);
        share(createUrl(network));
    }
})(window, document);