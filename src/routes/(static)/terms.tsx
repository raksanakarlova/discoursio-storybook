import { StaticPage } from '~/components/Views/StaticPage'

export default () => (
  <StaticPage title={'Terms of use'} desc={'Rules of the journal Discours'}>
    <p>
      Дискурс — это сообщество творческих людей, объединенных идеей делать интересный журнал для
      всех желающих. Авторы Дискурса сообща посредством прямого голосования определяют содержание журнала.
    </p>
    <p>Для того, чтобы Дискурс работал без помех, разработаны настоящие Правила.</p>
    <h3 id="definitions">Определения</h3>
    <p>
      <strong>Сайт</strong> — портал discours.io
    </p>
    <p>
      <strong>Пользователь</strong> — лицо, пользующееся Сайтом, либо юридическое лицо,
      обладающее правами на интеллектуальную собственность.
    </p>
    <p>
      <strong>Публикация контента</strong> — размещение Пользователем посредством Сайта объектов
      авторских прав и другой информации для других пользователей.
    </p>
    <p>
      <strong>Издательство</strong> — администрация сайта, которая занимается технической
      и издательской деятельностью для обеспечения функционирования Сайта и Альманаха.
      Издательство не вмешивается в принятие редакционных решений авторским сообществом.
    </p>
    <p>
      <strong>Альманах «Дискурс»</strong> (свидетельство о регистрации СМИ: ПИ &#8470;
      ФС77-63947 от 18.12.15) — печатное периодическое издание, которое выходит раз
      в год и состоит из лучших публикаций на Сайте за это время.
    </p>
    <h3 id="copyright">Авторские права</h3>
    <ol>
      <li>
        <p>
          Вся информация на сайте (включая тексты, изображения, видеоматериалы, аудиозаписи,
          программный код, дизайн сайта и т.д.) является объектом интеллектуальной собственности
          ее правообладателей и охраняется законодательством РФ.
        </p>
      </li>
      <li>
        <p>
          Публикуя контент на сайте, Пользователь на безвозмездной основе предоставляет
          Издательству право на воспроизведение, распространение, перевод, редактирование контента.
          Данное право предоставляется Издательству на весь срок действия авторских прав Пользователя.
        </p>
      </li>
      <li>
        <p>
          Пользователь предоставляет Издательству право редактировать контент, в том числе вносить
          в него изменения, сокращения и дополнения, снабжать его иллюстрациями
          и пояснениями, исправлять ошибки и уточнять фактические сведения, при условии, что этим
          не искажается авторский замысел.
        </p>
      </li>
      <li>
        <p class="ng-binding">
          Обнародование контента осуществляется Издательством в соответствии с условиями лицензии{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.ru"
            target="_blank"
            rel="noreferrer"
          >
            Creative Commons BY-NC-ND 4.0
          </a>
          . Все материалы сайта предназначены исключительно для личного некоммерческого использования. Права
          на дизайн и программный код сайта принадлежат Издательству.
        </p>
      </li>
      <li>
        <p class="ng-binding">
          Все аудиовизуальные произведения являются собственностью своих авторов и правообладателей
          и используются только в образовательных и информационных целях. Если
          вы являетесь собственником того или иного произведения и не согласны с его
          размещением на сайте, пожалуйста, напишите на
          <a href="mailto:welcome@discours.io" target="_blank" rel="noreferrer">
            welcome@discours.io
          </a>
          .
        </p>
      </li>
      <li>
        <p>
          Цитирование, распространение, доведение до всеобщего сведения материалов Cайта
          приветствуется. При использовании материалов сайта необходимо указать имя автора и активную
          ссылку на материал на Сайте.
        </p>
      </li>
    </ol>
    <h3 id="rules">Правила поведения</h3>
    <ol>
      <li>
        <p>
          Находясь на Сайте, Пользователь подтверждает свое совершеннолетие, правоспособность,
          а также согласие с настоящими Правилами и политикой конфиденциальности
          и готовность нести полную ответственность за их соблюдение.
        </p>
      </li>
      <li>
        <h4>На сайте запрещено:</h4>
        <ul>
          <li>
            Публиковать контент, авторские права на который принадлежат третьим лицам, без согласия
            этих лиц. Если авторские права на контент принадлежат нескольким лицам, то его публикация
            предполагает согласие их всех.
          </li>
          <li>Размещать коммерческую и политическую рекламу.</li>
          <li>
            Целенаправленно препятствовать нормальному функционированию сообщества и сайта discours.io
          </li>
          <li>Выдавать себя за другого человека и представляться его именем.</li>
          <li>
            Размещать информацию, которая не соответствует целям создания Сайта, ущемляет интересы
            других пользователей или третьих лиц, нарушает законы Российской Федерации.
          </li>
        </ul>
      </li>
      <li>
        <p>
          Пользователь несет всю ответственность за содержание публикуемого контента и свое
          взаимодействие с другими пользователями, и обязуется возместить все расходы
          в случае предъявления каких-либо претензий третьими лицами. Издательство не несет
          ответственности за содержание публикуемой пользователями информации, в том числе
          за размещенные на сайте комментарии. Переписка между Пользователем и Издательством
          считается юридически значимой. Настоящие Правила могут быть изменены Издательством, изменения
          вступают в силу с момента публикации на Сайте.
        </p>
      </li>
      <li>
        <p>
          Если Пользователь очевидно и целенаправленно нарушает правила, Издательство может
          и принять в отношении автора следующие меры: вынести предупреждение и обязать
          автора устранить допущенное нарушение, удалить контент, нарушающий правила, заблокировать или
          удалить аккаунт нарушителя.
        </p>
      </li>
    </ol>
    <h3 id="privacy-policy">Политика конфиденциальности</h3>
    <ol>
      <li>
        <p>Сайт может собирать у пользователей следующие данные:</p>
        <ul>
          <li>
            <p>
              Данные, которые пользователи сообщают о себе сами при подаче заявки, регистрации,
              авторизации или заполнения профиля, в том числе ФИО и контактную информацию.
              Конфиденциальные данные, такие как идентификатор и электронный адрес, используются для
              идентификации пользователя. Данные профиля, размещённые публично по желанию пользователя,
              которое выражается фактом их предоставления, используется для демонстрации другим
              пользователям той информации о себе, которую пользователь готов предоставить.
            </p>
          </li>
          <li>
            <p>
              Данные, собранные автоматическим путем, такие, как cookie-файлы. Эти неперсонализированные
              данные могут использоваться для сбора статистики и улучшения работы сайта.
            </p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          Издательство обеспечивает конфиденциальность персональных данных и применяет все необходимые
          организационные и технические меры по их защите.
        </p>
      </li>
      <li>
        <p class="ng-binding">
          По желанию пользователя Издательство готово удалить любую информацию о нем, собранную
          автоматическим путем. Для этого следует написать на адрес электронной почты{' '}
          <a href="mailto:welcome@discours.io" target="_blank" rel="noreferrer">
            welcome@discours.io
          </a>
          .
        </p>
      </li>
      <li>
        <p>
          Если в информации, предоставляемой Издательству Пользователем, содержатся персональные данные
          последнего, то фактом их предоставления он соглашается на их обработку любым
          способом, не запрещенным законодательством РФ.
        </p>
        <p class="ng-binding">
          Общедоступные видео на сайте могут транслироваться с YouTube и регулируются{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            политикой конфиденциальности Google
          </a>
          . Загрузка видео на сайт также означает согласие с
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">
            Условиями использования YouTube
          </a>
          .
        </p>
      </li>
      <li>
        <p>
          Данные, которые мы получаем от вас, мы используем только в соответствии
          с принципами обработки данных, указанными в этом документе.
        </p>
      </li>
    </ol>
    <h3 id="feedback">Обратная связь</h3>
    <p class="ng-binding">
      Любые вопросы и предложения по поводу функционирования сайта можно направить
      по электронной почте{' '}
      <a href="mailto:welcome@discours.io" target="_blank" rel="noreferrer">
        welcome@discours.io
      </a>{' '}
      или через форму <a href="/connect">«предложить идею»</a>.
    </p>
  </StaticPage>
)
