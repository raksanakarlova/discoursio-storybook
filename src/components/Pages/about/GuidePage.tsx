import { createSignal, Show } from 'solid-js'
import { MainLayout } from '../../Layouts/MainLayout'
import { t } from '../../../utils/intl'
import { Icon } from '../../Nav/Icon'

export const GuidePage = () => {
  const title = t('How it works')

  const [indexExpanded, setIndexExpanded] = createSignal(true)

  const toggleIndexExpanded = () => setIndexExpanded((oldExpanded) => !oldExpanded)

  return (
    <MainLayout>
      {/*<Meta name="description" content={title} />*/}
      {/*<Meta name="keywords" content={t('Discours') + ',' + title} />*/}
      {/*<Meta property="og:title" content={title} />*/}
      {/*<Meta property="og:description" content={title} />*/}
      {/*<Meta property="og:image" content="/images/participation.png" />*/}
      {/*<Meta property="og:image:width" content="1200" />*/}
      {/*<Meta property="og:image:height" content="630" />*/}

      <article class="container container--static-page">
        <div class="row">
          <div class="col-md-4 col-lg-3 order-md-last">
            <button class="button button--content-index" onClick={toggleIndexExpanded}>
              <Show when={!indexExpanded()}>
                <Icon name="content-index-control" />
              </Show>
              <Show when={indexExpanded()}>
                <Icon name="content-index-control-expanded" class={'expanded'} />
              </Show>
            </button>

            <Show when={indexExpanded()}>
              <nav class="content-index">
                <h4>Оглавление</h4>

                <ul class="nodash">
                  <li>
                    <a href="#how-it-works">{title}</a>
                  </li>
                  <li>
                    <a href="#become-author">Как стать автором журнала</a>
                  </li>
                  <li>
                    <a href="#voting">Как проходит голосование</a>
                  </li>
                  <li>
                    <a href="#editing">Как мы делаем тексты друг друга лучше</a>
                  </li>
                  <li>
                    <a href="#perks">Что сообщество дает авторам</a>
                  </li>
                  <li>
                    <a href="#contacts">Как быть в курсе</a>
                  </li>
                </ul>
              </nav>
            </Show>
          </div>

          <div class="col-md-6 col-xl-7 shift-content order-md-first">
            <h1 id="about">
              <span class="wrapped">Как устроен Дискурс</span>
            </h1>

            <p>
              Дискурс&nbsp;&mdash; независимый журнал о&nbsp;культуре, науке, искусстве и&nbsp;обществе
              с&nbsp;<a href="/about/manifest">открытой редакцией</a>. У&nbsp;нас нет главного редактора,
              инвестора и&nbsp;вообще никого, кто&nbsp;бы принимал единоличные решения. Вместо традиционных
              иерархий Дискурс основан на&nbsp;принципах прямой демократии: в&nbsp;нашем горизонтальном
              сообществе все редакционные вопросы решаются открытым голосованием авторов журнала. Вот как
              это работает.
            </p>
            <h3 id="how-it-works">Как устроен сайт Дискурса</h3>
            <p>Дискурс состоит из&nbsp;четырех основных разделов:</p>
            <ul>
              <li>
                <p>
                  <a href="/topics">Темы</a>&nbsp;&mdash; у&nbsp;нас публикуются исследования, обзоры, эссе,
                  интервью, репортажи, аналитика и&nbsp;другие материалы о&nbsp;культуре, науке, искусстве
                  и&nbsp;обществе.
                </p>
              </li>
              <li>
                <p>
                  <a href="/topic/art">Искусство</a>&nbsp;&mdash; здесь, например, представлены
                  художественные произведения: литература, живопись, музыка, фотографии, видео. Этот раздел
                  помогает прозвучать новому искусству, которое создают российские художники, писатели,
                  режиссёры и&nbsp;музыканты.
                </p>
              </li>
              {/*
              <li>
            <p>
            <a href="/topic/events">События</a>&nbsp;— в&nbsp;этом разделе
            публикуются самые важные, по&nbsp;мнению редакции, культурные
            события России — выставки, лекции, концерты, кинопоказы, фестивали,
            художественные и политические&nbsp;акции. Напишите&nbsp;нам
            на&nbsp;<a href="mailto:welcome@discours.io" target="_blank">почту</a>, если вы
            хотите разместить объявление. Мы делаем&nbsp;это
            на&nbsp;безвозмездной основе.
            </p>
          </li >
              <li>
                <p>
                  <a href="/create" class="ng-scope" target="_blank">Редакция</a>&nbsp;—
                  это внутренний раздел, где появляются новые материалы, которые присылают
                  в&nbsp;редакцию. Здесь авторы обсуждают, редактируют и&nbsp;оценивают
                  публикации, определяя таким образом содержание журнала.
                </p>
              </li>
      */}
            </ul>
            <p>
              Материалы в&nbsp;Дискурсе объединяются по&nbsp;<b>темам</b>
              &mdash;&nbsp;ключевым словам, которые располагаются в&nbsp;конце материалов и&nbsp;связывают
              материалы по&nbsp;жанрам (например,
              <a href="/topic/interview">интервью</a>, <a href="/topic/reportage">репортажи</a>,{' '}
              <a href="/topic/essay">эссе</a>, <a href="/topic/likbez">ликбезы</a>), по&nbsp;тематике (
              <a href="/topic/cinema">кино</a>, <a href="/topic/philosophy">философия</a>,{' '}
              <a href="/topic/history">история</a>, <a href="/topic/absurdism">абсурдизм</a>,{' '}
              <a href="/topic/sex">секс</a> и&nbsp;т.д.) или в&nbsp;серии (как &laquo;
              <a href="/topic/zakony-mira">Законы мира</a>&raquo; или &laquo;
              <a href="/topic/za-liniey-mannergeyma">За&nbsp;линией Маннергейма</a>&raquo;). Темы объединяют
              сотни публикаций, помогают ориентироваться в&nbsp;журнале и&nbsp;следить за&nbsp;интересными
              материалами.
            </p>

            <section>
              <h3 id="become-author">Как стать автором журнала</h3>
              <p>
                Дискурс объединяет журналистов, активистов, музыкантов, художников, фотографов, режиссеров,
                философов, ученых и&nbsp;других замечательных людей. Каждый может{' '}
                <a href="/create">прислать</a>
                свой материал в&nbsp;журнал. Формат и&nbsp;тематика не&nbsp;имеют значения, единственное,
                что важно &mdash; <a href="/how-to-write-a-good-article">хороший</a> ли&nbsp;материал. Если
                сообщество поддержит вашу публикацию, она выйдет в&nbsp;журнале и&nbsp;станет доступна
                тысячам наших читателей.
              </p>
            </section>

            <h3 id="voting">Как проходит голосование</h3>
            <p>
              Все присылаемые в&nbsp;Дискурс материалы попадают в&nbsp;
              <strong>&laquo;Редакцию&raquo;</strong>. Это внутренний раздел сайта, где участники сообщества
              решают, что будет опубликовано в&nbsp;Дискурсе. Как только работа получает одобрение как
              минимум пятерых авторов открытой редакции, она немедленно публикуется в&nbsp;журнале.
              Если&nbsp;же материал набирает более&nbsp;20% голосов &laquo;против&raquo;,
              он&nbsp;не&nbsp;выходит и&nbsp;может быть отправлен на&nbsp;доработку. Жестких сроков
              рассмотрения материалов у&nbsp;нас нет, иногда это занимает час, иногда месяц,
              обычно&nbsp;&mdash; несколько дней.
            </p>
            <section>
              <p>
                Как только сообщество поддержит публикацию, вы&nbsp;получите приглашение
                в&nbsp;интернет-редакцию и&nbsp;сможете голосовать за&nbsp;новые материалы.
              </p>
            </section>

            <h3 id="editing">Как мы&nbsp;делаем тексты друг друга лучше</h3>
            <p>
              Дискурс&nbsp;&mdash; журнал с&nbsp;совместным редактированием. Совершенствовать тексты нам
              помогает <b>система ремарок</b>. Вы&nbsp;можете выделить часть текста в&nbsp;любой статье
              и&nbsp;оставить к&nbsp;ней замечание, вопрос или предложение&nbsp;&mdash; автор текста получит
              совет на&nbsp;почту и&nbsp;сможет его учесть. Так мы&nbsp;устраняем опечатки, неточности
              и&nbsp;советуем друг другу, как сделать тексты качественнее и&nbsp;интереснее.
            </p>
            <p>
              Среди участников сообщества есть профессиональные редакторы, которые помогают авторам делать
              тексты лучше. Если вашему материалу потребуется доработка, они помогут отредактировать текст,
              подобрать иллюстрации, придумать заголовок и&nbsp;красиво сверстать публикацию. Если
              вы&nbsp;хотите обсудить текст, прежде чем загрузить материал в интернет-редакцию&nbsp;&mdash;
              разместите его в&nbsp;google-документе, откройте доступ к&nbsp;редактированию по&nbsp;ссылке
              и&nbsp;напишите нам на&nbsp;
              <a href="mailto:welcome@discours.io" target="_blank">
                welcome@discours.io
              </a>
              .
            </p>
            <p>
              Если у&nbsp;вас возникают трудности с&nbsp;тем, чтобы подобрать к&nbsp;своему материалу
              иллюстрации, тоже пишите на&nbsp;
              <a href="mailto:welcome@discours.io" target="_blank">
                почту
              </a>
              &mdash; наши коллеги-художники могут вам помочь{' '}
              <a href="/create?collab" target="_blank">
                в&nbsp;режиме совместного редактирования
              </a>
              .
            </p>

            <h3 id="perks">Что сообщество дает авторам</h3>
            <ul>
              <li>
                <p>
                  <strong>Право определять, каким будет журнал</strong>. Дискурс&nbsp;&mdash; это
                  общественная институция, созданная людьми и&nbsp;ради людей, функционирующая
                  на&nbsp;условиях прямой демократии. Авторы публикуют статьи и&nbsp;художественные проекты,
                  участвуют в&nbsp;обсуждениях, голосуют за&nbsp;работы коллег и&nbsp;таким образом вносят
                  свой вклад в&nbsp;развитие проекта, определяя содержание и&nbsp;направление журнала.
                </p>
              </li>
              <li>
                <p>
                  <strong>Возможность обратиться к&nbsp;широкой аудитории</strong>. Дискурс читают десятки
                  тысяч людей, и&nbsp;с&nbsp;каждым днем их&nbsp;становится больше.
                </p>
              </li>
              <li>
                <p>
                  <strong>Поддержка редакции</strong>. Дискурс предоставляет авторам аккредитацию
                  на&nbsp;мероприятия, базу контактов, юридическую поддержку, ознакомление с&nbsp;книжными,
                  кино- и&nbsp;музыкальными новинками до&nbsp;их&nbsp;выхода в&nbsp;свет. Если что-то
                  из&nbsp;этого вам понадобится, пишите на&nbsp;почту{' '}
                  <a href="mailto:welcome@discours.io" target="_blank">
                    welcome@discours.io
                  </a>
                  &nbsp;&mdash; поможем.
                </p>
              </li>
              <li>
                <p>
                  <strong>Пресс-карты для корреспондентов</strong>. Три опубликованные статьи позволяют
                  авторам Дискурса получить официальные удостоверения журналистов (пресс-карты)
                  на&nbsp;следующий год. Пресс-карты удостоверяют, что вы&nbsp;журналист и&nbsp;можете
                  пользоваться всеми теми правами, которые гарантирует Закон о&nbsp;СМИ. Кроме того, многие
                  культурные институции (музеи, галереи и&nbsp;др.) предоставляют журналистам право
                  свободного входа.
                </p>
              </li>
              <li>
                <p>
                  <strong>Помощь сотен специалистов в&nbsp;разных областях</strong>. В&nbsp;основе Дискурса
                  лежит идея совместного редактирования. Участники редакционного сообщества&nbsp;&mdash;
                  несколько сотен журналистов, исследователей, художников, литераторов из&nbsp;разных стран
                  &mdash; изучают материалы друг друга до&nbsp;публикации и&nbsp;помогают сделать
                  их&nbsp;качественнее и&nbsp;интереснее. Так, в&nbsp;редакции нередко складываются
                  творческие союзы: например, авторов текстов и&nbsp;художников, создающих для них
                  иллюстрации.
                </p>
              </li>
              <li>
                <p>
                  <strong>Пространство общения полное выдающихся людей</strong>. Дискурс&nbsp;&mdash;
                  большое живое сообщество интеллектуалов, разбросанных по&nbsp;всему земному шару. Вступив
                  в&nbsp;редакцию, вы&nbsp;сможете познакомиться со&nbsp;множеством интересных людей,
                  которые определяют повестку завтрашнего дня, вдохновляют окружающих, создают новое
                  и&nbsp;изучают старое, ищут знания и&nbsp;готовы ими делиться, чтобы менять мир
                  в&nbsp;соответствии со&nbsp;своими идеалами.
                </p>
              </li>
            </ul>

            <h3 id="contacts">Как быть в&nbsp;курсе</h3>
            <p>
              За&nbsp;свежими публикациями Дискурса можно следить не&nbsp;только на&nbsp;сайте,
              но&nbsp;и&nbsp;на&nbsp;страницах в&nbsp;
              <a href="https://facebook.com/discoursio/" target="_blank">
                Фейсбуке
              </a>
              ,{' '}
              <a href="https://vk.com/discoursio" target="_blank">
                ВКонтакте
              </a>{' '}
              и&nbsp;
              <a href="https://t.me/discoursio" target="_blank">
                Телеграме
              </a>
              . А&nbsp;ещё раз в&nbsp;месяц мы&nbsp;отправляем <a href="#subscribe">почтовую рассылку</a>{' '}
              с&nbsp;дайджестом лучших материалов.
            </p>
            <p>
              Если вы&nbsp;хотите сотрудничать, что-то обсудить или предложить &mdash; пожалуйста, пишите
              на&nbsp;
              <a href="mailto:welcome@discours.io" target="_blank">
                welcome@discours.io
              </a>
              . Мы&nbsp;обязательно ответим.
            </p>
          </div>
        </div>
      </article>
    </MainLayout>
  )
}

// for lazy loading
export default GuidePage
