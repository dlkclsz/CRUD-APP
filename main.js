//! Gerekli HTML elementlerini seç 
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-btn");
const alert = document.querySelector(".alert");
const clearBtn = document.querySelector(".clear-btn");

//! Düzenleme seçenekleri
let editElement;
let editFlag = false; //Düzenleme modunda olıp olmadığı belirtir
let editId = ""; //Düzenleme yapılan öğenin benzersiz kimliği
//! Fonksiyonlar
const setBackToDefault = () => {
    grocery.value = ""
    editFlag = false;
    editId ="";
    submitBtn.textContent = "Ekle";
}
const displayAlert = (text,action) => {
   
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout (() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    },2000);
};
const deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement; // "article" etiketine eriştik
    const id = element.dataset.id;
    list.removeChild(element); // list etiketi içerisinden "article" etiketini kaldırdık
    displayAlert("Öge Kaldırıldı", "danger");
    setBackToDefault();
    removeFromLocalStorage(id);
};

const editItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement; // "article" etiketine parentElement sayesinde eriştik
    editElement = e.currentTarget.parentElement.previousElementSibling; // butonun kapsayıcısına eriştikten sonra kapsayıcının kardeş etiketine eriştik
    // Tıkladığım "article" etiketi içerisindeki p etiketinin textini inputun içerisine gönderme
    grocery.value = editElement.innerText;
  
    editFlag = true;
    editID = element.dataset.id; // düzenlenen ögenein kimliğine erişme
    submitBtn.textContent = "Düzenle"; // Düzenleme işleminde submitBtnin içerik kısmını güncelledik
};
  
const addItem = (e) => {
    e.preventDefault();//forma veri girdikten sonra sayfa yenilenmesini engeller
    const value = grocery.value;//form içerisinde bulunan inputun değerini aldık
    const id = new Date().getTime().toString(); //Benzersiz bir Id oluşturduk

//! Eğer input boş değilse ve düzenleme modunda değilse çalışacak blok yapısı
if (value !== "" && !editFlag) {
    const element = document.createElement("article"); // Yeni bir "article" etiketi oluşturduk
    let attr = document.createAttribute("data-id"); //Yeni bir veri kimliği oluşturur
    attr.value = id;
    element.setAttributeNode (attr); // oluşturduğumuz id yi article etiketine ekledik.
    element.classList.add ("grocery-item"); //oluşturduğumuz article etiketine class ekledik.
    element.innerHTML= ` 
       <p class="title">${value}</p>
       <div class="btn-container">
            <button type="button"class="edit-btn">
            <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button type="button"class="delete-btn">
            <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click",deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click",editItem);
    
    list.appendChild(element); // kapsayıcıya oluşturduğumuz article etiketini ekledik
    displayAlert("Başarıyla Eklendi","success");
    container.classList.add("show-container");
    // localStorage a ekleme
    addToLocalStorage(id, value);
    // Değerleri varsayılana çevirir
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    // Değiştireceğimiz p etiketinin içerik kısmına kullanıcının inputa girdiği değeri gönderdik
    editElement.innerText = value;
    // Ekrana alert yapısını bastırdık
    displayAlert("Değer Değiştirildi", "success");
    submitBtn.textContent = "Ekle";//ekle butonu eski haline getirdik
    editFlag = false ; //düzenleme modundan çıktık
    editLocalStorage(editID, value);
    setBackToDefault();  
     
}
};
const clearItems = () => {
   const items = document.querySelectorAll(".grocery-item");
   //listede öğe varsa çalışır
   if (items.length>0) {
    items.forEach((item) => list.removeChild(item));
   }
   //container yapısını gizel
   container.classList.remove("show-container");
   displayAlert ("Liste Boş","danger");
   setBackToDefault();
};

//! Olay izleyicileri
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click",clearItems);
const setupItems = () => {
    let items = getLocalStorage();
    if (items.length > 0) {
      items.forEach((item) => {
        createListItem(item.id, item.value);
      });
    }
  };

//! local storage
//! yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id,value) => {
const grocery = {id ,value};
let items = getLocalStorage();
items.push(grocery);
console.log(items);
localStorage.setItem ("list",JSON.stringify(items));
} ;
//! yerel depodan öğeleri alma işlemi
const getLocalStorage = () => {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
};

//! local storagedan veriyi silme

const removeFromLocalStorage = (id) => {
    // localStorageda bulunan verileri getir
    let items = getLocalStorage();
    // tıkladığım etiketin idsi ile localStorageda ki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar
    items = items.filter((item) => {
      if (item.id !== id) {
        return item;
      }
    });
    console.log(items);
    localStorage.setItem("list", JSON.stringify(items));
  };
  // Yerel depoda update işlemi
  const editLocalStorage = (id, value) => {
    let items = getLocalStorage();
    // yerel depodaki verilerin id ile güncellenecek olan verinin idsi biribirne eşit ise inputa girilen value değişkenini al
    // localStorageda bulunan verinin valuesuna aktar
    items = items.map((item) => {
      if (item.id === id) {
        item.value = value;
      }
      return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
  };
  //! Olay İzleyicileri
  form.addEventListener("submit", addItem);
  clearBtn.addEventListener("click", clearItems);
  window.addEventListener("DOMContentLoaded", setupItems);