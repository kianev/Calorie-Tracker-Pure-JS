//Storage controller
const StorageCtrl = (function () {
  return {
    storeItem: function (item) {
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
        items.push(item);

        localStorage.setItem('items', JSON.stringify(items));
      }else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);

        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
     let items = JSON.parse(localStorage.getItem('items'));
     items.forEach((item, index) => {
        if(item.id === updatedItem.id) {
          items.splice(index, 1, updatedItem)
        }
     });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if(item.id === id) {
          items.splice(index, 1,)
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();

//Item controller
const ItemCtrl = (function () {
  //Item constructor
  const Item = function (id, name, calories) {
        this.id = id;
        this.name= name;
        this.calories = calories
  }

  //data structure
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let id;
      if(data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      calories = parseInt(calories);
      newItem = new Item(id, name, calories);
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach(item => {
        total += item.calories;
      })

      data.totalCalories = total;

      return data.totalCalories;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach(item => {
        if(item.id === id) {
          found = item;
        }
      })
      return found;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);
      let found = null;

      data.items.forEach(item => {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      })

      return found;
    },
    deleteItem: function (id) {
     const ids = data.items.map(item => {
       return item.id;
     });

     const index = ids.indexOf(id);
     data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    logData: function () {
      return data;
    }
  }
})();

//UI controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories',
    clearAll: '#clear-btn'
  }

  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>`
      })

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = 'block';
     const li = document.createElement('li');
     li.className = 'collection-item';
     li.id = `item-${item.id}`;
     li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

     document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
    },
    updateListItem: function (item) {
      let listItems = Array.from(document.querySelectorAll(UISelectors.listItems));
      listItems.forEach(listItem => {
        const itemId = listItem.getAttribute('id');

        if(itemId === `item-${item.id}`){
          document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      })

    },
    deleteListItem: function (id) {
      const item = document.querySelector(`#item-${id}`).remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditstate();
    },
    getSelectors: function () {
      return UISelectors;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value
      }
    },
    removeItems: function () {
      Array.from(document.querySelectorAll(UISelectors.listItems)).forEach(item => {
        item.remove();
      });
    },
    showTotalCalories: function (total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditstate: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    }
  }
})();


//App controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    document.addEventListener('keypress', (e) => {
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })

    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    document.querySelector(UISelectors.backBtn).addEventListener('click', itemBackSubmit);
    document.querySelector(UISelectors.clearAll).addEventListener('click', clearAllItemsClick);
  }

  const itemAddSubmit = function (e) {
    const input = UICtrl.getItemInput();
    if(input.name !== '' && input.calories !== ''){
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);

      UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

      UICtrl.clearInput();
    }

    StorageCtrl.storeItem(newItem);
    e.preventDefault();
  }
  
   const itemUpdateSubmit = function (e) {
   const input = UICtrl.getItemInput();
   const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
   UICtrl.updateListItem(updatedItem);

   UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
   UICtrl.clearEditState();

   StorageCtrl.updateItemStorage(updatedItem);

    e.preventDefault();
  }
  
  const itemEditClick = function (e) {
    if(e.target.classList.contains('edit-item')){
     const listId = e.target.parentNode.parentNode.id;
     const listIdArr = listId.split('-');
     const id = parseInt(listIdArr[1]);

     const itemToEdit = ItemCtrl.getItemById(id);
     ItemCtrl.setCurrentItem(itemToEdit);

     UICtrl.addItemToForm();
    }
    e.preventDefault();
  }


  const itemDeleteSubmit = function (e) {
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);

    UICtrl.deleteListItem(currentItem.id);

    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    UICtrl.clearEditState();

    StorageCtrl.deleteItemFromStorage(currentItem.id);

    e.preventDefault();
  }

  const itemBackSubmit = function (e) {
    UICtrl.clearEditState();
    e.preventDefault();
  }

  const clearAllItemsClick = function () {
    ItemCtrl.clearAllItems();
    UICtrl.removeItems();

    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    UICtrl.hideList();

    StorageCtrl.clearItemsFromStorage();
  }
  
  return {
    init: function () {
      UICtrl.clearEditState();
     const itemsFetched = ItemCtrl.getItems();
     if(itemsFetched.length === 0) {
        UICtrl.hideList();
     }else {
       UICtrl.populateItemList(itemsFetched);
     }

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

     loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

//app initialization
App.init();