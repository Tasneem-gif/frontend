import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="not-found" dir="rtl">
      <span>۴۰۴</span>
      <h1>این صفحه پیدا نشد</h1>
      <p>ممکن است لینک تغییر کرده یا دیگر در دسترس نباشد.</p>
      <Link className="btn btn-primary" href="/">
        بازگشت به داشبورد
      </Link>
    </main>
  )
}
