// Mobile navigation toggle
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
})();

// Contact form: validate, then open the visitor's email app
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;
  var error = document.getElementById('cf-error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = form.querySelectorAll('input, textarea');
    var ok = true;
    fields.forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      f.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    error.hidden = ok;
    if (!ok) return;

    var body = form.message.value + '\n\n— ' + form.name.value + ' (' + form.email.value + ')';
    window.location.href = 'mailto:ccs@dlsjbc.edu.ph?subject=' +
      encodeURIComponent(form.subject.value) + '&body=' + encodeURIComponent(body);
  });
})();

// Events: dim the ones whose date has already passed, and move them
// after the still-upcoming ones so "Upcoming events" leads with what's
// actually upcoming (relative order is preserved within each group).
(function () {
  'use strict';

  var items = document.querySelectorAll('.event-item[data-date]');
  if (!items.length) return;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  items.forEach(function (el) {
    var d = new Date(el.getAttribute('data-date') + 'T00:00:00');
    if (d < today) {
      el.classList.add('is-past');
      el.parentNode.appendChild(el);
    }
  });
})();

// Announcements: grey out the date chip once that date has passed
(function () {
  'use strict';

  var items = document.querySelectorAll('.announce-item[data-date]');
  if (!items.length) return;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  items.forEach(function (el) {
    var d = new Date(el.getAttribute('data-date') + 'T00:00:00');
    if (d < today) {
      el.classList.add('is-past');
      var chip = el.querySelector('.announce-date');
      if (chip) chip.title = 'This date has passed';
    }
  });
})();

// News: photo galleries. Any link with class="js-gallery-open" and a
// data-gallery key opens that set of photos (defined per-page in
// window.NEWS_GALLERIES) in a lightbox instead of navigating away.
(function () {
  'use strict';

  var lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox || !window.NEWS_GALLERIES) return;

  var imgEl = document.getElementById('lightbox-img');
  var nameEl = document.getElementById('lightbox-name');
  var roleEl = document.getElementById('lightbox-role');
  var countEl = document.getElementById('lightbox-count');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');

  var photos = [];
  var index = 0;
  var opener = null;

  function render() {
    var photo = photos[index];
    if (!photo) return;
    imgEl.src = photo.src;
    imgEl.alt = photo.name + ' — ' + photo.role;
    nameEl.textContent = photo.name;
    roleEl.textContent = photo.role;
    countEl.textContent = (index + 1) + ' / ' + photos.length;
  }

  function open(key, triggerEl) {
    var set = window.NEWS_GALLERIES[key];
    if (!set || !set.length) return;
    photos = set;
    index = 0;
    opener = triggerEl;
    render();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }

  function step(delta) {
    if (!photos.length) return;
    index = (index + delta + photos.length) % photos.length;
    render();
  }

  document.querySelectorAll('.js-gallery-open[data-gallery]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      open(link.getAttribute('data-gallery'), link);
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
