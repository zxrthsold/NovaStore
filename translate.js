// Google Website Translator, driven by a custom dropdown.
// Uses the googtrans cookie + reload approach, which is far more reliable
// across browsers than trying to fire a synthetic change event on Google's
// own <select>.
function googleTranslateInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,es,fr,de,pt,it,pl,tr,ar,hi,zh-CN,ja,ko,ru',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

function toggleLangMenu() {
  document.getElementById('langMenu').classList.toggle('open');
}

function setLanguage(code) {
  const host = window.location.hostname;
  const value = code === 'en' ? '' : `/en/${code}`;
  document.cookie = `googtrans=${value}; path=/`;
  document.cookie = `googtrans=${value}; domain=${host}; path=/`;
  document.cookie = `googtrans=${value}; domain=.${host}; path=/`;
  window.location.reload();
}

document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.lang-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('langMenu')?.classList.remove('open');
  }
});
