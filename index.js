// DOM elementlerinin seçilmesi
const username = document.getElementById("userFullName");
const amount = document.getElementById("userAmount");
const usersUl = document.getElementById("userlist");
const add1 = document.getElementById("submit1");

const moneyFrom = document.getElementById("money1");
const moneyTo = document.getElementById("money2");
const transferAmount = document.getElementById("transferAmount");

const productFrom = document.getElementById("product1");
const productTo = document.getElementById("product2");
const transferProduct = document.getElementById("transferProduct");

const productname = document.getElementById("productName");
const price = document.getElementById("productPrice");
const stock = document.getElementById("productStock");
const productsUl = document.getElementById("productlist");
const add2 = document.getElementById("submit2");

const historyUser = document.getElementById("history");

// inputların kaydedileceği boş array
const users = [];
const products = [];

eventListener();

//seçilen etiketlere click eventi eklenmesi
function eventListener() {
  usersUl.addEventListener("click", selectUser);
  productsUl.addEventListener("click", selectProduct);
}

//click eventi yardımıyla hangi userin butouna basıldığının bulunması
function selectUser(e) {
  if (e.target.className === "btn btn-success") {
    users.forEach((user) => {
      if (e.target.id === user.username) {
        user.isValid = !user.isValid; // Bulunan kişinin is valid özelliğinin çevirilmesi
        console.log(user.isValid);
      }
    });
  }
}

//isvalid verisi True olan kullanıcıya butonuna tıklanan ürünün eklenmesi
function selectProduct(e) {
  if (e.target.className === "btn btn-success") {
    products.forEach((product) => {
      if (e.target.id === product.productname) {
        users.forEach((user) => {
          if (user.isValid) {
            if (parseInt(user.amount) >= parseInt(product.price)) {
              user.products.push(product.productname); // ürünün ilgili kullanıcının sepetine eklenmesi
              user.amount = parseInt(user.amount) - parseInt(product.price); // Eklenin ürünün fiyatının kullanıcı bakiyesinden eksiltilmesi
              product.stock = parseInt(product.stock) - 1; // Satın alınan ürünün stoğunun azaltılması
              saleHistoryM(product, user);
            } else {
              alert("You don't have enough money to buy this product :(")
            }
          }
        });
      }
    });
    console.log(users);
    userDataUI(users);
    productDataUI(products);
  }
}
// yeni kullanici ekleme fonksiyonu
const addUserList = () => {
  // array e kaydedilecek yeni user bilgilerinin olduğu obje
  const newUser = {
    username: username.value,
    amount: amount.value,
    isValid: false,
    products: [],
  };
  if (username.value !== "" && amount.value !== "") {
    users.push(newUser); // Objenin arraye push işlemi

    //fonksiyonların çağırılması
    productDataUI;
    userDataUI(users); // Objenin fonsiyona gönderilmesi
    moneyTransferUI(newUser);
    productTransferUI(newUser);
    addHistoryUser(newUser);
  }

  // form inputlarının temizlenmesi
  username.value = "";
  amount.value = "";
};

// eklenen user ı user list e yazdırma
const userDataUI = (users) => {
  usersUl.innerHTML = ` 
    <li class="user-list-item1"><p>NAME</p></li>
    <li class="user-list-item2"><p>AMOUNT</p></li>
    <li></li>
  `;

  users.forEach((user) => {
    usersUl.innerHTML += `
    <li class="user-list-item1">${user.username}</li>
    <li class="user-list-item2">${user.amount}$</li>
    <li><button class="btn btn-success" id="${user.username}" type="submit"
    style=" margin-bottom: 8px; background-color: rgb(98, 153, 117);"> Click to select person </button></li>
    `;
  });
};

// ürünlerin products list e eklenmesi
const addProductList = () => {
  if (productname.value !== "" && price.value !== "" && stock.value !== "") {
    const newProduct = {
      productname: productname.value,
      price: price.value,
      stock: stock.value,
    };

    products.push(newProduct); // newProduct objesinin products arrayine eklenmesi

    // form input larının temizlenmesi
    productname.value = "";
    price.value = "";
    stock.value = "";

    productDataUI(products);
    addHistoryProduct(newProduct);
  }
};

const productDataUI = (products) => {
  productsUl.innerHTML = ` 
  <li class="product-list-item1"><p>NAME</p></li>
  <li class="product-list-item2"><p>PRICE</p></li>
  <li class="product-list-item3"><p>STOCK</p></li>
  <li></li>
`;

  products.forEach((product) => {
    productsUl.innerHTML += `
<li class="product-list-item1 id="${product.productName}>${product.productname}</li>
<li class="product-list-item2">${product.price}$</li>
<li class="product-list-item3">${product.stock}</li>
<li><button class="btn btn-success" id="${product.productname}" type="submit"
 style=" margin-bottom: 8px; background-color: rgb(98, 153, 117);"> Click to sell selected person </button></li> </button></li>
`;
  });
};

// MONEY TRANSFER bölümü işlemleri (Send butonu fonksiyonu)
const moneyTransfer = () => {
  from = moneyFrom.value; // from daki verinin çağırılması
  to = moneyTo.value; // to daki verinin çağırılması
  money = transferAmount.value; // transfer edilcek para verinin çağırılması

  // seçilen kişilerin amount verilerinin güncellenmesi
  users.forEach((user) => {
    if (user.username === from) {
      user.amount = parseInt(user.amount) - parseInt(money); // from kişisinin parasının azalması
    }
  });
  users.forEach((user) => {
    if (user.username === to) {
      user.amount = parseInt(user.amount) + parseInt(money); // to kişisinin parasının artması
    }
  });

  userDataUI(users);
  transferHistory(from, to, money);
};
const productTransfer = () => {
  from = productFrom.value;
  to = productTo.value;
  transferProducts = transferProduct.value;

  users.forEach((user) => {
    if (user.username === from) {
      user.products = user.products.filter((product) => product !== transferProducts);
      console.log(user.products);
    }
  });
  users.forEach((user) => {
    if (user.username === to) {
      user.products.push(transferProducts);
      console.log(user.products);
    }
  });
  saleHistory(from, to, transferProducts);
};

// eklenen user ı money transferdeki kişi seçeneklerine yazdırma
const moneyTransferUI = (data) => {
  moneyFrom.innerHTML += `<option value="${data.username}">${data.username}</option>`;
  moneyTo.innerHTML += `<option value="${data.username}">${data.username}</option>`;
};
const productTransferUI = (data) => {
  productFrom.innerHTML += `<option value="${data.username}">${data.username}</option>`;
  productTo.innerHTML += `<option value="${data.username}">${data.username}</option>`;
};
//
const salesHistory = (data) => {
  historyUser.innerHTML += ` <li class="history-item">${data.username} added ${data.amount}$. </li><hr> `;
};
// eklenen user ın bilgisini history ye yazdırma
const addHistoryUser = (data) => {
  historyUser.innerHTML += ` <li class="history-item">${data.username} added ${data.amount}$. </li><hr> `;
};

// eklenen product ın bilgisini history ye yazdırma
const addHistoryProduct = (data) => {
  historyUser.innerHTML += ` <li class="history-item">Added ${data.stock} ${data.productname}s for ${data.price}$. </li><hr> `;
};

// transfer işlemini history ye yazdırma
const transferHistory = (from, to, money) => {
  historyUser.innerHTML += ` <li class="history-item"> ${from} send ${money}$ to ${to}. </li><hr>`;
};

// // satış işlemini history ye yazdırma
const saleHistory = (from, to, transferProducts) => {
  historyUser.innerHTML += ` <li class="history-item"> ${from} sell ${transferProducts} to ${to}. </li><hr>`;
};

// satış işlemini history ye yazdırma
const saleHistoryM = (product, user) => {
  historyUser.innerHTML += ` <li class="history-item"> ${user.username} bought a/an ${user.products} and has ${user.amount}$ left. And ${product.stock} ${product.productname}s left. </li><hr> `;
};
