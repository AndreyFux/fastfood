import data from "./data.json" assert { type: "json" };

const PRODUCT_INITIAL_VALUE = "sandwiches";
const ADDITIONS_INITIAL_VALUE = {
    sizes: "Не указан",
    breads: "Не указан",
    vegetables: "Не указан",
    sauces: "Не указан",
    fillings: "Не указан",
    price: 0,
    name: "",
    count: 1,
};

let additions = ADDITIONS_INITIAL_VALUE;

const finalProductList = [];
let totalPrice = 0;

const productContentBlock = document.getElementsByClassName("content__information")[0];
const navPanel = document.getElementById("content__navigation");

const dialogContent = document.getElementsByClassName("dialog__output")[0];
const dialogPanel = document.getElementById("dialog__navigation");
const dialog = document.querySelector("dialog");
const nextDialogButton = document.getElementsByClassName(
    "switching-buttons__next-button"
)[0];
const previousDialogButton = document.getElementsByClassName(
    "switching-buttons__previous-button"
)[0];

function displayProducts(clickedElement) {
    data.menu.forEach((item) => {
        let count = 1;
        if (item.category === clickedElement) {
            const renderProductLogo = (productType) => {
                if (productType === "pizza") return "";
                return `
                    <img src=./ПРИЛОЖЕНИЯ/i/markets/${item.market}.png alt=item__logo
                                class=item__logo />
                `;
            };

            const element = `<div class="item content__item">
                            ${renderProductLogo(clickedElement)} <img src=./ПРИЛОЖЕНИЯ/${
                item.image
            } alt="image"
                            class="image"/>
                            <div class="item__name">${item.name}</div>
                            <a class="item__additives" href="#">${item.description}</a>
                            <div class="prise item__prise">Цена: ${item.price}руб</div>
                            <div class="counter">
                                <div>Количество:</div>
                                <div class="counter__container">
                                    <button class="counter__increase">
                                        <img
                                            data-action="decrease"
                                            class="counter__image"
                                            alt="counter__image"
                                            src="./images/minus.svg"
                                        />
                                    </button>
                                    <input
                                        type="text"
                                        class="counter__input"
                                        value="${count}"
                                        data-action="input"
                                    />
                                    <button class="counter__decrease">
                                        <img
                                            data-action="increase"
                                            class="counter__image"
                                            alt="counter__image"
                                            src="./images/plus.svg"
                                        />
                                    </button>
                                </div>
                            </div>
                            <button class="button item__button">В КОРЗИНУ</button>
                        </div>`;
            productContentBlock.insertAdjacentHTML("beforeend", element);

            const priseString = document.getElementsByClassName("basket__prise")[0];
            const elements = document.getElementsByClassName("content__item");
            const activeElement = elements[elements.length - 1];
            const BasketButton = activeElement.getElementsByClassName("item__button")[0];

            BasketButton.addEventListener("click", () => {
                if (count > 0) {
                    if (item.category === PRODUCT_INITIAL_VALUE) {
                        //при нажатии на  sandwitch открываем модалку на начальном элементе
                        const activeElement = document.getElementsByClassName(
                            "dialog__element__active"
                        )[0];

                        if (activeElement.id !== "sizes") {
                            const newActiveElement = document.getElementById("sizes");
                            activeElement.classList.remove("dialog__element__active");
                            newActiveElement.classList.add("dialog__element__active");
                            previousDialogButton.classList.add("dialog__button__none");
                        }
                        dialog.showModal();
                        displayAdditive(data.sizes, item.price, "sizes");
                        additions.name = item.name;
                        additions.count = count;
                    } else {
                        //при нажатии на  другие элементу просто добавляем в общий массив
                        finalProductList.push({
                            name: item.name,
                            count: count,
                            id: finalProductList.length
                                ? finalProductList[finalProductList.length - 1].id + 1
                                : 0,
                            prise: count * item.price,
                        });
                        displaySelectedItems();

                        totalPrice += count * item.price;
                        priseString.innerHTML = `Итого: ${totalPrice} руб`;
                    }
                }
            });

            const counter_container =
                activeElement.getElementsByClassName("counter__container")[0];
            const input = activeElement.querySelector(".counter__input");

            class Counter {
                constructor(elem) {
                    this._elem = elem;
                    elem.onclick = this.onChange.bind(this);
                    elem.oninput = this.onChange.bind(this);
                }

                decrease() {
                    count > 1 && count--;
                    input.value = count;
                }

                input() {
                    count = input.value;
                }

                increase() {
                    count++;
                    input.value = count;
                }

                onChange(event) {
                    const action = event.target.dataset.action;
                    if (action) {
                        this[action]();
                    }
                }
            }

            new Counter(counter_container);
        }
    });
}

displayProducts(PRODUCT_INITIAL_VALUE);

navPanel.addEventListener("click", (event) => {
    const activeElement = document.getElementsByClassName("content__element__active")[0];
    activeElement.classList.remove("content__element__active");
    event.target.classList.add("content__element__active");
    removeElements(productContentBlock);
    displayProducts(event.target.id);
});

//ниже функционал переключения между вкладками
function displayAdditive(elements, oldPrice, activePosition) {
    removeElements(dialogContent);
    dialogContent.insertAdjacentHTML("beforeend", `<div class="dialog__elements"></div>`);
    const elementsContainer = document.getElementsByClassName("dialog__elements")[0];

    for (const key in elements) {
        const additivePrice = elements[key].price;
        const additiveElement = `<div class="dialog__size" id="${elements[key].name}">
                        <img src=./ПРИЛОЖЕНИЯ${elements[key].image} alt="image" class="image dialog__image">
                        <div class="dialog__value">${elements[key].name}</div>
                        <div class="dialog__prise prise">Цена: ${additivePrice}руб</div>
                    </div>`;
        elementsContainer.insertAdjacentHTML("beforeend", additiveElement);
        let newPrice = 0;

        const element = document.getElementById(elements[key].name);
        element.addEventListener("click", () => {
            newPrice = additivePrice + oldPrice;
            const itogPrise = document.getElementsByClassName("itog__prise")[0];
            activePosition === "sizes" && (itogPrise.innerHTML = `Цена: ${newPrice}руб`);
            const activeElement = document.getElementsByClassName(
                "dialog__additive__active"
            );
            activeElement[0] &&
                activeElement[0].classList.remove("dialog__additive__active");
            element.classList.add("dialog__additive__active");
            return (
                (additions[activePosition] = elements[key].name),
                (additions.price = newPrice)
            );
        });
    }
    activePosition === "sizes" &&
        dialogContent.insertAdjacentHTML(
            "beforeend",
            `<div class="itog__prise prise">Цена: ${oldPrice}руб</div>`
        );

    if (additions[activePosition] !== "Не указан") {
        //Прив возвращении на вкладку где уже был указан элемент отрисовать его
        const activeElement = document.getElementById(additions[activePosition]);
        activeElement.classList.add("dialog__additive__active");
    }
}

function displayFillings(elements, activePosition) {
    removeElements(dialogContent);
    dialogContent.insertAdjacentHTML("beforeend", `<div class="dialog__elements"></div>`);
    const elementsContainer = document.getElementsByClassName("dialog__elements")[0];
    let newPrice = 0;
    const fillings =
        typeof additions[activePosition] === "string" ? [] : additions[activePosition];
    for (const key in elements) {
        const additivePrice = elements[key].price;

        const fillingsElement = `<div class="dialog__size" id="${elements[key].name}">
                        <img src=./ПРИЛОЖЕНИЯ${elements[key].image} alt="image" class="image dialog__image">
                        <div class="dialog__value">${elements[key].name}</div>
                        <div class="dialog__prise prise">Цена: ${additivePrice}руб</div>
                    </div>`;
        elementsContainer.insertAdjacentHTML("beforeend", fillingsElement);

        const element = document.getElementById(elements[key].name);

        element.addEventListener("click", (event) => {
            const activeElement = event.currentTarget;
            if (activeElement.classList.contains("dialog__additive__active")) {
                //убираем активность, уменьшаем цену и убираем элемент из массива
                fillings.forEach(function (item, index) {
                    if (item === activeElement.id) fillings.splice(index, 1);
                });
                activeElement.classList.remove("dialog__additive__active");
                newPrice -= additivePrice + additions.price;
            } else if (fillings.length < 3) {
                //добавляем активность, добавляем к цене и добавляем элемент в массив
                fillings.push(activeElement.id);
                activeElement.classList.add("dialog__additive__active");
                newPrice = additivePrice + additions.price;
            }
            return (additions[activePosition] = fillings), (additions.price = newPrice);
        });
    }

    if (additions[activePosition] !== "Не указан") {
        additions[activePosition].forEach(function (item) {
            const activeElement = document.getElementById(item);
            activeElement.classList.add("dialog__additive__active");
        });
    }
}

function displayReady() {
    removeElements(dialogContent);
    let count = additions.count;

    const readyElement = `<div class="result__container">
                    <div class="result__img-container">
                        <img src=./ПРИЛОЖЕНИЯ/i/result_sandwich.jpg alt="image"
                        class="image result__image">
                    </div>
                    <div class="result__inf-container">
                        <div class="result__header">Ваш сендвич готов!</div>
                        <div class="result__information">
                            <div class="result__text">Размер: ${additions.sizes}</div>
                            <div class="result__text">Хлеб: ${additions.breads}</div>
                            <div class="result__text">Овощи: ${additions.vegetables}</div>
                            <div class="result__text">Соусы: ${additions.sauces}</div>
                            <div class="result__text">Начинка: ${additions.fillings}</div>
                        </div>
                        <div class="result__name">${additions.name}</div>
                    </div>
                </div>
                <div class="counter result__count-container">
                    <div>Количество</div>
                    <div class="counter__container result__counter">
                        <button class="counter__decrease">
                            <img src=./images/minus.svg alt="counter__image"
                            class="counter__image">
                        </button>
                        <input type="text" value="${count}" class="counter__input" />
                        <button class="counter__increase">
                            <img src=./images/plus.svg alt="counter__image"
                            class="counter__image">
                        </button>
                    </div>
                    <div class="result__foot-container">
                        <div class="result__prise prise">
                            Цена: ${count * additions.price}руб.
                        </div>
                        <button class="button result__button">В КОРЗИНУ</button>
                    </div>
                </div>`;
    dialogContent.insertAdjacentHTML("beforeend", readyElement);
    const resultContainer = document.getElementsByClassName("result__count-container")[0];
    const decrease = resultContainer.getElementsByClassName("counter__decrease")[0];
    const increase = resultContainer.getElementsByClassName("counter__increase")[0];
    const basketButton = resultContainer.getElementsByClassName("result__button")[0];
    const input = resultContainer.getElementsByClassName("counter__input")[0];
    const price = resultContainer.getElementsByClassName("result__prise")[0];

    decrease.addEventListener("click", () => {
        count > 1 && count--;
        input.value = count;
        additions.count = count;
        price.innerHTML = `Цена: ${count * additions.price}руб.`;
    });
    increase.addEventListener("click", () => {
        count++;
        input.value = count;
        additions.count = count;
        price.innerHTML = `Цена: ${count * additions.price}руб.`;
    });

    basketButton.addEventListener("click", () => {
        if (count > 0) {
            totalPrice += count * additions.price;
            const priseString = document.getElementsByClassName("basket__prise")[0];
            dialog.close();
            finalProductList.push({
                name: additions.name,
                count: count,
                id: finalProductList.length
                    ? finalProductList[finalProductList.length - 1].id + 1
                    : 0,
                prise: count * additions.price,
            });
            displaySelectedItems();
            priseString.innerHTML = `Итого: ${totalPrice} руб`;
            additions = {
                sizes: "Не указан",
                breads: "Не указан",
                vegetables: "Не указан",
                sauces: "Не указан",
                fillings: "Не указан",
                price: 0,
                name: "",
                count: 1,
            };
        }
    });

    input.addEventListener("input", () => {
        count = input.value;
    });
}

const tabsAdditives = {
    sizes: () => displayAdditive(data.sizes, additions.price, "sizes"),
    breads: () => displayAdditive(data.breads, additions.price, "breads"),
    vegetables: () => displayAdditive(data.vegetables, additions.price, "vegetables"),
    sauces: () => displayAdditive(data.sauces, additions.price, "sauces"),
    fillings: () => displayFillings(data.fillings, "fillings"),
    ready: displayReady,
};

function displayProductParameters(clickedAdditives) {
    tabsAdditives[clickedAdditives]();
}

nextDialogButton.addEventListener("click", () => {
    const activeElement = document.getElementsByClassName("dialog__element__active")[0];
    const newActiveElement = activeElement.nextSibling.nextSibling;
    activeElement.classList.remove("dialog__element__active");
    newActiveElement.classList.add("dialog__element__active");

    if (newActiveElement.id === "ready") {
        nextDialogButton.classList.add("dialog__button__none");
    } else if (newActiveElement.id === "breads") {
        previousDialogButton.classList.remove("dialog__button__none");
    }
    displayProductParameters(newActiveElement.id);
});

previousDialogButton.addEventListener("click", () => {
    const activeElement = document.getElementsByClassName("dialog__element__active")[0];
    const newActiveElement = activeElement.previousSibling.previousSibling;
    activeElement.classList.remove("dialog__element__active");
    newActiveElement.classList.add("dialog__element__active");

    if (newActiveElement.id === "sizes") {
        previousDialogButton.classList.add("dialog__button__none");
    } else if (newActiveElement.id === "fillings") {
        nextDialogButton.classList.remove("dialog__button__none");
    }
    displayProductParameters(newActiveElement.id);
});

dialogPanel.addEventListener("click", (event) => {
    const activeNaigationElement = event.target;
    const activeElement = document.getElementsByClassName("dialog__element__active")[0];
    activeElement.classList.remove("dialog__element__active");
    activeNaigationElement.classList.add("dialog__element__active");
    if (activeNaigationElement.id === "ready") {
        nextDialogButton.classList.add("dialog__button__none");
        previousDialogButton.classList.remove("dialog__button__none");
    } else if (activeNaigationElement.id === "sizes") {
        previousDialogButton.classList.add("dialog__button__none");
        nextDialogButton.classList.remove("dialog__button__none");
    } else {
        nextDialogButton.classList.remove("dialog__button__none");
        previousDialogButton.classList.remove("dialog__button__none");
    }
    displayProductParameters(activeNaigationElement.id);
});

function displaySelectedItems() {
    const basketContainer = document.getElementsByClassName("basket__elements")[0];
    removeElements(basketContainer);

    finalProductList.forEach((item) => {
        const basketElement = `<div class="basket__container" id="${item.id}">
                            <div class="basket__exit">
                                <img src=./images/exit.png alt="image" class="image__basket">
                            </div>
                            <div class="basket__element">
                                <div>${item.name}</div>
                              <div>${item.count}</div>
                            </div>
                        </div>`;
        basketContainer.insertAdjacentHTML("beforeend", basketElement);

        const container = document.getElementById(item.id);
        container.addEventListener("click", function () {
            const priseString = document.getElementsByClassName("basket__prise")[0];
            finalProductList.splice(basketContainer.id, 1);
            totalPrice -= item.prise;
            priseString.innerHTML = `Итого: ${totalPrice} руб`;
            basketContainer.removeChild(container);
        });
    });
}

function removeElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

document.querySelector("#none").addEventListener("click", function () {
    dialog.close();
    additions = {
        sizes: "Не указан",
        breads: "Не указан",
        vegetables: "Не указан",
        sauces: "Не указан",
        fillings: "Не указан",
        price: 0,
        name: "",
        count: 1,
    };
    removeElements(dialogContent);
});
