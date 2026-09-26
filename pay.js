/**
 * The website's buy flow: sign in with Google, pick a plan, go to Wayl.
 *
 * Pro is granted by the server (wayl-webhook) once Wayl confirms the money,
 * never here - this page only starts the checkout. The Supabase anon key below
 * is public by design, exactly as it is inside the app.
 *
 * The same Google account signs in here and in the app, so it is the same
 * Jezdan user and Pro simply appears on the phone.
 */

var CONFIG = window.DANANEER_CONFIG;
var LANG = { current: localStorage.getItem('dananeer.lang') || 'ar' };

/**
 * Where the download button goes. While the app is in closed testing the
 * store page 404s for anyone who is not a tester, so point this at the opt-in
 * link instead and change the getApp wording to match:
 *   https://play.google.com/apps/testing/com.dananeer.app
 */
var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.dananeer.app';

var TEXT = {
  ar: {
    langSwitch: 'English',
    brand: 'جزدان',
    title: 'جزدان — مدبّر مصروفك',

    eyebrow: 'مجاني · بالعربي والإنكليزي',
    heroTitle: 'اكتب شنو صرفت، والباقي عليه',
    heroLede: 'جزدان مدبّر مصروفك: اكتبله «٢٥ الف غدا» بالعربي أو بالإنكليزي، ويسجّلها بالفئة والحساب الصحيح. يشتغل بدون إنترنت، وفلوسك تبقى بجهازك.',
    getApp: 'نزّله من Google Play',
    seePro: 'شوف Pro',
    ctaNote: 'التطبيق مجاني. Pro اختياري.',

    t1h: 'فلوسك تبقى عندك',
    t1b: 'ما يُرفع شي للسيرفر إلا إذا شغّلت النسخ الاحتياطي بنفسك.',
    t2h: 'دينار ودولار سوا',
    t2b: '١٥٤ عملة، مكتوبة بالطريقة المحلية.',
    t3h: 'بدون إعلانات',
    t3b: 'ولا نبيع بياناتك لأي جهة.',

    whatTitle: 'شنو يسوي',
    whatSub: 'كل اللي بهذا القسم مجاني، بدون اشتراك.',
    f1h: 'تكلّم وياه مثل ما تكتب لصاحبك',
    f1p: 'ما بيه استمارات ولا خانات. تكتب الجملة، وهو يفهم المبلغ والفئة والحساب. يشتغل بدون إنترنت، لأن القراءة تصير على التلفون نفسه.',
    f1a: '«٢٥ الف غدا»',
    f1b: '«دفعت ٣٠٠ الف ايجار»',
    f1c: '«قبضت الراتب»',
    f2h: 'شوف وين تروح فلوسك',
    f2p: 'رصيدك بكل الحسابات — كاش، زين كاش، بنك — وهذا الشهر مقابل خطتك، وأهداف الادخار والديون والأقساط، بصفحة وحدة.',
    f3h: 'اعرف عاداتك',
    f3p: 'رسم يومي، وفئاتك مرتبة، والشهر الماضي جنب هذا الشهر. ويقلّك الشي اللي ما تنتبهله: «البنزين ٣٧٪ من مصروفك هالشهر».',

    g1h: 'ميزانية لكل فئة',
    g1b: 'حدّد سقف، ويخبرك قبل ما تتجاوزه.',
    g2h: 'أهداف ادخار',
    g2b: 'جمّع لهدف وشوف شكد باقي عليه.',
    g3h: 'ديون وأقساط',
    g3b: 'منو يريدلك، وشكد قسط هذا الشهر.',
    g4h: 'فواتير متكررة',
    g4b: 'الإيجار والاشتراكات تنسجل بوكتها.',
    g5h: 'جرد الكاش',
    g5b: 'عدّ اللي بجيبك، وهو يسوّي الفرق.',
    g6h: 'قفل بالبصمة',
    g6b: 'ما يفتح إلا بيك.',

    proTitle: 'جزدان Pro',
    proSub: 'يضيف الأشياء اللي تحتاج ذكاء اصطناعي وسيرفر. الباقي يبقى مجاني.',
    p1h: '🎤 رسائل صوتية',
    p1b: 'قول شنو صرفت وينسجل.',
    p2h: '🧾 صوّر الإيصال',
    p2b: 'يقرأ المبلغ ويسجّله.',
    p3h: '🧠 ذكاء اصطناعي',
    p3b: 'يفهم أي أسلوب كتابة، حتى الصعب.',
    p4h: '💬 اسأل عن فلوسك',
    p4b: '«شكد صرفت على الأكل هالشهر؟»',
    p5h: '☁️ نسخة احتياطية',
    p5b: 'بدّل تلفونك وبياناتك وياك.',
    p6h: '🏠 حساب البيت',
    p6b: 'شارك الدفتر مع أهل بيتك.',

    faqTitle: 'أسئلة',
    q1: 'التطبيق مجاني؟',
    a1: 'إي. التسجيل والفئات والميزانيات والتقارير والعملات — كلها مجانية وبدون حد. Pro يضيف الصوت وقراءة الإيصالات والذكاء الاصطناعي والنسخة الاحتياطية.',
    q2: 'شلون أدفع؟',
    a2: 'بالدينار العراقي عبر زين كاش أو كي كارد أو FIB أو البطاقة. الدفع يصير بهذا الموقع، وPro يشتغل بالتطبيق على نفس حساب Google.',
    q3: 'يشتغل بدون إنترنت؟',
    a3: 'إي. التسجيل والقراءة والتقارير كلها على التلفون. الإنترنت يلزم بس لمزايا Pro اللي تحتاج سيرفر.',
    q4: 'إذا بدّلت تلفوني؟',
    a4: 'مع Pro تنحفظ نسخة بحسابك وترجعها بالتلفون الجديد. الاسترجاع مجاني دائمًا، حتى لو انتهى اشتراكك.',
    q5: 'بياناتي وين تروح؟',
    a5: 'تبقى بجهازك. ما يُرفع شي إلا إذا شغّلت النسخ الاحتياطي بنفسك، وتكدر تحذف كل شي من الإعدادات بأي وكت.',

    signInWhy: 'سجّل الدخول بحساب Google الذي تستخدمه في التطبيق، حتى يُفعَّل Pro على نفس الحساب.',
    signIn: 'تسجيل الدخول بحساب Google',
    signedInAs: 'مسجّل الدخول باسم',
    signOut: 'تسجيل الخروج',
    privacy: 'سياسة الخصوصية',
    deleteData: 'حذف بياناتك',
    fine: 'بعد الدفع افتح التطبيق وسجّل الدخول بنفس حساب Google. إذا كان لديك اشتراك فعّال، تُضاف المدة الجديدة إلى ما تبقى لك.',
    trialHead: 'جرّب Pro أسبوع مجانًا',
    trialSub: 'سبعة أيام كاملة، مرة وحدة لكل حساب، وبدون بطاقة.',
    trialStart: 'ابدأ الأسبوع المجاني',
    trialWorking: 'جارٍ تفعيل الأسبوع المجاني…',
    trialOn: 'تم. Pro شغّال أسبوع من هسه - افتح التطبيق وسجّل الدخول بنفس الحساب.',
    trialUsed: 'هذا الحساب استخدم الأسبوع المجاني قبل.',
    trialAlready: 'عندك Pro فعّال أصلًا.',
    plan_monthly: 'شهر واحد',
    plan_three_month: '٣ أشهر',
    plan_six_month: '٦ أشهر',
    plan_yearly: 'سنة كاملة',
    perMonth: '{price} شهريًا',
    pay: 'ادفع {price}',
    currency: 'د.ع',
    opening: 'جارٍ فتح صفحة الدفع…',
    proUntil: 'Pro مفعَّل حتى {date}.',
    failed: 'تعذّر فتح صفحة الدفع. حاول مرة أخرى بعد قليل.',
    signInFailed: 'تعذّر تسجيل الدخول. حاول مرة أخرى.',
  },
  en: {
    langSwitch: 'العربية',
    brand: 'Jezdan',
    title: 'Jezdan — your expense tracker',

    eyebrow: 'Free · Arabic and English',
    heroTitle: 'Type what you spent. It files the rest.',
    heroLede: 'Jezdan is an expense tracker you write to. Put in “25 lunch”, in Arabic or English, and it lands in the right category and account. It works offline, and your records stay on your phone.',
    getApp: 'Get it on Google Play',
    seePro: 'See Pro',
    ctaNote: 'The app is free. Pro is optional.',

    t1h: 'Your records stay with you',
    t1b: 'Nothing is uploaded unless you switch backup on yourself.',
    t2h: 'Dinars and dollars together',
    t2b: '154 currencies, written the local way.',
    t3h: 'No ads',
    t3b: 'And nothing about you is sold to anyone.',

    whatTitle: 'What it does',
    whatSub: 'Everything in this section is free, with no subscription.',
    f1h: 'Write to it like you text a friend',
    f1p: 'No forms, no fields. Write the sentence and it picks out the amount, the category and the account. It works offline, because the reading happens on the phone.',
    f1a: '“25 lunch”',
    f1b: '“paid 300k rent”',
    f1c: '“got my salary”',
    f2h: 'See where it goes',
    f2p: 'Your balance across every account — cash, ZainCash, bank — this month against your plan, and your savings, debts and instalments, on one page.',
    f3h: 'Know your habits',
    f3p: 'A daily chart, your categories in order, and last month beside this one. And the thing you would not have worked out yourself: “fuel is 37% of your spending this month”.',

    g1h: 'A budget per category',
    g1b: 'Set a ceiling and it warns you before you pass it.',
    g2h: 'Savings goals',
    g2b: 'Put money aside and see what is left to go.',
    g3h: 'Debts and instalments',
    g3b: 'Who owes you, and what is due this month.',
    g4h: 'Recurring bills',
    g4b: 'Rent and subscriptions log themselves on time.',
    g5h: 'Cash count',
    g5b: 'Count what is in your pocket; it works out the difference.',
    g6h: 'Fingerprint lock',
    g6b: 'It opens for you and nobody else.',

    proTitle: 'Jezdan Pro',
    proSub: 'It adds the things that need AI and a server. The rest stays free.',
    p1h: '🎤 Voice messages',
    p1b: 'Say what you spent and it is logged.',
    p2h: '🧾 Photograph a receipt',
    p2b: 'It reads the total and files it.',
    p3h: '🧠 AI that understands',
    p3b: 'However you write it, even the awkward ones.',
    p4h: '💬 Ask about your money',
    p4b: '“How much on food this month?”',
    p5h: '☁️ Cloud backup',
    p5b: 'Change phone and your records come with you.',
    p6h: '🏠 A household ledger',
    p6b: 'Share the book with the people you live with.',

    faqTitle: 'Questions',
    q1: 'Is the app free?',
    a1: 'Yes. Logging, categories, budgets, reports and currencies are all free and unlimited. Pro adds voice, receipts, AI and cloud backup.',
    q2: 'How do I pay?',
    a2: 'In Iraqi dinars with ZainCash, Qi Card, FIB or a card. Payment happens on this site, and Pro turns on in the app for the same Google account.',
    q3: 'Does it work offline?',
    a3: 'Yes. Logging, reading your sentences and the reports all happen on the phone. The internet is only needed for the Pro features that use a server.',
    q4: 'What if I change phone?',
    a4: 'With Pro a copy is kept on your account and you restore it on the new phone. Restoring is always free, even after a subscription ends.',
    q5: 'Where does my data go?',
    a5: 'It stays on your device. Nothing is uploaded unless you switch backup on yourself, and you can delete all of it from Settings at any time.',

    signInWhy: 'Sign in with the Google account you use in the app, so Pro lands on that account.',
    signIn: 'Sign in with Google',
    signedInAs: 'Signed in as',
    signOut: 'Sign out',
    privacy: 'Privacy policy',
    deleteData: 'Delete your data',
    fine: 'After paying, open the app and sign in with the same Google account. If Pro is already running, the new time is added to what is left.',
    trialHead: 'Try Pro free for a week',
    trialSub: 'Seven days, once per account, no card needed.',
    trialStart: 'Start my free week',
    trialWorking: 'Starting your free week…',
    trialOn: 'Done. Pro is on for a week - open the app and sign in with the same account.',
    trialUsed: 'This account has already had its free week.',
    trialAlready: 'You already have Pro running.',
    plan_monthly: '1 month',
    plan_three_month: '3 months',
    plan_six_month: '6 months',
    plan_yearly: '1 year',
    perMonth: '{price} a month',
    pay: 'Pay {price}',
    currency: 'IQD',
    opening: 'Opening the payment page…',
    proUntil: 'Pro is active until {date}.',
    failed: 'The payment page would not open. Please try again shortly.',
    signInFailed: 'Could not sign in. Please try again.',
  },
};

function t(key, vars) {
  var s = (TEXT[LANG.current] && TEXT[LANG.current][key]) || TEXT.en[key] || key;
  return vars ? s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k]; }) : s;
}

function money(amount) {
  return new Intl.NumberFormat(LANG.current === 'ar' ? 'ar-IQ' : 'en-US').format(amount) + ' ' + t('currency');
}

function applyLanguage() {
  document.documentElement.lang = LANG.current;
  document.documentElement.dir = LANG.current === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title');
  var nodes = document.querySelectorAll('[data-t]');
  for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute('data-t'));
  if (plans) drawPlans();
}

var client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
var plans = null;
var session = null;

function show(id, visible) { document.getElementById(id).hidden = !visible; }

function setStatus(message) {
  var el = document.getElementById('status');
  el.textContent = message || '';
  el.hidden = !message;
}

function drawPlans() {
  var box = document.getElementById('plans');
  box.textContent = '';
  Object.keys(plans).forEach(function (name) {
    var plan = plans[name];
    var months = { monthly: 1, three_month: 3, six_month: 6, yearly: 12 }[name] || 1;
    var card = document.createElement('div');
    card.className = 'plan';
    var title = document.createElement('div');
    title.className = 'plan-name';
    title.textContent = t('plan_' + name);
    var per = document.createElement('div');
    per.className = 'plan-per';
    per.textContent = t('perMonth', { price: money(Math.round(plan.amount / months)) });
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'primary';
    button.textContent = t('pay', { price: money(plan.amount) });
    button.addEventListener('click', function () { checkout(name, button); });
    card.appendChild(title);
    card.appendChild(per);
    card.appendChild(button);
    box.appendChild(card);
  });
}


/**
 * The free week. Offered only to an account that has never had it and is not
 * already Pro - the backend decides that, and says so, so the button is not
 * shown to someone it would only refuse.
 */
function authHeaders() {
  return {
    apikey: CONFIG.supabaseAnonKey,
    authorization: 'Bearer ' + session.access_token,
    'content-type': 'application/json',
  };
}

async function drawTrial() {
  var box = document.getElementById('trial');
  if (!session) { box.hidden = true; return; }
  try {
    const res = await fetch(CONFIG.supabaseUrl + '/functions/v1/pro-trial', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ action: 'status' }),
    });
    const body = await res.json();
    box.hidden = !(res.ok && body.eligible);
  } catch (e) {
    box.hidden = true;
  }
}

async function startTrial() {
  var button = document.getElementById('trialBtn');
  if (!session || button.disabled) return;
  button.disabled = true;
  setStatus(t('trialWorking'));
  try {
    const res = await fetch(CONFIG.supabaseUrl + '/functions/v1/pro-trial', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ action: 'start' }),
    });
    const body = await res.json();
    if (!res.ok) {
      setStatus(t(body.error === 'used' ? 'trialUsed' : body.error === 'already_pro' ? 'trialAlready' : 'failed'));
      button.disabled = false;
      return;
    }
    document.getElementById('trial').hidden = true;
    setStatus(t('trialOn'));
    showPro();
  } catch (e) {
    setStatus(t('failed'));
    button.disabled = false;
  }
}

async function checkout(plan, button) {
  if (!session) return;
  button.disabled = true;
  setStatus(t('opening'));
  try {
    const res = await fetch(CONFIG.supabaseUrl + '/functions/v1/pro-checkout', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ plan: plan }),
    });
    const body = await res.json();
    if (!res.ok || !body.url) throw new Error(body.error || res.status);
    window.location.href = body.url;   // Wayl's hosted checkout
  } catch (e) {
    console.error(e);
    button.disabled = false;
    setStatus(t('failed'));
  }
}

/** Show when Pro runs out, from the orders this account has paid for. */
async function showPro() {
  const { data } = await client.from('pro_orders')
    .select('granted_until').eq('status', 'paid')
    .order('granted_until', { ascending: false }).limit(1);
  const until = data && data[0] && data[0].granted_until;
  if (!until) return;
  const when = new Date(until);
  if (when.getTime() > Date.now()) {
    setStatus(t('proUntil', { date: when.toLocaleDateString(LANG.current === 'ar' ? 'ar-IQ' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) }));
  }
}

function render() {
  show('auth', !session);
  show('account', !!session);
  if (session) {
    document.getElementById('email').textContent = session.user.email || '';
    drawPlans();
    drawTrial();
    showPro();
  }
}

async function start() {
  plans = await fetch('plans.json').then(function (r) { return r.json(); });
  document.getElementById('getapp').href = PLAY_URL;
  document.getElementById('lang').addEventListener('click', function () {
    LANG.current = LANG.current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('dananeer.lang', LANG.current);
    applyLanguage();
  });
  document.getElementById('trialBtn').addEventListener('click', startTrial);
  document.getElementById('signin').addEventListener('click', async function () {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    if (error) setStatus(t('signInFailed'));
  });
  document.getElementById('signout').addEventListener('click', async function () {
    await client.auth.signOut();
  });
  client.auth.onAuthStateChange(function (_event, next) {
    session = next;
    render();
  });
  const current = await client.auth.getSession();
  session = current.data.session;
  applyLanguage();
  render();
}

start();
