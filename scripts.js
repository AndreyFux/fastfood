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

const additions = { ...ADDITIONS_INITIAL_VALUE };

const finalProductList = [];
let totalPrice = 0;

function getHtmlElement(className) {
    return document.getElementsByClassName(className)[0];
}
const productContentBlock = getHtmlElement("content__information");
const navPanel = document.getElementById("content__navigation");

const dialogContent = getHtmlElement("dialog__output");
const dialogPanel = document.getElementById("dialog__navigation");
const dialog = document.querySelector("dialog");
const nextDialogButton = getHtmlElement("switching-buttons__next-button");
const previousDialogButton = getHtmlElement("switching-buttons__previous-button");

function handleBasketButtonClick(event) {
    let activeElement = null;
    const element = event.target.closest(".content__item");
    const input = element.getElementsByClassName("counter__input")[0];
    const name = event.target
        .closest(".content__item")
        .getElementsByClassName("item__name")[0].innerHTML;
    data.menu.forEach((item) => {
        if (item.name === name) {
            return (activeElement = item);
        }
    });
    if (activeElement.category === PRODUCT_INITIAL_VALUE) {
        openModal(input, activeElement);
    } else {
        addElementInBasket(input, activeElement);
    }
}

function openModal(input, item) {
    const activeElement = getHtmlElement("dialog__element__active");

    if (activeElement.id !== "sizes") {
        const newActiveElement = document.getElementById("sizes");
        activeElement.classList.remove("dialog__element__active");
        newActiveElement.classList.add("dialog__element__active");
        previousDialogButton.classList.add("dialog__button__none");
    }
    dialog.showModal();
    displayAdditive(data.sizes, item.price, "sizes");
    additions.name = item.name;
    additions.count = input.value;
}

function addElementInBasket(input, item) {
    const priseString = getHtmlElement("basket__prise");

    finalProductList.push({
        name: item.name,
        count: input.value,
        id: finalProductList.length
            ? finalProductList[finalProductList.length - 1].id + 1
            : 0,
        prise: input.value * item.price,
    });
    displaySelectedItems();

    totalPrice += input.value * item.price;
    priseString.innerHTML = `Итого: ${totalPrice} руб`;
}

function handleCounterClick(action, input) {
    if (action === "decrease") {
        input.value > 1 && input.value--;
    } else if (action === "increase") {
        input.value++;
    }
}

function handleProductContentBlockClick(event) {
    const element = event.target.closest(".content__item");
    let input = element.getElementsByClassName("counter__input")[0];
    const action = event.target.dataset.action;
    handleCounterClick(action, input);
    const basketButton = element.getElementsByClassName("item__button")[0];
    event.target === basketButton &&
        basketButton.addEventListener("click", handleBasketButtonClick(event));
}

productContentBlock.onclick = handleProductContentBlockClick;

function displayProducts(clickedElement) {
    data.menu.forEach((item) => {
        if (item.category === clickedElement) {
            const renderProductLogo = (productType) => {
                if (productType === "pizza") return "";
                return /*html*/ `
                    <img src=./ПРИЛОЖЕНИЯ/i/markets/${item.market}.png alt=item__logo
                                class=item__logo />
                `;
            };

            const element = /*html*/ `<div class="item content__item">
                                        ${renderProductLogo(
                                            clickedElement
                                        )} <img src=./ПРИЛОЖЕНИЯ/${item.image} alt="image"
                                        class="image"/>
                                        <div class="item__name">${item.name}</div>
                                        <a class="item__additives" href="#">${
                                            item.description
                                        }</a>
                                        <div class="prise item__prise">Цена: ${
                                            item.price
                                        }руб</div>
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
                                                    value="${1}"
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
        }
    });
}

displayProducts(PRODUCT_INITIAL_VALUE);

navPanel.addEventListener("click", handleNavButtonClick);

function handleNavButtonClick(event) {
    const activeElement = document.getElementsByClassName("content__element__active")[0];
    activeElement.classList.remove("content__element__active");
    event.target.classList.add("content__element__active");
    removeElements(productContentBlock);
    displayProducts(event.target.id);
}

function displayActiveElement(activePosition) {
    if (activePosition !== "Не указан") {
        const activeElement = document.getElementById(activePosition);
        activeElement.classList.add("dialog__additive__active");
    }
}

function handleAdditiveElementClick(
    newPrice,
    additivePrice,
    oldPrice,
    activePosition,
    element,
    elements
) {
    newPrice = additivePrice + oldPrice;
    const itogPrise = getHtmlElement("itog__prise");
    activePosition === "sizes" && (itogPrise.innerHTML = `Цена: ${newPrice}руб`);
    const activeElement = getHtmlElement("dialog__additive__active");
    activeElement && activeElement.classList.remove("dialog__additive__active");
    element.classList.add("dialog__additive__active");
    return (additions[activePosition] = elements.name), (additions.price = newPrice);
}

function displayAdditive(elements, oldPrice, activePosition) {
    removeElements(dialogContent);
    dialogContent.insertAdjacentHTML("beforeend", `<div class="dialog__elements"></div>`);
    const elementsContainer = getHtmlElement("dialog__elements");
    let newPrice = 0;

    for (const key in elements) {
        const additivePrice = elements[key].price;
        const additiveElement = /*html*/ `<div class="dialog__size" id="${elements[key].name}">
                                            <img src=./ПРИЛОЖЕНИЯ${elements[key].image} alt="image" class="image dialog__image">
                                            <div class="dialog__value">${elements[key].name}</div>
                                            <div class="dialog__prise prise">Цена: ${additivePrice}руб</div>
                                        </div>`;
        elementsContainer.insertAdjacentHTML("beforeend", additiveElement);
        let newPrice = 0;

        const htmlElement = document.getElementById(elements[key].name);
        htmlElement.addEventListener("click", () =>
            handleAdditiveElementClick(
                newPrice,
                additivePrice,
                oldPrice,
                activePosition,
                htmlElement,
                elements[key]
            )
        );
    }
    activePosition === "sizes" &&
        dialogContent.insertAdjacentHTML(
            "beforeend",
            /*html*/ `<div class="itog__prise prise">Цена: ${oldPrice}руб</div>`
        );

    displayActiveElement(additions[activePosition]);
}

function addFilling(activeElement, fillings, newPrice, additivePrice) {
    fillings.push(activeElement.id);
    activeElement.classList.add("dialog__additive__active");
    return (newPrice = additivePrice + additions.price);
}

function removeFilling(activeElement, fillings, newPrice, additivePrice) {
    fillings.forEach(function (item, index) {
        if (item === activeElement.id) fillings.splice(index, 1);
    });
    activeElement.classList.remove("dialog__additive__active");
    return (newPrice = additions.price - additivePrice);
}

function handleFillingsActivity(
    event,
    fillings,
    newPrice,
    additivePrice,
    activePosition
) {
    const activeElement = event.currentTarget;
    if (activeElement.classList.contains("dialog__additive__active")) {
        newPrice = removeFilling(activeElement, fillings, newPrice, additivePrice);
    } else if (fillings.length < 3) {
        newPrice = addFilling(activeElement, fillings, newPrice, additivePrice);
    }
    return (additions[activePosition] = fillings), (additions.price = newPrice);
}

function displayActiveFillings(activeFillings) {
    if (activeFillings !== "Не указан") {
        activeFillings.forEach(function (item) {
            const activeElement = document.getElementById(item);
            activeElement.classList.add("dialog__additive__active");
        });
    }
}

function displayFillings(elements, activePosition) {
    removeElements(dialogContent);
    dialogContent.insertAdjacentHTML("beforeend", `<div class="dialog__elements"></div>`);
    const elementsContainer = getHtmlElement("dialog__elements");
    let newPrice = 0;
    const fillings =
        typeof additions[activePosition] === "string" ? [] : additions[activePosition];

    for (const key in elements) {
        const additivePrice = elements[key].price;

        const fillingsElement = /*html*/ `<div class="dialog__size" id="${elements[key].name}">
                                            <img src=./ПРИЛОЖЕНИЯ${elements[key].image} alt="image" class="image dialog__image">
                                            <div class="dialog__value">${elements[key].name}</div>
                                            <div class="dialog__prise prise">Цена: ${additivePrice}руб</div>
                                        </div>`;
        elementsContainer.insertAdjacentHTML("beforeend", fillingsElement);

        const element = document.getElementById(elements[key].name);

        element.addEventListener("click", (event) =>
            handleFillingsActivity(
                event,
                fillings,
                newPrice,
                additivePrice,
                activePosition
            )
        );
    }
    displayActiveFillings(additions[activePosition]);
}

function displayReady() {
    removeElements(dialogContent);
    let count = additions.count;

    const readyElement = /*html*/ `<div class="result__container">
                                    <div class="result__img-container">
                                        <img src=./ПРИЛОЖЕНИЯ/i/result_sandwich.jpg alt="image"
                                        class="image result__image">
                                    </div>
                                    <div class="result__inf-container">
                                        <div class="result__header">Ваш сендвич готов!</div>
                                        <div class="result__information">
                                            <div class="result__text">Размер: ${
                                                additions.sizes
                                            }</div>
                                            <div class="result__text">Хлеб: ${
                                                additions.breads
                                            }</div>
                                            <div class="result__text">Овощи: ${
                                                additions.vegetables
                                            }</div>
                                            <div class="result__text">Соусы: ${
                                                additions.sauces
                                            }</div>
                                            <div class="result__text">Начинка: ${
                                                additions.fillings
                                            }</div>
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
    const resultContainer = getHtmlElement("result__count-container");
    const decrease = resultContainer.getElementsByClassName("counter__decrease")[0];
    const increase = resultContainer.getElementsByClassName("counter__increase")[0];
    const basketButton = resultContainer.getElementsByClassName("result__button")[0];
    const input = resultContainer.getElementsByClassName("counter__input")[0];
    const price = resultContainer.getElementsByClassName("result__prise")[0];

    decrease.addEventListener("click", handleDecreaseClick);
    function handleDecreaseClick() {
        count > 1 && count--;
        input.value = count;
        additions.count = count;
        price.innerHTML = `Цена: ${count * additions.price}руб.`;
    }
    increase.addEventListener("click", handleIncreaseClick);
    function handleIncreaseClick() {
        count++;
        input.value = count;
        additions.count = count;
        price.innerHTML = `Цена: ${count * additions.price}руб.`;
    }

    basketButton.addEventListener("click", handleBasketButtonClick);

    function handleBasketButtonClick() {
        if (count > 0) {
            totalPrice += count * additions.price;
            const priseString = getHtmlElement("basket__prise");
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
                ...ADDITIONS_INITIAL_VALUE,
            };
        }
    }

    input.addEventListener("input", handleInputChange);

    function handleInputChange() {
        count = input.value;
    }
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

nextDialogButton.addEventListener("click", handleNextDialogButtonClick);
function handleNextDialogButtonClick() {
    const activeElement = getHtmlElement("dialog__element__active");
    const newActiveElement = activeElement.nextSibling.nextSibling;
    activeElement.classList.remove("dialog__element__active");
    newActiveElement.classList.add("dialog__element__active");

    if (newActiveElement.id === "ready") {
        nextDialogButton.classList.add("dialog__button__none");
    } else if (newActiveElement.id === "breads") {
        previousDialogButton.classList.remove("dialog__button__none");
    }
    displayProductParameters(newActiveElement.id);
}

previousDialogButton.addEventListener("click", handlePreviousDialogButtonClick);
function handlePreviousDialogButtonClick() {
    const activeElement = getHtmlElement("dialog__element__active");
    const newActiveElement = activeElement.previousSibling.previousSibling;
    activeElement.classList.remove("dialog__element__active");
    newActiveElement.classList.add("dialog__element__active");

    if (newActiveElement.id === "sizes") {
        previousDialogButton.classList.add("dialog__button__none");
    } else if (newActiveElement.id === "fillings") {
        nextDialogButton.classList.remove("dialog__button__none");
    }
    displayProductParameters(newActiveElement.id);
}

dialogPanel.addEventListener("click", handleDialogPanelClick);
function handleDialogPanelClick(event) {
    const activeNaigationElement = event.target;
    const activeElement = getHtmlElement("dialog__element__active");
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
}

function displaySelectedItems() {
    const basketContainer = getHtmlElement("basket__elements");
    removeElements(basketContainer);

    finalProductList.forEach((item) => {
        const basketElement = /*html*/ `<div class="basket__container" id="${item.id}">
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
        container.addEventListener("click", handleBasketElementClick);
        function handleBasketElementClick() {
            const priseString = getHtmlElement("basket__prise");
            finalProductList.splice(basketContainer.id, 1);
            totalPrice -= item.prise;
            priseString.innerHTML = `Итого: ${totalPrice} руб`;
            basketContainer.removeChild(container);
        }
    });
}

function removeElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

document.querySelector("#close").addEventListener("click", handleeExitButtonClick);
function handleeExitButtonClick() {
    dialog.close();
    additions = {
        ...ADDITIONS_INITIAL_VALUE,
    };
    removeElements(dialogContent);
}
