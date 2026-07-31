// Google Website Translator, driven by a custom dropdown instead of the default widget UI.
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
  // Poll briefly in case the Google widget hasn't finished injecting its <select> yet
  let tries = 0;
  const attempt = setInterval(() => {
    const sel = document.querySelector('select.goog-te-combo');
    tries++;
    if (sel) {
      sel.value = code;
      sel.dispatchEvent(new Event('change'));
      clearInterval(attempt);
    }
    if (tries > 30) clearInterval(attempt);
  }, 150);
  document.getElementById('langMenu').classList.remove('open');
}

document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.lang-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('langMenu')?.classList.remove('open');
  }
});
