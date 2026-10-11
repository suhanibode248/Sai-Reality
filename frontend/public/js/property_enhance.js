/* Property & Project Detail Pages — Enhancement Script */
(function () {
    'use strict';

    /* ── Transparent 1px GIF for hiding broken img src ── */
    var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    /* ── Fix a single img element — gradient placeholder on every page ── */
    function fixImg(img) {
        if (img.dataset.fixed) return;
        img.dataset.fixed = '1';
        img.src = BLANK;
        img.style.objectFit = 'cover';
        img.style.background = 'linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 40%,#a5d6a7 100%)';
    }

    /* ── Check if image is broken ── */
    function isBroken(img) {
        if (!img.complete) return false;
        if (img.naturalWidth === 0) return true;
        /* If src points to backend media and 404'd, naturalWidth may be non-zero for error page */
        var src = img.src || '';
        if (src.includes('/media/dashboard/') || src.includes('certifiedproperties.in/media/')) {
            return img.naturalWidth < 10;
        }
        return false;
    }

    /* ── Track seen real image URLs to detect duplicates ── */
    var seenSrcs = {};

    /* ── Check if this is a property/project card image ── */
    function isCardImg(img) {
        return !!img.closest('.property-box, .project-box, .property-overflow, [class*="property-thumbnail"], [class*="project-thumbnail"], .featured-properties, .recent-properties, .slide-box');
    }

    /* ── Replace duplicate real images with gradient ── */
    function deduplicateImg(img) {
        if (img.dataset.fixed) return;
        var src = img.src || '';
        if (!src || src.includes('data:') || src.includes('localhost:5173/media/dashboard/images/gallery/')) return;
        if (!isCardImg(img)) return;
        if (!seenSrcs[src]) {
            seenSrcs[src] = 1; /* first time — keep it */
        } else {
            seenSrcs[src]++;
            fixImg(img); /* duplicate — replace with gradient */
        }
    }

    /* ── Apply placeholder to broken images ── */
    function fixBrokenImages() {
        var imgs = document.querySelectorAll('img');
        imgs.forEach(function (img) {
            /* Already loaded but broken */
            if (img.complete && isBroken(img)) {
                fixImg(img);
                return;
            }
            /* Not loaded yet — attach listeners */
            img.addEventListener('error', function () {
                fixImg(this);
            }, { once: true });
            img.addEventListener('load', function () {
                if (isBroken(this)) { fixImg(this); return; }
                deduplicateImg(this);
            }, { once: true });
        });
        /* Run after images settle: fix broken + deduplicate loaded ones */
        setTimeout(function () {
            document.querySelectorAll('img:not([data-fixed])').forEach(function (img) {
                if (isBroken(img)) { fixImg(img); return; }
                if (img.complete && img.naturalWidth > 0) deduplicateImg(img);
            });
        }, 1500);
    }

    /* ── Format large numbers in Indian style ── */
    function formatPrice(num) {
        if (num >= 10000000) return '₹' + (num / 10000000).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
        if (num >= 100000) return '₹' + (num / 100000).toFixed(2).replace(/\.?0+$/, '') + ' L';
        return '₹' + num.toLocaleString('en-IN');
    }

    function formatIndianPrices() {
        document.querySelectorAll('.price-ratings-box .price').forEach(function (el) {
            var txt = el.textContent || '';
            if (txt.match(/L|Cr|mo/)) return;
            var num = parseFloat(txt.replace(/[₹,\s]/g, ''));
            if (!isNaN(num) && num > 9999) {
                var span = el.querySelector('span');
                var suffix = span ? span.outerHTML : '';
                el.innerHTML = formatPrice(num) + suffix;
            }
        });
    }

    /* ── Add "View All Properties" link below Similar Properties ── */
    function addViewAllButton() {
        var section = document.querySelector('.featured-properties.slide-box-2');
        if (!section || section.querySelector('.vap-btn')) return;
        var btn = document.createElement('div');
        btn.className = 'vap-btn text-center';
        btn.style.cssText = 'padding:10px 0 20px;';
        btn.innerHTML = '<a href="/properties_all.html" style="' +
            'display:inline-block;background:linear-gradient(135deg,#0d7034,#118e42);' +
            'color:#fff;padding:12px 36px;border-radius:50px;font-weight:700;' +
            'font-size:14px;letter-spacing:0.5px;text-decoration:none;' +
            'box-shadow:0 6px 20px rgba(17,142,66,0.3);transition:all 0.3s;"' +
            ' onmouseover="this.style.transform=\'translateY(-3px)\'"' +
            ' onmouseout="this.style.transform=\'\'">' +
            'View All Properties &rarr;</a>';
        var container = section.querySelector('.mx-5') || section.querySelector('.container');
        if (container) container.appendChild(btn);
    }

    /* ── Fix broken "Back" href="None" ── */
    function fixBackButton() {
        document.querySelectorAll('a[href="None"]').forEach(function (a) {
            if (a.textContent.trim().toLowerCase() === 'back') {
                a.href = 'javascript:history.back()';
            }
        });
    }

    function init() {
        fixBrokenImages();
        formatIndianPrices();
        addViewAllButton();
        fixBackButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
