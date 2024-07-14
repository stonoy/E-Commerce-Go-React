import axios from 'axios';

// const productionUrl = ' https://strapi-store-server.onrender.com/api';

const productionUrl = '/api/v1';

export const customFetch = axios.create({
  baseURL: productionUrl,
});

export const links = [
  {id: 1, name: "Home", link:"/"},
  {id: 2, name: "Products", link:"/products"},
  {id: 3, name: "About", link:"/about"},
  {id: 4, name: "Cart", link:"/cart"},
  {id: 5, name: "Order", link:"/order"},
  {id: 6, name: "Admin", link:"/admin"},
]

export const getFilterArray = (arr) => {
  return arr.map((item,i) => {
    return {id:i, option:item, isSelected: false}
  })
}

export const addQueryParamsToUrl = (url, state) => {
  let query = ``
  
  for(let key in state){
    // empty search bar and order for now not works
    if ((key === "search" && state[key] === "") || key === "order"){
      // console.log(1)
      continue
    }
    if (key === "search" || key === "price" ){
      // console.log(2)
      query += `&${key}=${state[key]}`
      continue
    }

    state[key].forEach(optionObj => {
      // console.log(3)
      if(optionObj.isSelected){
        query += `&${key}=${optionObj.option}`
      }
    })

  }
  // console.log(url, state)
  let final = `${url}${query}`
  

  return final
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  };
  return date.toLocaleString('en-GB', options);
};