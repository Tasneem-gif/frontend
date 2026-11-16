'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Icon, type IconName } from './icons'
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Field,
  Input,
  PageTitle,
  Select,
  Textarea,
} from './ui'

const nav: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'داشبورد', icon: 'dashboard' },
  { href: '/generate', label: 'تولید محتوا', icon: 'sparkles' },
  { href: '/ideas', label: 'ایده‌یابی', icon: 'bulb' },
  { href: '/library', label: 'کتابخانه محتوا', icon: 'library' },
  { href: '/calendar', label: 'تقویم محتوا', icon: 'calendar' },
  { href: '/brand', label: 'پروفایل برند', icon: 'brand' },
  { href: '/settings', label: 'تنظیمات', icon: 'settings' },
]

const samples = [
  {
    id: '1',
    title: '۵ راه ساده برای ساخت عادت مطالعه',
    type: 'کپشن',
    status: 'تأییدشده',
    date: 'امروز، ۱۰:۴۵',
    tone: 'success' as const,
  },
  {
    id: '2',
    title: 'معرفی دوره مدیریت زمان',
    type: 'پست متنی',
    status: 'در انتظار تأیید',
    date: 'دیروز، ۱۷:۲۰',
    tone: 'info' as const,
  },
  {
    id: '3',
    title: 'صبح پربازده از کجا شروع می‌شود؟',
    type: 'استوری',
    status: 'پیش‌نویس',
    date: '۲ روز پیش',
    tone: 'neutral' as const,
  },
  {
    id: '4',
    title: 'سناریوی ریلز: قانون دو دقیقه',
    type: 'سناریوی ریلز',
    status: 'نیازمند اصلاح',
    date: '۳ روز پیش',
    tone: 'warning' as const,
  },
]

const generatedText = `گاهی بزرگ‌ترین تغییرها از کوچک‌ترین تصمیم‌ها شروع می‌شوند.

اگر مدت‌هاست می‌خواهی مطالعه را به بخشی از روزت تبدیل کنی، از ده صفحه شروع نکن؛ فقط دو صفحه بخوان. کتاب را جایی بگذار که هر روز ببینی و زمان مشخصی را به آن اختصاص بده.

پیوستگی از حجم مهم‌تر است. همین قدم کوچک، بعد از چند هفته به عادتی تبدیل می‌شود که بدون فکر کردن انجامش می‌دهی.

تو برای ساختن عادت مطالعه از چه روشی استفاده می‌کنی؟ تجربه‌ات را برایمان بنویس.`

export default function ProductApp() {
  const pathname = usePathname()
  const [drawer, setDrawer] = useState(false)
  const [toast, setToast] = useState('')
  const authPage = pathname === '/login' || pathname === '/register'
  const approvalPage = pathname.startsWith('/approval')

  useEffect(() => setDrawer(false), [pathname])
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  if (authPage) return <AuthScreen register={pathname === '/register'} />
  if (approvalPage) return <ApprovalScreen notify={notify} />

  return (
    <div className="app-shell" dir="rtl">
      {drawer && (
        <button
          className="drawer-backdrop"
          aria-label="بستن منو"
          onClick={() => setDrawer(false)}
        />
      )}
      <aside className={`sidebar ${drawer ? 'sidebar-open' : ''}`}>
        <Link href="/" className="brand-lockup">
          <span>
            <Icon name="sparkles" />
          </span>
          <div>
            <strong>کُنتِوو</strong>
            <small>دستیار هوشمند محتوا</small>
          </div>
        </Link>
        <nav className="main-nav">
          <p>فضای کاری</p>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                  ? 'active'
                  : ''
              }
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.href === '/library' && <em>۱۲</em>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link href="/brand" className="brand-progress">
            <span className="progress-ring">۶۰٪</span>
            <span>
              <b>تکمیل پروفایل برند</b>
              <small>پاسخ‌های دقیق‌تر بگیرید</small>
            </span>
            <Icon name="chevron" />
          </Link>
          <div className="user-row">
            <span className="avatar">ن‌ا</span>
            <span>
              <b>نیلوفر احمدی</b>
              <small>حساب شخصی</small>
            </span>
            <Icon name="more" />
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <Button
            variant="ghost"
            className="mobile-menu"
            icon="menu"
            aria-label="نمایش منو"
            onClick={() => setDrawer(true)}
          />
          <div className="topbar-date">
            <span>امروز</span>
            <b>سه‌شنبه، ۲۳ اردیبهشت ۱۴۰۴</b>
          </div>
          <div className="topbar-actions">
            <Button variant="ghost" className="icon-button" icon="bell" aria-label="اعلان‌ها" />
            <ButtonLink href="/generate" icon="plus">
              محتوای جدید
            </ButtonLink>
          </div>
        </header>
        <main className="content-area">
          <Screen pathname={pathname} notify={notify} />
        </main>
      </div>
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" />
          </span>
          {toast}
        </div>
      )}
    </div>
  )
}

function Screen({ pathname, notify }: { pathname: string; notify: (message: string) => void }) {
  if (pathname === '/generate') return <GenerateScreen />
  if (pathname === '/editor') return <EditorScreen notify={notify} />
  if (pathname === '/ideas') return <IdeasScreen />
  if (pathname === '/library') return <LibraryScreen notify={notify} />
  if (pathname === '/calendar') return <CalendarScreen />
  if (pathname === '/brand') return <BrandScreen notify={notify} />
  if (pathname === '/settings') return <SettingsScreen notify={notify} />
  if (pathname.startsWith('/content/')) return <ContentDetail notify={notify} />
  return <Dashboard />
}

function Dashboard() {
  return (
    <>
      <PageTitle
        title="سلام نیلوفر، آماده‌ای چیزی بسازیم؟"
        subtitle="مروری کوتاه بر محتوای برند شما در این هفته"
        action={
          <ButtonLink href="/generate" icon="sparkles">
            تولید محتوای جدید
          </ButtonLink>
        }
      />
      <Card className="brand-nudge">
        <span className="nudge-art">
          <Icon name="brand" />
        </span>
        <div>
          <h3>صدای برندت را دقیق‌تر کن</h3>
          <p>
            پروفایل برند هنوز کامل نیست. با تکمیل چند پرسش، محتوای نزدیک‌تری به لحن واقعی برندت
            می‌سازی.
          </p>
        </div>
        <div className="nudge-progress">
          <span>
            <b>۶۰٪</b> تکمیل شده
          </span>
          <i>
            <b />
          </i>
        </div>
        <ButtonLink href="/brand" variant="secondary">
          تکمیل اطلاعات برند <Icon name="arrow" />
        </ButtonLink>
      </Card>
      <div className="stats-grid">
        <Card className="stat-card">
          <span className="stat-icon violet">
            <Icon name="library" />
          </span>
          <div>
            <small>کل محتوا</small>
            <strong>۱۲</strong>
            <p>
              <b>۳+</b> این هفته
            </p>
          </div>
        </Card>
        <Card className="stat-card">
          <span className="stat-icon blue">
            <Icon name="clock" />
          </span>
          <div>
            <small>در انتظار تأیید</small>
            <strong>۳</strong>
            <p>نیازمند بررسی مشتری</p>
          </div>
        </Card>
        <Card className="stat-card">
          <span className="stat-icon amber">
            <Icon name="edit" />
          </span>
          <div>
            <small>پیش‌نویس‌ها</small>
            <strong>۵</strong>
            <p>آماده ادامه و ویرایش</p>
          </div>
        </Card>
        <Card className="stat-card">
          <span className="stat-icon green">
            <Icon name="calendar" />
          </span>
          <div>
            <small>زمان‌بندی‌شده</small>
            <strong>۴</strong>
            <p>برای ۷ روز آینده</p>
          </div>
        </Card>
      </div>
      <div className="dashboard-grid">
        <Card className="recent-card">
          <div className="card-head">
            <div>
              <h2>محتوای اخیر</h2>
              <p>آخرین محتواهایی که روی آن‌ها کار کرده‌اید</p>
            </div>
            <Link href="/library">
              مشاهده همه <Icon name="arrow" />
            </Link>
          </div>
          <div className="content-list">
            {samples.slice(0, 3).map((item) => (
              <Link href={`/content/${item.id}`} className="content-row" key={item.id}>
                <span className="type-icon">
                  <Icon name={item.type === 'استوری' ? 'copy' : 'edit'} />
                </span>
                <span className="row-main">
                  <b>{item.title}</b>
                  <small>
                    {item.type} · {item.date}
                  </small>
                </span>
                <Badge tone={item.tone}>{item.status}</Badge>
                <Icon name="chevron" />
              </Link>
            ))}
          </div>
        </Card>
        <Card className="upcoming-card">
          <div className="card-head">
            <div>
              <h2>برنامه پیشِ رو</h2>
              <p>قرارهای انتشار شما</p>
            </div>
            <Link href="/calendar">
              <Icon name="calendar" />
            </Link>
          </div>
          <div className="schedule-item">
            <span className="date-box">
              <b>۲۵</b>
              <small>اردیبهشت</small>
            </span>
            <div>
              <b>معرفی دوره مدیریت زمان</b>
              <small>پست متنی · اینستاگرام</small>
            </div>
            <Badge tone="info">۲ روز دیگر</Badge>
          </div>
          <div className="schedule-item">
            <span className="date-box">
              <b>۲۸</b>
              <small>اردیبهشت</small>
            </span>
            <div>
              <b>۳ تمرین برای تمرکز بیشتر</b>
              <small>کپشن · لینکدین</small>
            </div>
          </div>
          <ButtonLink href="/calendar" variant="ghost" className="full-button">
            مشاهده تقویم محتوا <Icon name="arrow" />
          </ButtonLink>
        </Card>
      </div>
    </>
  )
}

function GenerateScreen() {
  const router = useRouter()
  const [type, setType] = useState('کپشن')
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('topic')
    if (value) setTopic(value)
  }, [])
  const generate = () => {
    if (!topic.trim()) return
    setLoading(true)
    window.setTimeout(() => router.push('/editor'), 1500)
  }
  return (
    <div className="narrow-page">
      <PageTitle
        title="تولید محتوای جدید"
        subtitle="چند جزئیات کوتاه بده تا کُنتِوو پیش‌نویس اولیه را برایت آماده کند."
      />
      <div className="steps">
        <span className="done">
          <b>
            <Icon name="check" />
          </b>
          انتخاب قالب
        </span>
        <i />
        <span className="active">
          <b>۲</b>جزئیات محتوا
        </span>
        <i />
        <span>
          <b>۳</b>ویرایش و ذخیره
        </span>
      </div>
      <Card className="form-card">
        <div className="section-heading">
          <span>
            <Icon name="sparkles" />
          </span>
          <div>
            <h2>چه محتوایی می‌خواهی بسازی؟</h2>
            <p>قالب مناسب را انتخاب کن.</p>
          </div>
        </div>
        <div className="type-grid">
          {['کپشن', 'پست متنی', 'استوری', 'سناریوی ریلز'].map((item, index) => (
            <button
              key={item}
              onClick={() => setType(item)}
              className={`type-option ${type === item ? 'selected' : ''}`}
            >
              <span>
                <Icon name={(['edit', 'library', 'copy', 'send'] as IconName[])[index]} />
              </span>
              <b>{item}</b>
              <small>
                {
                  [
                    'برای شبکه‌های اجتماعی',
                    'مناسب لینکدین و وبلاگ',
                    'کوتاه و چنداسلایدی',
                    'هوک، بدنه و دعوت',
                  ][index]
                }
              </small>
              {type === item && (
                <i>
                  <Icon name="check" />
                </i>
              )}
            </button>
          ))}
        </div>
        <hr />
        <div className="form-grid">
          <Field label="موضوع محتوا" required>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثلاً: راه‌های ساخت عادت مطالعه"
            />
            <small className="counter">{topic.length} / ۲۰۰</small>
          </Field>
          <Field label="هدف محتوا">
            <Select defaultValue="">
              <option value="" disabled>
                یک هدف انتخاب کنید
              </option>
              <option>آگاهی از برند</option>
              <option>تعامل با مخاطب</option>
              <option>معرفی محصول یا خدمت</option>
            </Select>
          </Field>
          <Field label="لحن محتوا">
            <Select defaultValue="صمیمی و حرفه‌ای">
              <option>صمیمی و حرفه‌ای</option>
              <option>آموزشی</option>
              <option>الهام‌بخش</option>
              <option>رسمی</option>
            </Select>
          </Field>
          <Field label="توضیحات تکمیلی" hint="هر نکته‌ای که به نتیجه بهتر کمک می‌کند.">
            <Textarea placeholder="مثلاً: حتماً یک سؤال در پایان متن باشد..." rows={4} />
          </Field>
        </div>
        {!topic.trim() && (
          <p className="validation-note">
            <Icon name="bulb" />
            برای شروع، موضوع محتوا را وارد کنید. اطلاعات واردشده در صورت خطا حفظ می‌شود.
          </p>
        )}
        <div className="form-actions">
          <Button variant="ghost">انصراف</Button>
          <Button icon="sparkles" disabled={!topic.trim() || loading} onClick={generate}>
            {loading ? (
              <>
                <span className="spinner" />
                در حال ساخت پیش‌نویس...
              </>
            ) : (
              'تولید محتوا'
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}

function EditorScreen({ notify }: { notify: (message: string) => void }) {
  const [text, setText] = useState(generatedText)
  const [rewriting, setRewriting] = useState('')
  const rewrite = (action: string) => {
    setRewriting(action)
    window.setTimeout(() => {
      setRewriting('')
      notify(`نسخه «${action}» آماده شد`)
    }, 800)
  }
  return (
    <>
      <PageTitle
        title="ویرایش محتوا"
        subtitle="پیش‌نویس ساخته شد؛ حالا آن را دقیقاً مطابق نیازت تنظیم کن."
        action={
          <div className="title-actions">
            <Button
              variant="secondary"
              icon="copy"
              onClick={() => {
                navigator.clipboard?.writeText(text)
                notify('متن در کلیپ‌بورد کپی شد')
              }}
            >
              کپی متن
            </Button>
            <Button icon="check" onClick={() => notify('محتوا با موفقیت ذخیره شد')}>
              ذخیره محتوا
            </Button>
          </div>
        }
      />
      <div className="editor-layout">
        <div>
          <Card className="editor-card">
            <div className="editor-toolbar">
              <div>
                <button>پ</button>
                <button>
                  <b>پ</b>
                </button>
                <span />
                <button>↶</button>
                <button>↷</button>
              </div>
              <small>{text.length} نویسه · حدود ۱ دقیقه مطالعه</small>
            </div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} />
            <div className="editor-footer">
              <span>ذخیره خودکار انجام شد</span>
              <span>
                <i />
                همه تغییرات ذخیره شده‌اند
              </span>
            </div>
          </Card>
          <Card className="rewrite-card">
            <div>
              <span>
                <Icon name="sparkles" />
              </span>
              <div>
                <h3>بازنویسی با هوش مصنوعی</h3>
                <p>یکی از حالت‌ها را انتخاب کن؛ نسخه فعلی حفظ می‌شود.</p>
              </div>
            </div>
            <div className="rewrite-actions">
              {['کوتاه‌تر', 'رسمی‌تر', 'صمیمی‌تر', 'جذاب‌تر'].map((item) => (
                <Button key={item} variant="secondary" onClick={() => rewrite(item)}>
                  {rewriting === item ? (
                    <span className="spinner dark" />
                  ) : (
                    <Icon name={item === 'کوتاه‌تر' ? 'filter' : 'sparkles'} />
                  )}{' '}
                  {item}
                </Button>
              ))}
            </div>
          </Card>
        </div>
        <aside className="editor-side">
          <Card>
            <h3>جزئیات محتوا</h3>
            <dl>
              <div>
                <dt>قالب</dt>
                <dd>کپشن</dd>
              </div>
              <div>
                <dt>موضوع</dt>
                <dd>ساخت عادت مطالعه</dd>
              </div>
              <div>
                <dt>هدف</dt>
                <dd>تعامل با مخاطب</dd>
              </div>
              <div>
                <dt>لحن</dt>
                <dd>صمیمی و حرفه‌ای</dd>
              </div>
            </dl>
            <ButtonLink href="/generate" variant="ghost" icon="edit" className="full-button">
              ویرایش ورودی‌ها
            </ButtonLink>
          </Card>
          <div className="tip-box">
            <Icon name="bulb" />
            <div>
              <b>یک پیشنهاد کوچک</b>
              <p>افزودن یک تجربه شخصی می‌تواند این متن را باورپذیرتر کند.</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

function IdeasScreen() {
  const [generated, setGenerated] = useState(true)
  const ideas = [
    'پنج اشتباه رایج در شروع مطالعه روزانه',
    'چطور در روزهای شلوغ هم کتاب بخوانیم؟',
    'معرفی سه کتاب برای شروع توسعه فردی',
    'قانون دو دقیقه برای ساخت عادت‌های ماندگار',
    'یک هفته بدون شبکه‌های اجتماعی؛ نتیجه چه بود؟',
    'چالش هفت‌روزه مطالعه برای مخاطبان',
  ]
  return (
    <>
      <PageTitle
        title="ایده‌یابی محتوا"
        subtitle="موضوع یا حوزه‌ات را بگو تا ایده‌های تازه و قابل اجرا پیدا کنیم."
      />
      <Card className="idea-generator">
        <div className="idea-form">
          <Field label="درباره چه موضوعی ایده می‌خواهی؟">
            <Input defaultValue="عادت‌سازی و توسعه فردی" />
          </Field>
          <Field label="قالب پیشنهادی">
            <Select>
              <option>همه قالب‌ها</option>
              <option>کپشن</option>
              <option>استوری</option>
            </Select>
          </Field>
          <Button icon="sparkles" onClick={() => setGenerated(false)}>
            تولید ایده‌های جدید
          </Button>
        </div>
      </Card>
      {!generated ? (
        <Card>
          <EmptyState
            icon="sparkles"
            title="در حال ساخت ایده‌های تازه..."
            description="چند لحظه صبر کن؛ در حال بررسی زاویه‌های متفاوت هستیم."
          />
          <div className="skeleton-lines">
            <i />
            <i />
            <i />
          </div>
        </Card>
      ) : (
        <div className="ideas-section">
          <div className="card-head">
            <div>
              <h2>ایده‌های پیشنهادی برای شما</h2>
              <p>روی هر ایده بزن تا مستقیم وارد تولید محتوا شوی.</p>
            </div>
            <Badge tone="info">۶ ایده تازه</Badge>
          </div>
          <div className="ideas-grid">
            {ideas.map((idea, i) => (
              <Card className="idea-card" key={idea}>
                <div>
                  <span>{String(i + 1).padStart(2, '۰')}</span>
                  <Badge>{i % 3 === 0 ? 'کپشن' : i % 3 === 1 ? 'استوری' : 'پست متنی'}</Badge>
                </div>
                <h3>{idea}</h3>
                <p>
                  {
                    [
                      'آموزشی و کاربردی با یک دعوت به تعامل روشن.',
                      'روایتی کوتاه و قابل هم‌ذات‌پنداری برای مخاطب.',
                    ][i % 2]
                  }
                </p>
                <ButtonLink
                  href={`/generate?topic=${encodeURIComponent(idea)}`}
                  variant="ghost"
                  className="full-button"
                >
                  ساخت محتوا از این ایده <Icon name="arrow" />
                </ButtonLink>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function LibraryScreen({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('همه وضعیت‌ها')
  const filtered = useMemo(
    () =>
      samples.filter(
        (x) => x.title.includes(query) && (status === 'همه وضعیت‌ها' || x.status === status),
      ),
    [query, status],
  )
  return (
    <>
      <PageTitle
        title="کتابخانه محتوا"
        subtitle="همه محتواهای برندت را در یک جا مدیریت کن."
        action={
          <ButtonLink href="/generate" icon="plus">
            محتوای جدید
          </ButtonLink>
        }
      />
      <Card className="library-card">
        <div className="filters">
          <label className="search-control">
            <Icon name="search" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جست‌وجو در محتوا..."
            />
          </label>
          <Select>
            <option>همه قالب‌ها</option>
            <option>کپشن</option>
            <option>پست متنی</option>
            <option>استوری</option>
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>همه وضعیت‌ها</option>
            <option>پیش‌نویس</option>
            <option>در انتظار تأیید</option>
            <option>نیازمند اصلاح</option>
            <option>تأییدشده</option>
          </Select>
          <Button variant="secondary" icon="filter">
            فیلترها
          </Button>
        </div>
        {filtered.length ? (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>عنوان محتوا</th>
                    <th>قالب</th>
                    <th>وضعیت</th>
                    <th>آخرین ویرایش</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link href={`/content/${item.id}`}>
                          <span className="type-icon">
                            <Icon name="edit" />
                          </span>
                          <span>
                            <b>{item.title}</b>
                            <small>گاهی بزرگ‌ترین تغییرها از کوچک‌ترین تصمیم‌ها...</small>
                          </span>
                        </Link>
                      </td>
                      <td>{item.type}</td>
                      <td>
                        <Badge tone={item.tone}>{item.status}</Badge>
                      </td>
                      <td>{item.date}</td>
                      <td>
                        <div className="table-actions">
                          <Button variant="ghost" icon="edit" aria-label="ویرایش" />
                          <Button
                            variant="ghost"
                            icon="copy"
                            aria-label="کپی"
                            onClick={() => notify('یک نسخه کپی ساخته شد')}
                          />
                          <Button variant="ghost" icon="calendar" aria-label="زمان‌بندی" />
                          <Button variant="ghost" icon="more" aria-label="بیشتر" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>نمایش ۱ تا ۴ از ۱۲ محتوا</span>
              <div>
                <Button variant="secondary" disabled>
                  <Icon name="chevron" />
                </Button>
                <Button>۱</Button>
                <Button variant="secondary">۲</Button>
                <Button variant="secondary">۳</Button>
                <Button variant="secondary">
                  <Icon name="arrow" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon="search"
            title="نتیجه‌ای پیدا نشد"
            description="عبارت جست‌وجو یا فیلترها را تغییر بده و دوباره امتحان کن."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setStatus('همه وضعیت‌ها')
                }}
              >
                پاک کردن فیلترها
              </Button>
            }
          />
        )}
      </Card>
    </>
  )
}

function CalendarScreen() {
  const [selected, setSelected] = useState(25)
  const days = Array.from({ length: 35 }, (_, i) => (i < 2 ? 29 + i : i - 1))
  return (
    <>
      <PageTitle
        title="تقویم محتوا"
        subtitle="برنامه انتشار را در نمای ماهانه ببین و مدیریت کن."
        action={
          <ButtonLink href="/generate" icon="plus">
            افزودن محتوا
          </ButtonLink>
        }
      />
      <Card className="calendar-card">
        <div className="calendar-head">
          <div>
            <Button variant="secondary">
              <Icon name="chevron" />
            </Button>
            <h2>اردیبهشت ۱۴۰۴</h2>
            <Button variant="secondary">
              <Icon name="arrow" />
            </Button>
            <Button variant="ghost">امروز</Button>
          </div>
          <div>
            <span className="legend draft">
              <i />
              پیش‌نویس
            </span>
            <span className="legend scheduled">
              <i />
              زمان‌بندی‌شده
            </span>
            <span className="legend approved">
              <i />
              تأییدشده
            </span>
          </div>
        </div>
        <div className="weekdays">
          {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <div className="month-grid">
          {days.map((day, i) => (
            <button
              key={i}
              className={`${i < 2 ? 'muted' : ''} ${day === 23 ? 'today' : ''} ${day === selected ? 'selected-day' : ''}`}
              onClick={() => setSelected(day)}
            >
              <span>{day}</span>
              {day === 18 && <em className="event draft-event">ایده‌های هفته کتاب</em>}
              {day === 23 && (
                <>
                  <em className="event approved-event">عادت مطالعه</em>
                  <em className="more-event">۱ مورد دیگر</em>
                </>
              )}
              {day === 25 && <em className="event scheduled-event">معرفی دوره مدیریت زمان</em>}
              {day === 28 && <em className="event scheduled-event">۳ تمرین تمرکز</em>}
            </button>
          ))}
        </div>
      </Card>
      <Card className="selected-date">
        <div>
          <span className="date-box">
            <b>{selected}</b>
            <small>اردیبهشت</small>
          </span>
          <div>
            <h3>برنامه این روز</h3>
            <p>یک محتوا برای انتشار برنامه‌ریزی شده است.</p>
          </div>
        </div>
        <Link href="/content/2">
          <b>معرفی دوره مدیریت زمان</b>
          <span>
            <Icon name="clock" /> ساعت ۱۸:۳۰
          </span>
          <Badge tone="info">زمان‌بندی‌شده</Badge>
          <Icon name="chevron" />
        </Link>
      </Card>
    </>
  )
}

function BrandScreen({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="narrow-page">
      <PageTitle
        title="پروفایل برند"
        subtitle="این اطلاعات کمک می‌کند همه خروجی‌ها با هویت واقعی برندت هماهنگ باشند."
      />
      <Card className="profile-completion">
        <div>
          <span>
            <Icon name="brand" />
          </span>
          <div>
            <h3>پروفایل شما ۶۰٪ کامل است</h3>
            <p>با تکمیل مخاطب هدف و نمونه متن، نتیجه‌ها دقیق‌تر می‌شوند.</p>
          </div>
        </div>
        <div>
          <span>۶۰٪</span>
          <i>
            <b />
          </i>
        </div>
      </Card>
      <Card className="form-card">
        <div className="section-heading">
          <span>
            <Icon name="brand" />
          </span>
          <div>
            <h2>اطلاعات پایه برند</h2>
            <p>هر زمان خواستی می‌توانی این موارد را به‌روزرسانی کنی.</p>
          </div>
        </div>
        <div className="form-grid two-col">
          <Field label="نام برند" required>
            <Input defaultValue="آکادمی رشدانه" />
          </Field>
          <Field label="نوع کسب‌وکار" required>
            <Select defaultValue="آموزشی">
              <option>آموزشی</option>
              <option>فروشگاه آنلاین</option>
              <option>خدمات حرفه‌ای</option>
            </Select>
          </Field>
          <Field label="مخاطب هدف" required>
            <Textarea rows={4} placeholder="سن، علاقه‌مندی، دغدغه و نیازهای مخاطبان..." />
          </Field>
          <Field label="لحن برند" required>
            <Select defaultValue="صمیمی و حرفه‌ای">
              <option>صمیمی و حرفه‌ای</option>
              <option>رسمی</option>
              <option>الهام‌بخش</option>
            </Select>
          </Field>
          <Field label="درباره برند" required>
            <Textarea
              rows={5}
              defaultValue="رشدانه به افراد پرمشغله کمک می‌کند با آموزش‌های کوتاه و کاربردی، عادت‌های بهتر و زندگی پربارتری بسازند."
            />
          </Field>
          <Field label="نمونه متن‌های برند" hint="اختیاری؛ برای شناخت بهتر سبک نوشتاری شما">
            <Textarea rows={5} placeholder="یک یا چند متن موفق قبلی را اینجا وارد کنید..." />
          </Field>
        </div>
        <div className="form-actions">
          <Button variant="ghost">لغو تغییرات</Button>
          <Button icon="check" onClick={() => notify('اطلاعات برند ذخیره شد')}>
            ذخیره تغییرات
          </Button>
        </div>
      </Card>
    </div>
  )
}

function SettingsScreen({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="narrow-page">
      <PageTitle title="تنظیمات" subtitle="حساب کاربری و ترجیحات کُنتِوو را مدیریت کن." />
      <div className="settings-layout">
        <aside>
          <button className="active">
            <Icon name="brand" />
            حساب کاربری
          </button>
          <button>
            <Icon name="bell" />
            اعلان‌ها
          </button>
          <button>
            <Icon name="settings" />
            تنظیمات عمومی
          </button>
        </aside>
        <Card className="settings-card">
          <h2>اطلاعات حساب کاربری</h2>
          <p>اطلاعات شخصی و راه ارتباطی خود را ویرایش کنید.</p>
          <div className="avatar-editor">
            <span className="avatar large">ن‌ا</span>
            <div>
              <b>تصویر پروفایل</b>
              <small>فرمت JPG یا PNG، حداکثر ۲ مگابایت</small>
              <Button variant="secondary">تغییر تصویر</Button>
            </div>
          </div>
          <div className="form-grid two-col">
            <Field label="نام و نام خانوادگی">
              <Input defaultValue="نیلوفر احمدی" />
            </Field>
            <Field label="ایمیل">
              <Input dir="ltr" defaultValue="niloufar@example.com" />
            </Field>
          </div>
          <hr />
          <div className="toggle-row">
            <div>
              <b>اعلان‌های ایمیلی</b>
              <p>به‌روزرسانی وضعیت تأیید محتوا را با ایمیل دریافت کن.</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <i />
            </label>
          </div>
          <div className="form-actions">
            <Button onClick={() => notify('تنظیمات ذخیره شد')}>ذخیره تغییرات</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function ContentDetail({ notify }: { notify: (message: string) => void }) {
  return (
    <>
      <PageTitle
        title="جزئیات محتوا"
        subtitle="ساخت عادت مطالعه"
        action={
          <div className="title-actions">
            <Button variant="secondary" icon="edit">
              ویرایش
            </Button>
            <Button icon="link" onClick={() => notify('لینک تأیید کپی شد')}>
              اشتراک برای تأیید
            </Button>
          </div>
        }
      />
      <div className="detail-layout">
        <Card className="content-preview">
          <div className="preview-head">
            <div>
              <span className="type-icon">
                <Icon name="edit" />
              </span>
              <div>
                <h2>۵ راه ساده برای ساخت عادت مطالعه</h2>
                <p>کپشن · آخرین ویرایش امروز، ۱۰:۴۵</p>
              </div>
            </div>
            <Badge tone="success">تأییدشده</Badge>
          </div>
          <article>
            {generatedText.split('\n').map((x, i) => (
              <p key={i}>{x || <br />}</p>
            ))}
          </article>
          <div className="preview-actions">
            <Button variant="secondary" icon="copy" onClick={() => notify('متن کپی شد')}>
              کپی متن
            </Button>
            <Button variant="secondary" icon="calendar">
              زمان‌بندی انتشار
            </Button>
          </div>
        </Card>
        <aside className="detail-side">
          <Card>
            <h3>گردش تأیید</h3>
            <div className="timeline">
              <div className="done">
                <i>
                  <Icon name="check" />
                </i>
                <span>
                  <b>محتوا ساخته شد</b>
                  <small>۲۱ اردیبهشت، ۱۶:۲۰</small>
                </span>
              </div>
              <div className="done">
                <i>
                  <Icon name="send" />
                </i>
                <span>
                  <b>برای مشتری ارسال شد</b>
                  <small>۲۲ اردیبهشت، ۰۹:۱۰</small>
                </span>
              </div>
              <div className="done">
                <i>
                  <Icon name="check" />
                </i>
                <span>
                  <b>تأیید شد</b>
                  <small>امروز، ۱۰:۴۵</small>
                </span>
              </div>
            </div>
          </Card>
          <Card>
            <h3>لینک تأیید مشتری</h3>
            <p>بدون نیاز به ساخت حساب، مشتری می‌تواند محتوا را بررسی کند.</p>
            <div className="share-link">
              <span dir="ltr">contevo.app/a/8fd2k</span>
              <Button variant="ghost" icon="copy" onClick={() => notify('لینک کپی شد')} />
            </div>
            <small>این لینک تا زمانی که محتوا حذف نشود معتبر است.</small>
          </Card>
          <Button variant="ghost" icon="trash" className="danger-link">
            حذف محتوا
          </Button>
        </aside>
      </div>
    </>
  )
}

function AuthScreen({ register }: { register: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const submit = () => {
    setLoading(true)
    window.setTimeout(() => router.push('/'), 900)
  }
  return (
    <main className="auth-page" dir="rtl">
      <section className="auth-form">
        <Link href="/" className="brand-lockup auth-logo">
          <span>
            <Icon name="sparkles" />
          </span>
          <div>
            <strong>کُنتِوو</strong>
            <small>دستیار هوشمند محتوا</small>
          </div>
        </Link>
        <div className="auth-copy">
          <h1>{register ? 'حسابت را بساز' : 'خوش برگشتی'}</h1>
          <p>
            {register
              ? 'در چند ثانیه فضای کاری محتوایت را راه‌اندازی کن.'
              : 'برای ادامه وارد حساب کُنتِوو شو.'}
          </p>
        </div>
        {register && (
          <Field label="نام و نام خانوادگی">
            <Input placeholder="مثلاً نیلوفر احمدی" />
          </Field>
        )}
        <Field label="ایمیل">
          <Input dir="ltr" type="email" placeholder="name@example.com" />
        </Field>
        <Field label="رمز عبور">
          <Input dir="ltr" type="password" placeholder="حداقل ۸ نویسه" />
        </Field>
        {!register && (
          <div className="auth-options">
            <label>
              <input type="checkbox" />
              مرا به خاطر بسپار
            </label>
            <button>رمز عبور را فراموش کرده‌اید؟</button>
          </div>
        )}
        <Button className="full-button" onClick={submit}>
          {loading ? (
            <>
              <span className="spinner" />
              {register ? 'در حال ساخت حساب...' : 'در حال ورود...'}
            </>
          ) : register ? (
            'ساخت حساب کاربری'
          ) : (
            'ورود به کُنتِوو'
          )}
        </Button>
        <p className="auth-switch">
          {register ? 'قبلاً حساب ساخته‌اید؟' : 'هنوز حساب ندارید؟'}{' '}
          <Link href={register ? '/login' : '/register'}>
            {register ? 'وارد شوید' : 'ثبت‌نام کنید'}
          </Link>
        </p>
      </section>
      <aside className="auth-art">
        <div className="art-glow" />
        <div className="quote-card">
          <span>
            <Icon name="sparkles" />
          </span>
          <blockquote>
            «حالا به‌جای خیره شدن به صفحه سفید، در چند دقیقه یک پیش‌نویس خوب دارم که واقعاً شبیه لحن
            برند ماست.»
          </blockquote>
          <div>
            <span className="avatar">م‌ج</span>
            <p>
              <b>مریم جعفری</b>
              <small>مدیر محتوای رُشدینو</small>
            </p>
          </div>
        </div>
        <p>از ایده تا محتوای تأییدشده، در یک فضای ساده و فارسی.</p>
      </aside>
    </main>
  )
}

function ApprovalScreen({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState<'view' | 'revision' | 'success'>('view')
  const [comment, setComment] = useState('')
  if (mode === 'success')
    return (
      <main className="approval-page" dir="rtl">
        <div className="approval-logo">
          <span>
            <Icon name="sparkles" />
          </span>
          <b>کُنتِوو</b>
        </div>
        <Card className="approval-success">
          <span>
            <Icon name="check" />
          </span>
          <h1>نظر شما با موفقیت ثبت شد</h1>
          <p>تیم محتوا از پاسخ شما مطلع شد. می‌توانید این صفحه را ببندید.</p>
          <small>ثبت‌شده در ۲۳ اردیبهشت ۱۴۰۴، ساعت ۱۱:۲۰</small>
        </Card>
      </main>
    )
  return (
    <main className="approval-page" dir="rtl">
      <header>
        <div className="approval-logo">
          <span>
            <Icon name="sparkles" />
          </span>
          <b>کُنتِوو</b>
        </div>
        <span>پیش‌نمایش محتوا برای تأیید</span>
      </header>
      <div className="approval-container">
        <div className="approval-heading">
          <div>
            <Badge tone="info">در انتظار تأیید شما</Badge>
            <h1>۵ راه ساده برای ساخت عادت مطالعه</h1>
            <p>ارسال‌شده از طرف آکادمی رشدانه · ۲۳ اردیبهشت ۱۴۰۴</p>
          </div>
          <span className="format-chip">
            <Icon name="edit" />
            کپشن اینستاگرام
          </span>
        </div>
        <Card className="approval-content">
          <article>
            {generatedText.split('\n').map((x, i) => (
              <p key={i}>{x || <br />}</p>
            ))}
          </article>
        </Card>
        {mode === 'revision' ? (
          <Card className="revision-box">
            <h3>چه چیزی نیاز به اصلاح دارد؟</h3>
            <p>لطفاً توضیح کوتاهی بنویسید تا تیم محتوا دقیق‌تر تغییرات را انجام دهد.</p>
            <Textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="مثلاً: لحن پاراگراف دوم رسمی‌تر باشد..."
            />
            {!comment && (
              <small className="error-text">ثبت توضیح برای درخواست اصلاح الزامی است.</small>
            )}
            <div>
              <Button variant="ghost" onClick={() => setMode('view')}>
                انصراف
              </Button>
              <Button variant="danger" disabled={!comment} onClick={() => setMode('success')}>
                ثبت درخواست اصلاح
              </Button>
            </div>
          </Card>
        ) : (
          <div className="approval-actions">
            <div>
              <Button variant="secondary" icon="edit" onClick={() => setMode('revision')}>
                درخواست اصلاح
              </Button>
              <Button
                icon="check"
                onClick={() => {
                  notify('محتوا تأیید شد')
                  setMode('success')
                }}
              >
                تأیید محتوا
              </Button>
            </div>
            <p>با انتخاب تأیید، این محتوا آماده انتشار خواهد شد.</p>
          </div>
        )}
      </div>
      <footer>این صفحه امن است و فقط افراد دارای لینک به آن دسترسی دارند.</footer>
    </main>
  )
}
