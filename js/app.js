/* ===== 大连英博球迷站 · JavaScript ===== */

(function() {
  'use strict';

  /* ----- 1. 倒计时 ----- */
  function updateCountdown() {
    const matchDay = new Date('2026-06-20T19:35:00+08:00').getTime();
    const now = Date.now();
    const diff = Math.max(0, matchDay - now);

    document.getElementById('cdDays').textContent  = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cdMins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cdSecs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ----- 2. 赛程渲染 ----- */
  const matches = [
    { round: 15, date: '2026-06-20', time: '19:35', home: '大连英博', away: '上海海港', score: null, status: '未开始' },
    { round: 14, date: '2026-06-14', time: '19:35', home: '武汉三镇', away: '大连英博', score: '1-2', status: '已结束' },
    { round: 13, date: '2026-05-26', time: '19:35', home: '大连英博', away: '北京国安', score: '3-3', status: '已结束' },
    { round: 12, date: '2026-05-18', time: '19:35', home: '山东泰山', away: '大连英博', score: '2-0', status: '已结束' },
    { round: 11, date: '2026-05-11', time: '19:35', home: '大连英博', away: '成都蓉城', score: '1-0', status: '已结束' },
  ];

  function renderSchedule() {
    const list = document.getElementById('scheduleList');
    list.innerHTML = matches.map(m => {
      const isDone  = m.status === '已结束';
      const isYingboHome = m.home === '大连英博';
      let badge = '', scoreHtml = '';

      if (isDone) {
        const [h, a] = (m.score || '0-0').split('-').map(Number);
        const ybScore = isYingboHome ? h : a;
        const opScore = isYingboHome ? a : h;
        const result = ybScore > opScore ? 'win' : ybScore < opScore ? 'lose' : 'draw';
        const label  = { win: '胜', lose: '负', draw: '平' }[result];
        badge = `<span class="status-badge ${result}">${label}</span>`;
        scoreHtml = `<span class="score">${m.score}</span>`;
      } else {
        badge = `<span class="status-badge upcoming">未赛</span>`;
        scoreHtml = `<span class="score tbd">vs</span>`;
      }

      return `
        <div class="match-row fade-in">
          <div class="teams">
            <span class="team-name">${m.home}</span>
            <span class="vs">vs</span>
            <span class="team-name">${m.away}</span>
          </div>
          ${scoreHtml}
          <div class="meta">
            <div>第${m.round}轮 · ${m.date}</div>
            <div style="margin-top:2px;">${m.time}${badge}</div>
          </div>
        </div>
      `;
    }).join('');
  }
  renderSchedule();

  /* ----- 3. 图片墙 ----- */
  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80', caption: '绿茵激战' },
    { src: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=500&q=80', caption: '训练时刻' },
    { src: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&q=80', caption: '蓝色看台' },
    { src: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=500&q=80', caption: '球迷开放日' },
    { src: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80', caption: '战斗到最后一刻' },
    { src: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80', caption: '大连·足球城' },
    { src: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80', caption: '更衣室集结' },
    { src: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=500&q=80', caption: '庆祝瞬间' },
    { src: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80', caption: '少年足球梦' },
  ];

  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = galleryImages.map(img => `
      <div class="item fade-in" data-src="${img.src}">
        <img src="${img.src}" alt="${img.caption}" loading="lazy">
        <div class="caption">${img.caption}</div>
      </div>
    `).join('');
  }
  renderGallery();

  /* ----- 4. Lightbox ----- */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  document.getElementById('galleryGrid').addEventListener('click', function(e) {
    const item = e.target.closest('.item');
    if (item) {
      lightboxImg.src = item.dataset.src;
      lightbox.classList.add('show');
    }
  });
  lightbox.addEventListener('click', function() {
    this.classList.remove('show');
  });

  /* ----- 5. 移动端导航 ----- */
  document.getElementById('navToggle').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('open');
  });

  /* ----- 6. 滚动高亮 & 渐入动画 ----- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    document.querySelectorAll('.fade-in').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);
})();
