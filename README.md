# ARCHIVE

Короткий огляд
Назва проєкту: ARCHIVE
Коротко: SPA на React + TypeScript (Create React App) для роботи з архівними картками/документами — UI для додавання, фільтрації, перегляду та затвердження документів. Фронтенд; бекенд не включено — HTTP-запити виконуються через axios / @tanstack/react-query.

Технологічний стек

React 18

TypeScript

Create React App (react-scripts)

react-router-dom v6 — маршрутизація

axios — HTTP-клієнт

@tanstack/react-query — кешування/запити

react-infinite-scroll-component — безкінечний скрол

Cypress / Jest / Testing Library — тестування (devDependencies)

Prettier — форматування

Швидкий старт
Передумови

Node.js v16+ (рекомендується)

npm

Клонування
git clone https://github.com/19Vako/ARCHIVE.git
cd ARCHIVE

Встановлення залежностей
npm ci

Запуск в режимі розробки
npm start
# Відкрити http://localhost:3000

Збірка production
npm run build


Побудована папка — build. У package.json вказано homepage — перевірте чи потрібен цей шлях при деплої.

Скрипти (package.json)

start — запускає dev сервер (react-scripts start)

build — production збірка (react-scripts build)

test — запуск тестів

eject — eject CRA (не рекомендується без потреби)

Структура проекту (коротко)
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

Компоненти (опис)

Нижче — перелік основних компонентів з коротким описом їх логіки і функцій.

Header.tsx

Відображає хедер із кнопкою виходу з акаунту.

AddCard.tsx

Модальний контейнер для створення нової картки.

Функції:

GetCards — отримує картки з бекенду і оновлює глобальний стан (setCards, cards в Context.tsx).

cleanInputs — очищає поля форми (встановлює formData в initialFormData).

choiceFilter — відкриває модальне вікно фільтрації/перегляду (setShowFilter(true)), викликає cleanInputs(), ховає інтерфейс додатків (setShowAddition(false)), очищає список карток (setCards([])).

Інтерфейс: список карток, форма для створення картки, фінальна модалка для перегляду PDF та перевірки даних.

AddCardForm.tsx

Форма для створення карток / додатків.

Функції:

handleFileChoose — читає вибраний файл через FileReader у Data URL (base64). Зберігає pdfURL, fileName, file.

handleChange — оновлює formData. Для полів дати (docCreateDate, docSigningDate, validityPeriod) переформатовує з YYYY-MM-DD -> DD-MM-YYYY.

openAddDataModal(name, titleName) — відкриває/закриває модальне вікно додавання даних.

openApproveModal — відкриває модалку підтвердження, якщо файл вибрано; інакше показує лог про відсутній файл (fileLog).

Поля: тип документа, дати, строк дії, найменування, організація, коди ЄДРПОУ, тип договору, особистий номер, контрагент, вибір файлу, короткий зміст.

AddAddition.tsx

Додавання додатків до основного документа.

Функції:

GetAdditions(docId) — POST-запит для отримання додаткових даних; зберігає additions.

addAddition(docId, additionDocId) — POST-запит для додавання додатка; після успіху закриває модал і оновлює список.

Інтерфейс: кнопки додати/скасувати, список доданих посилань, деталі вибраного документу, короткий зміст, вбудований PDF-просмотр.

AddManager.tsx

Прив’язка менеджера до картки; CRUD менеджерів.

Функції:

getManagers() — отримує список менеджерів.

FindManager(name) — пошук менеджера за ім’ям.

CleanInput() — очищає пошукове поле та оновлює список.

AddManager(name, password) — додає менеджера через POST; оновлює ліст.

ChangeManager(id, name, password) — змінює менеджера.

DeleteManager(id) — видаляє менеджера (з підтвердженням).

Інтерфейс: пошук, список менеджерів, форма додавання, блок редагування, модалка підтвердження видалення.

AdditionCardList.tsx

Список доповнень картки.

Функції:

GetAdditions(docId) — отримання доповнень.

choiseListAdditionCard(addition) — встановлює вибране доповнення, оновлює PDF для перегляду, викликає GetAdditions для пов’язаних додатків, ховає список додатків.

CardList.tsx

Головний список карток.

Функції:

GetCards(page, limit) — отримує списки карток з пагінацією; додає в setCards.

chooseCard(card) — встановлює картку у formData, показує картку та фільтри, ховає додатки, очищає попередні файли/логи, завантажує додатки та зберігає їх у setAdditions.

Інтерфейс: прокручуваний контейнер зі списком карток; кожна картка показує організацію, дату створення, термін дії.

FilterCard.tsx

Фільтрація списку карток.

Функції:

GetCards — отримує картки.

handleChange — оновлює filterFormData, форматує дати.

filterCard — POST-запит з полями фільтра і автором, зберігає результат в setCards і логи.

cleanInputs — скидає фільтри в initialFormData.

openFilterDataModal(name, titleName) — керує модальним вікном фільтрації.

Інтерфейс: форма фільтрів (тип, дати, назва, організація, коди, автор), кнопки «Фільтрувати» та скидання.

ApproveModal.tsx

Модалка підтвердження / перевірки даних перед створенням картки.

Функції:

GetCards — оновлює список карток.

cleanInputs — очищає форму.

createCard(formData, file) — формує FormData, надсилає на сервер; після успіху очищає форму і оновлює список.

ShowCard.tsx

Перегляд і редагування вибраної картки.

Функції:

GetCards — отримання списку карток.

GetAdditions(cardId) — отримання додатків.

handleFileChoose — вибір замінного файлу і попередній перегляд.

choiseListCard — відкриття картки зі списку, підстановка даних в форму.

openChangeDataModal(fieldName) — відкриття модалки редагування поля.

changeCard(updatedData) — відправка оновлених даних на сервер, оновлення списку і логів.

handleChangeCard — оновлення локальної форми і показ кнопки збереження.

deleteCard(cardId) — видалення картки.

Інтерфейс: відображення полів картки, список додатків, попередній перегляд PDF, кнопки створити/додати/замінити файл/видалити/зберегти зміни.

Маршрути та контекст
AppRoutes.tsx

Керує маршрутизацією додатку:

Захищає сторінки менеджера та адміністратора.

Перенаправляє неавторизованих користувачів на екран входу.

Відображає сторінку документу по id.

/context — глобальний стан

Поля стану (основні):

log_in — статус авторизації.

userName — ім’я користувача.

cards — список карток.

getCardError, createCardError — логи помилок.

filterLog, addAdditionLog, showCardDataLog — логи дій.

showCard, showFilter, showAddition, showAddAddition, showApproveModal — прапори відображення.

formData, filterFormData — дані форм.

fileName, file, pdfURL, showCardPDF, showAddAdditionCardPDF — файли/перегляд PDF.

fileLog — повідомлення про проблеми з файлом.

findAuthor, additions — інші дані.

Сторінки / screens
Admin.tsx

Адміністративна сторінка з вибором режиму:

Додавання менеджера

Додавання картки
Інтерфейс: Header, панель вибору дій (кнопки), основний блок з відповідною формою.

Log_in.tsx

Екран авторизації:

Поля: ім’я, пароль

log_in — робить запит на бекенд; при успіху зберігає userName, переходить залежно від ролі, встановлює log_in в контекст. Показує повідомлення про результат (зелений/червоний).

Manager.tsx

Робочий екран менеджера:

Отримує список карток при завантаженні (GetCards) і зберігає в глобальний стан.

Кнопки додавання картки, фільтрації, перегляду деталей.

Праворуч — форма додавання картки або фільтри / перегляд вибраної картки.

DocumentCard.tsx

Екран деталізації документа:

GetCard(id) — отримує дані по ID, оновлює форму, PDF і доповнення.

GetAdditions — отримує додаткові картки.
Інтерфейс: повні поля документа, список доповнень (лінки), вбудований перегляд PDF, короткий зміст.

Утиліти /utils

Utils.ts:

reverseWord — змінює порядок елементів дати через дефіс (наприклад YYYY-MM-DD ↔ DD-MM-YYYY).

today() — повертає поточну дату у форматі YYYY-MM-DD.

formatDateForInput — конвертує дату DD-MM-YYYY → YYYY-MM-DD (для input[type="date"]).

Ікони /icons

index.tsx — експорт іконок (використовуються в різних компонентах).

Файли верхнього рівня

App.tsx — основний компонент додатку, роутинг.

tsconfig.json — конфіг TypeScript.

package.json — скрипти, залежності.

README.md — цей файл.

Примітки / рекомендації

Бекенд не включений — перевіряйте URL-адреси API (в коді, .env або конфіг).

Перевірте homepage у package.json перед деплоєм (для правильних шляхів у production).

Тести: у проекті є конфіг для Jest / Cypress — запускайте npm test або налаштовуйте cypress для e2e.

Якщо потрібна допомога з конкретним компонентом, тестами або деплоєм — можу оформити окрему інструкцію/покрокову доробку.
