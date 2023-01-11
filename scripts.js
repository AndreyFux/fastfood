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
            const element = document.createElement("div");
            const image = document.createElement("img");
            const name = document.createElement("div");
            const additives = document.createElement("a");
            const prise = document.createElement("div");
            const counter = document.createElement("div");
            const amount = document.createElement("div");
            const counter_container = document.createElement("div");
            const decrease = document.createElement("button");
            const increase = document.createElement("button");
            const input = document.createElement("input");
            const basketButton = document.createElement("button");
            const imagePlus = document.createElement("img");
            const imageMinus = document.createElement("img");
            const logo = document.createElement("img");

            if (clickedElement !== "pizza") {
                logo.src = `./ПРИЛОЖЕНИЯ/i/markets/${item.market}.png`;
                logo.alt = "item__logo";
                logo.className = "item__logo";
            }

            element.className = "item content__item";

            image.src = `./ПРИЛОЖЕНИЯ/${item.image}`;
            image.alt = "image";
            image.className = "image";

            name.className = "item__name";
            name.innerHTML = item.name;

            additives.className = "item__additives";
            additives.href = "#";
            additives.innerHTML = item.description;

            prise.className = "prise item__prise";
            prise.innerHTML = `Цена: ${item.price}руб`;

            counter.className = "counter";
            amount.innerHTML = "Количество:";
            counter_container.className = "counter__container";

            decrease.className = "counter__decrease";
            decrease.addEventListener("click", () => {
                count > 1 && count--;
                input.value = count;
            });

            increase.className = "counter__increase";
            increase.addEventListener("click", () => {
                count++;
                input.value = count;
            });

            input.className = "counter__input";
            input.type = "text";
            input.value = count;
            input.addEventListener("input", () => {
                count = input.value;
            });

            imagePlus.src = `./images/minus.svg`;
            imagePlus.alt = "counter__image";
            imagePlus.className = "counter__image";
            imageMinus.src = `./images/plus.svg`;
            imageMinus.alt = "counter__image";
            imageMinus.className = "counter__image";

            basketButton.className = "button item__button";
            basketButton.innerText = "В КОРЗИНУ";

            const priseString = document.getElementsByClassName("basket__prise")[0];

            basketButton.addEventListener("click", () => {
                console.log(finalProductList);
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
                        });
                        displaySelectedItems();
                        totalPrice += count * item.price;
                        // additions.price = count * item.price;   зачем???
                        priseString.innerHTML = `Итого: ${totalPrice} руб`;
                    }
                }
            });

            decrease.append(imagePlus);
            increase.append(imageMinus);
            counter_container.append(decrease, input, increase);
            counter.append(amount, counter_container);
            element.append(logo, image, name, additives, prise, counter, basketButton);
            productContentBlock.append(element);
        }
    });
}

let additions = ADDITIONS_INITIAL_VALUE;
displayProducts(PRODUCT_INITIAL_VALUE);
const finalProductList = [];
let totalPrice = 0;

navPanel.addEventListener("click", (event) => {
    const activeElement = document.getElementsByClassName("content__element__active")[0];
    activeElement.classList.remove("content__element__active");
    event.target.classList.add("content__element__active");

    while (productContentBlock.firstChild) {
        productContentBlock.removeChild(productContentBlock.firstChild);
    }
    displayProducts(event.target.id);
});

//ниже функционал переключения между вкладками
function displayAdditive(elements, oldPrice, activePosition) {
    const totalPrice = document.createElement("div");
    const elementsContainer = document.createElement("div");
    while (dialogContent.firstChild) {
        dialogContent.removeChild(dialogContent.firstChild);
    }
    elementsContainer.className = "dialog__elements";
    for (const key in elements) {
        const element = document.createElement("div");
        const image = document.createElement("img");
        const size = document.createElement("div");
        const price = document.createElement("div");
        const additivePrice = elements[key].price;
        let newPrice = 0;

        element.className = "dialog__size";
        element.id = elements[key].name;
        size.className = "dialog__value";
        size.innerHTML = elements[key].name;
        price.innerHTML = `Цена: ${additivePrice}руб`;
        price.className = "dialog__prise prise";

        image.src = `./ПРИЛОЖЕНИЯ${elements[key].image}`;
        image.alt = "image";
        image.className = "image dialog__image";
        element.addEventListener("click", () => {
            newPrice = additivePrice + oldPrice;
            totalPrice.innerHTML = `Цена: ${newPrice}руб`;
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

        element.append(image, size, price);
        elementsContainer.append(element);
        dialogContent.append(elementsContainer);
        totalPrice.innerHTML = `Цена: ${oldPrice}руб`;
        totalPrice.className = "itog__prise prise";
    }
    activePosition === "sizes" && dialogContent.append(totalPrice);

    if (additions[activePosition] !== "Не указан") {
        const activeElement = document.getElementById(additions[activePosition]);
        activeElement.classList.add("dialog__additive__active");
    }
}

function displayFillings(elements, oldPrice, activePosition) {
    const elementsContainer = document.createElement("div");
    while (dialogContent.firstChild) {
        dialogContent.removeChild(dialogContent.firstChild);
    }
    let newPrice = 0;
    const fillings =
        typeof additions[activePosition] === "string" ? [] : additions[activePosition];
    elementsContainer.className = "dialog__elements";
    for (const key in elements) {
        const element = document.createElement("div");
        const image = document.createElement("img");
        const size = document.createElement("div");
        const price = document.createElement("div");

        const additivePrice = elements[key].price;

        element.className = "dialog__size";
        size.className = "dialog__value";

        element.id = elements[key].name;
        size.innerHTML = elements[key].name;

        price.innerHTML = `Цена: ${additivePrice}руб`;
        price.className = "dialog__prise prise";

        image.src = `./ПРИЛОЖЕНИЯ${elements[key].image}`;
        image.alt = "image";
        image.className = "image dialog__image";
        element.addEventListener("click", (event) => {
            const activeElement = event.currentTarget;
            if (activeElement.classList.contains("dialog__additive__active")) {
                //убираем активность, уменьшаем цену и убираем элемент из массива
                fillings.forEach(function (item, index) {
                    if (item === activeElement.id) fillings.splice(index, 1);
                });
                activeElement.classList.remove("dialog__additive__active");
                newPrice -= additivePrice + oldPrice;
            } else if (fillings.length < 3) {
                //добавляем активность и добавляем к цене и добавляем элемент в массив
                fillings.push(activeElement.id);
                activeElement.classList.add("dialog__additive__active");
                newPrice += additivePrice + oldPrice;
            }
            return (additions[activePosition] = fillings), (additions.price = newPrice);
        });

        element.append(image, size, price);
        elementsContainer.append(element);
        dialogContent.append(elementsContainer);
    }

    if (additions[activePosition] !== "Не указан") {
        additions[activePosition].forEach(function (item) {
            const activeElement = document.getElementById(item);
            activeElement.classList.add("dialog__additive__active");
        });
    }
}

function displayReady() {
    while (dialogContent.firstChild) {
        dialogContent.removeChild(dialogContent.firstChild);
    }
    let count = additions.count;

    const price = document.createElement("div");
    const image = document.createElement("img");
    const information = document.createElement("div");
    const header = document.createElement("div");
    const size = document.createElement("div");
    const bread = document.createElement("div");
    const vegetable = document.createElement("div");
    const sauces = document.createElement("div");
    const filling = document.createElement("div");
    const name = document.createElement("div");
    const dialogInformationContainer = document.createElement("div");
    const dialogContainer = document.createElement("div");
    const imageContainer = document.createElement("div");
    const amount = document.createElement("div");
    const counter = document.createElement("div");
    const basketButton = document.createElement("button");
    const footerContainer = document.createElement("div");
    const imagePlus = document.createElement("img");
    const imageMinus = document.createElement("img");
    const input = document.createElement("input");
    const counter_container = document.createElement("div");
    const decrease = document.createElement("button");
    const increase = document.createElement("button");
    const priseString = document.getElementsByClassName("basket__prise")[0];

    image.src = "./ПРИЛОЖЕНИЯ/i/result_sandwich.jpg";
    image.alt = "image";
    image.className = "image result__image";
    information.className = "result__information";
    header.className = "result__header";
    size.className = "result__text";
    bread.className = "result__text";
    vegetable.className = "result__text";
    sauces.className = "result__text";
    filling.className = "result__text";
    name.className = "result__name";
    dialogContainer.className = "result__container";
    dialogInformationContainer.className = "result__inf-container";
    imageContainer.className = "result__img-container";
    basketButton.className = "button result__button";
    basketButton.innerHTML = "В КОРЗИНУ";
    footerContainer.className = "result__foot-container";
    price.innerHTML = `Цена: ${count * additions.price}руб`;
    price.className = "result__prise prise";
    size.innerText = `Размер: ${additions.sizes}`;
    bread.innerText = `Хлеб: ${additions.breads}`;
    vegetable.innerText = `Овощи: ${additions.vegetables}`;
    sauces.innerText = `Соусы: ${additions.sauces}`;
    filling.innerText = `Начинка: ${additions.fillings}`;
    name.innerText = additions.name;
    header.innerText = "Ваш сендвич готов!";
    counter_container.className = "counter__container result__counter";
    decrease.className = "counter__decrease";
    increase.className = "counter__increase";
    input.className = "counter__input";
    input.type = "text";
    input.value = count;
    counter.className = "counter result__count-container";
    amount.innerHTML = "Количество:";
    imagePlus.src = `./images/minus.svg`;
    imagePlus.alt = "counter__image";
    imagePlus.className = "counter__image";
    imageMinus.src = `./images/plus.svg`;
    imageMinus.alt = "counter__image";
    imageMinus.className = "counter__image";

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
        price.innerHTML = `Цена: ${count * additions.price}руб`;
    });

    basketButton.addEventListener("click", () => {
        if (count > 0) {
            dialog.close();
            finalProductList.push({
                name: additions.name,
                count: count,
                id: finalProductList.length
                    ? finalProductList[finalProductList.length - 1].id + 1
                    : 0,
            });
            displaySelectedItems();
            totalPrice += count * additions.price;
            priseString.innerHTML = `Итого: ${totalPrice} руб`;
            additions.price = count * additions.price;
        }
    });

    input.addEventListener("input", () => {
        count = input.value;
    });

    decrease.append(imagePlus);
    increase.append(imageMinus);
    footerContainer.append(price, basketButton);
    counter_container.append(decrease, input, increase);
    counter.append(amount, counter_container, footerContainer);
    imageContainer.append(image);
    information.append(size, bread, vegetable, sauces, filling);
    dialogInformationContainer.append(header, information, name);
    dialogContainer.append(imageContainer, dialogInformationContainer);
    dialogContent.append(dialogContainer, counter);
}

const tabsAdditives = {
    sizes: () => displayAdditive(data.sizes, additions.price, "sizes"),
    breads: () => displayAdditive(data.breads, additions.price, "breads"),
    vegetables: () => displayAdditive(data.vegetables, additions.price, "vegetables"),
    sauces: () => displayAdditive(data.sauces, additions.price, "sauces"),
    fillings: () => displayFillings(data.fillings, additions.price, "fillings"),
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
    while (basketContainer.firstChild) {
        basketContainer.removeChild(basketContainer.firstChild);
    }
    finalProductList.forEach((item) => {
        const name = document.createElement("div");
        const count = document.createElement("div");
        const element = document.createElement("div");
        const container = document.createElement("div");
        const exitButton = document.createElement("div");
        const image = document.createElement("img");

        element.className = "basket__element";
        name.innerText = item.name;
        count.innerText = item.count;

        container.className = "basket__container";
        container.id = item.id;

        container.addEventListener("click", function () {
            console.log(finalProductList);
            // console.log(finalProductList.splice(basketContainer.id, 1));
            finalProductList.splice(basketContainer.id, 1);
            basketContainer.removeChild(container);
            // console.log({ finalProductList, basketContainer });
        });

        exitButton.className = "basket__exit";

        image.src = `./images/exit.png`;
        image.alt = "image";
        image.className = "image__basket";

        exitButton.append(image);
        element.append(name, count);
        container.append(exitButton, element);
        basketContainer.append(container);
    });
}

document.querySelector("#none").addEventListener("click", function () {
    dialog.close();
    additions = ADDITIONS_INITIAL_VALUE;
    while (dialogContent.firstChild) {
        dialogContent.removeChild(dialogContent.firstChild);
    }
});
