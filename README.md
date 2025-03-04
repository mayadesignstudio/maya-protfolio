# פורטפוליו מאיה קלטי

פרויקט אתר פורטפוליו דיגיטלי להצגת תיק עבודות PDF כמערכת דפדוף אינטרנטית.

## מבנה הפרויקט

```
maya-portfolio/
├── index.html            # דף הכניסה הראשי
├── assets/               # תיקיית נכסים
│   ├── images/           # תמונות הפורטפוליו (19 דפים)
│   ├── js/               # קבצי JavaScript
│   └── css/              # קבצי CSS
└── README.md             # תיעוד הפרויקט
```

## הוראות התקנה

1. הורד את כל קבצי הפרויקט
2. הוסף את תמונות הפורטפוליו (19 תמונות) לתיקיית `assets/images/`
3. שמור את הקבצים בשמות `page-01.jpg`, `page-02.jpg` וכן הלאה עד `page-19.jpg` (עם אפסים מובילים)

## פיתוח מקומי

ניתן להריץ את האתר מקומית בכל דפדפן על ידי פתיחת קובץ `index.html` ישירות בדפדפן.

## העלאה לאינטרנט

הפרויקט מתוכנן לאירוח באמצעות:
- GitHub Pages
- Vercel
- או כל אחסון סטטי אחר לבחירתך

## אנליטיקה

הפרויקט כולל תמיכה מובנית ב-Google Analytics. להפעלת האנליטיקה:

1. צור חשבון Google Analytics אם אין לך
2. קבל מזהה מעקב (tracking ID) 
3. הוסף את קוד המעקב לתג ה-`<head>` של קובץ ה-HTML לפני קובץ ה-JavaScript הראשי

דוגמה לקוד מעקב:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## עדכון דפים

להוספה או עדכון דפים:
1. הוסף את התמונות החדשות לתיקיית `assets/images/`
2. שנה את ערך המשתנה `TOTAL_PAGES` בקובץ `assets/js/main.js` כדי לשקף את המספר העדכני של הדפים

## תמיכה בדפדפנים

הפרויקט תומך בדפדפנים המודרניים:
- Chrome
- Firefox
- Safari
- Edge

## טכנולוגיות
- HTML5 & CSS3
- JavaScript
- Swiper.js לניהול הדפדוף והתצוגה 