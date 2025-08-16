# ARCHIVE

Короткий огляд
Назва проєкту: ARCHIVE
Коротко: SPA на React + TypeScript (Create React App) для роботи з архівними картками/документами — UI для додавання, фільтрації, перегляду та затвердження документів. Фронтенд; бекенд не включено — HTTP-запити виконуються через axios / @tanstack/react-query.

## Технологічний стек

- React 18
- TypeScript
- Create React App (react-scripts)
- react-router-dom v6 — маршрутизація
- axios — HTTP-клієнт
- @tanstack/react-query — кешування/запити
- react-infinite-scroll-component — безкінечний скрол
- Cypress / Jest / Testing Library — тестування (devDependencies)
- Prettier — форматування

## Швидкий старт

Передумови
Node.js v16+ (рекомендується)
npm

### Клонування

git clone https://github.com/19Vako/ARCHIVE.git
cd ARCHIVE

### Встановлення залежностей

npm ci

### Запуск в режимі розробки

npm start
Відкрити http://localhost:3000

### Збірка production

npm run build

## Скрипти (package.json)

- start — запускає dev сервер (react-scripts start)
- build — production збірка (react-scripts build)
- test — запуск тестів
- eject — eject CRA (не рекомендується без потреби)

## Структура проекту (коротко)

/public
/src
  /components
  /context
  /screens
  /utils
  /icons
App.tsx
tsconfig.json
package.json
README.md


## Компоненти

### Header.tsx
- Відображає хедер із кнопкою виходу з акаунту

### AddCard.tsx
- Модальний контейнер для створення нової картки
- **Функції:**
  - GetCards — отримує картки з бекенду і оновлює глобальний стан (setCards, cards в Context.tsx)
  - cleanInputs — очищає поля форми (встановлює formData в initialFormData)
  - choiceFilter — відкриває модальне вікно фільтрації/перегляду, викликає cleanInputs(), ховає інтерфейс додатків, очищає список карток
- **Інтерфейс:** список карток, форма для створення картки, фінальна модалка для перегляду PDF та перевірки даних

### AddCardForm.tsx
- Форма для створення карток / додатків
- **Функції:**
  - handleFileChoose — читає вибраний файл через FileReader у Data URL (base64). Зберігає pdfURL, fileName, file
  - handleChange — оновлює formData. Для полів дати (docCreateDate, docSigningDate, validityPeriod) переформатовує з YYYY-MM-DD → DD-MM-YYYY
  - openAddDataModal(name, titleName) — відкриває/закриває модальне вікно додавання даних
  - openApproveModal — відкриває модалку підтвердження, якщо файл вибрано; інакше показує лог про відсутній файл (fileLog)
- **Поля:** тип документа, дати, строк дії, найменування, організація, коди ЄДРПОУ, тип договору, особистий номер, контрагент, вибір файлу, короткий зміст

### AddAddition.tsx
- Додавання додатків до основного документа
- **Функції:**
  - GetAdditions(docId) — POST-запит для отримання додаткових даних; зберігає additions
  - addAddition(docId, additionDocId) — POST-запит для додавання додатка; після успіху закриває модал і оновлює список
- **Інтерфейс:** кнопки додати/скасувати, список доданих посилань, деталі вибраного документу, короткий зміст, вбудований PDF-просмотр

### AddManager.tsx
- Прив’язка менеджера до картки; CRUD менеджерів
- **Функції:**
  - getManagers() — отримує список менеджерів
  - FindManager(name) — пошук менеджера за ім’ям
  - CleanInput() — очищає пошукове поле та оновлює список
  - AddManager(name, password) — додає менеджера через POST; оновлює ліст
  - ChangeManager(id, name, password) — змінює менеджера
  - DeleteManager(id) — видаляє менеджера (з підтвердженням)
- **Інтерфейс:** пошук, список менеджерів, форма додавання, блок редагування, модалка підтвердження видалення

### AdditionCardList.tsx
- Список доповнень картки
- **Функції:**
  - GetAdditions(docId) — отримання доповнень
  - choiseListAdditionCard(addition) — встановлює вибране доповнення, оновлює PDF для перегляду, викликає GetAdditions для пов’язаних додатків, ховає список додатків

### CardList.tsx
- Головний список карток
- **Функції:**
  - GetCards(page, limit) — отримує списки карток з пагінацією; додає в setCards
  - chooseCard(card) — встановлює картку у formData, показує картку та фільтри, ховає додатки, очищає попередні файли/логи, завантажує додатки та зберігає їх у setAdditions
- **Інтерфейс:** прокручуваний контейнер зі списком карток; кожна картка показує організацію, дату створення, термін дії

### FilterCard.tsx
- Фільтрація списку карток
- **Функції:**
  - GetCards — отримує картки
  - handleChange — оновлює filterFormData, форматує дати
  - filterCard — POST-запит з полями фільтра і автором, зберігає результат в setCards і логи
  - cleanInputs — скидає фільтри в initialFormData
  - openFilterDataModal(name, titleName) — керує модальним вікном фільтрації
- **Інтерфейс:** форма фільтрів (тип, дати, назва, організація, коди, автор), кнопки «Фільтрувати» та скидання

### ApproveModal.tsx
- Модалка підтвердження / перевірки даних перед створенням картки
- **Функції:**
  - GetCards — оновлює список карток
  - cleanInputs — очищає форму
  - createCard(formData, file) — формує FormData, надсилає на сервер; після успіху очищає форму і оновлює список

### ShowCard.tsx
- Перегляд і редагування вибраної картки
- **Функції:**
  - GetCards — отримання списку карток
  - GetAdditions(cardId) — отримання додатків
  - handleFileChoose — вибір замінного файлу і попередній перегляд
  - choiseListCard — відкриття картки зі списку, підстановка даних в форму
  - openChangeDataModal(fieldName) — відкриття модалки редагування поля
  - changeCard(updatedData) — відправка оновлених даних на сервер, оновлення списку і логів
  - handleChangeCard — оновлення локальної форми і показ кнопки збереження
  - deleteCard(cardId) — видалення картки
- **Інтерфейс:** відображення полів картки, список додатків, попередній перегляд PDF, кнопки створити/додати/замінити файл/видалити/зберегти зміни

## Маршрути та контекст

### AppRoutes.tsx
- Керує маршрутизацією додатку
- Захищає сторінки менеджера та адміністратора
- Перенаправляє неавторизованих користувачів на екран входу
- Відображає сторінку документу по id

### context.tsx — глобальний стан (скорочено)

#### Авторизація та користувач
- `log_in: boolean` — стан авторизації
- `setLog_in: (state: boolean) => void` — змінити стан авторизації
- `userName: string` — ім’я користувача
- `setUserName: (name: string) => void` — змінити ім’я користувача

#### Картки
- `cards: CardType[]` — список карток
- `setCards: React.Dispatch<React.SetStateAction<CardType[]>>` — змінити список карток
- `showCard: boolean` — показ картки
- `setShowCard: (state: boolean) => void` — змінити стан показу
- `showCardDataLog: string` — лог даних картки
- `setShowCardDataLog: (log: string) => void` — змінити лог даних
- `formData: any` — дані форми картки
- `setFormData: (data: any) => void` — змінити дані форми
- `filterFormData: any` — дані фільтру карток
- `setFilterFormData: (data: any) => void` — змінити дані фільтру
- `showSaveChangesButton: boolean` — стан кнопки "Зберегти зміни"
- `setShowSaveChangesButton: (stateCard: boolean) => void` — змінити стан кнопки
- `showFilter: boolean` — показ фільтру
- `setShowFilter: (state: boolean) => void` — змінити стан показу

#### Файли та PDF
- `fileName: string` — назва файлу
- `setFileName: (state: string) => void` — змінити назву файлу
- `file: any` — файл (PDF або інше)
- `setFile: (state: any) => void` — змінити файл
- `pdfURL: any` — URL PDF
- `setPdfURL: (state: any) => void` — змінити URL
- `showCardPDF: any` — дані PDF картки
- `setShowCardPDF: (data: any) => void` — змінити PDF картки
- `getCardError: any` — лог помилок отримання картки
- `setGetCardError: (data: any) => void` — змінити лог помилок
- `fileLog: boolean` — логування стану файлу
- `setFileLog: (state: boolean) => void` — змінити логування

#### Фільтри та автори
- `filterLog: string` — лог фільтру
- `setFilterLog: (data: string) => void` — змінити лог фільтру
- `findAuthor: string` — автор для пошуку
- `setFindAuthor: (data: string) => void` — змінити автора

#### Створення картки
- `createCardError: boolean` — помилка при створенні картки
- `setCreateCardError: (state: boolean) => void` — змінити стан помилки

#### Додаткові документи
- `additions: Array<any>` — список додаткових документів
- `setAdditions: (additions: Array<any>) => void` — змінити список додаткових документів
- `showAddition: boolean` — показ додаткового документа
- `setShowAddition: (state: boolean) => void` — змінити стан показу
- `showAddAddition: boolean` — показ модалки додавання документа
- `setShowAddAddition: (state: boolean) => void` — змінити стан модалки
- `showAddAdditionData: any` — дані форми додаткового документа
- `setShowAddAdditionData: (data: any) => void` — змінити дані форми
- `showAddAdditionCardPDF: any` — PDF додаткового документа
- `setShowAddAdditionCardPDF: (data: any) => void` — змінити PDF
- `addAdditionLog: string` — лог додавання документа
- `setAddAdditionLog: (data: string) => void` — змінити лог

#### Модальне вікно підтвердження
- `showApproveModal: boolean` — показ модалки підтвердження
- `setShowApproveModal: (state: boolean) => void` — змінити стан модалки


## Сторінки / screens

### Admin.tsx
- Адміністративна сторінка з вибором режиму:
  - Додавання менеджера
  - Додавання картки
- **Інтерфейс:** Header, панель вибору дій (кнопки), основний блок з відповідною формою

### Log_in.tsx
- Екран авторизації
- **Поля:** ім’я, пароль
- **log_in** — робить запит на бекенд; при успіху зберігає userName, переходить залежно від ролі, встановлює log_in в контекст. Показує повідомлення про результат (зелений/червоний)

### Manager.tsx
- Робочий екран менеджера
- Отримує список карток при завантаженні (GetCards) і зберігає в глобальний стан
- Кнопки додавання картки, фільтрації, перегляду деталей
- Праворуч — форма додавання картки або фільтри / перегляд вибраної картки

### DocumentCard.tsx
- Екран деталізації документа
- **Функції:**
  - GetCard(id) — отримує дані по ID, оновлює форму, PDF і доповнення
  - GetAdditions — отримує додаткові картки
- **Інтерфейс:** повні поля документа, список доповнень (лінки), вбудований перегляд PDF, короткий зміст

## Утиліти /utils

### Utils.ts
- reverseWord — змінює порядок елементів дати через дефіс (наприклад YYYY-MM-DD ↔ DD-MM-YYYY)
- today() — повертає поточну дату у форматі YYYY-MM-DD
- formatDateForInput — конвертує дату DD-MM-YYYY → YYYY-MM-DD (для input[type="date"])

### Ікони /icons
- index.tsx
- App.tsx

## Файли конфігурації
- tsconfig.json
- package.json
- README.md


