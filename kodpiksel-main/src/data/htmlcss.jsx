const htmlcss = {
  id:          'htmlcss',
  lang:        'HTML/CSS',
  color:       '#3bb1e0',
  eyebrow:     'HTML / CSS',
  title:       'Veb Səhifələrin Sehri',
  description: 'HTML ilə səhifələrin skeletini qur, CSS ilə onları gözəlləşdir. Sıfırdan başlayaraq öz veb səhifəni yarat.',
  modules: [
    {
      id: 'module-1', title: 'Dərs 1 — HTML Əsasları',
      status: 'active', lessonCount: 7,
      lessons: [
        { id:1, pill:1, chips:1, title:'Salam, HTML! İlk Teqimiz',         desc:'Brauzerə ilk "Salam Dünya!" mesajını göndəririk.' },
        { id:2, pill:2, chips:1, title:'Böyük Başlıq <h1>',                 desc:'Lövhənin üzərindəki ən böyük yazını necə qoyuruq?' },
        { id:3, pill:3, chips:1, title:'Paraqraflar <p>',                  desc:'Divardakı qeyd kağızı kimi — adi mətnləri yazırıq.' },
        { id:4, pill:4, chips:2, title:'Qalın və Maili Mətn',               desc:'<strong> və <em> ilə vacib sözləri önə çıxarırıq.' },
        { id:5, pill:5, chips:3, title:'Keçidlər: İnternetin Sehri <a>',    desc:'Bir səhifədən digərinə keçid necə qurulur?' },
        { id:6, pill:6, chips:3, title:'Sırasız Siyahılar <ul> və <li>',    desc:'Ən çox sevdiyimiz 3 şeyi siyahıya yığaq.' },
        { id:7, pill:7, chips:2, title:'Multimedia: Şəkillər <img>',        desc:'Veb səhifədə piksel şəkil nümayiş etdirək.' },
      ],
    },
    {
      id: 'module-2', title: 'Dərs 2 — CSS Stil və Vizualizasiya',
      status: 'active', lessonCount: 7,
      lessons: [
        { id:8,  pill:1, chips:1, title:'CSS Nədir?',                       desc:'Evi bəzəməyə başlayırıq — style atributu ilə tanış oluruq.' },
        { id:9,  pill:2, chips:2, title:'Rənglər <color>',                  desc:'Mətnə istənilən rəngi necə veririk?' },
        { id:10, pill:3, chips:1, title:'Şrift Ölçüsü <font-size>',         desc:'Lövhə yazılarını kiçik və ya nəhəng edirik.' },
        { id:11, pill:4, chips:1, title:'Mərkəzləşdirmə <text-align>',      desc:'Mətni sola, ortaya, ya da sağa yerləşdiririk.' },
        { id:12, pill:5, chips:2, title:'Qutu Modeli: padding & margin',    desc:'Hər elementin görünməz qutusunu kəşf edirik.' },
        { id:13, pill:6, chips:1, title:'Haşiyə <border>',                  desc:'Şəkil çərçivəsi kimi — elementə xətt çəkirik.' },
        { id:14, pill:7, chips:3, title:'Siniflər <class> & Seçicilər',     desc:'Bir qaydanı bir dəfə yazıb hər yerdə işlədirik.' },
      ],
    },
  ],
};

export default htmlcss;