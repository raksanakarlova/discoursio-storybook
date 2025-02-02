import { StaticPage } from '../../components/Views/StaticPage'

export default () => (
  <StaticPage title={'Dogma'}>
    <p>
      Дискурс — журнал с открытой горизонтальной редакцией. Содержание журнала определяется прямым
      голосованием его авторов. Мы нередко занимаем различные позиции по разным проблемам, но придерживаемся
      общих профессиональных принципов:
    </p>
    <ol>
      <li>
        <b>На первое место ставим факты.</b> Наша задача — не судить, а наблюдать и непредвзято фиксировать
        происходящее. Все утверждения и выводы, которые мы делаем, подтверждаются фактами, цифрами, мнениями
        экспертов или ссылками на авторитетные источники.
      </li>
      <li>
        <b>Ответственно относимся к источникам.</b> Мы выбираем только надежные источники, проверяем
        информацию и рассказываем, как и откуда мы её получили, кроме случаев, когда это может нанести вред
        источникам. Тогда мы не раскроем их, даже в суде.
      </li>
      <li>
        <b>Выбираем компетентных и независимых экспертов</b>, понимая всю степень ответственности перед
        аудиторией.
      </li>
      <li>
        <b>
          Даем возможность высказаться всем заинтересованным сторонам, но не присоединяемся ни к чьему
          лагерю.
        </b>{' '}
        Ко всем событиям, компаниям и людям мы относимся с одинаковым скептицизмом.
      </li>
      <li>
        <b>Всегда исправляем ошибки, если мы их допустили.</b> Никто не безгрешен, иногда и мы ошибаемся.
        Заметили ошибку — отправьте <a href="/guide#editing">ремарку</a> автору или напишите нам на{' '}
        <a href="mailto:welcome@discours.io" target="_blank" rel="noreferrer">
          welcome@discours.io
        </a>
        .
      </li>
    </ol>
  </StaticPage>
)
