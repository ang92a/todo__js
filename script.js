const input = document.querySelector(".input");
const button = document.querySelector(".button");
const form = document.querySelector(".form");
const info = document.querySelector(".info");
const del = document.querySelector(".delete");
const delAll = document.querySelector(".delAll");
const delEnd = document.querySelector(".delEnd");

const LS_USER_KEY = "KEY"; // ключ для локалсторедж

const savedlist = JSON.parse(localStorage.getItem(LS_USER_KEY)) ?? []; // если в локалсторедж есть данные в виде строки,
// то они достаются и формируются в массив из обьектов, если ничего не введено, то возвращяется пустой массив
let list = savedlist; // присваиваем получившийся массив

//1/Создание массива с данными
const addlist = (evt) => {
  evt.preventDefault(); //Отменяем стандартное поведение (обновление страницы при отправке формы)
  let value = input.value; // создаем переменную и присваеваем введенное в импут

  //Добавляем новый объект в массив
  if (value.length) {
    list.push({
      id: Date.now(),
      text: value,
      status: false, // задаем значение по умолчанию
    });
  }
  input.value = ""; // после нажатия ентер возвращяет пустую строку(стандартное поведение формы в браузере)
  input.focus(); // Не теряем фокус с инпута
  renderList(); // Отрисовка
};

//2/Отрисовываем  каждый раз при изменеии массива, вынесена для удобства
function renderList() {
  info.innerHTML = ""; // для избежания повторов, сначала очищяет,потом отрисовывает проходясь по массиву
  localStorage.setItem(LS_USER_KEY, JSON.stringify(list)); // приводим к строке и в локалсторидж
  list.forEach((el) => {
    info.append(createList(el));
  });
  if (list.length) {
    info.classList.add("showInfo");
    del.classList.add("showDelete");
  } else {
    info.classList.remove("showInfo");
    del.classList.remove("showDelete");
  }
}

//3/Отрисовываем Todo
function createList(obj) {
  const listItem = document.createElement("li");
  listItem.className = "li";
  listItem.innerHTML = `<input id="chk" type="checkbox">
                        <div class="infotext">
                        <label class="label" >${obj.text}</label>
                        </div>
                        <button class="liButtonEdit">✏️</button>
                        <button class="liButtonDel">❌</button>`;
  let chk = listItem.querySelector("#chk"); // Добавляем событие для чек
  let lbl = listItem.querySelector(".label");
  let liButtonDel = listItem.querySelector(".liButtonDel");
  chk.checked = obj.status;
  chk.addEventListener("change", () => taggleCheck(obj.id)); // для того, чтобы обойти функцию событие, создаем анонимную функцию;
  // if (obj.status == true) lbl.classList.toggle("checkLabel"); // зачеркиваем текс
  liButtonDel.addEventListener("click", () => taggleDel(obj.id));
  lbl.addEventListener("click", () => taggleEdit(obj.id));
  return listItem;
}

// 4/ Меняем чек при нажатии
function taggleCheck(id) {
  const findItem = list.find((el) => el.id === id);
  if (findItem) findItem.status = !findItem.status;
  renderList();
}

//5/ Удалить все
const deleteList = () => {
  // При нажатии на кнопку делит массив обнуляется и вызывается функция
  list = [];
  renderList();
};

// // 6/ Удалить при нажатии на крестик
function taggleDel(id) {
  let myIndex = list.findIndex((el) => el.id === id);
  list.splice(myIndex, 1);
  renderList();
}

//7/ Удалить зачеркнутые
const deleteEnd = () => {
  list = list.filter((el) => el.status !== true);
  renderList();
};

renderList();

delEnd.addEventListener("click", deleteEnd);
button.addEventListener("click", addlist);
delAll.addEventListener("click", deleteList);
