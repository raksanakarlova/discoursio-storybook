export const dictionaryBefore = [
  'а',
  'без',
  'в',
  'во',
  'до',
  'за',
  'из',
  'к',
  'ко',
  'на',
  'над',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'про',
  'с',
  'со',
  'у',
  'через',
  'близ',
  'вне',
  'для',
  'меж',
  'ради',
  'среди',
  'около',
  'против',
  'между',
  'перед',
  'вокруг',
  'возле',
  'и',
  'но',
  'да',
  'или',
  'либо',
  'ни',
  'как',
  'то',
  'не',
  'что',
  'ведь',
  'вот',
  'вон',
  'именно',
  'лишь',
  'просто',
  'прямо',
  'только',
  'даже',
  'уже',
  'еще',
  'все',
  'однако',
  'хоть',
  'хотя',
  'будто',
  'словно',
  'точно',
  'ровно',
  'так',
  'если',
  'чтобы',
  'вдруг',
  'опять',
  'снова',
  'вновь',
  'тоже',
  'также',
  'почти',
  'едва',
  'чуть',
  'совсем',
  'совершенно',
  'абсолютно',
  'мол',
  'дескать',
  'якобы',
  'авось',
  'небось',
  'никак',
  'неужели',
  'разве',
  'ужели',
  'вряд',
  'пусть',
  'пускай',
  'давай',
  'давайте',
  'нет',
  'конечно',
  'несомненно',
  'безусловно',
  'итак',
  'следовательно',
  'значит',
  'поэтому',
  'потому',
  'вообще',
  'кстати',
  'кроме',
  'впрочем',
  'однако',
  'это',
  'эта',
  'этот',
  'эти',
  'та',
  'тот',
  'те',
  'ну',
  'аж',
  'вплоть',
  'ведь',
  'весьма',
  'крайне',
  'очень',
  'слишком',
  'всего',
  'всего-навсего',
  'лишь',
  'только',
  'исключительно',
  'вроде',
  'типа',
  'наподобие',
  'когда',
  'куда',
  'откуда',
  'зачем',
  'почему',
  'отчего',
  'где',
  'кто',
  'кого',
  'кому',
  'кем',
  'который',
  'которая',
  'которое',
  'которые',
  'чей',
  'чья',
  'чье',
  'чьи',
  'каков',
  'какова',
  'каково',
  'каковы',
  'сколько',
  'насколько',
  'настолько',
  'пока',
  'пока не',
  'едва',
  'едва не',
  'чем',
  'нежели',
  'словно',
  'будто',
  'хоть',
  'хотя',
  'пускай',
  'пусть',
  'раз',
  'раз уж',
  'коли',
  'коль',
  'чуть',
  'чуть ли не',
  'чуть не',
  'a',
  'to',
  'in',
  'into',
  'from',
  'get',
  'of',
  'out',
  'the',
  'is',
  'are',
  'be',
  'at'
]

export const dictionaryAfter = [
  'ли',
  'же',
  'бы',
  'б',
  'ж',
  'таки',
  'как',
  'так',
  'эдак',
  'эти',
  'это',
  'эта',
  'этот',
  'те',
  'то',
  'та',
  'тот',
  'а',
  'и',
  'но',
  'да',
  'нет'
]

export const processPrepositions = (text: string): string => {
  const prepositionRegexBefore = new RegExp(`(^|\\s)(${dictionaryBefore.join('|')})(\\s|$)`, 'gmi')
  const prepositionRegexAfter = new RegExp(`(\\S+)\\s+(${dictionaryAfter.join('|')})(\\s|$)`, 'gmi')

  return text
    .replace(prepositionRegexBefore, (_match, start, word, _end) => {
      return `${start}${word}&nbsp;`
    })
    .replace(prepositionRegexAfter, (_match, word, particle, end) => {
      return `${word}&nbsp;${particle}${end}`
    })
}
