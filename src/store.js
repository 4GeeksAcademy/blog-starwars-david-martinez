export const initialStore = () => {
  return {
    people: [],
    planets: [],
    vehicles: [],
    favorites: [] // Aquí guardaremos los nombres de lo que nos guste
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_people':
      return { ...store, people: action.payload };
    case 'set_planets':
      return { ...store, planets: action.payload };
    case 'set_vehicles':
      return { ...store, vehicles: action.payload };
    
    case 'add_favorite':
      if (store.favorites.includes(action.payload)) return store;
      return { ...store, favorites: [...store.favorites, action.payload] };

    case 'delete_favorite':
      return {
        ...store,
        favorites: store.favorites.filter((item) => item !== action.payload)
      };

    default:
      return store;
  }
}